/** 封禁后提示文案 */
const SealText = "你已经被关进小黑屋中, 请反思后再试";

/** 封禁用户释放时间 */
const SealUserTimeout = 1000 * 60 * 10; // 10分钟

/** 封禁ip释放时间 */
const SealIpTimeout = 1000 * 60 * 60 * 6; // 6小时

/** 透明图 */
const transparentImage =
  "data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==";

/** 加密salt位数 */
const saltRounds = 10;

module.exports = {
  SealText,
  SealUserTimeout,
  SealIpTimeout,
  transparentImage,
  saltRounds,
};
