module.exports = {
        title: '^^玲',
        description: '玩玩',
        themeConfig: {
                nav: [
                        { text: '首页', link: '/',  target:'_self' },
                        { text: '初入职场', link: '/beInWork/',  target:'_self' },
                        { text: 'nuxt',
                          items: [
                                { text: 'nuxt配置', link: '/nuxt/',  target:'_self' },
                                { text: 'nuxt状态树', link: '/nuxt/vuex',  target:'_self' },
                                { text: 'nuxt生命周期', link: '/nuxt/lifeCycle',  target:'_self' },
                                { text: 'nuxt常用tips', link: '/nuxt/tips',  target:'_self' },
                          ]
                        },
                        
                        { text: 'vue', 
                          items: [
                                { text: 'vue初识', link: '/vue/',  target:'_self' },
                                { text: 'vue封装跨页选择组件', link: '/vue/table',  target:'_self' },
                                { text: 'vue实现企业微信考试功能', link: '/vue/exam',  target:'_self' },
                                { text: 'vue中的activated和deactivated', link: '/vue/activated',  target:'_self' },
                                { text: 'vue3新功能', link: '/vue/vue3',  target:'_self' },

                          ] 
                        }
                ],
                sidebar: 'auto',
                displayAllHeaders: true // 默认值：false
        }
}