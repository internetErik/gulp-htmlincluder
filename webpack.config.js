const webpack = require('webpack');

let config = {
  entry: {
    client: './src/index.js',
  },
  output: {
    path: __dirname + '/lib',
    publicPath: '/',
    filename: 'htmlincluder.js',
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [],
          presets: [ 'env' ],
        }
      },
    ],
  },
};

config.devtool = 'source-map';

module.exports = config;
