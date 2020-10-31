
/**
 * CommonTools（JS Basic Functions）
 * @type {CommonTools}
 * @data：2019-10-12
 * @author：lewk
 * @use CommonTools.xxx(params);
 */

CommonTools = new CommonTools();
function CommonTools() {
    this.map1="map_1";
    this.map2="map_2";
    this.checkName = function (input) {
        if (input.val() === '') {
            input.focus();
            $(".name_input_star").css("color", "red");
            return false;
        } else {
            $(".name_input_star").css("color", "black");
            return true;
        };
    }
    this.checkType = function (input) {
        if (input.select2("val") === null) {
            input.focus();
            $(".types_input_star").css("color", "red");
            return false;
        } else {
            $(".types_input_star").css("color", "black");
            return true;
        };
    }
    this.getIconByTypeName = function (name) {
        for (var i = 0; i < pois_types.length; i++) {
            if (pois_types[i].name === name) {
                return pois_types[i].src;
            }
        }
        return null;
    }
    this.getTypeByTypeValue = function (value) {
        for (var i = 0; i < pois_types.length; i++) {
            if (pois_types[i].value === value) {
                return pois_types[i];
            }
        }
        return null;
    }
    this.getFirstType = function (_types) {
        var _types_arr = _types.split(/{|,|}/);
        _types_arr = this.ArrayUniqueAddClearNull(_types_arr);
        if (_types_arr.length > 0) {
            return _types_arr[0];
        }
    }
    this.ArrayUniqueAddClearNull = function (arr) {
        return this.UniqueArr(this.ClearNullArr(arr));
    }
    this.ClearNullArr = function (arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (!arr[i] || arr[i] == '' || arr[i] === undefined) {
                arr.splice(i, 1);
                len--;
                i--;
            }
        }
        return arr;
    }
    this.UniqueArr = function (arr) {
        var hash = [];
        for (var i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) == -1) {
                hash.push(arr[i]);
            }
        }
        return hash;
    }
    this.sortNumber = function (a, b) {
        //a,b表示数组中的任意两个元素，若return > 0 b前a后；reutrn < 0 a前b后；a=b时存在浏览器兼容
        return a - b //升序
    }
    this.GetLength = function (str) {
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    }
    this.tip_alert_top = function (text, _width, _tpye, _time) {
        _width = _width ? _width : 300;
        _tpye = _tpye ? _tpye : 5;
        _time = _time ? _time : 1000;
        layer.msg(text, {
            offset: 't',
            area: [_width + 'px', '50px'],
            anim: _tpye,//5=闪现；6=晃动
            time: _time,
        });
    }

    this.line_colors = [
        {
            id: "fill_color_001",
            name_en: "Red",
            name_cn: "红色",
            value: "#FF0000"
        },
        {
            id: "fill_color_002",
            name_en: "Orange",
            name_cn: "橙色",
            value: "#FF7F00"
        },
        {
            id: "fill_color_003",
            name_en: "Yellow",
            name_cn: "黄色",
            value: "#FFFF00"
        },
        {
            id: "fill_color_004",
            name_en: "Green",
            name_cn: "绿色",
            value: "#00FF00"
        },
        {
            id: "fill_color_005",
            name_en: "Cyan",
            name_cn: "青色",
            value: "#00FFFF"
        },
        {
            id: "fill_color_006",
            name_en: "Blue",
            name_cn: "蓝色",
            value: "#0000FF"
        },
        {
            id: "fill_color_006",
            name_en: "Purple",
            name_cn: "紫色",
            value: "#9932CD"
        },
        {
            id: "fill_color_006",
            name_en: "Black",
            name_cn: "黑色",
            value: "#000000"
        },
        {
            id: "fill_color_006",
            name_en: "White",
            name_cn: "白色",
            value: "#FFFFFF"
        }
    ];

    this.btn_group = [
        {
            func: "SwitcherBase02",
            id: this.map1,
            top: 10,
            left: 200,
            open_label: "显示点",
            close_label: "隐藏点",
            open_func: OptCheck.show_layer_point_left,
            close_func: OptCheck.hide_layer_point_left
        }, {
            func: "SwitcherBase02",
            id: this.map1,
            top: 10,
            left: 280,
            open_label: "显示线",
            close_label: "隐藏线",
            open_func: OptCheck.show_layer_line_left,
            close_func: OptCheck.hide_layer_line_left
        }, {
            func: "SwitcherBase03",
            id: this.map1,
            top: 10,
            left: 360,
            open_label: "全显示",
            close_label: "清除",
            open_func: OptCheck.show_layer_all_left,
            close_func: OptCheck.clear_layer_all_left
        }, {
            func: "SwitcherBase02",
            id: this.map2,
            top: 10,
            left: 200,
            open_label: "显示点",
            close_label: "隐藏点",
            open_func: OptCheck.show_layer_point_right,
            close_func: OptCheck.hide_layer_point_right
        }, {
            func: "SwitcherBase02",
            id: this.map2,
            top: 10,
            left: 280,
            open_label: "显示线",
            close_label: "隐藏线",
            open_func: OptCheck.show_layer_line_right,
            close_func: OptCheck.hide_layer_line_right
        }, {
            func: "SwitcherBase02",
            id: this.map2,
            top: 10,
            left: 360,
            open_label: "显示分段",
            close_label: "隐藏分段",
            open_func: OptCheck.show_layer_line_subsection_right,
            close_func: OptCheck.hide_layer_line_subsection_right
        }, {
            func: "SwitcherBase03",
            id: this.map2,
            top: 10,
            left: 456,
            open_label: "全显示",
            close_label: "清除",
            open_func: OptCheck.show_layer_all_right,
            close_func: OptCheck.clear_layer_all_right
        }
    ];
}