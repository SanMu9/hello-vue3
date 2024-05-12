import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getGradientShaderMaterial } from './shaderUtil.js';
import { getColor } from './util.js'; 
class ThreePie3d {
    constructor(dom) {
        this.container = dom
        this.scene = null
        this.camera = null
        this.renderer = null
        this.controls = null

        this.option = {
            colors:['#FFCA27','#00BFFF','#DC143C'],
            maxHeight:100,
            innerRadius:50,
            outerRadius:100,
            startAngle:0,
            data:[
                {name:"A",value:45},
                {name:"B",value:90}
            ]
        }

        this.init()
    }
    init() {
        this.scene = new THREE.Scene();
        const scene = this.scene
        const wrap = this.container
        // this.camera = new THREE.PerspectiveCamera(45, wrap.offsetWidth / wrap.offsetHeight, 0.1, 1000)
        this.camera = new THREE.PerspectiveCamera(45, wrap.offsetWidth / wrap.offsetHeight, 1, 100000)
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.renderer.setClearColor(0x000000, 0);
        const renderer = this.renderer
        renderer.setSize(wrap.offsetWidth, wrap.offsetHeight);
        renderer.shadowMap.enable = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const camera = this.camera
        camera.position.x = 0;
        camera.position.y = 200;
        camera.position.z = 200;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        wrap.appendChild(renderer.domElement);

        // 初始化controls
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = true;
        const controls = this.controls

        // 光线
        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
        dirLight.position.set( 400, 400,400 );
        dirLight.castShadow = true;
        scene.add(dirLight)

        animate()

        function animate(){
            requestAnimationFrame(animate);
            renderer.render(scene,camera)
            if(controls){
                controls.update();
            }
        }

        this.initHelper()

        // this.setOption()

    }
   
    initHelper() {
        const scene = this.scene
        scene.background = new THREE.Color(0x000000);

        const length = 200;
        var geometry = new THREE.BufferGeometry();/* 简单基础几何 */
        var lineMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });/* 基础线材质 */

        var planeGeometry = new THREE.PlaneGeometry(length, 10);/* 平面 width：200,、height：10 */
        var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xD9D9D9, side: THREE.DoubleSide });/* 平面材质 */

        const pointArray = [
            new THREE.Vector3(-length / 2, 0, 0),
            new THREE.Vector3(length / 2, 0, 0)
        ]
        geometry.setFromPoints(pointArray)
        // geometry.vertices.push(new THREE.Vector3(-length / 2, 0, 0));/* 顶点(-100, 0, 0) */
        // geometry.vertices.push(new THREE.Vector3(length / 2, 0, 0)); /* 顶点( 100, 0, 0) */

        // /* 循环创建线段 */
        for (var i = 0; i <= length / 10; i++) {

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

        // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
        const axes = new THREE.AxesHelper(200);
        scene.add(axes)

    }

    setOption(option){
        option = {...this.option,...option}
        let data = option.data
        let total = data.reduce((a,b) => {
            console.log(a.value,b.value)
           return {value:a.value + b.value}
        },{value:0})
        total = total.value
        let drawDataArr = []
        let startAngle = option.startAngle
        const colors = option.colors
        for(let i=0;i<data.length;i++){
            let rate = data[i].value / total
            let height = option.maxHeight * rate
            let angle = Math.PI * 2 * rate
            let color = colors[i%colors.length]
            const {innerRadius,outerRadius} = option
            let obj = {
                rate,
                height,
                angle,
                startAngle,
                innerRadius,
                outerRadius,
                color,
                name:data[i].name,
                value:data[i].value,
            }
            drawDataArr.push(obj)
            startAngle = startAngle + angle
        }
        this.drawPie(drawDataArr)
    }

    drawPie(data){
        for(let i=0;i<data.length;i++){
            this.drawSingle(data[i])
        }
    }
    drawSingle(data){
        const scene = this.scene
        let {innerRadius,outerRadius,height,angle,startAngle,color} = data
        console.log(data)

        let group = new THREE.Group() 
        scene.add(group)
        // 上下面
        const geometry = new THREE.RingGeometry(
            innerRadius,
            outerRadius,
            32,
            1,
            startAngle,
            angle
        )
        let meshTop = new THREE.Mesh(geometry,this.getMaterial(color))
        let meshBottom = new THREE.Mesh(geometry,this.getMaterial(color))
        meshTop.rotateX(-0.5 * Math.PI)
        meshTop.position.y = height
        meshBottom.rotateX(-0.5 * Math.PI)
        group.add(meshTop)
        group.add(meshBottom)
        
        // 外立面
        let geometry2 = new THREE.CylinderGeometry(
            outerRadius,
            outerRadius,
            height,
            32,
            1,
            true,
            startAngle,
            angle
        )
        let meshOuter = new THREE.Mesh(geometry2,this.getGradientMaterial(color))
        meshOuter.position.y = height/2
        meshOuter.rotateY(0.5 * Math.PI)
        group.add(meshOuter)

        // 内立面
        if(innerRadius !=0){
            let geometry3 = new THREE.CylinderGeometry(
                innerRadius,
                innerRadius,
                height,
                32,
                1,
                true,
                startAngle,
                angle
            )
            let meshInner = new THREE.Mesh(geometry3,this.getGradientMaterial(color))
            meshInner.position.y = height/2
            meshInner.rotateY(0.5 * Math.PI)
            group.add(meshInner)
        }

        // 侧面
        let geometry4 = new THREE.PlaneGeometry(outerRadius-innerRadius,height)
        let meshSide = new THREE.Mesh(geometry4,this.getGradientMaterial(color))
        meshSide.position.y = height/2
        meshSide.position.x = 0
        meshSide.position.z = 0
        let meshSide2 = meshSide.clone()
        meshSide.rotateY(startAngle)
        meshSide2.rotateY(startAngle+angle)
        let axis = new THREE.Vector3(1,0,0)
        meshSide.translateOnAxis(axis,(outerRadius - innerRadius) / 2 + innerRadius)
        meshSide2.translateOnAxis(axis,(outerRadius - innerRadius) / 2 + innerRadius)
      

        group.add(meshSide)
        group.add(meshSide2)

    }
    getMaterial(color){
        return new THREE.MeshLambertMaterial({
            color,
            transparent:true,
            opacity:1,
            side:THREE.DoubleSide
        })
    }
    getGradientMaterial(color){
        return getGradientShaderMaterial(THREE,this.getLightColor(color),color)
    }
    getLightColor(color) {
        let c = getColor(color);
        let { red, blue, green } = c;
        // console.log('%ccolor', `background:${color}`);

        const l = 0.5;
        const r = red + parseInt((255 - red) * l),
          g = green + parseInt((255 - green) * l),
          b = blue + parseInt((255 - blue) * l);
        // console.log('%clight', `background:rgb(${r},${g}, ${b})`);
        return `rgb(${r},${g}, ${b})`;
      }

}
export default ThreePie3d