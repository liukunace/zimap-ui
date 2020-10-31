/**
 * OlMapTools（Map Basic Functions）
 * @type {OlMapTools}
 * @data：2019-10-12
 * @author：lewk
 * @use MapTools.xxx(params);
 */

MapTools = new OlMapTools();
function OlMapTools() {
    this.config = {
        create_feature_icon: "./business/icon/pin_red_16.png",
        query_feature_icon_type1: "./business/icon/pin_blue_16.png",
        es_label: "es",
        query_feature_icon_es: "./business/icon/pin_blue_16.png",
        db_label: "database",
        query_feature_icon_pg: "./business/icon/hospital_cross_pinlet-1-small.png",
        lon_label: "lon",
        lat_label: "lat",
        query_feature_style_font: "normal 13px 微软雅黑",
        label_text_fill: new ol.style.Fill({ color: '#AA3300' }),//yellow light
        label_text_stroke: new ol.style.Stroke({ color: '#FFCC33', width: 2 })
    }
    this.createFeatureStyle = function (feature) {
        return new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 20],//[左右偏移（0-1）,相对于鼠标点位置上下（px）]
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                offset: [0, 0],  //[左右偏移，上下偏移]
                scale: 0.5,      //图标缩放比例
                opacity: 0.9,
                src: this.config.create_feature_icon
            })),
            text: null
        });
    }
    this.simpleFeatureStyle = function (_name) {
        var _fill = null;
        var _stroke = null;
        var _fond = this.config.query_feature_style_font;
        _fill = this.config.label_text_fill;
        _stroke = this.config.label_text_stroke_pg;
        return new ol.style.Style({
            text: new ol.style.Text({
                textAlign: 'center',
                textBaseline: 'middle',
                rotateWithView: true,
                offsetY: -13,
                font: _fond,
                text: _name,
                fill: _fill,
                stroke: _stroke
            })
        });
    }
    this.createFeatureStyle_withname = function (name) {
        var _fond = this.config.query_feature_style_font,
            _fill = this.config.label_text_fill,
            _stroke = this.config.label_text_stroke_pg;
        return new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 20],//[左右偏移（0-1）,相对于鼠标点位置上下（px）]
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                offset: [0, 0],  //[左右偏移，上下偏移]
                scale: 0.5,      //图标缩放比例
                opacity: 0.9,
                src: this.config.create_feature_icon
            })),
            text: new ol.style.Text({
                textAlign: 'center',
                textBaseline: 'middle',
                rotateWithView: true,
                offsetY: -13,
                font: _fond,
                text: name,
                fill: _fill,
                stroke: _stroke
            })
        });
    }
    this.createFeatureStyle_withname2 = function (name) {
        var _fond = this.config.query_feature_style_font,
            _fill = this.config.label_text_fill,
            _stroke = this.config.label_text_stroke_pg;
        return new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 20],//[左右偏移（0-1）,相对于鼠标点位置上下（px）]
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                offset: [0, 0],  //[左右偏移，上下偏移]
                scale: 0.5,      //图标缩放比例
                opacity: 0.9,
                src: this.config.query_feature_icon_type1
            })),
            text: new ol.style.Text({
                textAlign: 'center',
                textBaseline: 'middle',
                rotateWithView: true,
                offsetY: -13,
                font: _fond,
                text: name,
                fill: _fill,
                stroke: _stroke
            })
        });
    }

    this.linestyle_withname = function(color,name){
        return new ol.style.Style({
            fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
                color: 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new ol.style.Stroke({ //边界样式
                color: color,
                width: 1
            }),
            text: new ol.style.Text({ //文本样式
                font: '12px Calibri,sans-serif',
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 3
                }),
                text: name,
            })
        });
    }
    
    this.createFeatureStyle_with_png = function (png) {
        return new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 20],//[左右偏移（0-1）,相对于鼠标点位置上下（px）]
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                offset: [0, 0],  //[左右偏移，上下偏移]
                scale: 0.5,      //图标缩放比例
                opacity: 0.9,
                src: png
            }))
        });
    }
    this.queryFeatureStyle = function (feature, type, fill, stroke) {
        var _name = feature ? feature.get('name') : "";
        var _types = feature ? feature.get('types') : "";
        var _icon = this.config.query_feature_icon_type1;
        if (_types != "") {
            var _types_arr = _types.split(/{|,|}/);
            _types_arr = CommonTools.ArrayUniqueAddClearNull(_types_arr);
            if (_types_arr.length > 0) {
                _iconTemp = this.getIconByTypeValue(_types_arr[0]);
                if (_iconTemp && _iconTemp != null && _iconTemp != "") {
                    _icon = _iconTemp;
                } else {
                }
            }
        }
        if (feature && feature.get('from') && feature.get('from') != "") {
            if (feature.get('from') === this.config.es_label) {
                _icon = this.config.query_feature_icon_es;
            } else if (feature.get('from') === this.config.db_label) {
                _icon = this.config.query_feature_icon_pg;
            }
        }
        var _fill = null;
        var _stroke = null;
        var _fond = null;
        if (typeof PoisBz == "undefined") {
            _fond = this.config.query_feature_style_font;
        } else {
            _fond = PoisBz.config.query_feature_style_font;
        }
        if (type === "ES") {
            _fill = PoisBz.config.label_text_fill_es;
            _stroke = PoisBz.config.label_text_stroke_es;

        } else if (type === "PG") {
            _fill = PoisBz.config.label_text_fill_pg;
            _stroke = PoisBz.config.label_text_stroke_pg;
        } else {
            if (typeof PoisBz == "undefined") {
                _fill = this.config.label_text_fill;
                _stroke = this.config.label_text_stroke_pg;
            } else {
                _fill = PoisBz.config.label_text_fill;
                _stroke = PoisBz.config.label_text_stroke_pg;
            }
        }
        if (fill && fill != null) {
            _fill = fill;
        }
        if (stroke && stroke != null) {
            _stroke = stroke;
        }
        return new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 15],
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                offset: [0, 0],
                scale: 0.5,
                opacity: 0.9,
                src: _icon
            })),
            text: new ol.style.Text({
                textAlign: 'center',
                textBaseline: 'middle',
                rotateWithView: true,
                offsetY: -13,
                font: _fond,
                text: _name,
                fill: _fill,
                stroke: _stroke
            })
        });
    }
    this.change_poi_labelstyle = function (e) {
        switch (e.target.id) {
            case "label_text_type01"://default
                PoisBz.config.label_text_fill_es = new ol.style.Fill({ color: '#909CE1' });
                PoisBz.config.label_text_stroke_es = new ol.style.Stroke({ color: '#FFFFFF', width: 0.5 });
                break;
            case "label_text_type02"://light
                PoisBz.config.label_text_fill_es = new ol.style.Fill({ color: '#AA3300' });
                PoisBz.config.label_text_stroke_es = new ol.style.Stroke({ color: '#FFCC33', width: 2 });
                break;
            case "label_text_type03"://dark
                PoisBz.config.label_text_fill_es = new ol.style.Fill({ color: '#808080' });
                PoisBz.config.label_text_stroke_es = new ol.style.Stroke({ color: '#FFFFFF', width: 0.5 });
                break;
            case "label_text_type11"://default
                PoisBz.config.label_text_fill_pg = new ol.style.Fill({ color: '#EE72B6' });
                PoisBz.config.label_text_stroke_pg = new ol.style.Stroke({ color: '#FFFFFF', width: 0.5 });
                break;
            case "label_text_type12"://light
                PoisBz.config.label_text_fill_pg = new ol.style.Fill({ color: '#AA3300' });
                PoisBz.config.label_text_stroke_pg = new ol.style.Stroke({ color: '#FFCC33', width: 2 });
                break;
            case "label_text_type13"://dark
                PoisBz.config.label_text_fill_pg = new ol.style.Fill({ color: '#808080' });
                PoisBz.config.label_text_stroke_pg = new ol.style.Stroke({ color: '#FFFFFF', width: 0.5 });
                break;
            default:
                break;
        }
        MapTools.submit_label_change(PoisBz.poi_es_query_vector_layer, "ES", PoisBz.config.label_text_fill_es, PoisBz.config.label_text_stroke_es);
        MapTools.submit_label_change(PoisBz.poi_query_vector_layer, "PG", PoisBz.config.label_text_fill_pg, PoisBz.config.label_text_stroke_pg);
    }
    this.change_poi_labelstyle_select = function (obj) {
        if (obj.fill_es != "NULL") {
            PoisBz.config.label_text_fill_es = new ol.style.Fill({ color: '#' + obj.fill_es });
        }
        if (obj.strok_es != "NULL") {
            PoisBz.config.label_text_stroke_es = new ol.style.Stroke({ color: '#' + obj.strok_es, width: 0.5 });
        }
        if (obj.fill_pg != "NULL") {
            PoisBz.config.label_text_fill_pg = new ol.style.Fill({ color: '#' + obj.fill_pg });
        }
        if (obj.stroke_pg != "NULL") {
            PoisBz.config.label_text_stroke_pg = new ol.style.Stroke({ color: '#' + obj.strok_pg, width: 0.5 });
        }
        MapTools.submit_label_change(PoisBz.poi_es_query_vector_layer, "ES", PoisBz.config.label_text_fill_es, PoisBz.config.label_text_stroke_es);
        MapTools.submit_label_change(PoisBz.poi_query_vector_layer, "PG", PoisBz.config.label_text_fill_pg, PoisBz.config.label_text_stroke_pg);
    }
    this.submit_label_change = function (laye, type, fill, stroke) {
        var _source_pg = laye.getSource();
        var featuresArrTemps_pg = _source_pg.getFeatures();
        if (featuresArrTemps_pg.length > 0) {
            for (var j = 0; j < featuresArrTemps_pg.length; j++) {
                featuresArrTemps_pg[j].setStyle(MapTools.queryFeatureStyle(featuresArrTemps_pg[j], type, fill, stroke));
            }
        }
    }
    this.registMapClick = function () {
        var mapContainer = document.getElementById('map');
        mapContainer.addEventListener("click", this.getScreenCoordinate, false);//mousemove  click  doubleclick-x  mouseup-x mousedown-x
    }
    this.register_poi_drag = function () {
        //modifyend modifying
        PoisBz.medit.getInteraction('Modify').on('modifyend', this.change_window_lonlat);
    }
    this.unregister_poi_drag = function () {
        PoisBz.medit.getInteraction('Modify').un('modifyend', this.change_window_lonlat);
    }
    this.register_poi_drag_edit = function () {
        PoisBz.edit_exitpoi_tool.getInteraction('Modify').on('modifyend', this.change_window_lonlat_edit);
    }
    this.unregister_poi_drag_edit = function () {
        PoisBz.edit_exitpoi_tool.getInteraction('Modify').un('modifyend', this.change_window_lonlat_edit);
    }
    this.change_window_lonlat = function () {
        var _poi_Coordinate = $("#Poi-Coordinate");
        var state = PoisBz.ToolState.currState.name;
        if (state === "state_query") {
            var _lonlat = [PoisBz.getLocation().lon, PoisBz.getLocation().lat];
            _lonlat = ol.proj.transform(_lonlat, 'EPSG:3857', 'EPSG:4326');
            _lonlat = MapTools.LonlatCorrect(_lonlat);
            _poi_Coordinate.attr('placeholder', PoisBz.getLocation().type + ":" + _lonlat[0] + "," + _lonlat[1]);
        }
    }
    this.change_window_lonlat_edit = function (e) {
        var _poi_Coordinate = $("#Poi-Coordinate");
        var state = PoisBz.ToolState.currState.name;
        if (state === "state_update") {
            console.log(state);
            var _lonlat = [PoisBz.getLocation_editor().lon, PoisBz.getLocation_editor().lat];
            _lonlat = ol.proj.transform(_lonlat, 'EPSG:3857', 'EPSG:4326');
            _lonlat = MapTools.LonlatCorrect(_lonlat);
            _poi_Coordinate.attr('placeholder', PoisBz.getLocation_editor().type + ":" + _lonlat[0] + "," + _lonlat[1]);
        }
    }
    //获取鼠标坐标
    this.getScreenCoordinate = function (e) {
        var mapContainer = document.getElementById('map');
        // 采用屏幕坐标计算得到地图坐标        
        var pos = { x: e.clientX - mapContainer.offsetLeft, y: e.clientY - mapContainer.offsetTop };//以左上为原点        
        //地图大小		
        var mapSize = PoisBz.map.getSize();
        //图片的经纬度，即左下角的经纬度和右上角的经纬度		
        var temp = PoisBz.map.getView().calculateExtent(mapSize);
        var mapExtentL = { x: temp[0], y: temp[1] };//左下		
        var mapExtentR = { x: temp[2], y: temp[3] };//右上        
        //坐标由3857投影转换为4326		
        temp = ol.proj.transform([mapExtentL.x, mapExtentL.y], 'EPSG:3857', 'EPSG:4326');
        var mapPosL = { x: temp[0], y: temp[1] };
        temp = ol.proj.transform([mapExtentR.x, mapExtentR.y], 'EPSG:3857', 'EPSG:4326');
        var mapPosR = { x: temp[0], y: temp[1] };
        pos = { lon: mapPosL.x + pos.x * (mapPosR.x - mapPosL.x) / mapSize[0], lat: mapPosR.y + pos.y * (mapPosL.y - mapPosR.y) / mapSize[1] };
        //console.log(this.config.lon_label+"：" + pos.lon.toFixed(6) + " 纬度：" + pos.lat.toFixed(6));
        return [pos.lon.toFixed(6), pos.lat.toFixed(6)];
    }
    this.getMapCenter = function () {
        var _mapExtent = PoisBz.map.getView().calculateExtent(PoisBz.map.getSize());
        var _map_center = ol.extent.getCenter(_mapExtent);
        _map_center = ol.proj.transform(_map_center, 'EPSG:3857', 'EPSG:4326');
        return _map_center;
    }
    this.getMapScreenDistance = function () {
        var _lonlat2 = this.getScreenLonlatLB();
        _lonlat2 = [parseFloat(_lonlat2[0]).toFixed(6), parseFloat(_lonlat2[1]).toFixed(6)];
        var _lonlat0 = this.getMapCenter();
        _lonlat0 = [parseFloat(_lonlat0[0]).toFixed(6), parseFloat(_lonlat0[1]).toFixed(6)];
        var _lonlat1 = [_lonlat2[0], _lonlat0[1]];
        var _distance_width = this.getDistance(_lonlat1[1], _lonlat1[0], _lonlat0[1], _lonlat0[0]);
        var _distance_height = this.getDistance(_lonlat1[1], _lonlat1[0], _lonlat2[1], _lonlat2[0]);
        var _dis_min = Math.abs(_distance_width) > Math.abs(_distance_height) ? Math.abs(_distance_height) : Math.abs(_distance_width);
        return _dis_min;
    }
    this.getDistance = function (lat1, lng1, lat2, lng2) {
        lat1 = parseFloat(lat1);
        lng1 = parseFloat(lng1);
        lat2 = parseFloat(lat2);
        lng2 = parseFloat(lng2);
        var f = this.getRad((lat1 + lat2) / 2);
        var g = this.getRad((lat1 - lat2) / 2);
        var l = this.getRad((lng1 - lng2) / 2);
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        var s, c, w, r, d, h1, h2;
        var a = 6378137.0;//The Radius of eath in meter.   
        var fl = 1 / 298.257;
        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;
        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;
        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;
        s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
        //s = s / 1000;//km
        //s = s.toFixed(2);//指定小数点后的位数
        return s;
    }
    this.getPointsDistanc=function(points){
        var _distance = 0.0
        for (var i=0;i<points.length-1;i++){
            _distance+=this.getPointDistance(points[i],points[i+1]);
        }
        return _distance
    }
    this.getPointDistance = function (poi1, poi2) {
        lat1 = parseFloat(poi1[1]);
        lng1 = parseFloat(poi1[0]);
        lat2 = parseFloat(poi2[1]);
        lng2 = parseFloat(poi2[0]);
        if(lat1==lat2 && lng1==lng2){
            return 0.0
        }
        var f = this.getRad((lat1 + lat2) / 2);
        var g = this.getRad((lat1 - lat2) / 2);
        var l = this.getRad((lng1 - lng2) / 2);
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        var s, c, w, r, d, h1, h2;
        var a = 6378137.0;//The Radius of eath in meter.   
        var fl = 1 / 298.257;
        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;
        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;
        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;
        s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
        //s = s / 1000;//km
        //s = s.toFixed(2);//指定小数点后的位数。
        if(s==NaN){
            return 0.0
        }   
        return s;
    }
    this.getRad = function (d) {
        var PI = Math.PI;
        return d * PI / 180.0;
    }
    this.getScreenLonlatLB = function () {
        var mapSize = PoisBz.map.getSize();
        var temp = PoisBz.map.getView().calculateExtent(mapSize);
        var mapExtentL = { x: temp[0], y: temp[1] };//左下		
        var mapExtentR = { x: temp[2], y: temp[3] };//右上        
        temp = ol.proj.transform([mapExtentL.x, mapExtentL.y], 'EPSG:3857', 'EPSG:4326');
        var mapPosL = { x: temp[0], y: temp[1] };
        temp = ol.proj.transform([mapExtentR.x, mapExtentR.y], 'EPSG:3857', 'EPSG:4326');
        var mapPosR = { x: temp[0], y: temp[1] };
        _lonmin = this.LonCorrect(mapPosL.x);
        _lonmax = this.LonCorrect(mapPosR.x);
        _latmin = this.LatCorrect(mapPosL.y);
        _latmax = this.LatCorrect(mapPosR.y);
        return [_lonmin, _latmin];
    }
    this.LonlatCorrect = function (lonlat) {
        var lon = lonlat[0], lat = lonlat[1];
        lon = this.LonCorrect(lon);
        lat = this.LatCorrect(lat);
        var _lonlat = [lon, lat];
        return _lonlat;
    }
    this.LonCorrect = function (lon) {
        lon = parseFloat(lon);
        while (lon > 180) lon -= 360;
        while (lon < -180) lon += 360;
        lon = lon > 179.999 ? 179.999 : lon;
        lon = lon < -179.999 ? -179.999 : lon;
        return lon.toFixed(6);
    }
    this.LatCorrect = function (lat) {
        lat = parseFloat(lat);
        lat = lat > 89.999 ? 89.999 : lat;
        lat = lat < -89.999 ? -89.999 : lat;
        return lat.toFixed(6);
    }
    this.getMapExtent = function () {
        var mapSize = PoisBz.map.getSize();
        var temp = PoisBz.map.getView().calculateExtent(mapSize);
        var mapExtentL = { x: temp[0], y: temp[1] };//左下		
        var mapExtentR = { x: temp[2], y: temp[3] };//右上        
        temp = ol.proj.transform([mapExtentL.x, mapExtentL.y], 'EPSG:3857', 'EPSG:4326');
        var mapPosL = { x: temp[0], y: temp[1] };
        temp = ol.proj.transform([mapExtentR.x, mapExtentR.y], 'EPSG:3857', 'EPSG:4326');
        var mapPosR = { x: temp[0], y: temp[1] };
        _lonmin = this.LonCorrect(mapPosL.x);
        _lonmax = this.LonCorrect(mapPosR.x);
        _latmin = this.LatCorrect(mapPosL.y);
        _latmax = this.LatCorrect(mapPosR.y);
        var _envelop = "0,0,0,0";
        var _envelop_arr = [];
        if (_lonmin > _lonmax) {
            _envelop_arr[0] = _lonmin + "," + _latmax + "," + 179.9999 + "," + _latmin;
            _envelop_arr[1] = -179.9999 + "," + _latmax + "," + _lonmax + "," + _latmin;
            return _envelop_arr;
        } else {
            _envelop = _lonmin + "," + _latmax + "," + _lonmax + "," + _latmin;
            return _envelop;
        }
    }
    //location:"rb"=right+bottom;"lb"=left+bottom
    this.clearPoisLegend = function () {
        var _divEx = $("#" + "map_legend_div");
        if (_divEx) {
            _divEx.remove();
        }
    }
    this.createPoisLegend = function (inputGrades, location) {
        this.clearPoisLegend();
        var _div = $('<div id="map_legend_div">');
        _div.attr("class", "legend_info legend info_" + location);
        var defaultGrades = [0, 10, 20, 50, 100, 200, 500, 1000],
            defaultColors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'],
            grades = inputGrades.length > 0 ? inputGrades : defaultGrades,
            colors = inputGrades.length > 0 ? inputGrades : defaultColors,
            labels = [],
            from, _src;
        for (var i = 0; i < grades.length; i++) {
            from = grades[i].name;
            _src = inputGrades[i].src;
            _value = inputGrades[i].value;
            if (_value === "POIS_from_DataBase") {
                labels.push(
                    '<div><img style="width:16px;height:21px;float:left;" src="' + _src + '"/><label class="legend_label">'
                    + from + '</label></div>');
            } else {
                labels.push(
                    '<div><img style="width:13px;height:21px;float:left;" src="' + _src + '"/><label class="legend_label">'
                    + from + '</label></div>');
            }
        }
        _div.append(labels.join('<br>'));
        $("#map").append(_div);
        var _len_arr = [];
        for (var i = 0; i < grades.length; i++) {
            _len_arr[i] = CommonTools.GetLength(grades[i].name);
        }
        _len_arr.sort(CommonTools.sortNumber);
        var _legend_width = 120 + (_len_arr[grades.length - 1] - 10) * 6;
        $("#map_legend_div").width(_legend_width);
    }
    this.getMaxExtent_pois = function (poisList) {
        var _lonArr = new Array();
        var _latArr = new Array();
        for (var i = 0; i < poisList.length; i++) {
            _lonArr[i] = poisList[i].geometry.coordinates[0];
            _latArr[i] = poisList[i].geometry.coordinates[1];
        }
        _lonArr.sort(CommonTools.sortNumber);
        _latArr.sort(CommonTools.sortNumber);
        var _poiTemp = [_lonArr[0], _latArr[0]];
        //_poiTemp=this.LonlatCorrect(_poiTemp);
        var _lonlat = ol.proj.transform(_poiTemp, 'EPSG:4326', 'EPSG:3857');
        var _poiTemp2 = [_lonArr[poisList.length - 1], _latArr[poisList.length - 1]];
        //_poiTemp2=this.LonlatCorrect(_poiTemp2);
        var _lonlat2 = ol.proj.transform(_poiTemp2, 'EPSG:4326', 'EPSG:3857');
        minx = _lonlat[0];
        miny = _lonlat[1];
        maxx = _lonlat2[0];
        maxy = _lonlat2[1];
        if (minx == maxx) {
            minx = minx - 1000.0;
            minx = minx + 1000.0;
        }
        if (miny == maxy) {
            miny = miny - 1000.0;
            miny = miny + 1000.0;
        }
        var size = (PoisBz.map.getSize());
        var _extent = [minx, miny, maxx, maxy]
        if (maxx > minx) {
            PoisBz.map.getView().fit(_extent, size, { padding: [300, 300, 300, 300], constrainResolution: false });
        }
        if (poisList.length == 1) {
            PoisBz.map.getView().setCenter(_lonlat);
            PoisBz.map.getView().setZoom(PoisBz.config.max_query_zoom);
        }
    }
    this.getMaxExtent_pois_es = function (poisList, index) {
        var _lonArr = new Array();
        var _latArr = new Array();
        for (var i = 0; i < poisList.length; i++) {
            _lonArr[i] = poisList[i].location.lon;
            _latArr[i] = poisList[i].location.lat;
        }
        _lonArr.sort(CommonTools.sortNumber);
        _latArr.sort(CommonTools.sortNumber);
        var _poiTemp = [_lonArr[0], _latArr[0]];
        var _lonlat = ol.proj.transform(_poiTemp, 'EPSG:4326', 'EPSG:3857');
        var _poiTemp2 = [_lonArr[poisList.length - 1], _latArr[poisList.length - 1]];
        var _lonlat2 = ol.proj.transform(_poiTemp2, 'EPSG:4326', 'EPSG:3857');
        minx = _lonlat[0];
        miny = _lonlat[1];
        maxx = _lonlat2[0];
        maxy = _lonlat2[1];
        if (minx == maxx) {
            minx = minx - 1000.0;
            minx = minx + 1000.0;
        }
        if (miny == maxy) {
            miny = miny - 1000.0;
            miny = miny + 1000.0;
        }
        var size = PoisBz.map.getSize();
        var _extent = [minx, miny, maxx, maxy]
        if (poisList.length == 1) {
            PoisBz.map.getView().setCenter(_lonlat);
            PoisBz.map.getView().setZoom(PoisBz.config.max_query_zoom);
            return
        }
        if (index === "autocomplete") {//_lonlat is not real point
            _poiTemp = [poisList[0].location.lon, poisList[0].location.lat];
            _lonlat = ol.proj.transform(_poiTemp, 'EPSG:4326', 'EPSG:3857');
            PoisBz.map.getView().setCenter(_lonlat);
            PoisBz.map.getView().setZoom(PoisBz.config.max_query_zoom);
            return
        }
        if (maxx > minx) {
            PoisBz.map.getView().fit(_extent, size, { padding: [300, 300, 300, 300], constrainResolution: false });
            return
        }
    }
    this.getMaxExtent_simple_poi = function (poisList) {
        var _lonArr = new Array();
        var _latArr = new Array();
        for (var i = 0; i < poisList.length; i++) {
            _lonArr[i] = poisList[i][0];
            _latArr[i] = poisList[i][1];
        }
        _lonArr.sort(CommonTools.sortNumber);
        _latArr.sort(CommonTools.sortNumber);
        var _poiTemp = [_lonArr[0], _latArr[0]];
        //_poiTemp=this.LonlatCorrect(_poiTemp);
        var _lonlat = ol.proj.transform(_poiTemp, 'EPSG:4326', 'EPSG:3857');
        var _poiTemp2 = [_lonArr[poisList.length - 1], _latArr[poisList.length - 1]];
        //_poiTemp2=this.LonlatCorrect(_poiTemp2);
        var _lonlat2 = ol.proj.transform(_poiTemp2, 'EPSG:4326', 'EPSG:3857');
        minx = _lonlat[0];
        miny = _lonlat[1];
        maxx = _lonlat2[0];
        maxy = _lonlat2[1];
        if (minx == maxx) {
            minx = minx - 1000.0;
            minx = minx + 1000.0;
        }
        if (miny == maxy) {
            miny = miny - 1000.0;
            miny = miny + 1000.0;
        }
        var size = (PoisBz.map.getSize());
        var _extent = [minx, miny, maxx, maxy]
        if (maxx > minx) {
            PoisBz.map.getView().fit(_extent, size, { padding: [300, 300, 300, 300], constrainResolution: false });
        }
        if (poisList.length == 1) {
            PoisBz.map.getView().setCenter(_lonlat);
            PoisBz.map.getView().setZoom(PoisBz.config.max_query_zoom);
        }
    }
    this.getMaxExtent_simple_point = function (map,poisList) {
        var _lonArr = new Array();
        var _latArr = new Array();
        for (var i = 0; i < poisList.length; i++) {
            _lonArr[i] = poisList[i][0];
            _latArr[i] = poisList[i][1];
        }
        _lonArr.sort(CommonTools.sortNumber);
        _latArr.sort(CommonTools.sortNumber);
        var _poiTemp = [_lonArr[0], _latArr[0]];
        //_poiTemp=this.LonlatCorrect(_poiTemp);
        var _lonlat = ol.proj.transform(_poiTemp, 'EPSG:4326', 'EPSG:3857');
        var _poiTemp2 = [_lonArr[poisList.length - 1], _latArr[poisList.length - 1]];
        //_poiTemp2=this.LonlatCorrect(_poiTemp2);
        var _lonlat2 = ol.proj.transform(_poiTemp2, 'EPSG:4326', 'EPSG:3857');
        minx = _lonlat[0];
        miny = _lonlat[1];
        maxx = _lonlat2[0];
        maxy = _lonlat2[1];
        if (minx == maxx) {
            minx = minx - 1000.0;
            minx = minx + 1000.0;
        }
        if (miny == maxy) {
            miny = miny - 1000.0;
            miny = miny + 1000.0;
        }
        var size = (map.getSize());
        var _extent = [minx, miny, maxx, maxy]
        if (maxx > minx) {
            map.getView().fit(_extent, size, { padding: [300, 300, 300, 300], constrainResolution: false });
        }
        if (poisList.length == 1) {
            map.getView().setCenter(_lonlat);
            map.getView().setZoom(16);
        }
    }
    this.getMaxExtent_point = function (poi) {
        var _poiTemp = [poi.location.lon, poi.location.lat];
        var _lonlat = ol.proj.transform(_poiTemp, 'EPSG:4326', 'EPSG:3857');
        PoisBz.map.getView().setCenter(_lonlat);
        PoisBz.map.getView().setZoom(PoisBz.config.max_query_zoom);
    }
    this.getIconByTypeValue = function (value) {
        for (var i = 0; i < pois_types.length; i++) {
            if (pois_types[i].value === value) {
                return pois_types[i].src;
            }
        }
        return null;
    }


}