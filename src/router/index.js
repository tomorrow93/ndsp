import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/home' //home
import Index from '@/page/index' //index
import Login from '@/page/login' //登录
import Notfound from '@/page/404' //404
import Roles from '@/page/roles' //角色管理（角色列表）
import Account from '@/page/account' //账号管理（账号列表）
import Mediabuy from '@/page/mediabuy' //medibuy
import Advertiser from '@/page/advertiser' //广告主管理
import Ad from '@/page/ad' //ad管理
import NewAd from '@/page/newAd' //ad创建
import EditAd from '@/page/newAd' //ad编辑
import Campaign from '@/page/campaign' //campaign管理
import NewCampaign from '@/page/newCampaign' //campaign创建
import EditCampaign from '@/page/editCampaign' //campaign创建
import AdSquad from '@/page/adSquad' //adSquad管理
import NewSquad from '@/page/newSquad' //adSquad创建
import EditSquad from '@/page/editSquad' //adSquad编辑
import Creative from '@/page/creative' //creative编辑
import Permissions from '@/page/permissions' //权限管理
import Proxy from '@/page/proxy' //代理管理
import Menu from '@/page/menu' //菜单管理
import Image from '@/page/image' //素材
import Label from '@/page/label' //标签管理
import OverallReport from '@/page/overallReport' //overall报表
import CheetahAccount from '@/page/cheetahAccount' //第三方账号管理
import {delCookie, getCookie, setCookie} from '@/assets/js/cookie.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      //导航守卫
      beforeEnter: (to, from, next) => {
        let uname = getCookie('username');
        let utoken = getCookie('token');
        if (to.path == '/login') {
          next(); //正常展示
        } else {
          if (uname != "" || utoken != "") { //如果cookie存在
            next(); //正常展示
          }
          else { //如果cookie不存在
            next('/login');
          }
        }
      },
      children: [
        {
          //首页
          path: '/',
          component: Index
        },
        {
          //菜单管理
          path: '/menu',
          component: Menu
        },
        {
          //角色管理
          path: '/roles',
          component: Roles
        },
        {
          //账号管理
          path: '/account',
          component: Account
        },
        {
          //mediabuy
          path: '/mediabuy',
          component: Mediabuy
        },
        {
          //广告主管理
          path: '/advertiser',
          component: Advertiser
        },
        {
          //campaign
          path: '/campaign',
          component: Campaign
        },
        {
          //campaign创建
          path: '/newCampaign',
          component: NewCampaign
        },
        {
          //campaign编辑
          path: '/editCampaign',
          component: EditCampaign
        },
        {
          //adSquad
          path: '/adSquad',
          component: AdSquad
        },
        {
          //newSquad
          path: '/newSquad',
          component: NewSquad
        },
        {
          //adSquad编辑
          path: '/editSquad',
          component: EditSquad
        },
        {
          //Creative管理
          path: '/creative',
          component: Creative
        },
        {
          //ad管理
          path: '/ad',
          component: Ad
        },
        {
          //ad创建
          path: '/newAd',
          component: NewAd
        },
        {
          //ad编辑
          path:'/editAd',
          component:EditAd
        },
        {
          //权限管理
          path: '/permissions',
          component: Permissions
        },
        {
          //代理管理
          path: '/proxy',
          component: Proxy
        },
        {
          //素材管理
          path: '/image',
          component: Image
        },
        {
          //标签管理
          path: '/label',
          component: Label
        },
        {
          //overall报表
          path: '/overallReport',
          component: OverallReport
        },
        {
          //overall报表
          path: '/cheetahAccount',
          component: CheetahAccount
        },
      ]
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '*',
      component: Notfound
    }
  ]
})
