import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import Vuex from 'vuex'

// import * as THREE from '../public/three/three.module';
// window.THREE = THREE;


createApp(App).use(store).use(router).mount('#app')
// const path = require("path");
// const fs = require('fs')
// console.log(path)
// console.log(fs)

// function getPages (nameQuery = null) {
//   const files = require.context("@/views/",true,/main.js$/)
//   const pages = {}
//   files.keys().forEach(key => {
//     const paths = key.split('/')
//     const name = paths[paths.length-2]
//     if(nameQuery && nameQuery === name) {
//       pages[name] = {
//         entry:'src/views/'+name+'/main.js',
//         template:'public/'+name+'.html',
//         filename:name+'.html',
//         chunks:['chunk-vendors','chunk-common',name]
//       }
//     }else if(name && (!nameQuery)){
//       pages[name] = {
//         entry:'src/views/'+name+'/main.js',
//         template:'public/'+name+'.html',
//         filename:name+'.html',
//         chunks:['chunk-vendors','chunk-common',name]
//       }
//     }
//   })
//   return pages
// }
// console.log(getPages())
// files.key().map(path => {
//   return
// })
// files.resolve()
// console.dir(files.resolve)