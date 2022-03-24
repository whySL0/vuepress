<!-- ---
theme: arknights
--- -->

# `lodash`

`lodash`是一个`js`的工具库，其封装了一系列常用的方法，如常用的**防抖节流**以及**深拷贝**等，我在 PC 端用惯了`lodash`，想着小程序也引用下这个库，引用过程中发现了如下问题，于是就有了这一篇记录。

# 小程序中使用 `lodash`

1. 小程序单独引入`lodash`会报错, 报错信息指向`Array`等的`prototype`找不到，报错导致整个页面都渲染不出来
2. 通过百度，网上很多说重新给`root.Array`指定下对象即可，我试了下，加上如下代码:

```js
root.Array = Array;
// root.Buffer = Buffer
root.DataView = DataView;
root.Date = Date;
root.Error = Error;
root.Float32Array = Float32Array;
root.Float64Array = Float64Array;
root.Function = Function;
root.Int8Array = Int8Arrayp;
root.Int16Array = Int16Arrayip;
root.Int32Array = Int32Arrayip;
root.Map = Maptry;
root.Object = Object;
root.Promise = Promise;
root.RegExp = RegExp;
root.Set = Set;
root.String = String;
root.Symbol = Symbol;
root.TypeError = TypeError;
root.Uint8Array = Uint8Array;
root.Uint8ClampedArray = Uint8ClampedArray;
root.Uint16Array = Uint16Array;
root.Uint32Array = Uint32Array;
root.WeakMap = WeakMap;
root._ = _;
root.clearTimeout = clearTimeout;
root.isFinite = isFinite;
root.parseInt = parseInt;
root.setTimeout = setTimeout;
```

3. 经过上面重新定义`root`对象之后，发现还是报错，于是我打开源码，看到源码中下面这一段

```js
   /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f067657b9c14497917e9d4e7a382a1c~tplv-k3u1fbpfcp-watermark.image?)
  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();
```

才发现，`root`对象依赖于`node.js`的宿主对象`global`或者`self`对象，我在小程序中试着打印这两个对象，发现`self`是`undefined`,`global`对象虽然有值，但是`global.Object`没有定义（如下图）

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9c8d39e05374f3bb47e93efcc5a66fe~tplv-k3u1fbpfcp-watermark.image?)

所以，正常情况下只要对`global`对象做下重定义就能正常使用`lodash`的功能了，需要注意的是：**重定义的代码必须在`lodash`引用之前就引入**，如下代码

```js
global.Object = Object;
global.Array = Array;
// global.Buffer = Buffer
global.DataView = DataView;
global.Date = Date;
global.Error = Error;
global.Float32Array = Float32Array;
global.Float64Array = Float64Array;
global.Function = Function;
global.Int8Array = Int8Array;
global.Int16Array = Int16Array;
global.Int32Array = Int32Array;
global.Map = Map;
global.Math = Math;
global.Promise = Promise;
global.RegExp = RegExp;
global.Set = Set;
global.String = String;
global.Symbol = Symbol;
global.TypeError = TypeError;
global.Uint8Array = Uint8Array;
global.Uint8ClampedArray = Uint8ClampedArray;
global.Uint16Array = Uint16Array;
global.Uint32Array = Uint32Array;
global.WeakMap = WeakMap;
global.clearTimeout = clearTimeout;
global.isFinite = isFinite;
global.parseInt = parseInt;
global.setTimeout = setTimeout;
```

4. 以上，只要在页面文件中引入`lodash`之前先引用上面重新给`global`赋值的文件，就能正常使用`lodash`的功能啦，如下:

```js
import "../utils/fix";
import _ from "../miniprogram_npm/lodash/index";
Page({
  // 点击提交按钮
  submit: _.debounce(
    async function () {
      // 一系列表单操作
    },
    1000,
    { leading: true, trailing: false }
  ),
});
```
