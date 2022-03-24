## `Promise`的状态
### `Promise`的状态
**等待态(`Pending`)**、**执行态(`Fulfilled`)**、**拒绝态(`Rejected`)**

这三种状态之间，`Pending`可以转变为另外两个之一，到了执行态或拒绝态，就无法再转变回去了。
### `then` 方法
```js
promise.then(onFulfilled, onRejected)
```
其中，`onFulfilled`要求为函数，在promise执行结束后调用，接收的第一个参数为返回的终值（`value`），若注册多个`onFullfilled`，则按照注册顺序依次回调

`onRejected`要求为函数，在promise被拒绝执行时调用，接收的第一个参数为拒绝执行的原因（`reason`），若注册多个`onRejected`，则按照注册顺序依次回调

