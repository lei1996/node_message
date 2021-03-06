function noop() {}

/**
 * 路由处理
 * @param io koa socket io实例
 * @param _io socket.io 实例
 * @param routes 路由
 */
module.exports = function route(io, _io, routes) {
  // 注册事件, 不然该接口是不走所有中间件的
  Object.keys(routes).forEach((routeName) => {
    io.on(routeName, noop);
  });

  return async (ctx) => {
    if (routes[ctx.event]) {
      const { event, data, socket } = ctx;
      ctx.res = await routes[ctx.event]({
        event, // 事件名
        data, // 请求数据
        socket, // 用户socket实例
        io, // koa-socket实例
        _io, // socket.io实例
      });
    }
  };
};
