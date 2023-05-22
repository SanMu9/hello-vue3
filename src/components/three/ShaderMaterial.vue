<template>
  <div id="container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount} from "vue";
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { WaterShader,CustomShader,FireShader,CloudShader, GridLightShader,GridLightShader2,FireworksShader,FireShader2} from "./lib/ShaderMateriel";
let container;
let camera, scene, renderer, clock;
let controls
let gui = new dat.GUI()
let shaders = {WaterShader,CustomShader,FireShader,CloudShader,GridLightShader,GridLightShader2,FireworksShader,FireShader2}
let guiShaderOpts = ['WaterShader','CustomShader','FireShader','FireShader2','CloudShader','GridLightShader','GridLightShader2','FireworksShader',]
let shader = WaterShader
onMounted(()=>{
  init()
  animate()
})
onBeforeUnmount(()=>{
  gui.destroy()
  window.removeEventListener( 'resize', onWindowResize, false );
})
function init(){
  container = document.getElementById('container')
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  let axes = new THREE.AxesHelper(20);
  scene.add(axes);

  camera.position.x = 20;//红线方向
  camera.position.y = 20;//绿线
  camera.position.z = 30;//蓝线
  camera.lookAt(scene.position);

  controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );

  clock = new THREE.Clock();

  let geometry = new THREE.BoxGeometry(10,10,10)
  let material = new THREE.ShaderMaterial(shader)

  let mesh = new THREE.Mesh(geometry,material)
  scene.add(mesh)

  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );

  let GuiControls = new function(){
    this.changeShader = 'WaterShader'
    this.selectShader = function(e){
      shader = shaders[e]
      material = new THREE.ShaderMaterial(shader)
      mesh.material = material
    }
  }
  gui.add(GuiControls, "changeShader", guiShaderOpts).onChange(GuiControls.selectShader);


}
function onWindowResize( event ) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    shader.uniforms.iTime.value += clock.getDelta()/2;
    renderer.render( scene, camera );
}
</script>

<style lang="scss" scoped>
#container{
  height: 100%;
}
</style>