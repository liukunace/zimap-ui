import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import CesiumTest from './Test1.vue'
import '@/assets/index.scss'
import ZmapUI from '@'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

fontawesome.library.add(solid)
fontawesome.library.add(regular)
fontawesome.library.add(brands)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import Defined from '@/components/zmapConfig.js'
Vue.prototype.$def = Defined

import ol from '@/ol/ol.js';
import '@/ol/ol.css'
import '@/ol/ole.css'
Vue.prototype.$ol = ol;
import jquery from '@/js/jquery.min.js';
Vue.prototype.$jquery = jquery;

Vue.use(VueMaterial)
Vue.use(ZmapUI)
import * as VueCesium from '@/cesiumext/index.js'
Vue.use(VueCesium, {
  // cesiumPath: 'https://cdn.jsdelivr.net/npm/cesium@latest/Build/Cesium/Cesium.js',
  // cesiumPath: 'https://unpkg.com/cesium/Build/CesiumUnminified/Cesium.js',
  // cesiumPath: 'https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js',
  //cesiumPath: './statics/Cesium/Cesium.js',
  cesiumPath: './statics/Cesium/Cesium.js',
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5Y2U0ZTk2Ni1jNzdkLTQ3OWYtYjVmYS0yMGM3YTk3NjgzMmUiLCJpZCI6Njk5Nywic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0ODA1MTc0OH0.Csy6yyAnv6JSBppH0Ou3ahshqcHFEhP27iOz5gjQMEo'
})

new Vue({
  el: '#app',
  render: h => h(CesiumTest)
})
