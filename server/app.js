const Koa = require("koa");
const IO = require("koa-socket-2");

const Socket = require("./models/socket");

const app = new Koa();

const io = new IO({
  ioOptions: {
    pingTimeout: 10000,
    pingInterval: 5000,
  },
});

if (process.env.NODE_ENV === "production" && config.allowOrigin) {
  // @ts-ignore
  app._io.origins(config.allowOrigin);
}

// 中间件
io.use(enhanceContext());
io.use(log());
io.use(catchError());
io.use(seal());
io.use(frequency());
io.use(isLogin());
io.use(isAdmin());
io.use(
  route(
    // @ts-ignore
    app.io,
    // @ts-ignore
    app._io,
    {
      // ...userRoutes,
      // ...groupRoutes,
      // ...messageRoutes,
      // ...qiniuRoutes,
      // ...systemRoutes,
    }
  )
);

app.io.on("connection", async (socket) => {
  socket.ip =
    socket.handshake.headers["x-real-ip"] ||
    socket.request.connection.remoteAddress;
  console.log(`  <<<< connection ${socket.id} ${socket.ip}`);
  await Socket.create({
    id: socket.id,
    ip: socket.ip,
  });

  socket.on("disconnect", async () => {
    console.log(`  >>>> disconnect ${socket.id}`);
    await Socket.deleteOne({
      id: socket.id,
    });
  });
});

module.exports = app;
