import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import VueIntl from 'vue-intl'
import vClickOutside from 'v-click-outside'
import VueClipboard from 'vue-clipboard2'
import VueI18n from 'vue-i18n'
Vue.config.productionTip = false

sync(store, router)

Vue.use(VueIntl)
Vue.use(vClickOutside)
Vue.use(VueClipboard)
Vue.use(require('vue-moment'));
Vue.use(VueI18n)
//Vue.setLocale('en-US')

const i18n = new VueI18n({
    locale: localStorage.curLng||'en',    // 语言标识
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
        'zh': require('./languages/zh'),   // 中文语言包
        'en': require('./languages/en')    // 英文语言包
    }
})
new Vue({
    store,
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')
