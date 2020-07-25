const Koa = require("koa");
const IO = require("koa-socket-2");

const { Socket, UserConnect } = require("./models/socket");

const enhanceContext = require("./middlewares/enhanceContext");
const log = require("./middlewares/log");
const catchError = require("./middlewares/catchError");
const seal = require("./middlewares/seal");
const frequency = require("./middlewares/frequency");
const isLogin = require("./middlewares/isLogin");
const route = require("./middlewares/route");
const isAdmin = require("./middlewares/isAdmin");

const userRoutes = require("./routes/user");
const groupRoutes = require("./routes/group");
const messageRoutes = require("./routes/message");
const qiniuRoutes = require("./routes/qiniu");
const systemRoutes = require("./routes/system");

const app = new Koa();

const io = new IO({
  ioOptions: {
    pingTimeout: 10000,
    pingInterval: 5000,
  },
});

// 注入应用
io.attach(app);

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
  route(app.io, app._io, {
    ...userRoutes,
    ...groupRoutes,
    ...messageRoutes,
    qiniuRoutes,
    ...systemRoutes,
  })
);

io.on("connection", async (socket) => {
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
    // await UserConnect.deleteOne({
    //   userId: socket.id,
    // });

  });
});

module.exports = app;
