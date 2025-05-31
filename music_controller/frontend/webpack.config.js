const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    publicPath: "/static/frontend/",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    minimize: true,
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
};
