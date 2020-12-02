const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const config = {
  //配置模块的读取和解析规则
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
        // exclude: path.resolve(__dirname, './node_module')

      },
      //支持图片  import
      {
        test: /\.(png|jsp|gif|ttf|woff|eot|svg|svga)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              query: {
                limit: 8192
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    //设置文件夹别名
    alias: {
      '@': path.resolve(__dirname, '../react'),
      components: path.resolve(__dirname, '../react/components') //匹配路径components
    },
    extensions: ['.js', '.less', '.json', '.jsx', 'css'],
    modules: ['node_modules']
  },
  plugins: [
    new Dotenv({
      path: path.join(__dirname, `../env/.env.${process.env.BUILD_ENV}`)
    }),
    new CopyPlugin([
      {
        from: 'public/*',
        to: path.resolve('./dist/'),
        flatten: true
      }
    ]),
    new CopyPlugin([
      {
        from: path.resolve('./react'),
        to: path.resolve('./dist/react'),
        toType: 'dir'
      }
    ])
  ],

  target: 'web',
  externals: {
    // 把导入语句里的 jquery 替换成运行环境里的全局变量 jQuery
    jQuery: 'jQuery'
  }
};
module.exports = config;
