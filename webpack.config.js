const webpack = require('webpack');
const env = 'production';
let config = {
  mode: (env === 'dev') ? 'development' : 'production',
  entry: './src/index.js',
  target: 'node',
  output: {
    path: __dirname + '/lib',
    publicPath: '/',
    filename: 'htmlincluder.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ],
  },
};

config.devtool = 'source-map';

module.exports = config;
