/*
 * @Author: your name
 * @Date: 2021-01-06 15:13:48
 * @LastEditTime: 2021-04-28 16:19:01
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \hello-vue3\src\router\index.js
 */
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import(/* webpackChunkName: "about" */ '../views/Setup.vue')
  },
  {
    path: '/teleport',
    name: 'Teleport',
    component: () => import(/* webpackChunkName: "about" */ '../views/Teleport.vue')
  },
  {
    path: '/vmodel',
    name: 'VModel',
    component: () => import(/* webpackChunkName: "about" */ '../views/VModel.vue')
  },
  {
    path: '/provide',
    name: 'Provide',
    component: () => import(/* webpackChunkName: "about" */ '../views/Provide.vue')
  },
  {
    path: '/vuex',
    name: 'Vuex',
    component: () => import('../views/Vuex.vue')
  },
  {
    path: '/mapbox',
    name: 'Mapbox',
    component: () => import('../views/MapboxDemo.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
