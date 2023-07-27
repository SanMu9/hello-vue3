<template>
  <div style="height:100%;position:relative">
    <div id="city-container"></div>
    <div id="css3-container" class="css3-container"></div>
    <div class="btn-group">
      <div v-for="item in buildings" :key="item" @click="showBuilding(item)">{{item}}</div>
    </div>

    <div class="floor-btns">
      <div v-for="item in floors" :key="item" :class="{'cur':item==curFloorNum}" @click="(ev) => selectFloor(item,ev)">{{item}}</div>
    </div>
    <!-- <div id="building-container"></div> -->
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref} from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Vector3 } from 'three';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { CSS3DRenderer,CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

import TWEEN from 'tween';
import * as dat from 'dat.gui'

let CUR_MODE = "init"

let W = 0
let H = 0

let container = null
let scene = null
let buildingScene = null
let camera = null
let controls = null
let renderer = null
let css3Renderer = null

let loader = null

let objScene  = null

let plArrNew=[ '网格263_1','group10group2polySurface1008', 'group3group4polySurface1012', 'group5group3polySurface1002','group19polySurface11401','group19polySurface9748','objobjobjobjpolySurface2194','c09', 'objobjobjpolySurface1644']
let hideArr = ['objobjobjobjobjobjpolySurface3']
let dimianObj = ['pCube1075','pCube1009', 'objobjobjpolySurface2018', 'polySurface1989', 'lineGL95', 'objobjobjobjobjobjobjobjpolySurface29', 'polySurface2130', 'polySurface2189', 'pCube644', 'pCube1058', 'Rectangle2002033043', '建筑_木材011', 'polySurface2067', 'polySurface2068', 'polySurface2164', 'objobjpCube6', 'polySurface2014', 'objobjobjobjpCube138', 'polySurface2013']//,'polySurface1983'

let publicMaterial={
  // 透明蓝色材质
  transparentBlue: new THREE.MeshPhysicalMaterial({
      transparent: true,
      opacity: 0.4,
      // color: "#4E83D9",
      color: "#7a9cd2",
      specularColor: new THREE.Color("#7a9cd2"),
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.8
  }),
  // 透明蓝色材质2
  transparentBlue2: new THREE.MeshPhysicalMaterial({
      transparent: true,
      opacity: 0.9,
      // color: "#4E83D9",
      color: new THREE.Color("#7a9cd2").multiplyScalar(0.3),
      // specularColor: new Color("#53648D"),
      side: THREE.DoubleSide,
      // roughness: 0.5,
      // metalness: 0.8
  }),
  // 玻璃的材质
  glassMat: ((that) => {
      // 环境贴图
      var envMap = getTexture('/images/bluesky.jpg')
      envMap.mapping = THREE.EquirectangularReflectionMapping;

      const envMat = new THREE.MeshPhysicalMaterial({
          color: "#fff",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
          envMap,
          envMapIntensity: 1,
          // reflectivity: 1,
          roughness: 0.5,
          metalness: 1
      });

      return envMat;
  })(this)
}

let mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster()

let modalMeshGroupMap = new Map()
let floorMeshMatMap = new Map()

let buildings = ref(['w03'])

let buildingModels = {
  "w03":null
}
let buildingPos = {
  "w03":[0,10,0]
}
let buildingFloors = {
  "w03":new Array(25).fill(0).map((item,idx)=> { return idx+1})
}
let floors = ref([])
let curFloorNum = ref(0)
function getTexture(pic){
  var texture=new THREE.TextureLoader().load(pic)
  return texture
}
function init(){
  initContainer()
  initScene()
  initCamera()
  initControls()
  initRenderer()
  initLight()
  initLoader()
  initModel()
  animate()
}
function initContainer(){
  container = document.getElementById("city-container")
  W = container.offsetWidth
  H = container.offsetHeight
}
function initScene(){
  scene = new THREE.Scene()
  buildingScene = new THREE.Scene()
}
function initCamera(){
  camera = new THREE.PerspectiveCamera(30,W/H ,10, 100000)
  camera.position.set(486.6500857806821,837.1912157283828,2030.0538844141317)
}

function initLight() {
  let AmbientLight1=new THREE.AmbientLight('#fff',1)
  scene.add(AmbientLight1);

  let pointLight2 = new THREE.PointLight("#ffffff", 0.1);
  pointLight2.position.set(896.2745213045123, 249.68234367236601, -548.9733088617019);
  scene.add(pointLight2);



  let pointLight3 = new THREE.PointLight("#ffffff", 0.1);
  pointLight3.position.set(681.9938581037145, 249.154107508444202, -265.7308369865375);
  scene.add(pointLight3);



  let pointLight4 = new THREE.PointLight("#ffffff", 0.1);   //EEDD0D
  pointLight4.position.set(201.36166854475195, 249.47328204789148, -51.78066930741193+100);
  scene.add(pointLight4);


  let directionalLight1 = new THREE.DirectionalLight("#fff", 2.5);
  directionalLight1.castShadow = true;
  directionalLight1.position.set(1578.141853090013+100, 1023.732229319972422, 2494.5078842210496+100);
  directionalLight1.target.position.set(0, 0, 0);
  directionalLight1.castShadow = true;

  directionalLight1.shadow.mapSize.set(2560, 2560);
  directionalLight1.shadow.camera.near=-9000
  directionalLight1.shadow.camera.far=6500
  directionalLight1.shadow.camera.left = -2200;
  directionalLight1.shadow.camera.right = 2200;
  directionalLight1.shadow.camera.top = 900;
  directionalLight1.shadow.camera.bottom = -1000;
  directionalLight1.shadow.bias=-0.0005

  AmbientLight1.intensity=0.1
  pointLight2.intensity=0.1
  pointLight2.intensity=0.1
  pointLight2.intensity=0.1
  directionalLight1.intensity=0.5


  scene.add(directionalLight1);
}
function initControls() {
  controls = new OrbitControls(camera,container);
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI/2.1;
  controls.target = new Vector3(-25.779824898290673,152.34487355865735,-70.38663440490355)
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias:true
  })
  renderer.setSize(W,H)
  // renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  renderer.render(scene,camera);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.needsUpdate = true;
  renderer.localClippingEnabled=true

  css3Renderer =  new CSS3DRenderer()
  css3Renderer.setSize(W,H)
  css3Renderer.domElement.style.position = 'absolute';
  css3Renderer.domElement.style.top = '0px';    
  document.getElementById('css3-container').appendChild(css3Renderer.domElement)



}
function initLoader() {
  const manager = new THREE.LoadingManager();
  loader=new GLTFLoader(manager);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader( dracoLoader );
}
function initModel() {
   loader.load("/models/xianfu12.glb",function (obj) {
      scene.add(obj.scene)
      objScene = obj.scene
      obj.scene.scale.set(5700.0,5700.0,5700.0)
      objScene.position.x+=105.
      objScene.position.z+=20 //10080

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.needsUpdate = true;

      initModelScene()

      container.addEventListener('click',function(event) {
        getViewInfo(camera,controls)
        clickHandler(event)
      })
      container.addEventListener('resize',onWindowResize)
   })
}
function  getViewInfo(camera,controls){
  console.log('camera',JSON.stringify(camera.position));
  console.log('controls',JSON.stringify(controls.target))
}
function clickHandler(event){
  console.log(event)
    mouse.x = ((event.clientX ) / W) * 2 - 1;
    mouse.y = -((event.clientY ) / H) * 2 + 1;
    raycaster.setFromCamera(mouse,camera)

    if(CUR_MODE=="FloorSelected"){
      const intersects = raycaster.intersectObject(buildingScene);
      if(intersects.length){
        let mesh = null
        for(let i=0;i<intersects.length;i++){
          if(intersects[i].object.userData.floorNo == curFloorNum.value){
            mesh = intersects[i].object
            break
          }
        }
        if(mesh){
          console.log(mesh)
        }
      }
    }
}

function showBuilding(name){
  console.log(name)
  floors.value = buildingFloors[name]
  if(buildingModels[name]){
    buildingScene = buildingModels[name]
    buildingScene.visible = true
  }else{
    loader.load('/models/'+name+'.glb',gltf => {
      console.log(gltf)
      buildingModels[name] = gltf.scene
      buildingScene = gltf.scene
      buildingScene.name = name
      buildingScene.userData.name = name
      buildingScene.userData.type = 'building'

      buildingScene.scale.set(200, 200, 200);
      let pos = buildingPos[name]
      buildingScene.position.set(...pos)
      scene.add(buildingScene);
      initMehGroupMap(gltf.scene)

    })
  }
  CUR_MODE = "BuildingSelected"
}

function selectFloor(floorNo,ev){
  ev.preventDefault()
  ev.stopPropagation()
  CUR_MODE = "FloorSelected"
  curFloorNum.value = floorNo
  let children = buildingScene.children
  const group = children.find(item => {
    return floorNo == item.name.split("_")[1]
  })
  group.visible = true
  for(let i=0;i<children.length;i++){
    let floorNum = parseInt(children[i].name.split("_")[1])
    if(floorNo === floorNum){
      children[i].visible = true
    }else{
      children[i].visible = false
    }
  }
}

function initMehGroupMap(arr){
  let data = arr.children
  for(let i = 0;i <data.length;i++){
    let group = data[i]
    if(group.type === 'Mesh'){
      let name = group.name
      modalMeshGroupMap.set(name,arr)

      group.userData.floorNo = parseInt(arr.name.split("_")[1])
      group.castShadow = true
      group.receiveShadow = true
      // console.log(group.material)
      // group.material.transparent = true
      // group.material.opacity = 0.5
      // group.material = meshLambertMaterial
      floorMeshMatMap.set(name,group.material)
    }else{
      if(group.children){
        initMehGroupMap(group)
      }
    }
  }
}

function initModelScene() {
  initEnv()
  initDayScene()
}

function initEnv() {
  // traverseModel()
  // initRoof2()

  objScene.traverse(function (mesh) {
    if(mesh.isMesh){
        if (plArrNew.includes(mesh.name)) {
            mesh.geometry.computeVertexNormals();
            mesh.material = publicMaterial.glassMat;
            mesh.castShadow = true;
        } else {
            mesh.receiveShadow = true;
            mesh.geometry.computeVertexNormals();
            (mesh.material).roughness = 0.5;
            (mesh.material).metalness = 0;
            mesh.material.emissive=new THREE.Color("#000000")     //.set("#000000")
        }
        // // 提亮公路
        // if (glArr.includes(mesh.name)) {
        //     (mesh.material).emissive=new THREE.Color("#666")      //.set("#666")
        // }
    }
  })
}
function traverseModel(){
  objScene.traverse(function(obj){
    // if()
    if(plArrNew.indexOf(obj.name)!=-1 || dimianObj.indexOf(obj.name)!=-1 || obj.name=='polySurface2568'){  //
      if(obj.userData.oldmat){
          obj.material=obj.userData.oldmat
      }
    }
    if(hideArr.indexOf(obj.name)>=0){
      // console.log(obj)
      obj.visible = false
    }
    obj.castShadow = true;
    obj.receiveShadow=true
  })
}
function initRoof2(){}

function initDayScene(){
  initDaySky()
}
function initDaySky(){
  let rgbeLoader = new RGBELoader();
  // 
  rgbeLoader.load("/textures/hdr/sky_day.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });
}

function animate() {
  // render()
  requestAnimationFrame(animate);
  renderer.render(scene,camera)
  css3Renderer.render(scene, camera)
  controls.update()
  TWEEN.update()

}
function onWindowResize() {
  let screenDom = document.getElementById("city-container");
  //窗口变化时
  W = screenDom.offsetWidth;
  H = screenDom.offsetHeight;
  renderer.setSize(W, H);
  css3Renderer.setSize(width,height)
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
}


onMounted(()=>{
  init()
})

</script>

<style scoped lang="scss">
#city-container{
  height: 100%;
}
.css3-container{
  height: 100%;
  position: absolute;
  top: 0;
  pointer-events: none;

}
.btn-group{
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: column;
  color: rgb(41, 194, 221);
  >div{
    padding: 2px 4px;
    border: 1px solid rgb(41, 194, 221);
    cursor: pointer;
  }
}
.floor-btns{
  position: absolute;
  bottom: 5px;
  right: 5px;
  // height: 50%;
  display: flex;
  flex-direction: column;
  // flex-wrap: wrap;
  // align-items: end;
  color: rgb(41, 194, 221);
  >div{
    padding: 2px 4px;
    border: 1px solid rgb(41, 194, 221);
    cursor: pointer;
    margin-bottom: 3px;
    &.cur{
      color: #000;
      background: rgb(41, 194, 221);
    }
  }
}
/* #building-container{
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
} */
</style>