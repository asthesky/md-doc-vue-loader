const loaderUtils = require("loader-utils");
const Parser = require("./src/index");

module.exports = function(source) {
  this.cacheable && this.cacheable();
  const options = loaderUtils.getOptions(this);
  return new Parser(options).parseCode(source);
};
