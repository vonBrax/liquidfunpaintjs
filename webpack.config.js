const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const WEB_PATH = path.join(__dirname, 'src/web');
const WORKER_PATH = path.join(__dirname, 'src/worker');
// const COMMON_PATH = path.join(__dirname, 'src/common');

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
        exclude: /node_modules/,
        options: {
          projectReferences: true,
        },
      },
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
      //   include: [WORKER_PATH],
      //   loader: 'ts-loader',
      //   options: {
      //     instance: 'worker',
      //     configFile: path.join(WORKER_PATH, 'tsconfig.json'),
      //   },
      // },
      // {
      //   test: /\.tsx?$/,
      //   include: [COMMON_PATH],
      //   loader: 'ts-loader',
      //   options: {
      //     instance: 'other',
      //     configFile: path.join(COMMON_PATH, 'tsconfig.json'),
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
