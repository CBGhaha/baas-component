// 把package打包
const chalk = require('chalk');
const  { selectPackage } = require('./utils');
const execa  = require('execa');// 开启多个子进程打包
const fs = require('fs');

async function build(package){
  await execa('rollup', ['-c', '--environment',`TARGET:${package}`],
    {stdio:'inherit'} // 子进程打包的信息共享给父进程
  )
}
selectPackage(build, true).then(res=>{
  console.log(chalk.green('打包成功'));
}).catch(err=>{
  console.log(chalk.red('打包失败\n'), res);
})