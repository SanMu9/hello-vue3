<template>
  <div id="container"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';

let container, stats;
let camera, scene, renderer;
let controls, water, sun, mesh;

onMounted(()=>{
  init()
})

function init(){
  container = document.getElementById('container')
}

</script>

<style scoped>
#container{
  width: 100%;
  height: 100%;
  position: relative;
}
</style>