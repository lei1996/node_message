const { Schema, model } = require("mongoose");

// 会话列表 可以是 用户 群组 或者系统消息
const ConvSchema = new Schema({
  /** 创建时间 */
  createTime: { type: Date, default: Date.now },

  /** 类型 */
  type: {
    type: String,
    required: true,
    enum: ["User", "Group"],
  },

  // 存了id引用 因为会话类型可以是 好友 || 群组
  // 保存的是 UserId GroupId
  mapId: {
    type: Schema.Types.ObjectId,
    required: true,
    // refPath动态引用
    // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
    // will look at the `onModel` property to find the right model.
    refPath: "type",
  },

  /** 未读消息数 */
  unReadCount: Number,

  /** 最后一条消息的时间 */
  lastMessageTime: { type: Date, default: Date.now },
});

// user的 会话列表
const ConvListSchema = new Schema({
  /** 用户Id */
  userId: {
    type: String,
    index: true,
  },

  /** 会话列表数组存储 id */
  linkman: [
    // {
    //   type: Schema.Types.ObjectId,
    //   ref: "Conv",
    // },
    ConvSchema,
  ],
});

/**
 * ConvList Model
 * 用户会话列表信息
 */
const ConvList = model("ConvList", ConvListSchema);

module.exports = ConvList;
