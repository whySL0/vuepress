这篇文章是 19 年写的了，当时刚入职场，写一个文件预览功能就遇到坑了，所以记录了下。

当时解决问题最大的体会就是: **意识到平时看文档的重要性了**，真的要平时没事就多看看文档了，对官方的 API 有个印象了，一旦遇到什么特殊的需求，才能更快速的找到解决方法

## 第一种情况 : 后端返回要预览的文件路径

对于这种 后端直接返回要下载预览的文件是个路径可采用下面的方法:

调用`wx.downloadFile({})`下载文件，在`success`回调中调用`wx.saveFile({})`把文件保存在本地，在再`success`回调中拿到返回的文件临时地址，用`wx.openDocument({})`打开预览.

```js
wx.downloadFile({
  url: filepath,
  // url:"https://www. .../3468830325178368.pdf",
  success: function (res) {
    //保存文件到本地
    wx.saveFile({
      tempFilePath: res.tempFilePath,
      success(result) {
        var Path = result.savedFilePath;
        //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            console.log("打开文档成功");
          },
        });
      },
      fail(res) {
        wx.showToast({
          icon: "none",
          title: "下载失败",
        });
      },
    });
  },
});
```

## 第二种情况 : 后端返回二进制流文件

对于二进制流文件，用以下方法:

用小程序原生的请求`api`，`wx.request({})`，在`header`中传入`token`，定义响应内容为二进制流形式`responseType:'arraybuffer'`，通过`wx.getFileSystemManager().writeFile({})`，将下载回来的`data`写在一个新建的本地文件中，写完后调用`wx.openDocument({})`实现预览功能，代码如下:

```Javascript
 wx.request({
    url: app.globalData.apiUrl + '/swh/prepareOrder/download/' + id,
    header: {
      wmpToken: wx.getStorageSync("wmpToken")
    },
    responseType:'arraybuffer',
    success: function(res) {
      var data = res.data
      console.log(res,'111res')
      wx.getFileSystemManager().writeFile({
        filePath: `${wx.env.USER_DATA_PATH}/${purName + id}.pdf`,
        data:data,
        success: function (rest){
          console.log(rest, '111rest')
          wx.openDocument({
            filePath: `${wx.env.USER_DATA_PATH}/${purName + id}.pdf`,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        },
        complete: function (rest) {
          console.log(rest, 'complete')
        },
      })
    }
  })
```

需要注意:

1. 代码中，`${wx.env.USER_DATA_PATH}`是小程序自带的文件系统用户目录路径，若在小程序开发助手上，下载的文件目录为:**点击详情->文件系统->usr 目录**中;若在手机端上，则在`tencent\MicroMsg\wxanewfiles\.....`;
2. 另外，开发中还遇到一个小知识点，是文件下载下来之后打印出来，在开发助手上看是`http://..........`，用手机调试发现是`wxFile://.......`，不用太过纠结，这只是两种不同的协议.
