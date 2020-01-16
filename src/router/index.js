import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/home/index'
import FriendIndex from '@/components/friends/index'
import FriendDefault from '@/components/friends/default'
import FriendDetail from '@/components/friends/detailInfo'
import FriendChat from '@/components/friends/chat'
import demo from '@/components/friends/demo'
import Login from '@/components/user/login'
import Register from '@/components/user/register'
import Common from '@/components/user/common'
import VueCookie from 'vue-cookies'
import UserCenter from '@/components/userCenter/userCenter'
import userCenterIndex from '@/components/userCenter/index'
import passwordProtect from '@/components/userCenter/passwordProtect'
import resetPassword from '@/components/userCenter/resetPassword'
import fileIndex from '@/components/home/fileIndex'
import moreIndex from '@/components/more/index'
import time from '@/components/more/timeMemory/index'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {path: '/', name: 'fileIndex', component: fileIndex},
        {
          path: '/friends',
          name: 'friends',
          component: FriendIndex,
          children: [
            {path:'/friends',name:'default',component:FriendDefault},
            {path:'/friends/chat',name:'chat',component:FriendChat},
            {path:'/friends/detail',name:'detail',component:FriendDetail}

          ]
        },
        {
          path:'/more',
          name:'more',
          component:moreIndex
        },
        {
          path:'/more/time',
          name:'time',
          component:time
        }
      ]
    },

    {
      path: '/user/login',
      name: 'common',
      component: Common,
      children: [
        {path: '/user/login', name: 'login', component: Login},
        {path: '/user/register', name: 'register', component: Register},
      ]
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: UserCenter,
      children: [
        {path: '/userCenter', name: 'login', component: userCenterIndex},
        {path: '/userCenter/passwordProtect', name: 'register', component: passwordProtect},
        {path: '/userCenter/resetPassword', name: 'login', component: resetPassword},

      ]
    },
    {path:'/demo',name:'demo',component:demo},

  ]
})

router.beforeEach((to, from, next) => {
  // ...
  var access_token = VueCookie.get("access_token");
  if(access_token == null && to.path !== '/user/login' && to.path !== '/user/register'){
    router.push("/user/login");
  }else if(access_token != null && (to.path === '/user/login' || to.path === '/user/register')){
    alert('亲，你已经登入过了')
    router.push("/");
  }else {
    next();
  }
})

export default router;

