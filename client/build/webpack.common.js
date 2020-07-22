const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const dev = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    // 入口
    app: "./src/index.js",
  },
  module: {
    rules: [
      {
        // 如果是js 文件 通过 babel 转成可以识别的对象
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "linaria/loader",
            options: {
              sourceMap: dev,
            },
          },
        ],
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader']
      // }
      // {
      //   test: /\.scss$/,
      //   use: ['style-loader', 'css-loader', 'sass-loader']
      // }
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: dev,
            },
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: dev,
            },
          },
        ],
      },
      // 处理图片资源的 loader
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: path.posix.join("", "img/[name].[hash:8].[ext]"),
              limit: 4000,
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: path.posix.join("", "media/[name].[hash:8].[ext]"),
              limit: 5000,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: path.posix.join("", "fonts/[name].[hash:8].[ext]"),
              limit: 5000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
    // 注入环境变量 dev prod test
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify(process.env.NODE_ENV) },
    }),
    // index.html 注入 js 和 css
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../public/index.html"),
    }),
    // linaria 生成的 css file
    new MiniCssExtractPlugin({ filename: "[name].css" }),
  ],
  output: {
    filename: "[name]-[hash:8].js",
    path: path.resolve(__dirname, "../dist"),
  },
};
