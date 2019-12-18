import Action from "./action";
import { GLOBAL_CONFIG, ELEMENT } from "./global/config.js";

let $ = require("jquery");

let FORM = {
  clearColorPicker: color => {
    $(".color-picker")
      .find("a")
      .removeClass("on");
    $(".color-picker")
      .find("." + color)
      .addClass("on");
  },
  createColorPicker: () => {
    return `<wafflepen class='hlt-wafflepen-toolbox' style='display:none; !important;' id='highlight-toolbar'>
                       <wafflepen class='wafflepen-toolbox waf-inlineFlex'>
                          <wafflepen-ul class='wafflepen-color-picker'>
                              <a href='javascript:void(0)' class='hltcolor-1' id="color-1"></a>
                              <a href='javascript:void(0)' class='hltcolor-2' id="color-2"></a>
                              <a href='javascript:void(0)' class='hltcolor-3' id="color-3"></a>
                              <a href='javascript:void(0)' class='hltcolor-4' id="color-4"></a>
                              <a href='javascript:void(0)' class='hltcolor-5' id="color-5"></a>
                              <a href='javascript:void(0)' class='hltcolor-6' id="color-6"></a>
                          </wafflepen-ul>
                          <wafflepen class='tool-list'>
                              <a href='javascript:void(0);' class='hlt-btn write waf-inlineBlock' id='insertMemoBtn'></a>
                              <!-- wafflepen-li><wafflepen class='hlt-btn trash waf-inlineBlock' id='deleteHighlightBtn'></wafflepen></wafflepen-li -->
                          </wafflepen>
                      </wafflepen>
                      <wafflepen class='wafflepen-writebox' style='display:none; !important' id='highlight-toolbar-memo-area'>
                          <textarea name='' class='rspen-txtarea' placeholder='Memo' id='highlightMemoArea' ></textarea>
                          <wafflepen class='writebox-submit'>
                              <wafflepen class='write-date'><wafflepen class='wdate'> </wafflepen> </wafflepen>
                              <wafflepen class='save-btn' id='highlightMemoRegistBtn' >Save</wafflepen>
                          </wafflepen>
                      </wafflepen>
                  </wafflepen>`;
  },
  hidePicker: () => {
    //$(".wafflepen-color-picker").find("a").removeClass("on");

    $("#highlightMemoArea").val("");
    $("#highlightDeleteBtn").hide();
    $("#editArea").hide();
    $("#highlight-toolbar").hide();
  },
  showPicker: e => {
    // 초기화
    $(".wafflepen-color-picker")
      .find("a")
      .removeClass("on");
    FORM.hidePicker();

    let s = window.getSelection();
    let oRange = s.getRangeAt(0); // get the text range
    let oRect = oRange.getBoundingClientRect();

    $("#highlight-toolbar").css({
      top: e.pageY + 10,
      left: e.pageX,
      position: "absolute",
      width: "auto"
    });

    /* $("#highlight-toolbar").css({
            top: GLOBAL_CONFIG.MOUSE_DOWN_XY.y,
            left: GLOBAL_CONFIG.MOUSE_DOWN_XY.x,
            position: "absolute",
            width: "auto"
        });*/

    setTimeout(function() {
      // Drag 영역이 없으면 false 리턴한다.
      if (s.isCollapsed) return false;

      $("#highlight-toolbar-memo-area").hide();
      $("#highlight-toolbar").show();
      GLOBAL_CONFIG.CURRENT_MOUSE_STATUS = "drag";
    }, 100);

    return true;
  }
};
export default FORM;

/**
 * //팔레트 버튼
 colorPickerBtnEvent: function () {
        $('#highlight-toolbar').find('.wafflepen-color-picker a').each(function (idx, item) {

            $(item).unbind('click').on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();

                //로그인 되어있지 않다면 위젯을 열어준다.
                if (!HighlightData.isLogin) {
                    HlLayerAction.loginCheckLayer();
                    return false;
                }

                var _this = this;
                //이미 선택되어진 컬러의 경우..
                if ($(_this).hasClass('on')) {
                    //하이라이팅을 삭제
                    var msg = Message.DeleteHighlighting[LANG];
                    if ($('#highlightMemoArea').val() != '') {
                        msg = Message.DeleteHighlightingWithMemo[LANG];
                    }

                    var confirmYN = confirm(msg);

                    if (confirmYN) {
                        highlightAjaxListener.deleteItem(HighlightData.currentIdx).then(function (res) {
                            if (res.status == 0) {
                                execute.deleteItem(res);
                                //Fail된 하이라이팅에서 삭제한다.

} else {
    alert(Message.DeleteHighlightingFail[LANG]);
}
});
}

return false;
}

var color = $(_this).attr('class'); //hltcolor-x 값을 가져옴
var colorTF = false;

$('#highlight-toolbar').find('.wafflepen-color-picker a').each(function (idx, item) {
    if ($(item).hasClass('on')) {
        colorTF = true;
    }
}).promise().then(function () {

    //저장한다.
    if (colorTF) {
        //클릭할 경우 수정
        var memo = $.trim($('#highlightMemoArea').val());
        var idx = HighlightData.currentIdx;

        if (HighlightData.currentFlag == 'block') {
            highlightAjaxListener.updateBlock(idx, color, memo);
        } else { //drag 일경우
            highlightAjaxListener.updateItem(idx, color, memo).then(function (res) {
                execute.updateItem(res);
            })
        }

    } else { //click
        //드래그 할경우 생성
        if (HighlightData.currentFlag == 'block') {
            highlightAjaxListener.insertBlock(color, HighlightData.element);
        } else { //drag일경우
            highlightAjaxListener.insertItem(color, HighlightData.element).then(function(){
                WidgetFormBtnEvent.simpleWidgetBookmarkLoadingHide();
            })
        }
    }
});

});
});
},


 */
