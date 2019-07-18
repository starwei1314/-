import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/pages/Home"
import Shop from "@/pages/Shop"
import Category from "@/pages/Category"
import Mine from "@/pages/Mine"
import Detail from "@/pages/Detail"
import OrderMange from "@/pages/OrderMange"
import Address from "@/pages/Address"
import BoundOrder from "@/pages/BoundOrder"
import BoundPhone from "@/pages/BoundPhone"
import MyPrize from "@/pages/MyPrize"
import GetPrize from "@/pages/GetPrize"
import DaySign from "@/pages/DaySign"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/shop',
      component: Home,
      children:[
        {
          path:"/shop",
          name:'shop',
          component:Shop,
          meta: {
            title: '商品页'
          }
        },
        {
          path:"/category",
          name:'category',
          component:Category,
          meta: {
            title: '分类页'
          }
        },
        {
          path:"/mine",
          name:'mine',
          component:Mine,
          meta: {
            title: '我的'
          }
        },
      ],
    },
        {
           path:"/detail",
           name:'detail',
           component:Detail,
           meta: {
            title: '详情'
          }
        },
        {
          path:"/ordermange",
          name:'ordermange',
          component:OrderMange,
          meta: {
            title: '订单管理'
          }
        },
       

        {
          path:"/address",
          name:'address',
          component:Address,
          meta: {
            title: '收货地址'
          }
        },
        {
          path:"/boundorder",
          name:'boundorder',
          component:BoundOrder,
          meta: {
            title: '绑定订单'
          }
        },
        {
          path:"/boundphone",
          name:'boundphone',
          component:BoundPhone,
          meta: {
            title: '绑定手机号'
          }
        },
        {
          path:"/myprize",
          name:'myprize',
          component:MyPrize,
          meta: {
            title: '我的奖品'
          }
        },
        {
          path:"/getprize",
          name:'getprize',
          component:GetPrize,
          meta: {
            title: '抽奖'
          }
        },
        {
          path:"/daysign",
          name:'daysign',
          component:DaySign,
          meta: {
            title: '签到'
          }
        },
  ]
})
