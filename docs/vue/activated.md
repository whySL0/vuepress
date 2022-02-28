# `vue`中关于`activated`、`deactivated`
## `keep-alive`
`keep-alive` 是个**抽象组件**，跟`template`一样，自身不会渲染成`DOM`元素，它用于将整个组件缓存起来。

该组件的写法可以直接在`template`中**包在组件的外层**，也可以直接在路由中定义`meta: { keepAlive: true/false}`（具体实现视需求而定）。

它的属性有`max`、`include`、`exclude`（这两个支持传参**字符串**或者是**数组**，值为组件中定义的`name`值，定义是否会被缓存的组件)
## `activated`、`deactivated` 
### `activated`、`deactivated` 生命周期只再设置了`keep-alive`缓存组件中存在，每当切换组件的时候会执行一次：
- 第一次进入缓存组件的生命周期： `beforeRouterEnter` -> `created` -> ... -> `activated` -> `deactivated`
- 后续再进入： `beforeRouterEnter` -> `activated` -> `deactivated`

### 例子：基于element-UI，使用tab切换展示多个table，切换的table设置keep-alive缓存
1. 具体代码如下：
```html
    <el-tabs v-model="active" style="margin-top:15px;" type="card">
        <el-tab-pane v-for="item in tabOptions" :label="item.label" :key="item.key" :name="item.key">
          <keep-alive :exclude="exclude">
            <list v-if="multi && active==item.key && refresh" :if-load="ifLoad" :tab-list="tabList" :query="query" :type="item.key" :selected-data="selectedList" :temp-data="tempList" @handleChoose="submit" />
          </keep-alive>
          <keep-alive :exclude="exclude">
            <single-list v-if="!multi && active==item.key && refresh" :if-load="ifLoad" :tab-list="tabList" :query="query" :type="item.key" :selected-data="selectedList" @handleChoose="submit" />
          </keep-alive>
        </el-tab-pane>
     </el-tabs>    
```
2. 若切换tab时需要刷新页面，可通过`v-if`和`exclude`让组件重新渲染，同样也可用`include`来代替`exclude`实现。
    ```javascript
      fun() {
        this.refresh = false;
        this.exclude = 'ZydSearch,ZydSingleSearch'
        this.$nextTick(() => {
          this.exclude = null;
          this.refresh = true;
        })
      }
    ```
3. 在 `ZydSearch` 和 `ZydSingleSearch` 中，通过`activated`生命周期函数定义方法，获取数据
    ```javascript
     activated() {
       this.selectedList = {};
       this.tempList = [];
     }
    ```






