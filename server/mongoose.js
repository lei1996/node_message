/**
 * 连接 MongoDB
 */

const mongoose = require("mongoose");

const config = require("./config/server");

mongoose.Promise = Promise;
mongoose.set("useCreateIndex", true);

module.exports = function connectDB() {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      config.database,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};
