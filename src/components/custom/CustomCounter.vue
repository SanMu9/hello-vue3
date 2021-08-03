<template>
  <div class="custom-counter">
      <div class="number-box" v-for="(item,idx) in countArr" :key="idx">
          <div class="counter-numbers" v-if="item!='.'">
              <div class="numbers-wrapper" :data-active="item">
                    <li :class="{'active':item==0}">0</li>
                    <li :class="{'active':item==1}">1</li>
                    <li :class="{'active':item==2}">2</li>
                    <li :class="{'active':item==3}">3</li>
                    <li :class="{'active':item==4}">4</li>
                    <li :class="{'active':item==5}">5</li>
                    <li :class="{'active':item==6}">6</li>
                    <li :class="{'active':item==7}">7</li>
                    <li :class="{'active':item==8}">8</li>
                    <li :class="{'active':item==9}">9</li>
              </div>
          </div>
          <div class="counter-dot" v-else>{{item}}</div>
      </div>
  </div>
</template>

<script>
import { toRefs,computed,ref } from 'vue'
export default {
    props:{
        countData:{
            type:Number,
            default:23212.56
        }
    },
    setup(props){
        console.log(props)
        const {countData} = toRefs(props);
        const countArr = computed(()=>{
            return ref(countData).value.toString().split('')
        })
        console.log(countArr)
        return {countArr}
    },
    data(){
        return {
        }
    },

    methods:{
    },
    mounted(){
    }
}
</script>

<style lang="scss" scoped>
$box-height:109px;
.custom-counter{
    height: $box-height;
    color: #fff;
    background: #020f1e;
    font-size:75px;
    .counter-dot{
        // padding: 0 5px;
    }
    .counter-numbers{
        width: 56px;
        height: 100%;
        overflow: hidden;
        background-image: linear-gradient(to bottom, #0c2343,  #0796d0 33%, #0796d0 66%, #0c2343);
        &:not(:last-child){
            margin-right: 10px;
        }
        .numbers-wrapper{
            width: 100%;
            transition: all 1s;
            //  &[data-active='2']{
            //         transform: translateY(-$box-height*2);
            //     }
            li{
                list-style: none;
                width: 100%;
                height: $box-height;
                line-height: $box-height;
               
            }
            @for $i from 0 through 9{
                &[data-active='#{$i}']{
                    transform: translateY(-$box-height*$i);
                }
            }
        }
    }
}
.number-box{
    overflow: hidden;
    height: 100%;
    float: left;
    &:not(:last-child){
        margin-right: 8px;
    }
}
</style>