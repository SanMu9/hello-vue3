/*
 * @Author: your name
 * @Date: 2021-01-06 15:13:48
 * @LastEditTime: 2021-07-05 17:44:41
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
        component:() => import('../views/Home.vue'),
      //   meta:{
      //     keepAlive:true //需要被缓存的组件
      //  },
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
        component: () => import(/* webpackChunkName: "about" */ '../views/Setup.vue'),
      //   meta:{
      //     keepAlive:true //需要被缓存的组件
      //  },
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
      {
        path: 'watch',
        name: 'Watch',
        component: () => import('../components/vue3/watch.vue')
      },
      {
        path: 'keepAlive',
        name: 'KeepAlive',
        component: () => import('../components/vue3/keepAlive.vue')
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
      },
      {
        path:'terrainElevation',
        name:'mapbox-terrain-elevation',
        component: ()=> import('../components/mapbox/TerrainElevation.vue')
      },
      {
        path:'wms',
        name:'mapbox-wms-source',
        component: ()=> import('../components/mapbox/WMS.vue')
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
      {
        path:'geojson',
        name:'arcgis-geojson',
        component: ()=> import('../components/arcgis/Geojson.vue')
      },
      {
        path:'polygonAnimation',
        name:'arcgis-polygonAnimation',
        component: ()=> import('../components/arcgis/PolygonAnimation.vue')
      },
      {
        path:'arcgis-bim',
        name:'arcgis-bim',
        component: ()=> import('../components/arcgis/Building.vue')
      },
    ]
  },
  {
    path: '/echart',
    name: 'Echart',
    component: () => import('../views/echarts.vue')
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
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../views/Tools.vue')
  },
  {
    path:"/customCounter",
    name:'CustomCounter',
    component: ()=> import('../components/custom/CustomCounter.vue')
  },
  {
    path:"/customNumber",
    name:'CustomNumber',
    component: ()=> import('../components/custom/CustomNumber.vue')
  },
  {
    path:"/customDemos",
    name:'CustomDemos',
    component: ()=> import('../components/custom/CustomDemos.vue')
  },
  {
    path:"/openLayers",
    name:'OpenLayers',
    component: ()=> import('../views/OpenLayers.vue'),
    children:[
      {
        path:"",
        redirect:'/openLayers/blueMap',
      },
      {
        path:"customColor",
        name:'ol-custom-color',
        component: ()=> import('../components/openlayers/colorManipulation.vue')
      },
      {
        path:"blueMap",
        name:'ol-bluemap',
        component: ()=> import('../components/openlayers/blueMap.vue')
      },
      {
        path:'polygon',
        name:'ol-polygon',
        component: ()=> import('../components/openlayers/polygon.vue')
      },
      {

        path:'geojson',
        name:'ol-geojson',
        component: ()=> import('../components/openlayers/geojson.vue')
      },
      {

        path:'demo',
        name:'ol-demo',
        component: ()=> import('../components/openlayers/demo.vue')
      },
      {
        path:'pathPlan',
        name:'ol-path-plan',
        component: ()=> import('../components/openlayers/pathPlan.vue')
      },
    ]
  },
  {
    path:'/three',
    name:'Three',
    component: () => import('../views/Three.vue'),
    children:[
        {
          path:"",
          redirect:'/three/models',
        },
        {
          path:'models',
          name:'three-models',
          component: ()=> import('../components/three/Models.vue')
        },
        {
          path:'addImages',
          name:'three-addImages',
          component: ()=> import('../components/three/AddImage.vue')
        },
        {
          path:'lakeScene',
          name:'three-lakeScene',
          component: ()=> import('../components/three/LakeScene.vue')
        },
        {
          path:'sky',
          name:'three-sky',
          component: ()=> import('../components/three/Sky.vue')
        },
        {
          path:'modelAnimate',
          name:'three-modelAnimate',
          component: ()=> import('../components/three/ModelAnimation.vue')
        },
        {
          path:'shaderMaterial',
          name:'three-shaderMaterial',
          component: ()=> import('../components/three/ShaderMaterial.vue')
        },
        {
          path:'city',
          name:'three-city',
          component: ()=> import('../components/three/City.vue')
        },
        {
          path:'buildingFloor',
          name:'three-buildingFloor',
          component: ()=> import('../components/three/BuildingFloor.vue')
        },
        {
          path:'multiScenes',
          name:'three-multipleScenes',
          component: ()=> import('../components/three/MultipleScenes.vue')
        },
        {
          path:'deviceDot',
          name:'three-deviceDot',
          component: ()=> import('../components/three/DeviceDot.vue')
        },
        {
          path:'buildingScene',
          name:'three-buildingScene',
          component: () => import('../components/three/BuildingScene/BuildingScene.vue')
        },
        {
          path:'pie3d',
          name:'three-pie3d',
          component: () => import('../components/three/Pie3D.vue')
        }
        
    ]
  },
  {
    path:"/h5player",
    name:'H5Player',
    component: ()=> import('../views/H5Player.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
