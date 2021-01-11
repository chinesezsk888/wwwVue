import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

Vue.prototype.axios = axios
Vue.prototype.mywindow = window
// Vue.prototype.bus = new Vue()
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
