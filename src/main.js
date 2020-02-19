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
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'vue-event-calendar/dist/style.css' //^1.1.10, CSS has been extracted as one file, so you can easily update it.
import vueEventCalendar from 'vue-event-calendar'
// locale can be 'zh' , 'en' , 'es', 'pt-br', 'ja', 'ko', 'fr', 'it', 'ru', 'de', 'vi', 'ua', 'no, 'no-nn'
Vue.use(vueEventCalendar, {locale: 'zh',color: 'lightgrey'});
Vue.use(mavonEditor)
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
