// 把package发布
const inquirer = require('inquirer');
const  { selectPackage } = require('./utils');
const exec = require('child_process').exec
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');

function execCmd (cmdStr) {
  
  return new Promise((resolve, rejcect) => {
    exec(cmdStr, { encoding: 'utf8' }, function (error, stdout, stderr) {
      error ? rejcect(error) : resolve(stdout)
    })
  })
}
async function publish(package){
  const packageDir = path.resolve(__dirname, `../packages/${package}`);
  const resolve = (file)=>{return path.resolve(packageDir, file);};
  const pagPath = resolve('package.json');
  const pkg = require(pagPath);
  let { packageVersion } = await inquirer.prompt([
    {
      name: 'packageVersion',
      type: 'input',
      message: `请设置package版本(当前版本 ${chalk.yellow(pkg.version)})`,
    }
  ]);
  packageVersion = packageVersion || pkg.version;
  const { check } = await inquirer.prompt([
    {
      name: 'check',
      type: 'list',
      message: `确定要发布 ${chalk.blue(packageVersion)} 版本的 ${chalk.blue(package)} 吗？`,
      choices: [{ name: 'y', value: '1' }, { name: 'n', value: '0' }
      ]
    }
  ]);
  if(Number(check) !==1){
    return;
  }
  pkg.version = packageVersion;
  fs.writeFileSync(pagPath, JSON.stringify(pkg, null, 4), 'utf8');
  const spinner  = ora(`开始发布 ${chalk.blue(`${package}@${packageVersion}`)}`);
  spinner.start();
  try{
    const res = await execCmd(`npm publish ${`./packages/${package}`}`);
    spinner.succeed();
    console.log(chalk.green('发布成功！'))
  }catch(err){
    console.log(err);
    console.log('\n');
    spinner.fail(chalk.red('发布失败：\n'));
  }
}

selectPackage(publish)