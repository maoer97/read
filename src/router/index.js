import Vue from 'vue'
import Router from 'vue-router'
import Classify from '@/views/classify/index'
import Rank from '@/views/rank'
import Search from '@/views/search'
import Mine from '@/views/mine'
import ClassifyDetails from '@/views/Classify/detail'
import BookDetail from '@/base/bookDetail/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/classify',
    },
    {
      path:'/search',
      component: Search
    },
    {
      path:'/classify',
      component: Classify,
      children:[
        {
          path:'/classify/:type/:name',
          component: ClassifyDetails,
          children:[
            {
              path:'/classify/:type/:name/:id',
              component: BookDetail,
            }
          ]
        }
      ]
    },
    {
      path:'/rank',
      component: Rank
    },
    {
      path:'/mine',
      component: Mine
    },
  ]
})
