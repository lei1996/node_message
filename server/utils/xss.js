const xss = require("xss");

const myXss = new xss.FilterXSS({
  whiteList: {},
});

/**
 * xss防护
 * @param text 要处理的文字
 */
module.exports = function processXss(text) {
  return myXss.process(text);
};
