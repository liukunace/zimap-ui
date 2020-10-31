
Switchers = new SwitcherGroup();
function SwitcherGroup() {
    this.logo_state1 = "claer_up";
    this.init = function () {
        new Switchers.searchbox_logo_state().init();
    }
    this.searchbox_logo_state = function () { }
    this.searchbox_logo_state.prototype.init = function () {
        Switchers.searchbox_logo_state.currState = Switchers.searchbox_state_value.novalue;
        Switchers.searchbox_logo_state.target = $("#searchtiplist_lev4_btn");
        Switchers.searchbox_logo_state.target.on("click", function () {
            if (Switchers.searchbox_logo_state.currState == Switchers.searchbox_state_value.novalue) {
                Switchers.searchbox_logo_state_trigger();
                $(".searchtiplist_lev4_text").val("");
                SearchComp.xxxhide();
            }
        });
        $(".searchtiplist_lev4_text").bind('input propertychange', function (event) {
            var _cur_val = SearchComp.trim($(".searchtiplist_lev4_text").val());
            var _code = event.keyCode;
            if (_cur_val != "" && _code != "32") {
                Switchers.searchbox_logo_state_trigger();
            }
            if($(".searchtiplist_lev4_text").val()==="" && Switchers.searchbox_logo_state.currState == Switchers.searchbox_state_value.novalue){
                Switchers.searchbox_logo_state_trigger();
            }
        });
    }
    this.searchbox_logo_state_trigger = function () {
        Switchers.searchbox_logo_state.currState.state_change.call(Switchers.searchbox_logo_state);
    }
    this.searchbox_state_value = {
        novalue: {
            name: "no_value",
            state_change: function () {
                var _cur_val = SearchComp.trim($(".searchtiplist_lev4_text").val());
                if (true) {
                    Switchers.searchbox_logo_state.currState = Switchers.searchbox_state_value.clearup;
                    Switchers.searchbox_logo_state.target.css("background", "url(./business/img/directions-1x-20150909.png) no-repeat 1px 1px/20px");
                    PoisBz.closeQueryAddWindow();
                    //console.log("from no_value");
                }
            }
        },
        holdon: {
            name: "hold_on",
            state_change: function () {
                Switchers.searchbox_logo_state.currState = Switchers.searchbox_state_value.show;
            }
        },
        clearup: {
            name: "clear_up",
            state_change: function () {
                Switchers.searchbox_logo_state.currState = Switchers.searchbox_state_value.novalue;
                Switchers.searchbox_logo_state.target.css("background", "url(./business/img/clear.png) no-repeat 36% 39%");
                Switchers.searchbox_logo_state.target.css("background-size", "500%");
                PoisBz.closeQueryAddWindow();
                //console.log("from clear_up");
            }
        }
    }

}