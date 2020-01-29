let $ = require("jquery");

import EVENT from "./event";
import CONTENTS from "./contents";
import { GLOBAL_CONFIG, URL } from "./global/config.js";
import CORE from "./core/core.js";
import COMMON from "./common.js";
import SELECTION from "../lib/selection.js";

let APPLICATION = {
  getNaverBlog: () => {
    return new Promise(res => {
      //todo : NAVER 일경우 frame 에 있는 내용을 HTML로 갈아야함.
      // let iframe = document.getElementById("mainFrame").innerHTML;
      //let ifr = $('#mainFrame').contents();
      /*  let val = document.frames["mainFrame"].document.getElementsByTagName('html')[0];*/
      let val = $("#mainFrame")
        .contents()
        .find("html")
        .html();

      document.getElementsByTagName("html")[0].innerHTML = val;

      res(true);
    });
  },
  init: async data => {
    //body (target element) 가 없으면 취소한다.
    if (document.querySelectorAll(GLOBAL_CONFIG.TARGET_ELEMENT).length === 0)
      return false;

    CONTENTS.initUrlInfo();

    //todo : 이건 나중에.. 해야할듯.
    //await APPLICATION.getNaverBlog();

    if (data == null) {
      return false;
    }
    //하이라이팅 대상 Element를 설정한다.
    GLOBAL_CONFIG.ELEMENT = document.getElementsByTagName(
      GLOBAL_CONFIG.TARGET_ELEMENT
    )[0];

    //현재 저장되어있는지 확인.
    GLOBAL_CONFIG.USE_CURRENT_SITE = data.allItems.SITE_CHECK;

    console.log(
      "GLOBAL_CONFIG.USE_CURRENT_SITE ",
      GLOBAL_CONFIG.USE_CURRENT_SITE
    );
    //하이라이트 Item을 저장한다.
    GLOBAL_CONFIG.HIGHLIGHT_LIST = data.allItems.HIGHLIGHT_LIST;

    //SPA 의 사이트의 경우, tag가 남아있는 현상이 있으나, 이를 제거하느다.
    let targetDeleteHighlightCustomTag = document.querySelectorAll(
      GLOBAL_CONFIG.HL_TAG_NAME
    );
    for (let i = targetDeleteHighlightCustomTag.length - 1; 0 <= i; i--) {
      targetDeleteHighlightCustomTag[i].parentElement.removeChild(
        targetDeleteHighlightCustomTag[i]
      );
    }

    // 팔렛트 생성
    CONTENTS.createColorPicker(data.options.COLOR)
      .then(ret => {
        // 버튼 이벤트
        EVENT.colorPickerBtnEvent();
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
        //1초에 한번씩 하이라이트를 다시 생성한다.
        setInterval(() => {
          CORE.printHighlight(GLOBAL_CONFIG.HIGHLIGHT_LIST);
        }, 1000);
      })
      .then(() => {
        COMMON.detectSite();
      })
      .then(() => {});
  }
};

export default APPLICATION;
