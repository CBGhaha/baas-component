# @youke-web-libs 

课堂组工具类库和组件库


##  开发环境操作流程指南
需要node版本 > 10.17.0 

* 1.yarn --安装依赖
* 2.run dev --启动本地动态编译
* 3.cd 至自己需要开发模块 , yarn link  --创建软链
* 4.到业务项目目录 yarn link packageName(package.json name值) --关联软链
* 5.编写package代码
* 6.编译package
* 7.发布到npm

## 命令行脚本
* 新建自己的npm package：
```node
npm run create
```

* 代码实时编译：
```node
yarn dev / npm run dev
```

* 打包package：
```node
yarn build / npm run build
```
* 发布到npm：
```node
npm run publish
```

##  支持的package类型
* 支持js工具类库
* 支持react组件
* 支持vue2组件
* 支持vue3组件
* 支持node模块

##  支持输出的模块化规范
* ES Modules
* CommonJS
* global (script标签引入)

## 目录结构
```
├── README.md
├── babel.config.js babel // 配置文件
├── package.json
├── .eslintrc
├── tsconfig.json
├── rollup.config.js //rollup配置
├── scripts // 脚本库
│   ├── build.js // 生产编译
│   ├── create.js // 创建package
│   ├── dev.js // 开发实时编译
│   ├── publish.js // 发布npm
│   ├── utils.js // 工具类
| └-- ....
├── packages
└── yarn.lock
```


## 其他 
* package源码支持 Typescript
* 项目包管理采用的是 Monorepo