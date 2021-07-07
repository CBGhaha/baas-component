const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const packageTemplateCreator = (name)=>({
  'name': `@youke-web-libs/${name}`,
  'version': '1.0.0',
  'main': 'dist/index.cjs.js',
  'module': 'dist/index.esm.js',
  'license': 'ISC',
  'author': '',
  'description': '',
  'dependencies': {
  },
  'devDependencies': {
  },
  'buildOptions': {
    'name': `youke${name.split('-').reduce((sum, i)=>{
      return sum + i.replace(/^[a-z]/, i=>i.toUpperCase());
    }, '')}`,
    'formats': [
      'esm-bundler',
      'global'
    ]
  }
});

async function create() {
  const { packageName } = await inquirer.prompt([
    {
      name: 'packageName',
      type: 'input',
      message: '请输入package的名称'
    }
  ]);
  const packagePath = path.resolve(__dirname, `../packages/${packageName}`);
  const dirExist = fs.existsSync(packagePath);
  if (dirExist) {
    console.log(chalk.red('package已存在，请重试！'));
    return;
  }

  fs.mkdirSync(packagePath);
  fs.mkdirSync(`${packagePath}/src`);
  fs.writeFileSync(`${packagePath}/src/index.js`, '', 'utf8');
  const packageJson = packageTemplateCreator(packageName);
  fs.writeFileSync(`${packagePath}/package.json`, JSON.stringify(packageJson, null, 4), 'utf8');
  console.log(chalk.green('创建成功成功！'));
}

create();