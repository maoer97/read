// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { Lazyload,Spinner,InfiniteScroll } from 'mint-ui';
import 'mint-ui/lib/style.css'

Vue.component(Spinner.name, Spinner);

Vue.use(InfiniteScroll);
Vue.use(Lazyload);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})