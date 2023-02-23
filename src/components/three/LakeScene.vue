<template>
  <div class="container">
      <div ref="threeContainer" class="three-wrapper"></div>
  </div>
</template>

<script setup>

import {ref} from 'vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const threeContainer = ref(null)
console.log(threeContainer)

</script>

<style lang="scss" scoped>
.container{
    width: 100%;
    height: 100%;
    position: relative;
    .three-wrapper{
        width: 100%;
        height: 100%;
    }
}
</style>