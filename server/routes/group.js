const assert = require("assert");
const { AssertionError } = require("assert");
const { Types } = require("mongoose");

const { Group } = require("../models/group");
const Socket = require("../models/socket");
const Message = require("../models/message");

const config = require("../config/server");

const { isValid } = Types.ObjectId;

/**
 * 获取指定群组的在线用户辅助方法
 * @param group 群组
 */
async function getGroupOnlineMembersHelper(group) {
  const sockets = await Socket.find(
    { user: group.members },
    {
      os: 1,
      browser: 1,
      environment: 1,
      user: 1,
    }
  ).populate("user", { username: 1, avatar: 1 });
  const filterSockets = sockets.reduce((result, socket) => {
    result.set(socket.user.toString(), socket);
    return result;
  }, new Map());
  return Object.values(filterSockets);
}

/**
 * 创建群组
 * 群组名
 * name: string;
 * @param ctx Context
 */
async function createGroup(ctx) {
  assert(!config.disableCreateGroup, "管理员已关闭创建群组功能");

  const ownGroupCount = await Group.count({ creator: ctx.socket.user });
  assert(
    ownGroupCount < config.maxGroupsCount,
    `创建群组失败, 你已经创建了${config.maxGroupsCount}个群组`
  );

  const { name } = ctx.data;
  assert(name, "群组名不能为空");

  const group = await Group.findOne({ name });
  assert(!group, "该群组已存在");

  let newGroup = null;
  try {
    newGroup = await Group.create({
      name,
      avatar: "",
      creator: ctx.socket.user,
      members: [ctx.socket.user],
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return "群组名包含不支持的字符或者长度超过限制";
    }
    throw err;
  }

  ctx.socket.join(newGroup._id.toString());
  return {
    _id: newGroup._id,
    name: newGroup.name,
    avatar: newGroup.avatar,
    createTime: newGroup.createTime,
    creator: newGroup.creator,
  };
}

/**
 * 加入群组
 * @param ctx Context
 */
async function joinGroup(ctx) {
  const { groupId } = ctx.data;
  assert(isValid(groupId), "无效的群组ID");

  const group = await Group.findOne({ _id: groupId });
  if (!group) {
    throw new AssertionError({ message: "加入群组失败, 群组不存在" });
  }
  assert(group.members.indexOf(ctx.socket.user) === -1, "你已经在群组中");

  group.members.push(ctx.socket.user);
  await group.save();

  const messages = await Message.find(
    { toGroup: groupId },
    {
      type: 1,
      content: 1,
      from: 1,
      createTime: 1,
    },
    { sort: { createTime: -1 }, limit: 3 }
  ).populate("from", { username: 1, avatar: 1 });
  messages.reverse();

  ctx.socket.join(group._id.toString());

  return {
    _id: group._id,
    name: group.name,
    avatar: group.avatar,
    createTime: group.createTime,
    creator: group.creator,
    messages,
  };
}

/**
 * 退出群组
 * @param ctx Context
 */
async function leaveGroup(ctx) {
  const { groupId } = ctx.data;
  assert(isValid(groupId), "无效的群组ID");

  const group = await Group.findOne({ _id: groupId });
  if (!group) {
    throw new AssertionError({ message: "群组不存在" });
  }

  // 默认群组没有creator
  if (group.creator) {
    assert(
      group.creator.toString() !== ctx.socket.user.toString(),
      "群主不可以退出自己创建的群"
    );
  }

  const index = group.members.indexOf(ctx.socket.user);
  assert(index !== -1, "你不在群组中");

  group.members.splice(index, 1);
  await group.save();

  ctx.socket.leave(group._id.toString());

  return {};
}

/**
 * 获取群组在线成员
 * @param ctx Context
 */
async function getGroupOnlineMembers(ctx) {
  const { groupId } = ctx.data;
  assert(isValid(groupId), "无效的群组ID");

  const group = await Group.findOne({ _id: groupId });
  if (!group) {
    throw new AssertionError({ message: "群组不存在" });
  }
  return getGroupOnlineMembersHelper(group);
}

/**
 * 获取默认群组的在线成员
 * 无需登录态
 */
async function getDefaultGroupOnlineMembers() {
  const group = await Group.findOne({ isDefault: true });
  if (!group) {
    throw new AssertionError({ message: "群组不存在" });
  }
  return getGroupOnlineMembersHelper(group);
}

/**
 * 修改群头像, 只有群创建者有权限
 * @param ctx Context
 */
async function changeGroupAvatar(ctx) {
  const { groupId, avatar } = ctx.data;
  assert(isValid(groupId), "无效的群组ID");
  assert(avatar, "头像地址不能为空");

  const group = await Group.findOne({ _id: groupId });
  if (!group) {
    throw new AssertionError({ message: "群组不存在" });
  }
  assert(
    group.creator.toString() === ctx.socket.user.toString(),
    "只有群主才能修改头像"
  );

  await Group.updateOne({ _id: groupId }, { avatar });
  return {};
}

/**
 * 修改群组头像, 只有群创建者有权限
 * @param ctx Context
 */
async function changeGroupName(ctx) {
  const { groupId, name } = ctx.data;
  assert(isValid(groupId), "无效的群组ID");
  assert(name, "群组名称不能为空");

  const group = await Group.findOne({ _id: groupId });
  if (!group) {
    throw new AssertionError({ message: "群组不存在" });
  }
  assert(group.name !== name, "新群组名不能和之前一致");
  assert(
    group.creator.toString() === ctx.socket.user.toString(),
    "只有群主才能修改头像"
  );

  const targetGroup = await Group.findOne({ name });
  assert(!targetGroup, "该群组名已存在");

  await Group.updateOne({ _id: groupId }, { name });

  ctx.socket.to(groupId).emit("changeGroupName", { groupId, name });

  return {};
}

/**
 * 删除群组, 只有群创建者有权限
 * @param ctx Context
 */
async function deleteGroup(ctx) {
  const { groupId } = ctx.data;
  assert(isValid(groupId), "无效的群组ID");

  const group = await Group.findOne({ _id: groupId });
  if (!group) {
    throw new AssertionError({ message: "群组不存在" });
  }
  assert(
    group.creator.toString() === ctx.socket.user.toString(),
    "只有群主才能解散群组"
  );
  assert(group.isDefault !== true, "默认群组不允许解散");

  await group.remove();

  ctx.socket.to(groupId).emit("deleteGroup", { groupId });

  return {};
}

module.exports = {
  createGroup,
  joinGroup,
  leaveGroup,
  getGroupOnlineMembers,
  getDefaultGroupOnlineMembers,
  changeGroupAvatar,
  changeGroupName,
  deleteGroup,
};
