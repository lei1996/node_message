/**
 * 增强context对象
 * 通过 socket 的 acknowledge 回调方法, 将 ctx.res 的数据返回给客户端
 */
module.exports = function enhanceContext() {
  return async (ctx, next) => {
    await next();
    if (ctx.acknowledge) {
      ctx.acknowledge(ctx.res);
    }
  };
}
