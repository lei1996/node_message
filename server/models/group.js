const { Schema, model } = require("mongoose");

// 群组
const GroupSchema = new Schema({
  /** 创建时间 */
  createTime: { type: Date, default: Date.now },

  /** 名称 */
  name: {
    type: String,
    trim: true,
    unique: true,
    match: /^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]){1,8}$/,
    index: true,
  },

  /** 头像 */
  avatar: String,

  /** 公告 */
  announcement: {
    type: String,
    default: "",
  },

  /** 创建者 */
  creator: {
    type: Schema.Types.ObjectId,
    // 看需要是否 返回 user 对象 还是返回 userId
    // ref: "User",
  },

  /** 成员
   * 成员只记录id, 拿的时候返回数组
   */
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// 用户群组列表
const GroupListSchema = new Schema({
  /** 用户id 某个用户的群组列表查询 */
  userId: {
    type: String,
    index: true,
  },

  /** 用户的群组列表 存储 Schema 数组 */
  groupList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
});

/**
 * Group Model
 * 群组信息
 */
const Group = model("Group", GroupSchema);

/**
 * Group Model
 * 用户群组列表
 */
const GroupList = model("GroupList", GroupListSchema);

module.exports = { Group, GroupList };
