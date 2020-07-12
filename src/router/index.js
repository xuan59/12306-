import Vue from 'vue'
import Router from 'vue-router'
//导入组件模块
import Index from '@/components/index.vue'
import TrainList from '@/components/pages/train_list.vue' 

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/train_list',
      name: 'TrainList',
      component: TrainList
    }
  ]
})
