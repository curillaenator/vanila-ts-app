const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

require('dotenv').config();

console.table({
  mode: process.env.MODE,
  publicPath: process.env.PUBLIC_PATH,
});

module.exports = {
  mode: process.env.MODE,

  devtool: 'source-map',

  devServer: {
    port: 6060,
    historyApiFallback: true,
  },

  entry: {
    index: { import: './src/index.ts' },
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.[fullhash].js',
    publicPath: process.env.PUBLIC_PATH,
    clean: true,
  },

  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, './src/public'), to: '' }],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
    }),
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
      },
      {
        test: /\.m?(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
      },
      {
        test: /\.(scss|css|sass)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[local]_[hash:base64:12]' },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
