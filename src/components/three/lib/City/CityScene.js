import ThreeClass from "./ThreeClass";

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass.js";
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { SMAAShader } from "three/examples/jsm/shaders/SMAAShader.js";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import { Scene } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Water } from "three/examples/jsm/objects/Water2";



import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";
import { Vector3 } from "three";

class SceneClass extends ThreeClass {
    constructor(domId){
      super(domId)

      this.lensflareSun = null
      this.isFirstShowYg = true
      this.isFirstShowRoad = true // 
      this.isHuiGuang = false
      this.isBuildingLight = false

      this.gxColors = ['#f4f229', '#ee6c15', '#cb2d1d', '#8b31c5', '#c0da6a', '#172ea6','#FFFFFF']
      this.lfgxMat = null
      this.countNum2 = 0
      this.colorIndex = 0
      
      this.plArr = ['objpolySurface549', 'group19polySurface9748', 'group3group4polySurface1012', 'group10group2polySurface1008', 'group5group3polySurface1002', 'group19polySurface11401', 'polySurface2194', 'objobjobjobjobjobjobjobjpolySurface29']
      this.plArrBs = ['objpolySurface549', 'group19polySurface9748', 'polySurface2194', 'group19polySurface11401', 'group10group2polySurface1008', 'group3group4polySurface1012', 'group5group3polySurface1002', 'polySurface2186']
      this.plBan = ['objpolySurface549', 'group19polySurface9748', 'polySurface2194', 'group19polySurface11401', 'group10group2polySurface1008', 'group3group4polySurface1012', 'group5group3polySurface1002', 'polySurface2186', 'objobjobjobjlcs01pCube91', 'polySurface2250', 'objobjobjobjgroup3group4pCube128', 'objobjobjpolySurface2008', 'objobjobjgroup19pCube553', 'objobjobjobjgroup10group2pCube135', 'objobjobjobjobjobjobjobjobjobjobjobjpolySurface6', 'objobjobjobjlcs01pCube45', 'objobjobjpCube36']
      this.dimianObj = ['pCube1075','pCube1009', 'objobjobjpolySurface2018', 'polySurface1989', 'lineGL95', 'objobjobjobjobjobjobjobjpolySurface29', 'polySurface2130', 'polySurface2189', 'pCube644', 'pCube1058', 'Rectangle2002033043', '建筑_木材011', 'polySurface2067', 'polySurface2068', 'polySurface2164', 'objobjpCube6', 'polySurface2014', 'objobjobjobjpCube138', 'polySurface2013']//,'polySurface1983'
      this.plArrOld=["group19polySurface9748", "group19polySurface11401", "polySurface2194", "objpolySurface549", "group10group2polySurface1008", "group3group4polySurface1012", "group5group3polySurface1002", "polySurface1644", "objobjobjobjobjobjobjobjpolySurface29", "objobjobjobjobjobjobjobjpolySurface29", "polySurface2186"]
      this.plArrNew=[ '网格263_1','group10group2polySurface1008', 'group3group4polySurface1012', 'group5group3polySurface1002','group19polySurface11401','group19polySurface9748','objobjobjobjpolySurface2194','c09', 'objobjobjpolySurface1644']
      this.glArr=['polySurface1989','polySurface2263'],
      this.hideArr = ['objobjobjobjobjobjpolySurface3'] //"objobjobjobjobjobjpolySurface3"

      this.pointsArr = []
      this.roadnameArr = []
      this.roadmatArr = []

      this.mouse = {
        x:0,
        y:0
      },

      this.isWaterGUI = false
      this.isComposerGUI = false
      this.isRoofGUI = true
      this.isBloomGUI = false
      // this.isBloomGUI = true


    }
    initModel(){
      const manager = new THREE.LoadingManager();
      var loader=new GLTFLoader(manager);
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader( dracoLoader );
    
      const that = this
      // xindachanye  xianfu12
      loader.load("/models/xianfu12.glb",function(obj){
        console.log(obj)
        that.scene.add(obj.scene)
           obj.scene.scale.set(5700.0,5700.0,5700.0)
        that.objScene=obj.scene
        that.objScene.position.x+=105.
        that.objScene.position.z+=20 //10080

        that.renderer.shadowMap.enabled = true;
        that.renderer.shadowMap.needsUpdate = true;
        that.initMouseEvent()
        
        that.initModelScene()
      })
    }
    // 模型初次加载进行场景渲染
    initModelScene(){
      this.initEnv()
      this.initDayScene()
      // this.initNightScene()
      // setTimeout(()=>{
      //   this.cameraFlyTo(new Vector3(1878.623268239386,1202.527112675173,4607.702280115447),this.controls.target,function(){
      //     console.log("相机视角移动完毕")
      //   })
      // },3000)
   
    }

    initRoof2(){
      var geometry = new THREE.PlaneGeometry( 202.9,240 );   // 212.9,240
      const shader1 =  {
          vertexShader:`
              varying vec2 vUv;
              varying float v_py;
              varying float v_pz;
              
              
              void main() {
                  vUv = uv;
                  v_py = position.y;
                  v_pz=position.z;
                  
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                } `,
          fragmentShader: ` // 根据片元的高度来渐变
              varying vec2 vUv;
              varying float v_py;
              varying float v_pz;
            
            
              void main(){
                  vec4 color1=vec4(0.,0.,0.,0.);
                  float bl=pow((1.0-vUv.y),1.8);  //2.0
                  // float bl=(1.0-vUv.y);
                  
                  if(vUv.x>0.0 && vUv.x<0.025){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                      
                  }
                  if(vUv.x>0.05 && vUv.x<0.075){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.1 && vUv.x<0.125){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.15 && vUv.x<0.175){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.2 && vUv.x<0.225){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.25 && vUv.x<0.275){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.3 && vUv.x<0.325){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.35 && vUv.x<0.375){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.4 && vUv.x<0.425){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.45 && vUv.x<0.475){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.5 && vUv.x<0.525){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.55 && vUv.x<0.575){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.6 && vUv.x<0.625){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.65 && vUv.x<0.675){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.7 && vUv.x<0.725){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.75 && vUv.x<0.775){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.8 && vUv.x<0.825){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.85 && vUv.x<0.875){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.9 && vUv.x<0.925){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
                  if(vUv.x>0.95 && vUv.x<0.975){
                      color1=vec4(1.0,1.0,1.0,0.1*bl);
                  }
            
                  
                  // gl_FragColor=color1.rgba;
                  // gl_FragColor=mix(color1.rgba,vec4(1.0,1.0,1.0,bl),0.5);
                  gl_FragColor=vec4(1.0,1.0,1.0,bl);
              } `
      }

      var ShaderBar1 = {
          uniforms: {

          },
          vertexShader: shader1.vertexShader,
          fragmentShader: shader1.fragmentShader
      }

      let option6 = {
          material: new THREE.ShaderMaterial({
              uniforms: ShaderBar1.uniforms,
              vertexShader: ShaderBar1.vertexShader,
              fragmentShader: ShaderBar1.fragmentShader,
              // blending: THREE.MultiplyBlending,
              blending:THREE.NormalBlending,
              // blending:THREE.AdditiveBlending,
              transparent: true,
              depthTest: true,
              side: THREE.DoubleSide,
              opacity:0.2
          })
      };

      var material=option6.material
      var plane = new THREE.Mesh( geometry, material );
      this.scene.add( plane );
      plane.layers.enable(0)
      plane.renderOrder=31
      plane.position.x-=580-1.1
      plane.position.y+=655
      plane.position.z-=250-0.5+5      // 250-0.5
      plane.name='wdobj'
      plane.visible=false
      // plane.layers.enable(1)

      var plane2=plane.clone()
      this.scene.add(plane2)
      plane2.position.copy(plane.position.clone())
      plane2.position.z-=212.5-10          // 212.5
      plane2.name='wdobj'
      plane2.visible=false

      var plane3=plane2.clone()
      this.scene.add(plane3)
      plane3.position.copy(plane2.position.clone())
      plane3.rotateY(Math.PI/2)
      plane3.position.z+=106+0.1-5            // 106+0.1
      plane3.position.x+=107-0.5-5          // 107-0.5
      plane3.name='wdobj'
      plane3.visible=false

      var plane4=plane3.clone()
      this.scene.add(plane4)
      plane4.position.copy(plane3.position.clone())
      plane4.position.x-=212.7-10    // 212.7
      plane4.name='wdobj'
      plane4.visible=false

      if(this.gui&&this.isRoofGUI) {
        let that = this
        let controls = {
          plane:false,
          plane2:false,
          plane3:false,
          plane4:false
        }
        let folder = this.gui.addFolder('RoofGUI')
        folder.add(controls,'plane').onChange(function(value){
          if(value){
            plane.visible = true
          }else{
            plane.visible = false
          }
        })
      
        folder.add(controls,'plane2').onChange(function(value){
          if(value){
            plane2.visible = true
          }else{
            plane2.visible = false
          }
        })
        folder.add(controls,'plane3').onChange(function(value){
          if(value){
            plane3.visible = true
          }else{
            plane3.visible = false
          }
        })
        folder.add(controls,'plane4').onChange(function(value){
          if(value){
            plane4.visible = true
          }else{
            plane4.visible = false
          }
        })
      }

      



    }

    traverseModel(){
      let that = this
      this.objScene.traverse(function(obj){
        // if()
        if(that.plArrNew.indexOf(obj.name)!=-1 || that.dimianObj.indexOf(obj.name)!=-1 || obj.name=='polySurface2568'){  //
          if(obj.userData.oldmat){
              obj.material=obj.userData.oldmat
          }
        }
        if(that.hideArr.indexOf(obj.name)>=0){
          // console.log(obj)
          obj.visible = false
        }
        obj.castShadow = true;
        obj.receiveShadow=true
      })
    }

    // 设置白天场景
    initDayScene(){
      let that = this
      this.initDaySky()
      this.initDayLight()
     
      that.publicMaterial.glassMat.metalness=1
      that.publicMaterial.glassMat.roughness=0.5
      that.publicMaterial.glassMat.envMapIntensity=1
      that.publicMaterial.glassMat.color=new THREE.Color('#fff')  //232b33
      
    }

    initNightScene(){
      let that = this
      this.renderer.toneMappingExposure = 0.1
      this.initNightSky()
      this.initRoads()
      this.initNightLight()
      this.addLightTransForm4()

      // this.isHuiGuang = true
      this.isBuildingLight = true

      if(this.lensflareSun){
        this.lensflareSun.visible=false
      }

      that.publicMaterial.glassMat.metalness=0
      that.publicMaterial.glassMat.roughness=1
      that.publicMaterial.glassMat.envMapIntensity=0
      that.publicMaterial.glassMat.color=new THREE.Color('#232b33')  //232b33
    }

    initNightSky(){
      let rgbeLoader = new RGBELoader();
      const that = this
      // 
      rgbeLoader.load("/textures/hdr/night.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        that.scene.background = texture;
        that.scene.environment = texture;
      });
    }
    initDaySky(){
      let rgbeLoader = new RGBELoader();
      const that = this
      // 
      rgbeLoader.load("/textures/hdr/sky_day.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        that.scene.background = texture;
        that.scene.environment = texture;
      });
    }

    // 模拟白天光线
    initDayLight(){
      let that = this
      this.AmbientLight1.intensity=1
      this.pointLight2.intensity=0.1
      this.pointLight2.intensity=0.1
      this.pointLight2.intensity=0.1
      this.directionalLight1.intensity=2.5
      // this.meshplan.material.color=new THREE.Color('#274c92')  //   aacbea

      // // 模拟太阳
      if(that.isFirstShowYg==true){
        that.lensflareSun = new Lensflare();
        that.lensflareSun.addElement(new LensflareElement(that.textureLoader2.load("/images/lensflare0.png"), 700, 0, new THREE.Color("#ffffff")));
        that.lensflareSun.addElement(new LensflareElement(that.textureLoader2.load("/images/lensflare3.png"), 60, 0.6));
        that.lensflareSun.addElement(new LensflareElement(that.textureLoader2.load("/images/lensflare3.png"), 70, 0.7));
        that.lensflareSun.addElement(new LensflareElement(that.textureLoader2.load("/images/lensflare3.png"), 120, 0.9));
        that.lensflareSun.addElement(new LensflareElement(that.textureLoader2.load("/images/lensflare3.png"), 70, 1));
        that.lensflareSun.position.set(1578.141853090013+3000, 1023.732229319972422, 2494.5078842210496+3000)
        that.lensflareSun.name='lensf1'
        that.isFirstShowYg=false
      }
      this.scene.add(that.lensflareSun);

    }
    
    initNightLight(){
      this.pointLight2.intensity=0.0
      this.pointLight3.intensity=0.0
      this.pointLight4.intensity=0.0
      this.directionalLight1.intensity=0.0
      this.AmbientLight1.intensity=0.4
    }
    
    initEnv(){
      this.createWaterPlane()
      this.traverseModel()
      this.initRoof2()
      
      // this.initHuiGuang()
      let that = this
      that.objScene.traverse(function (mesh) {
        if(mesh.isMesh){
            if (that.plArrNew.includes(mesh.name)) {
                mesh.geometry.computeVertexNormals();
                mesh.material = that.publicMaterial.glassMat;
                mesh.castShadow = true;
            } else {
                mesh.receiveShadow = true;
                mesh.geometry.computeVertexNormals();
                (mesh.material).roughness = 0.5;
                (mesh.material).metalness = 0;
                mesh.material.emissive=new THREE.Color("#000000")     //.set("#000000")
            }
            // 提亮公路
            if (that.glArr.includes(mesh.name)) {
                (mesh.material).emissive=new THREE.Color("#666")      //.set("#666")
            }
        }
      })

      this.initBloom()
    }

    initHuiGuang(){
      const that = this

      let bloomControl = {
        exposure: 1,
        bloomStrength: 1.5,
        bloomThreshold: 0.2,
        bloomRadius: 0.4,
      }

      const pixelRatio = this.renderer.getPixelRatio();
      let renderTarget = new THREE.WebGL3DRenderTarget(
        window.innerWidth * pixelRatio,
        window.innerHeight * pixelRatio,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          stencilBuffer: false,
          type: THREE.FloatType,
        }
      )

      
      this.renderScene = new RenderPass(this.scene,this.camera);
      renderTarget.texture.name = "EffectComposer.rt1"

      this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
      this.bloomPass.threshold = 0.2;
      this.bloomPass.strength = 1.5;//1.5
      this.bloomPass.radius = 0.4  //0.4;


      // this.composer = new EffectComposer(this.renderer,renderTarget);
      this.composer = new EffectComposer(this.renderer);
      // this.composer.setPixelRatio(window.devicePixelRatio);
      // this.composer.setSize(window.innerWidth, window.innerHeight);
      // this.composer.renderToScreen = true;
      this.composer.addPass(this.renderScene)
      this.composer.addPass(this.bloomPass)

      if(this.gui&&this.isComposerGUI) {
        
        let bloomFolder = this.gui.addFolder('BloomPass')
        bloomFolder.add( bloomControl, 'exposure', 0.0, 2,0.1 ).onChange( function ( value ) {
					that.renderer.toneMappingExposure = Math.pow( value, 4.0 );
				} );
        bloomFolder.add(bloomControl,'bloomThreshold',0.0,1.0).onChange(function(value){
          that.bloomPass.threshold = Number(value)
        })
        bloomFolder.add(bloomControl,'bloomStrength',0.0,3.0).onChange(function(value){
          that.bloomPass.strength = Number(value)
        })
        bloomFolder.add(bloomControl,'bloomRadius',0.0,1.0).step( 0.01 ).onChange(function(value){
          that.bloomPass.radius = Number(value)
        })
      }
      return

      let effectFXAA = new ShaderPass(FXAAShader);
      effectFXAA.uniforms["resolution"].value.set(
          1 / window.innerWidth,
          1 / window.innerHeight
      );
      effectFXAA.renderToScreen = true;
      // 去掉条带
      let ssaaRenderPass = new SSAARenderPass(this.scene,this.camera);
      ssaaRenderPass.sampleLevel = 1;
      ssaaRenderPass.unbiased = true;
      this.composer.addPass( effectFXAA );

      this.finalPass = new ShaderPass(
          new THREE.ShaderMaterial( {
              uniforms: {
                  baseTexture: { value: null },
                  bloomTexture: { value: this.composer.renderTarget2.texture }
              },
              vertexShader: `varying vec2 vUv;
              void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              }`,
              fragmentShader: `uniform sampler2D baseTexture;
              uniform sampler2D bloomTexture;
              varying vec2 vUv;
              void main() {
                  gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
              }`,
              defines: {}
          } ), 'baseTexture'
      );
      this.finalPass.needsSwap = true;
      this.finalPass.renderToScreen=true
      this.finalComposer = new EffectComposer( this.renderer );
      this.finalComposer.addPass( this.renderScene );
      this.finalComposer.addPass( this.finalPass );
      // this.finalComposer.addPass( ssaaRenderPass );
      this.finalComposer.addPass( effectFXAA );

    }

    initBloom(){
      const that = this
      const params =  {
        exposure: 1,
				bloomStrength: 5,
				bloomThreshold: 0,
				bloomRadius: 0,
				scene: 'Scene with Glow'
      }
      let scene = this.scene
      let camera = this.camera
      let renderer = this.renderer

      const renderScene = new RenderPass( scene, camera );

      const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
			bloomPass.threshold = params.bloomThreshold;
			bloomPass.strength = params.bloomStrength;
			bloomPass.radius = params.bloomRadius;

      const bloomComposer = new EffectComposer( renderer );
			bloomComposer.renderToScreen = false;
			bloomComposer.addPass( renderScene );
			bloomComposer.addPass( bloomPass );

      this.composer = bloomComposer

      const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms:{
            baseTexture:{value:null},
            bloomTexture:{value:bloomComposer.renderTarget2.texture}
          },
          vertexShader:`varying vec2 vUv;

            void main() {
      
              vUv = uv;
      
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      
            }`,
          fragmentShader:`
            uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;
      
            varying vec2 vUv;
      
            void main() {
      
              gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
      
            }
          `,
          defines: {}
        }),'baseTexture'
      )
      finalPass.needsSwap = true


      const finalComposer = new EffectComposer(renderer)
      finalComposer.addPass(renderScene)
      finalComposer.addPass(finalPass)

      this.finalComposer = finalComposer

      if(this.isBloomGUI){
        const folder = this.gui.addFolder('Bloom')
        folder.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

          renderer.toneMappingExposure = Math.pow( value, 4.0 );
  
        } );
  
        folder.add( params, 'bloomThreshold', 0.0, 1.0,0.1 ).onChange( function ( value ) {
  
          bloomPass.threshold = Number( value );
  
        } );
  
        folder.add( params, 'bloomStrength', 0.0, 10.0 ).onChange( function ( value ) {
  
          bloomPass.strength = Number( value );
  
        } );
  
        folder.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
  
          bloomPass.radius = Number( value );
  
        } );
       
        const raycaster = new THREE.Raycaster();

        const mouse = new THREE.Vector2();

        window.addEventListener( 'pointerdown', onPointerDown );

        function onPointerDown( event ) {

          mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
          mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
          raycaster.setFromCamera( mouse, camera );
          const intersects = raycaster.intersectObjects( scene.children, false );
          if ( intersects.length > 0 ) {
  
            const object = intersects[ 0 ].object;
            console.log(object)
            object.layers.toggle( that.BLOOM_SCENE );
            render();
  
          }
  
        }
      }

    }

    initMouseEvent(){
      this.container.addEventListener('mouseup', this.onMouseUp.bind(this), false);
      this.container.addEventListener('mousedown', this.onMousedown.bind(this), false);
    }
    onMouseUp(event) {
    //  this.getCamera()
    //   var that=this
    //   if(event.button == 0) {
    //     that.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     that.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //     let raycaster = new THREE.Raycaster();

    //     raycaster.setFromCamera(that.mouse,this.camera);
    //     let intersects = raycaster.intersectObjects(this.scene.children, true);
    //     var geosp = new THREE.SphereGeometry(0.5, 5, 5);
    //     var matsp=new THREE.MeshBasicMaterial({
    //         color:'lightgreen'
    //     })
    //     var meshsp=new THREE.Mesh(geosp,matsp)
    //       meshsp.position.copy(new THREE.Vector3(intersects[0].point.x,intersects[0].point.y,intersects[0].point.z))
    //       this.scene.add(meshsp)
    //       // console.log(intersects[0].point.x,intersects[0].point.y,intersects[0].point.z,intersects[0])
        
    //   }

    }
    onMousedown(event){
      event.preventDefault()
      this.getCamera()
      let mouse = new THREE.Vector3()
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      let raycaster = new THREE.Raycaster();
      let intersects = raycaster.intersectObjects(
        this.scene.children,
        true
      );
      if(intersects[0]){
        console.log("当前鼠标位置",JSON.stringify(intersects[0].point))
      }

    }
    createWaterPlane(){
      let pos = [
        [-9,0],
        [4024,76],
        [4099,463],
        [2680,390],
        [5,336],
      ]
      
      // let waterGeometry = new THREE.PlaneGeometry(4217, 416);
      let waterShape = new THREE.Shape()
      waterShape.moveTo(...pos[0])
      waterShape.lineTo(...pos[1])
      waterShape.lineTo(...pos[2])
      waterShape.lineTo(...pos[3])
      waterShape.lineTo(...pos[4])
      waterShape.lineTo(...pos[0])
      console.log(waterShape)
      let waterGeometry = new THREE.ShapeGeometry(waterShape);

      let water = new Water(waterGeometry, {
        textureWidth: 1024,
        textureHeight: 1024,
        color: "#FFFFFF", // #00BFFF
        flowDirection: new THREE.Vector2(1, 1),
        scale: 0.02,
        flowSpeed:0.03
      });
      water.rotation.x = -Math.PI / 2;
      // water.position.x = 16;
      // water.position.z = 1000;
      water.position.x = -2132;
      water.position.z = 1224;

      this.scene.add(water);

     

      let water2 = new Water(new THREE.PlaneGeometry(1037,1368),{
        textureWidth:1024,
        textureHeight:1024,
        color:"#FFFFFF",
        flowDirection:new THREE.Vector2(1, 1),
        scale:10,
        flowSpeed:0.03,
      })
      water2.rotation.x = -Math.PI / 2;
      water2.position.y = 0
      water2.position.x = 0
      water2.position.z = -205
      this.scene.add(water2) 


      
      if (this.gui&&this.isWaterGUI) {
        let waterControl = {
          width:4217,
          height:416,
          posX: -2132,
          posY: 0,
          posZ: 1224,

          rotateY:0,
  
          scale:10,
          flowX:1,
          flowY:1,
          distortionScale:4,
          flowSpeed:0.03,
          color:"#FFFFFF"
        }
        let that = this
        let initWater = function(){
          that.scene.remove(water)
          
    
          water = new Water(waterGeometry, {
            textureWidth: 1024,
            textureHeight: 1024,
            color: "#FFFFFF", // #00BFFF
            flowDirection: new THREE.Vector2(1, 1),
            scale: waterControl.scale,
            flowSpeed:waterControl.flowSpeed
          });
          water.rotation.x = -Math.PI / 2;
          water.position.y = waterControl.posY
          water.position.x = waterControl.posX
          water.position.z = waterControl.posZ
          that.scene.add(water)
        }
        let waterFolder = this.gui.addFolder('WaterPlane')
        // waterFolder.add(waterControl,'width',0,10000).onChange(function(){
        //   initWater()
        // })
        // waterFolder.add(waterControl,'height',0,10000).onChange(function(){
        //   initWater()
        // })
        waterFolder.add(waterControl,'posX',-10000,10000).onChange(function(){
          water.position.x = waterControl.posX

        })
        waterFolder.add(waterControl,'posY',-10000,10000).onChange(function(){
          water.position.y = waterControl.posY

        })
        waterFolder.add(waterControl,'posZ',-10000,10000).onChange(function(){
          water.position.z = waterControl.posZ
        })
        waterFolder.add(waterControl,'rotateY',0,Math.PI*2).onChange(function(){
          water.rotation.z = waterControl.rotateY
        })
        waterFolder.add(waterControl,'flowSpeed',0,1,0.01).onChange(function(value){
          // initWater()
           water.material.uniforms['config'].value.x = value * new THREE.Clock().getDelta()

        }) 
        waterFolder.add(waterControl,'scale',0,10,0.01).onChange(function(value){
          // initWater()
          water.material.uniforms['config'].value.w = value

        })
      }
    }

    initRoads() {
      if(this.isFirstShowRoad) {
        let arr1 = [
          // new THREE.Vector3(1692.9315030134928 ,94.84923268054403+0, -982.598801069353),
          // new THREE.Vector3( 1459.4976421250644, 94.84851199998292+0, 1396.3066678611317),
          // new THREE.Vector3(1457.9583873130534 ,94.84842182120939+0 ,1693.9791614319836),
          // new THREE.Vector3(1409.1997399777945 ,21.919161057950774+0, 2627.3513188542615)
          new THREE.Vector3(1409.1997399777945 ,21.919161057950774+0, 2627.3513188542615),
          new THREE.Vector3(1457.9583873130534 ,94.84842182120939+0 ,1693.9791614319836),
          new THREE.Vector3( 1459.4976421250644, 94.84851199998292+0, 1396.3066678611317),
          new THREE.Vector3(1692.9315030134928 ,94.84923268054403+0, -982.598801069353)
        ]
        let arr2 = [
          new THREE.Vector3( 1619.2438570838733+5 ,94.84923804327812-5, -1000.3007319108827),
          new THREE.Vector3(1394.0377668479402+5, 94.84852887180944-5, 1340.6141994406005),
          new THREE.Vector3( 1378.9213372403767+5 ,93.99884267008943-5, 1771.6518482463075),
          new THREE.Vector3(1337.6497584241963+5, 21.550860193154264-5, 2617.399139326566-110),
          new THREE.Vector3(1409.1997399777945 ,21.919161057950774-5, 2627.3513188542615-110),
          new THREE.Vector3(1457.9583873130534 ,94.84842182120939-5,1693.9791614319836),
          new THREE.Vector3( 1459.4976421250644, 94.84851199998292-5, 1396.3066678611317),
          new THREE.Vector3(1692.9315030134928 ,94.84923268054403-5, -982.598801069353)
        ]
        this.createRoad(arr2)

      }
    }
    createRoad(arr) {
      var BezierArr = []; //所有拐角贝塞尔曲线集合
      let L = 1
      for(let i = 1;i<arr.length-1;i++){ //注意两端的点不用圆角化
        // 三个点坐标
        var p1 = arr[i - 1];
        var p2 = arr[i]; // 直线交点
        var p3 = arr[i + 1];
        var dir1 = p1.clone().sub(p2).normalize();
        var dir2 = p3.clone().sub(p2).normalize();
        var BezierP1 = p2.clone().add(dir1.clone().multiplyScalar(L));
        var BezierP3 = p2.clone().add(dir2.clone().multiplyScalar(L));
        var BezierCurve = new THREE.QuadraticBezierCurve3(BezierP1, p2, BezierP3);
        BezierArr.push(BezierCurve);
        BezierCurve.startPoint = BezierP1;
        BezierCurve.endPoint = BezierP3;
      }
      var curve = new THREE.CurvePath();
      curve.curves.push(new THREE.LineCurve3(arr[0], BezierArr[0].startPoint));
      for (var i = 0; i < BezierArr.length; i++) {
          curve.curves.push(BezierArr[i]);
          if (i < BezierArr.length - 1) {
              curve.curves.push(new THREE.LineCurve3(BezierArr[i].endPoint, BezierArr[i + 1].startPoint));
          } else {
              curve.curves.push(new THREE.LineCurve3(BezierArr[i].endPoint, arr[arr.length - 1]));
          }
      }
      this.pointsArr = curve.getSpacedPoints(300); //曲线上获取顶点坐标

      var list = []
      this.pointsArr.forEach(p => list.push([p.x,p.y,p.z]))
      var l=[]
      list.forEach(e=>l.push(new THREE.Vector3(e[0],e[1],e[2])))
      var curve2=new THREE.CatmullRomCurve3(l)
      var tubegeo=new THREE.TubeGeometry(curve2,150,20,150)
      var textureLoader1 = new THREE.TextureLoader().load("/images/y5.png")
      textureLoader1.wrapS= THREE.RepeatWrapping;
      var roadmat = new THREE.MeshBasicMaterial({map:textureLoader1,side:THREE.DoubleSide,transparent:true,color:'#fff'})  //#fff
      var line2=new THREE.Mesh(tubegeo,roadmat)
      // debugger
      line2.renderOrder = 38
      this.scene.add(line2)
      //line2.scale.set(1,0.1,1)  //1,0.1,1    scaleX,scaleY,scaleZ
      line2.position.y+=35
      // line2.name='lu'+Math.random()+Math.random()+Math.random()
      line2.name='lumian'
      this.roadnameArr.push(line2.name)
      this.roadmatArr.push(roadmat)
      line2.layers.enable(1)


      this.isFirstShowRode=false
    }

    addLightTransForm4(){
      var that=this
      this.lfgxMat = new THREE.MeshBasicMaterial({
        color:"#f4f229",
        side:THREE.DoubleSide
      })

      this.scene.traverse(function(obj){
        if(obj.name){
          if(obj.name=='polySurface2250' || obj.name=='polySurface2568'){//polySurface2250
              obj.material=that.lfgxMat
              obj.layers.enable(1)
            }
        }
      })

    }

    render(){
      // if(this.curvePoints.length>0){

      // }
      const that = this

      for(var i=0;i<this.roadmatArr.length;i++){
        this.roadmatArr[i].map.offset.x -= 0.002//0.002
      }

      if(that.lfgxMat && that.isBuildingLight){
        // alert('tttttttttt');
          if(that.countNum2>60){
              that.countNum2=0
              if(that.colorIndex==6){
                  that.colorIndex=0
              }else{
                  that.colorIndex+=1
              }
              that.lfgxMat.color=new THREE.Color(that.gxColors[that.colorIndex])   //=new THREE.MeshBasicMaterial({color:that.gxColors[that.colorIndex]})//.color=that.gxColors[that.colorIndex]
          }else{
              that.countNum2+=1
          }
      }
    }

    hideObj(str){
      let that = this
      switch(str){
        case 'Yj':
          this.scene.traverse(function(obj){
            if(obj.name){

            }
          })
      }
    }
}
export default SceneClass