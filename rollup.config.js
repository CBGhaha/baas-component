// rollup的配置

import jsonPlugin from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve';
import tsPlugin from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import postcssModules from 'postcss-modules';
import nested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import { terser } from 'rollup-plugin-terser';

const path = require('path');
// 根据环境变量中的target属性 获取对应模版中的package.json
const packageDir = path.resolve(__dirname, `./packages/${process.env.TARGET}`);
// console.log('target:', packageDir);
const resolve = (file)=>{return path.resolve(packageDir, file);};

const pkg = require(resolve('package.json'));
const packageName = path.basename(packageDir); //去文件名
// 对打包类型先做一个映射表，根据你提供的formats来格式化需要打包的内容
const outputConfig = {
  'esm-bundler': {
    file: resolve(`./dist/${packageName}.esm-boundle.js`),
    format: 'es'
  },
  'cjs': {
    file: resolve(`./dist/${packageName}.cjs.js`),
    format: 'cjs'
  },
  'global': {
    file: resolve(`./dist/${packageName}.global.js`),
    format: 'iife' // 立即执行函数
  }
};
const { buildOptions: { formats, name } } = pkg ;

function createConfig(format, output) {
  output.name = name;
  output.sourcemap = true;//生成sourcemap
  return {
    input: resolve('./src/index.js'),
    output,
    plugins: [

      jsonPlugin(),
      image(),
      postcss({
        plugins: [
          nested(),
          postcssPresetEnv(),
          cssnano(),
          // require('autoprefixer')({
          //   browsers: ['last 10 versions']
          // }),
          postcssModules()
        ],
        // 处理.css和.less文件
        extensions: ['.css', 'less'],
        modules: true
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        extensions: ['js', 'ts', 'jsx']
      }),
      commonjs(),
      tsPlugin({
        tsconfig: path.resolve(__dirname, './tsconfig.json')
      }),
      resolvePlugin()
      // terser()
    ],
    external: (id, path) => format !== 'global' && /node_modules/.test(path)
  };

}
export default formats.map(format=>createConfig(format, outputConfig[format]));