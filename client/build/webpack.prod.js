const webpack = require("webpack");
const path = require("path");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "[name].[contentHash:8].bundle.js",
  },
  optimization: {
    minimize: true,
    minimizer: [
      // 摇树优化去掉console.log
      new TerserPlugin({
        // 将注释从js移除放到另外的文件
        extractComments: true,
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          extractComments: "all",
          compress: {
            drop_console: true,
          },
        },
      }),
      // 压缩css
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true }, // 移除注释
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // 定义了需要被抽离的模块
        vendor: {
          priority: 10,
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          enforce: true,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
});
