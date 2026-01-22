const path = require('path');

module.exports = {
  entry: './src/wavery.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'wavery.js',
    library: {
      type: 'umd',
      name: 'Wavery'
    },
    globalObject: 'this',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map',
  externals: {
    // Add external dependencies here if needed
  }
};
