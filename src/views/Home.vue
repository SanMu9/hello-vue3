<template>
    <div class="home">
      <button @click="clickHandler">Click Me</button>
      <button @click="clickHandler2(obj)">Click Me2</button>
      <p>{{obj.count}}</p>
      <input type="text" v-model.number="obj.count">
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import PublicValues,{MsgTest} from "@/assets/js/publicValues.js";
export default {
    name: "Home",
    data() {
        return {
            msg:MsgTest,
            obj:{
              count:0
            }
        };
    },
    methods: {
      clickHandler(){
        PublicValues.name = "AAAA";
        PublicValues.hobby = ["没有"];
        MsgTest = "是圣诞快乐房价啊";
      },
      clickHandler2(obj){

        setTimeout(()=>{
          // obj.count+=1; 
          obj = {
            count:obj.count++
          }
        },1000)
        
      }
    },
    mounted(){
      // console.log(this)
    }
    // components: {
    //   HelloWorld
    // }
};
</script>

<script setup>
import {ref, reactive, toRef} from 'vue'
// reactive 返回'对象'的响应式副本
const count = ref(0)
const counter = reactive({count})

count.value++
console.log(counter.count) // 1

const obj = reactive({a:1,b:2})
const obj_a = toRef(obj,'a')
obj_a.value++
console.log(obj.a) // 2


</script>
