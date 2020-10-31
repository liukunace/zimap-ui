<template>
  <div id="app">
<!--    <div class="zm underline" style="width: 200px;">-->
<!--      <zmap-geosearch v-model="layerData" multiple class="wid115" action="http://localhost:8807/zmap/mas/poly">-->
<!--        <zmap-geooption label="图层1" value="layer1" using="true" ></zmap-geooption>-->
<!--        <zmap-geooption label="图层2" value="layer2" using="true" ></zmap-geooption>-->
<!--        <zmap-geooption label="图层3" value="layer3" using="true" ></zmap-geooption>-->
<!--        <zmap-geooption label="图层4" value="layer4" using="false" ></zmap-geooption>-->
<!--        <zmap-geooption label="图层5" value="layer5" using="true" ></zmap-geooption>-->
<!--      </zmap-geosearch>-->
<!--      <p></p>-->
<!--    </div>-->

<!--    <div class="zm underline" style="width: 1200px;">-->
<!--      <zmap-map @click="mapClickTest(this)"  ref="baseMap" overView="bottom-right" >-->
<!--      </zmap-map>-->
<!--    </div>-->

  </div>
</template>

<script>

import Tile from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

export default {
  name: 'app',
  components: {
  },
  data () {
    return {
      msg: '欢迎使用 zmap-ui，智耘科技',
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      size: '',
      data: ['test1'],
      layerData: ['layer3'],
    }
  },
  methods: {
    showSize(item) {
      this.size = item;
      this.show1 = true
    },
    mapClickTest(e){
      let map=this.$def.map;
      console.log("外部调用测试信息：outer info");
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  color: rgba(120, 163, 60, 0.9);
  margin-top: 0px;
  padding-bottom: 0px;
}

.wid115{
  width: 115px;
}

a {
  color: #5575b9;
}

.zm, .zm30 {
  padding-top: 30px;
}

.zmb, zmb20 {
  padding-bottom: 20px;
}

.underline {
  border-bottom: 1px solid #b9bfcc;
}
</style>
