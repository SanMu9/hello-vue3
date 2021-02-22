<template>
    <div>{{info}}</div>
    <div>{{detailStr}}</div>
    <p>{{hobbyName}}</p>
    <p>{{otherData.msg}}</p>
</template>

<script>
import {toRefs} from 'vue';
import getHobbyInfo from '@/assets/js/setupFunc.js';
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
            hobbyDetails
        }
    },
    mounted(){
        // this.otherData.msg = "SSSSSSSS"
    }
}
</script>

<style>

</style>