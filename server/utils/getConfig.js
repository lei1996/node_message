const args = {};
const { argv } = process;
let argvKey = "";
let argvValue = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("--")) {
    argvKey = argv[i].slice(2);
    argvValue = [];
  } else if (argvKey) {
    let value = argv[i];
    if (value === "true" || value === "false") {
      value = value === "true";
    } else if (/^\d+$/.test(value)) {
      value = parseInt(value, 10);
    }
    argvValue.push(value);
  }
  if (
    argvKey &&
    argvValue.length &&
    (argv[i].startsWith("--") || i === argv.length - 1)
  ) {
    args[argvKey] = argvValue.length > 1 ? argvValue : argvValue[0];
  }
}

const { env } = process;

module.exports = function getConfig(key, defaultValue = "") {
  var _a, _b;
  return (_b =
    (_a = args[key]) !== null && _a !== void 0
      ? _a
      : env[key.slice(0, 1).toUpperCase() + key.slice(1)]) !== null &&
    _b !== void 0
    ? _b
    : defaultValue;
};
