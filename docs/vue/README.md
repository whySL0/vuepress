# 初学vue
「这是我参与2022首次更文挑战的第2天，活动详情查看：[2022首次更文挑战](https://juejin.cn/post/7052884569032392740 "https://juejin.cn/post/7052884569032392740")」

这篇文章是我毕业后，刚接触vue，最初学习vue2.x的时候记录的一些tip。

## 一、路由：
两种路由跳转方式：
* `this.$router.push({name: 'userAdd',params: {'id: row.id',}})`： 地址栏不可见，安全性高，但是刷新之后参数会丢失, 通过`this.$route.params.id`获取页面传参。
* `this.$router.push({path: '/userAdd',query:{'id: row.id',}})`：地址栏不可见，安全性不高，通过`this.$route.query.id`获取参数
其余路由跳转
- `this.$router.back(-1)`等同于`this.$router.go(-1) `
- `this.$router.replace` ，跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上上个页面
- `this.$router.go(n)` ，向前或者向后跳转n个页面，n可为正整数或负整数，`this.$router.go(1)` 等同于 `history.forward()`

## 二、生命周期

    beforeCreate
    created （在模板渲染成html或者模板编译进路由前调用created）
    beforeMount
    mounted（已完成模板渲染或el对应html渲染后）
    beforeUpdate
    updated
    beforeActivated: 缓存组件失活时调用
    deactivated： 缓存组件被激活时调用
    beforeDestroy
    destroyed
    errorCaptured： 2.5.0+新增
    
## 三、vue实例的属性
* methods方法：定义方法
* computed计算属性：在html DOM加载完成后执行
* watch监听属性

## 四、组件slot 插槽：默认插槽|单个插槽|匿名插槽
* 默认插槽
    1. 除了在index.js路由中添加子组件，在父组件中也需要定义子组件
        ```html
        <template>
            <div class="slot_parent">
                <h1>这里是slot_parent</h1>
                <child>
                    <div>
                        <span>菜单1</span>
                        <span>菜单2</span>
                        <span>菜单3</span>
                        <span>菜单4</span>
                    </div>
                </child>
            </div>
        </template>
        ```
        ```js
        <script>
        import child from './child'
        export default {
            name: 'slot_parent',
            components: {child}
        }
        </script>
        ```
    
     2. 在子组件中，使用`<slot>`引入父组件定义的菜单
         ```html
        <template>
            <div class="child">
                <h2>这里是slot_child</h2>
                <slot></slot>    
            </div>    
        </template>
        ```
        ```js
        <script>
        export default {
            name: 'child',
        }
        </script>
        ```
 
* 具名插槽
    1. 在子组件中为`<slot>`添加`name`属性
        ```html
        <template>
            <div class="child">
                <h2>这里是slot_parent_up</h2>
                <slot name="up"></slot>
                <h2>这里是slot_parent_down</h2>
                <slot name="down"></slot>
            </div>    
        </template>
        ```
    2. 在父组件中添加`slot`属性
        ```html
        <template>
            <div class="slot_parent">
                <h1>这里是slot_parent</h1>
                <child>
                    <div slot="up">
                        <span>菜单1</span>
                        <span>菜单2</span>
                        <span>菜单3</span>
                        <span>菜单4</span>
                    </div>
                    <div slot="down">
                        <span>菜单5</span>
                        <span>菜单6</span>
                        <span>菜单7</span>
                        <span>菜单8</span>
                    </div>
                </child>
            </div>
        </template>
        ```
 
* 作用域插槽|带数据的插槽
    1. 在父组件中用`slot-scope`绑定user数据，之后输出数据，数据在子组件中定义
        ```html
        <template>
            <div class="slot_parent">
                <h1>这里是slot_parent</h1>
                <child>
                    <template slot-scope="user">
                        <ul>
                            <li v-for="item in user.data">{{item}}</li>
                        </ul>
                    </template>
                </child>
            </div>
        </template>
        ```
    2. 在子组件，slot中用`:data`绑定数据，并定义好数据
        ```html
        <template>
            <div class="child">
                <slot :data="data"></slot>
            </div>    
        </template>
        ```
        ```js
        <script>
        export default {
            name: 'child',
            data: function(){
                return {
                    data: ['张三','李四','王五']
                }
            }
        }
        </script>
        ```
 
## 五、组件之间的传值：
* 父组件-->子组件（通过`props`向子组件传参）
    1. 通过`:name=""`绑定参数
        ```html
        <template>
            <div class="parent">
                <son :logo='logomsg'></son>
                <router-view />
            </div>
        </template>
        ```
    2. 子组件中用`props`获取父组件传递来的参数： 
        ```js
        <script>
        export default {
            name: 'son',
            props: ['logo'],
        }
        </script>
        ```
* 子组件-->父组件（通过`$emit`事件传递来向父组件传参）
    1. 子组件视图中绑定方法，在方法中用`$emit`方法遍历父组件中自定义的`transfer`事件，（`transfer`功能类似于一个中转），`this.name`将通过这个事件传递给父组件
        ```html
        <template>
            <div class="daughter">
                <label>daughter:<input v-model="name" @change="setName" /></label>
            </div>
        </template>
        ```
        ```js
        <script>
        export default {
            name: 'daughter',
            data() {
                return {
                    name: ''
                }
            },
            methods: {
                setName: function() {
                    this.$emit('transfer',this.name)
                }
            }
        }
        </script>
        ```
    2. 父组件中引入子组件，自定义一个事件`transfer`绑定一个方法，用此方法获取子组件传递的参数
        ```html
        <template>
            <div class="parent">
                <daughter @transfer="getName"></daughter>
                <p>daughter获取到的name:{{name}}</p>
                <router-view />
            </div>
        </template>
        ```
        ```js
        <script>
        import daughter from './daughter'
        export default {
            data() {
                return {
                    name: '', 
                }
            },
            methods: {
                getName(msg) {
                    this.name = msg;
                }
            },
            components: {
                daughter
            }
        }
       </script>
       ```
* 兄弟组件之间的传参（通过`vuex`状态管理方法）
    1. 安装`Vuex`： `cnpm i vuex -S`
 
    2. 在`src`中新建目录`vuex`，并新建一个`store.js`文件, 在`store.js`中引入`Vue`和`Vuex`，只存入一个状态`author`
        ```js
        import Vue from 'vue'
        import Vuex from 'vuex'

        Vue.use(Vuex)

        const store = new Vuex.Store({
          // 定义状态
          state: {
            author: 'Wise Wrong'
          }
        })
        export default store
        ```
        在`main.js`中**全局引入**`vuex`和`store.js`文件
        ```js
        import Vue from 'vue'
        import App from './App'
        import router from './router'
        import Vuex from 'vuex'
        import store from './vuex/store'
        Vue.use(Vuex)
        Vue.config.productionTip = false
        new Vue({
          el: '#app',
          router,
          store,
          components: { App },
          template: '<App/>'
        })
        ```

    3. 通过2的全局引入之后，项目里的页面文件或组件文件就都可以使用了。使用时引入`store`文件，通过`this.$store.getters.name`直接访问；或者封装`getters`导出后通过`mapGetters`,`mapMutations`来调用全局状态数据和方法
* 兄弟组件之间的传参（通过事件总线eventBus）

## 六、el-table中formatter过滤器：
> vue3 不再支持filter过滤器
* formatter属性：在视图中，在 Vue 表格中，可以在相应需要处理的`<el-table-column>`列中加上属性项`:formatter=FunctionName`。将该列数据与处理函数进行绑定。
    ```html
    <el-table-column :formatter="regTypeFormatter" prop="regType" label="身份类型" min-width="100"/>
    ```
* 定义过滤器`filters`：在`script`中设置好之后可以在视图中引用；
> 过滤器可以串联：`{{ message | filterA | filterB }}`
```js
export default {
  components: { },
  filters: {
    formatStatus(status) {
      if (status === 2) {
        return "待确认"
      } else if (status === 3) {
        return "待发货"
      } else if (status === 4) {
        return "已驳回"
      } else if (status === 5) {
        return "已发货"
      } else {
        return "未知状态"
      }
    }
  },
  props: {
    takeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return { }
}
}
```


## 七、[vue中的`ref`和`$refs`](https://www.cnblogs.com/xumqfaith/p/7743387.html)

> `ref` 被用来给元素或子组件注册引用信息，引用信息将会注册在父组件的`$refs`对象上；
> 如在普通的`DOM`元素上使用，引用指向的就是`DOM`元素;
> 如用在子组件上，引用就**指向组件实例**。

> 关于`ref`注册时间，因`ref`本身是作为渲染结果被创建的，在初始渲染的时候你不能访问他们，他们还不存在。

> `$refs`也不是响应式的，因此不能试图用她在模板中做数据绑定。要避免在模板和计算属性中使用`$refs`


## 八、Vuex状态管理
`getters`：可以让你从`state`中派生出一些新的状态。`getter`的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算（类似于计算属性）。

`state`：虽然`state`和`data`有很多相似之处，但`state`在使用的时候一般被挂载到子组件的`computed`计算属性上，这样有利于`state`的值发生改变的时候及时响应给子组件。

`mapState`：`mapState`是`state`的辅助函数，返回`state`数据。

`mapGetters` 辅助函数仅仅是将`getter` 映射到局部计算属性
```js
    import { mapGetters } from 'vuex'
    export default {
    computed: {
      // 使用对象展开运算符将 getter 混入 computed 对象中
        ...mapGetters([
          'doneTodosCount',
          'anotherGetter',
       ])
      }
    }
    // 如果你想将一个 getter 属性另取一个名字，使用对象形式：
    mapGetters({
      // 映射 `this.doneCount` 为 `store.getters.doneTodosCount`
      doneCount: 'doneTodosCount'
    }）
    computed: {
      ...mapGetters(["elements"])
    },
```
`dispatch`：含有异步操作，例如向后台提交数据，写法 `this.$store.dispatch('action方法名',值)`

`commit`：同步操作，写法：`this.$store.commit('mutations方法名',值)`
```js
handleLogin() {
  this.$refs.loginForm.validate(valid => {
    if (valid) {
      this.loading = true;
      this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
        this.loading = false;
        const company_params = '/'+this.$store.getters.company_params;
        this.$router.push(company_params + "/dashboard");
      }).catch(() => {
        this.loading = false;
      });
    } else {
      return false;
    }
  });
},
```