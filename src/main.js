// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import uploader from 'vue-simple-uploader'
import plupload from 'plupload'
import SlideVerify from 'vue-monoplasty-slide-verify';
import VueCookie from 'vue-cookies'
Vue.use(VueCookie);
Vue.use(SlideVerify);
Vue.use(plupload);
Vue.use(uploader);
Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})