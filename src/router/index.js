/*
 * @Author: your name
 * @Date: 2021-01-06 15:13:48
 * @LastEditTime: 2021-05-26 10:18:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hello-vue3\src\router\index.js
 */
import { validateId } from '@turf/helpers'
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
    component: () => import('../views/Mapbox.vue'),
    children:[
      {
        path:"",
        redirect:'/mapbox/points',
      },
      {
        path:'points',
        name:'mapbox-points',
        component: ()=> import('../components/mapbox/Points.vue')
      },
      {
        path:'route',
        name:'mapbox-route',
        component: ()=> import('../components/mapbox/Route.vue')
      },
      {
        path:'heatmap',
        name:'mapbox-heatmap',
        component: ()=> import('../components/mapbox/Heatmap.vue')
      },
      {
        path:'polygon',
        name:'mapbox-polygon',
        component: ()=> import('../components/mapbox/Polygon.vue')
      },
      {
        path:'cluster',
        name:'mapbox-cluster',
        component: ()=> import('../components/mapbox/Cluster.vue')
      },
      {
        path:'buildings',
        name:'mapbox-buildings',
        component: ()=> import('../components/mapbox/Buildings.vue')
      }
  ]
  },
  {
    path: '/arcgisDemos',
    name: 'ArcgisDemos',
    component: () => import('../views/ArcgisDemos.vue'),
    children:[
      {
        path:"",
        redirect:'/arcgisDemos/polygon3d',
      },
      {
        path:'polygon3d',
        name:'arcgis-polygon3d',
        component: ()=> import('../components/arcgis/Polygon.vue')
      },
      {
        path:'cluster',
        name:'arcgis-cluster',
        component: ()=> import('../components/arcgis/Cluster.vue')
      },
      {
        path:'viewChange',
        name:'arcgis-view',
        component: ()=> import('../components/arcgis/Map.vue')
      },
      {
        path:'points',
        name:'arcgis-points',
        component: ()=> import('../components/arcgis/Points.vue')
      },
    ]
  },
  {
    path: '/mapbox2',
    name: 'Mapbox2',
    component: () => import('../views/MapboxDemo.vue')
  },
  {
    path: '/arcgis',
    name: 'Arcgis',
    component: () => import('../views/Arcgis.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../components/mapbox/test.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
