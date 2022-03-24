---
theme: orange
---

## 面试题

记一道我之前面试的时候的一道题：完整的题面不记得了，只记得大概要求

1. **基础题：** 写一个方法：传参数字，若传参 3，生成类似如下表格
   | 1 | 1 | 1 |
   | --- | --- |--- |
   | 2 | 2 | 2 |
   | 3 | 3 | 3 |

传参 4 的话，生成如下表格
| 1 | 1 | 1 | 1 |
| --- | --- | --- | --- |
| 2 | 2 | 2 | 2 |
| 3 | 3 | 3 | 3 |
| 4 | 4 | 4 | 4 |

以此类推

我的思路是：

- `num`为传参，先初始化一个长度为`num`的数组，数组元素填充**1**；初始化一定长度的数组：`new Array(length)` ，数组填充值`.fill()`；
- 遍历数组，给每个元素初始化为长度为`num`的数组，并填充**索引值+1**；这里用到`map`遍历方法，`map`需要`return`

```js
function arr(num) {
  return new Array(num).fill(1).map((item, i) => {
    return new Array(num).fill(i + 1);
  });
}
```

运行结果如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c14d29b291d245d48634f116f44a1459~tplv-k3u1fbpfcp-watermark.image?) 2. **扩展题** 在 1 的基础上，变换下生成的表格内容，如下：
| 1 | 2 | 3 |
| --- | --- |--- |
| 6 | 5 | 4 |
| 7 | 8 | 9 |

| 1   | 2   | 3   | 4   |
| --- | --- | --- | --- |
| 8   | 7   | 6   | 5   |
| 9   | 10  | 11  | 12  |
| 16  | 15  | 14  | 13  |

以此类推
我的思路是：

- 在 1 的基础上，初始化`num`长度的数组，数组填充 1
- `map`方法，给数组中元素再初始化长度为`num`的数组，**预设 1**，首位预设 `索引*num + 1`，**这里要注意的是，一定要给数组预设一个值，否则，`new Array(num)`出来的数组实际上是`empty*num`，都是空的，遍历器无法遍历取到`index`跟`item`，如下图**

  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b536de1794ce4526b0ee6e5c0e07fe56~tplv-k3u1fbpfcp-watermark.image?)

- 二维数组再`map`遍历一次，除去第一个值，剩余值累加+1
- 判断奇数行和偶数行，从 0 数起，奇数行需要`reverse()`,奇偶数通过`对2取余`判断
- `return arry;` 将拼接完成的数组返回出来

```js
function arr(num) {
  let array = new Array(num).fill(1).map((item, i) => {
    let arrItem = new Array(num).fill(1).fill(i * num + 1, 0, 1);
    let res = arrItem.map((val, key) => {
      return key === 0 ? val : key + arrItem[0];
    });
    return i % 2 === 1 ? res.reverse() : res;
  });
  return array;
}
```

运行结果如下：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d6a0e6179ed4b6c92c49703d2330d23~tplv-k3u1fbpfcp-watermark.image?)

## 反思

这次笔试题，写完后自己在`console`里面试了下发现有问题，`forEach` 和 `map`用错了，`reduce`方法也用错了~

基础还是不够扎实，于是趁这次机会要来巩固下数组字符串切割等的各种方法了~

### `map`遍历

不会改变原来的数组，返回一个新数组

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff08adda2f754800b94ce2e12f141537~tplv-k3u1fbpfcp-watermark.image?)

### `forEach`遍历

用于对数组中元素进行操作，不改变原数组的值，返回值为`undefined`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c242e13650a4bec82eecaacbe5ab0cf~tplv-k3u1fbpfcp-watermark.image?)

### `filter`过滤器 筛选数组

`filter`用来筛选符合条件的值，返回一个新的数组，不会对原来数组进行修改

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/742818b69e6f4bed9c2c9426bbeee590~tplv-k3u1fbpfcp-watermark.image?)

### `reduce`求数组总和

常见用法如下：

1. 不额外传参：`reduce((sum,item,index)=>{return sum+item})` 该方法表示从数组的**第 1 个**(即索引值`index`为 1)开始循环，`sum`初始值为数组下标为 0 的值
2. 传初始值：`reduce((sum,item,index)=>{return sum+item}, initData)` 该方法表示，从数组**第 0 个**（即索引值`index`为 0）开始循环，`sum`初始值为`initData`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0025e39681a84abb8f0d1c32ce9f76f7~tplv-k3u1fbpfcp-watermark.image?)

### `fill`方法 给数组批量填充值

`fill`用于给数组初始化赋值，常见用法有以下

1. `array.fill(data)`: 只传一个参，表示给数组每个元素赋值`data`
2. `array.fill(data, startIndex, endIndex)`: 表示给数组索引值为`startIndex`到`endIndex`之间的赋值`data`
3. `array.fill(data, startIndex)`: 表示给数组从`startIndex`索引值开始赋值`data`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eabf2090f85349ea92432d5fa49b080e~tplv-k3u1fbpfcp-watermark.image?)

### `splice`方法

`array.splice(index, howmany ,item1……itemX)` 删除或新增元素，会修改到原有数组，若删除，返回删除元素组成的数组

1. `arr.splice(index, 0, item1……itemX)` 表示从`index`索引后插入`item……itemX`数据

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6e983d08d3a44e98a25e1f31a7f662b~tplv-k3u1fbpfcp-watermark.image?)

2. `arr.splice(index, howmany)` 表示从`index`索引开始删除`howmany`个值，返回被删除元素组成的数组

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faae7a1b8a944407a547dd5f2cc1e435~tplv-k3u1fbpfcp-watermark.image?)

3. `arr.splice(index, howmany, item1……itemX)` 表示从`index`索引开始删除`howmany`个值，并插入`item……itemX`数据，返回被删除元素组成的数组

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b02da8639c9d4b89b23931da6c08c578~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66aab213aacd4b7ab0411fef3c2dcb1b~tplv-k3u1fbpfcp-watermark.image?)

### `split`方法

`str.split()`, 指定分隔符将字符串分割成数组，分隔符传参可为字符串或者正则

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7275403ec6e64b1fb8c9bda15ea895be~tplv-k3u1fbpfcp-watermark.image?)

### `slice`方法

`slice(start[, end])`, `start` `end`为正整数或负整数，用于切割字符串，不改变原有字符串

### `substring`

`substring(start[, end])`, `start` `end`均为非负整数，用于切割字符串，不改变原有字符串

### `substr`

`substr(start[, length])`， `start`可为负数，表示倒数第几个，用于切割字符串，不改变原有字符串

## 总结

### 1、会改变原有数组或字符串的方法

- `splice`：原有数组进行新增或删除操作，并且返回被删除元素组成的数组
- `fill`： 原有数组预填值

### 2、不会改变原有数组或字符串的方法

- `slice(start[, end])`: 返回切割的字符串，`start`和`end`可为负数
- `substring（start[, end])`: 返回切割的字符串，`start`和`end`不可为负数
- `substr(start[, length])`: 返回切割的字符串，`start`可为负数
- `split()`: 指定分隔符分割成数组，分隔符可用字符串或正则
- `filter`： 过滤器，返回符合要求的数组
- `forEach`: 遍历数组，对每个元素进行操作，返回值为 `undefined`
- `reduce`: 求和方法
- `map`： 对原有数组进行操作，返回一个新数组

### 3、记一些别的常用的方法

- `findIndex`: 返回符合要求的第一个索引
- `find`: 返回符合要求的第一个`item`
- `some`: 若有满足条件的值则返回`true`，否则返回`false`
- `every`: 若所有值都满足条件返回`true`，否则返回`false`
- `includes`: 数组中若包含某一项返回`true`，否则返回`false`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f395be6556994b2ba26c995754a1f3c0~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f84bc245271d487ab2962c4987adcc64~tplv-k3u1fbpfcp-watermark.image?)
