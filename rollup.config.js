// rollup的配置

import jsonPlugin from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve';
import tsPlugin from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import vue from 'rollup-plugin-vue2';
// import vue3 from 'rollup-plugin-vue';
// import postcssModules from 'postcss-modules';
import nested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import { terser } from 'rollup-plugin-terser';

const path = require('path');

// 根据环境变量中的target属性 获取对应模版中的package.json
const packageDir = path.resolve(__dirname, `./packages/${process.env.TARGET}`);

const resolve = (file)=>{return path.resolve(packageDir, file);};

const pkg = require(resolve('package.json'));

// const packageName = path.basename(packageDir); //去文件名

// 对打包类型先做一个映射表，根据你提供的formats来格式化需要打包的内容
const outputConfig = {
  'esm-bundler': {
    file: resolve('./dist/index.esm.js'),
    format: 'es'
  },
  'cjs': {
    file: resolve('./dist/index.cjs.js'),
    format: 'cjs'
  },
  'global': {
    file: resolve('./dist/index.global.js'),
    format: 'iife' // 立即执行函数
  }
};
// return;
let { buildOptions: { formats, name }, devDependencies, dependencies } = pkg;
formats = formats.filter((i)=>{
  return !(process.env.NODE_ENV === 'development' && i === 'global');
});

let extensions = ['react', 'react-dom'];

let vueVersion = '';
[devDependencies, dependencies].forEach(dependent=>{
  try {
    if (dependent) {
      const paks = Object.keys(dependent);
      const vue = paks.find(i=>i === 'vue');
      if (vue) {
        vueVersion = dependent.vue.match(/\d{1}/)[0];
      }
      extensions = [...extensions, ...paks];
    }
  } catch (err) {
    console.log(err);
  }

});

function createConfig(format, output) {
  output.name = name;
  output.sourcemap = true;//生成sourcemap
  return {
    input: resolve('./src/index.js'),
    output,
    plugins: [
      jsonPlugin(),
      image(),
      vueVersion && vue({
        css: true,
        compileTemplate: true
      }),
      postcss({
        plugins: [
          nested(),
          postcssPresetEnv(),
          cssnano()
          // postcssModules()
        ],
        extensions: ['.css', 'less']
        // modules: true
      }),
      babel({
        exclude: '**/node_modules/**',
        runtimeHelpers: true,
        extensions: ['js', 'ts', 'jsx', 'vue']
      }),
      commonjs(),
      tsPlugin({
        tsconfig: path.resolve(__dirname, './tsconfig.json')
      }),
      resolvePlugin(),
      terser()
    ],
    external: format !== 'global' ? extensions : false
  };

}
export default formats.map(format=>createConfig(format, outputConfig[format]));

