/**
 * Optimize Check
 * @type {OptimizeCheck}
 * @data：2019-11-13
 * @update(v3.10)：2019-12-05
 * @author：lewk
 * @use OptCheck.init({params: {elemId: "map1",map:mapInstance}});
 */

OptCheck = new OptimizeCheck();
function OptimizeCheck() {
    /**
     * OptimaizeCheck Version
     */
    this.version = "3.10";
    this.map = null;
    this.request_head = "http://";
    this.request_ip = "localhost";
    this.request_port = "808";
    this.query_url = "/maps/api/geo_edit/query";
    this.optimize_url = "/maps/api/optimize_track/json";
    this.directions_url = "/maps/api/directions/json";
    this.simulation_url = "/maps/tools/simulation/json";
    this.pikatrack_url = "/maps/tools/check_trip_track/json";
    this.query_type = "GET";
    this.add_type = "PUT";
    this.update_type = "POST";
    this.delete_type = "DELETE";
    this.request_contentType = "application/json;charset=utf-8";
    this.request_dataType = 'json';
    this.mapElemId = 'mapDiv';
    this.order_id = null;
    this.config = {
        pageIndex: 1,
        project_web: "EPSG:3857",
        project_lonlat: "EPSG:4326",
        pop_add_gps_window_url: "./route/pops/gpsdata.html",
        pop_add_tempgps_window_url: "./route/pops/gpstempdata.html",
        gps_test_data_url: "./route/gps/",
        poly_data_test_url: "./route/poly/",
        window_submit: "提交",
        window_cancel: "取消",
        google_value: "google",
        opay_value: "opay",
        here_value: "here",
        bing_value: "bing",
        timeout_test: 600,
        timeout_optimize: 3000,
        request_nodata_tip: "No results be found.",
        query_feature_style_font: "normal 13px 微软雅黑",
        label_text_fill_es: new ol.style.Fill({ color: "#909CE1" }),
        label_text_stroke_es: new ol.style.Stroke({ color: "#FFFFFF", width: 0.5 }),
        label_text_fill_pg: new ol.style.Fill({ color: "#EE72B6" }),
        label_text_stroke_pg: new ol.style.Stroke({ color: "#FFFFFF", width: 0.5 }),
        label_text_fill: new ol.style.Fill({ color: "#AA3300" }),//yellow light
        label_text_stroke: new ol.style.Stroke({ color: "#FFCC33", width: 2 })
    };

    this.pop_add_gps_window = null;
    this.pop_add_tempgps_window = null;
    this.gps_input_data_value = "";
    this.gps_input_tempdata_value = "";
    this.gps_input_data_selected_value = "";
    this.gps_input_tempdata_selected_value = "";
    this.gps_input_data_geojson = {
        "type": "LineString",
        "coordinates": []
    };

    this.linestyle = new ol.style.Style({
        fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
            color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new ol.style.Stroke({ //边界样式
            color: 'blue',
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
            })
        })
    });

    this.linestylered = new ol.style.Style({
        fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
            color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new ol.style.Stroke({ //边界样式
            color: 'red',
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
            })
        })
    });

    this.layer_point_direction_right = new ol.layer.Vector({
        title: 'Directions line Layer',
        declutter: false,
        displayInLayerSwitcher: false,
        source: new ol.source.Vector()
    })

    this.layer_point_direction_left = new ol.layer.Vector({
        title: 'Directions Points Layer',
        declutter: false,
        displayInLayerSwitcher: false,
        source: new ol.source.Vector()
    })

    this.layer_point_left = new ol.layer.Vector({
        title: 'Points Layer Left',
        declutter: false,
        displayInLayerSwitcher: false,
        source: new ol.source.Vector()
    })

    this.layer_line_left = new ol.layer.Vector({
        title: 'Lines Layer Left',
        declutter: false,
        displayInLayerSwitcher: false,
        source: new ol.source.Vector()
    })

    this.layer_point_right = new ol.layer.Vector({
        title: 'Points Layer Right',
        declutter: false,
        displayInLayerSwitcher: false,
        source: new ol.source.Vector()
    })

    this.layer_line_right = new ol.layer.Vector({
        title: 'Lines Layer Right',
        declutter: false,
        displayInLayerSwitcher: false,
        source: new ol.source.Vector()
    })

    this.layer_line_subsection_right = new ol.layer.Vector({
        title: 'Lines Section Layer Right',
        declutter: false,
        displayInLayerSwitcher: false,
        source: new ol.source.Vector()
    })

    this.init_request_config = function () {
        OptCheck.config.optimize_compare_url = this.request_head + OptCheck.config.ip + ":" + OptCheck.config.port + this.optimize_url;
        OptCheck.config.direction_url = this.request_head + OptCheck.config.ip + ":" + OptCheck.config.port + this.directions_url;
        OptCheck.config.simulation_url = this.request_head + OptCheck.config.ip + ":" + OptCheck.config.port + this.simulation_url;
        OptCheck.config.pika_track_url = this.request_head + OptCheck.config.pika_ip + ":" + OptCheck.config.pika_port + this.pikatrack_url;
        OptCheck.config.check_osrm_direction_url = this.request_head + OptCheck.config.osrm_ip + ":" + OptCheck.config.osrm_port + this.config.osrm_url;
    }

    this.init = function (obj) {
        $.extend(this.config, obj.params);
        OptPanel.init({
            params: {
                map1_id: OptCheck.config.map1id,
                map2_id: OptCheck.config.map2id,
                hasDirections: OptCheck.config.hasDirections,
                hasDistances: OptCheck.config.hasDistances,
                hasShowSeries: OptCheck.config.hasShowSeries,
            }
        });
        OptCheck.config.map.addLayer(OptCheck.layer_point_direction_left);
        OptCheck.config.map2.addLayer(OptCheck.layer_point_direction_right);
        OptCheck.config.map.addLayer(OptCheck.layer_point_left);
        OptCheck.config.map.addLayer(OptCheck.layer_line_left);

        OptCheck.config.map2.addLayer(OptCheck.layer_point_right);
        OptCheck.config.map2.addLayer(OptCheck.layer_line_right);
        OptCheck.config.map2.addLayer(OptCheck.layer_line_subsection_right);

        this.map = this.config.map;
        if (this.config.ip && this.config.ip != "") {
            this.request_ip = this.config.ip
        }
        if (this.config.port && this.config.port != "") {
            this.request_port = this.config.port
        }
        this.init_request_config();
        $("#gps_data_input_btn").click(this.openGpsDataInputWindow);
        $("#read_poly_tempdata_btn").click(this.openTempGpsDataInputWindow);
        $("#compute_gpsdata_btn").click(this.optmize_compare);
        $("#compute_directions_btn").click(this.coculate_directions);

        $("#gene_simulation_data_btn").click(this.gene_simulation_data);
        $("#refresh_data_list_btn").click(this.refresh_simulate_data_list);

        $("#read_poly_btn").click(this.load_poly_file);
        $("#read_geojson_btn").click(this.load_geojson_file);
        $("#text_start_poi").change(this.draw_direction_points);
        $("#text_end_poi").on('input', this.draw_direction_points);
        $("#show_gps_data_btn").click(OptCheck.load_gps_data_left);
        $("#compute_type_select").change(OptCheck.check_osrm_connect);

        $("#read_poly_data_lbtn").click(OptCheck.load_gps_tempdata_left);

        $("#select_gps_simulation_data").change(OptCheck.simulation_select_change);

        this.init_tool_btns();
        this.get_point_from_screen();
        this.map1_id = this.config.map.values_.target;
        this.map2_id = this.config.map2.values_.target;
    }

    this.get_point_from_screen = function () {
        var _start = $("#btn_start_poi");
        _start.bind("click", OptCheck.getScreenCor1);
        var _end = $("#btn_end_poi");
        _end.bind("click", OptCheck.getScreenCor2);
    }

    this.gene_simulation_data = function () {
        var _start = $("#text_start_poi").val();
        var _end = $("#text_end_poi").val();
        var _source = $("#compute_type_select").find("option:selected").val();
        var _mode = $("#compute_mode_select").find("option:selected").val();
        var _url = OptCheck.config.simulation_url;
        var _geometries = "polyline";
        if (_start == "" || _end == "") {
            CommonTools.tip_alert_top("No Points Input.", 230, 5);
            return
        }
        $.ajax({
            type: "get",
            url: _url,
            dataType: "json",
            data: {
                "origin": _start,
                "destination": _end,
                "mode": _mode,
                "source": _source,
                "geometries": _geometries,
                "key": OptCheck.config.key
            },
            success: function (message) {
                if (message.status.toUpperCase() === "OK") {
                    CommonTools.tip_alert_top("Add Data Success.", 230, 5);
                } else {
                    CommonTools.tip_alert_top("Get Results Fail.", 230, 5);
                }
            },
            error: function (message) {
                CommonTools.tip_alert_top("Get Results Fail.", 230, 5);
                console.log("get es data error :" + JSON.stringify(message));
            }
        });
    }

    this.refresh_simulate_data_list = function () {
        var _start = $("#text_start_poi").val();
        var _end = $("#text_end_poi").val();
        var _source = $("#compute_type_select").find("option:selected").val();
        var _mode = "list";
        var _url = OptCheck.config.simulation_url;

        $.ajax({
            type: "get",
            url: _url,
            dataType: "json",
            data: {
                "mode": _mode,
                "key": OptCheck.config.key
            },
            success: function (message) {
                if (message.status.toUpperCase() === "OK") {
                    //CommonTools.tip_alert_top("Refresh Data Success.", 230, 5);
                    $("#select_gps_simulation_data").empty();
                    $("#select_gps_simulation_data").append('<option value="no_value">选择样例数据</option>');
                    for (var i = 0; i < message.results.length; i++) {
                        _temp = message.results[i];
                        _option = "<option value='" + _temp.si_id + "'>" + _temp.si_id + "</option>"
                        $("#select_gps_simulation_data").append(_option);
                    }

                } else {
                    CommonTools.tip_alert_top("Get Results Fail.", 230, 5);
                }
            },
            error: function (message) {
                CommonTools.tip_alert_top("Get Results Fail.", 230, 5);
                console.log("get es data error :" + JSON.stringify(message));
            }
        });
    }

    this.simulation_select_change = function () {
        var _source = $("#select_gps_simulation_data").find("option:selected").val();
        if (_source != "no_value") {
            $("#pika_data_id_input").val(_source);
        }
    }

    this.coculate_directions = function () {
        OptCheck.unbind_point_draw();
        var _start = $("#text_start_poi").val();
        var _end = $("#text_end_poi").val();
        var _source = $("#compute_type_select").find("option:selected").val();
        var _mode = $("#compute_mode_select").find("option:selected").val();
        var _url = OptCheck.config.direction_url;
        var _geometries = "polyline";
        var _key = OptCheck.config.key

        $.ajax({
            type: "get",
            url: _url,
            dataType: "json",
            data: {
                "origin": _start,
                "destination": _end,
                "mode": _mode,
                "source": _source,
                "geometries": _geometries,
                "key": _key
            },
            success: function (message) {
                if (message.status.toUpperCase() === "OK") {
                    if (_source === OptCheck.config.here_value + 1) {
                        var pointstr = message.points;
                        //0: "6.6017373,3.3329886"
                        var _geometrie = [];
                        var _geometrie2 = []
                        for (var i = 0; i < pointstr.length; i++) {
                            var point_arr = pointstr[i].split(',');
                            var temp = [parseFloat(point_arr[1]), parseFloat(point_arr[0])]
                            _geometrie[i] = temp;
                            _geometrie2[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
                        }
                        lineFeature = new ol.Feature({ //路线
                            geometry: new ol.geom.LineString(_geometrie2, 'XY'),
                        });
                        var _id = 0;
                        var _line_layer = OptCheck.layer_line_left;
                        var _point_layer = OptCheck.layer_point_left;
                        var distance_left = MapTools.getPointsDistanc(_geometrie);
                        var _target = $("#result_distance_label_right");
                        _line_layer = OptCheck.layer_line_right;
                        _point_layer = OptCheck.layer_point_right;
                        lineFeature.setStyle(OptCheck.linestylered);
                        OptCheck.clear_layer_line_right();
                        OptCheck.clear_layer_point_right();
                        _line_layer.getSource().addFeature(lineFeature);
                        _target.html("里程：" + distance_left.toFixed(1) + "m");
                        _geometrie.forEach(elm => {
                            var ft = new ol.Feature({
                                geometry: new ol.geom.Point(ol.proj.fromLonLat([elm[0], elm[1]]))
                            });
                            ft.setStyle(MapTools.createFeatureStyle_withname2(_id++ + ""));
                            _point_layer.getSource().addFeature(ft);
                        });
                        OptCheck.config.map.getView().setCenter(ol.extent.getCenter(lineFeature.getGeometry().getExtent()));

                    } else {
                        var pointstr = message.routes[0].overview_polyline.points
                        if (pointstr == null || pointstr == "") {
                            CommonTools.tip_alert_top("Get Results Fail.", 230, 5);
                            return
                        }
                        var _geometrie = Poly.decode(pointstr);
                        var _geometrie2 = []
                        for (var i = 0; i < _geometrie.length; i++) {
                            var temp = [_geometrie[i][1], _geometrie[i][0]]
                            _geometrie2[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
                        }
                        lineFeature = new ol.Feature({ //路线
                            geometry: new ol.geom.LineString(_geometrie2, 'XY'),
                        });
                        var _id = 0;
                        var _line_layer = OptCheck.layer_line_left;
                        var _point_layer = OptCheck.layer_point_left;
                        var distance_left = MapTools.getPointsDistanc(_geometrie);
                        var _target = $("#result_distance_label_left");
                        if (_source === OptCheck.config.opay_value || _source === OptCheck.config.here_value|| _source === OptCheck.config.bing_value) {
                            _target = $("#result_distance_label_right");
                            _line_layer = OptCheck.layer_line_right;
                            _point_layer = OptCheck.layer_point_right;
                            lineFeature.setStyle(OptCheck.linestylered);
                            OptCheck.clear_layer_line_right();
                            OptCheck.clear_layer_point_right();
                        } else {
                            _target = $("#result_distance_label_left");
                            lineFeature.setStyle(OptCheck.linestyle);
                            OptCheck.clear_layer_line_left();
                            OptCheck.clear_layer_point_left();
                        }
                        _line_layer.getSource().addFeature(lineFeature);
                        _target.html("里程：" + distance_left.toFixed(1) + "m");
                        _geometrie.forEach(elm => {
                            var ft = new ol.Feature({
                                geometry: new ol.geom.Point(ol.proj.fromLonLat([elm[1], elm[0]]))
                            });
                            ft.setStyle(MapTools.createFeatureStyle_withname2(_id++ + ""));
                            _point_layer.getSource().addFeature(ft);
                        });
                        OptCheck.config.map.getView().setCenter(ol.extent.getCenter(lineFeature.getGeometry().getExtent()));

                    }

                } else if (message.status === "FORBIDDEN") {
                    CommonTools.tip_alert_top("No Authority.", 230, 5);
                    return;
                } else {
                    CommonTools.tip_alert_top("Get Results Fail.", 230, 5);
                }
            },
            error: function (message) {
                CommonTools.tip_alert_top("Get Results Fail.", 230, 5);
                console.log("get es data error :" + JSON.stringify(message));
            }
        });
    }

    this.getScreenCor1 = function () {
        $("#" + OptCheck.config.map1id).unbind("click", OptCheck.getppoi2);
        $("#" + OptCheck.config.map1id).bind("click", OptCheck.getppoi1);
    }

    this.getScreenCor2 = function () {
        $("#" + OptCheck.config.map1id).unbind("click", OptCheck.getppoi1);
        $("#" + OptCheck.config.map1id).bind("click", OptCheck.getppoi2);
    }

    this.getppoi1 = function (e) {
        var t = ol.proj.transform(OptCheck.config.map.getEventCoordinate(e), 'EPSG:3857', 'EPSG:4326');
        var val = t[1].toFixed(6) + "," + t[0].toFixed(6)
        $("#text_start_poi").val(val);
        OptCheck.draw_direction_points();
    }

    this.getppoi2 = function (e) {
        var t = ol.proj.transform(OptCheck.config.map.getEventCoordinate(e), 'EPSG:3857', 'EPSG:4326');
        var val = t[1].toFixed(6) + "," + t[0].toFixed(6);
        $("#text_end_poi").val(val);
        OptCheck.draw_direction_points();
    }

    this.draw_direction_points = function () {
        OptCheck.clear_layer_point_direction_left();
        OptCheck.clear_layer_point_direction_right();
        var point_str_a = $("#text_start_poi").val().split(',');
        var point_str_b = $("#text_end_poi").val().split(',');
        //geometry: new Polygon(polyCoords),labelPoint: new Point(labelCoords),name: 'My Polygon'
        //feature.setGeometryName('labelPoint'); setId(id);getId();
        var points = [];
        if (OptCheck.trimSpace(point_str_a).length == 2) {
            var _lat1 = parseFloat(point_str_a[0]);
            var _lon1 = parseFloat(point_str_a[1]);
            if (_lat1 > -90.0 && _lat1 < 90.0 && _lon1 > -180.0 && _lon1 < 180.0) {
                points.push([_lon1, _lat1]);
                var _geometry = new ol.geom.Point(ol.proj.fromLonLat([_lon1, _lat1]));
                var ft = new ol.Feature({
                    geometry: _geometry
                });
                ft.setId("direction_A");
                ft.setStyle(MapTools.createFeatureStyle_with_png("./route/icon/A_map_pin_48px.png"));
                OptCheck.layer_point_direction_left.getSource().addFeature(ft);
                OptCheck.layer_point_direction_right.getSource().addFeature(ft);
            }
        }
        if (OptCheck.trimSpace(point_str_b).length == 2) {
            var _lat1 = parseFloat(point_str_b[0]);
            var _lon1 = parseFloat(point_str_b[1]);
            if (_lat1 > -90.0 && _lat1 < 90.0 && _lon1 > -180.0 && _lon1 < 180.0) {
                points.push([_lon1, _lat1]);
                var _geometry = new ol.geom.Point(ol.proj.fromLonLat([_lon1, _lat1]));
                var ft = new ol.Feature({
                    geometry: _geometry
                });
                ft.setId("direction_B");
                ft.setStyle(MapTools.createFeatureStyle_with_png("./route/icon/B_map_pin_48px.png"));
                OptCheck.layer_point_direction_left.getSource().addFeature(ft);
                OptCheck.layer_point_direction_right.getSource().addFeature(ft);
            }
        }
        if (points.length == 2) {
            MapTools.getMaxExtent_simple_point(OptCheck.config.map, points);
        }
    }

    this.trimSpace = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == " " || array[i] == null || typeof (array[i]) == "undefined") {
                array.splice(i, 1);
                i = i - 1;
            }
        }
        return array;
    }

    this.init_tool_btns = function () {
        for (var i = 0; i < CommonTools.btn_group.length; i++) {
            var func = eval(CommonTools.btn_group[i].func);
            var test_temp = new func();
            test_temp.init({
                params: {
                    e: test_temp,
                    self: this,
                    id: CommonTools.btn_group[i].id,
                    top: CommonTools.btn_group[i].top,
                    left: CommonTools.btn_group[i].left,
                    open_label: CommonTools.btn_group[i].open_label,
                    close_label: CommonTools.btn_group[i].close_label,
                    open_func: CommonTools.btn_group[i].open_func,
                    close_func: CommonTools.btn_group[i].close_func
                }
            });
        }
    }

    this.clear_layer_point_direction_left = function () {
        OptCheck.layer_point_direction_left.getSource().clear();
    }
    this.clear_layer_point_direction_right = function () {
        OptCheck.layer_point_direction_right.getSource().clear();
    }

    this.clear_layer_point_left = function () {
        OptCheck.layer_point_left.getSource().clear();
    }
    this.show_layer_point_left = function () {
        OptCheck.layer_point_left.setVisible(true);
    }
    this.hide_layer_point_left = function () {
        OptCheck.layer_point_left.setVisible(false);
    }

    this.clear_layer_line_left = function () {
        OptCheck.layer_line_left.getSource().clear();
        $("#result_distance_label_left").html("");
    }
    this.show_layer_line_left = function () {
        OptCheck.layer_line_left.setVisible(true);
    }
    this.hide_layer_line_left = function () {
        OptCheck.layer_line_left.setVisible(false);
    }
    this.show_layer_all_left = function () {
        OptCheck.show_layer_line_left();
        OptCheck.show_layer_point_left();
    }
    this.hide_layer_all_left = function () {
        OptCheck.hide_layer_line_left();
        OptCheck.hide_layer_point_left();
    }
    this.clear_layer_all_left = function () {
        OptCheck.clear_layer_point_left();
        OptCheck.clear_layer_line_left();
        OptCheck.clear_layer_point_direction_left();
        OptCheck.clear_layer_point_direction_right();
        OptCheck.unbind_point_draw();
        OptCheck.clear_point_input();
    }

    this.clear_point_input = function () {
        $("#text_start_poi").val("");
        $("#text_end_poi").val("");
    }

    this.clear_layer_point_right = function () {
        OptCheck.layer_point_right.getSource().clear();
    }
    this.show_layer_point_right = function () {
        OptCheck.layer_point_right.setVisible(true);
    }
    this.hide_layer_point_right = function () {
        OptCheck.layer_point_right.setVisible(false);
    }

    this.clear_layer_line_right = function () {
        OptCheck.layer_line_right.getSource().clear();
        OptCheck.layer_line_subsection_right.getSource().clear();
        $("#result_distance_label_right").html("");
        $("#result_score_label_right").html("");
    }
    this.clear_layer_line_subsection_right = function () {
        OptCheck.layer_line_subsection_right.getSource().clear();
    }
    this.show_layer_line_right = function () {
        OptCheck.layer_line_right.setVisible(true);
    }
    this.hide_layer_line_right = function () {
        OptCheck.layer_line_right.setVisible(false);
    }

    this.show_layer_line_subsection_right = function () {
        OptCheck.layer_line_subsection_right.setVisible(true);
    }
    this.hide_layer_line_subsection_right = function () {
        OptCheck.layer_line_subsection_right.setVisible(false);
    }

    this.show_layer_all_right = function () {
        OptCheck.show_layer_line_right();
        OptCheck.show_layer_point_right();
    }
    this.hide_layer_all_right = function () {
        OptCheck.hide_layer_line_right();
        OptCheck.hide_layer_point_right();
    }
    this.clear_layer_all_right = function () {
        OptCheck.clear_layer_point_right();
        OptCheck.clear_layer_line_right();
        OptCheck.clear_layer_point_direction_left();
        OptCheck.clear_layer_point_direction_right();
        OptCheck.unbind_point_draw();
    }

    this.unbind_point_draw = function () {
        $("#" + OptCheck.config.map1id).unbind("click", OptCheck.getppoi1);
        $("#" + OptCheck.config.map1id).unbind("click", OptCheck.getppoi2);
    }

    this.check_osrm_connect = function () {
        var _source = $("#compute_type_select").find("option:selected").val();
        if (_source === OptCheck.config.opay_value) {
            $.ajax({
                type: OptCheck.query_type,
                url: OptCheck.config.check_osrm_direction_url,
                timeout: OptCheck.config.timeout_test,
                dataType: OptCheck.request_dataType,
                success: function (message) {
                    var status1 = false;
                    var status2 = false;
                    if (message.status != null && message.status.toUpperCase() === "OK") {
                        status1 = true;
                    }
                    if (message.code != null && message.code.toUpperCase() === "OK") {
                        status2 = true;
                    }
                    if (status1 || status2) {
                        console.log("opay mode selected.");
                    } else {
                        OptCheck.opay_connect_fail();
                    }
                },
                complete: function (XMLHttpRequest, status) {
                    if (status == "timeout") {
                        OptCheck.opay_connect_fail();
                    }
                },
                error: function (message) {
                    //OptCheck.opay_connect_fail();
                }
            });
        }
    }

    this.opay_connect_fail = function () {
        CommonTools.tip_alert_top("OPay Connnect Unvailable.", 230, 5);
        //$("#compute_type_select option[value='" + OptCheck.config.google_value + "']").attr("selected", true);
        $("#compute_type_select").find("option").eq(0).prop("selected", true)
    }

    this.openGpsDataInputWindow = function (info) {
        var dialog = art.dialog({
            id: 'Padd00301',
            title: 'GPS Data Input',
            left: '20%',
            top: "50%",
            resize: false,
            init: function () {
            },
            close: function () {
            },
            button: [{
                name: OptCheck.config.window_submit,
                callback: function () {
                    OptCheck.gps_input_data_value = $("#gps_data_input_text").val();
                    if (OptCheck.gps_input_data_value != null && OptCheck.gps_input_data_value.trim() != "") {
                        $("#gps_data_input_btn").removeClass("btn-default").addClass("btn-success");
                    } else {
                        $("#gps_data_input_btn").removeClass("btn-success").addClass("btn-default");
                        OptCheck.gps_input_data_selected_value = "no_value";
                        //return false;gps_input_data_value==""时禁止关闭窗口
                    }
                },
                focus: true
            }, {
                name: OptCheck.config.window_cancel,
                focus: false
            }]
        });
        OptCheck.pop_add_gps_window = dialog;
        $.ajax({
            url: OptCheck.config.pop_add_gps_window_url,
            success: function (data) {
                OptCheck.pop_add_gps_window.content(data);
                if (OptCheck.gps_input_data_selected_value != "") {
                    $("#select_gps_test_data option[value='" + OptCheck.gps_input_data_selected_value + "']").attr("selected", "selected");
                    $("#gps_data_input_text").val(OptCheck.gps_input_data_value);
                }
                $("#select_gps_test_data").change(OptCheck.read_gps_testdata);

            },
            cache: false
        });
    }

    this.read_gps_testdata = function () {
        var _value = $("#select_gps_test_data").find("option:selected").val();
        if (_value != "no_value") {
            $.ajax({
                type: "get",
                url: OptCheck.config.gps_test_data_url + _value,
                dataType: "text",
                success: function (msg) {
                    if (true) {
                        //console.log("data get suc");
                        $("#gps_data_input_text").val(msg);
                        OptCheck.gps_input_data_value = $("#gps_data_input_text").val();
                        OptCheck.gps_input_data_selected_value = _value;
                    }
                },
                error: function (message) {
                    console.log("get data fail :" + JSON.stringify(message));
                }
            });
        } else {
            OptCheck.gps_input_data_value = $("#gps_data_input_text").val();
            OptCheck.gps_input_data_selected_value = "no_value";
        }
    }

    this.check_gps_input = function () {
        //OptCheck.gps_input_data_selected_value = "no_value"
        var msg = OptCheck.gps_input_data_value
        var points = []
        var point_arr = msg.split("\n");
        if (point_arr.length < 1) {
            return false;
        }
        for (var i = 0; i < point_arr.length; i++) {// 
            var chip_arr = point_arr[i].split(/["\\{}:,]/);
            chip_arr = chip_arr.filter(d => d);
            if (chip_arr.length < 3) {
                continue
            }
            var _lng_index = chip_arr.indexOf("lng");
            if (_lng_index == -1) {
                continue
            }
            var _lat_index = chip_arr.indexOf("lat");
            if (_lat_index == -1) {
                continue
            }
            var _time_index = chip_arr.indexOf("gps_time");
            if (_time_index == -1) {
                continue
            }
            var track_arr = [chip_arr[_lng_index + 1], chip_arr[_lat_index + 1], chip_arr[_time_index + 1]];
            var _lat = parseFloat(track_arr[1]);
            var _lon = parseFloat(track_arr[0]);
            if (_lat >= 90.0 || _lat <= -90.0 || _lon >= 180.0 || _lon <= -180.0) {
                return false;
            }
            var track_temp = {
                "lng": parseFloat(track_arr[0]),
                "lat": parseFloat(track_arr[1]),
            }
            points.push([track_temp.lng, track_temp.lat]);
        }
        if (points.length < 1) {
            return false;
        }
        return true;
    }

    this.load_gps_data_left = function () {
        var _rs = $('input[name="gps_data_input_radio"]:checked').val();
        switch (_rs) {
            case "txt_data":
                OptCheck.load_txt_data();
                break;
            case "pika_data":
                OptCheck.load_pika_data();
                break;
        }
    }

    this.load_txt_data = function () {
        if (OptCheck.gps_input_data_value == null || OptCheck.gps_input_data_value.trim() == "") {
            CommonTools.tip_alert_top("Null Data Input.", 230, 5);
            return;
        }
        if (OptCheck.check_gps_input()) {
            OptCheck.load_gps_point_left();
            OptCheck.load_gps_line_left(OptCheck.gps_input_data_geojson);
        } else {
            CommonTools.tip_alert_top("Abnormal Data Input.", 230, 5);
        }
    }

    this.load_gps_line_left = function (geojson_data) {
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

        var distance_left = MapTools.getPointsDistanc(_geometrie);
        $("#result_distance_label_left").html("里程：" + distance_left.toFixed(1) + "m");
    }

    this.load_gps_point_left = function () {
        var msg = OptCheck.gps_input_data_value
        var tracks = [];
        var points = []
        var point_arr = msg.split("\n");
        for (var i = 0; i < point_arr.length; i++) {// 
            var chip_arr = point_arr[i].split(/["\\{}:,]/);
            chip_arr = chip_arr.filter(d => d);
            if (chip_arr.length < 3) {
                continue
            }
            var _lng_index = chip_arr.indexOf("lng");
            if (_lng_index == -1) {
                continue
            }
            var _lat_index = chip_arr.indexOf("lat");
            if (_lat_index == -1) {
                continue
            }
            var _time_index = chip_arr.indexOf("gps_time");
            if (_time_index == -1) {
                continue
            }
            var _provider = chip_arr.indexOf("provider");
            if (_provider == -1) {
                continue
            }
            var track_arr = [chip_arr[_lng_index + 1], chip_arr[_lat_index + 1], chip_arr[_time_index + 1], chip_arr[_provider + 1]];
            var track_temp = {
                "id": i,
                "lng": parseFloat(track_arr[0]),
                "lat": parseFloat(track_arr[1]),
                "timestamp": parseInt(track_arr[2]),
                "provider": track_arr[3]
            }
            tracks.push(track_temp);
            points.push([track_temp.lng, track_temp.lat]);
        }
        OptCheck.gps_input_data_geojson.coordinates = points;
        OptCheck.clear_layer_point_left();
        tracks.forEach(elm => {
            var ft = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([elm.lng, elm.lat]))
            });
            ft.setStyle(MapTools.createFeatureStyle_withname2(elm.id + ":" + elm.timestamp));
            OptCheck.layer_point_left.getSource().addFeature(ft);
        });
        MapTools.getMaxExtent_simple_point(OptCheck.map, points);
    }

    this.get_tracks_str = function () {
        var tracks_str = '';
        if (OptCheck.gps_input_data_value != "") {
            var point_arr = OptCheck.gps_input_data_value.split("\n");
            tracks_str += '{"tracks":[';
            for (var i = 0; i < point_arr.length; i++) {// 
                var chip_arr = point_arr[i].split(/["\\{}:,]/);
                chip_arr = chip_arr.filter(d => d);
                var _lng_index = chip_arr.indexOf("lng");
                var _lat_index = chip_arr.indexOf("lat");
                var _time_index = chip_arr.indexOf("gps_time");
                var _provider = chip_arr.indexOf("provider");
                var track_arr = [chip_arr[_lng_index + 1], chip_arr[_lat_index + 1], chip_arr[_time_index + 1], chip_arr[_provider + 1]];
                if (i > 0) {
                    tracks_str += ','
                }
                tracks_str += '{"lng":' + track_arr[0] + ',"lat":' + track_arr[1] + ',"timestamp":' + track_arr[2] + ',"provider":"' + track_arr[3] + '"}'
            }
            tracks_str += ']}';
        }
        return tracks_str;
    }

    this.gps_input_data_value_pika = null;

    this.get_tracks_str_from_pika = function () {
        var tracks_str = '';
        if (OptCheck.gps_input_data_value_pika != null && OptCheck.gps_input_data_value_pika.total > 0) {
            tracks_str += '{"tracks":[';
            for (var i = 0; i < OptCheck.gps_input_data_value_pika.total; i++) {// 
                var _temp = OptCheck.gps_input_data_value_pika.results[i];
                var track_arr = [_temp.lng, _temp.lat, _temp.gps_time, _temp.provider];
                if (i > 0) {
                    tracks_str += ','
                }
                tracks_str += '{"lng":' + track_arr[0] + ',"lat":' + track_arr[1] + ',"timestamp":' + track_arr[2] + ',"provider":"' + track_arr[3] + '"}'
            }
            tracks_str += ']}';
        }
        return tracks_str;
    }

    this.optmize_compare = function () {
        var _url = OptCheck.config.optimize_compare_url;
        var _type = $("#compute_type_select").find("option:selected").val();
        _url += "?source=" + _type;
        //var _optimize = "rulefilter|snaptoroads|directions";
        var _optimize = "";
        $("input[name='compute_rulers_checkbox']:checked").each(function (index, item) {
            if ($("input[name='compute_rulers_checkbox']:checked").length - 1 == index) {
                _optimize += $(this).val();
            } else {
                _optimize += $(this).val() + "|";
            }
        });
        _url += "&optimize=" + _optimize;
        var _speed = $("#maxspeed_input").val();
        if (_speed >= 60 && _speed <= 100) {
            _url += "&maxspeed=" + _speed;
        }
        var _jumptimeinterval = $("#jumptimeinterval_input").val();
        if (_jumptimeinterval >= 30 && _jumptimeinterval <= 100) {
            _url += "&jumptimeinterval=" + _jumptimeinterval * 1000;
        }
        //_url += "&timeinterval=" + 10;
        var _mode = $("#compute_mode_select").find("option:selected").val();
        _url += "&mode=" + _mode;
        _key = OptCheck.config.key;

        _url += "&geometries=polyline&key=" + _key;
        var _rs = $('input[name="gps_data_input_radio"]:checked').val();
        switch (_rs) {
            case "txt_data":
                OptCheck.compulate_by_text(_url);
                break;
            case "pika_data":
                if (OptCheck.order_id != null) {
                    _url += "&order_id=" + OptCheck.order_id;
                }
                OptCheck.compulate_by_pika(_url);
                break;
        }
    }

    this.compulate_by_pika = function (_url) {
        if (OptCheck.gps_input_data_value != null) {
            $.ajax({
                type: OptCheck.update_type,
                url: _url,
                dataType: OptCheck.request_dataType,
                data: OptCheck.get_tracks_str_from_pika(),
                timeout: OptCheck.config.timeout_optimize,
                complete: function (XMLHttpRequest, status) {
                    if (status == "timeout") {
                        CommonTools.tip_alert_top("Connect Timeout,Try again.", 230, 5);
                    }
                },
                success: function (message) {
                    if (message.status === "OK") {
                        OptCheck.load_result_data_right(message);
                    } else if (message.status === "FORBIDDEN") {
                        CommonTools.tip_alert_top("No Authority.", 230, 5);
                        return;
                    }
                }
            });
        } else {
            CommonTools.tip_alert_top("No Pika Data Input.", 230, 5);
            return;
        }
    }

    this.compulate_by_text = function (_url) {
        if (OptCheck.gps_input_data_value != "") {
            $.ajax({
                type: OptCheck.update_type,
                url: _url,
                dataType: OptCheck.request_dataType,
                data: OptCheck.get_tracks_str(),
                timeout: OptCheck.config.timeout_optimize,
                complete: function (XMLHttpRequest, status) {
                    if (status == "timeout") {
                        CommonTools.tip_alert_top("Connect Timeout,Try again.", 230, 5);
                        return;
                    }
                },
                success: function (message) {
                    if (message.status === "OK") {
                        OptCheck.load_result_data_right(message);
                    } else if (message.status === "FORBIDDEN") {
                        CommonTools.tip_alert_top("No Authority.", 230, 5);
                        return;
                    }
                }
            });
        } else {
            CommonTools.tip_alert_top("No Data Input.", 230, 5);
            return;
        }
    }

    this.load_result_data_right = function (message) {
        OptCheck.load_result_point_right(message);
        OptCheck.load_result_line_right(message);
        OptCheck.load_result_line_subsection_right(message);
    }
    this.load_result_line_right = function (message) {
        var _source = $("#compute_type_select").find("option:selected").val();
        var pointstr = message.overview_polyline.points;
        if (pointstr == null || pointstr == "") {
            CommonTools.tip_alert_top("Get Results Fail.", 230, 5);
            return
        }
        var _geometrie = Poly.decode(pointstr);
        var _geometrie2 = []

        for (var i = 0; i < _geometrie.length; i++) {
            var temp = [_geometrie[i][1], _geometrie[i][0]]
            _geometrie2[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
        }

        lineFeature = new ol.Feature({
            geometry: new ol.geom.LineString(_geometrie2, 'XY'),
        });
        lineFeature.setStyle(OptCheck.linestyle);
        if (_source === OptCheck.config.opay_value) {
            lineFeature.setStyle(OptCheck.linestylered);
        }
        OptCheck.clear_layer_line_right();
        OptCheck.layer_line_right.getSource().addFeature(lineFeature);
        OptCheck.config.map2.getView().setCenter(ol.extent.getCenter(lineFeature.getGeometry().getExtent()));
        $("#result_distance_label_right").html("里程：" + message.distance.toFixed(1) + "m");
        $("#result_score_label_right").html("评分：" + message.score.toFixed(2) + "");
    }

    this.load_result_line_subsection_right = function (message) {
        var _section = message.sections;
        if (_section != null && _section.length > 0) {
            OptCheck.clear_layer_line_subsection_right();
            for (var i = 0; i < _section.length; i++) {
                var sec_temp = _section[i];
                var pointstr = sec_temp.polyline.points;
                var _geometrie = Poly.decode(pointstr);
                var _geometrie2 = []

                for (var j = 0; j < _geometrie.length; j++) {
                    var temp = [_geometrie[j][1], _geometrie[j][0]]
                    _geometrie2[j] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
                }
                lineFeature = new ol.Feature({
                    geometry: new ol.geom.LineString(_geometrie2, 'XY'),
                });
                var _index = i % CommonTools.line_colors.length;
                var _color = CommonTools.line_colors[_index].value;
                var _ruler = sec_temp.type;
                var _name = ""
                if (_ruler.indexOf("directions") != -1) {
                    _name = "directions"
                } else if (_ruler.indexOf("unknown") != -1) {
                    _name = "unknown";
                } else if (_ruler.indexOf("snaptoroads") != -1) {
                    _name = "snaptoroads";
                }
                lineFeature.setStyle(MapTools.linestyle_withname(_color, _name + i));
                OptCheck.layer_line_subsection_right.getSource().addFeature(lineFeature);
            }
        }
    }

    this.load_result_point_right = function (message) {
        OptCheck.clear_layer_point_right();
        var pointstr = message.overview_polyline.points
        if (pointstr == null || pointstr == "") {
            CommonTools.tip_alert_top("Get Results Fail.", 230, 5);
            return
        }
        var _geometrie = Poly.decode(pointstr);
        var _id = 0;

        _geometrie.forEach(elm => {
            var ft = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([elm[1], elm[0]]))
            });
            ft.setStyle(MapTools.createFeatureStyle_withname2(_id++ + ""));
            OptCheck.layer_point_right.getSource().addFeature(ft);
        });

        MapTools.getMaxExtent_simple_point(OptCheck.config.map2, _geometrie);
    }

    this.current_geo = {};

    this.load_poly_file = function () {
        var _value = "lagos";
        if (_value != "") {
            $.ajax({
                type: "get",
                url: OptCheck.config.poly_data_test_url + _value + ".poly",
                dataType: "text",
                success: function (msg) {
                    if (true) {
                        console.log("data get poly suc");
                        var lines_arr = msg.split("\n");
                        var points = [];
                        var _type = "";
                        if (lines_arr[0].trim() === "polygon") {
                            _type = "Polygon";
                        }
                        var _geo = {
                            "type": _type,
                            "coordinates": []
                        };
                        var single_arr = [];
                        for (var i = 0; i < lines_arr.length; i++) {// 
                            var chip_arr = lines_arr[i].trim().split(/\s+/);
                            chip_arr = chip_arr.filter(d => d);
                            if (chip_arr.length == 1) {
                                single_arr.push(chip_arr[0]);
                                // if(chip_arr[0].toUpperCase()==="END"){
                                //     break
                                // }
                            }
                        }
                        for (var i = 0; i < lines_arr.length; i++) {// 
                            var chip_arr = lines_arr[i].trim().split(/\s+/);
                            chip_arr = chip_arr.filter(d => d);
                            if (chip_arr.length == 2) {
                                var point = [chip_arr[0], chip_arr[1]];
                                points.push(point);
                            }
                        }
                        _geo.coordinates = points;
                        OptCheck.current_geo = _geo;
                        var polygon_size = single_arr[single_arr.indexOf("END") - 1];
                        var aa = 1;
                    }
                },
                error: function (message) {
                    console.log("get data fail :" + JSON.stringify(message));
                }
            });
        }
    }

    this.load_geojson_file = function () {
        //console.log("data get geojson suc");
        OptCheck.load_pika_data();
    }

    this.load_geojson_point_data = function (geojson_data) {
        OptCheck.clear_layer_point_left();
        var points = [];
        var i = 0;
        geojson_data.coordinates.forEach(elm => {
            var ft = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(elm))
            });
            points.push(elm);
            ft.setStyle(MapTools.createFeatureStyle_withname2(i + ""));
            OptCheck.layer_point_left.getSource().addFeature(ft);
            i++;
        });
        MapTools.getMaxExtent_simple_point(OptCheck.map, points);
    }

    this.load_geojson_line_data = function (geojson_data) {
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

        var distance_left = MapTools.getPointsDistanc(_geometrie);
        $("#result_distance_label_left").html("里程：" + distance_left.toFixed(1) + "m");
    }

    this.load_pika_data = function () {
        var _id = $("#pika_data_id_input").val().trim();
        if (_id == "") {
            CommonTools.tip_alert_top("Null PikaId Input.", 230, 5);
            return;
        }
        var pika_data = {
            data_id: _id,
            key: OptCheck.config.key,
            mode: ""
        };
        if ($('#local_pika_checkbox').is(':checked')) {
            pika_data.mode = "simu"
        }
        $.ajax({
            type: "post",
            url: OptCheck.config.pika_track_url,
            data: pika_data,
            dataType: "json",
            success: function (msg) {
                if (msg.status === "OK") {
                    var points = [];
                    var _type = "LineString";
                    var _geo = {
                        "type": _type,
                        "coordinates": []
                    };
                    if (msg.total < 1) {
                        return
                    }
                    for (var i = 0; i < msg.total; i++) {
                        points.push([msg.results[i].lng, msg.results[i].lat]);
                    }
                    _geo.coordinates = points;
                    OptCheck.current_geo = _geo;
                    OptCheck.load_geojson_line_data(_geo);
                    OptCheck.clear_layer_point_left();
                    var points = [];
                    var i = 0;
                    msg.results.forEach(elm => {
                        var ft = new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.fromLonLat([elm.lng, elm.lat]))
                        });
                        points.push([elm.lng, elm.lat]);
                        ft.setStyle(MapTools.createFeatureStyle_withname2(i + ":" + elm.timestamp));
                        OptCheck.layer_point_left.getSource().addFeature(ft);
                        i++;
                    });
                    MapTools.getMaxExtent_simple_point(OptCheck.map, points);
                    OptCheck.gps_input_data_value_pika = msg;
                    OptCheck.order_id = _id;
                } else {
                    OptCheck.order_id = null;
                }
            },
            error: function (message) {
                OptCheck.order_id = null;
                console.log("get data fail :" + JSON.stringify(message));
            }
        });
    }
    //
    //read_poly_data_lbtn
    //read_poly_data_rbtn
    //read_poly_tempdata_btn
    this.openTempGpsDataInputWindow = function (info) {
        var dialog = art.dialog({
            id: 'Padd00302',
            title: 'GPS Temp Data Input',
            left: '20%',
            top: "30%",
            height: 350,
            resize: false,
            init: function () {
            },
            close: function () {
            },
            button: [{
                name: OptCheck.config.window_submit,
                callback: function () {
                    OptCheck.gps_input_tempdata_value = $("#gps_temp_data_input_text").val();
                    if (OptCheck.gps_input_tempdata_value != null && OptCheck.gps_input_tempdata_value.trim() != "") {
                        $("#read_poly_tempdata_btn").removeClass("btn-default").addClass("btn-success");
                    } else {
                        $("#read_poly_tempdata_btn").removeClass("btn-success").addClass("btn-default");
                        OptCheck.gps_input_tempdata_selected_value = "no_value";
                        //return false;gps_input_data_value==""时禁止关闭窗口
                    }
                },
                focus: true
            }, {
                name: OptCheck.config.window_cancel,
                focus: false
            }]
        });
        OptCheck.pop_add_tempgps_window = dialog;
        $.ajax({
            url: OptCheck.config.pop_add_tempgps_window_url,
            success: function (data) {
                OptCheck.pop_add_tempgps_window.content(data);
                if (OptCheck.gps_input_tempdata_selected_value != "") {
                    $("#select_gps_temp_data option[value='" + OptCheck.gps_input_tempdata_selected_value + "']").attr("selected", "selected");
                    $("#gps_temp_data_input_text").val(OptCheck.gps_input_tempdata_value);
                }
                $("#select_gps_temp_data").change(OptCheck.read_gps_testdata);

            },
            cache: false
        });
    }

    this.load_gps_tempdata_left = function () {
        var msg = OptCheck.gps_input_tempdata_value
        var _source = $("#load_data_type_select").find("option:selected").val();
        if (_source === "curly") {
            var gps_obj = $.parseJSON(msg)
            var tracks = [];
            var points = [];
            var point_arr = gps_obj.points;
            for (var i = 0; i < point_arr.length; i++) {// 
                var point_temp = point_arr[i];
                //{"location":{"lat":6.6020733,"lng":3.3030817},"timestamp":1578876606,"provide":"gps"}
                var track_temp = {
                    "id": i,
                    "lng": point_temp.location.lng,
                    "lat": point_temp.location.lat,
                    "timestamp": point_temp.timestamp,
                    "provider": point_temp.provide
                }
                tracks.push(track_temp);
                points.push([track_temp.lng, track_temp.lat]);
            }
            OptCheck.gps_input_data_geojson.coordinates = points;
            OptCheck.clear_layer_point_left();
            tracks.forEach(elm => {
                var ft = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([elm.lng, elm.lat]))
                });
                ft.setStyle(MapTools.createFeatureStyle_withname2(elm.id + ":" + elm.timestamp));
                OptCheck.layer_point_left.getSource().addFeature(ft);
            });
            MapTools.getMaxExtent_simple_point(OptCheck.map, points);

            OptCheck.load_gps_line_left(OptCheck.gps_input_data_geojson);

        } else if (_source === "square") {
            var gps_obj = $.parseJSON(msg)
            var tracks = [];
            var points = [];
            for (var i = 0; i < gps_obj.length; i++) {// 
                var point_temp = gps_obj[i];
                var track_temp = {
                    "id": i,
                    "lng": point_temp[1],
                    "lat": point_temp[0]
                }
                tracks.push(track_temp);
                points.push([track_temp.lng, track_temp.lat]);
            }
            OptCheck.gps_input_data_geojson.coordinates = points;
            OptCheck.clear_layer_point_left();
            tracks.forEach(elm => {
                var ft = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([elm.lng, elm.lat]))
                });
                ft.setStyle(MapTools.createFeatureStyle_withname2(elm.id+""));
                OptCheck.layer_point_left.getSource().addFeature(ft);
            });
            MapTools.getMaxExtent_simple_point(OptCheck.map, points);
            OptCheck.load_gps_line_left(OptCheck.gps_input_data_geojson);
        } else if (_source === "angle") {
            var tracks = [];
            var points = [];
            var point_arr = msg.split("points:");
            for (var i = 0; i < point_arr.length; i++) {// 
                var chip_arr = point_arr[i].split(/[<>: ]/);
                chip_arr = chip_arr.filter(d => d);
                var _lng_index = chip_arr.indexOf("lng");
                if (_lng_index == -1) {
                    continue
                }
                var _lat_index = chip_arr.indexOf("lat");
                if (_lat_index == -1) {
                    continue
                }
                var track_arr = [chip_arr[_lng_index + 1], chip_arr[_lat_index + 1]];
                var track_temp = {
                    "id": i,
                    "lng": parseFloat(track_arr[0]),
                    "lat": parseFloat(track_arr[1])
                }
                tracks.push(track_temp);
                points.push([track_temp.lng, track_temp.lat]);
            }
            OptCheck.gps_input_data_geojson.coordinates = points;
            OptCheck.clear_layer_point_left();
            tracks.forEach(elm => {
                var ft = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([elm.lng, elm.lat]))
                });
                ft.setStyle(MapTools.createFeatureStyle_withname2(elm.id+""));
                OptCheck.layer_point_left.getSource().addFeature(ft);
            });
            MapTools.getMaxExtent_simple_point(OptCheck.map, points);

            OptCheck.load_gps_line_left(OptCheck.gps_input_data_geojson);
        } else if (_source === "code") {
            //var test="cjng@sdnSQ|B??fGKjPgBfAKp@BxARh@RbFfCvHpDnBr@x@DhEWdZyBnBI~@Kz@U~@a@hDoBf@Ub@WtFiC??rAHdAt@rCdB|EtBdGvCjAv@vBlBz@fAp@`AtD~GXj@\\pA??AH@LT\\HDRBr@n@|@~@hAvA??"
            var point_arr = Poly.decode(msg.trim());
            var tracks = [];
            var points = [];
            for (var i = 0; i < point_arr.length; i++) {
                var point_temp = point_arr[i];
                var track_temp = {
                    "id": i,
                    "lng": point_temp[1],
                    "lat": point_temp[0]
                }
                tracks.push(track_temp);
                points.push([track_temp.lng, track_temp.lat]);
            }
            OptCheck.gps_input_data_geojson.coordinates = points;
            OptCheck.clear_layer_point_left();
            tracks.forEach(elm => {
                var ft = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([elm.lng, elm.lat]))
                });
                ft.setStyle(MapTools.createFeatureStyle_withname2(elm.id+""));
                OptCheck.layer_point_left.getSource().addFeature(ft);
            });
            MapTools.getMaxExtent_simple_point(OptCheck.map, points);
            OptCheck.load_gps_line_left(OptCheck.gps_input_data_geojson);
        }

    }

}