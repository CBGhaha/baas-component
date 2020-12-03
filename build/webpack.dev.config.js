const webpack = require('webpack');
const path = require('path');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: path.resolve(__dirname, '../render.js'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    chunkFilename: '[name].js', //在entry中未定义的js 一般是动态按需加载时的js
    crossOriginLoading: 'anonymous'
  },
  mode: 'development',
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 2333,
    contentBase: '/',
    historyApiFallback: {
      index: '/'
    },
    // https: true,
    proxy: {
      '/uke-api': {
        target: 'https://uke-gateway-test.zmaxis.com/', // https://uke-gateway-test.zmaxis.com/  https://youke.uat.zmops.cc/uke-api/ https://room.zmyouke.com/uke-api/
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/uke-api': ''
        }
      }
    }
  },
  //代码调试映射模式 (map文件) 用于追踪调试报错和源码位置
  devtool: 'cheap-module-source-map', //---开发环境适合
  module: {
    rules: [
      //编译css/less文件
      {
        test: [/\.css/, /\.less/],
        use: [
          'style-loader', //style-loader将所有的计算后的样式加入页面中
          {
            loader: 'css-loader', //css-loader用于支持css的模块化 可以让css支持import require
            options: {
              minimize: true,
              importLoaders: 2,
              modules: { auto: true }
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
        exclude: /dist|global|node_module/
      },
      {
        test: [/\.css/, /\.less/],
        use: [
          'style-loader', //style-loader将所有的计算后的样式加入页面中'
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
    new webpack.HotModuleReplacementPlugin(), //HMR 模块热替换
    //  自动生成html模板
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../index.html'),
      BASE_URL: './'
    })
  ]
};
module.exports = merge(common, config);
