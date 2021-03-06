## 引入
浏览器是**多进程**的，**它的内核是渲染进程**，同个浏览器每打开一个页签就相当于新起一个渲染进程，**渲染进程是多线程的**，分别有：
1. **`GUI`渲染线程**: 渲染界面构建DOM树等
2. **`JS`引擎线程(`JS`内核)**: 负责处理脚本
3. **事件触发线程**: 归属于浏览器,用于控制事件循环
4. **定时器触发线程**: setInterval,setTimeout事件
5. **异步`http`请求线程**: XHR请求 -> +线程 -> 检测状态变更(回调)
## `EventLoop`
每个`JS`引擎线程都有一个独立的`EventLoop`(事件循环机制)，事件循环是通过任务队列的机制来协调的
              
![未命名文件.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/853bed6492c344fcb92df9973627f954~tplv-k3u1fbpfcp-watermark.image?)

> 执行栈: 先进后出

> 任务队列: 先进先出

JS有**同步任务**和**异步任务**，同步任务在**主线程**即**执行栈**上执行；**异步任务**有了运行结果后，就在**任务队列中**新增一个事件。

当执行栈中的同步任务执行完毕后，系统读取任务队列，执行完任务队列中**宏任务**和**微任务**后，开始渲染页面。
### 宏任务和微任务
任务队列中的任务有两种类型，一种是**宏任务(`macroTask`)**，一种是**微任务(`microTask`)**

**宏任务**包含了: 
- `script`
- 定时器(`setTimeout`, `setInterval`)
- `I/O`
- `UI`交互事件
- `postMessage`
- `MessageChannel`
- `setImmediate`(`Node.js` 环境)

**微任务**包含了:
`Promise.then`
`Object.observe`
`MutationObserver`
`process.nextTick`

### 任务队列的执行顺序
**任务队列**的执行顺序是: **宏任务** -> **宏任务**执行结束，检查是否有**微任务** -> 有，执行所有**微任务**; -> 直到无其它**微任务**，浏览器渲染 -> 下一个**宏任务** 



