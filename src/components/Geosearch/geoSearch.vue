<template>
  <div class="geo-select">
    <div
      :class="['box', { focus: focus }]"
      @click="handleClick"
      v-clickoutside="handleClose"
    >
<!--      <span v-show="!value.length">图层*0</span>-->
      <span v-show="!value.length"></span>
      <span v-if="!multiple">{{ label }}</span>
      <span v-else>
<!--        <geo-tag v-if="value.length > 0">{{ `图层*${value.length}` }}</geo-tag>-->
        <geo-tag v-if="value.length >= 0">{{ `图层*${count}` }}</geo-tag>
      </span>
<!--      <i class="fa fa-angle-down fa-lg pull-right">&nbsp;</i>-->
      <i class="fa fa-search fa-lg pull-right">&nbsp;</i>
    </div>
    <div class="dropdown" v-show="show">
      <ul>
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import emitter from './observer/emitter'
import clickoutside from './directives/clickoutside'
import GeoTag from './geoTag'
import zmap from "@/components/zmapConfig";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import http from '@/utils/httpRequest'

export default {
  name: 'geoSelect',
  mixins: [emitter],
  directives: {
    clickoutside
  },
  components: {
    GeoTag
  },
  props: {
    value: {
      type: [String, Array]
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      focus: false,
      label: undefined,
      values: undefined,
      show: false,
      count:0,
      linestylered:null
    }
  },
  methods: {
    init() {
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

      if (this.multiple) {
        const tmpLabel = []
        const tmpValue = []
        let j=0;
        this.$children.forEach(child => {
          if (child.$options.name === 'geoOption') {
            if(child.using === 'true'){
              tmpLabel[j] = child.geoLabel
              tmpValue[j] = child.value
              child.selected = true
              this.count++
              j++
            }else{
              child.selected = false
            }
          }
        })
        this.values = tmpValue
      }
    },
    handleCancel() {
      this.broadcast('geoOption', 'cancel', this.value[0])
      this.$emit('change', this.value.slice(1))
      this.label.shift()
    },
    handleClick(e) {
      // this.focus = true
      // this.show = !this.show
      console.log(this.values)
      console.log(this.$attrs.action)
      /*
      var _geometrie = geojson_data.coordinates;
      var _geometrie2 = []
      for (var i = 0; i < _geometrie.length; i++) {
        var temp = [_geometrie[i][0], _geometrie[i][1]]
        _geometrie2[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
      }
      lineFeature = new ol.Feature({
        geometry: new ol.geom.LineString(_geometrie2, 'XY'),
      });
      lineFeature.setStyle(OptCheck.linestylered);
      OptCheck.clear_layer_line_left();
      OptCheck.layer_line_left.getSource().addFeature(lineFeature);
      OptCheck.config.map.getView().setCenter(ol.extent.getCenter(lineFeature.getGeometry().getExtent()));
      POLYGON((121.71436091670316 31.38080337674083,121.70173615072089 31.388605486784197,121.70751628677645 31.4199972067024,121.71832867120243 31.437168981489133,121.73193985623796 31.37984624401758,121.71436091670316 31.38080337674083))
       */

      let ol=this.$ol;

      let draw = new ol.interaction.Draw({
        //features: features,
        //source: drawSource,
        type: 'Polygon',//多边形
      });
      zmap.getMap().addInteraction(draw);
      draw.on('drawend',function(evt) {//绘画完成触发时间
        zmap.getMap().removeInteraction(draw);//移除绘画互动
        let polygon = evt.feature.getGeometry();
        let coordinates = polygon.getCoordinates();
        //console.log("--------------------------------------draw----over----"+coordinates);
        let _geometrie2 = []
        let coordinates2 = []
        for (let i = 0; i < coordinates[0].length; i++) {
          let temp = [coordinates[0][i][0], coordinates[0][i][1]]
          _geometrie2[i] = ol.proj.transform(temp, 'EPSG:3857', 'EPSG:4326');
          coordinates2[i] = temp;
        }
        //-268262.91673822777,6248537.574621458,268219.92090981733,6247949.964966515,269688.94504717307,6248241.381136852,268262.91673822777,6248537.574621458
        let lineFeature = new ol.Feature({
          geometry: new ol.geom.LineString(coordinates2, 'XY'),
        });
        lineFeature.setStyle(this.linestylered);
        //OptCheck.clear_layer_line_left();
        zmap.geoSearchLayer.getSource().addFeature(lineFeature);
        //zmap.getMap().getView().setCenter(ol.extent.getCenter(lineFeature.getGeometry().getExtent()));

        //116.79479598999023,36.329290306107154,116.7954397201538,36.32704298338973,116.8067693710327,36.326628085954226,116.8054389953613,36.330846106941294,116.79479598999023,36.329290306107154
        //console.log("-----------------------------------draw----over----,"+_geometrie2);

        //this.$attrs.action
        http({
          url: http.adornUrl('/mas/poly3?table=mashan_city_design_20201010'),
          method: 'get',
          params: http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data)
            let polyStr=data.poly[0].geom;
            let polyArray=polyStr.split('(')[3].split(')')[0].split(',')
            let _geometrie5=[]
            for(let i=0;i<polyArray.length;i++){
              let temp=polyArray[i].split(' ')
              _geometrie5[i] = [temp[0]*1, temp[1]*1]
            }

            let _geometrie55 = []
            for (var i = 0; i < _geometrie5.length; i++) {
              var temp = [_geometrie5[i][0], _geometrie5[i][1]]
              _geometrie55[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
            }
            let lineFeature2 = new ol.Feature({
              geometry: new ol.geom.LineString(_geometrie55, 'XY'),
            });

            console.log("-----------------------------------draw----over----,"+_geometrie55);

            lineFeature2.setStyle(this.linestylered);
            //OptCheck.clear_layer_line_left();
            zmap.geoSearchLayer.getSource().addFeature(lineFeature2);
            zmap.getMap().getView().setCenter(ol.extent.getCenter(lineFeature2.getGeometry().getExtent()));

          }
        })



      });

    },
    handleClose() {
      this.focus = false
      this.show = false
    }
  },
  created() {
    if (this.multiple) {
      this.label = []
    }
    this.$on('option-click', (selected, label, value) => {
      if (this.multiple) {
        if (selected) {
          this.broadcast('geoOption', 'cancel', value)
          const index = this.value.indexOf(value)
          if (index !== -1) {
            const tmpValue = this.value
            tmpValue.splice(index, 1)
            this.$emit('change', tmpValue)
            this.label.splice(index, 1)
          }
          this.count--
        } else {
          this.broadcast('geoOption', 'select', value)
          this.$emit('change', [...this.value, value])
          this.label.push(label)
          this.count++
        }
      } else if (!selected) {
        if (this.value) {
          this.broadcast('geoOption', 'cancel', this.value)
        }
        this.broadcast('geoOption', 'select', value)
        this.$emit('change', value)
        this.label = label
        this.show = false
        this.count++
      }
    })
  },
  mounted() {
    this.init()
  }
}
</script>


