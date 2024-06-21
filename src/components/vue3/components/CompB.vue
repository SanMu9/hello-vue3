<script setup>
import { ref, onActivated, onDeactivated } from 'vue'
const msg = ref('')
onActivated(()=>{
    alert("CompB activated")
})
onDeactivated(()=>{
    alert("CompB deActivated")
})
</script>

<template>
  <p>Current component: B</p>
  <span>Message is: {{ msg }}</span>
  <input v-model="msg">
</template>
