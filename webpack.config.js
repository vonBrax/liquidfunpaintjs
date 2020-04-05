const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.ts',
    worker: './src/worker/worker.ts',
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['main'],
      template: 'index.html',
    }),
  ],
  devServer: {
    proxy: {
      '!/src/liquidfun/**': 'http://localhost:5555',
      '!/static/**': 'http://localhost:5555',
    },
  },
};
