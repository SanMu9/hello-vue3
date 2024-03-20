<template>
  <div class="wrapper" id="three-wrapper">
    <div id="canvas_modal" class="canvas-modal">
    <div id="css3-container" class="css3-container"></div>
    </div>
    <div class="btns">
      <div @click="(ev)=>selectFloor(1,ev)">1</div>
      <div @click="(ev)=>selectFloor(14,ev)">14</div>
      <div @click="(ev)=>selectFloor(25,ev)">25</div>
      <div @click="(ev) =>backToInit(ev)">返回</div>
      <div @click="(ev) => updateControlTargetPoint(ev)">显示视角中心</div>
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
import * as dat from 'dat.gui'

let CUR_MODE = "BuildingSelected"
let MODE_DESC = {
  "init":"页面初始状态",
  "FloorSelected":"选择了楼层",
  "BuildingSelected":"选择了楼栋"
}

let gui = new dat.GUI()

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

let controlTargetPoint = null

let meshLambertMaterial = new THREE.MeshLambertMaterial({
  color:new THREE.Color('#049EF4')
})
console.log(meshLambertMaterial)
let MeshLambertMaterialControl = new function(){
    this.opacity = meshLambertMaterial.opacity
    this.transparent = meshLambertMaterial.transparent
    this.emissive = meshLambertMaterial.emissive.getHex();
    // this.ambient = meshLambertMaterial.ambient.getHex();
    this.side = "front";
    this.color = meshLambertMaterial.color.getStyle();
}

let buildingMaterial = new THREE.MeshLambertMaterial({
      color:new THREE.Color('#3f74a3'),
      opacity:0.6,
      transparent:true,
      side:THREE.DoubleSide,
    })

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
      mesh: null,
      floorViewData:{
        14:{
          camera:{"x":-0.4669912767529637,"y":2.767000905179911,"z":0.9258178935803294},
          control:{"x":0.6357519782617699,"y":0.5155773118360302,"z":-1.0159543946494285}
        }
      }
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
      // scene.add(camera);

      // camera.position.set(10, 10, 10);
      // 创建渲染器
      let renderer = new THREE.WebGLRenderer({ antialias: true });
      // this.renderer = renderer
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
      this.setView(camera,control,
      new THREE.Vector3(-1.8333141722719852,3.199398415052984,3.0639390786542915),
      new THREE.Vector3(0.9866461002891399,1.4348797167431728,-1.4097978736828523))

      scene.add(new THREE.AxesHelper(100,100,100))
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
      
      let dom = document.createElement('div')
      dom.classList.add('three-div')
      let objectCss = new CSS3DObject(dom)
      objectCss.position.x = 0
      objectCss.position.y = 5
      objectCss.position.z = 0
      scene.add(objectCss)
      console.log(objectCss)
      // 


      var loader = new GLTFLoader();
      let dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);

      let that = this;

      
      // loader.load("/models/w03_2.glb",gltf => {
      //   let buildingMaterial = new THREE.MeshLambertMaterial({
      //     color:new THREE.Color('#3f74a3'),
      //     opacity:0.2,
      //     transparent:true,
      //     side:THREE.DoubleSide,
      //   })
      //   gltf.scene.scale.set(1, 1, 1);
      //   gltf.scene.position.set(0, 0, 0)
      //   scene.add(gltf.scene);
      //   gltf.scene.traverse(obj => {
      //     obj.material = buildingMaterial
      //   })
      // })
      

      loader.load("/models/w03_1.glb",(gltf) => {
        console.log("模型加载完成",gltf)
        gltf.scene.name = 'floor'
        modalScene = gltf.scene
        // console.log(mesh)
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(0, 0, 0)
        scene.add(gltf.scene);

        // gltf.scene.traverse(obj => {
        //   obj.material.opacity = 0.5
        // })

        that.initMehGroupMap(gltf.scene)
        console.log(modalMeshGroupMap)

        screenDom.addEventListener('mousemove',that.hoverHandler)
        screenDom.addEventListener('click',function(){
          that.getViewInfo(camera,control)
        })
        screenDom.addEventListener('resize',function(){
          let screenDom = document.getElementById("canvas_modal");
          let height = screenDom.offsetHeight;
          let width = screenDom.offsetWidth;
          renderer.setSize(width, height);
          css3Renderer.setSize(width,height)

        })

      })

      this.addMeshLambertMaterialControl()

      function render() {
        renderer.render(scene, camera);
        css3Renderer.render(scene, camera)
        control.update()
        requestAnimationFrame(render);
        TWEEN.update()
      }

      render();
      this.setControlTarget()

    },
    initMehGroupMap(arr){
      let data = arr.children
      for(let i = 0;i <data.length;i++){
        let group = data[i]
        if(group.type === 'Mesh'){
          let name = group.name
          modalMeshGroupMap.set(name,arr)
          // console.log(group.material)
          // group.material.transparent = true
          // group.material.opacity = 0.5
          group.material = meshLambertMaterial

          // group.material = buildingMaterial
          
          // if(name.split("_")[0] === 'wall03'){
          //   console.log(group,name)
          //   group.material.opacity = 0
          //   group.material.transparent = true
          //   group.material.side = THREE.DoubleSide
          // }
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

      if(CUR_MODE == 'BuildingSelected'){
        const intersects = raycaster.intersectObject(modalScene);
        if(intersects.length){
          let mesh = intersects[0].object
          let name = mesh.name
          // console.log("当前mesh",name,mesh.material)
          let group = modalMeshGroupMap.get(name)
          let floorName = group.name
          // console.log("当前楼层",group.name,group.children)
          if(floorSelected&&floorSelected.name === floorName){
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
            children[i].material = new THREE.MeshLambertMaterial({
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
      }
      
    },
    clickHandler(event){
      mouse.x = ((event.clientX ) / width) * 2 - 1;
      mouse.y = -((event.clientY ) / height) * 2 + 1;
      // 如果当前为 BuildingSelected 状态
      if(CUR_MODE == 'BuildingSelected'){
        raycaster.setFromCamera(mouse,camera)
        const intersects = raycaster.intersectObject(modalScene);
        if(intersects.length){
          let mesh = intersects[0].object
          let name = mesh.name
          // console.log("当前mesh",name,mesh.material)
          let group = modalMeshGroupMap.get(name)
          let floorName = group.name
          // console.log("当前楼层",group.name,group.children)
          if(floorSelected&&floorSelected.name === floorName){
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
            children[i].material = new THREE.MeshLambertMaterial({
              color:new THREE.Color('#049EF4')
            })
          }
      }
    }
      
    },

    selectFloor(floorNum,ev){
      ev.preventDefault()
      ev.stopPropagation()
      CUR_MODE = "FloorSelected"
      let that = this 
      let children = modalScene.children
      const group = children.find(item => {
        return floorNum == item.name.split("_")[1]
      })
      group.visible = true

      let view = that.floorViewData[floorNum]
      if(view){
        that.viewFlyTo(camera,control,view.camera,view.control,2000,function(){})
      }
      for(let i=0;i<children.length;i++){
        let floor = children[i]
        let floorNo = parseInt(children[i].name.split("_")[1] )
        if(floorNo>floorNum){
          gsap.to(floor.position, {
            y: floorNo / 10,
            duration: 3,
            
            onComplete: () => {
              if(CUR_MODE == 'FloorSelected'){
                floor.visible = false
                floor.position.y = 0
              }
            }
          });
        }else if(floorNo<floorNum){
          gsap.to(floor.position, {
            y: (floorNo-floorNum)/10,
            duration: 2,
            
            onComplete: () => {
              if(CUR_MODE == 'FloorSelected'){
                floor.visible = false
                floor.position.y = 0
              }
            }
          });
        }
       
      }
    
    },

    getViewInfo(camera,controls){
      console.log(JSON.stringify(camera.position));
      console.log(JSON.stringify(controls.target))
    },

    setView(camera,controls,cameraPos,controlTarget){
      camera.position.set(cameraPos.x,cameraPos.y,cameraPos.z)
      controls.target.set(controlTarget.x,controlTarget.y,controlTarget.z)
      controls.update()
    },

    viewFlyTo(camera,controls,cameraPos,controlTarget,duration,callback){
      let pos = new THREE.Vector3(cameraPos.x,cameraPos.y,cameraPos.z)
      let target = new THREE.Vector3(controlTarget.x,controlTarget.y,controlTarget.z)
      let tween = new TWEEN.Tween(camera.position).to(cameraPos,duration)
      let tween2 = new TWEEN.Tween(controls.target).to(controlTarget,duration)
      tween.onComplete(function(){
        console.log("动画完成")
        if(callback){
          callback()
        }
      })
      tween.start()
      tween2.start()
    },

    buildingFloorRecover(){
      let floors = modalScene.children
      for(let i=0;i<floors.length;i++){
        floors[i].visible = true

        let floor = floors[i]
        gsap.to(floor.position, {
            y: 0,
            duration: 3,
            
            onComplete: () => {
              floor.visible = true
              // gsap.to(floor.position, {
              //   y: 0,
              //   duration: 3,
              // });
            }
        });
      }
    },
    backToInit(ev){
      ev.stopPropagation()
      CUR_MODE = "BuildingSelected"
      this.buildingFloorRecover()
      this.viewFlyTo(camera,control,new THREE.Vector3(-1.8333141722719852,3.199398415052984,3.0639390786542915),
      new THREE.Vector3(0.9866461002891399,1.4348797167431728,-1.4097978736828523),2000)
    },

    setControlTarget(){
      const target = JSON.parse(JSON.stringify(control.target))
      
      var geosp = new THREE.SphereGeometry(0.1, 5, 5);
      var matsp = new THREE.MeshBasicMaterial({
        color: "lightgreen",
      });
      controlTargetPoint = new THREE.Mesh(geosp, matsp);
      controlTargetPoint.position.copy(
        new THREE.Vector3(
          target.x,
          target.y,
          target.z
        )
      );
      scene.add(controlTargetPoint);
    },

    updateControlTargetPoint(ev){
      ev.stopPropagation()
      const target = JSON.parse(JSON.stringify(control.target))
      controlTargetPoint.position.copy(
        new THREE.Vector3(
          target.x,
          target.y,
          target.z
        )
      );
    },

    addMeshLambertMaterialControl(){
      let control = gui.addFolder("LambertMaterial")
      control.add(MeshLambertMaterialControl,'opacity',0,1).onChange(function(e){
        meshLambertMaterial.opacity = e
      })
      control.add(MeshLambertMaterialControl, 'transparent').onChange(function (e) {
          meshLambertMaterial.transparent = e
      });
      
      // control.addColor(MeshLambertMaterialControl, 'ambient').onChange(function (e) {
      //     meshLambertMaterial.ambient = new THREE.Color(e)
      // });
      control.addColor(MeshLambertMaterialControl, 'emissive').onChange(function (e) {
          meshLambertMaterial.emissive = new THREE.Color(e)
      });
      control.add(MeshLambertMaterialControl, 'side', ["front", "back", "double"]).onChange(function (e) {
          console.log(e);
          switch (e) {
              case "front":
                  meshLambertMaterial.side = THREE.FrontSide;
                  break;
              case "back":
                  meshLambertMaterial.side = THREE.BackSide;
                  break;
              case "double":
                  meshLambertMaterial.side = THREE.DoubleSide;
                  break;
          }
          meshLambertMaterial.needsUpdate = true;

      });
      control.addColor(MeshLambertMaterialControl, 'color').onChange(function (e) {
          meshLambertMaterial.color.setStyle(e)
      });

    }
    
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
  .btns{
    position: absolute;
    top: 5px;
    right: 10px;
    color: rgb(41, 194, 221);
    >div{
      border: 1px solid rgb(41, 194, 221);
      padding: 0 2px;
      margin: 3px 0;
      cursor: pointer;
    }
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