<!--
 * @Author: your name
 * @Date: 2021-05-21 10:16:42
 * @LastEditTime: 2021-05-21 14:20:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/components/arcgis/AreaInfoPopup.vue
-->
<template>
    <div class="course-box">
        <div class="header">
            <span>{{info.title}}</span>
        </div>
        <div class="content">
            <!-- <p class="summarize">1957年，片区发展简要概述。</p> -->
            <p class="intro" v-for="(item,idx) in info.content" :key='idx'>
                {{item}}
            </p>
            <div class="btn-box">
                <a href="javascript:;"
                    ><img
                        src="../../assets/images/show-vedio.png"
                        alt=""
                        class="bottom-img"
                /></a>
                <a href="javascript:;"
                    ><img
                        src="../../assets/images/audio-intro.png"
                        alt=""
                        class="bottom-img"
                /></a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CoursePopup",
    props:{
        info:{
            type:Object,
            default:()=>{
                return {
                    title:"",
                    content:[]
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>

.course-box {
    width: 529px;
    // height: 546px;
    padding: 0 28px;
    background: #7a231d;
    opacity: 0.85;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #f6e2b9;
    position: relative;
    box-sizing: border-box;
    .header {
        text-align: center;
        width: 432px;
        height: 93px;
        // border: 1px solid green;
        background: url("../../assets/images/title-bg.png") center no-repeat;
        background-size: 100%;
        position: absolute;
        top: -28px;
        text-align: center;
        line-height: 93px;
        font-size: 24px;
        font-weight: 600;
        letter-spacing: 2px;
    }

    .content {
        padding: 0 40px;
        width: 100%;
        margin-top: 50px;
        // position: absolute;
        // top: 88px;
        box-sizing: border-box;
        .summarize {
            font-size: 30px;
            letter-spacing: 2px;
            // text-align: center;
            // border: 1px solid green;
        }
        .intro {
            font-size: 16px;
            text-indent: 32px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            // -webkit-line-clamp: 3;
            margin-top: 15px;
            // border: 1px solid green;
            transform: translate3d(0,0,0);
            // backface-visibility: hidden; 
            // -webkit-backface-visibility: hidden;
        }
        .intro-second {
            // -webkit-line-clamp: 5;
        }
        .btn-box {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 484px;
            // margin-top: 65px;
            .bottom-img:hover {
                transform: scale(1.1);
                // -webkit-font-smoothing: subpixel-antialiased;
                // -webkit-transform: translateZ(0) scale(1.1, 1.1);
            }
            .bottom-img {
                transition: all 0.5s;
                
            }
        }
    }
}
</style>