<template>
  <div id="map" class="map-wrapper"></div>
</template>

<script>
const mapboxgl = window.mapboxgl;
export default {
  methods: {
    initMap() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoic2FubXU5IiwiYSI6ImNrbzE3MnZkajBtb24yeG9ibmxjMHE1ZDYifQ.9mVkYRsx-tj0MZeMowE3MA";
      const map = new mapboxgl.Map({
        container: "map",
        zoom: 14,
        center: [118.85057226939843, 32.0694476898852],
        pitch: 0,
        bearing: 0,
        style: "mapbox://styles/mapbox/dark-v10",
      });
      map.on('load', () => {
      map.addSource('wms-test-source', {
        'type': 'raster',
        // use the tiles option to specify a WMS tile source URL
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
        'tiles': [
          'http://10.10.10.231:6080/arcgis/services/MXLdark/MXLdark/MapServer/WMSServer?'+
          'SERVICE=WMS'+
          '&VERSION=1.3.0'+ //wms的版本
          '&REQUEST=GetMap'+ // 调用的方法名称，获取地图必须是这个方法
          '&FORMAT=image/png'+// 返回的图片格式
          '&TRANSPARENT=true'+
          '&LAYERS=1,2,3,4,5,6,7,9,10'+ // 要显示的图层
          '&WIDTH=256&HEIGHT=256'+
          '&CRS=EPSG:3857'+
          '&STYLES=&BBOX={bbox-epsg-3857}'
        ],
        // bounds:[
        //   118.828125,32.069091796875,118.839111328125,32.080078125
        // ],
        'tileSize': 256
      });
      map.addLayer(
        {
          'id': 'wms-test-layer',
          'type': 'raster',
          'source': 'wms-test-source',
          'paint': {}
        },
          'aeroway-line'
        );
      });

      // var map = new mapboxgl.Map({
      //   container: "map",
      //   style: "mapbox://styles/mapbox/light-v10",
      //   zoom: 8,
      //   center: [-74.5447, 40.6892],
      // });

      // map.on("load", function () {
      //   map.addLayer(
      //     {
      //       id: "wms-test-layer",
      //       type: "raster",
      //       source: {
      //         type: "raster",
      //         tiles: [
      //           "https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015",
      //         ],
      //         tileSize: 256,
      //       },
      //       paint: {},
      //     },
      //     "aeroway-line"
      //   );
      // });
    },
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
}
</style>
