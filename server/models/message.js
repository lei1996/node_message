const { Schema, model } = require("mongoose");

// 消息基 schema
const MessageSchema = new Schema({
  /** 创建时间 */
  createTime: { type: Date, default: Date.now, index: true },

  /** 发送人 */
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  /** 接受者, 发送给群时为群_id, 发送给个人时为俩人的_id按大小序拼接后值 */
  to: {
    type: String,
    index: true,
  },

  /** 类型, text: 文本消息, image: 图片消息, code: 代码消息, invite: 邀请加群消息, system: 系统消息 */
  type: {
    type: String,
    enum: ["text", "image", "code", "invite", "system"],
    default: "text",
  },

  /** 内容, 某些消息类型会存成JSON */
  content: {
    type: String,
    default: "",
  },
});

// 消息列表
const MessageListSchema = new Schema({
  /** 会话id 用于映射查询 */
  ConverId: {
    type: String,
    index: true,
  },

  /** 消息列表 存储 MessageSchema 数组 */
  messageList: [MessageSchema],
});

// 创建方式
// const User = mongoose.model('MessageList', MessageListSchema);
// // Map { 'github' => 'vkarpov15', 'twitter' => '@code_barbarian' }
// console.log(new User({
//   message: {
//     github: 'vkarpov15',
//     twitter: '@code_barbarian'
//   }
// }).socialMediaHandles);

/**
 * Message Model
 * 聊天消息
 */
const MessageList = model("MessageList", MessageListSchema);

module.exports = MessageList;
