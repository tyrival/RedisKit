import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import db from './data/datastore'
import './assets/styles/common/element-override/index.scss'
import './fonts/iconfont.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$db = db
Vue.prototype.$dbServers = (servers) => {
  db.remove({}, {multi: true}, () => {
    db.insert(servers)
  })
}

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
