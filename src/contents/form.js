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
  createColorPicker2: () => {
    return `<div id='highlight-toolbar'>
                    <ul>
                        <li>
                          <a href='javascript:void(0)' id="hltcolor-1" style='list-style-type:none;
                                                              float: left;
                                                              outline: 1px dotted red;
                                                              margin-right: 5px;
                                                              display: inline;
                                                              text-align: center;' 
                                                        class='hltcolor-1'>RED</a>
                        </li>
                        <li>
                              <a href='javascript:void(0)' id="hltcolor-2" style=' list-style-type:none;
                              float: left;
                              outline: 1px dotted red;
                              margin-right: 5px;
                              display: inline;
                              ' class='hltcolor-2'>BLUE</a>
                        </li>
                    </ul>
                    
                    </div>`;
  },
  createCaptureArea: () => {
    return `<div style="
                position: fixed;
                right: 20px;
                top: 20px;
                ">
                <img src="" id="prevCapture" width="150px" style="border-radius: 0.6em;">
                </div>`;
  },
  updateColorPicker: COLORS => {
    let colorButtons = "";
    COLORS.split(",").forEach(color => {
      colorButtons += " <a class='" + color + " liner-color-circle'></a>";
    });

    return (
      `<div  class="liner-tooltip-wrap" id="highlight-update-toolbar" style="display:none;">
                    <div class="liner-color-picker">
                     ` +
      colorButtons +
      `
                    </div>
                </div>
                `
    );
  },
  createColorPicker: COLORS => {
    return `
      <div id="highlight-toolbar" style="display: none;
            background-color: rgb(0, 0, 0);
            position: absolute !important;
            width: auto !important;
            height: 20px !important;
            z-index: 2147483647 !important;">
          <a class="default-color" style="background-color: transparent;
            display: inline-block !important;
            cursor: pointer !important;
            width: 20px !important;
            height: 20px !important;
            position: absolute !important;
            left: 0px !important;
            top: 0px !important;
            opacity: 1.00 !important;
            box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 4px 0px !important;
            background-size: cover !important;
            border-width: initial !important;
            border-style: none !important;
            border-color: initial !important;
            border-image: initial !important;
            border-radius: 4px !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;background-image: url(data:image/png;base64,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); !important;"></a>
        </div>
      `;
  },
  /* createColorPicker: COLORS => {
        let colorButtons = "";
        COLORS.split(",").forEach(color => {
            colorButtons +=
                "<a href='javascript:void(0)' class='" + color + '\' id="color-1"></a>';
        });

        return (
            `<wafflepen class='hlt-wafflepen-toolbox' style='display:none; !important;' id='highlight-toolbar'>
                       <wafflepen class='wafflepen-toolbox waf-inlineFlex'>
                          <wafflepen-ul class='wafflepen-color-picker'>
                             ` +
            colorButtons +
            `
                          </wafflepen-ul>
                          <wafflepen class='tool-list'>
                              <a href='javascript:void(0);' id='extensionMenu'>▶︎</a>
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
                  </wafflepen>`
        );
    },*/
  hidePicker: () => {
    //$(".wafflepen-color-picker").find("a").removeClass("on");

    $("#highlightMemoArea").val("");
    $("#highlightDeleteBtn").hide();
    $("#editArea").hide();
    $("#highlight-toolbar").hide();
  },
  showPicker: e => {
    // 초기화
    //$("#highlight-toolbar").find("a").removeClass("on");
    FORM.hidePicker();

    // Drag 영역이 없으면 false 리턴한다.
    if (window.getSelection().isCollapsed) return false;

    $("#highlight-toolbar").css({
      top: e.pageY - 25,
      left: e.pageX + 10,
      position: "absolute"
      /*,width: "200px"*/
    });

    $("#highlight-toolbar-memo-area").hide();
    $("#highlight-toolbar").fadeIn(300);
    GLOBAL_CONFIG.CURRENT_MOUSE_STATUS = "drag";

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
