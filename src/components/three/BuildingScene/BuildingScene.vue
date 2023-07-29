<template>
    <div class="wrapper" id="three-wrapper">
        <div ref="threeContainer" class="three-wrapper"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Water } from "three/examples/jsm/objects/Water2";
import * as dat from 'dat.gui'

const scene = new THREE.Scene();
const threeContainer = ref(null);
let container = null
let camera = null
let renderer = null
let controls = null
let buildScene = null

let jbShadar4Time = 0
let jbShadar4Speed = 0.007
const jbShadar4 = {
    uniforms: {
        color1:{
            value:new THREE.Color('#142034')     //
        },
        color2:{
            value:new THREE.Color('#4d83ff')     //
        },
        color3:{
            value:new THREE.Color('#6ac5fc')     //
        },
        addVal:{
            value:10.0
        },
        lightHeight:{
            value:0
            // value:-20.0
        },//运动时高度  -1.2
        lightWidth:{
            value:-36.0
        },// 大小(高度) 0.3  上下扫描线宽度
        colorGo:{
            value:new THREE.Color('#ffffff')
        },

    },

    vs: `
    precision lowp float;
    precision lowp int;
    varying vec2 vUv;
    varying float v_px;
    varying float v_py;
    varying float v_pz;

    void main() {
        vUv = uv;
        v_px = position.x;
        v_py = position.y;
        v_pz=position.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        
    }
    `,

    fs: `
    varying vec2 vUv;
    varying float v_px;
    varying float v_py;
    varying float v_pz;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform vec3 colorGo;
    uniform float addVal;
    uniform float lightHeight;
    uniform float lightWidth;
            
    float plot (float pct){
        return  smoothstep( pct-lightWidth*1.0, pct, v_pz) - smoothstep( pct, pct+lightWidth, v_pz);
    }

    void main() {
        vec4 c1=vec4(color3.r,color3.g,color3.b,0.4);
        vec4 c2=vec4(color1.r,color1.g,color1.b,0.4);
        float f1 = plot(lightHeight);
        vec4 b1 = vec4(colorGo.r, colorGo.g, colorGo.b, 1.0) ;
        // gl_FragColor = mix(c1.rgba,b1,f1);

        float posMix = v_pz / (-10000.0 * 1.0);
        vec4 mixColor = mix(c1.rgba,c2.rgba,posMix);
        gl_FragColor =  mix(mixColor,b1,f1);;

        // if(v_pz < -5000){
        //     gl_FragColor = vec4(color3.r,color3.g,color3.b,0.4);
        // }
        // if(v_pz >= -5000){
        //     gl_FragColor = vec4(color1.r,color1.g,color1.b,1);
        // }
    }
    `
}

const lineMat = new THREE.LineBasicMaterial({
    color:'#b2e7f9', //58595a
    transparent:true,
    opacity:1.0,
})
const wallMat = new THREE.ShaderMaterial({
    uniforms:jbShadar4.uniforms,
    vertexShader:jbShadar4.vs,
    fragmentShader:jbShadar4.fs,
    // blending: THREE.AdditiveBlending,
    blending:THREE.NormalBlending,
    transparent: true,
    depthTest: true,
    depthWrite:true,
    side: THREE.DoubleSide,
    opacity:1.0
})

onMounted(() => {
    init()
    initModel()
    render()
})
function init(){
    container = threeContainer.value
    camera = new THREE.PerspectiveCamera(
        30,
        container.offsetWidth / container.offsetHeight,
        10,
        100000
    );
    camera.position.set(2384.384439251435,707.9645990944131,-1376.5606072017977)

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        // logarithmicDepthBuffer:true,//精度更高的z缓冲，来代替原有的Z缓冲
        logarithmicDepthBuffer:false,//
        preserveDrawingBuffer:false,
        autoClear:false,
        alpha:true,
        precision:'highp',
        stencil:false
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement)
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(-196.00554642760775,-12.436204915771484,-282.750944314453)

    let rgbeLoader = new RGBELoader();
    // 
    rgbeLoader.load("/textures/hdr/night.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
    });

    const AmbientLight=new THREE.AmbientLight('#fff',1)
    scene.add(AmbientLight);

    container.addEventListener('click',function(event){
        getCamera()
    })

}

function initModel(){
    // 初始化loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let envMap = new THREE.TextureLoader().load('/textures/sky/bluesky.jpg');
    envMap.mapping = THREE.EquirectangularReflectionMapping;

    let material = new THREE.MeshPhysicalMaterial({
        color: "#fff",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
        envMap,
        envMapIntensity: 1,//1
        // reflectivity: 1,
        roughness:0.7,   //0.5
        metalness:1.0,
        depthWrite:true,
        depthTest:true,
        forceSinglePass:false
    }) 
    let dimianMat = material.clone()
    dimianMat.opacity = 0.7
    let otherMat = material.clone()

    gltfLoader.load("/models/glb/sx_lanmo.glb",gltf => {
        buildScene = gltf.scene
        gltf.scene.scale.set(5.0, 5.0, 5.0);

        gltf.scene.traverse(obj => {
               
            obj.material = material
            if(obj.name.split('_')[0] == 'dimian'){
                obj.material = dimianMat
                let floor = parseInt(obj.name.split('_')[2])
                if(floor){
                    obj.renderOrder = floor
                }
            }else{

                obj.material = otherMat
                obj.renderOrder = 25
        
            }
            obj.material.side = THREE.DoubleSide
            obj.castShadow = false
            obj.receiveShadow = false

            if(obj.isMesh){
                let o = obj
                if(o.name.indexOf('wall')!=-1){     //
                    o.material= wallMat  //22000.0,7.0

                    var edges = new THREE.EdgesGeometry(o.geometry, 50);
                    var edgesMaterial = lineMat
                    var line = new THREE.LineSegments(edges, edgesMaterial);
                    o.add(line);
                }
            }
        })

        scene.add(gltf.scene)

    })


}
function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update()
    uniformUpdate()

}

function getCamera() {
    console.log("camera",JSON.stringify(camera.position));
    console.log("control",JSON.stringify(controls.target));
}

function uniformUpdate(){
    jbShadar4Time+=jbShadar4Speed
    var xV=Math.sin(jbShadar4Time)*5000.0-5000.0
    jbShadar4.uniforms.lightHeight.value = xV  

}
</script>

<style lang="scss" scoped>
.wrapper{
    height: 100%;
    width: 100%;
    .three-wrapper {
        width: 100%;
        height: 100%;
    }
}
</style>