import Vue from 'vue'
import App from './App.vue'
import router from './router'
import toast from '@/components/toast/index'

Vue.config.productionTip = false
Vue.use(toast)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
