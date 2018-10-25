var path = require('path');

module.exports = {
  entry: './src/index.js',
  optimization: {
    minimize: false // disable minimazation since it's a library
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'highlighter.js',
    library: 'highlighter',
    libraryTarget: 'umd'
  },
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    }
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        enforce: "pre",
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "tslint-loader"
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/typescript',
              ['@babel/env', {useBuiltIns: 'usage'}]
            ],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties',
            ]
          }
        }
      }
    ]
  }
};
