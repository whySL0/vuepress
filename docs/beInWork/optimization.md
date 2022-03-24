---
theme: fancy
highlight: an-old-hope
---

# 前端性能优化

最近有用`nuxt`开发商城的经验，`nuxt`是为了解决`SEO`的一个服务端渲染框架，他的渲染方式跟`vue`不同的是：`nuxt`首先经过服务端渲染之后再到客户端渲染，也因为如此，它**对服务端的运行内存要求较高**，容易出现内存溢出的情况，为此，前端对代码的要求以及打包都需要尽量优化。具体优化的方案有以下：

## 一、从前端角度

### 1、资源按需加载

`script`资源的加载方式有三种，分别是同步模式、异步模式（`async`)，延迟模式（`defer`）

1. 同步模式下的资源加载和执行会阻塞页面的解析和渲染，使用过程中应注意`script`标签所放置的位置，需放置到`body`后面，以防止阻塞页面解析；
2. 异步模式下的资源加载是异步的，执行是同步的，加载完成后会立马执行，执行过程中，浏览器处于阻塞状态，无法响应任何请求；
3. 延迟模式下的资源加载是异步的，执行是同步的，但它加载完不会立马执行，而是等到`DOM ready`之后才执行。该模式也称为**惰性加载**，这种模式可以应用于**图片懒加载**、**路由懒加载**等，该模式即将资源切片成多个模块，当应用到哪个模块再对应去加载；

### 2、图片资源的处理

1. 压缩图片资源，`webpack`可以使用插件实现：`imagemin-webpack-plugin`
2. 图片资源缓存到`CDN`上，通过`CDN`来**压缩、裁剪一定尺寸、格式转换、缩放、旋转图片、添加水印等**，同时，前端对于图片的加载应使用**懒加载**，具体配置方法可上`oss`上查看，[点击跳转至 oss 官网文档](https://help.aliyun.com/document_detail/193593.html)
3. 分清不同场合分别使用哪种图片格式的资源，目前前端开发过程使用频率高的图片格式如下：

- `webp`: 由`google`推出，**支持无损压缩和有损压缩**，且压缩效率、压缩后的图片体积也很可观，目前**支持度**（如下图），它不支持`IE`；
  ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f06f7f2f0b9e4fa7b9c97f3a5d4f7049~tplv-k3u1fbpfcp-watermark.image?)
- `jpg`: **有损压缩**，压缩后的图片体积减小，但需以图片分辨率为代价的，适用于列表页中的产品小图等；
- `png`: **无损压缩**，压缩后的图片体积比`jpg`大，但图片分辨率保持，适用于产品详情中的大图等；
- `gif`: **支持动图**，只能支持 256 色索引颜色；
- `svg`: **矢量图**，可自由缩放，不会有图片质量损失的情况。

### 3、静态资源的压缩

1. 静态资源的`gzip`和`broti`压缩：

`gzip`和`broti`是两种压缩算法，性能上，`broti`的压缩效率会比`gzip`高，其在`ng`上的配置方法也复杂的多，需要去额外下载插件；这两种压缩在`ng`那边都可以配置，前端在`webpack`打包时也可以配置上，前端的打包配置方法如下：
以`nuxt.js`为例，需要安装`nuxt-precompress`插件，之后再`nuxt.config.js`中配置相关参数：

```js
  // 配置代码压缩 https://www.npmjs.com/package/nuxt-precompress
  nuxtPrecompress: {
    enabled: true, // Enable in production
    report: false, // set true to turn one console messages during module init
    test: /\.(js|css|html|txt|xml|svg)$/, // files to compress on build
    // Serving options
    middleware: {
      // You can disable middleware if you serve static files using nginx...
      enabled: true,
      // Enable if you have .gz or .br files in /static/ folder
      enabledStatic: true,
      // Priority of content-encodings, first matched with request Accept-Encoding will me served
      encodingsPriority: ['br', 'gzip']
    },
    // build time compression settings
    gzip: {
      // should compress to gzip?
      enabled: true,
      // compression config
      // https://www.npmjs.com/package/compression-webpack-plugin
      filename: '[path].gz[query]', // middleware will look for this filename
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: { level: 9 }
    },
    brotli: {
      // should compress to brotli?
      enabled: true,
      // compression config
      // https://www.npmjs.com/package/compression-webpack-plugin
      filename: '[path].br[query]', // middleware will look for this filename
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8
    }
  },
```

2. 打包时的资源压缩：通过`webpack`插件`compression-webpack-plugin`可实现，具体实现方法如下：
   以`nuxt.js`框架为例：

```js
// build构建参数
build: {
  plugins: [
    new CompressionPlugin({
      test: /\.js$|\.html$|\.css/, // 匹配文件名
      threshold: 10240, // 对超过10kb的数据进行压缩
      deleteOriginalAssets: false, // 是否删除原文件
    }),
  ];
}
```

3. 资源切片：项目开发过程中，发现配置了以上之后，还是不足够，页面加载`vendor.app.js`还是加载了挺长时间，于是引入资源切片，再配合`h2`，多个资源的请求可以并发执行，页面资源加载解析速度提高了不少，下面是配置方法，同样以`nuxt`为例：

```js
  build: {
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/, // 匹配文件名
        threshold: 10240, // 对超过10kb的数据进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      })
    ],
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  }
```

### 4、最后一点是最简单也是最重要的

1. 代码多审查，防止全局变量占用空间、**注意监听事件的取消、定时器的**
2. **去除无用、冗余代码**
3. **精简样式表**
4. 事件的触发注意**节流防抖**

## 二、从服务端角度

### 1、`http2`（简称：`h2`）

开启`h2`后，浏览器支持并发下载资源，且一旦某个资源下载中断浏览器会自动下载下一个资源，不会阻塞着，这极大的提高了页面的渲染速度。

### 2、**利用`http`缓存机制**

具体的文章可以看下我的上一篇[关于浏览器缓存一说](https://juejin.cn/post/7076359657551298567)
