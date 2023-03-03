<template>
  <div id="container"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sky } from 'three/examples/jsm/objects/Sky';
import * as dat from 'dat.gui'

let container;
let camera, scene, renderer;
let controls, sky, sun, moon;
let gui = new dat.GUI()

// 场景初始化

onMounted(() => {
  init()
})

function init(){
  container = document.getElementById('container')

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping;// toneMapping  这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果
  renderer.toneMappingExposure = 1 //色调映射的曝光级别。默认是1
  container.appendChild(renderer.domElement)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,1,20000)
  camera.position.set(30,30,100)

  controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  //controls.maxPolarAngle = Math.PI / 2;
  controls.enableZoom = false;
  controls.enablePan = false;

  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );

  initSky()
  render()
  window.addEventListener('resize',onWindowResize)
}
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();
}
function render() {
  requestAnimationFrame(render);
  renderer.render( scene, camera );
}

function initSky(){
  // add sky
  sky = new Sky()
  sky.scale.setScalar(450000)
  scene.add(sky)

  sun = new THREE.Vector3()

  const uniforms = sky.material.uniforms

  // gui
  const effectControl = {
    turbidity:10,
    rayleigh:3,
    mieCoefficient:0.005,
    mieDirectionalG:0.7,
    elevation:2,//仰角
    azimuth:180,//方位角
    exposure:renderer.toneMappingExposure
  }

  function guiChange(){
    uniforms['turbidity'].value = effectControl.turbidity
    uniforms['rayleigh'].value = effectControl.rayleigh
    uniforms['mieCoefficient'].value = effectControl.mieCoefficient
    uniforms['mieDirectionalG'].value = effectControl.mieDirectionalG

    const phi = THREE.MathUtils.degToRad(90-effectControl.elevation);
    const theta = THREE.MathUtils.degToRad(effectControl.azimuth);
    sun.setFromSphericalCoords(1,phi,theta)// 从球坐标中的radius、phi和theta设置该向量。

    uniforms['sunPosition'].value.copy(sun)

    renderer.toneMappingExposure = effectControl.exposure
  }

  

  gui.add(effectControl,'turbidity',0.0, 20.0, 0.1).onChange(guiChange)
  gui.add(effectControl,'rayleigh',0.0, 4.0, 0.001).onChange(guiChange)
  gui.add(effectControl,'mieCoefficient',0.0, 0.1, 0.001).onChange(guiChange)
  gui.add(effectControl,'mieDirectionalG',0.0, 1, 0.001).onChange(guiChange)
  gui.add(effectControl,'elevation',0.0, 180, 0.1).onChange(guiChange)
  gui.add(effectControl,'azimuth',-180, 180, 0.1).onChange(guiChange)
  gui.add(effectControl,'exposure',0.0, 1, 0.0001).onChange(guiChange)

  guiChange()
  
}

</script>

<style lang="scss" scoped>
#container{
  height: 100%;
}
</style>