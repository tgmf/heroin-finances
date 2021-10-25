// =========================================================
// * Heroin - Finances - v0.3.0
// =========================================================
//
// * Copyright 2020 tgmf (https://github.com/tgmf)
//
// * Coded by stgmf
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import '@/plugins/firebase'
import vuetify from './plugins/vuetify'
import '@/assets/style.css'
import { firestorePlugin } from 'vuefire'

Vue.config.productionTip = false
Vue.use(firestorePlugin, { wait: true })
Vue.filter('toCurrency', function (value) {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return formatter.format(value)
})
let app = ''

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      firebase,
      vuetify,
      render: h => h(App),
    }).$mount('#app')
  }
})
