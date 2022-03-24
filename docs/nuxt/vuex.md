# `nuxt`的状态化存储

`nuxt`框架本身就内置了`Vuex`，不需要再额外引入。但如果项目中要启用状态树来管理状态，需要自己去新建`store`目录。

新建`store`目录后，`Nuxt.js`会自动再项目中引入`vuex`模块，将之加到`vendors`构建配置中去，并且设置`Vue`根示例的`store`配置项。

## 模块方式
在`src`目录中新建`store`目录，`store`目录下再新建`.js`文件，每个文件对应一个模块。默认`index`是根模块，`nuxt`也支持具名模块（自定义命名）。

具名模块在引用时，需要带上文件名，如下图：
![store-nuxt.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ba0577b0c9c42a3bb05d716e4a363c2~tplv-k3u1fbpfcp-watermark.image?)

## 模块文件注意事项
1. 模块文件，`state`值应该为`function`；`mutations`用于定义同步方法，提交修改`state`状态值；`actions`用于定义异步方法，官方建议不直接修改`state`值，而是通过`commit`调用`mutations`修改`state`状态值；写法如下：
```js
    export const state = () => ({
            dict: Cookies.get('dict') || {}
    })
    export const mutations = {
            SET_DICTINFO: (state, data) => {
                    state.dict = data;
                    Cookies.set('dict', data, { expires: 30 })
            }

    }
    export const actions = {
            // 获取数据字典
            getSysDict({ commit, state }) {
              return new Promise((resolve, reject) => {
                getDict().then(response => {
                  commit("SET_DICTINFO", response)
                  resolve(response)
                }).catch(error => {
                  reject(error)
                })
              })
            }
    }
```

2. 模块文件中的`state`、`action`、`mutation`和`getters`可分开文件存放，也可以放同个文件中。如上图，`getters`文件分开存放，`getters`文件写法如下：
```js
const getters = {
  // 指向根模块下的状态
  device: state => state.device,
  userInfo: state => state.userInfo,
  // 指向具名模块下的状态
  remark: state => state.upload.remark,
  purchaseUrl: state => state.upload.purchaseUrl,
  fileType: state => state.upload.fileType
}
export default getters
```

## 页面中使用store模块方法
1. 在`page`中引用`vuex`，`methods`中通过`this.$store.dispatch`调用`actions`异步方法，通过`this.$store.commit`调用`mutations`同步方法，通过`this.$store.state`拿到状态值，如下：
`page`中调用根模块下的`actions`方法：
```js
    logout() {
      this.$store.dispatch('logout').then(res => {
        setTimeout(()=>{
          this.$router.push('/')
          this.$forceUpdate();
        })
      }).catch(err => {

      })
    },
```
`page`中调用具名文件下的`mutations`方法：
```js
    this.$store.commit('upload/SET_WEBKIT_DIRECTORY', false)
```
2. 通过辅助函数 `mapGetters`、`mapState`、`mapMutations`、`mapActions`
`mapGetters` 相当于计算属性，通过对`state`进行处理转换，返回需要的值，在`page`中的写法如下：
```js
    computed: {
      ...mapGetters(['userInfo']), 
    },
```
`mapState`，用法与`mapGetters`差不多，但它只是`state`的简单映射
```js
    computed: {
      ...mapState(['userInfo']), 
    },
```
`mapMutations`跟`mapActions`的用法同上面差不多
```
    methods: {
      ...mapMutations(['SET_OPENSTAFF']),
      askForDeploy() {
        this.SET_OPENSTAFF(true)
      }
    }
  }
```
## 注意事项
1. `store`下的模块不能跨文件修改其它模块中的`state`
2. 若项目中有设置状态树，`nuxt.js`在服务端初始化时(`nuxtServerInit`)，`Vuex`被调用并且可预填存储`vuex`，这里涉及到`nuxt`的生命周期，具体的查看下一篇文章~