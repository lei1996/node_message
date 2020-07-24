const ip = require("ip");
const options = require("../utils/commandOptions");
const getConfig = require("../utils/getConfig");

const { env } = process;

module.exports = {
  /** 服务端host, 默认为本机ip地址(可能会是局域网地址) */
  host: options.host || env.Host || ip.address(),

  // service port
  port: options.port || env.Port || 9200,

  // mongodb address
  database:
    options.database || env.Database || "mongodb://localhost:27017/darius",

  // jwt encryption secret
  jwtSecret: options.jwtSecret || env.JwtSecret || "jwtSecret",

  // Maximize the number of groups
  maxGroupsCount: 3,

  // qiniu config
  qiniuAccessKey: options.qiniuAccessKey || env.QiniuAccessKey || "",
  qiniuSecretKey: options.qiniuSecretKey || env.QiniuSecretKey || "",
  qiniuBucket: options.qiniuBucket || env.QiniuBucket || "",
  qiniuUrlPrefix: options.qiniuUrlPrefix || env.QiniuUrlPrefix || "",

  allowOrigin: options.allowOrigin || env.AllowOrigin,

  // token expires time
  tokenExpiresTime: 1000 * 60 * 60 * 24 * 30,

  // administrator user id
  administrator: options.administrator || env.Administrator || "",

  // default group name
  defaultGroupName: "darius",

  /** 禁用注册功能 */
  disableRegister: false,

  /** disable user create new group */
  disableCreateGroup: getConfig("disableCreateGroup", false),
};
