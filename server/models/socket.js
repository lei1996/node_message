import { Schema, model, Document } from "mongoose";

const SocketSchema = new Schema({
  /** 创建时间 */
  createTime: { type: Date, default: Date.now },

  /** socket连接id */
  id: {
    type: String,
    unique: true,
    index: true,
  },

  /** 关联用户id */
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
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

/**
 * Socket Model
 * 客户端socket连接信息
 */
const Socket = model("Socket", SocketSchema);

export default Socket;
