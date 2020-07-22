const assert = require("assert");

/**
 * 全局异常捕获
 * 如果是通过 assert 主动抛出的异常, 则向客户端返回该异常消息
 * 如果是其它异常, 则打印异常信息, 并返回 Server Error
 */
module.exports = function catchError() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof assert.AssertionError) {
        ctx.res = err.message;
        return;
      }
      ctx.res = `Server Error: ${err.message}`;
      console.error("Unhandled Error\n", err);
    }
  };
};
