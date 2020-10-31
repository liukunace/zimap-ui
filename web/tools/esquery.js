/**
 * ESQuery（Query from ES POIS）
 * @type {ESQuery}
 * @data：2019-10-17
 * @author：lewk
 * @use ESQuery.xxx(params);
 */

ESQuery = new ESQuery();
function ESQuery() {
    this.maxcount = 20;
    this.maxcount_autocomplete_shrink = 3;
    this.distance = 1000;
    this.request_head = "http://";
    this.query_url_nearbysearch = "/maps/api/place/nearbysearch/json";
    this.query_url_autocomplete = "/maps/api/place/autocomplete/json";
    this.query_url_details = "/maps/api/place/details/json";
    this.query_type = "GET";
    this.request_contentType = "application/json;charset=utf-8";
    this.request_dataType = 'json';
    //缩小地图隐藏pois模式
    this.es_query_state = function () { }
    this.es_query_state.prototype.init = function () {
        var editButton = document.createElement('button'),
            self = ESQuery;
        ESQuery.es_query_state.is_first = true;
        ESQuery.es_query_state.init_zoom = 0;
        ESQuery.es_query_state.currState = ESQuery.state_value.hide;
        ESQuery.es_query_state.editButton = document.body.appendChild(editButton);
        PoisBz.map.on('moveend', ESQuery.es_query_state_trigger);
    }
    this.es_query_state_trigger = function () {
        var cur_zoom = PoisBz.map.getView().getZoom();
        if (ESQuery.es_query_state.is_first) {
            ESQuery.es_query_state.init_zoom = cur_zoom;
            ESQuery.es_query_state.is_first = false;
        } else {
            //autocomplete增大三级隐藏，屏幕闪烁bug
            if (ESQuery.es_query_state.init_zoom - cur_zoom >= ESQuery.maxcount_autocomplete_shrink) {
                ESQuery.es_query_state.currState.state_changed.call(ESQuery.es_query_state);
                PoisBz.es_queryFeaturesClear();
                PoisBz.map.un('moveend', ESQuery.es_query_state_trigger);
            }
        }
    }
    this.state_value = {
        show: {
            name: "poi_show",
            state_changed: function () {
                ESQuery.es_query_state.currState = ESQuery.state_value.hide;
            }
        },
        hide: {
            name: "poi_hide",
            state_changed: function () {
                ESQuery.es_query_state.currState = ESQuery.state_value.show;
            }
        }
    }
    this.config = {
        poi_query_url_nearbysearch: null,
        poi_query_url_autocomplete: null,
        poi_query_url_details: null,
        pop_info_window_url: "./business/pops/poiInfoDialog.html",
    }
    this.init = function (obj) {
        SearchComp.init({ params: { left: 100, top: 10 } });
        this.init_request_config();
        var _target_btn = $("#query_es_button");
        if ($(".searchtiplist_lev4_btn_search")) {
            _target_btn = $(".searchtiplist_lev4_btn_search");
        }
        _target_btn.click(ESQuery.query_es_autocomplete);
        $("body").keydown(function () {
            if (event.keyCode == "13") {
                var _target_text = $("#query_es_name");
                if ($(".searchtiplist_lev4_text")) {
                    _target_text = $(".searchtiplist_lev4_text");
                }
                var _val = _target_text.val();
                var _target_btn = $("#query_es_button");
                if ($(".searchtiplist_lev4_btn_search")) {
                    _target_btn = $(".searchtiplist_lev4_btn_search");
                }
                if (_val && _val != "") {
                    _target_btn.click();
                }
            }
        });
        this.focus_input();
    }
    this.focus_input = function () {
        if ($("#query_es_name")) {
            $("#query_es_name").focus();
        }
        if ($(".searchtiplist_lev4_text")) {
            $(".searchtiplist_lev4_text").focus();
        }
    }
    this.register_es_query = function () {
        PoisBz.map.on('moveend', ESQuery.init_query_es_nearbysearch);
        PoisBz.map.getView().setZoom(PoisBz.config.max_es_query_zoom);
    }
    this.unregister_es_query = function () {
        PoisBz.map.un('moveend', ESQuery.init_query_es_nearbysearch);
    }
    this.register_es_query_acp = function () {
        PoisBz.map.on('moveend', ESQuery.es_query_acp_comolete);
    }
    this.es_query_acp_finish = function () {
        PoisBz.map.un('moveend', ESQuery.es_query_acp_comolete);
    }
    this.stop_auto_es_query = function () {
        PoisBz.map.un('moveend', ESQuery.init_query_es_nearbysearch);
        PoisBz.es_queryFeaturesClear();
        PoisBz.es_query_tool.setActive(false);
    }
    this.init_query_es_nearbysearch = function () {
        var zoom = PoisBz.map.getView().getZoom();
        //console.log("zoom:" + zoom);
        if (zoom >= PoisBz.config.max_es_query_zoom) {
            ESQuery.query_es_nearbysearch();
        }
        if (zoom <= PoisBz.config.min_es_query_zoom) {
            PoisBz.es_queryFeaturesClear();
        }
    }
    this.init_request_config = function () {
        ESQuery.config.poi_query_url_nearbysearch = this.request_head + PoisBz.config.ip_es + ":" + PoisBz.config.port_es + this.query_url_nearbysearch;
        ESQuery.config.poi_query_url_autocomplete = this.request_head + PoisBz.config.ip_es + ":" + PoisBz.config.port_es + this.query_url_autocomplete;
        ESQuery.config.poi_query_url_details = this.request_head + PoisBz.config.ip_es + ":" + PoisBz.config.port_es + this.query_url_details;
    }

    this.query_es_nearbysearch = function () {
        var name = $("#query_es_name").val();
        var location;
        var _lonlat = MapTools.getMapCenter();
        location = _lonlat[0] + "," + _lonlat[1];
        var distance = this.distance;
        var _real_dis = MapTools.getMapScreenDistance();
        distance = distance > _real_dis ? _real_dis : distance;
        var maxcount = this.maxcount;
        $.ajax({
            type: this.query_type,
            url: ESQuery.config.poi_query_url_nearbysearch,
            dataType: ESQuery.request_dataType,
            data: {
                "name": "",
                "location": location,
                "distance": distance,
                "maxcount": maxcount,
                "key":PoisBz.config.key
            },
            success: function (message) {
                if (message.results && message.results.length > 0) {
                    ESQuery.assembleQueryPoisResult(message.results);
                    var state = PoisBz.ToolState.currState.name;
                    //console.log(state);
                    if (state === "state_query") {
                        PoisBz.activeSelect();
                    }
                } else {
                }
            },
            error: function (message) {
                console.log("get es data error :" + JSON.stringify(message));
            }
        });
    }
    this.query_es_autocomplete = function () {
        SearchComp.xxxhide();//no use
        var zoom = PoisBz.map.getView().getZoom();
        if (zoom >= PoisBz.config.max_es_query_zoom) {
        } else {
            PoisBz.map.getView().setZoom(PoisBz.config.max_es_query_zoom);
        }
        var _target_text = $("#query_es_name").val();
        if ($(".searchtiplist_lev4_text")) {
            _target_text = $(".searchtiplist_lev4_text").val();
        }
        if(_target_text.indexOf("...") != -1 && SearchComp.search_auto_input_text!=""){
            _target_text=SearchComp.search_auto_input_text;
        }
        var location;
        var _lonlat = MapTools.getMapCenter();
        location = _lonlat[0] + "," + _lonlat[1];
        $.ajax({
            type: this.query_type,
            url: ESQuery.config.poi_query_url_autocomplete,
            dataType: ESQuery.request_dataType,
            data: {
                "input": _target_text,
                "location": location,
                "key":PoisBz.config.key
            },
            success: function (message) {
                if (message.results && message.results.length > 0) {
                    ESQuery.stop_auto_es_query();
                    ESQuery.assembleQueryPoisResult(message.results);
                    MapTools.getMaxExtent_pois_es(message.results, "autocomplete");
                    //new ESQuery.es_query_state().init();//Map闪烁
                    var state = PoisBz.ToolState.currState.name;
                    if (state === "state_query") {
                        PoisBz.activeSelect();
                    }
                    //SearchComp.xxxhide();
                } else {
                    CommonTools.tip_alert_top(PoisBz.config.request_nodata_tip, 300, 5);
                }
            },
            error: function (message) {
                console.log("get es data error :" + JSON.stringify(message));
            }
        });
    }
    this.query_es_details = function () {
        SearchComp.xxxhide();
        var zoom = PoisBz.map.getView().getZoom();
        if (zoom >= PoisBz.config.max_es_query_zoom) {
        } else {
            PoisBz.map.getView().setZoom(PoisBz.config.max_es_query_zoom);
        }
        $.ajax({
            type: this.query_type,
            url: ESQuery.config.poi_query_url_details,
            dataType: ESQuery.request_dataType,
            data: {
                "placeid": SearchComp.select_poi_id,
                "key":PoisBz.config.key
            },
            success: function (message) {
                if (message.result) {
                    ESQuery.stop_auto_es_query();
                    ESQuery.assembleQueryPoint(message.result);
                    MapTools.getMaxExtent_point(message.result);
                } else {
                    CommonTools.tip_alert_top(PoisBz.config.request_nodata_tip, 300, 5);
                }
            },
            error: function (message) {
                console.log("get es data error :" + JSON.stringify(message));
            }
        });
    }
    this.assembleQueryPoisResult = function (results) {
        PoisBz.es_queryFeaturesClear();
        PoisBz.closeQueryAddWindow();
        var _source = PoisBz.poi_es_query_vector_layer.getSource();
        var _typeArr = [];
        var _type_escape = false;
        for (var i = 0; i < results.length; i++) {
            var _poiTemp = results[i];
            var _ftype_value = _poiTemp.types[0];
            _typeArr[i] = CommonTools.getTypeByTypeValue(_ftype_value);
            if (_typeArr[i] == null) {
                _type_escape = true;
            }
            var _types = "{";
            for (var j = 0; j < _poiTemp.types.length - 1; j++) {
                _types += _poiTemp.types[j] + ",";
            }
            _types += _poiTemp.types[_poiTemp.types.length - 1] + "}";
            var _lonlat = [_poiTemp.location.lon, _poiTemp.location.lat];
            _lonlat = ol.proj.transform(_lonlat, 'EPSG:4326', 'EPSG:3857');
            var _pointFeature = new ol.Feature({
                geometry: new ol.geom.Point(_lonlat),
                id: _poiTemp.place_id,
                name: _poiTemp.name_en,
                address: _poiTemp.address,
                prominent: _poiTemp.prominent,
                types: _types,
                relation_links: _poiTemp.relation_links,
                from: "es"
            });
            _pointFeature.setId(_poiTemp.place_id);
            _pointFeature.setStyle(MapTools.queryFeatureStyle(_pointFeature, "ES"));
            _source.addFeature(_pointFeature);
        }
        _typeArr = CommonTools.ArrayUniqueAddClearNull(_typeArr);
        if (_type_escape) {
            _typeArr[_typeArr.length] = CommonTools.getTypeByTypeValue("others");
        }
        //MapTools.createPoisLegend(_typeArr, "rb");
        MapTools.createPoisLegend(pois_types_ex, "rb");
    }
    this.assembleQueryPoint = function (result) {
        PoisBz.es_queryFeaturesClear();
        var _source = PoisBz.poi_es_query_vector_layer.getSource();
        var _typeArr = [];
        var _type_escape = false;
        var _poiTemp = result;
        var _ftype_value = _poiTemp.types;
        _typeArr[0] = CommonTools.getTypeByTypeValue(_ftype_value);
        if (_typeArr[0] == null) {
            _type_escape = true;
        }
        var _types = "{";
        for (var j = 0; j < _poiTemp.types.length - 1; j++) {
            _types += _poiTemp.types[j] + ",";
        }
        _types += _poiTemp.types[_poiTemp.types.length - 1] + "}";
        var _lonlat = [_poiTemp.location.lon, _poiTemp.location.lat];
        _lonlat = ol.proj.transform(_lonlat, 'EPSG:4326', 'EPSG:3857');
        var _pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(_lonlat),
            id: _poiTemp.place_id,
            name: _poiTemp.name_en,
            address: _poiTemp.address,
            prominent: _poiTemp.prominent,
            types: _types,
            relation_links: _poiTemp.relation_links,
            from: "es"
        });
        _pointFeature.setId(_poiTemp.place_id);
        _pointFeature.setStyle(MapTools.queryFeatureStyle(_pointFeature, "ES"));
        _source.addFeature(_pointFeature);
        _typeArr = CommonTools.ArrayUniqueAddClearNull(_typeArr);
        if (_type_escape) {
            _typeArr[_typeArr.length] = CommonTools.getTypeByTypeValue("others");
        }
        //MapTools.createPoisLegend(_typeArr, "rb");
        MapTools.createPoisLegend(pois_types_ex, "rb");
    }

}