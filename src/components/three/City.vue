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


onMounted(()=>{
  const dom = document.getElementById('city-container')

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