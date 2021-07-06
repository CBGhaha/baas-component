// 把package打包
const  { selectPackage } = require('./utils');
const execa  = require('execa');// 开启多个子进程打包

async function build(package){
  await execa('rollup', ['-c', '--environment',`TARGET:${package}`],
    {stdio:'inherit'} // 子进程打包的信息共享给父进程
  )
}

selectPackage(build)