<template>
  <div id="map"></div>
</template>

<script>
import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import Map from "ol/Map";
import MultiPoint from "ol/geom/MultiPoint";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
export default {
  mounted() {
    const styles = [
      /* We are using two different styles for the polygons:
       *  - The first style is for the polygons themselves.
       *  - The second style is to draw the vertices of the polygons.
       *    In a custom `geometry` function the vertices of a polygon are
       *    returned as `MultiPoint` geometry, which will be used to render
       *    the style.
       */
      new Style({
        stroke: new Stroke({
          color: "blue",
          width: 10,
          lineCap:'square',//butt, round, or square.
          lineJoin:'miter',// bevel, round, or miter.
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
      // new Style({
      //   image: new CircleStyle({
      //     radius: 5,
      //     fill: new Fill({
      //       color: "orange",
      //     }),
      //   }),
      //   geometry: function (feature) {
      //     // return the coordinates of the first ring of the polygon
      //     const coordinates = feature.getGeometry().getCoordinates()[0];
      //     return new MultiPoint(coordinates);
      //   },
      // }),
    ];

    const geojsonObject = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:3857",
        },
      },
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-5e6, 6e6],
                [-5e6, 8e6],
                [-3e6, 8e6],
                [-3e6, 6e6],
                [-5e6, 6e6],
              ],
            ],
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-2e6, 6e6],
                [-2e6, 8e6],
                [0, 8e6],
                [0, 6e6],
                [-2e6, 6e6],
              ],
            ],
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [1e6, 6e6],
                [1e6, 8e6],
                [3e6, 8e6],
                [3e6, 6e6],
                [1e6, 6e6],
              ],
            ],
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-2e6, -1e6],
                [-1e6, 1e6],
                [0, -1e6],
                [-2e6, -1e6],
              ],
            ],
          },
        },
      ],
    };

    const source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });

    const layer = new VectorLayer({
      source: source,
      style: styles,
    });

    const map = new Map({
      layers: [layer],
      target: "map",
      view: new View({
        center: [0, 3000000],
        zoom: 2,
      }),
    });
  },
};
</script>

<style>
#map{
  height: 100%;
}
</style>