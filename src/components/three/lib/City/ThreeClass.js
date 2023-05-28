import * as THREE from 'three';
import { Vector3 } from 'three';
// import { WEBGL } from "three/examples/jsm/WebGL.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from 'three/examples/jsm/libs/stats.module.js';

import TWEEN from 'tween';
// import CommonClass from './CommonClass.js';
import * as dat from 'dat.gui'


class ThreeClass {
  constructor(domId){
    this.domId = domId
    this.isCameraView = false
    this.isControlRotate = false
    this.isSceneRotate = false
    this.isCss2dRenderer = false //CSS2D
    this.isCss3dRenderer = false //CSS3D


    this.isGui = true
    // this.gui = this.isGui?new dat.GUI():null
    this.gui = new dat.GUI()

    //获取界面大小
    this.W = window.innerWidth;
    this.H = window.innerHeight;

    // basic
    this.container = null
    this.scene = null
    this.camera = null
    this.lightScene = null
    this.cameraView = null
    this.controls = null
    this.renderScene = null;


    //动画计时
    this.delta = 0;
    this.clock = new THREE.Clock();



    // 灯光
    this.AmbientLight1 = null
    this.directionalLight1 = null

    this.isCutPic = false//Canvas截图

    // bloom
    this.materials = {}
    this.darkMaterial = new THREE.MeshBasicMaterial({color: 'black', transparent: true, opacity: 1});
    this.bloomPass = null // 泛光效果
    this.composer = null //效果合成器 EffectComposer
    this.finalPass = null // ShaderPass
    this.BLOOM_SCENE = 1;
    this.ENTIRE_SCENE = 0;

    this.bloomLayer = new THREE.Layers();
    this.bloomLayer.set(this.BLOOM_SCENE);

    // 
    this.textureLoader2 = new THREE.TextureLoader()

    // 公共材质
    this.publicMaterial={
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
          var envMap = that.getTexture('/images/bluesky.jpg')
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
  }

  getTexture(pic){
    var texture=new THREE.TextureLoader().load(pic)
    return texture
  }

  load() {
    this.init()
  }

  init() {
    console.log(this.W,this.H)
    
    this.initCanvas();
    this.initScene();
    this.initCamera();
    // this.isCameraView ? this.initCameraView() : '';
    this.initLight2();
    // this.initGround();
    this.initControls();
    this.initRenderer();
    this.initAxes()
    // this.initSky()
    // this.initDayScene();//设置白天场景
    this.initModel();

    // this.initShader();
     //窗口变化
     window.addEventListener('resize', this.onWindowResize.bind(this), false);

     this.animate()
  }


  initCanvas(){
    this.container = document.getElementById(this.domId)
  }
  initScene() {
    this.scene = new THREE.Scene();
    this.lightScene = new THREE.Scene();
  }

  //初始化摄像机
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(30, this.W / this.H,10, 100000);
    // this.camera.position.set(1878.623268239386,1202.527112675173,4607.702280115447)
    // this.camera.position.set(174.38918654021273,859.987897347698,2092.1386398932323)
    this.camera.position.set(486.6500857806821,837.1912157283828,2030.0538844141317)
        // this.camera.lookAt(-0.24454294227238355,-0.33288048843732,-0.9107081474339059)
  }
  //初始化观测摄像机
  initCameraView(){
    this.cameraView = new THREE.PerspectiveCamera(30, this.W / this.H, 1, 100000);//30, this.W / this.H, 1, 100000
    this.cameraView.position.set(1000, 1000, 1000);
  }
  //加载界面控制器
  initControls() {
    this.controls = new OrbitControls(this.isCameraView ? this.cameraView : this.camera, this.container);
    this.isLimitControl ? this.controls.maxPolarAngle = Math.PI * 0.499 : '';
    //设置相机距离原点的最近距离
    this.controls.minDistance = 0.1//10;
    //设置相机距离原点的最远距离
    // this.controls.maxDistance = 9000;//4000

    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI/2.1;

    this.isControlRotate ? this.controls.autoRotate = true : '';
    this.controls.target = new Vector3(-25.779824898290673,152.34487355865735,-70.38663440490355)
  }
  //加载渲染器
  initRenderer() {
    if (!this.isCutPic) {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,//抗锯齿
          // // logarithmicDepthBuffer:true,//精度更高的z缓冲，来代替原有的Z缓冲
          // logarithmicDepthBuffer:false,//
          // preserveDrawingBuffer:false,
          // autoClear:false,
          // alpha:true,
          // precision:'highp',
          // stencil:false
        });

    } else {
        //开启图形缓冲区用于截图
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          logarithmicDepthBuffer:false,   // false 高清 true 不高清
          preserveDrawingBuffer:false,//保留图形缓冲区
          autoClear:false,
          precision:'highp',
          stencil:false,
          alpha: true
        });
    }

    this.renderer.setSize(this.W, this.H);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.autoClear=false
    this.container.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene,this.camera);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.localClippingEnabled=true

  }


  // 初始化光线
  initLight() {
    this.AmbientLight1 = new THREE.AmbientLight(0x555555,2)//2
    this.scene.add(this.AmbientLight1);

    this.directionalLight1 = new THREE.DirectionalLight(0xffffff,0.4);  // 0.9
    this.directionalLight1.position.set(0-2000,1050+0,-1940-2000);   //0,1050,-1940
    this.scene.add(this.directionalLight1);
    //// debugger;
    this.directionalLight1.castShadow = true;
    this.directionalLight1.shadow.mapSize.width=2560;  //2560
    this.directionalLight1.shadow.mapSize.height=2560; //2560

    this.directionalLight1.shadow.camera.near=-9000
    this.directionalLight1.shadow.camera.far = 6500//*0.01;
    this.directionalLight1.shadow.camera.left = -2200.0//*0.01;
    this.directionalLight1.shadow.camera.right = 2200.0//*0.01;
    this.directionalLight1.shadow.camera.top = 900//*0.01;
    this.directionalLight1.shadow.camera.bottom = -1000//*0.01;
    this.directionalLight1.shadow.bias=-0.0005

    // 辅助光源
    this.dir2=this.directionalLight1.clone()
    this.dir2.castShadow=false
    this.dir2.intensity=0.6
    this.dir2.position.x=0
    this.dir2.position.z=0
    this.dir2.position.y=1050
    this.dir2.position.z+=3600
    this.dir2.position.x+=1500
    this.scene.add(this.dir2)

    // 显示光源位置
    var geometry = new THREE.SphereGeometry( 6.8, 20, 20 );
    var material = new THREE.MeshLambertMaterial ({color:'#5ebaff'});
    var sphere = new THREE.Mesh( geometry, material );
    this.scene.add(sphere);
    sphere.position.copy(this.directionalLight1.position)

  }
  initLight2(){
    this.AmbientLight1=new THREE.AmbientLight('#fff',1)
    this.scene.add(this.AmbientLight1);

    this.pointLight2 = new THREE.PointLight("#ffffff", 0.1);
    this.pointLight2.position.set(896.2745213045123, 249.68234367236601, -548.9733088617019);
    this.scene.add(this.pointLight2);



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

  // 初始化布料背景
  initGround() {
    // //网格
    // let helper = new THREE.GridHelper(5000, 100);
    // this.scene.add(helper);

    //地板
    const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
    let plane = new THREE.Mesh(planeGeometry);
    //水平面旋转并且设置位置
    plane.rotation.x = -0.5 * Math.PI;
    //plane.material.update = true;
    plane.position.set(0, -2, 0);
    plane.name = 'plane';
    plane.material = new THREE.MeshBasicMaterial({
        color: '#dddddd',
        side: THREE.DoubleSide,
        depthTest: true,
        transparent: true,
        opacity: 0.5
    });
    this.scene.add(plane);
  }

  

  //动画
  animate() {
    var that=this
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  
    // if(this.renderScene!=null && this.bloomPass!=null && this.composer!=null && this.finalPass!=null && this.finalComposer!=null && this.isHuiGuang){
    //   this.renderBloom( true );
    //   this.finalComposer.render();
    // }

    if(!this.isHuiGuang){
      this.renderer.render(this.scene,this.camera)
    }else{
      // this.composer.render()
      this.renderBloom()
      this.finalComposer.render();
    }

    TWEEN.update()

    var deltaTime=this.clock.getDelta()
    this.controls.update()
    // this.controls ? this.controls.update(this.delta) : '';
  }

  renderBloom( ) {
    this.scene.traverse( this.darkenNonBloomed.bind(this) );
    this.composer.render();
    this.scene.traverse( this.restoreMaterial.bind(this) );
  }

  darkenNonBloomed(obj) {
    if ( obj.isMesh && this.bloomLayer.test( obj.layers ) === false || obj.isSprite && this.bloomLayer.test( obj.layers ) === false || (obj.type=='SpotLight' && this.bloomLayer.test( obj.layers ) === false) || (obj.type=='Lensflare' && this.bloomLayer.test( obj.layers ) === false)) {

      this.materials[ obj.uuid ] = obj.material;
      obj.material = this.darkMaterial;
    } 
  }

  restoreMaterial(obj) {
    if ( this.materials[ obj.uuid ] ) {

      obj.material = this.materials[ obj.uuid ];
      delete this.materials[ obj.uuid ];
    }
  }

  

  // render() {

  // }

  //三维坐标轴的显示
  initAxes() {
    this.axes = new THREE.AxesHelper(5000);
    this.scene.add(this.axes);
   
  }

  onWindowResize() {
    //窗口变化时
    this.W = window.innerWidth;
    this.H = window.innerHeight;

    this.camera.aspect = this.W / this.H;
    this.camera.updateProjectionMatrix();

    if (this.isCameraView) {
        this.cameraView.aspect = this.W / this.H;
        this.cameraView.updateProjectionMatrix();
    }

    this.renderer.setSize(this.W, this.H);
    this.isCss2dRenderer ? this.css2dRenderer.setSize(this.W, this.H) : '';
    this.isCss3dRenderer ? this.css3dRenderer.setSize(this.W, this.H) : '';

    this.composer ? this.composer.setSize(window.innerWidth, window.innerHeight) : '';
  }

  addOrder() {
    //渲染层级
    this.renderOrder += 10;
    return this.renderOrder;
  }

  getCamera() {
    console.log(JSON.stringify(this.camera.position));
    console.log(JSON.stringify(this.controls.target))
  }

  // 相机平滑移动
  cameraFlyTo(pos,target,callback) {
    let tween = new TWEEN.Tween(this.camera.position).to(pos,3000)
    let tween2 = new TWEEN.Tween(this.controls.target).to(target,3000)
    tween.onComplete(function(){
      callback||callback()
    })
    tween.start()
    tween2.start()
  }


  

}

export default ThreeClass;
