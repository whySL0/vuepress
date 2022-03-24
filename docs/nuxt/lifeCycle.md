---
title: nuxt生命周期
lang: zh-CN
meta:
  - name: nuxt
    content: nuxt 一个服务端渲染框架
  - name: ^^玲
    content: SEO测试
---
# `nuxt`生命周期

首先，先附上[官网](https://nuxtjs.org/docs/concepts/nuxt-lifecycle)的文档

`nuxt`生命周期是在`nuxt`项目构建完成后，用户在客户端数据`url`后的一些列动作，由先到后的执行顺序如下（以下是基于`SSR`服务端渲染）：
`nuxt start`，服务端启动项目后，服务端中加载`Nuxt`、中间件以及`Nuxt`插件（`Nuxt`插件的引入根据`nuxt.config.js`中定义的先后顺序），下面进入到生命周期：

1. `nuxt ServerInit`: 服务端中运行；有两个参数，第一个是`Vuex`的上下文，第二个是`Nuxt`的`context`， `Vuex`用于预填存储状态；该钩子在`store/index.js`中定义；

2.` Middleware`: 
- 在页面渲染之前执行；
- 执行顺序为：
    - **全局中间件**（在`nuxt.config.js`中定义: `router: { middleware: ['auth']}`）
    - **布局中间件**（`layouts`中定义） 
    - **路由中间件**（在`page`中定义，通过`middleware: 'auth'`）；
- 服务端中的全局中间件配置为：`serverMiddleware: []`
- 客户端中的全局中间件配置为：`middleWare: []`
- 中间件写法为:
    ```js
    export default function(context){
        // ………………页面跳转之前做权限判断或其它
    }
    ```
    `context`上下文对象包含了`vuex`上下文、`route`对象等，具体如下：
![微信图片_20220225094803.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34018052a7db4fefa8dcb5234f1652bd~tplv-k3u1fbpfcp-watermark.image?)

3. `validate()`: 在页面渲染之前执行；用于校验动态路由参数是否合法，必须返回布尔值（`true`或`false`)；只能在页面中定义；

4. `asyncData()` 和 `fetch(context)`
    - `asyncData()`: 
        - 每加载一次页面之前执行，只能在页面中定义；
        - 传参为**当前页面的上下文对象**，并且支持给`data`赋值，方法最后`return`出来即可；
        - 该方法在页面初始化之前执行，因此无法获取`this`组件示例
    - `fetch(context)`: 
        - `Nuxt2.12`之后新增钩子，同`asyncData`一样；
        - 传参为**当前页面的上下文对象**，但是无法为`data`赋值，可以拿到`Vuex`上下文，用于在页面渲染之前预设`store`状态树；
        - `fetch()`在页面渲染之前执行，因此此时无法获取`this`组件示例


5. `beforeCreate`:` Vue`实例注册完成之后执行；运行环境包括服务端和客户端，用法同`vue`差不多；

7. `created`: `Vue`示例创建完成之后执行；运行环境包括服务端和客户端，用法同`vue`差不多；

8. `fetch`: `Nuxt2.12`之后新增钩子，此时，`this`上下文可用，`fetch()`方法处于`pending`状态，即`pending=true`；

9. `beforeMount`: 此时，`DOM`节点可用，`fetch()`方法也已完成，即`pending=false`；该钩子只在客户端运行，用法同 `vue`；

11. `mounted`： 用法同 `vue`

12. `beforeUpadate`： 用法同 `vue`

13. `updated`： 用法同 `vue`

14. `beforeDestroy`： 用法同 `vue`

15. `destroyed`： 用法同 `vue`





