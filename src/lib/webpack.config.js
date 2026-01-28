const path = require("path");

module.exports = [
  {
    entry: "./src/wavery.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "wavery.js",
      library: {
        type: "umd",
        name: "Wavery",
      },
      globalObject: "this",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    devtool: "source-map"
  },
  {
    entry: "./src/wavery.ts",
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: "wavery.js",
      library: {
        type: "umd",
        name: "Wavery",
      },
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    externals: {
      "chroma-js": "chroma-js",
    }
  }
];
