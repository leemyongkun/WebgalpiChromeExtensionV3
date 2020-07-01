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
  createConvertArea: () => {
    /**
         position: fixed;
         min-width: 260px;
         max-width: 360px;
         box-sizing: border-box;
         font-size: 14px;
         box-shadow: rgba(0, 0, 0, 0.4) 3px 3px 6px;
         z-index: 2100000000;
         line-height: 1.6;
         background: rgb(255, 255, 255);
         border-radius: 5px;
         overflow: hidden;
         border-top: 3px solid rgb(106, 63, 255);
         display: block !important;

         position: fixed;
         right: 20px;
         top: 30px;
         border-radius: 10px;
         background: #ffffff;
         border: 2px solid #73AD21;
         padding: 20px;
         width: 250px;
         height: 100px;
         display: none;
         z-index: 99999999;
         */
    /*  return `<div style="
                                position: fixed;
                                right: 20px;
                                 top: 30px;
                                 min-width: 260px;
                                 max-width: 360px;
                                 box-sizing: border-box;
                                 font-size: 14px;
                                 z-index: 2100000000;
                                 line-height: 1.6;
                                 background: rgb(255, 255, 255);
                                 border-radius: 5px;
                                 overflow: hidden;
                                 border: 2px solid #73AD21;
                                 display: none !important;
                                 "
                        id="webgalpi-convert-notification-area">
                        <h3>[WEBGALPI] 마우스 드래그가 되지 않으시나요?</h3>
                        <span style="cursor: pointer;" id="executeConvert">MOBILE로 변환하기</span> | <span style="cursor: pointer;" id="cancelConvert">취소</span>
                        </div>`;*/
    let icon = "chrome-extension://" + chrome.runtime.id + "/icons/icon_48.png";
    return `<div  id="webgalpi-convert-notification-area">
                    <div class="webgalpi-convert-notification-contents"> 
                     하이라이팅이 안되시나요?<br>
                     NAVER / Daum Blog의 구조는 조금 특별합니다.<br>
                     페이지를 모바일 버전으로 변환하여 사용해보세요.</div>
                    <button class="webgalpi-notification-button" id="cancelConvert">취소</button>
                    <button class="webgalpi-notification-button"  style="margin-right: 3px !important;" id="executeConvert">변환</button> 
                    <img src="${icon}" class="webgalpi-notification-icon">
                </div> 
    `;
  },
  updateColorPicker: COLORS => {
    let colorButtons = "";
    COLORS.split(",").forEach(color => {
      colorButtons += " <a class='" + color + " webgalpi-color-form'></a>";
    });

    colorButtons += " <a class='highlight-delete webgalpi-trashbox'>X</a>"; //

    let widthRate = (COLORS.split(",").length + 1) * 16;
    let pickerWidth = "width: " + widthRate + "% !important;";

    return (
      `<div  class="webgalpi-toolbar" id="highlight-update-toolbar" style="display:none;">
                    <div class="webgalpi-color-picker" style="` +
      pickerWidth +
      `">
                     ` +
      colorButtons +
      `
                    </div>
                    <div id="memoArea" style="display: none !important;" class="webgalpi-memo-area">
                        <div style="
                                text-align: left !important;
                                padding: 4px !important;
                            ">
                            <textarea rows="4" cols="50"class="webgalpi-memo-textarea"></textarea>
                            <a class="highlight-memo webgalpi-memo-button">확인</a>
                        </div>
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
          <a class="default-color" style=""></a>
        </div>
      `;
  },
  /*

               createColorPicker: COLORS => {
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
    $("#highlight-toolbar").fadeIn(200);
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
