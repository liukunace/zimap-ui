/**
 * SuggestSearchBox（Map Suggest SearchBox）
 * @type {SuggestSearchBox}
 * @data：2019-10-23
 * @author：lewk
 * @use SearchComp.xxx(params);
 */

SearchComp = new SuggestSearchBox();
function SuggestSearchBox() {
    this._last_name = "";
    this.select_poi_id = "";
    this.search_text_first_change = true;
    this.search_btn_first_change = true;
    this.search_btn_effect = null;
    this.search_auto_input_text = "";
    this.config = {
        query_feature_style_font: "normal 16px 微软雅黑",
        xxx1_label: "xxx1",
        xxx2_label: "xxx2",
    }
    this.xxxshow = function () {
        $(".searchtiplist_lev3_suggestions").show();
        $(".searchtiplist_panel_lev2_search").css("border-radius", "8px 8px 0 0");
        PoisBz.closeQueryAddWindow();
    }
    this.xxxhide = function () {
        $(".searchtiplist_lev3_suggestions").hide();
        $(".searchtiplist_panel_lev2_search").css("border-radius", "8px 8px 8px 8px");
        PoisBz.closeQueryAddWindow();
    }
    this.init = function (obj) {
        $.extend(this.config, obj.params);
        var _left = this.config.left ? this.config.left : 100;
        var _top = this.config.top ? this.config.top : 20;
        var _div_lev1 = $("#searchtiplist_panel_lev1_main");
        _div_lev1.html("");
        _div_lev1.addClass("searchtiplist_panel_lev1_main");
        _div_lev1.css("left", _left + "px");
        _div_lev1.css("top", _top + "px");
        var _lev1_str = '<div id="searchtiplist_panel_lev2_search" class="searchtiplist_panel_lev2_search"></div>' +
            '<div id="searchtiplist_panel_lev2_list">' +
            '<div class="searchtiplist_lev3_suggestions" id="searchtiplist_lev3_suggestions"> </div>' +
            '</div>';
        _div_lev1.html(_lev1_str);
        var _div_lev2_search = $("#searchtiplist_panel_lev2_search");
        _div_lev2_search.html("");
        var _lev2_search_str = '<div class="searchtiplist_lev3h searchtiplist_lev3_menu_div hei_full">' +
            '<button class="searchtiplist_lev4_menu_btn hei_full search_comp_base"></button>' +
            '</div>' +
            '<div class="searchtiplist_lev3h searchtiplist_lev3_searchinput">' +
            '<input type="text" class="searchtiplist_lev4_text search_comp_base" placeholder="Query By ES Service"/>' +
            '</div>' +
            '<div class="searchtiplist_lev3h searchtiplist_lev3_searchbutton">' +
            '<button id="searchtiplist_lev4_btn_search" class="searchtiplist_lev4_btn_search search_comp_base"></button>' +
            '</div>' +
            '<div class="searchtiplist_lev3h searchtiplist_lev3_span">' +
            '<span class="searchtiplist_lev4_span"></span>' +
            '</div>' +
            '<div class="searchtiplist_lev3h searchtiplist_lev3_div_change">' +
            '<button id="searchtiplist_lev4_btn" class="searchtiplist_lev4_btn_change search_comp_base"></button>' +
            '</div>';
        _div_lev2_search.html(_lev2_search_str);
        this.xxxhide();
        $(".searchtiplist_lev4_text").bind('input propertychange', function (event) {
            SearchComp.getPoisDatalist();
            if (SearchComp.search_text_first_change) {
                Switchers.init();
                SearchComp.search_text_first_change = false;
            }
            if ($(".searchtiplist_lev4_text").val() === "") {
                SearchComp.searchbox_clear();
            }
            var _cur_val = SearchComp.trim($(".searchtiplist_lev4_text").val());
            if (_cur_val != "") {
                //console.log(_cur_val);
                var _target_btn = $("#searchtiplist_lev4_btn");
                if (SearchComp.search_btn_first_change) {
                    SearchComp.searchbox_show();
                    _target_btn.bind("click", SearchComp.searchbox_clear_once);
                    SearchComp.search_btn_first_change = false;
                }
                Switchers.searchbox_logo_state.currState = Switchers.searchbox_state_value.clearup;
            }
        })
    }
    this.searchbox_clear_once = function () {
        SearchComp.xxxhide();
        $(".searchtiplist_lev4_text").val("");
        $("#searchtiplist_lev4_btn").css("background", "url(./business/img/directions-1x-20150909.png) no-repeat 1px 1px/20px");
        $("#searchtiplist_lev4_btn").unbind("click", SearchComp.searchbox_clear_once);
    }
    this.searchbox_clear = function () {
        SearchComp.xxxhide();
        $(".searchtiplist_lev4_text").val("");
        $("#searchtiplist_lev4_btn").css("background", "url(./business/img/directions-1x-20150909.png) no-repeat 1px 1px/20px");
    }
    this.searchbox_show = function () {
        $("#searchtiplist_lev4_btn").css("background", "url(./business/img/clear.png) no-repeat 36% 39%");
        $("#searchtiplist_lev4_btn").css("background-size", "500%");
    }
    this.getPoisDatalist = function () {
        var input_tar = $(".searchtiplist_lev4_text");
        var _cur_val = this.trim(input_tar.val());
        if (SearchComp._last_name === _cur_val || _cur_val === "") {
            return
        }
        var _name = this.trim(input_tar.val());
        SearchComp._last_name = _name;
        var _div = $("#searchtiplist_lev3_suggestions");
        var location;
        var _lonlat = MapTools.getMapCenter();
        location = _lonlat[0] + "," + _lonlat[1];
        $.ajax({
            type: ESQuery.query_type,
            url: ESQuery.config.poi_query_url_autocomplete,
            dataType: ESQuery.request_dataType,
            data: {
                "input": _name,
                "location": location,
                "key": PoisBz.config.key
            },
            success: function (message) {
                if (message.results && message.results.length > 0) {
                    var poi_list = message.results;
                    _div.html("");
                    var _str = '<ul id="ul_test1" class="searchtiplist_lev4_ul search_comp_base" >';
                    for (var i = 0; i < poi_list.length; i++) {
                        var _tempstr = '<li id="' + poi_list[i].place_id + '" title="' + poi_list[i].name_en + '">' +
                            '<div class="suggest">' +
                            '<div class="div_cont_h">' +
                            '<div class="suggest_place_pin"></div>' +
                            '<span>' + SearchComp.cutString(poi_list[i].name_en, 43) + '</span>' +
                            '<span></span>' +
                            '</div>' +
                            '</div>' +
                            '</li>';
                        _str += _tempstr;
                    }
                    _str += '</ul>';
                    _div.html(_str);
                    SearchComp.xxxshow();
                    $(".searchtiplist_lev4_text").keyup(function (event) {
                        if (event.keyCode <= "48" || event.keyCode >= "105") {
                            if (event.keyCode != 8 && event.keyCode != 46)
                                return
                        } else if (_cur_val === "") {
                            SearchComp.xxxhide();
                        }
                        if (SearchComp.trim(input_tar.val()) != "") {
                            SearchComp.xxxshow();
                        } else {
                            SearchComp.xxxhide();
                        }
                    })
                    $(".searchtiplist_lev4_ul>li").each(function (i, o) {
                        $(this).click(function (e) {
                            var _text_temp = this.innerText;
                            SearchComp.select_poi_id = this.id;
                            var _temp_text_mini = SearchComp.cutString(_text_temp, 30);
                            //_text_temp has ...ed
                            if (_temp_text_mini.indexOf("...") != -1) {
                                SearchComp.search_auto_input_text = this.title;
                            } else {
                                SearchComp.search_auto_input_text = "";
                            }
                            $(".searchtiplist_lev4_text").val(_temp_text_mini);
                            SearchComp.xxxhide();
                            ESQuery.query_es_details();
                        });
                    });
                } else {
                    console.log("data query none");
                    _div.html("");
                    SearchComp.xxxhide();
                }
            },
            error: function (message) {
                console.log("get es data error :" + JSON.stringify(message));
            }
        });
    }

    this.trim = function (s) {
        return this.trimLeft(this.trimRight(s));
    }
    this.trimLeft = function (s) {
        if (s == null) {
            return "";
        }
        var whitespace = new String(" \t\n\r");//space in " \t\n\r" is needed
        var str = new String(s);
        if (whitespace.indexOf(str.charAt(0)) != -1) {
            var j = 0, i = str.length;
            while (j < i && whitespace.indexOf(str.charAt(j)) != -1) {
                j++;
            }
            str = str.substring(j, i);
        }
        return str;
    }
    this.trimRight = function (s) {
        if (s == null) return "";
        var whitespace = new String(" \t\n\r");//space in " \t\n\r" is needed
        var str = new String(s);
        if (whitespace.indexOf(str.charAt(str.length - 1)) != -1) {
            var i = str.length - 1;
            while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1) {
                i--;
            }
            str = str.substring(0, i + 1);
        }
        return str;
    }
    this.cutString = function (str, len) {
        if (str.length * 2 <= len) {
            return str;
        }
        var strlen = 0;
        var s = "";
        for (var i = 0; i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if (strlen >= len) {
                    return s.substring(0, s.length - 1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {
                    return s.substring(0, s.length - 2) + "...";
                }
            }
        }
        return s;
    }
    this.repalce_part_from_mian = function () {
        // <div id="query_es_div" style="position: absolute;top:10px;left:100px;z-index:998; ">
        //     <input type="text" id="query_es_name" placeholder="Input Keyworks for Your Search ..." class="query_es_name_input"
        //       size="50">
        //     <button id="query_es_button" class="query_es_button">Search</button>
        // </div>
    }

}