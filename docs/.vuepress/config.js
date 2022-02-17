module.exports = {
        title: 'VuePress 静态网站 初尝试',
        description: '玩玩',
        themeConfig: {
                nav: [
                        { text: '首页', link: '/',  target:'_self' },
                        { text: '初入职场', link: '/beInWork/',  target:'_self' },
                        { text: 'nuxt', link: '/nuxt/',  target:'_self' },
                        { text: 'vue', link: '/vue/',  target:'_self' }
                ],
                sidebar: 'auto',
                displayAllHeaders: true // 默认值：false
        }
}