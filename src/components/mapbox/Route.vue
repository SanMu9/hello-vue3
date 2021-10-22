<!--
 * @Author: your name
 * @Date: 2021-05-18 14:38:25
 * @LastEditTime: 2021-06-04 14:15:48
 * @LastEditors: Please set LastEditors
 * @Description: mapboxgl绘制路线动画
 * @FilePath: /hello-vue3/src/components/mapbox/Route.vue
-->
<template>
  <div id="map" class="map-wrapper"></div>
  <div class="menuBar">
    <input type="button" value="开始" @click="startClick()" />
    <input type="button" value="暂停" @click="pauseClick()" />
    <input type="button" value="停止" @click="stopClick()" />
  </div>
</template>

<script>
import * as turf from "@turf/turf";
const mapboxgl = window.mapboxgl;
const routeGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [116.391844, 39.898457],
          [116.377947, 39.898595],
          [116.368001, 39.898341],
          [116.357144, 39.898063],
          [116.351934, 39.899095],
          [116.35067, 39.905871],
          [116.3498, 39.922329],
          [116.349671, 39.931017],
          [116.349225, 39.939104],
          [116.34991, 39.942233],
          [116.366892, 39.947263],
          [116.387537, 39.947568],
          [116.401988, 39.947764],
          [116.410824, 39.947929],
          [116.42674, 39.947558],
          [116.427338, 39.9397],
          [116.427919, 39.932404],
          [116.428377, 39.923109],
          [116.429583, 39.907094],
          [116.41404, 39.906858],
          [116.405321, 39.906622],
          [116.394954, 39.906324],
          [116.391264, 39.906308],
          [116.390748, 39.916611],
        ],
      },
    },
  ],
};
const realRouteGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    },
  ],
};
const animatePointGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [],
      },
    },
  ],
};
export default {
  data() {
    return {
      isPlay: false,
      counter: 0,
      steps: 0,
      aLength: 0,
      newRouteGeoJson:{},
    };
  },
  methods: {
    initMap() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoic2FubXU5IiwiYSI6ImNrbzE3MnZkajBtb24yeG9ibmxjMHE1ZDYifQ.9mVkYRsx-tj0MZeMowE3MA";
      const map = new mapboxgl.Map({
        container: "map",
        center: [116.390619, 39.924317], // starting position [lng, lat]
        zoom: 13, // starting zoom
        style: "mapbox://styles/mapbox/dark-v10",
      });
      window.Mapbox = map;
      const _this = this;
      const svgXML = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"> 
                <path d="M529.6128 512L239.9232 222.4128 384.7168 77.5168 819.2 512 384.7168 946.4832 239.9232 801.5872z" p-id="9085" fill="#ffffff"></path> 
            </svg>
            `;

      const svgBase64 =
        "data:image/svg+xml;base64," +
        window.btoa(unescape(encodeURIComponent(svgXML)));

      map.on("load", function () {
        let arrowIcon = new Image(20, 20);
        arrowIcon.src = svgBase64;
        arrowIcon.onload = function () {
          map.addImage("arrowIcon", arrowIcon);
          map.loadImage(require("../../../public/images/car.png"), function (error, carIcon) {
            if (carIcon) {
              map.addImage("carIcon", carIcon);
              _this.setRouteData();
            }
          });
        };
      });
    },
    // #获取轨迹数据
    setRouteData() {
        animatePointGeoJson.features[0].geometry.coordinates = routeGeoJson.features[0].geometry.coordinates[0];
        this.aLength = routeGeoJson.features[0].geometry.coordinates.length;
        this.newRouteGeoJson = this.resetRoute(routeGeoJson.features[0], 1000, 'kilometers')
        this.steps = this.newRouteGeoJson.geometry.coordinates.length;

        this.addRouteLayer();
        this.addRealRouteSource() // 添加实时轨迹线图层
        this.addArrowLayer() // 添加箭头图层
        this.addAnimatePointSource() // 添加动态点图层
    },

    // 添加轨迹线图层
    addRouteLayer() {
        const map = window.Mapbox;
        map.addLayer({
            id:'routeLayer',
            type:'line',
            source:{
                type:'geojson',
                lineMetrics:true,
                data:routeGeoJson
            },
            paint:{
                'line-width':10,
                'line-opacity':1,
                'line-color':'#009EFF'
            }
        })
    },

    // 添加实时轨迹线
    addRealRouteSource(){
        const map = window.Mapbox;
        map.addSource('realRouteLayer',{
            type:"geojson",
            'lineMetrics': true,
            'data': realRouteGeoJson
        })
        map.addLayer({
            'id': 'realRoute',
            'type': 'line',
            'source': 'realRouteLayer',
            'paint': {
                'line-width': 10,
                'line-opacity': 1,
                'line-color': '#FF9900',
            }
        })
    },

    // 添加箭头图层
    addArrowLayer() {
        const map = window.Mapbox;
        map.addLayer({
            id:"arrowLayer",
            type:"symbol",
            source:{
                type:"geojson",
                data:routeGeoJson
            },
            layout:{
                'symbol-placement':'line',
                'symbol-spacing':50,
                'icon-image':'arrowIcon',
                'icon-size':0.5
            }
        })
    },

    addAnimatePointSource() {
        const map = window.Mapbox;
        map.addSource('animatePointLayer',
            {
                'type': 'geojson',
                'data': animatePointGeoJson
            }
        )
        map.addLayer({
           'id': 'animatePointLayer',
            'type': 'symbol',
            'source': 'animatePointLayer',
            'layout': {
                'icon-image': 'carIcon',
                'icon-size': 0.5,
                'icon-rotate': ['get', 'bearing'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
            } 
        })
        this.animate();
    },

    animate() {
        const map = window.Mapbox;
        if (this.counter >= this.steps) {
            return
        }
        var startPnt, endPnt
        if (this.counter == 0) {
            realRouteGeoJson.features[0].geometry.coordinates = []
            startPnt = this.newRouteGeoJson.geometry.coordinates[this.counter]
            endPnt = this.newRouteGeoJson.geometry.coordinates[this.counter + 1]
        } else if (this.counter !== 0) {
            startPnt = this.newRouteGeoJson.geometry.coordinates[this.counter - 1]
            endPnt = this.newRouteGeoJson.geometry.coordinates[this.counter]
        }

        animatePointGeoJson.features[0].properties.bearing = turf.bearing(
            turf.point(startPnt),
            turf.point(endPnt)
        ) - 90;
        animatePointGeoJson.features[0].geometry.coordinates = this.newRouteGeoJson.geometry.coordinates[this.counter];
        realRouteGeoJson.features[0].geometry.coordinates.push(animatePointGeoJson.features[0].geometry.coordinates)
        map.getSource('animatePointLayer').setData(animatePointGeoJson);
        map.getSource('realRouteLayer').setData(realRouteGeoJson);
        map.flyTo({ center: animatePointGeoJson.features[0].geometry.coordinates })
        if (this.isPlay) {
            requestAnimationFrame(this.animate);
        }
        this.counter = this.counter + 1;

    },

    resetRoute(route,nstep,units){
        const newroute = {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        };
        let lineDistance = turf.lineDistance(route);
        let nDistance = lineDistance/nstep;
        for(let i = 0; i< this.aLength-1;i++) {
            var from = turf.point(route.geometry.coordinates[i]);
            var to = turf.point(route.geometry.coordinates[i + 1]);
            let lDistance = turf.distance(from, to, {units});
            if (i == 0) {
                newroute.geometry.coordinates.push(route.geometry.coordinates[0])
            }
            if (lDistance > nDistance) {
                let rings = this.lineMore(from, to, lDistance, nDistance, units)
                newroute.geometry.coordinates = newroute.geometry.coordinates.concat(rings)
            } else {
                newroute.geometry.coordinates.push(route.geometry.coordinates[i + 1])
            }
        }
        return newroute;
    },

    lineMore(from, to, distance, splitLength, units) {
        var step = parseInt(distance / splitLength)
        var leftLength = distance - step * splitLength
        var rings = []
        var route = turf.lineString([from.geometry.coordinates, to.geometry.coordinates])
        for (let i = 1; i <= step; i++) {
            let nlength = i * splitLength
            let pnt = turf.along(route, nlength, {units});
            rings.push(pnt.geometry.coordinates)
        }
        if (leftLength > 0) {
            rings.push(to.geometry.coordinates)
        }
        return rings
    },

    startClick(){
        if(!this.isPlay){
            this.isPlay = true;
            this.animate();
        }
    },

    pauseClick() {
        this.isPlay = false;
        this.animate();
    },

    stopClick() {
        this.isPlay = false;
        this.counter = 0;
        this.animate();
    }
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style>
.map-wrapper {
  width: 100%;
  height: 100%;
}
.menuBar {
  position: fixed;
  top: 10px;
  margin: 0 50px;
  padding: 5px;
  border-radius: 3px;
  z-index: 999;
  background-color: rgba(0, 168, 0, 0.7);
}

input[type="button"] {
  font-size: 16px;
}
</style>