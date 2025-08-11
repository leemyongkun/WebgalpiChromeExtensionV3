import Utils from "../dashboard/utils/Utils";
import FORM from "./form.js";
import { GLOBAL_CONFIG, STATUS, URL, USER_INFO } from "./global/config.js";
import CORE from "./core/core.js";
import CONTENT_LISTENER from "../common/content-listener";
import Common from "../common/common";
import LANG from "../common/language";

import md5 from "md5";
import $ from "jquery";

let CURRENT_URL = null;
let CONTENTS = {
  getUrl: () => {
    return (
      window.location.origin + window.location.pathname + window.location.search
    );
  },
  initUrlInfo: () => {
    return new Promise(res => {
      CURRENT_URL = CONTENTS.getUrl();
      if (URL.KEY != md5(CURRENT_URL.split("#")[0])) {
        GLOBAL_CONFIG.USE_CURRENT_SITE = "N";
      }

      res(true);
    });
  },
  createForm: COLORS => {
    return new Promise(res => {
      //이미 생성되었을경우 더이상 생성하지 않는다.
      if (document.querySelectorAll(GLOBAL_CONFIG.GROUP_ELEMENT).length > 0) {
        res(true);
        return false;
      }
      // 팔렛트를 생성
      let hlGroupElement = document.createElement(GLOBAL_CONFIG.GROUP_ELEMENT);
      const colorPickerHTML = FORM.createColorPicker(COLORS);
      const updateColorPickerHTML = FORM.updateColorPicker(COLORS);
      const penIconHTML = FORM.createPenIcon();
      const convertAreaHTML = FORM.createConvertArea();

      console.log("🎨 Creating form elements:");
      console.log("🎨 ColorPicker HTML:", colorPickerHTML);
      console.log("🎨 UpdateColorPicker HTML:", updateColorPickerHTML);
      console.log("🎨 Pen Icon HTML:", penIconHTML);
      console.log("🎨 ConvertArea HTML:", convertAreaHTML);

      hlGroupElement.innerHTML =
        colorPickerHTML + updateColorPickerHTML + penIconHTML + convertAreaHTML;
      //FORM.createCaptureArea() +

      let targetElement = document.getElementsByTagName(
        GLOBAL_CONFIG.TARGET_ELEMENT
      )[0];

      targetElement.appendChild(hlGroupElement);

      console.log("🎨 Form elements added to DOM");
      console.log(
        "🎨 Checking if toolbar exists in DOM:",
        document.getElementById("webgalpi-highlight-toolbar")
      );
      console.log(
        "🎨 jQuery toolbar check:",
        $("#webgalpi-highlight-toolbar").length
      );

      res(true);
    });
  },
  getReadmodeContents: (html, url) => {
    return new Promise((res, rej) => {
      try {
        let parser = new DOMParser();
        let idoc = parser.parseFromString(html, "text/html");
        let previewDoc = new PreviewMode(
          CONTENTS.getUriInfo(url),
          idoc
        ).parse();
        if (previewDoc === null) {
          res(null);
        } else {
          res(previewDoc.content);
        }
      } catch (e) {
        rej(e);
      }
    });
  },
  getUrlParameterInfo: url => {
    let params = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
      params[key] = value;
    });
    return params;
  },
  getUriInfo: url => {
    let siteLocationInfo = document.createElement("a");
    siteLocationInfo.href = url;

    let loc = siteLocationInfo;
    return {
      parameter: CONTENTS.getUrlParameterInfo(url),
      spec: loc.href,
      host: loc.host,
      prePath: loc.protocol + "//" + loc.host,
      scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
      pathBase:
        loc.protocol +
        "//" +
        loc.host +
        loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
    };
  },
  firstVisitSite: param => {
    return new Promise(async function(res) {
      //공통은 항상 위에 둔다.
      if (param.TAGS == undefined) {
        param.TAGS = "";
      }

      if (URL.TYPE == "PDF") {
        param.URL_TYPE = "PDF";
        param.OG_TITLE = "";
        param.OG_DESCRIPTION = "";
        param.OG_IMAGE = "";
        param.FULL_TEXT = "";
        param.HOST = window.location.origin;
        //PDF 항목이 생기면 들어갈 Category IDX이다.
        param.DEFAULT_CATEGORY_IDX = 0; //loginInfo.DEFAULT_CATEGORY_IDX;
        param.READERMODE_CONTENTS = "";
        res(param);
        return param;
      }

      let ogTitle = "";
      let ogDescription = "";
      let ogImage = "";

      param.EMBEDURL = "";

      if (location.href.indexOf("www.youtube.com/watch") !== -1) {
        let tags = document.querySelector("#scriptTag").innerText;
        let info = JSON.parse(tags);
        ogTitle = info.name;
        ogDescription = info.description;
        ogImage = info.thumbnailUrl[0];
        param.EMBEDURL = info.embedUrl;
      } else {
        ogTitle = $('meta[property="og:title"]').attr("content");
        ogDescription = $('meta[property="og:description"]').attr("content");
        ogImage = $('meta[property="og:image"]').attr("content");
      }

      if (ogTitle == undefined) {
        ogTitle = "";
      }
      if (ogDescription == undefined) {
        ogDescription = "";
      }
      if (ogImage == undefined) {
        ogImage = "";
      }

      param.OG_TITLE = ogTitle;
      param.OG_DESCRIPTION = ogDescription;
      param.OG_IMAGE = ogImage;

      param.FULL_TEXT = "";
      var body = document.getElementsByTagName("body");
      if (body.length > 0) {
        param.FULL_TEXT = body[0].innerText;
      } else {
        param.FULL_TEXT = document.documentElement.innerText;
      }

      param.HOST = window.location.origin;
      //기본으로 지정된 Category로 들어간다
      param.DEFAULT_CATEGORY_IDX = 0; //loginInfo.DEFAULT_CATEGORY_IDX;
      param.URL_TYPE = "WEB";

      CONTENTS.getReadmodeContents(
        document.getElementsByTagName("html")[0].outerHTML,
        URL.SITE
      )
        .then(ret => {
          param.READERMODE_CONTENTS = ret;
          res(param);
        })
        .catch(error => {
          param.READERMODE_CONTENTS = null;
          res(param);
        });
    });
  },
  setHighlightRangeInfoData: (event, offset) => {
    // pdf 페이지 번호
    if (URL.TYPE === "PDF") {
      GLOBAL_CONFIG.PAGE_NUMBER = $(event.target)
        .closest(".page")
        .attr("data-page-number");
    } else {
      GLOBAL_CONFIG.PAGE_NUMBER = 0; // 없음.
    }

    // 마우스 영역의 데이타를 저장해둔다.
    GLOBAL_CONFIG.SELECT_RANGE_TEXT = offset.hlText;
    GLOBAL_CONFIG.SELECT_RANGE_TEXT_PREV = offset.hlPrev;
    GLOBAL_CONFIG.SELECT_RANGE_TEXT_NEXT = offset.hlNext;
    GLOBAL_CONFIG.SELECT_START = offset.start;
    GLOBAL_CONFIG.SELECT_END = offset.end;

    // 마우스 업했을때 최종 Doc 사이즈를 저장해둔다.
    // HighlightData.mouseUpDocTotalSize = $(HighlightData.targetElement).text().length

    // 드래그한 영역의 이미지가 있으면 이미지Path를 가져온다.
    let imageRange = window.getSelection().getRangeAt(0);
    let imageContent = imageRange.cloneContents();
    let images = imageContent.querySelectorAll("img");
    if (images != null) {
      let list = new Array();
      $(images)
        .each(function(idx, item) {
          list.push(item.currentSrc);
        })
        .promise()
        .then(function() {
          GLOBAL_CONFIG.SELECT_IMAGE = list.join(" ");
        });
    }
  },
  deleteHighlight: async highlightIdx => {
    console.log("🗑️ deleteHighlight called with IDX:", highlightIdx);

    if (!highlightIdx || highlightIdx === 0 || isNaN(highlightIdx)) {
      console.error("❌ Invalid highlight IDX:", highlightIdx);
      alert("하이라이트 ID가 잘못되었습니다.");
      return false;
    }

    if (!confirm(LANG.CONFIRM_MESSAGE("C0003"))) {
      console.log("❌ User cancelled deletion");
      return false;
    }

    console.log("✅ User confirmed deletion");

    let result = await Utils.getLocalStorage("loginInfo");
    console.log("🔍 Login info:", result);

    if (!result || !result.loginInfo || !result.loginInfo.EMAIL) {
      console.error("❌ No login info found");
      alert("로그인 정보를 찾을 수 없습니다.");
      return false;
    }

    let param = new Object();
    param.HIGHLIGHT_IDX = highlightIdx;
    param.URL_KEY = URL.KEY;
    param.EMAIL = result.loginInfo.EMAIL;

    console.log("📋 Delete parameters:", param);
    console.log(
      "🎯 Looking for elements with selector:",
      "[" + GLOBAL_CONFIG.HL_ID_NAME + "=" + param.HIGHLIGHT_IDX + "]"
    );

    // DOM에서 하이라이트 요소 찾기
    let highlightElements = $(
      "[" + GLOBAL_CONFIG.HL_ID_NAME + "=" + param.HIGHLIGHT_IDX + "]"
    );
    console.log("🎯 Found highlight elements:", highlightElements.length);

    if (highlightElements.length === 0) {
      console.error(
        "❌ No highlight elements found for IDX:",
        param.HIGHLIGHT_IDX
      );
      alert("삭제할 하이라이트를 찾을 수 없습니다.");
      return false;
    }

    // DOM에서 하이라이트 제거
    highlightElements.each((idx, item) => {
      console.log("🗑️ Removing highlight element:", item);
      $(item)
        .contents()
        .unwrap();
    });

    console.log("📤 Sending delete message to background...");
    CONTENT_LISTENER.sendMessage({
      type: "delete.highlight",
      data: param
    })
      .then(() => {
        console.log("✅ Delete message sent successfully");
        FORM.hidePicker();
      })
      .then(() => {
        console.log("🔄 Reloading same site...");
        Common.reloadingSameSite();
      })
      .catch(error => {
        console.error("❌ Error sending delete message:", error);
      });
  },
  updateHighlightMemo: async highlightIdx => {
    let result = await Utils.getLocalStorage("loginInfo");
    let param = new Object();
    param.HIGHLIGHT_IDX = highlightIdx;
    param.URL_KEY = URL.KEY;
    param.EMAIL = result.loginInfo.EMAIL;
    param.MEMO = document.getElementById("webgalpi-memo-textarea").value;

    CONTENT_LISTENER.sendMessage({
      type: "update.highlight.memo",
      data: param
    }).then(res => {
      alert(LANG.ALERT_MESSAGE("A0021"));
      // Safely update HIGHLIGHT_LIST if it exists
      if (
        GLOBAL_CONFIG.HIGHLIGHT_LIST &&
        Array.isArray(GLOBAL_CONFIG.HIGHLIGHT_LIST)
      ) {
        GLOBAL_CONFIG.HIGHLIGHT_LIST.map(item => {
          if (item.IDX === param.HIGHLIGHT_IDX) {
            item.MEMO = param.MEMO;
          }
        });
      }
      FORM.hidePicker();
    });
  },
  updateHighlight: async (color, highlightIdx) => {
    if (color === "") {
      return false;
    }

    let param = new Object();
    param.COLOR = color;
    param.HIGHLIGHT_IDX = highlightIdx;
    param.URL_KEY = URL.KEY;
    param.MEMO = "";
    let result = await Utils.getLocalStorage("loginInfo");
    param.EMAIL = result.loginInfo.EMAIL;

    //FORM.clearColorPicker(param.COLOR); //color picker 버튼 초기화

    //update일경우, 지정한 컬러로 색상을 바꾼다.
    $("[" + GLOBAL_CONFIG.HL_ID_NAME + "='" + param.HIGHLIGHT_IDX + "']").each(
      (highlightIdx, item) => {
        $(item).removeClass();
        $(item).addClass(param.COLOR);
      }
    );

    // 저장
    CONTENT_LISTENER.sendMessage({
      type: "update.highlight",
      data: param
    }).then(() => {
      FORM.hidePicker();
    });
  },
  /*하이라이트 생성*/
  createHighlight: async (color, element) => {
    console.log(
      "🎨 createHighlight called with color:",
      color,
      "type:",
      typeof color
    );
    window.getSelection().removeAllRanges();

    // 드래그를 했고, 하이라이팅이 되지 않았다면 신규로 판단하여 IDX값 을 증가한다.
    if (GLOBAL_CONFIG.CURRENT_MOUSE_STATUS === "drag") {
      // && GLOBAL_CONFIG.HIGHLIGHT_POINT === false
      // currentIdx는 mouseOver 했을 시에도 변경이 되기 때문에 증가값만 가지고 있는 incrementIdx에 +1을 해주어 대입하는 형태로 증가시킨다.
      GLOBAL_CONFIG.INCREMENT_IDX = new Date().getTime();
      GLOBAL_CONFIG.CURRENT_IDX = GLOBAL_CONFIG.INCREMENT_IDX;
    }

    // 저장하기 위한 parameter를 생성한다.
    let param = new Object();
    param.URL = URL.SITE; // SITE
    param.URL_KEY = URL.KEY; // SITE
    param.TITLE = document.title; // SITE
    param.UPDATE_TITLE = document.title; // SITE
    param.MEMO = ""; //MEMO
    param.IDX = GLOBAL_CONFIG.CURRENT_IDX;
    param.COLOR = color; // HIGHLIGHT
    console.log("🎨 param.COLOR set to:", param.COLOR);
    param.SITE_CHECK = GLOBAL_CONFIG.USE_CURRENT_SITE; // 사이트를 한번이상 저장한적있으면 Y, 처음이면 N
    param.GB_FILETYPE = "T"; // Text인지 Image인지 구분

    param.EMAIL = USER_INFO.EMAIL;

    param.IMAGE = GLOBAL_CONFIG.SELECT_IMAGE;
    param.PAGE_NUMBER = GLOBAL_CONFIG.PAGE_NUMBER; // PDF의 pagenumber를 넣는다. (PDF가 아닌경우 0으로 들어간다.)
    param.DATE_CREATE = new Date().getTime();
    param.TEXT = GLOBAL_CONFIG.SELECT_RANGE_TEXT; // response.hlText;
    param.PREV = GLOBAL_CONFIG.SELECT_RANGE_TEXT_PREV;
    param.NEXT = GLOBAL_CONFIG.SELECT_RANGE_TEXT_NEXT;
    param.PRINT_TEXT = param.TEXT;

    let sumText = param.TEXT;
    let original = $(GLOBAL_CONFIG.TARGET_ELEMENT).text();
    let idx = original.indexOf(sumText);

    let position = new Array();
    while (idx > -1) {
      position.push(idx);
      idx = original.indexOf(sumText, idx + 1);
    }
    let wordPosition = GLOBAL_CONFIG.SELECT_START;

    param.POSITION = position.indexOf(wordPosition);

    // ################# 리드모드일경우 /가로,세로도 구분한다.
    if ($(element).find("#waf-readmode-containers").length) {
      param.FL_READMODE = "Y";
      param.FL_READMODE_STATUS = "vertical";
      if (
        !$(element)
          .find("#waf-readmode-containers")
          .hasClass("notratio")
      ) {
        param.FL_READMODE_STATUS = "horizontal";
      }
    } else {
      param.FL_READMODE = "N";
      param.FL_READMODE_STATUS = null;
    }

    // Map 업데이트
    GLOBAL_CONFIG.MEMO_LIST.set(GLOBAL_CONFIG.CURRENT_IDX, param.MEMO);

    // 하이라이팅 됨. 현재 포인터인지 확인 - 다른곳에서는 다시 false로 변경한다.
    /*GLOBAL_CONFIG.HIGHLIGHT_POINT = true;*/

    // 메모가 있는경우, 메모 아이콘 표시
    if (param.MEMO !== "") {
      let destItem = $(
        "[" + GLOBAL_CONFIG.HL_ID_NAME + '="' + param.IDX + '"]'
      )[0];
      $(destItem).addClass("wf-memo");
    }

    CORE.executeHighlight(param); //화면에 하이라이팅 하기
    FORM.clearColorPicker(param.COLOR); //color picker 버튼 초기화

    if (GLOBAL_CONFIG.USE_CURRENT_SITE == "N") {
      // 처음 저장이면...
      GLOBAL_CONFIG.USE_CURRENT_SITE = "Y";
      param = await CONTENTS.firstVisitSite(param); // 사이트 정보를 가져온다.
      GLOBAL_CONFIG.SITE_INFO = param;

      //2개이상은 같은 사이트를 리로딩 (비동기)
      Common.reloadingDashboard();
    }

    // 저장
    CONTENT_LISTENER.sendMessage({
      type: "create.highlight",
      data: param
    });

    //저장된 하이라이트 다시 가져오기
    param.KEY = param.URL_KEY;
    CONTENT_LISTENER.sendMessage({
      type: "get.highlights",
      data: param
    }).then(highlights => {
      GLOBAL_CONFIG.HIGHLIGHT_LIST = highlights;
    });

    //2개이상은 같은 사이트를 리로딩 (비동기)
    Common.reloadingSameSite();
    Common.reloadingDashboard();
    return param;
  },
  checkCurrentArea: (event, action) => {
    if (action === "click") {
      if (
        $(event.target).closest("#webgalpi-highlight-update-toolbar").length ===
        0
      ) {
        FORM.hidePicker();
      }
    } else if (action === "mousedown") {
      if (
        window.getSelection().isCollapsed === false &&
        $(event.target).attr(GLOBAL_CONFIG.HL_ID_NAME) === undefined
      ) {
      }
    }

    // 부모중에 waffle-widget-form(위젯폼)이 있을 경우 하이라이팅을 하지 않음.
    STATUS.widgetArea += $(event.target).closest(
      GLOBAL_CONFIG.GROUP_ELEMENT
    ).length;
    // 부모중에 리더모드 코멘트 영역일 경우 하이라이팅을 하지 않음.
    STATUS.widgetArea += $(event.target).closest(
      "#waf-comment-containers"
    ).length;

    // 리드모드 일경우, 타이틀에 해당하는 영역이 있으면 하이라이팅을 하지 않음.
    STATUS.checkHighlightArea += $(event.target).closest(".wf-title").length;
    STATUS.checkHighlightArea += $(event.target).find(".wf-title").length;

    return true;
  }
};

export default CONTENTS;
