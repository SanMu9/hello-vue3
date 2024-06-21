<script setup>
import { ref, onActivated, onDeactivated } from 'vue'

const count = ref(0)
onActivated(()=>{
    alert("CompA activated")
})
onDeactivated(()=>{
    alert("CompA deActivated")
})
</script>

<template>
  <p>Current component: A</p>
  <span>count: {{ count }}</span>
  <button @click="count++">+</button>
</template>
