
// 格式化消息体
function formatMessage(username, text) {
  return {
    username,
    text,
    time: new Date()
  };
}

module.exports = formatMessage;
