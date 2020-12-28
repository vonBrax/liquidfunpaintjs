const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// const WEB_PATH = path.join(__dirname, 'src/web');
// const WORKER_PATH = path.join(__dirname, 'src/worker');
// const COMMON_PATH = path.join(__dirname, 'src/common');

module.exports = {
  mode: 'development',
  entry: {
    // main: path.join(WEB_PATH, 'index.ts'),
    // worker: path.join(WORKER_PATH, 'index.ts'),
    main: path.join(__dirname, 'src/main.ts'),
    // main: {
    //   import: path.join(__dirname, 'src/index.ts'),
    //   dependOn: 'common',
    // },
    // worker: {
    //   import: '@lfpjs/worker',
    //   dependOn: 'common',
    // },
    // common: '@lfpjs/common',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    globalObject: 'typeof self !== "object" ? self : this',
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  // optimization: {
  //   runtimeChunk: 'single',
  // },
  context: __dirname, // to automatically find tsconfig.json
  // devtool: 'eval-cheap-module-source-map',
  devtool: 'eval-cheap-source-map',
  watch: false,
  module: {
    rules: [
      // {
      //   test: /@lfpjs\/worker\/lib\/index\.js$/,
      //   // test: /worker.js$/,
      //   loader: 'worker-loader',
      // },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            projectReferences: true,
            transpileOnly: false,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    // modules: ['node_modules', path.resolve(__dirname)],
    plugins: [new TsconfigPathsPlugin({})],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
    new HtmlWebpackPlugin({
      chunks: ['main'],
      template: './src/index.html',
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    inline: true,
    progress: true,
    compress: true,
    publicPath: '/',
    contentBase: path.join(__dirname, 'static'),
  },
};
