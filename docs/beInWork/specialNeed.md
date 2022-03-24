这篇文章是关于之前产品提的一个需求，大概是：**用户打开某个页面时，将这个页面上锁，其他人不能进入，等用户关闭页面才释放锁。**
## 初步解决
一开始，我的想法自然是在入口处（即路由跳转之前）调用接口上锁，再在`beforeDestroy`中释放锁。
## 发现问题
后面发现，进到页面后，在当前页面强制关闭页签，是不会走`beforeDestroy`这个钩子的，故引入第2步：页面`created`生命周期里增加`beforeunload`监听，`destroyed`里取消掉该监听，代码如下：
```javascript 
  created() {
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  beforeDestroy () {
    this.releaseLock();
  },
  destroyed () {
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn() {
      this.releaseLock();
    },
    releaseLock() {
      // 调用接口释放锁
    }
  }
```
以上方法实现了路由跳转时、浏览器页签关闭以及重新刷新之后的释放锁。问题来了~重新刷新的时候用户的页面还是会在编辑页面的，这个时候没有锁了，别的用户就也能进来编辑了，不允许，于是引入第3步：在页面挂载**请求页面数据完**之后，**页面重新渲染完成之后**再请求一次加锁的接口。
  ```javascript 
    if(!localStorage.getItem('actProLockHash')) {
      this.$nextTick(()=>{
        that.handleViewProjectDetail(that.projectInfo.actInfoHash, that.projectInfo.id)
      })
    }
  ```
## 进一步完善  
### 问题1
但是但是，`beforeunload`,`unload`事件属于**浏览器事件**，同时也没有相应的规范，不同浏览器会有不同的写法，好坑!!!现在测试的结果是：谷歌浏览器`beforeunload`事件不是任意时候都能触发的，需要进到页面后，有页面的交互之后关闭浏览器页签或者刷新，才能触发。
### 问题2
原本`beforeunload`一般只是用在发起弹框，提示用户浏览器将关闭，这里用来加异步请求，百度了下看到其他人踩过的坑，`ajax`请求是不支持的，`axios`是可以的，具体原理还不清楚。虽然`axios`支持，但是`axios`方法之后的`then`方法还没有进去，页签就己经关闭了，也无法很好的解决问题。

对于问题2，监听浏览器页签关闭之后触发的事件中，可以加一个延时，等执行完再关闭浏览器，这样子能基本解决问题2，只设置了100ms，使用过程中用户不会感受到明显的关闭页签缓慢，又能有时间去调用接口释放锁。代码如下：
```javascript
  beforeunloadFn(e,flag) {
    if(flag = 'onUnload') {
    let now = new Date()
      while (new Date() - now < 100) { }
    }
    this.releaseLock();
  }
```
### 问题解决
上锁解锁的标志是通过**唯一哈希值**实现，上锁时服务器返回哈希值，前端把哈希值存储在本地缓存中，解锁时将哈希值作为参数给后端。上面的步骤都是基于这个方法。

但是由于问题1，且后面需求有改动：**同个用户要求可以打开多个窗口，且这多个窗口可以是同个锁页面，也可以是不同的锁页面**。

因此后端改为通过用户`id`拼接哈希值来唯一标志锁，之前将锁的哈希值存在本地缓存当中，存的是**字符串类型**，现也改成**对象**存储。

基于以上，后端将锁的哈希值拼上用户ID，通过判断ID，使用户可以多次打开同个页面，页面中再通过`websocket`监听页面关闭，一旦用户关闭其中一个页面，则其它相同锁页面也都关闭。