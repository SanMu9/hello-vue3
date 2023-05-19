<template>
  <div class="wrapper" id="three-wrapper">
    <div id="canvas_modal" class="canvas-modal">
    <div id="css3-container" class="css3-container"></div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { CSS3DRenderer,CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import gsap from "gsap";
import TWEEN from "tween";

let scene = null
let camera = null
let renderer = null
let control = null
let mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster()
let modalMeshGroupMap = new Map()
let height = 0;
let width = 0;
let css3Renderer = new CSS3DRenderer()
let css3Scene = null
let modalScene = null
let floorSelected = null

let floorMeshMatMap = new Map()
export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      control: null,
      raycaster: null,
      mouse: null,
      floorModal: false,
      mesh: null
    }
  },
  methods:{
    init(){
      scene = new THREE.Scene()
      let screenDom = document.getElementById("canvas_modal");
      height = screenDom.offsetHeight;
      width = screenDom.offsetWidth;

      scene.background = new THREE.Color('#0e2e49');
      // 创建相机
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.aspect = width / height;
      // 更新摄像头投影矩阵
      camera.updateProjectionMatrix();
      // 设置相机位置
      camera.position.set(
        -2.0011235303182335,
        3.531545912723859,
        4.387892116312748
      );
      scene.add(camera);

      // camera.position.set(10, 10, 10);
      // 创建渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true });
      let renderer = renderer
      renderer.setSize(width, height);

      screenDom.appendChild(renderer.domElement);

      // // 创建辅助坐标轴
      let axes = new THREE.AxesHelper(5);
      scene.add(axes);
      // 添加控制器
      control = new OrbitControls(camera, renderer.domElement);
      control.target.set(
        1.1629928721901817,
        3.142211601778752,
        -2.0732301836198355
      );

      //  //平行光
      let AmbientLight1 = new THREE.AmbientLight("#fff", 1);
      scene.add(AmbientLight1);

      let directionalLight1 = new THREE.DirectionalLight("#fff", 2);
      directionalLight1.castShadow = true;
      directionalLight1.position.set(1000, 1000, 2000);
      directionalLight1.target.position.set(0, 0, 0);
      directionalLight1.castShadow = true;

      directionalLight1.shadow.mapSize.set(2560, 2560);
      directionalLight1.shadow.camera.near = -9000;
      directionalLight1.shadow.camera.far = 6500;
      directionalLight1.shadow.camera.left = -2200;
      directionalLight1.shadow.camera.right = 2200;
      directionalLight1.shadow.camera.top = 900;
      directionalLight1.shadow.camera.bottom = -1000;
      directionalLight1.shadow.bias = -0.0005;

      scene.add(directionalLight1);

      // 
      css3Renderer =  new CSS3DRenderer()
      css3Renderer.setSize(width,height)
      css3Renderer.domElement.style.position = 'absolute';
      css3Renderer.domElement.style.top = '0px';    
      document.getElementById('css3-container').appendChild(css3Renderer.domElement)
      
      // let dom = document.createElement('div')
      // dom.classList.add('three-div')
      // let objectCss = new CSS3DObject(dom)
      // objectCss.position.x = 0
      // objectCss.position.y = 5
      // objectCss.position.z = 0
      // scene.add(objectCss)
      // 


      var loader = new GLTFLoader();
      let dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);

      let that = this;

      

      loader.load("/models/w03.glb",(gltf) => {
        console.log("模型加载完成",gltf)
        gltf.scene.name = 'floor'
        modalScene = gltf.scene
        // console.log(mesh)
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(0, 0, 0)
        scene.add(gltf.scene);
        that.initMehGroupMap(gltf.scene)
        console.log(modalMeshGroupMap)
        
     

        window.addEventListener('mousemove',that.hoverHandler)

      })

      function render() {
        renderer.render(scene, camera);
        css3Renderer.render(scene, camera)
        control.update()
        requestAnimationFrame(render);
      }

      render();

    },
    initMehGroupMap(arr){
      let data = arr.children
      for(let i = 0;i <data.length;i++){
        let group = data[i]
        if(group.type === 'Mesh'){
          let name = group.name
          modalMeshGroupMap.set(name,arr)
          floorMeshMatMap.set(name,group.material)
        }else{
          if(group.children){
            this.initMehGroupMap(group)
          }
        }
      }
    },
    hoverHandler(event){
      mouse.x = ((event.clientX ) / width) * 2 - 1;
      mouse.y = -((event.clientY ) / height) * 2 + 1;
      raycaster.setFromCamera(mouse,camera)
      const intersects = raycaster.intersectObject(modalScene);
      if(intersects.length){
        let mesh = intersects[0].object
        let name = mesh.name
        console.log("当前mesh",name,mesh.material)
        let group = modalMeshGroupMap.get(name)
        let floorName = group.name
        console.log("当前楼层",group.name,group.children)
        if(floorSelected&&floorName.name === floorName){
          return
        }
        // 还原material
        if(floorSelected){
          let children = floorSelected.children
          for(let i=0;i<children.length;i++){
            children[i].material = floorMeshMatMap.get(children[i].name)
          }
        }
        floorSelected = group
        let children = group.children
        for(let i=0;i<children.length;i++){
          children[i].material = new THREE.MeshBasicMaterial({
            color:new THREE.Color('#049EF4')
          })
        }
        
      }else{
         // 还原material
        if(floorSelected){
          let children = floorSelected.children
          for(let i=0;i<children.length;i++){
            children[i].material = floorMeshMatMap.get(children[i].name)
          }
        }
      }
    },
  
    
    
  },
  mounted(){
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.wrapper{
  height: 100%;
  width: 100%;
  background-color: rgba(14, 46, 73, 1);
  .canvas-modal{
    height: 100%;
  }
  .css3-container{
    height: 100%;
    position: absolute;
    top: 0;
    pointer-events: none;

  }
}
</style>
<style>
.three-div {
  width:2px;
  height: 2px;
  background-color: red;
}
</style>