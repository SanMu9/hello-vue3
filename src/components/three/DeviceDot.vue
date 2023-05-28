<template>
  <div>
    <div id="city-container"></div>
    <!-- <div id="building-container"></div> -->
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount} from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Vector3 } from 'three';

import TWEEN from 'tween';
import * as dat from 'dat.gui'

const manager = new THREE.LoadingManager();
var loader=new GLTFLoader(manager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
loader.setDRACOLoader( dracoLoader );

let container = null
let scene = null
let buildingScene = null
let camera = null
let controls = null

let AmbientLight1 = null
let pointLight2 = null


function init(){
  initContainer()
  initScene()
  initCamera()
  initControls()
  initRenderer()
  initLight()
}
function initContainer(){
  container = document.getElementById("city-container")
}
function initScene(){
  scene = new THREE.Scene()
  buildingScene = new THREE.Scene()
}
function initCamera(){
  camera = new THREE.PerspectiveCamera(30,window.innerWidth/window.innerHeight ,10, 100000)
  camera.position.set(486.6500857806821,837.1912157283828,2030.0538844141317)
}

function initLight() {
  let AmbientLight1=new THREE.AmbientLight('#fff',1)
  scene.add(AmbientLight1);

  let pointLight2 = new THREE.PointLight("#ffffff", 0.1);
  pointLight2.position.set(896.2745213045123, 249.68234367236601, -548.9733088617019);
  this.scene.add(pointLight2);



  let pointLight3 = new THREE.PointLight("#ffffff", 0.1);
  pointLight3.position.set(681.9938581037145, 249.154107508444202, -265.7308369865375);
  this.scene.add(pointLight3);



  let pointLight4 = new THREE.PointLight("#ffffff", 0.1);   //EEDD0D
  pointLight4.position.set(201.36166854475195, 249.47328204789148, -51.78066930741193+100);
  this.scene.add(pointLight4);


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


  this.scene.add(directionalLight1);
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
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  renderer.render(scene,camera);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.needsUpdate = true;
  renderer.localClippingEnabled=true
}

function initLight(){
    AmbientLight1=new THREE.AmbientLight('#fff',1)
    scene.add(AmbientLight1);

    pointLight2 = new THREE.PointLight("#ffffff", 0.1);
    pointLight2.position.set(896.2745213045123, 249.68234367236601, -548.9733088617019);
    scene.add(pointLight2);

    this.pointLight3 = new THREE.PointLight("#ffffff", 0.1);
    this.pointLight3.position.set(681.9938581037145, 249.154107508444202, -265.7308369865375);
    this.scene.add(this.pointLight3);



    this.pointLight4 = new THREE.PointLight("#ffffff", 0.1);   //EEDD0D
    this.pointLight4.position.set(201.36166854475195, 249.47328204789148, -51.78066930741193+100);
    this.scene.add(this.pointLight4);


    this.directionalLight1 = new THREE.DirectionalLight("#fff", 2.5);
    this.directionalLight1.castShadow = true;
    this.directionalLight1.position.set(1578.141853090013+100, 1023.732229319972422, 2494.5078842210496+100);
    this.directionalLight1.target.position.set(0, 0, 0);
    this.directionalLight1.castShadow = true;

    this.directionalLight1.shadow.mapSize.set(2560, 2560);
    this.directionalLight1.shadow.camera.near=-9000
    this.directionalLight1.shadow.camera.far=6500
    this.directionalLight1.shadow.camera.left = -2200;
    this.directionalLight1.shadow.camera.right = 2200;
    this.directionalLight1.shadow.camera.top = 900;
    this.directionalLight1.shadow.camera.bottom = -1000;
    this.directionalLight1.shadow.bias=-0.0005


    this.scene.add(this.directionalLight1);
}

onMounted(()=>{
  init()
})

</script>

<style scoped>
#city-container{
  height: 100%;
}
/* #building-container{
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
} */
</style>