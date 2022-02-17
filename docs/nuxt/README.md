# nuxt 初识
「这是我参与2022首次更文挑战的第4天，活动详情查看：[2022首次更文挑战](https://juejin.cn/post/7052884569032392740 "https://juejin.cn/post/7052884569032392740")」

`nuxt`是一个基于`Vue`的服务端渲染框架；该框架集成了`Vue2`, `Vue-Router`,` Vuex`, `Vue`服务端渲染，`Vue-Meta`.
这篇文章是我自己在开发`nuxt`应用过程中记录的一些tip，以及学习记录，主要内容为`nuxt.config.js`的配置
## 一、`nuxt.config.js`的配置
1. `css`: 用于定义页面的全局样式，如果引入的`sass`，需要安装`node-sass`和`sass-loader`
```js
    css: [
        'assets/scss/all.scss'
     ],
```
2. `dev`: 官网表示该项用来配置 `Nuxt.js` 应用是开发模式还是生产模式，我这边开发的项目都是多于2个模式的，运行模式通过`package.json`文件来配置，不同模式对应的接口环境通过`.env`，`.env.production`来配置
```json
 "scripts": {
    "dev": "cross-env NODE_ENV=development nuxt",
    "test": "cross-env NODE_ENV=test nuxt",
    "prod": "cross-env NODE_ENV=production nuxt",
    "build": "cross-env NODE_ENV=production nuxt build --dotenv .env.production",
    "start": "cross-env NODE_ENV=production nuxt --dotenv .env.production",
    "generate": "cross-env NODE_ENV=production nuxt generate",
  },
```
3. `env`：环境变量配置，作用于客户端和服务端，配置完成后，在页面也可通过`process.env.XXX`来获取配置信息
```js
    env: {
        NODE_ENV: process.env.NODE_ENV,
        VUE_APP_BASE_URL: process.env.VUE_APP_BASE_URL,
        VUE_APP_BASE_PORT: process.env.VUE_APP_BASE_PORT
    },
```
4. `generate`: 配置生成静态站点的具体方法
5. `head`：用于配置`meta`信息（`TDK`），也可以用来配置全局引用的`css`、`js`文件
```js
    head: {
        title: 'name',
        htmlAttrs: {
          lang: 'zh-CN'
        },
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no' },
          { hid: 'description', name: 'description', content: '' }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
          { rel: 'stylesheet', type: 'text/css', href: '/bootstrap/bootstrap.min.css' }
        ],
        script: [
          { src: '/jquery2.1.1/jquery.min.js' },
          { src: '/bootstrap/bootstrap.min.js' }
        ]
      },
```
6. `loading`: 用于配置路由切换时的加载样式，支持自定义组件
```js
  // 默认为顶部的进度条，可修改颜色
  // loading: {
  //   color: rgb(112, 79, 160)
  // },
  // 自定义进度条样式，引入组件即可
  loading: '~/components/common/loading.vue',
```
7. `modules`： 用于扩展模块，模块的引入是按照顺序执行的，官方也提供了[数十个生产模块](https://github.com/nuxt-community/awesome-nuxt#modules)，下面示例中，引用了`nuxt-precompress`，用于压缩代码，该插件不是必需的，若`ng`也配置了压缩，这边可以不需要配置，配置方法具体查看`webpack`官网
```js
  modules: [
    // 配置压缩代码
    'nuxt-precompress',
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/proxy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  // 代码压缩配置、也可在nginx中配置，ng若配置了，这边不需要重复配置
  nuxtPrecompress: {
    enabled: true,
    report: false,
    test: /\.(js|css|html|txt|xml|svg)$/, 

    middleware: {
      enabled: true,
      enabledStatic: true,
      encodingsPriority: ['br', 'gzip']
    },
    gzip: {
      enabled: true,
      filename: '[path].gz[query]', 
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: { level: 9 }
    },
    brotli: {
      enabled: true,
      filename: '[path].br[query]',
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8
    }
  },
```
8. `modulesDir`: 用于配置路径解析的模块目录，默认为`['node_modules']`；一般开发过程中不需要更改。
9. `plugins`：用于定义应用实例化之前需要运行的插件；`src`表示引入文件的路径，`ssr`表示是否在服务端引入使用，默认为`true`。我在项目中，**把需要引入的插件分为两类，一类是只在客户端运行（该类型的插件一般依赖于`windows`对象等在服务端不存在的对象）（`ssr: false`)，一类是客户端+服务端都需要运行的(`ssr: true`)**。
```js
plugins: [
    { src: '~/plugins/common.js', ssr: true }, // 全局配置入口，该文件中的配置在服务端也生效
    { src: '~/plugins/commonWithoutSSR.js', ssr: false }, // 全局配置入口，该文件中的配置只在客户端生效
    { src: '~/plugins/initial.css', ssr: true }, // 样式文件
    { src: '~/plugins/lib/util', ssr: true }, // 用于注册公用方法
    { src: '~/plugins/lib/protoFun', ssr: true } // 用于增加原型方法
  ],
```
例，`common.js`文件内容为：
```js
    import Vue from 'vue'
    // 全局引入cookie操作包
    import Cookies from 'js-cookie'
    Vue.prototype.$cookies = Cookies
```

10. `server`：用于定义服务器的主机和端口
```js
// 配置服务启动的端口号和IP访问形式
server: {
    port: '50913',
    host: '0.0.0.0'
},
```
11. `build`: 构建配置
```js
const webpack = require('webpack')
// 引入代码压缩工具包, 官方文档在：https://www.webpackjs.com/plugins/compression-webpack-plugin/
const CompressionPlugin = require('compression-webpack-plugin')
build: {
    analyse: true, // 对构建后的打包文件启用分析
    plugins: [
       // 配置webpack插件实现代码压缩
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/, // 匹配文件名
        threshold: 10240, // 对超过10kb的数据进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      })
    ],
    // 配置分割打包，nuxt自带的，也可以指定用插件包来实现压缩，配置了切片后，在nuxt应用加载时通过控制台可观察到，大文件会被切片成几分来分开加载~（需要配置http2)
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    },
    vendor: ['axios'],
    // md文件编辑器： 去掉这个的话，会报无法引入外部资源的错
    transpile: ['vue-meditor'],
    cache: true
  }
```
12. `rootDir`: 配置`nuxt.js`应用的根目录，一般情况不修改，[官方文档](https://www.nuxtjs.cn/api/configuration-rootdir)
13. `router`: nuxt框架已自动引入vue-router,无特殊情况不需要修改此配置，[官方文档](https://www.nuxtjs.cn/api/configuration-router)

## 二、其余的小tip
1. `nuxt`内存溢出问题：`nuxt`是个基于`Vue.js`的服务端渲染框架，所需内存消耗会比单纯用`vue`的大，更容易出现内存溢出问题。**该问题的解决方法是：项目部署时，服务端需要装`pm2`，用于当内存不够用时自动重启，释放内存。**
2. 引入外部插件方法有所不同：因为`nuxt`是在服务端渲染之后返回给客户端，所以需要考虑下插件运行是否依赖于只存在于客户端的对象，如`windows`对象；**若遇到这种情况，开发过程中要分类好，不同环境加载不同的包，且特殊的插件在打包时需要配置构建参数。如`vue-meditor` `md`编辑器的引入方法，如下**
```javascript
     export default {
       build: {
        vendor: ['axios'],
         // md文件编辑器： 去掉这个的话，会报无法引入外部资源的错
        transpile: ['vue-meditor']
       }
     }
 ```
3. `nuxt`生命周期有时候执行了两次：很诡异的问题，当时页面中用了`v-if`，**换成`v-show`之后就不会出现该问题了**。
4. `nuxt`生命周期跟`vue`有所不同，这个，下篇文章在写了~~

    