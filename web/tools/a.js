untiled = new OpenLayers.Layer.WMS(
  "topp：state", "http://localhost:8080/geoserver/wms",
  {

    layers: 'topp:state',
    transparent: "true",
    format: 'image/png'

  },
  {
    isBaseLayer: false,
    opacity: "0.3",
    singleTile: true,
    ratio: 1
  },
);

//用Google的地图,添加标记时候用的经纬不能准确定位标记
//像素值与实际经纬度值的互转

map.events.register('click', gmap, function (ev) {
  var lonLat = map.getLonLatFromPixel(ev.xy);
  if (map.displayProjection) {
//将像素值转换成经纬度
    lonLat.transform(map.getProjectionObject(), map.displayProjection);
//将经纬度转换成像素值
    lonLat.transform(map.displayProjection, map.getProjectionObject());
  }
  //3.用经纬度来为地图添加标记

  var laolat_v = new OpenLayers.LonLat(lo, la);
  if (map.displayProjection) {
    laolat_v.transform(map.displayProjection, map.getProjectionObject());
  }
  markers = new OpenLayers.Layer.Markers("Markers");
  markers.addMarker(GetMark(laolat_v));
  markers.events.register('click', markers, function () {
    popup = new OpenLayers.Popup("chicken",
      laolat_v,
      new OpenLayers.Size(20, 20),
      "haha！！！",
      true);
    popup.autoSize = true;
    map.addPopup(popup);
  });
  map.addLayers([markers]);


},

function GetMark(laolat_v) {
  var size = new OpenLayers.Size(70, 30);
  var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
  var icon = new OpenLayers.Icon('http://www.k1982.com/png/up/200905/20090513082309637.png', size, offset);
  var mk = new OpenLayers.Marker(laolat_v, icon)
//mk.visible=false;
  return mk;
},

//#Openlayers

abc = {
  "layers": [
    {
      "layer_id": "anjiHXMap",
      "server": "geoserver",
      "level": 0,
      "name": "anjiHXMap",
      "visible": true,
      "format": "image/png",
      "tile_grid": "grid_GDImage",
      "url": "/gwc/service/wms"
    },
    {
      "layer_id": "anjiGNMap",
      "server": "geoserver",
      "level": 0,
      "name": "anjiGNMap",
      "visible": true,
      "format": "image/png",
      "tile_grid": "grid_GDImage",
      "url": "/gwc/service/wms"
    },
  ],
  "maps": [
    {
      "map_id": "map_1",
      "description": "地图",
      "layer_groups": [
        {
          "group_id": "tdtmap_img",
          "layers": [
            {"id": "map_1", "pid": "root", "title": "安吉县", "tip": "安吉县"},
            //{"id":"g-1","pid":"map_1","title":"影像图","tip":"影像图","visible":true,"inswitcher":false,"layers":["GISSERVER_AnJiMapImg"]},
            {
              "id": "g-1",
              "pid": "map_1",
              "title": "影像图",
              "tip": "影像图",
              "visible": true,
              "inswitcher": false,
              "layers": ["tmap_img_w", "tmap_cia_w"]
            },
            {"id": "g-10", "pid": "map_1", "title": "功能区划", "tip": "功能区划", "visible": true, "layers": ["anjiGNMap"]},
            {"id": "g-11", "pid": "map_1", "title": "红线数据", "tip": "红线数据", "visible": true, "layers": ["anjiHXMap"]}
          ]
        },
        {
          "group_id": "tdtmap_vec",
          "layers": [
            {"id": "map_1", "pid": "root", "title": "安吉县", "tip": "安吉县"},
            //{"id":"g-1","pid":"map_1","title":"街道图","tip":"街道图","visible":true,"inswitcher":false,"layers":["GISSERVER_AnJiMapVec"]},
            {
              "id": "g-1",
              "pid": "map_1",
              "title": "街道图",
              "tip": "街道图",
              "visible": true,
              "inswitcher": false,
              "layers": ["tmap_vec_c", "tmap_cva_w"]
            },
            {"id": "g-10", "pid": "map_1", "title": "功能区划", "tip": "功能区划", "visible": true, "layers": ["anjiGNMap"]},
            {"id": "g-11", "pid": "map_1", "title": "红线数据", "tip": "红线数据", "visible": true, "layers": ["anjiHXMap"]}
          ]
        }
      ],
      "olview": "id_view_1"
    }
  ]
}

