<template>
  <div>
    <div id="city-container">
    </div>
    <div class="operation-btns"></div>
  </div>

</template>

<script setup>

import { onMounted, onBeforeUnmount} from "vue";

import * as THREE from "three";
import  SceneClass from "./lib/City/CityScene";

onMounted(()=>{
  const dom = document.getElementById('city-container')
    window['scene3d'] = new SceneClass('city-container')
    window['scene3d'].load()
    // window['scene3d'].initMouseEvent()
    // window['scene3d'].createWaterPlane()

})
</script>

<style lang="scss" scoped>
#city-container{
  height: 100%;
}
.operation-btns{
  position: absolute;
  left: 0;
}

</style>