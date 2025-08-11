import { GLOBAL_CONFIG, ELEMENT } from "./global/config.js";
import { STATUS } from "./global/config";
import Common from "../common/common";
import LANG from "../common/language";

import $ from "jquery";

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
    return (
      `<div  id="webgalpi-convert-notification-area">
                    <div class="webgalpi-convert-notification-contents"> 
                     ` +
      LANG.DESCRIPTION_MESSAGE("D0074") +
      `
                     </div>
                    <button class="webgalpi-notification-button" id="cancelConvert">` +
      LANG.BUTTON_MESSAGE("B0010") +
      `</button>
                    <button class="webgalpi-notification-button"  style="margin-right: 3px !important;" id="executeConvert">` +
      LANG.BUTTON_MESSAGE("B0021") +
      `</button> 
                    <img src="${icon}" class="webgalpi-notification-icon">
                </div> 
    `
    );
  },
  updateColorPicker: COLORS => {
    console.log("🎨 updateColorPicker called with COLORS:", COLORS);

    let colorButtons = "";

    // 기본 5개 색상만 보여주기 (highlight-color-1부터 highlight-color-5까지)
    const defaultColorClasses = [
      "highlight-color-1",
      "highlight-color-2",
      "highlight-color-3",
      "highlight-color-4",
      "highlight-color-5"
    ];

    // CSS 클래스를 사용한 버튼 생성
    defaultColorClasses.forEach((colorClass, index) => {
      colorButtons += ` <a class="webgalpi-color-form ${colorClass}" data-color="${colorClass}" style="display: inline-block; width: 16px; height: 16px; margin: 2px; cursor: pointer;"></a>`;
    });

    colorButtons += ` <a class="webgalpi-highlight-delete webgalpi-trashbox" style="display: inline-block; width: 20px; height: 16px; margin: 2px; cursor: pointer; background-color: #ff4444; color: white; text-align: center; line-height: 16px; font-size: 12px; border-radius: 2px;" title="삭제">🗑️</a>`;
    colorButtons += ` <a class="webgalpi-highlight-memo webgalpi-memo" style="display: inline-block; width: 20px; height: 16px; margin: 2px; cursor: pointer; background-color: #4444ff; color: white; text-align: center; line-height: 16px; font-size: 12px; border-radius: 2px;" title="메모">📝</a>`;

    let widthRate = (defaultColorClasses.length + 2) * 16;
    let pickerWidth = "width: " + widthRate + "% !important;";

    console.log(
      "🎨 updateColorPicker generated CSS class color buttons:",
      colorButtons
    );

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
    console.log("🎨 createColorPicker called with COLORS:", COLORS);

    let colorButtons = "";

    // 기본 5개 색상만 보여주기 (highlight-color-1부터 highlight-color-5까지)
    const defaultColorClasses = [
      "highlight-color-1",
      "highlight-color-2",
      "highlight-color-3",
      "highlight-color-4",
      "highlight-color-5"
    ];

    // CSS 클래스를 사용한 버튼 생성
    defaultColorClasses.forEach((colorClass, index) => {
      colorButtons += ` <a class="webgalpi-color-form ${colorClass}" data-color="${colorClass}" style="display: inline-block; width: 16px; height: 16px; margin: 2px; cursor: pointer;"></a>`;
    });

    console.log("🎨 Generated CSS class color buttons:", colorButtons);

    return `
      <div id="webgalpi-highlight-toolbar" style="display: none;
            background-color: rgb(0, 0, 0);
            position: absolute !important;
            width: auto !important;
            height: 20px !important;
            padding: 2px !important;
            z-index: 2147483647 !important;">
          ${colorButtons}
        </div>
      `;
  },
  hidePicker: () => {
    $("#webgalpi-highlight-toolbar").hide();
    $("#webgalpi-highlight-update-toolbar").hide();
    $("#webgalpi-pen-icon").hide();
    $("#webgalpi-memo-area").hide();
    $("#webgalpi-memo-textarea").val("");
    STATUS.mouseDownFlag = false;
  },
  createPenIcon: () => {
    console.log("🖊️ createPenIcon called");

    return `
      <div id="webgalpi-pen-icon" style="display: none;
            background-color: rgba(0, 0, 0, 0.8);
            position: absolute !important;
            width: auto !important;
            height: 20px !important;
            padding: 4px !important;
            border-radius: 3px !important;
            z-index: 2147483647 !important;">
          <img src="${chrome.runtime.getURL(
            "icons/pen.png"
          )}" style="width: 16px; height: 16px; cursor: pointer;" class="webgalpi-pen-button" title="하이라이트 저장">
        </div>
      `;
  },
  showPenIcon: e => {
    console.log("🖊️ showPenIcon called with event:", e);
    // 초기화
    FORM.hidePicker();

    // Drag 영역이 없으면 false 리턴한다.
    if (window.getSelection().isCollapsed) {
      console.log("❌ showPenIcon: selection is collapsed");
      return false;
    }

    const penIcon = $("#webgalpi-pen-icon");
    console.log("🖊️ Pen icon element found:", penIcon.length);

    if (penIcon.length === 0) {
      console.error("❌ webgalpi-pen-icon not found in DOM!");
      return false;
    }

    penIcon.css({
      top: e.pageY - 25,
      left: e.pageX + 10,
      position: "absolute"
    });

    console.log("🖊️ Showing pen icon at:", e.pageX + 10, e.pageY - 25);

    // Use direct CSS instead of fadeIn to ensure visibility
    penIcon.css({
      display: "block",
      opacity: 1,
      visibility: "visible"
    });

    // Also try fadeIn as backup
    penIcon.fadeIn(200, function() {
      console.log("🖊️ Pen icon fadeIn completed");
    });

    GLOBAL_CONFIG.CURRENT_MOUSE_STATUS = "drag";

    return true;
  },
  showPicker: e => {
    console.log("🎨 showPicker called with event:", e);
    // 초기화
    FORM.hidePicker();

    // Drag 영역이 없으면 false 리턴한다.
    if (window.getSelection().isCollapsed) {
      console.log("❌ showPicker: selection is collapsed");
      return false;
    }

    const toolbar = $("#webgalpi-highlight-toolbar");
    console.log("🎨 Toolbar element found:", toolbar.length);

    if (toolbar.length === 0) {
      console.error("❌ webgalpi-highlight-toolbar not found in DOM!");
      return false;
    }

    toolbar.css({
      top: e.pageY - 25,
      left: e.pageX + 10,
      position: "absolute"
      /*,width: "200px"*/
    });

    console.log("🎨 Showing toolbar at:", e.pageX + 10, e.pageY - 25);
    console.log(
      "🎨 Toolbar CSS before show:",
      toolbar.css(["display", "visibility", "z-index", "position"])
    );

    // Check if toolbar has any content
    console.log("🎨 Toolbar HTML:", toolbar.html());
    console.log("🎨 Toolbar parent:", toolbar.parent().length);

    // Use direct CSS instead of fadeIn to ensure visibility
    toolbar.css({
      display: "block",
      opacity: 1,
      visibility: "visible"
    });

    console.log(
      "🎨 Toolbar set to visible, final CSS:",
      toolbar.css([
        "display",
        "visibility",
        "z-index",
        "position",
        "top",
        "left",
        "opacity"
      ])
    );

    // Also try fadeIn as backup
    toolbar.fadeIn(200, function() {
      console.log(
        "🎨 FadeIn completed, final CSS:",
        toolbar.css([
          "display",
          "visibility",
          "z-index",
          "position",
          "top",
          "left",
          "opacity"
        ])
      );
    });

    GLOBAL_CONFIG.CURRENT_MOUSE_STATUS = "drag";

    return true;
  }
};
export default FORM;
