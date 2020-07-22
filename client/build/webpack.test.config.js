const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "test",
  // devtool: config.build.productionSourceMap ? '#source-map' : false,
  devtool: '#source-map',
  optimization: {
    sideEffects: true,
    minimize: true, //Update this to true or false
  },
});
