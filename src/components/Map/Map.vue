<template>
<!--  <div>-->
    <div id="map" ref="rootmap" @click="clickBtn">
      <slot></slot>
    </div>

</template>

<script>
  import Map from "ol/map";
  import "ol/ol.css";
  import TileLayer from "ol/layer/tile";
  import OSM from "ol/source/osm";
  import XYZ from 'ol/source/xyz';
  import View from "ol/view";
  import Feature from "ol/feature";
  import MousePosition from "ol/control/mouseposition";
  import Style from 'ol/style/style';
  import Text from 'ol/style/text';
  import Stroke from 'ol/style/stroke';
  import RegularShape from 'ol/style/RegularShape';
  import Fill from 'ol/style/fill';
  import Circle from 'ol/style/circle';
  import Point from 'ol/geom/point';
  import LineString from 'ol/geom/linestring';
  import Polygon from 'ol/geom/polygon';
  import Button from "@/components/Button/Button";
  import zmap from "@/components/zmapConfig";
  import LayerSwitcher from "@/components/ol/control/LayerSwitcher";
  import '@/components/ol/control/LayerSwitcher.css';
  import Overview from "@/components/ol/control/Overview";
  import '@/components/ol/control/Overview.css';
  import GeoBookmark from "@/components/ol/control/GeoBookmark";
  import '@/components/ol/control/GeoBookmark.css';
  import Tile from "ol/layer/Tile";
  import Stamen from "ol/source/Stamen";
  import Vector from "ol/source/Vector";
  import VectorLayer from "ol/layer/Vector";

  import '@/components/ol/control/LayerSwitcherImage.css';
  import LayerSwitcherImage from "@/components/ol/control/LayerSwitcherImage";
  import Legend from "@/components/ol/control/Legend";
  import '@/components/ol/control/Swipe.css';
  import Swipe from "@/components/ol/control/Swipe";
  import Bar from "@/components/ol/control/Bar";
  import Toggle from "@/components/ol/control/Toggle";


  export default {
    name: "Map",
    components: {Button},
    display: 'Z地图',
    data() {
      return {
        preCls: 'zmap-map',
        map: null,
        layers:null,
        overLayers:null
      }
    },
    props: {
      isDisabled: Boolean,
      overView: {
        type: String,
        default: '',//'left', 'right'
      },
    },
    methods: {
      initMap() {
        let ol=this.$ol;
        this.linestylered = new Style({
          fill: new Fill({ //矢量图层填充颜色，以及透明度
            color: 'rgba(255, 255, 255, 0.6)'
          }),
          stroke: new Stroke({ //边界样式
            color: 'red',
            width: 1
          }),
          text: new Text({ //文本样式
            font: '12px Calibri,sans-serif',
            fill: new Fill({
              color: '#000'
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 3
            })
          })
        });

        this.linestylegreen = new Style({
          fill: new Fill({ //矢量图层填充颜色，以及透明度
            color: 'rgba(255, 255, 255, 0.1)'
          }),
          stroke: new Stroke({ //边界样式
            color: 'green',
            width: 2
          }),
          text: new Text({ //文本样式
            font: '12px Calibri,sans-serif',
            fill: new Fill({
              color: '#000'
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 3
            })
          })
        });

        this.linestylepurple = new Style({
          fill: new Fill({ //矢量图层填充颜色，以及透明度
            color: 'rgba(255, 255, 255, 0.1)'
          }),
          stroke: new Stroke({ //边界样式
            color: 'purple',
            width: 2
          }),
          text: new Text({ //文本样式
            font: '12px Calibri,sans-serif',
            fill: new Fill({
              color: '#000'
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 3
            })
          })
        });

        this.vector = new ol.layer.Vector( {
          title: "vect999",
          source: new ol.source.Vector()
        })

        this.osmLayer=new TileLayer({
          title: "底图（osm）",
          baseLayer: true,
          source: new OSM({})
        });

        let stamenLayer=new Tile({
          title: "底图（water）",
          baseLayer: true,
          visible: false,
          source: new Stamen({layer: 'watercolor'})
        });

        this.imgLayer = new Tile({
          title: "影像",
          baseLayer: true,
          visible: false,
          source: new XYZ({
            url: 'https://wxs.ign.fr/pratique/geoportail/wmts?layer=ORTHOIMAGERY.ORTHOPHOTOS&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}}&TileRow={y}',
            attributions: '<a href="https://www.geoportail.gouv.fr/">&copy; IGN-Geoportail</a>'
          })
        });

        this.overLayers=[this.osmLayer];

        this.map = new Map({
          target: 'map',
          //controls: Control.defaults().extend([mousePositionControl]),(ol4)
          layers: [  stamenLayer,this.osmLayer,this.imgLayer,this.vector],//,stamenLayer
          view: new View({
            //center: [66.46, 20.92], //[116.46, 39.92]该位置地图左移、下移//[56.46, 20.92],5,china在中间
            zoom: 15,
            center: [270148, 6247782],
          })
        });
        zmap.setMap(this.map);

        this.geoSearchLayer = new VectorLayer({
          title: 'SearchResult',
          declutter: false,
          displayInLayerSwitcher: true,
          source: new Vector()
        })

        this.swiperTest = new VectorLayer({
          title: 'swiperTest',
          displayInLayerSwitcher: true,
          source: new Vector()
        })


        this.map.addLayer(this.geoSearchLayer);
        this.map.addLayer(this.swiperTest);
        zmap.setGeoSearchLayer(this.geoSearchLayer)

        let _geometrie = zmap.testData2.coordinates;
        let _geometrie2 = []
        for (var i = 0; i < _geometrie[0].length; i++) {
          var temp = [_geometrie[0][i][0], _geometrie[0][i][1]]
          _geometrie2[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
        }
        let lineFeature = new ol.Feature({
          geometry: new ol.geom.LineString(_geometrie2, 'XY'),
        });
        lineFeature.setStyle(this.linestylered);
        //OptCheck.clear_layer_line_left();
        zmap.geoSearchLayer.getSource().addFeature(lineFeature);
        zmap.getMap().getView().setCenter(ol.extent.getCenter(lineFeature.getGeometry().getExtent()));

        _geometrie = zmap.testData3.coordinates;
        _geometrie2 = []
        for (var i = 0; i < _geometrie[0].length; i++) {
          var temp = [_geometrie[0][i][0], _geometrie[0][i][1]]
          _geometrie2[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
        }
        lineFeature = new ol.Feature({
          geometry: new ol.geom.LineString(_geometrie2, 'XY'),
        });
        lineFeature.setStyle(this.linestylered);
        zmap.geoSearchLayer.getSource().addFeature(lineFeature);

        let lineFeature2 = new ol.Feature({
          geometry: new ol.geom.LineString(_geometrie2, 'XY'),
        });
        lineFeature2.setStyle(this.linestylegreen);
        this.vector.getSource().addFeature(lineFeature2);


        let lineFeature3 = new ol.Feature({
          geometry: new ol.geom.LineString(_geometrie2, 'XY'),
        });
        lineFeature3.setStyle(this.linestylepurple);
        this.swiperTest.getSource().addFeature(lineFeature3);

      },
      clickBtn(ev) {
        this.$emit('click', ev);
        console.log("点击地图blabla;");

      }
    },
    mounted() {
      let ol=this.$ol;
      let self=this;
      this.initMap();
      if(this.overView!=""){
        console.log(this.overView)
        let ov = new Overview({
          layers:this.overLayers,
          collapsed: true,
          minZoom:7,
          maxZoom:13,
          align: this.overView,
          style: [ new Style({
            image: new Circle({
              fill: new Fill({
                color: 'rgba(0,255,102, 1)'
              }),
              stroke: new Stroke({
                width: 7,
                color: 'rgba(0,255,102, 0.8)'
              }),
              radius: 5
            }),
            stroke: new Stroke({
              width: 3,
              color: "rgba(0,255,102,1)",
              lineDash: [5, 5]
            })
          })]
        });
        this.map.addControl(ov);
      }

      let layerSwitcher = new LayerSwitcher({
        tipLabel: 'Legend',
        groupSelectStyle: 'children'
      });
      this.map.addControl(layerSwitcher);
      let bookmark = new GeoBookmark({
        marks:
          {
            北京: {pos:ol.proj.transform([116.399957,39.91582], 'EPSG:4326', 'EPSG:3857'), zoom:12 ,permanent: true},
            巴黎: {pos:ol.proj.transform([2.351828, 48.856578], 'EPSG:4326', 'EPSG:3857'), zoom:11, permanent: true },
            伦敦: {pos:ol.proj.transform([-0.1275,51.507222], 'EPSG:4326', 'EPSG:3857'), zoom:11, permanent: true },
            柏林: {pos:ol.proj.transform([13.383333,52.516667], 'EPSG:4326', 'EPSG:3857'), zoom:12, permanent: true },
            罗马: {pos:ol.proj.transform([12.48657,41.888732], 'EPSG:4326', 'EPSG:3857'), zoom:12 },
          }
      });
      this.map.addControl(bookmark);
      this.map.addControl(new ol.control.ScaleLine());

      //this.ctrl.addLayer(this.geoSearchLayer);
      //this.ctrl.addLayer(this.vector,true);//imgLayer  osmLayer
      //this.map.addControl(this.ctrl);

      let vectorTemp = new ol.layer.Vector( {
        title: "vector-temp",
        displayInLayerSwitcher: true,
        source: new ol.source.Vector() })

      let _geometrie = zmap.testData2.coordinates;
      let _geometrie2 = []
      for (var i = 0; i < _geometrie[0].length; i++) {
        var temp = [_geometrie[0][i][0], _geometrie[0][i][1]]
        _geometrie2[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
      }
      let lineFeature = new ol.Feature({
        geometry: new ol.geom.LineString(_geometrie2, 'XY'),
      });
      lineFeature.setStyle(this.linestylegreen);
      vectorTemp.getSource().addFeature(lineFeature);
      this.map.addLayer(vectorTemp);

      var ctrl = new Swipe();
      self.map.addControl(ctrl);
      // Set stamen on left
      //ctrl.addLayer(this.vector);
      ctrl.addLayer(this.swiperTest,true);
      // OSM on right
      ctrl.addLayer(vectorTemp );

    }
  }
</script>
<style>
  /*隐藏ol的一些自带元素*/
  .ol-attribution,
  .ol-zoom {
    display: none;
  }
</style>
