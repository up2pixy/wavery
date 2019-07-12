var path = require("path");
var webpack = require("webpack");

module.exports = {
  target: "web",
  entry: "./lib/wavery.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "wavery.min.js",
    library: "Wavery",
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "eslint-loader",
        exclude: /node_modules/,
        options: {
          emitWarning: true,
          configFile: "./.eslintrc.json"
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: "source-map"
};
