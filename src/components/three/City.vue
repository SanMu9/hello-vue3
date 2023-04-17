<template>
  <div id="city-container"></div>
</template>

<script setup>

import { onMounted, onBeforeUnmount} from "vue";

import * as THREE from "three";

import { AmbientLight, DirectionalLight, Vector3,LinearFilter } from "three";


onMounted(()=>{
  const dom = document.getElementById('city-container')

})
</script>

<style scoped>
#city-container{
  height: 100%;
}
</style>