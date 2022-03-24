
# **企业微信**中**考试**功能的实现
## 企业微信中获取用户信息
代码实现： 
1. 在`mounted`时获取用户信息；方法依赖于企业微信`OAuth2`，使用企业微信提供的`API`需要注意： **重定向的访问链接需要为可信域名**
2. 构造网页授权链接，链接写法如右：`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(redirectHref())}&response_type=code&scope=snsapi_base&state=${this.hash}#wechat_redirect`，该链接中需要视情况自行更改以下几个参数传参
    - `appid`: 企业的corpId
    - `redirect_uri`: 授权后重定向的链接（如1所说，该链接需要为合法域名）
    - `state`: 重定向后带上的state参数，长度不可超过128个字节
    ```js
    // 跳转到企业微信认证信息页面
    navQyAuthorize() {
      const w_href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(redirectHref())}&response_type=code&scope=snsapi_base&state=${this.hash}#wechat_redirect`
      // 换个跳转方式 测试苹果跳转不过来问题
      window.open(w_href, '_self');
    },
    ```
    自此，用户授权成功之后，页面会自动重定向到`redirect_uri?code=XXXX……&state=XXXX`

3. 通过第2步，我们就拿到了`code`，再通过`code`请求后端接口返回用户信息（后端通过企业微信的`API`获取用户信息），代码如下：
```js
methods: {
    getUserInfo() {
        // 域名访问，走企业微信认证API
        if (checkNull(this.query.code) || this.query.code === localStorage.getItem('code') ) {
          // 重定向到授权页面
          this.navQyAuthorize();
        } else {
          // 已经获得code，通过后端接口获取用户信息
          localStorage.setItem('code', this.query.code)
          get_wx_code(this.query.code).then((res) => {
            this.getWxCodeRes = res
            let user_id = res;
            this.qywxUserId = user_id;
            // 绑定企业微信用户信息
            this.handelGetUserInfo(user_id);
          }).catch((err) => {
           
          })
        }
      }
    },
}
```
4. 最后完善，代码如下：
- 但是该功能就无法在IP环境下正常走流程，所以需要留个后门，通过判断`location.href`为`IP`的话，传工号或者默认一个工号，直接调用接口获取用户信息
- 对于网络不稳定或者其他，有授权失败的情况发生，若发生授权失败>=3次，弹框提示获取用户信息失败；若失败次数<3，则重复跳转至授权页面。失败次数通过写入本地缓存来记录
    ```js
    mounted() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
          let userId = getUserId();
          if (userId) {
            // url地址后面带userId，直接走这里，获取对应用户信息（便于测试）
            this.handelGetUserInfo(userId);
          } else if (ifDebug()) {
            // IP地址访问的，直接取固定工号（若无带上工号，直接获取固定工号企业微信用户信息）
            let test_user_id = '******'
            this.handelGetUserInfo(test_user_id);
          } else {
            // 域名访问，走企业微信认证API
            if (checkNull(this.query.code) || this.query.code === localStorage.getItem('code') ) {
              this.navQyAuthorize();
            } else {
              // 获得code
              localStorage.setItem('code', this.query.code)
              get_wx_code(this.query.code).then((res) => {
                this.getWxCodeRes = res
                let user_id = res;
                this.qywxUserId = user_id;
                // 获取code成功之后navQyAuthorizeFailTime设为0
                localStorage.setItem('navQyAuthorizeFailTime', '0')
                // 绑定企业微信用户信息
                this.handelGetUserInfo(user_id);
              }).catch((err) => {
                // 跳转失败次数超过3次，就不跳转
                let navQyAuthorizeFailTime = localStorage.getItem('navQyAuthorizeFailTime') - 0;
                if(navQyAuthorizeFailTime < 3) {
                  localStorage.setItem('navQyAuthorizeFailTime', navQyAuthorizeFailTime + 1)
                  this.navQyAuthorize();
                } else {
                  this.$alert('获取用户信息失败')
                }
              })
            }
          }
        },
    }
    ```

## 考试功能的实现
1. 需求：
- 用户每提交一道题都要记录起来，考试中途可退出，重新进时要带出用户之前所答题的记录。
- 考试设置时长，超出一定时间自动交卷，一旦进入考试页面就计时开始。
- 考试未完成，用户点击提交时，需要判断未答题目并做提示
2. 采用方案
- 方案1：使用`websocket`，订阅两个消息，一个是服务端时间，用于判断超时自动提交考卷；一个是历史所答题目。用户每答一次题目，就将题目通过`websocket``send`出去，代码如下：
```js
    getQuestion() {
        // ……………………获取题目，获取题目后建立websocket连接
        this.connectionSocket();
    },
    connectionSocket() {
        let that = this;
        this.socket = new SockJS('/XX/XXXXX/ws');//连接SockJS的endpoint
        // 获取STOMP子协议的客户端对象
        this.stompClient = Stomp.over(this.socket);
        // 定义客户端的认证信息,按需求配置
        let headers = {};
        // 向服务器发起websocket连接
        this.stompClient.connect(headers, function(frame){
            // 连接成功
            that.websocketMark = true;
            console.debug("已连接上webscoket", frame);
            // 订阅消息
            that.stompClient.subscribe('/XXXX/timestamp', function (response) {
                var returnData = JSON.parse(response.body);
                console.debug("已成功订阅 服务端返回 当前时间戳", returnData);
                if((that.quesData.examLimitSecond-0) + (that.quesData.startMillion-0) <= (returnData-0)) {
                    // 已提交考试并且弹出来弹框
                    if(that.examinationResVisible) return;
                    that.$message({
                        type: 'warning',
                        message: '考试时间已到，正在提交试卷',
                        customClass: 'mobileConfirm',
                        duration: 3000
                    })
                    clearInterval(that.timer);
                    that.timer = null;
                    that.handleSubmit();
                }
            });
            that.stompClient.subscribe('XXXX/save', function (response) {
                var returnData = JSON.parse(response.body);
                console.debug("已成功订阅 保存", returnData);
            });
            that.timer = setInterval(() => {
                that.send();
            }, 5000);

        }, function(err){
            // 连接失败
            that.websocketMark = false;

        });
    },

    closeWebSocket() {
        if(this.stompClient) {
            this.stompClient.disconnect()
            this.stompClient = null;
            this.socket = null;
        }
        if(this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

    },
    //发送消息，获取服务器时间
    send() {
        if(this.stompClient) this.stompClient.send(`XXXX/timestamp`, {});
    },

    // 发送答题内容
    sendSelection(item) {
        // 此处省略 提交答题记录格式的转化
        let messageJson = JSON.stringify({this.data.XXX});
        this.stompClient.send(`/XXXX/save`, {}, messageJson);
    },
    handleConfirmSubmit() {
        // 提交答题记录，并做响应弹框提示
        let questionData = this.handleQuestion();
        if(this.notAnswerData) {
            this.$msgbox({
                title: '',
                message: `<p>您好，您的答题中，题号： </p><p style="color: red;">${this.notAnswerData}</p><p>未完成选择，请完善答题！</p>`,
                dangerouslyUseHTMLString: true,
                customClass: 'mobileConfirm',
                closeOnClickModal: false,
                showClose: false,
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: '继续答题',
                center: true
            })
        } else {
            Dialog.confirm({
                message: '请确认是否提交考试？',
                confirmButtonText: '是',
                confirmButtonColor: '#000',
                cancelButtonText: '否'

            }).then((res) => {
                this.handleSubmit(questionData);
            }).catch(()=>{

            })

        }

    },
    async handleSubmit(answersList = this.handleQuestion()) {
        let handleData = {
            // 处理数据格式
        }
        try {
            let res = await apiJudgeQuestion(handleData);
            if(res) {
                this.examinationResDialog = res;
                this.examinationResVisible = true;
            }
        } catch (e) {
            console.debug('评分失败', e)
        }

    },

beforeDestroy() {
    this.closeWebSocket();
    if(this.getTimeStampTimeout) {
        clearInterval(this.getTimeStampTimeout);
        this.getTimeStampTimeout = null;
    }
}
```
- 方案2： 不使用`websocket`，用户历史答题记录，在`mounted`时通过接口返回；**超时**的判断通过设置**定时器**，定时请求**服务器时间**来做是否超时判断，用户答题的保存也直接通过**点击事件触发请求**接口即可，重点代码如下：
```js
getQuestion() {
    // ……………………获取题目，获取题目后设置定时器
    this.getTimeStampTimeout = setInterval(() => {
        this.getTimeStamp();
    })
}, 
// 获取服务端当前时间
getTimeStamp() {
    apiGetTimestamp().then(returnData => {
        if ((this.quesData.examLimitSecond - 0) + (this.quesData.startMillion - 0) <= (returnData - 0)) {
            // 清除定时器
            clearInterval(this.getTimeStampTimeout);
            this.getTimeStampTimeout = null;
            // 先去掉
            this.$message({
                type: 'warning',
                message: '考试时间已到，正在提交试卷',
                customClass: 'mobileConfirm',
                duration: 3000
            })
            this.handleSubmit();
        }
    })
},
```






