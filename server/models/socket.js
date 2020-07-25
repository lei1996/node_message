const { Schema, model } = require("mongoose");

// 游客表
const SocketSchema = new Schema({
  /** 创建时间 */
  createTime: { type: Date, default: Date.now },

  /** socket连接id */
  id: {
    type: String,
    unique: true,
    index: true,
  },

  /** ip地址 */
  ip: String,

  /** 系统 */
  os: {
    type: String,
    default: "",
  },

  /** 浏览器 */
  browser: {
    type: String,
    default: "",
  },

  /** 详细环境信息 */
  environment: {
    type: String,
    default: "",
  },
});

// 用户连接设备
const UserConnectSchema = new Schema({
  /** 关联用户id */
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },

  /** 用户id登录的设备 Array */
  connectList: [SocketSchema],
});

/**
 * Socket Model
 * 客户端socket连接信息
 */
const Socket = model("Socket", SocketSchema);

/**
 * UserConnect Model
 * 用户 id 登录过的设备
 * 为了多设备同一账号登录，接收到消息
 */
const UserConnect = model("UserConnect", UserConnectSchema);

/**
 * Add userid to UserConnect.
 * 将用户 socketId 添加到 connectList 列表中
 */
async function addUserSocket(id, socket) {
  const result = UserConnect.findOne({ userId: id });
  if (!result) {
    await UserConnect.create({
      userId: id,
      connectList: [socket],
    });
  }
  result.connectList.push(socket);
  result.save();
}

module.exports = { Socket, UserConnect };
