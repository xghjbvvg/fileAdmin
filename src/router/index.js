import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import SmallFileUpload from '@/components/SmallFileUpload'
import BigFileUpload from '@/components/BigFileUpload'
import Index from '@/components/Index'
import VuexDemo from '@/components/VuexDemo'
import Demo from '@/components/Demo'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name:'index', component:Index },
    { path:'/vuexdemo', name:'vuex',component:VuexDemo},
    { path:'/demo', name:'vuex',component:Demo},
    {
      path: '/home',
      name: 'HelloWorld',
      children:[
        {
          path: '/home/smallFileUpload',
          component: SmallFileUpload
        },
        {
          path: '/home/bigFileUpload',
          component: BigFileUpload

        }
      ],
      components: {
        default:HelloWorld,
      }
    },
    /*{
      path:'/smallFileUpload',
      name:'SmallFileUpload',
      component: SmallFileUpload

    },
    {
      path:'/bigFileUpload',
      name:'BigFileUpload',
      component: BigFileUpload

    }*/
  ]
})
