<template>
    <div class="monitor-wrapper">
      <div id="play_window"></div>
    </div>
</template>

<script>
const JSPlugin = window.JSPlugin
export default {
  props:{
    // videoKey:{
    //   type:String,
    //   default:new Date().toString()
    // },
    // videoName:{
    //   type:String,
    //   default:""
    // },
    // videoUrl:{
    //   type:String,
    //   default:''
    // }
  },
  data() {
    return {
      player:null,
      videoUrl:'rtmp://58.200.131.2:1935/livetv/hunantv'
    }
  },
  computed:{
    // videoId() {
    //   return 'play_window_'+this.videoKey
    // }
  },
  methods:{
    init(){
      const that = this
      // let my
      this.player = new JSPlugin({
        szId:'play_window',
        szBasePath:'./js/h5Player',
        // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高 // 
        iWidth: 600, 
        iHeight: 400, 
        // 分屏播放，默认最大分屏4*4 // 
        iMaxSplit: 4, // 
        iCurrentSplit: 1, 
        // 样式
        // oStyle: { 
          // border: "#343434", 
          // borderSelect: "#FFCC00", 
          // background: "#000" 
        // }
      })
      this.play()
    },
    play(){
      const playURL = this.videoUrl
      this.player.JS_Play(this.videoUrl,{ playURL,mode:0},0)
    }
  },
  mounted(){
    this.init()
  }
}
</script>

<style scoped>
.monitor-wrapper{
  /* width: 600px;
  height:400px; */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#play_window{
  width: 600px;
  height:400px
}
</style>