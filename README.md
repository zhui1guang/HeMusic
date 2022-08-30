# music_manage

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 改进的功能
* 批量删除后刷新页面
* 添加后自动跳转到最后一页
* 改进歌曲播放和暂停的功能
* 添加歌单歌曲增加了曲库中存不存在的判断
 
#  将实现的需求
* 批量增加 用v-for 仿delAll??
** 导入数据表 
** 在歌单歌曲添加歌曲中，歌手名和歌曲采用监听数据库里存在的数据 而不是普通的输入框