# nuxt注意事项
本文记录nuxt开发过程中的一些注意事项，这篇文章会持续更新。

`nuxt`的路由跳转 官方建议用`nuxt-link`，如果用`router.push`可能会**记录不到页面栈信息**；如果是动态路由要避免使用`a`标签跳转，会导致页面重新刷新（**页面整个重新刷新，渲染时间会很长**）；用window.location.href、redirect跳转也一样

