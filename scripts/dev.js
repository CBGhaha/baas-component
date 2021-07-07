// 只针对具体的某个模块打包// 把package所有包打包
// const fs = require('fs');
const chalk = require('chalk');
const  { selectPackage } = require('./utils');
const execa  = require('execa');// 开启多个子进程打包

async function build(package){
  await execa('rollup', ['-cw', '--environment',`TARGET:${package}`],
    {stdio:'inherit'} // 子进程打包的信息共享给父进程
  )
}
selectPackage(build)

// const execa = require('execa');// 开启多个子进程打包
// const rollup = require('rollup');
// const path = require('path');

// const packagesPath = path.resolve(__dirname, '../packages');
// const packages = fs.readdirSync(packagesPath).filter(dir => {
//   return fs.statSync(`${packagesPath}/${dir}`).isDirectory();
// });

// function runParallel(packages, iteratorFn) {
//   const taskArray = [];
//   packages.forEach(item => {
//     taskArray.push(iteratorFn(item));
//   });
//   return Promise.all(taskArray);
// }
// const $package = 'runtime-dom';

// build($package);

// async function build(package_) {
//   await execa('rollup', ['-cw', '--environment', `TARGET:${package_}`],
//     { stdio: 'inherit' } // 子进程打包的信息共享给父进程
//   );
// }
// // runParallel(packages, build).then(res => {

// })