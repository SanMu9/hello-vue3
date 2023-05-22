<!--
 * @Author: your name
 * @Date: 2021-05-14 09:27:52
 * @LastEditTime: 2021-07-05 17:36:18
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/views/Setup.vue
-->
<template>
    <div>
        <!-- <button @click="()=>++clickCount">{{clickCount}}</button> -->
        <select name="" id="" v-model="selectValue" @change="(ev)=>selectLabel=ev.target.options[ev.target.selectedIndex].text">
            <option v-for="item in selectOpts" :key="item.value" :value="item.value">{{item.label}}</option>
        </select>
        <setup-page :hobbyType="selectValue" :hobbyName="selectLabel" :otherData="otherData"></setup-page>
    </div>
    
</template>

<script>
import SetupPage from "@/components/SetupPage.vue";

export default {
    name:"Setup",
    data(){
        return {
            selectValue:null,
            selectLabel:null,
            selectOpts:[
                {label:"运动",value:"sports"},
                {label:"水果",value:"fruits"},
            ],
            otherData:{
                msg:"hahahaha"
            }
        }
    },
    components: {
        SetupPage,
    },
    methods:{

    },
    created(){
        console.log("Setup created")
    },
    mounted() {
        console.log("Setup mounted")
    }
};
</script>


<style>
</style>