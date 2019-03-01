const webpack = require('webpack');
const env = 'dev';
let config = {
  mode: (env === 'dev') ? 'development' : 'production',
  entry: {
    client: './src/index.js',
  },
  target: 'node',
  output: {
    path: __dirname + '/lib',
    publicPath: '/',
    filename: 'htmlincluder.js',
    library: '',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [{
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['env', {
              'targets': {
                'browsers': [
                  '>0.25%',
                  'not ie 11',
                  'not op_mini all',
                ]
              }
            }],
            'es2015',
            'stage-2',
          ],
        }
      },
    ],
  },
};

config.devtool = 'source-map';

module.exports = config;
