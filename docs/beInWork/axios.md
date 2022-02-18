「这是我参与2022首次更文挑战的第5天，活动详情查看：[2022首次更文挑战](https://juejin.cn/post/7052884569032392740 "https://juejin.cn/post/7052884569032392740")」

## 关于异步请求（`XML`)
**同步请求**：当浏览器向服务器发送请求，发送成功之后，浏览器处于**等待状态**，等到服务器返回响应数据，浏览器接收数据并做相应处理后**重新加载页面**。

基于以上，当浏览器发送请求后就只能等待，无法执行别的事件，所以引入异步请求

**异步请求**：大部分浏览器内置了`XMLHttpRequest`对象，浏览器把请求交给了`XMLHttpRequest`，浏览器发送请求后，**不需要等待响应**，待服务端响应后，**刷新页面局部内容**。

## 关于`Ajax` 
`Ajax` 全名是`Asynchronous Javascript and XML`(异步的`Javascript`与`XML`技术)

## `Axios`
> `Axios` 是一个基于`Promise` 用于浏览器和`Node.js`的`http`客户端

`Axios` 基于浏览器内置对象`XML`和`Promise`对象，通过`node.js`发起`http`请求；通过**拦截器配置请求数据和转换响应数据并做相应处理**，基于`XML`，因此也**支持取消请求**。
### `Axios`请求的封装
```js
// 需要引入axios

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 15000
});

// 配置请求拦截器
service.interceptors.request.use(
  config => {
    // 统一网络请求的请求头
    if (store.getters.token) {
      config.headers['Authorization'] = "XXX";
    }
    return config;
  },
  error => {
    // ...... 对错误信息进行统一处理
    Promise.reject(error);
  }
);

// 配置响应拦截器
service.interceptors.response.use(
  response => {
      // ...... 对响应数据进行统一处理
      return response;
  },
  error => {
    // ...... 对错误信息进行统一处理
    return Promise.reject(error);
  }
)
export default service
```

## `fetch`
关于`fetch`的浏览器支持度，如下图，需要提醒的是，`fetch`不提供对`IE`的支持。
![fetch-caniuse.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5f3271f5d234b9cb6fc36d08ed3becf~tplv-k3u1fbpfcp-watermark.image?)
`fetch`提供一个`JS`接口，用于定义`Request`和`Response`对象。它基于`Promise`，但是对于服务端响应的404、500等状态码，`fetch`都把它标记为`resolve`,仅当网络故障或请求中断，才会标记为`reject`。

对于`Response`对象，需要做下`.json()`处理，来把`HTTP`响应解析为`JSON`数据

关于`fetch`无法跟`Ajax`一样**中断请求**的问题，浏览器现已开始对`Abort API`添加实验性支持。

`fetch` 现也还不支持超时控制，且跨域默认不会带cookie


## 跨域
说到异步请求的封装，那前端的跨域配置也是必须的了。

对于普通的跨域请求，服务端设置`Access-Control-Allow-Origin`即可。

对于需要带`cookie`的请求，前后端都需要设置，设置方法有：
1. 对于`vue`框架的跨域，可通过`webpack`配置文件，配置`devServer`，若需要支持`websocket`跨域，配置`ws:true`即可
```js
devServer: {
    proxy: {
        '/api':{
          target: APP_BASE_URL,
          ws: true,
          secure: false,// 如果是https接口，需要配置这个参数
          changeOrigin: true
        }
    }
}
```
2. 对于`nuxt`框架的跨域，配置也是类似的
`nuxt.config.js`文件中配置如下：
```js
 // 配置代理
  axios: {
    proxy: true
  },
  proxy: {
    '/service': {
      target: APP_BASE_URL
    }
  }
```
3. 对于非`vue`框架的跨域，可通过ng进行配置
```conf
server {
	listen       8080;
	server_name  127.0.0.1;

	location / {
		proxy_pass  http://59.110.XXX.XXX;
		client_max_body_size    10m; #表示最大上传10M，需要多大设置多大。
   
		proxy_read_timeout          300s;
		proxy_redirect              off;
		proxy_set_header            Host $host;
		proxy_set_header            X-real-ip $remote_addr;
		proxy_set_header            X-Forwarded-For $proxy_add_x_forwarded_for;
	}    
}
```
4. 还有个方法，直接将`chrome`浏览器设置成跨域浏览器，设置方法可以自行百度搜索~

## `async`和`await`语法糖的使用

1. `async`和`await`是`generator`函数的语法糖，写法上替代了`Promise`回调函数。`await`意图等待`Promise`对象的状态被`resolved`，对于`Promise`状态被`reject`的情况，需要通过`try catch`来获取。写法如下：
```js
      async handleDelete(data) {
        try {
          await deleteBatch({ list: data });
          this.$message.success('删除成功!');
        } catch (e) {
          // 处理请求失败的情况
          this.$message.error('删除失败!');
        }
      },
```
2. `async`和`await`使用过程中需要注意的是，`await`必须在`async`函数的上下文中的。
3. 注意以下：多个异步 不同写法的执行情况：
```js
 async test() {
    let p1 = getSwYw();
    let p2 = getOrderNum({orderType: 0});
    let p3 = checkActive();
    try {
      let res = await Promise.all([p1, p2, p3]);
      console.log('成功', res)
    } catch(e) {
      console.log('失败', e)
    }
}
```
这种写法：三个异步请求是并发执行的，如下图：
![并发请求.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adc70b02dd9d44b0b862684a7cff2a0b~tplv-k3u1fbpfcp-watermark.image?)
三个请求完成后才有结果输出，如下图：
![Promise.all 返回结果.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44293345271f400aae12340e68ed30d3~tplv-k3u1fbpfcp-watermark.image?)
```js
  async test() {
    await getSwYw();
    await getOrderNum({orderType: 0});
    await checkActive();
    console.log('成功');
  },
```
这种写法： 三个异步请求是继发执行的，如下图：
![继发执行.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9201e2992f3b43deadbb89b06a9135a6~tplv-k3u1fbpfcp-watermark.image?)
跟上面的一样，3个请求完成后才会输出“成功”
![继发请求结果输出.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32febcc7b0b7444dadc1037629444f88~tplv-k3u1fbpfcp-watermark.image?)

