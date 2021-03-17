### 源码位置：./react

###发布npm包步骤：
> - 1、修改config中package.json中的版本号（version）
> - 2、npm run build
> - 3、npm run publish

### 使用方法：
> #### 非react项目使用 
>      import Player from '@zm-youke/couserware-player';
>      import '@zm-youke/couserware-player/main.css';
> #### react项目
>      import Player from '@zm-youke/couserware-player/react';


send: 
getCoursewareList  获取课件
zmlCoursePageTotal zml总页数
zmlLoadfail  zml加载失败


receive： 
COURSE_EVENT  设置课件的id 和 page
PALETTE_EVENT 老师设置画笔教具



"controllerChange" zmg控制权切换
