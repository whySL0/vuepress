### 一、一些无法兼容的限制

- `vuetify`,`element`等 UI 组件，需要等待它们的 vue3 兼容版本
- vue3 不再支持 ie11
- vue3 支持服务端渲染，思路是`vite`(包渲染器) + 将`vue-server-renderer` 替换成 `@vue/server-renderer`; 如果使用`nuxt`,最好等待下`nuxt3`。

### 二、模板指令的更改

#### 1、v-if 和 v-for 优先级更改

- vue2: `v-for` 大于 `v-if`
- vue3: `v-if` 大于 `v-for`

#### 2、v-model（:name 多个参数的绑定方法） 修饰符

- `v-model.trim`, `.number`, `.lazy`(原本就有的内置修饰符)
- `v-model.sync`
- `v-model.capitalize`（自定义修饰符），官网示例：

```html
<div id="app">
  <my-component v-model:description.capitalize="myText"></my-component>
  {{ myText }}
</div>
```

```javascript
const app = Vue.createApp({
  data() {
    return {
      myText: "",
    };
  },
});

app.component("my-component", {
  props: {
    description: String,
    descriptionModifiers: {
      default: () => ({}),
    },
  },
  emits: ["update:description"],
  methods: {
    emitValue(e) {
      let value = e.target.value;
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      this.$emit("update:description", value);
    },
  },
  template: `<input
            type="text"
            :value="description"
            @input="emitValue">`,
});

app.mount("#app");
```

#### 3、生命周期钩子更改

1.  名称更改

    **vue2**-------------------------- **vue3 组件生命周期**

                                     setup（组件创建前，props解析完成后进入）
        beforeCreate                 -
        created                      -
        beforeMount                  onBeforeMount
        mounted                      onMounted
        beforeUpdate                 onBeforeUpdate
        updated                      onUpdated
        beforeDestroy                onBeforeUnmount
        destroyed                    onUnmounted
        activated                    onActivated
        deactivated                  onDeactivated
        errorCaptured                onErrorCaptured
        renderTracked                onRenderTracked
        renderTriggered              onRenderTriggered

2.  生命周期钩子使用方法：

### 三、API 事件

#### 1、事件监听方法`$on`, `$off`, `$once`已被移除

vue3 不推荐使用事件总线，官方推荐：

- 父子组件的通信：使用`props`和`$emit`
- 组件之间的通信：使用`provide`和`inject`
- 全局状态管理`vuex`。
- 实在需要的话，可以通过依赖包，如`mitt`或`tiny-emitter`

### 四、组合式 API

#### 1、概念了解

vue2.x 中组件通过`data`,`computed`,`watch`,`methods`选项来组织逻辑，在大型组件中，查看逻辑关注点时，需要不停的跳转到相关代码的选项块，这种碎片化阅读增加了开发者阅读和理解代码的难度，于是引入**组合式 API**，即`<script setup>`

> `<script setup>`依赖单文件组件的上下文，引用外部文件容易造成上下文指向混乱，因此`<script setup>`**不支持与 src 一起使用**

**执行时间**：**组件创建之前 props 解析完成之后**（该阶段不能使用 this，此时未有组件实例，`data`,`computed`,`methods`等属性未解析完成）

**ref 响应式变量**（响应式引用）：

1. ref 接收**props**和**context**并**返回一个带有 value 属性的对象**，返回的对象可通过 value 属性赋值；**props**是**响应式**的不能用 es6 的解构赋值，会消除 props 的响应式；
2. **context**是普通的 js 对象，可通过 es6 解构赋值，`{attrs, slots, emit, expose} = context`，其中：`attrs === $attrs, slots === $slots, emit === $emit, expose === property`

**watch 属性**：`toRefs`(props)创建响应式引用之后，通过 watch 设置监听

**computed 属性**：同 vue2 `getter`类似，`computed`函数返回一个**只读的**响应式应用

#### 2、组件使用方法

> 组件**只要引入即可**，不需要在 components 注册，组件调用官方建议**大驼峰**式命名

**动态组件**：用`:is`来绑定 `<component :is="someCondition ? Foo : Bar" />`

**递归组件**：单文件组件可以通过文件名被自己所引用，递归组件优先级<import 导入的组件，为防止命名冲突，引用时支持定义别名 `import { FooBar as FooBarChild } from './components' `

**命名空间组件**：使用场景为从单个文件中导入多个组件

**自定义组件**：同普通组件一样，引入不必再注册；组件支持定义别名；

> 必须以  `vNameOfDirective`  的形式来命名本地自定义指令，以使得它们可以直接在模板中使用。

### 四、状态驱动的动态 css

#### 1、作用域样式 `<sytle module>`中定义的样式 通过`$style`对象的键暴露给`template`，支持自定义注入名称`<style module="classes">`，支持与组合式 API 一同使用，`useCssModule('classes')`

#### 2、单文件组件的`style`可以通过`v-bind`绑定变量，setup 中也适用，具体可看[vue 官方文档](https://v3.cn.vuejs.org/api/sfc-style.html#%E7%8A%B6%E6%80%81%E9%A9%B1%E5%8A%A8%E7%9A%84%E5%8A%A8%E6%80%81-css)
