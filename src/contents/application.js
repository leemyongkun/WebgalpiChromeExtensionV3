import $ from "jquery";

import EVENT from "./event";
import CONTENTS from "./contents";
import { GLOBAL_CONFIG, URL } from "./global/config.js";
import CORE from "./core/core.js";
import COMMON from "./common.js";
import SELECTION from "../lib/selection.js";

let APPLICATION = {
  init: async data => {
    console.log("🔧 APPLICATION.init called with data:", data);

    try {
      //body (target element) 가 없으면 취소한다.
      if (
        document.querySelectorAll(GLOBAL_CONFIG.TARGET_ELEMENT).length === 0
      ) {
        console.log(
          "❌ No target element found:",
          GLOBAL_CONFIG.TARGET_ELEMENT
        );
        return false;
      }

      //이미 생성되어있으면 취소한다.
      if (document.querySelectorAll(GLOBAL_CONFIG.GROUP_ELEMENT).length !== 0) {
        console.log("ℹ️  Group element already exists, skipping init");
        return false;
      }

      if (data == null) {
        console.log("❌ No data provided to APPLICATION.init");
        return false;
      }

      // Data structure validation
      if (!data.allItems) {
        console.error("❌ data.allItems is undefined or null:", data);
        return false;
      }

      if (!data.options) {
        console.error("❌ data.options is undefined or null:", data);
        return false;
      }

      console.log("✅ APPLICATION.init proceeding with initialization");
      //하이라이팅 대상 Element를 설정한다.
      GLOBAL_CONFIG.ELEMENT = document.getElementsByTagName(
        GLOBAL_CONFIG.TARGET_ELEMENT
      )[0];

      //현재 저장되어있는지 확인.
      GLOBAL_CONFIG.USE_CURRENT_SITE = data.allItems.SITE_CHECK || "N";

      //사이트가 Lock이 걸려있는지 확인한다.
      GLOBAL_CONFIG.SITE_OPEN = data.allItems.SITE_OPEN || "Y";

      //하이라이트 Item을 저장한다.
      GLOBAL_CONFIG.HIGHLIGHT_LIST = data.allItems.HIGHLIGHT_LIST || [];

      /*SPA 의 사이트의 경우, tag가 남아있는 현상이 있으나, 이를 제거하느다.*/
      let targetDeleteHighlightCustomTag = document.querySelectorAll(
        GLOBAL_CONFIG.HL_TAG_NAME
      );
      for (let i = targetDeleteHighlightCustomTag.length - 1; 0 <= i; i--) {
        targetDeleteHighlightCustomTag[i].parentElement.removeChild(
          targetDeleteHighlightCustomTag[i]
        );
      }

      const color =
        data.options.COLOR || "#ffff00,#00ff00,#ff0000,#0000ff,#ff8000";
      console.log("🎨 Calling createContentsForm with color:", color);
      APPLICATION.createContentsForm(color);
    } catch (error) {
      console.error("❌ Error in APPLICATION.init:", error);
      console.error("❌ Data that caused error:", data);
      return false;
    }
  },
  createContentsForm: color => {
    console.log("🔨 createContentsForm starting with color:", color);

    // Ensure color is a valid string for createForm
    let colorString = color;
    if (Array.isArray(color)) {
      colorString = color.join(",");
    } else if (typeof color !== "string") {
      console.log("⚠️  Color is not string or array, using default colors");
      colorString = "#ffff00,#00ff00,#ff0000,#0000ff,#ff8000";
    }

    console.log("🔨 Using processed colorString:", colorString);

    // 팔렛트 생성
    console.log("🔧 About to call CONTENTS.createForm");
    CONTENTS.createForm(colorString)
      .then(ret => {
        console.log("✅ CONTENTS.createForm completed, setting up events");

        // 버튼 이벤트
        EVENT.colorPickerBtnEvent();
        EVENT.penBtnEvent();
        EVENT.mouseOnDownUpEvent();
        EVENT.colorPickerUpdateBtnEvent();

        //capture
        $("#extensionMenu")
          .unbind("click")
          .on("click", function() {
            EVENT.captureEvent();
            //SELECTION.init();
          });
      })
      .then(() => {
        // 1초마다 하이라이트 확인 (동적 콘텐츠 대응)
        let highlightCheckCount = 0;
        const maxHighlightChecks = 5; // 최대 5번만 확인

        const highlightInterval = setInterval(() => {
          if (highlightCheckCount >= maxHighlightChecks) {
            console.log("⏹️ Max highlight checks reached, stopping");
            clearInterval(highlightInterval);
            return;
          }

          highlightCheckCount++;
          console.log(
            `🎨 Highlight check ${highlightCheckCount}/${maxHighlightChecks}`
          );
          CORE.printHighlight(GLOBAL_CONFIG.HIGHLIGHT_LIST);
        }, 1000);
      })
      .then(() => {
        COMMON.detectSite();
      })
      .then(async () => {
        let convertResult = await COMMON.checkConvertUrl(URL.SITE);
        if (convertResult) {
          //todo 변환 창을 보이도록 한다.
          $("#webgalpi-convert-notification-area").show();
        }
        EVENT.convertBtnEvent(convertResult);
      });
  }
};

export default APPLICATION;
