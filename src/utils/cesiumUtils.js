const Cesium = window.Cesium
// const turf = window.turf

// (function(){
function PolylineTrailLinkMaterialProperty(color, duration, image) {
  this._definitionChanged = new Cesium.Event()
  this._color = color
  this._colorSubscription = undefined;
  this.color = color;
  this.duration = duration;
  this._time = new Date().getTime();
  this._image = image ? image : require('../assets/images/map/line2.jpg')
}
if (Cesium.PolylineTrailLinkMaterialProperty == undefined) {

  Object.defineProperties(
    PolylineTrailLinkMaterialProperty.prototype, {
      isConstant: {
        get: function () {
          return false
        }
      },
      definitionChanged: {
        get: function () {
          return this._definitionChanged
        }
      },
      color: Cesium.createPropertyDescriptor("color")
    }
  )
  PolylineTrailLinkMaterialProperty.prototype.getType = function () {
    return 'PolylineTrailLink'
  }
  PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.image = this._image;
    // result.image = Cesium.Material.PolylineTrailLinkImage;
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration;
    return result
  }

  PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
    return (this === other || (other instanceof PolylineTrailLinkMaterialProperty && Cesium.Property.equals(this._color, other._color)));
  }

  Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty
  Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
  Cesium.Material.PolylineTrailLinkImage = require('../assets/images/map/meteor_01.png');
  Cesium.Material.PolylineTrailLinkSource =
    // "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
    //   {\n\
    //       czm_material material = czm_getDefaultMaterial(materialInput);\n\
    //       vec2 st = materialInput.st;\n\
    //       \n\
    //       if(texture2D(image, vec2(0.0, 0.0)).a == 1.0){\n\
    //           discard;\n\
    //       }else{\n\
    //           material.alpha = texture2D(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
    //       }\n\
    //       \n\
    //       material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
    //       \n\
    //       return material;\n\
    //   }\n\
    //   "; //动态线
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
    {\n\
        czm_material material = czm_getDefaultMaterial(materialInput);\n\
        vec2 st = materialInput.st;\n\
        \n\
        vec4 colorImage = texture2D(image, vec2(fract(1.0 *st.s - time), fract(st.t)));\n\
        \n\
        vec4 fragColor;\n\
        // fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
        fragColor.rgb = (color.rgb) / 1.0;\n\
        fragColor = czm_gammaCorrect(fragColor);\n\
        material.diffuse = colorImage.rgb;\n\
        material.alpha = colorImage.a;\n\
        material.emission = fragColor.rgb;\n\
        \n\
        return material;\n\
    }\n\
    "; //动态泛光线

  // " czm_material czm_getMaterial(czm_materialInput materialInput)\n\
  //   {\n\
  //       czm_material material = czm_getDefaultMaterial(materialInput);\n\
  //       vec2 st = materialInput.st;\n\
  //       vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
  //       material.alpha = colorImage.a * color.a;\n\
  //       material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
  //       return material;\n\
  //   }";
  Cesium.Material._materialCache.addMaterial(
    Cesium.Material.PolylineTrailLinkType, {
      fabric: {
        type: Cesium.Material.PolylineTrailLinkType,
        uniforms: {
          color: new Cesium.Color(0.0, 0.0, 0.0, 0.1),
          image: Cesium.Material.PolylineTrailLinkImage,
          time: 0,
          // constantSpeed: 300,
          // depthFailMaterial: true
        },
        source: Cesium.Material.PolylineTrailLinkSource
      },
      translucent: function (material) {
        return true;
      }
    }
  )
}

function RoadTrailLinkMaterialProperty(color, duration, image) {
    this._definitionChanged = new Cesium.Event()
    this._color = undefined
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = new Date().getTime();
    this._image = image ? image : require('../assets/images/map/line2.jpg')
  }
  if (Cesium.RoadTrailMaterialProperty == undefined) {
  
    Object.defineProperties(
      RoadTrailLinkMaterialProperty.prototype, {
        isConstant: {
          get: function () {
            return false
          }
        },
        definitionChanged: {
          get: function () {
            return this._definitionChanged
          }
        },
        color: Cesium.createPropertyDescriptor("color")
      }
    )
    RoadTrailLinkMaterialProperty.prototype.getType = function () {
      return 'PolylineTrailLink'
    }
    RoadTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
      if (!Cesium.defined(result)) {
        result = {};
      }
      result.image = this._image;
      // result.image = Cesium.Material.PolylineTrailLinkImage;
      result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
      result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration;
      return result
    }
  
    RoadTrailLinkMaterialProperty.prototype.equals = function (other) {
      return (this === other || (other instanceof RoadTrailLinkMaterialProperty && Cesium.Property.equals(this._color, other._color)));
    }
  
    Cesium.RoadTrailMaterialProperty = RoadTrailLinkMaterialProperty
    Cesium.Material.RoadTrailLinkType = 'RoadTrailLink';
    Cesium.Material.RoadTrailLinkImage = require('../assets/images/map/meteor_01.png');
    Cesium.Material.RoadTrailLinkSource =
  
      "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
      {\n\
          czm_material material = czm_getDefaultMaterial(materialInput);\n\
          vec2 st = materialInput.st;\n\
          \n\
          vec4 colorImage = texture2D(image, vec2(fract(1.0 *st.s - time), fract(st.t)));\n\
          \n\
          vec4 fragColor;\n\
          fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
          fragColor = czm_gammaCorrect(fragColor);\n\
          material.diffuse = colorImage.rgb;\n\
          material.alpha = colorImage.a;\n\
          material.emission = fragColor.rgb;\n\
          \n\
          return material;\n\
      }\n\
      "; //动态泛光线
  
    Cesium.Material._materialCache.addMaterial(
      Cesium.Material.RoadTrailLinkType, {
        fabric: {
          type: Cesium.Material.RoadTrailLinkType,
          uniforms: {
            color: new Cesium.Color(0.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.RoadTrailLinkImage,
            time: 0,
            // constantSpeed: 300,
            // depthFailMaterial: true
          },
          source: Cesium.Material.RoadTrailLinkSource
        },
        translucent: function (material) {
          return true;
        }
      }
    )
  }

// 控制缩放、旋转、平移
function cameraControl(viewer, bool) {
    const scene = viewer.scene
    // 如果为真，则允许用户旋转相机。如果为假，相机将锁定到当前标题。此标志仅适用于2D和3D。
    scene.screenSpaceCameraController.enableRotate = bool;
    // 如果为true，则允许用户平移地图。如果为假，相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式。
    scene.screenSpaceCameraController.enableTranslate = bool;
    // 如果为真，允许用户放大和缩小。如果为假，相机将锁定到距离椭圆体的当前距离
    scene.screenSpaceCameraController.enableZoom = bool;
    // 如果为真，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
    scene.screenSpaceCameraController.enableTilt = bool;
}

// 获取当前相机视角
function viewerInfoGet(viewer) {
    const pos = viewer.camera.position;
    const camera = viewer.camera;
    var ellipsoid = viewer.scene.globe.ellipsoid;

    var cartographic = ellipsoid.cartesianToCartographic(pos);

    var lat = Cesium.Math.toDegrees(cartographic.latitude);

    var lng = Cesium.Math.toDegrees(cartographic.longitude);

    var alt = cartographic.height;

    // console.log(lng + "," + lat + "," + alt);
    // console.log("heading: " + camera.heading);
    // console.log("roll: " + camera.roll);
    // console.log("pitch: " + camera.pitch);
    return {
        position: [lng, lat, alt],
        heading: camera.heading,
        roll: camera.roll,
        pitch: camera.pitch
    }
}
export const limitCameraViewRange = function (viewer) {
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 0; //相机的高度的最小值
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1000; //相机高度的最大值
    viewer.scene.screenSpaceCameraController._minimumZoomRate = 1000; // 设置相机缩小时的速率
    // viewer.scene.screenSpaceCameraController._maximumZoomRate=5906376272000    //设置相机放大时的速率
    viewer.scene.screenSpaceCameraController._maximumZoomRate = 1000 //设置相机放大时的速率
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = true; //true 禁止 false 允许

    var minPitch = -Cesium.Math.PI_OVER_TWO;
    var maxPitch = 0;
    var minHeight = 200;

    let lastPitch = viewer.camera.pitch,
        lastRoll = viewer.camera.roll,
        lastHeading = viewer.camera.heading,
        lastViewerInfo = viewerInfoGet(viewer)
    // lastDestination =  this.viewerInfoGet
    const _this = this
    let viewerChangeEnable = true

    viewer.camera.changed.addEventListener(
        function () {
            if (!viewerChangeEnable) {
                return
            }
            if (viewer.camera._suspendTerrainAdjustment && viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
                viewer.camera._suspendTerrainAdjustment = false;
                viewer.camera._adjustHeightForTerrain();
            }
            // console.log(viewer.camera.pitch)

            // Keep camera in a reasonable pitch range
            var pitch = viewer.camera.pitch;

            if (pitch > maxPitch || pitch < minPitch) {
                viewer.scene.screenSpaceCameraController.enableTilt = false;

                // clamp the pitch
                // if(pitch > maxPitch ) { 
                //     pitch = maxPitch; 
                // } else if(pitch < minPitch) {
                //     pitch = minPitch;
                // }
                // pitch = lastPitch

                var destination = Cesium.Cartesian3.fromRadians(
                    viewer.camera.positionCartographic.longitude,
                    viewer.camera.positionCartographic.latitude,
                    Math.max(viewer.camera.positionCartographic.height, minHeight));
                console.log('恢复视角:', pitch)
                cameraControl(viewer, false)
                viewerChangeEnable = false
                viewer.camera.flyTo({
                    // destination: destination,
                    // destination: lastDestination,
                    destination: Cesium.Cartesian3.fromDegrees(...lastViewerInfo.position),
                    orientation: {
                        // pitch: lastPitch,
                        pitch: lastViewerInfo.pitch,
                        roll: lastViewerInfo.roll,
                        heading: lastViewerInfo.heading

                        // roll:lastRoll,
                        // heading:lastHeading
                    },
                    // duration:0.5,
                    complete: function () {
                        cameraControl(viewer, true)
                        viewerChangeEnable = true
                    }
                });
                viewer.scene.screenSpaceCameraController.enableTilt = true;
            } else {
                // lastPitch = pitch
                // lastRoll = viewer.camera.roll,
                // lastHeading = viewer.camera.heading
                lastViewerInfo = viewerInfoGet(viewer)

            }
        }
    );

}
export default { limitCameraViewRange }
