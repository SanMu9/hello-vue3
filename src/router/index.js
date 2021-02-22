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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
