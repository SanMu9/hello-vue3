<template>
    <div>{{info}}</div>
    <div>{{detailStr}}</div>
    <p>{{hobbyName}}</p>
    <p>{{otherData.msg}}</p>
    <button @click="test">测试</button>
</template>

<script>
import {computed, toRefs, reactive} from 'vue';
import getHobbyInfo from '@/assets/js/setupFunc.js';
let  objectData=reactive({
            count:1,
            msg:'ha'
        })
objectData.value = computed(()=>(objectData.msg+objectData.count))

export default {
    props:{
        hobbyType:{
            type:String,
            default:null
        },
        hobbyName:{
            type:String,
            default:null
        },
        otherData:{
            type:Object,
            default:function(){
                return {
                    msg:"aaa"
                }
            }
        }
    },
    setup(props) {
        const {hobbyName,hobbyType} = toRefs(props)

        const {info,hobbyDetails,detailStr} = toRefs(getHobbyInfo(hobbyName,hobbyType));




        // onMounted(()=>{
        //     setInfo();
        // })
        // watch(hobbyName,setInfo)
        // watch(hobbyType,getHobbyDetails)


        return {
            info,
            detailStr,
            hobbyDetails,
            // objectData:{
            //     count:1,
            //     msg:'ha'
            // }
        }
    },
    data(){
        return {
            // objectData:{
            //     count:1,
            //     msg:'ha'
            // }
        }
    },
    methods:{
        test(){
            objectData.msg += 'ha'
            objectData.count+=1;
            
            console.log(objectData)
        }
    },
    mounted(){
        // this.otherData.msg = "SSSSSSSS"
    }
}
</script>

<style>

</style>