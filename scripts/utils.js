// 把package所有包打包
const fs = require('fs');
// const execa = require('execa');// 开启多个子进程打包
const inquirer = require('inquirer');
const path = require('path');

const packagesPath = path.resolve(__dirname, '../packages');

const packages = fs.readdirSync(packagesPath).filter(dir => {
  return fs.statSync(`${packagesPath}/${dir}`).isDirectory();
});
async function runParallel(packages, iteratorFn, allOption) {
  const taskArray = [];
  const choices = [...packages.map(i => {
    const packageName = path.basename(i);
    return {
      name: packageName, value: i
    };
  })];
  if (allOption) {
    choices.push({ name: '全部package', value: 'all' });
  }
  const { selectPackage } = await inquirer.prompt([
    {
      name: 'selectPackage',
      type: 'list',
      message: '选择你想要操作的package',
      choices
    }
  ]);

  if (selectPackage !== 'all') packages = [selectPackage];
  packages.forEach(item => {
    taskArray.push(iteratorFn(item));
  });
  return Promise.all(taskArray);
}

function selectPackage(exeFn, allOption) {
  return runParallel(packages, exeFn, allOption);
}

module.exports = {
  selectPackage
};