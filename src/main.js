import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { getAllMessages } from './store/actions'

Vue.config.productionTip = false

Vue.filter('time', timestamp => {
  return new Date(timestamp).toLocaleTimeString()
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

getAllMessages(store)
