---
theme: scrolls-light
highlight: ascetic
---

该框架基于`vue3`+`vite2`，配置了`element-plus`+`vue-router`+`sass`+`vuex`，后续还会继续完善~

# 一、初始化

1. 按照[官方文档](https://v3.cn.vuejs.org/)的步骤，我这里是用`vite`来构建项目，且本地`npm`版本为 7+，使用命令`npm init vite@latest vue3-pc -- --template vue`初始化一个命名为 vue3-pc 的项目
2. `npm i` 以及 `npm run dev` 就可将项目跑起来，如下图：
   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/871a068de63b427a84465a5df4a9a51e~tplv-k3u1fbpfcp-watermark.image?)

# 二、引入 element-plus UI

1. 使用命令行安装`element-plus`: `cnpm i --save elemnt-plus`;
2. 全局引入`element-plus`：进入`main.js`中，引入`element-plus`，按照官方说的引用`element`的`css`文件是这么写的：`import 'element-plus/theme-chalk/lib/index.css'`，但是报错，看了下`node_modules`中，发现`theme-chalk`文件夹是直接放在`element-plus`目录下的，不是在`lib`中

   ```js
   import { createApp } from "vue";
   import App from "./App.vue";
   const app = createApp(App);

   import ElementPlus from "element-plus";
   import "element-plus/theme-chalk/index.css";
   app.use(ElementPlus);

   app.mount("#app");
   ```

   按照上面的引入之后，页面中就可正常使用了，如下：

   ```html
   <template>
     <h1>{{ msg }}</h1>
     <el-button type="primary" @click="count++"
       >count is: {{ count }}</el-button
     >
   </template>
   ```

   运行后打开页面可看到效果
   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93d6c588fc72437d8549129e7f6b9455~tplv-k3u1fbpfcp-watermark.image?)

3. 测试构建：运行`vite build`脚本，成功打包生成`dist`文件夹，进入`dist`中，用`hs`模拟启动，启动成功，如下图
   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/491160849d8647d8bf4166b44234259d~tplv-k3u1fbpfcp-watermark.image?)
   打开 IP 地址，也可正常访问到
   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/408304af228042768a715686fc4c4925~tplv-k3u1fbpfcp-watermark.image?)

# 三、引入 sass

1. 依次安装`node-sass`: `cnpm i node-sass --save-dev`，`sass`: `cnpm i sass --save-dev`，一个一个安装太慢了，后面几个我是一次性安装上去的：`cnpm i sass-loader style-loader style-resources-loader --save-dev`
2. 上面的安装成功后，在页面中局部使用`scss`
   ```scss
   $text-color: purple;
   .msg {
     color: $text-color;
   }
   ```
   运行，页面上看到效果：
   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4806558400745718b96194ad53f2db2~tplv-k3u1fbpfcp-watermark.image?)
3. 基于以上，要全局引入`scss`样式和定义全局变量时，在`assets`中新建一个文件，放全局样式，之后在`vite.config.js`中引入**全局**外部样式

   ```js
   import { defineConfig } from "vite";
   import vue from "@vitejs/plugin-vue";

   // https://vitejs.dev/config/
   export default defineConfig({
     css: {
       preprocessorOptions: {
         scss: {
           additionalData: `@import "./src/assets/scss/variable.scss";`,
         },
       },
     },
     pluginOptions: {
       "style-resources-loader": {
         preProcessor: "sass",
         patterns: [],
       },
     },
     plugins: [vue()],
     build: {},
   });
   ```

   `variable.scss`中定义了全局变量 `$color-primary: #28cccc`; 在页面中直接使用`color: $color-primary;`效果如下：
   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93ffbe6f1634411f9233b579f165d75d~tplv-k3u1fbpfcp-watermark.image?)

4. 以上配置完成后，`build`之后再运行，无问题
   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73b6c20be5a34e9faba4ad71ecc74cbe~tplv-k3u1fbpfcp-watermark.image?)
5. 第 3 步中，引入全局 scss 文件时，若想使用@别名，也可通过配置完成，配置如下
   ```js
   import { defineConfig } from "vite";
   import vue from "@vitejs/plugin-vue";
   import path from "path";
   // https://vitejs.dev/config/
   export default defineConfig({
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "src"),
         views: path.resolve(__dirname, "src/views"),
       },
     },
   });
   ```
   配置好别名后，重启项目。
6. 网上看到有些需要另外去引入`path`模块的，很奇怪，我这边不用也能成功配置别名，先存个疑，后面来跟进下~

# 四、引入 vue-router

1. `cnpm i vue-router@next --save`安装依赖
2. `src`目录下，新建`router`文件夹存放路由，在`index.js`中加入以下代码，于此同时，也将首页跟登录页新建好
   ```js
   import { createRouter, createWebHistory } from "vue-router";
   export default createRouter({
     history: createWebHistory(),
     routes: [
       {
         path: "/",
         component: () => import("views/index.vue"),
       },
       {
         path: "/login",
         component: () => import("views/login.vue"),
       },
     ],
   });
   ```
3. 在入口文件`main.js`中引入路由，代码如下：

   ```js
   import { createApp } from "vue";
   import App from "./App.vue";
   import router from "./router/index";
   import ElementPlus from "element-plus";
   import "element-plus/theme-chalk/index.css";

   const app = createApp(App);

   app.use(ElementPlus);
   app.use(router);
   app.mount("#app");
   ```

4. `App.vue`中加入`<router-view />`标签
5. 重启就能看到效果啦
   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92b936b9edb140faa3012de4a27c4065~tplv-k3u1fbpfcp-watermark.image?)

   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6ca233e37f14bcf972adaef2f808d6d~tplv-k3u1fbpfcp-watermark.image?)

# 五、引入 Vuex 状态树管理

1. 安装依赖：`cnpm i vuex@next --save`，[点击可跳转至 Vuex 官方文档](https://vuex.vuejs.org/zh/guide/structure.html)
2. `vue3`对应的`Vuex`也要升级到**4.x**版本，写法上也要使用**组合式 API**的写法；以下的`Vuex`样例，使用了带命名空间的模块，具体可看下[官方文档](https://vuex.vuejs.org/zh/guide/modules.html#%E5%B8%A6%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E7%BB%91%E5%AE%9A%E5%87%BD%E6%95%B0)，Vuex 官网上也链接了一些案例：[github 示例的地址](https://github.com/vuejs/vuex/tree/main/examples/composition)；
   样例的目录结构为：分 2 个模块，分别是`modules`中的`userInfo`模块和`common`模块，设置命名空间：`namespaced: true`，其余写法跟`Vuex3.x`一样，在`index.js`中再分别引入，引入方法是通过`createStore({modules: {XXX}})`来引入
   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/959e2f727037426e8b7a8263eff868ae~tplv-k3u1fbpfcp-watermark.image?)
3. 在`main.js`中全局引入，代码如下：

```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import store from "./store/index";

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(store);
app.mount("#app");
```

4. 在页面文件中，他的调用方法基本跟`Vuex3.x`一致，不同的是`Vue4.x`多了个具名模块的调用；

   - 若通过`store`拿状态值的话，需要在`setup(){}`中`return`出来
   - 若要使用带命名空间的模块内的方法，需要传参模块名，如下：`mapMutations`跟`mapActions`都是通过第一个传参指定某个带命名空间的模块；

   ```js
   import { mapMutations, mapState } from "vuex";
   export default {
     setup() {},
     data() {
       return {
         title: "登录页",
       };
     },
     computed: {
       ...mapState({
         userId: (state) => state.userInfo.userId,
       }),
     },
     methods: {
       ...mapMutations("userInfo", ["SET_USERID"]),
     },
   };
   ```

   - 带命名空间模块的引用也可通过`createNameSpacedHelpers`来**创建基于命名空间的辅助函数**，它返回**一个对象**，对象中包含`mapState`\`mapMutations`等辅助函数

   ```js
   import { createNamespacedHelpers } from "vuex";
   const { mapMutations, mapState } = createNamespacedHelpers("userInfo");
   export default {
     setup() {},
     data() {
       return {
         title: "登录页",
       };
     },
     computed: {
       ...mapState({
         userId: (state) => state.userId,
       }),
     },
     methods: {
       ...mapMutations(["SET_USERID"]),
     },
   };
   ```

5. 运行起来后可看到
   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2aa969f31ef479196b631bfc803777e~tplv-k3u1fbpfcp-watermark.image?)
6. 关于持久化存储的，这边没有配置，可自行安装下这个插件`vuex-persistedstate`

# 六、其它的配置

之后会来加上`eslint`（规范代码格式）以及`husky`（提交自动校验代码格式）等其它，祥见下一篇哦；
