<template>
  <div id="container"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

let camera, scene, renderer;
let controls;
let gui = new dat.GUI()
const clock = new THREE.Clock()
let mixer
let container

onMounted(()=>{
  init()
})

function init(){
  container = document.getElementById('container')

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth,window.innerHeight)
  container.appendChild(renderer.domElement)

  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xbfe3dd );
  scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100)
  camera.position.set( 5, 2, 8 );

  controls = new OrbitControls( camera, renderer.domElement );
  //controls.maxPolarAngle = Math.PI / 2;
  controls.enableZoom = true;
  controls.enablePan = true;

  // Instantiate a loader
  const dracoLoader = new DRACOLoader();
  // Specify path to a folder containing WASM/JS decoding libraries.
  dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );

  const loader = new GLTFLoader()
  const path  = location.origin+'/models/rocket.glb'
  console.log(path)
  loader.load(path,function(gltf){
    console.log(gltf)
    const model = gltf.scene;
    model.position.set(1,1,0)
    model.scale.set(0.1,0.1,0.1)
    scene.add(model)
    mixer = new THREE.AnimationMixer(model)
    mixer.clipAction(gltf.animations[0]).play()
    animate()

  },undefined,function(err){
    console.error(err)
  })

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  };

  function animate() {

    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    mixer.update( delta );
    controls.update();
    renderer.render( scene, camera );

  }





}

</script>

<style scoped>
#container{
  width: 100%;
  height: 100%;
  position: relative;
}
</style>