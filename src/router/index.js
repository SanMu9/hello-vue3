/*
 * @Author: your name
 * @Date: 2021-01-06 15:13:48
 * @LastEditTime: 2021-05-13 16:58:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hello-vue3\src\router\index.js
 */
import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'

const routes = [
  {
    path: '/',
    redirect:'/index',
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    children:[
      {
        path:"",
        redirect:'/index/home',
      },
      {
        path:"home",
        name:"Home",
        component:() => import('../views/Home.vue')
      },
      {
        path: 'about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      },
      {
        path: 'setup',
        name: 'Setup',
        component: () => import(/* webpackChunkName: "about" */ '../views/Setup.vue')
      },
      {
        path: 'teleport',
        name: 'Teleport',
        component: () => import(/* webpackChunkName: "about" */ '../views/Teleport.vue')
      },
      {
        path: 'vmodel',
        name: 'VModel',
        component: () => import(/* webpackChunkName: "about" */ '../views/VModel.vue')
      },
      {
        path: 'provide',
        name: 'Provide',
        component: () => import(/* webpackChunkName: "about" */ '../views/Provide.vue')
      },
      {
        path: 'vuex',
        name: 'Vuex',
        component: () => import('../views/Vuex.vue')
      },
    ]
  },
  
  {
    path: '/mapbox',
    name: 'Mapbox',
    component: () => import('../views/MapboxDemo.vue')
  },
  {
    path: '/arcgis',
    name: 'Arcgis',
    component: () => import('../views/Arcgis.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
