/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");

module.exports = {
  mode: "production",
  entry: "./lib/wavery.ts",
  target: "web",
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
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.tsx?$/,
        enforce: "pre",
        loader: "eslint-loader",
        exclude: /node_modules/,
        options: {
          emitWarning: true,
          configFile: "./.eslintrc.json"
        }
      },
      {
        test: /\.tsx?$/,
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
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist")
  }
};
