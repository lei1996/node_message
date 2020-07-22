const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "#cheap-module-eval-source-map",
  // 入口文件
  devServer: {
    // dev 开发模式导入public 目录下的文件
    contentBase: path.join(__dirname, "public"),
    historyApiFallback: true,
    publicPath: "/", // 访问资源加前缀
    proxy: {
      // 接口请求代理
      '/api': {
        // target: 'http://test.admin.hkgc1688.com/api',
        target: '//localhost:9200',
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
    hot: true,
    contentBase: false, // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
    compress: true, // 一切服务都启用gzip 压缩：
  },
});
