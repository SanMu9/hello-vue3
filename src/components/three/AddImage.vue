<template>
  <div class="container">
      <div ref="three" class="three-wrapper"></div>
  </div>
</template>

<script>
import * as THREE from '../../../public/three/three.module';
import '../../../public/three/controls/OrbitControls';
// import {FBXLoader} from '.../../../public/three/loaders/FBXLoader';

let camera = null;
let scene = null;
let renderer = null;
// let axes = null;
let controls = null;
let plane = null;
let planeGeometry = null;

let cameras = [];
let enableDrag = false;
let draggableObj = null;
export default {
    data(){
        return {

        }
    },
    methods:{
        init(){
            const wrap = this.$refs.three;
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);

            camera = new THREE.PerspectiveCamera(45,wrap.offsetWidth/wrap.offsetHeight,0.1,1000)
            renderer = new THREE.WebGLRenderer();
            // renderer.setClearColor(new THREE.Color(0xEEEEEE));
            renderer.setSize(wrap.offsetWidth, wrap.offsetHeight);

            camera.position.x = 200;
            camera.position.y = 100;
            camera.position.z = 200;
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            this.initContent();
            // planeGeometry = new THREE.PlaneGeometry(60, 20, 20, 20);
            // var planeMaterial = new THREE.MeshPhongMaterial({color: 0xEEEEEE});
            // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            // plane.receiveShadow = true;

            // // rotate and position the plane
            // plane.rotation.x = -0.5 * Math.PI;
            // plane.position.x = 0;
            // plane.position.y = 0;
            // plane.position.z = 0;
            // scene.add(plane)

            const axes = new THREE.AxesHelper(50);
            scene.add(axes)

            wrap.appendChild(renderer.domElement);

            renderer.render(scene,camera)
            this.initControls();
            this.initPlane();
            this.initLight();
            this.animate();

            wrap.addEventListener('dblclick',this.dblClick);
            wrap.addEventListener('mousedown',this.mouseDown);
            wrap.addEventListener('mousemove',this.mouseMove);
            wrap.addEventListener('mouseup',this.mouseUp);


       },
        initLight() {

            const ambientLight = new THREE.AmbientLight(0xffffff);
            scene.add(ambientLight);

            // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
            // directionalLight.position.set(-50, 50, 10);

            // directionalLight.castShadow = true;

            // directionalLight.shadow.mapSize.width = 1024;
            // directionalLight.shadow.mapSize.height = 1024;

            // // 为光线设置阴影属性
            // directionalLight.shadow.camera.left = -50;
            // directionalLight.shadow.camera.right = 50;
            // directionalLight.shadow.camera.top = 50;
            // directionalLight.shadow.camera.bottom = -50;

            // directionalLight.shadow.camera.far = 3500;
            // // 偏差率
            // directionalLight.shadow.bias = -0.001;
            // scene.add(directionalLight);

            // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
            // scene.add(directionalLightHelper);

        },
        initControls(){
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            // 添加惯性
                controls.enableDamping = true;

            console.log(controls)
                // 最大偏移角度
                // controls.maxPolarAngle = 0.49 * Math.PI;
                // // 旋转速度
                // controls.rotateSpeed = 0.05;
                // // 最大可视距离
                // controls.maxDistance = 500;
                // // 最小可视距离
                // controls.minDistance = 100;
        },
        initContent() {

            const length = 200;
            var geometry = new THREE.BufferGeometry();/* 简单基础几何 */
            var lineMaterial = new THREE.LineBasicMaterial({color: 0x808080});/* 基础线材质 */
    
            var planeGeometry = new THREE.PlaneGeometry(length, 10);/* 平面 width：200,、height：10 */
            var planeMaterial = new THREE.MeshBasicMaterial({color: 0xD9D9D9, side: THREE.DoubleSide});/* 平面材质 */

            const pointArray = [
                new THREE.Vector3(-length / 2, 0, 0),
                new THREE.Vector3(length / 2, 0, 0)
            ]
            geometry.setFromPoints(pointArray)
            // geometry.vertices.push(new THREE.Vector3(-length / 2, 0, 0));/* 顶点(-100, 0, 0) */
            // geometry.vertices.push(new THREE.Vector3(length / 2, 0, 0)); /* 顶点( 100, 0, 0) */
    
            // /* 循环创建线段 */
            for (var i = 0; i <= length / 10; i++){
    
                /* 横向线段 */
                var lineX = new THREE.Line(geometry, lineMaterial);
                lineX.position.z = (i * 10) - length / 2;
                scene.add(lineX);
    
                /* 纵向线段 */
                var lineY = new THREE.Line(geometry, lineMaterial);
                lineY.rotation.y = 0.5 * Math.PI;
                lineY.position.x = (i * 10) - length / 2;
                scene.add(lineY);
    
            }
    
            /* 创建包围平面 */
            var planeX_left = new THREE.Mesh(planeGeometry, planeMaterial);
            planeX_left.rotation.y = 0.5 * Math.PI;
            planeX_left.position.x = -length / 2;
    
            var planeX_right = planeX_left.clone();
            planeX_right.position.x = length / 2;
    
            var planeY_top = new THREE.Mesh(planeGeometry, planeMaterial);
            planeY_top.position.z = -length / 2;
    
            var planeY_bottom = planeY_top.clone();
            planeY_bottom.position.z = length / 2;
    
            scene.add(planeY_bottom);
            scene.add(planeY_top);
            scene.add(planeX_left);
            scene.add(planeX_right);
    
            /* 四个包围面的位置 y轴向上5 */
            scene.traverse(function (object) {
    
                if (object.isMesh){
    
                    if (object.geometry.type === 'PlaneGeometry'){
    
                        object.position.y = 5;
    
                    }
    
                }
    
            });
    
        },

        initPlane(){
            var normal = new THREE.Vector3(0, 1, 0);
            /* 创建平面 */
           
            plane = new THREE.Plane().set(normal,0);
        },
        //获取射线与平面相交的交点
        getIntersects(event){
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
            var mouse2 = new THREE.Vector2();
            const rect = renderer.domElement.getBoundingClientRect();
    
            mouse2.x = (event.offsetX / renderer.domElement.offsetWidth) * 2 - 1;
            mouse2.y = -(event.offsetY / renderer.domElement.offsetHeight) * 2 + 1;
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            // console.log(mouse)
            // console.log(mouse2)
    
            // var normal = new THREE.Vector3(0, 1, 0);
            // /* 创建平面 */
           
            // var plane = new THREE.Plane().set(normal,0);
            // var planeHelper = new THREE.PlaneHelper(plane, 30);
            // scene.add(planeHelper);
    
            /* 从相机发出一条射线经过鼠标点击的位置 */
            raycaster.setFromCamera(mouse, camera);
    
            /* 获取射线 */
            var ray = raycaster.ray;

            var worldPoint=new THREE.Vector3();
    
            /* 计算相机到射线的对象，可能有多个对象，返回一个数组，按照距离相机远近排列 */
            ray.intersectPlane(plane,worldPoint);
    
            /* 返回向量 */
            return worldPoint;
        },
        getObjects(event){
            const mouse = new THREE.Vector2();
            mouse.x = (event.offsetX / renderer.domElement.offsetWidth) * 2 - 1;
            mouse.y = -(event.offsetY / renderer.domElement.offsetHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse,camera);
            // for(let i=0;i<cameras.length;i++){
            //     const intersection = raycaster.intersectObjects(cameras[i]);
            //     console.log(intersection)
            // }
            const intersections = raycaster.intersectObjects(cameras)
            return intersections
        },
        dblClick(event){
            const intersects = this.getIntersects(event)
            this.addCameraPoint("306左",intersects)
            // const img = new THREE.TextureLoader().load(require("../../assets/images/camera.jpg"))
            // const pointMaterial = new THREE.PointsMaterial({map:img,size:10,side:THREE.DoubleSide});
            // // const pointMaterial = new THREE.PointsMaterial({color:0xff0000, size: 10});
            // const pointGeoetry = new THREE.BufferGeometry();
            // // console.log(pointGeoetry)
            // pointGeoetry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0],3))
            // // pointGeoetry.setAttribute('position',new THREE.Float32BufferAttribute([intersects.x,intersects.y,intersects.z],3))
            // var orbit = new THREE.Points(pointGeoetry, pointMaterial);
            // orbit.position.set(intersects.x,intersects.y,intersects.z)


            // // console.log(orbit)
            // scene.add(orbit);
            // console.log(orbit)
            // cameras.push(orbit);
        },

        addCameraPoint(name,intersects){
            const canvas = document.createElement('canvas');
            
            const ctx = canvas.getContext('2d');

            const img = document.createElement('img');

            img.src = require("../../assets/images/camera.jpg");
            img.onload = function(){
                
                // ctx.drawImage(img,0,0,w,h,canvas.width/2-w/2,0);
                ctx.font = "24px normal";
                // 设置字体后获取文本的宽度
                const textWidth = ctx.measureText(name).width;
                console.log(textWidth)

                const w = img.width;
                const h = img.height;
                canvas.width = textWidth;
                canvas.height = textWidth;

                // ctx.fillStyle = "#eee";
                // ctx.fillRect(0,0,100,100)
                
                ctx.font = "24px normal";
                ctx.fillStyle = "#fff";
                ctx.textBaseline = 'top';
                ctx.textAlign = 'center';
                
                ctx.fillText(name,canvas.width/2,h+2)

                ctx.drawImage(img,0,0,w,h,canvas.width/2-w/2,0,w,h);

                let url = canvas.toDataURL('image/png');

                const image = new THREE.TextureLoader().load(url)

                // const geometry = new THREE.PlaneGeometry(canvas.width,canvas.height,1,1);
                // const material = new THREE.MeshBasicMaterial({map:image,depthTest:false,transparent:true})
                // const orbit = new THREE.Mesh( geometry, material );
                const pointMaterial = new THREE.PointsMaterial({map:image,size:15,side:THREE.DoubleSide,depthTest:false,transparent:true});
                // const pointMaterial = new THREE.PointsMaterial({color:0xff0000, size: 10});
                const pointGeoetry = new THREE.BufferGeometry();
                // console.log(pointGeoetry)
                pointGeoetry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0],3))
                // pointGeoetry.setAttribute('position',new THREE.Float32BufferAttribute([intersects.x,intersects.y,intersects.z],3))
                var orbit = new THREE.Points(pointGeoetry, pointMaterial);
                orbit.position.set(intersects.x,intersects.y,intersects.z)


                // console.log(orbit)
                scene.add(orbit);
                console.log(orbit)
                cameras.push(orbit);

            }

        },

        addCameraPoint2(name,intersects){
            const image = new THREE.TextureLoader().load(require("../../assets/images/camera.jpg"))
            const pointMaterial = new THREE.PointsMaterial({map:image,size:10,side:THREE.DoubleSide,depthTest:false,transparent:true});
            // const pointMaterial = new THREE.PointsMaterial({color:0xff0000, size: 10});
            const pointGeoetry = new THREE.BufferGeometry();
            // console.log(pointGeoetry)
            pointGeoetry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0],3))
            // pointGeoetry.setAttribute('position',new THREE.Float32BufferAttribute([intersects.x,intersects.y,intersects.z],3))
            var orbit = new THREE.Points(pointGeoetry, pointMaterial);
            orbit.position.set(intersects.x,intersects.y,intersects.z);



        },
        mouseDown(event){
            const objects = this.getObjects(event)
            console.log(objects)
            event.preventDefault();
            if(objects.length > 0){
                const obj = objects[0].object;
                draggableObj = obj;
                enableDrag = true;
                console.log(obj)
                controls.dispose();
                controls = null;
            }
        },
        mouseUp(){
            if(draggableObj){
                // draggableObj.updateMatrixWorld();
                // draggableObj.updateMatrix();
                // // const array = [...cameras];
                // const idx = cameras.indexOf(draggableObj);
                // cameras.splice(idx,1)
                // const obj = draggableObj.clone();
                // cameras.push(obj);
                // scene.remove(draggableObj)
                // scene.add(obj)
                // console.log(cameras.indexOf(draggableObj))
            }
            enableDrag = false;
            draggableObj = null;
            if(!controls){
                this.initControls();
            }
        },
        mouseMove(event){
            console.log()
            if(enableDrag&&draggableObj){
                const intersects = this.getIntersects(event);
                console.log(intersects)
                draggableObj.position.set(intersects.x,intersects.y,intersects.z)
                // draggableObj.geometry.setAttribute('position',new THREE.Float32BufferAttribute([intersects.x,intersects.y,intersects.z],3))
                draggableObj.updateMatrixWorld();
            }else {
                 const objects = this.getObjects(event);
                 if(objects.length > 0){
                     document.body.style.cursor = 'pointer'
                 }else {
                     document.body.style.cursor = 'default'
                 }
            }
        },
        update(){
            if(controls){
                controls.update();
            }
        },
        animate(){
            requestAnimationFrame(this.animate);
            renderer.render(scene,camera)
            this.update();
        }
    },
    mounted(){
        console.log(THREE.DoubleSide)
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