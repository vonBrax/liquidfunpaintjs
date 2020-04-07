const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const SRC_PATH = path.join(__dirname, 'src');
const WEB_PATH = path.join(__dirname, 'src/web');
const WORKER_PATH = path.join(__dirname, 'src/worker');
// const UTIL_PATH = path.join(__dirname, 'src/util');

module.exports = {
  mode: 'development',
  entry: {
    main: path.join(WEB_PATH, 'index.ts'),
    worker: path.join(WORKER_PATH, 'worker.ts'),
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: require.resolve('ts-loader'),
        // options: {
        //   transpileOnly: true,
        // },
        exclude: /node_modules/,
      },
      // {
      //   test: /\.tsx?$/,
      //   include: [WORKER_PATH],
      //   loader: 'ts-loader',
      //   options: {
      //     instance: 'worker',
      //     configFile: path.join(WORKER_PATH, 'tsconfig.json'),
      //   },
      // },
      // {
      //   test: /\.tsx?$/,
      //   include: [WEB_PATH],
      //   // exclude: [/node_modules/, SRC_PATH],
      //   loader: 'ts-loader',
      //   options: {
      //     instance: 'web',
      //     configFile: path.join(WEB_PATH, 'tsconfig.json'),
      //   },
      // },
      // {
      //   test: /\.tsx?$/,
      //   include: [UTIL_PATH],
      //   loader: 'ts-loader',
      //   options: {
      //     instance: 'other',
      //     configFile: path.join(__dirname, 'tsconfig.json'),
      //   },
      // },
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
