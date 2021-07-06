var webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');

const proConfig = {
  //配置模块的读取和解析规则
  mode: 'production',
  entry: path.resolve(__dirname, '../react'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    chunkFilename: '[name].js', //在entry中未定义的js 一般是动态按需加载时的js
    crossOriginLoading: 'anonymous',
    library: 'myPlay',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      //编译css/less文件
      {
        test: [/\.css/, /\.less/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          // 'style-loader', //style-loader将所有的计算后的样式加入页面中
          {
            loader: 'css-loader', //css-loader用于支持css的模块化 可以让css支持import require
            options: {
              minimize: true,
              modules: false
            }
          },
          {
            loader: 'postcss-loader', //css兼容性前缀
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 10 versions']
                })
              ]
            }
          },
          'less-loader'
        ],
        exclude: /node_module|dist|global/
      },
      {
        test: [/\.css/, /\.less/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader', //css-loader用于支持css的模块化 可以让css支持import require
            options: {
              minimize: true,
              modules: false
            }
          },
          'less-loader',
          {
            loader: 'postcss-loader', //css兼容性前缀
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 10 versions']
                })
              ]
            }
          }
        ],
        include: /global|node_module|dist/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['./dist'], { root: path.resolve() }), //每次编译 清空dist文件夹
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    })
  ]
};
module.exports = function(config = {}) {
  return merge(merge(common, proConfig), config);
};

