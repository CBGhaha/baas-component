// 把package所有包打包
const fs = require('fs');
// const execa = require('execa');// 开启多个子进程打包
const inquirer = require('inquirer');
const path = require('path');

const packagesPath = path.resolve(__dirname, '../packages');

const packages = fs.readdirSync(packagesPath).filter(dir => {
  return fs.statSync(`${packagesPath}/${dir}`).isDirectory();
});
async function runParallel(packages, iteratorFn) {
  const taskArray = [];
  const { selectPackage } = await inquirer.prompt([
    {
      name: 'selectPackage',
      type: 'list',
      message: '选择你想要操作的package',
      choices: [...packages.map(i => {
        const packageName = path.basename(i);
        return {
          name: packageName, value: i
        };
      }), { name: '全部package', value: 'all' }
      ]
    }
  ]);
  if (selectPackage !== 'all') packages = [selectPackage];
  packages.forEach(item => {
    taskArray.push(iteratorFn(item));
  });
  return Promise.all(taskArray);
}

function selectPackage(exeFn) {
  return runParallel(packages, exeFn);
}

module.exports = {
  selectPackage
};