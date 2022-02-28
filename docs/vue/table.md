
# `vue-element` 封装一个`table`选择组件

## 一些开发过程中的坑
这篇文章是20年年初写的，当时封装了个`table`选择组件，支持多选和单选，过程中踩了很多坑，也学到了很多，(以下都是基于`Vue.js2.x`)：

1. `props` 传回来的数据是不允许修改的，只能监听。
2. 修改`this`中对象或数组的值时，最好先复制一份`temp`出来，对`temp`进行数据操作，再把整个`temp`赋到`data`中，原因是**数组其实是一个引用值（改引用值指向真实的数据）**，当修改了数组中的数据，**引用值其实是不变的**，所以无法监听到数据有所更改而渲染页面。
3. 关于`element`的`dialog`有个问题，我用`dialog`嵌套`table`，当`table`列数太多，`width`太大的时候，点击行时整个`dialog`都会跟着抖动了下，查了方法，改了很久，最后也……还是会。很心累，但是，我换成了`element`的**抽屉组件**，就不会有这个问题。
4. `form`表单的自动校验项要在`data`中初始化，不要在`computed`中定义，会有问题。
5. 关于计算属性的问题，`computed`属性里默认只有`getter`，没有`setter`，即`computed`的数据是只读属性的。需要自己手动定义一下`set`方法。
    - `get`方法 是取，即给变量赋值
    - `set`方法 当变量值发生改变后会出发`set`方法。
6. 记一个困扰了我1个多小时的问题~有个页面，调用了多个组件，其中有2个组件的`name`是一样的，导致我整个页面白屏，一直在重复请求一个接口。以后一定要注意每个组件的`name`值都设成唯一的值，不要重复。
7. 另外，还有一个问题，关于`select`框的回显，我从接口已经拿到`select`的`key`值，`select`选择列表也已经有了，但是渲染出来的就始终是`key`，没有显示`label`名称，排除了：
    - 设置`setTimeout`,确保列表数据已经拿到再来给选择赋值
    - 用`v-if`，让数据全部拿到之后重新渲染
    - 用`this.$nextTick(()=>{})`,强制刷新
~~    用了以上3个方法，仍然不行，最后用`typeof` 发现，列表里的返回的key类型是`number`,接口获取到的选择值是`stirng`,~~~~晕死~~~~

## 可跨页选择的`table`组件
封装`el-table`组件，命名为`list-table`：
1. 组件中定义传参：`table`请求的列表接口`api`(`function`)、查询参数(`object`)、单选||多选(`boolean`)、已选择的`key`(`array`)，后续的再根据需求增加
2. 通过`$emit`定义选择框的方法,并将选择的数据传回给父组件（含有点击行选择，点击checkbox多选，点击radio单选，全选，手动选择）
3. 需要实现跨页选择，即点击分页跳转之后勾选数据，选择的列表要往上叠加，不能丢失。需要在`el-table`中添加`:row-key="getRowKeys`,`el-table-column`中添加`:reserve-selection="true"`,定义`type="selection"`，如下： 
```html
  <el-table-column :reserve-selection="true" :row-key="item.id" fixed="left" type="selection" class="selection" :prop="item.id" width="50" align="center"/>
```
`getRowKeys`方法：
```js
getRowKeys(row) { return row[this.id] },
```
4. 根据传过来的已选择的唯一ID数组，循环列表勾选上
```javascript
  // 判断是否为选中状态
    ifChooseData() {
      if(this.multi) {
        this.$refs['listTableObject'].clearSelection();
        var tempList = this.tempList || this.tempData;
        for(let j=0; j<tempList.length; j++) {
          this.$nextTick(() => {
            this.list.forEach(item => {
              if(item[this.id] == tempList[j]) {
                this.$refs['listTableObject'].toggleRowSelection(item,true)
              } else {
                // this.$refs['listTableObject'].toggleRowSelection(item,false)
              }
            })
          })
        }
      }
    }
```
5. 通过slot插槽，在父组件中自定义table列数据；并且添加分页组件，具体代码如下： 
```html
   <template>
     <div class="zsl-table">
       <el-table
         v-loading="queryLoading"
         :data="list"
         v-bind="$attrs"
         :default-sort="sort"
         highlight-current-row
         :row-key="getRowKeys"
         stripe
         fit
         border
         use-virtual
         :span-method="objectSpanMethod"
         ref="listTableObject"
         @current-change="getCurrentChange"
         @row-click="getRowSelect"
         @select="getChangeSelect"
         @select-all="getAllSelect"
         @selection-change="handleSelectionChange">
         <slot/>
       </el-table>
       <div class="zsl-table-pagination">
         <pagination :page="page" @paging="pages" />
       </div>
     </div>
   </template>
```
methods方法：
```javascript
   getRowKeys(row) {
     return row[this.id]
   },
   async getList() {
     try {
       this.queryLoading = true
       const params = { ...this.params, ...this.page }

       if (typeof this.api !== 'function') {
         this.queryLoading = false;
         throw new Error('api应该传入一个方法')
         return;
       } else {
         const res = await this.api(params);
         let data = res.data.data
           this.list = data.datas;
           this.page = {
             pageNum: data.pageNum,
             pageSize: data.pageSize,
             total: data.total,
             pages: data.pages
           }
           this.$emit('getTableData', data.datas)
       }
       this.ifChooseData();
     } catch (e) {
       // throw new Error('处理异常')
       throw e
     }
     this.queryLoading = false;
   },
   // 判断是否为选中状态
   ifChooseData(){
     if(this.multi) {
       this.$refs['listTableObject'].clearSelection();
       var tempList = this.tempList || this.tempData;
       for(let j=0; j<tempList.length; j++) {
         this.$nextTick(() => {
           this.list.forEach(item => {
             if(item[this.id] == tempList[j]) {
               this.$refs['listTableObject'].toggleRowSelection(item,true)
             } else {
               // this.$refs['listTableObject'].toggleRowSelection(item,false)
             }
           })
         })
       }
     }
   },
   pages(newPage) {
     this.page = newPage;
     this.getList()
   },
   _resetPage() {
     this.page = defaultPage(this.page)
   },
   reload() {
     this.$nextTick(() => {
       this._resetPage()
       this.getList()
     })
   },
   // 暴露获取选中的方法
   get_listTableObject() {
     console.debug(this.$refs.listTableObject)
   },
   getCurrentChange(val) {
     this.currentRow = val;
     this.$emit('getCurrentChange',val)
   },
   getRowSelect(row,column,event) {
     this.$refs['listTableObject'].toggleRowSelection(row)
     this.$emit('getRowSelect',row,column,event)
   },
   getChangeSelect(selectItem,changItem){
     this.$emit('getChangeSelect',selectItem,changItem)
   },
   handleSelectionChange(val) {
     // this.$refs['listTableObject'].toggleRowSelection(val)
     this.$emit('handleSelectionChange', val)
   },
   getAllSelect(val) {
     this.$emit('getAllSelect', val)
   }
```
    
## 封装多选组件：

1. 调用list-table组件
2. 布局方面，用`flex`布局，左边70%的`table`，右边30%的选择列表，将选择的列表存到`selectedList`对象中，选中的唯一key存在`tempList`数组中，`tempList`用于遍历渲染选择列表框。点击选定退出或取消的时候，把`selectedList`传回给父组件。
3. `methods`方法里，将`list-table`选择返回来的对象，进行判断，如果不存在则`push`进数组，存在则用`splice`方法去除项，关键代码如下：
methods方法： 
```js
  getTableData(data) {
    this.tableList = data;
  },
  reloadTable() {
    this.$refs.tableData.reload();
  },
  resetQuery() {
    this.param = this.query;
    this.reloadTable();
  },
  handleSelectionChange(row) {
    var temp = [];
    var selectedList = {};
    for(let i=0;i<row.length;i++) {
      let item = row[i]
      let index = item[this.id]
      temp.push(index);
      selectedList[index] = item;
    }
    this.tempList = deepClone(temp)
    this.selectedList = deepClone(selectedList)
  },
  getRowSelect(row, column, event) {
    var temp = this.tempList;
    let index = temp.findIndex(item => item == row[this.id]);
    let i_index = row[this.id]
    if(index>=0) {
      temp.splice(index, 1);
      delete this.selectedList[i_index]
    } else {
      temp.push(i_index);
      this.selectedList[i_index] = row;
    }
    this.tempList = deepClone(temp)
  },
  getChangeSelect(selectItem,changItem){
    var temp = this.tempList;
    let i_index = changItem[this.id]
    if(selectItem.indexOfObj(changItem,this.id) >= 0) {
      let index = temp.findIndex(k => k == i_index)
      if(index>=0) {

      }else {
        temp.push(i_index)
        this.selectedList[i_index] = changItem;
      }
    } else {
      let index = temp.findIndex(k => k == i_index)
      if(index >= 0) {
          temp.splice(index, 1)
          delete this.selectedList[i_index]
      } else {}
    }
    this.tempList = deepClone(temp)
  },
  getAllSelect(val) {
    var temp = this.tempList;
    if (val.length > 0) {
      for (let i = 0; i < val.length; i++) {
        let item = val[i];
        let i_index = item[this.id];
        if (temp.findIndex(i_item => i_item == i_index) < 0) {
          temp.push(i_index);
          this.selectedList[i_index] = item;
        } else {}
      }
    }else {
      for (let i = 0; i < this.tableList.length; i++) {
        let item = this.tableList[i]
        let i_index = item[this.id]
        let index = temp.findIndex(i_item => i_item == i_index);
        if (index >= 0) {
          temp.splice(index, 1);
          delete this.selectedList[i_index];
        } else {}
      }
    }
    this.tempList = deepClone(temp)
  },
  handleChoose() {
    this.$emit('handleChoose', this.selectedList)
  },
  cancelChoose() {
    this.tempList = []
    for(let k in this.selectedList) {
      delete this.selectedList[k]
    }
    this.selectedList = {};
    this.$emit('handleChoose', this.selectedList)
  }
  ```    
## 封装单选组件：
1. 就类似与多选组件，只是不需要定义那么多方法，只需要**行点击方法**，以及`radio`点击方法即可，并且不需要多加一个选择列的框框，在`template`中，把`type='checkbox'`的`el-table-column`改成用`template`自定义成`radio`，代码跟上一个类似就不贴了。
