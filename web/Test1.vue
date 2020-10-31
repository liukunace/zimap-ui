<template>
  <div class="viewer" ref="viewerContainer">
    <vc-viewer
      ref="vcViewer"
      :baseLayerPicker="baseLayerPicker"
      :fullscreenButton="fullscreenButton"
      :fullscreenElement="fullscreenElement"
      :infoBox="infoBox"
      @ready="ready"
    >
      <vc-navigation></vc-navigation>
      <vc-layer-imagery>
        <vc-provider-imagery-tianditu mapStyle="img_c" :token="tk"></vc-provider-imagery-tianditu>
      </vc-layer-imagery>
      <vc-layer-imagery ref="layerText">
        <vc-provider-imagery-tianditu mapStyle="cia_c" :token="tk"></vc-provider-imagery-tianditu>
      </vc-layer-imagery>
    </vc-viewer>
    <div class="demo-tool">
      <span>图层</span>
      <md-switch v-model="baseLayerPicker"></md-switch>
      <span>全屏</span>
      <md-switch v-model="fullscreenButton"></md-switch>
      <span>信息</span>
      <md-switch v-model="infoBox"></md-switch>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        baseLayerPicker: false,
        fullscreenButton: true,
        infoBox: true,
        fullscreenElement: document.body,
        tk: '436ce7e50d27eede2f2929307e6b33c0'
      }
    },
    mounted() {
      this.$refs.vcViewer.createPromise.then((Cesium, viewer) => {
        console.log('viewer is loaded.')
      })
    },
    methods: {
      ready(cesiumInstance) {
        const { Cesium, viewer } = cesiumInstance
        this.fullscreenElement = this.$refs.viewerContainer
        viewer.entities.add({
          id: '北京（location=>BJ）',
          position: Cesium.Cartesian3.fromDegrees(116.405285, 39.904989, 100),
          billboard: new Cesium.BillboardGraphics({
            image: './statics/assets/poi_red80.png',
            scale: 0.3
          }),
          label: new Cesium.LabelGraphics({
            text: '北京市',
            font: '24px sans-serif',
            horizontalOrigin: 1,
            outlineColor: new Cesium.Color(0, 0, 0, 1),
            outlineWidth: 2,
            pixelOffset: new Cesium.Cartesian2(17, -5),
            style: Cesium.LabelStyle.FILL
          })
        })
      }
    }
  }
</script>
<style>
  .demo-tool {
    position: absolute;
    left: 1%;
    top: 1%;
    min-width: 185px;
    z-index: 100;
    color: white;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .viewer {
    width: 100%;
    height: 100%;
    overflow-x: hidden; /*x轴禁止滚动*/
    overflow-y: hidden; /*x轴禁止滚动 scroll*/
  }
</style>
