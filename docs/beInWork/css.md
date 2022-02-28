去年有一段时间，写了好几个大屏，有一些动效觉得挺实用的，记录如下，也有一些还不错的插件也记录下。
## 一个会动的渐变色背景
![linear-bg.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eb5e9688e8646a0845c65583e3c6941~tplv-k3u1fbpfcp-watermark.image?)

代码如下：
```scss
/* ************ 渐变背景色配置 **************** */
@property --colorA {
  syntax: '<color>';
  inherits: false;
  initial-value: fuchsia;
}
@property --colorC {
  syntax: '<color>';
  inherits: false;
  initial-value: #f79188;
}
@property --colorF {
  syntax: '<color>';
  inherits: false;
  initial-value: red;
}

.linear-gradient-bg {
    background: linear-gradient(45deg,
        var(--colorA),
        var(--colorC),
        var(--colorF));
    animation: change 10s infinite linear;
}
@keyframes change {
    20% {
        --colorA: red;
        --colorC: #a93ee0;
        --colorF: fuchsia;
    }
    40% {
        --colorA: #ff3c41;
        --colorC: #e228a0;
        --colorF: #2e4c96;
    }
    60% {
        --colorA: orange;
        --colorC: green;
        --colorF: teal;
    }
    80% {
        --colorA: #ae63e4;
        --colorC: #0ebeff;
        --colorF: #efc371;
    }
}
```
## 翻转卡片

![xyifh-o0jy2.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3589b457971d4d7d9708c17b973e421f~tplv-k3u1fbpfcp-watermark.image?)

外层的`card`盒子用来设置动画，通过`rotateY`设置卡片沿着Y轴3D旋转。
里层的两个`div`，用来放翻转替换要展示的内容，需要注意以下几点：
1. 需要设置绝对定位；
2. 正面的盒子正常显示，反面的需要设置`rotateY(180deg)`翻转（普通图片可以不需要，但如果有带文字，需要加上，否则文字左右是反的），如下图：

   ![微信图片_20220222135026.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd6adc33f46649e5b0c6641d10898759~tplv-k3u1fbpfcp-watermark.image?)
 
3. 通过`backface-visibility`设置定义当元素背面向屏幕时不可见；
4. 需要设置不透明的背景色，否则背面`div`中的文字会叠加展示出来；

代码如下：
```html
<div class="perspective">
        <div class="card">
                <div class="easy-text-box">
                        <div class="easy-text-top"></div>
                        <div class="easy-text-bottom"></div>
                </div>
                <div class="easy-text-box2">
                        <div class="easy-text-top2"></div>
                        <div class="easy-text-bottom2"></div>
                </div>
        </div>
</div>
```
```css
.card {
        width: 212px;
        height: 88px;
        transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
        transform-style: preserve-3d;
        -webkit-animation-name: mymove;
        -webkit-animation-duration: 20s;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
        -webkit-animation-delay: 0s;
}
@keyframes mymove {
        0% { transform: rotateY(0deg); } 
        41% { transform: rotateY(0deg); } 
        50% { transform: rotateY(180deg);}
        90% { transform: rotateY(180deg); }
        99% { transform: rotateY(0deg); }
        100% {}
}
.easy-text-box {
        z-index: 5;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
}
.easy-text-box2 {
    transform: rotateY(180deg)    
}

.easy-text-box, .easy-text-box2 {
    background-color: #091223;
    box-shadow: inset 0px 0px 59px 0px rgb(14 62 184 / 20%);
    border-radius: 9px;
    width: 206px;
    height: 81px;
    margin: 3px;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.easy-text-top, .easy-text-top2 {
	font-size: 30px;
	font-weight: bold;
	line-height: 30px;
	letter-spacing: 0px;
	color: #00e4ff;
  word-break: break-all;
  width: 100%;
  text-align: center;
}
.easy-text-bottom, .easy-text-bottom2 {
        width: 123px;
        height: 19px;
        background-image: linear-gradient(90deg, #006ae1 0%, #16b7ff 100%), linear-gradient( #4895fc, #4895fc);
        font-size: 12px;
        letter-spacing: 1px;
        font-weight: bold;
        color: #ffffff;
        margin-top: 8px;
        text-align: center;
        line-height: 19px;
        border-radius: 4px;
}
```

## 一个小tip
通过设置两个`div`，背景图用亮色点的条条，在边框或其它线条中，设置动画，向右缓缓移动直至消失，（如下图）就会有种高级感；

![qt03e-as44o.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cf047ae91f143caa7615fdfde409f87~tplv-k3u1fbpfcp-watermark.image?)
## 关于列表轮播

可用下`jquery`的一个插件[`liMarquee`](https://www.dowebok.com/188.html)，实现过程也很简单：配置好参数就可，实现效果如下：

![yiy6l-ao9i6.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec7a8784dcf84498b5ccee38f8027e84~tplv-k3u1fbpfcp-watermark.image?)

## 先这么多吧，后面再来补充~
