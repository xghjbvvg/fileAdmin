import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/home/index'
import FriendIndex from '@/components/friends/index'
import FriendDefault from '@/components/friends/default'
import FriendDetail from '@/components/friends/detailInfo'
import FriendChat from '@/components/friends/chat'
import FriendRequest from '@/components/friends/friendRequest'
import demo from '@/components/friends/demo'
import Login from '@/components/user/login'
import resetPwd from '@/components/user/resetPwd'
import hope from '@/components/user/wishes'
import Register from '@/components/user/register'
import Common from '@/components/user/common'
import VueCookie from 'vue-cookies'
import UserCenter from '@/components/userCenter/userCenter'
import userCenterIndex from '@/components/userCenter/index'
import passwordProtect from '@/components/userCenter/passwordProtect'
import resetPassword from '@/components/userCenter/resetPassword'
import fileIndex from '@/components/home/fileIndex'
import dynamicIndex from '@/components/dynamic/index'
import dynamicMain from '@/components/dynamic/dynamicIndex'
import dynamicWriter from '@/components/dynamic/dynamicWriter'
import dynamicDetail from '@/components/dynamic/dynamicDetail'
import userDynamic from '@/components/dynamic/userDynamic'
import moreIndex from '@/components/more/index'
import time from '@/components/more/timeMemory/index'
import wishes from '@/components/more/timeMemory/hope'
import note from '@/components/more/note/index'
import noteWrite from '@/components/more/note/noteWrite'
import scoll from '@/components/test/scoll'
import question from '@/components/admin/question'
import adminIndex from '@/components/admin/index'
import reply from '@/components/admin/reply'
import solutionQuestion from '@/components/admin/solutionQuestion'
import userRoleAdmin from '@/components/admin/userRoleAdmin'
Vue.use(Router)
const scrollBehavior = function (to, from, savedPosition) {
  if (to.hash) {
    return {
      // 通过 to.hash 的值來找到对应的元素
      selector: to.hash
    }
  }
}
const router = new Router({
  routes: [
    {
      path: '/index',
      name: 'index',
      component: index,
      redirect:'/fileIndex',
      children: [
        {path: '/fileIndex', name: 'fileIndex', component: fileIndex},
        {
          path: '/friends',
          name: 'friends',
          component: FriendIndex,
          children: [
            {path:'/friends',name:'default',component:FriendDefault},
            {path:'/friends/chat',name:'chat',component:FriendChat},
            {path:'/friends/detail',name:'detail',component:FriendDetail},
            {path:'/friends/friendRequest',name:'detail',component:FriendRequest}
          ]
        },

        {
          path: '/dynamic',
          name: 'dynamic',
          component: dynamicIndex,
          children: [
            {path:'/dynamic',name:'dynamicMain',component:dynamicMain},
            // {path:'/dynamic/index',name:'default',component:dynamicMain},
            {path:'/dynamic/markdown',name:'dynamicWriter',component:dynamicWriter},
            {path:'/dynamic/detail',name:'dynamicDetail',component:dynamicDetail},
            {path:'/dynamic/user',name:'userDynamic',component:userDynamic},

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
        },
        {
          path:'/more/note',
          name:'note',
          component:note
        },
        {
          path:'/more/noteWrite',
          name:'noteWrite',
          component:noteWrite
        }
      ]
    },
    {path:'/question',name:'question',component:question},
    {path:'/resetPwd',name:'resetPwd',component:resetPwd},
    {path:'/bestWishes',name:'hope',component:hope},
    {path:'/wishes',name:'wishes',component:wishes},
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
    {
      path: '/admin/index',
      name: 'admin',
      component: adminIndex,
      children: [
        // {path: '/admin/index', name: 'adminIndex', component: adminIndex},
        {path: '/admin/index', name: 'solutionQuestion', component: solutionQuestion},
        {path: '/admin/userRoleAdmin', name: 'userRoleAdmin', component: userRoleAdmin},
      ]
    },
    {path:'/reply',name:'reply',component:reply},
    {path:'/scoll',name:'scoll',component:scoll},

  ],
  //mode: 'history',
  base: '/',
  scrollBehavior

})

router.beforeEach((to, from, next) => {
  // ...
  var access_token = VueCookie.get("access_token");
  if(access_token === null && to.path !== '/user/login' && to.path !== '/user/register'&& to.path !== '/question'&& to.path !== '/resetPwd'){
    router.push("/user/login");
  }else if(access_token !== null && (to.path === '/user/login' || to.path === '/user/register')){
    router.push("/index");
  }else {
    next();
  }
})

export default router;

