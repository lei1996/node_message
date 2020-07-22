const { Schema, model } = require("mongoose");

// 好友列表应该是存一个id 然后绑对应的 好友列表
const FriendSchema = new Schema({
  /** 创建时间 */
  createTime: { type: Date, default: Date.now },

  /** 用户id 某个用户的好友列表查询 */
  userId: {
    type: String,
    index: true,
  },

  /** 好友列表 存储 FriendSchema 数组 */
  friendList: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

/**
 * Firend Model
 * 好友信息
 */
const Friend = model("Friend", FriendSchema);

module.exports = Friend;
