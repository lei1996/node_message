const connectDB = require("./mongoose");
const app = require("./app");

const config = require("./config/server");

const Socket = require("./models/socket");
const { Group } = require("./models/group");

connectDB()
  .then(async () => {
    // 判断默认群是否存在, 不存在就创建一个
    const group = await Group.findOne({ isDefault: true });
    if (!group) {
      const defaultGroup = await Group.create({
        name: config.defaultGroupName,
        avatar:
          "https://cdn.suisuijiang.com/GroupAvatar/5adad39555703565e7903f78_1546952226984",
        isDefault: true,
      });
      if (!defaultGroup) {
        console.error("create default group fail");
        return process.exit(1);
      }
    } else if (group.name !== config.defaultGroupName) {
      group.name = config.defaultGroupName;
      await group.save();
    }

    app.listen(config.port, async () => {
      await Socket.deleteMany({}); // 删除Socket表所有历史数据
      console.log(` >>> server listen on http://localhost:${config.port}`);
    });

    return null;
  })
  .catch((err) => {
    console.error("connect database error!");
    console.error(err);
    return process.exit(1);
  });
