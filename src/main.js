import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
/**使用懒加载插件 */

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
