const chai = require("chai");
global.expect = chai.expect;

const Koa = require("koa");
const IO = require("koa-socket-2");

const Socket = require("../models/socket");

const mongoose = require("mongoose");

const connectDB = require("../mongoose");

const config = require("../config/server");

const app = new Koa();

const io = new IO({
  ioOptions: {
    pingTimeout: 10000,
    pingInterval: 5000,
  },
});

// 注入应用
io.attach(app);

before(function () {
  connectDB();
});

after(function () {
  mongoose.connection.close();
});

require("./models/convlist.spec.js");
require("./models/group.spec.js");
require("./models/friend.spec.js");
require("./models/message.spec.js");
require("./models/socket.spec.js");
require("./models/user.spec.js");
