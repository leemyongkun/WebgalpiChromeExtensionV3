import { GLOBAL_CONFIG, ELEMENT } from "./global/config.js";
import { STATUS } from "./global/config";
import Common from "../common/common";

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
    let icon = Common.getAppDefaultUrl() + "/icons/icon_48.png";
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
    console.log("COLORS ", COLORS);
    let colorButtons = "";
    COLORS.split(",").forEach(color => {
      colorButtons += " <a class='" + color + " webgalpi-color-form'></a>";
    });

    colorButtons +=
      "<a class='webgalpi-highlight-delete webgalpi-trashbox'></a>"; //
    colorButtons += "<a class='webgalpi-highlight-memo webgalpi-memo'></a>";

    let widthRate = (COLORS.split(",").length + 2) * 16;
    let pickerWidth = "width: " + widthRate + "% !important;";

    return (
      `<div  class="webgalpi-toolbar" id="webgalpi-highlight-update-toolbar" style="display:none;">
                    <div class="webgalpi-color-picker" style="` +
      pickerWidth +
      `">` +
      colorButtons +
      `</div>
            <div id="webgalpi-memo-area" style="display: none !important;">
                <div style="
                        text-align: left !important;
                        padding: 4px !important;
                    ">
                    <textarea rows="4" cols="50" id="webgalpi-memo-textarea" class="webgalpi-memo-textarea"></textarea>
                    <a class="webgalpi-memo-button">확인</a>
                </div>
            </div>
        </div>
                `
    );
  },
  createColorPicker: COLORS => {
    return `
      <div id="webgalpi-highlight-toolbar" style="display: none;
            background-color: rgb(0, 0, 0);
            position: absolute !important;
            width: auto !important;
            height: 20px !important;
            z-index: 2147483647 !important;">
          <a href="javascript:void(0)" class="default-color" style=""></a>
        </div>
      `;
  },
  hidePicker: () => {
    $("#webgalpi-highlight-toolbar").hide();
    $("#webgalpi-highlight-update-toolbar").hide();
    $("#webgalpi-memo-area").hide();
    $("#webgalpi-memo-textarea").val("");
    STATUS.mouseDownFlag = false;
  },
  showPicker: e => {
    // 초기화
    FORM.hidePicker();

    // Drag 영역이 없으면 false 리턴한다.
    if (window.getSelection().isCollapsed) return false;

    $("#webgalpi-highlight-toolbar").css({
      top: e.pageY - 25,
      left: e.pageX + 10,
      position: "absolute"
      /*,width: "200px"*/
    });

    $("#webgalpi-highlight-toolbar").fadeIn(200);
    GLOBAL_CONFIG.CURRENT_MOUSE_STATUS = "drag";

    return true;
  }
};
export default FORM;
