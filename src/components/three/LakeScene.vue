<template>
  <div class="container">
    <div ref="threeContainer" class="three-wrapper"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Water } from "three/examples/jsm/objects/Water2";

const scene = new THREE.Scene();
const threeContainer = ref(null);

onMounted(() => {
  const wrap = threeContainer.value;
  console.log(wrap);
  // 初始化相机
  const camera = new THREE.PerspectiveCamera(
    75,
    wrap.offsetWidth / wrap.offsetHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);
  camera.updateProjectionMatrix();

  // 初始化渲染器
  const renderer = new THREE.WebGL1Renderer({
    // 设置抗锯齿
    antialias: true,
  });
  renderer.setSize(wrap.offsetWidth, wrap.offsetHeight);
  wrap.appendChild(renderer.domElement);

  // 设置色调映射
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
  // 设置水面效果

  // 初始化控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-8, 2, 0);
  controls.enableDamping = true;

  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );

  let rgbeLoader = new RGBELoader();
  rgbeLoader.load("/textures/sky.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });

  // 初始化loader
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);


  // 创建水面
  const waterGeometry = new THREE.CircleGeometry(300, 32);
  const water = new Water(waterGeometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0xeeeeff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 10,
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.4;
  scene.add(water);

  // 添加平行光
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 50, 0);
  scene.add(light);

  // 添加点光源
  const pointLight = new THREE.PointLight(0xffffff, 50);
  pointLight.position.set(0.1, 2.4, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  }
  render();
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .three-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>