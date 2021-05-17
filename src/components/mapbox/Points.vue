<!--
 * @Author: your name
 * @Date: 2021-05-17 10:37:02
 * @LastEditTime: 2021-05-17 10:56:40
 * @LastEditors: Please set LastEditors
 * @Description: mapbox 打点
 * @FilePath: /hello-vue3/src/components/mapbox/Points.vue
-->
<template>
  <div id="map" class="map-wrapper"></div>
</template>

<script>
import { GetCityOrgPointsReq } from '@/assets/request/ztbr.js'
export default {
    data() {
        return {

        }
    },
    methods:{
        getCityOrgPoints() {
            let params = {
                duration:"daily",
                start_date:'2021-05-17',
                end_date:'2021-05-17',
                area_coding:'',
                street_coding:'',
                org_type_id:'d74a392ec02911eaa8a9000c29d3cc31',
                org_sub_type_id:''
            };
            GetCityOrgPointsReq(params).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted(){
        console.log("!!!")
        this.getCityOrgPoints();
    }
}
</script>

<style scoped>
.map-wrapper{
    width: 100%;
    height: 100%;
}
</style>
