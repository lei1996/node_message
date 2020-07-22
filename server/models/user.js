const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  /** 创建时间 */
  createTime: { type: Date, default: Date.now },

  /** 最后登录时间 */
  lastLoginTime: { type: Date, default: Date.now },

  /** 用户名 */
  username: {
    type: String,
    trim: true,
    unique: true,
    match: /^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]){1,8}$/,
    index: true,
  },

  /** 密码加密盐 */
  salt: String,

  /** 加密的密码 */
  password: String,

  /** 头像 */
  avatar: String,

  /** 用户标签 */
  tag: {
    type: String,
    default: "",
    trim: true,
    match: /^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]){1,5}$/,
  },

  /** 表情收藏 */
  expressions: [
    {
      type: String,
    },
  ],
});

/**
 * User Model
 * 用户信息
 */
const User = model("User", UserSchema);

module.exports = User;
