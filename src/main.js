import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import Vuex from 'vuex'

// import * as THREE from '../public/three/three.module';
// window.THREE = THREE;


createApp(App).use(store).use(router).mount('#app')
