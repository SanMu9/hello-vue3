<template>
  <div class="container">
      <div ref="three" class="three-wrapper"></div>
  </div>
</template>

<script>
import * as THREE from '../../../public/three/three.module';
import '../../../public/three/controls/OrbitControls';
import {FBXLoader} from '.../../../public/three/loaders/FBXLoader';

let camera = null;
let scene = null;
let renderer = null;
let axes = null;
let controls = null;
const mixer = [];
export default {
    methods:{
        init(){
            this.initScene();
            this.initCamera();
            this.initRender();

            // renderer.setClearColorHex();

            axes = new THREE.AxisHelper(20);
            scene.add(axes);
            renderer.render(scene, camera);
            this.initOrbitControl();
            this.initLight();
            this.addFbx();

            this.animate();

            /* 事件监听 */
           
        },
        // 渲染器
        initRender(){
            const wrap = this.$refs.three;
            renderer = new THREE.WebGLRenderer();
            // renderer.setClearColor(new THREE.Color(0xaaaaff, 1.0));

            renderer.setSize(wrap.offsetWidth,wrap.offsetHeight);
            // renderer.shadowMap.enabled = true;
            wrap.appendChild(renderer.domElement)
        },
        // 场景
        initScene() {
            scene = new THREE.Scene();
        },
        // 相机
        initCamera() {
            const wrap = this.$refs.three;
            
            camera = new THREE.PerspectiveCamera(45,wrap.offsetWidth/wrap.offsetHeight,0.1,1000)
            // position and point the camera to the center of the scene
            // camera.position.x = 20;//红线方向
            // camera.position.y = 20;//绿线
            // camera.position.z = 30;//蓝线
            camera.position.set( 100, 200, 300 );
            camera.lookAt(new THREE.Vector3(0,0,0));
        },
        initOrbitControl(){
            controls = new THREE.OrbitControls(camera, renderer.domElement);
        },
        initLight(){
        //    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
		// 		hemiLight.position.set( 0, 800, 0 );
		// 		scene.add( hemiLight );

            // const dirLight = new THREE.DirectionalLight( 0xffffff );
            // dirLight.position.set( 100, 400, 100 );
            // dirLight.castShadow = true;
            // dirLight.shadow.camera.top = 180;
            // dirLight.shadow.camera.bottom = - 100;
            // dirLight.shadow.camera.left = - 120;
            // dirLight.shadow.camera.right = 120;
            // scene.add( dirLight );

            // 场景光源
            var ambiColor = "#ffffff";
            var ambientLight = new THREE.AmbientLight(ambiColor);
            scene.add(ambientLight);


                const light = new THREE.PointLight(0xffff00, 2, 500);
                light.position.set(0, 0, 0);
                scene.add(light);

            // 聚光灯光源
            var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(0, 700, 0);
            spotLight.castShadow = false;
            spotLight.lookAt(new THREE.Vector3(0,0,0))
            scene.add(spotLight);
        },
        animate(){
            this.update()
            renderer.render(scene,camera);
            requestAnimationFrame(this.animate);

        },
        update(){
            controls.update();
        },
        addFbx(){
            // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
			// 	mesh.rotation.x = - Math.PI / 2;
			// 	mesh.receiveShadow = true;
			// 	scene.add( mesh );

            const loader = new FBXLoader();
            const mixers = [];
            // const path  = location.origin+'/models/fbx/cloth.fbx'
            const path  = location.origin+'/models/fbx/Shark.fbx'

            console.log(location)
            const _this = this;
            loader.load( path, function ( object ) {
                    
                    // object.mixer = new THREE.AnimationMixer( object );
                    // mixers.push( object.mixer );

                    // var action = object.mixer.clipAction( object.animations[ 0 ] );
                    // action.play();
                    console.log(object)
                    _this.setScaleToFitSize(object)
                    object.position.set(200,0,0)
                    // object.scale = new THREE.Vector3(4,4,4)
                    object.traverse( function ( child ) {

                        if ( child.isMesh ) {

                            child.castShadow = true;
                            child.receiveShadow = true;

                        }

                    } );

                    scene.add( object );
            })
        },
        getFitScaleValue: function(obj){
            var boxHelper = new THREE.BoxHelper(obj);
            boxHelper.geometry.computeBoundingBox();
            var box = boxHelper.geometry.boundingBox;
            var maxDiameter = Math.max((box.max.x - box.min.x), (box.max.y - box.min.y), (box.max.z - box.min.z));
            return camera.position.z / maxDiameter;
        },
        //设置模型到适合观察的大小
        setScaleToFitSize: function(obj) {
            var scaleValue = this.getFitScaleValue(obj);
            obj.scale.set(scaleValue, scaleValue, scaleValue);
            return scaleValue;
        },
    },
    mounted(){
        this.init();
    }
}
</script>

<style lang="scss" scoped>
.container{
    width: 100%;
    height: 100%;
    position: relative;
    .three-wrapper{
        width: 100%;
        height: 100%;
    }
}
</style>