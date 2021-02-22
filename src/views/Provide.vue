<template>
    <p>Provide count：{{count}}</p>
    <button @click="count+=1">+1</button>
    <provide-test></provide-test>
</template>

<script>
import {computed} from 'vue';
import ProvideTest from '@/components/ProvideTest.vue';
export default {
    components:{ProvideTest},
    data(){
        return {
            count:0
        }
    },
    provide(){
        return {
            countTemp:computed(()=>this.count)
        }
    }
};
</script>

<style>
button{
    font-size: 24px;
}
</style>