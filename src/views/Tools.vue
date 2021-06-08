<!--
 * @Author: your name
 * @Date: 2021-06-04 14:31:29
 * @LastEditTime: 2021-06-05 11:36:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/views/Tools.vue
-->
<template>
  <div class="container">
      <video id="video" autoplay>
            <source src="../../public/videos/test.mp4" />
      </video>
  </div>
  <teleport to="body">
        <div id="rubberbandDiv">
            <div class="rubberband-operate-box" id="rubberOperateBox">
                <div class="cancel" @click="cancelRubberBand">
                    <svg viewBox="0 0 1025 1024" width="18" height="18"><path d="M996.597082 905.934044L606.59857 515.935532l389.998512-389.998512c27.42177-27.42177 27.42177-71.093479 0-97.499628-27.42177-27.42177-70.077858-27.42177-97.499628 0L509.098942 418.435904 118.084808 28.437392C90.663038 1.015621 48.006951 1.015621 20.58518 28.437392s-27.42177 70.077858 0 97.499628l389.998513 389.998512L20.58518 905.934044c-27.42177 27.42177-27.42177 70.077858 0 97.499628 26.406149 27.42177 70.077858 27.42177 97.499628 0l389.998513-389.998512 389.998512 389.998512c27.42177 26.406149 71.093479 26.406149 97.499628 0 27.42177-26.406149 27.42177-70.077858 1.015621-97.499628z"></path></svg>
                </div>
                <div class="ensure" @click="captureImage">
                    <svg  viewBox="0 0 1024 1024"  width="24" height="24"><path d="M948.696 186.319c-30.521-24.185-65.468 6.852-65.468 6.852L362.786 660.353 153.727 498.161c-32.768-28.571-59.492-15.553-71.165-7.193-34.879 25.146-7.033 66.878-7.033 66.878l234.45 263.892c49.433 56.255 91.134 0.616 91.134 0.616l543.5-575.664c23.558-32.345 13.15-53.105 4.083-60.371z"></path></svg>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
export default {
    data() {
        return {
            mousedown: {},
            rubberbandRect: {},
            dragging:false
        }
    },
    methods:{
        // 允许页面截图视频操作
        enableDrawBox() {
            const video = document.getElementById('video');
            video.addEventListener('mousedown',this.videoMousedown)
            window.addEventListener('mousemove',this.startMousemove)
            window.addEventListener('mouseup',this.endByMouseup)
       },
    //    取消页面事件，在页面销毁前调用
       disableDrawBox() {
           const video = document.getElementById('video');
            video.removeEventListener('mousedown',this.videoMousedown)
            window.removeEventListener('mousemove',this.startMousemove)
            window.removeEventListener('mouseup',this.endByMouseup)
       },
        videoMousedown(e) {
            const x = e.clientX;
            const y = e.clientY;
            console.log("!!!!!")
            e.preventDefault();
            this.rubberbandStart(x,y)
        },
        startMousemove(e){
            const x = e.clientX,
                y = e.clientY;
            
            e.preventDefault();
            if(this.dragging){
                this.rubberbandStretch(x,y);
            }
        },
        endByMouseup(e) {
             e.preventDefault();
             if(this.dragging){
                this.rubberbandEnd();
             }
        },
        rubberbandStart(x,y){
            this.mousedown.x = x;
            this.mousedown.y = y;
            this.rubberbandRect.left = x;
            this.rubberbandRect.top = y;
            this.moveRubberbandDiv();
            this.showRubberbandDiv()
            this.dragging = true;
        },
        moveRubberbandDiv(){
            const rubberbandDiv = document.getElementById('rubberbandDiv')
            rubberbandDiv.style.top = this.rubberbandRect.top + 'px';
            rubberbandDiv.style.left = this.rubberbandRect.left + 'px';
        },
        showRubberbandDiv(){
            const rubberbandDiv = document.getElementById('rubberbandDiv')
            rubberbandDiv.style.display = 'block';
        },

        // 拉伸伸缩框
        rubberbandStretch(x,y) {
            const rubberbandRect = this.rubberbandRect;
            const mousedown = this.mousedown;
            rubberbandRect.left = x < mousedown.x?x:mousedown.x;
            rubberbandRect.top = y < mousedown.y?y:mousedown.y;

            rubberbandRect.width = Math.abs(x-mousedown.x);
            rubberbandRect.height = Math.abs(y-mousedown.y);

            this.moveRubberbandDiv();
            this.resizeRubberbandDiv();
        },
        resizeRubberbandDiv(){
            const rubberbandDiv = document.getElementById('rubberbandDiv')
            rubberbandDiv.style.width = this.rubberbandRect.width + 'px';
            rubberbandDiv.style.height = this.rubberbandRect.height + 'px';
        },
        rubberbandEnd(){

            this.dragging = false;
            const rubberOperateBox = document.getElementById("rubberOperateBox")
            rubberOperateBox.style.display = "block";

           

        },
        cancelRubberBand() {
            const rubberOperateBox = document.getElementById("rubberOperateBox")
            const rubberbandDiv = document.getElementById('rubberbandDiv')
            rubberbandDiv.style.width = 0;
            rubberbandDiv.style.height = 0;
            rubberbandDiv.style.display = "none";
            this.rubberbandRect = {
                top : 0,
                left : 0,
                width : 0,
                height : 0
            };
            rubberOperateBox.style.display = "none";
        },
        captureImage(){
             const video = document.getElementById('video');
            const bbox = video.getBoundingClientRect();
            const canvas = document.createElement('canvas');
            const rubberbandRect = this.rubberbandRect;
            canvas.width = this.rubberbandRect.width;
            canvas.height = this.rubberbandRect.height;
            canvas.getContext('2d').drawImage(video,rubberbandRect.left-bbox.left,rubberbandRect.top-bbox.top,rubberbandRect.width,rubberbandRect.height,0,0,canvas.width,canvas.height);
            
            const screenShoot = canvas.toDataURL();
            // const img = document.createElement("img");
            //     img.src = screenShoot;
            // img.onload = function() {
            //     document.body.appendChild(img)
            // }
            this.cancelRubberBand()
        }
    },
    mounted (){
        this.enableDrawBox();
    },
    beforeUnmount() {
        this.disableDrawBox();
    }
}
</script>

<style>
.container{
    width: 100%;
    height: 100%;
    position: relative;
}
.container video{
    width: 100%;
    height: 100%;
}
#rubberbandDiv{
    position: absolute;
    border: 3px solid blue;
    cursor: crosshair;
    display: none;
}
#rubberbandDiv .rubberband-operate-box{
    position: absolute;
    right: 0;
    bottom: 0;
    height: 32px;
    transform: translateY(100%);
    display: none;
}
#rubberbandDiv .rubberband-operate-box >div{
    height: 100%;
    width: 60px;
    background: #707070;
    display: flex;
    align-items: center;
    float: left;
    border: 1px #000 solid;
    cursor: pointer;
    justify-content: center;
}
#rubberbandDiv .rubberband-operate-box .ensure{
    fill: green;
}
#rubberbandDiv .rubberband-operate-box .cancel{
    fill: red;
}
</style>
