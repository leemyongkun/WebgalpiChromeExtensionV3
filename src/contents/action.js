import FORM from "./form.js";
import { GLOBAL_CONFIG, URL } from "./global/config.js";
import CORE from "./core/core.js";
import COMMON from "./common.js";
import JCROP from "../lib/jcrop.js";

let md5 = require("md5");
let $ = require("jquery");

let CURRENT_URL = null;
let CONTENT_ACTION = {
  getUrl: () => {
    return (
      window.location.origin + window.location.pathname + window.location.search
    );
  },
  initUrlInfo: () => {
    CURRENT_URL = CONTENT_ACTION.getUrl();
    if (URL.KEY != md5(CURRENT_URL.split("#")[0])) {
      GLOBAL_CONFIG.USE_CURRENT_SITE = "N";
    }
    URL.SITE = CURRENT_URL.split("#")[0];
    URL.KEY = md5(URL.SITE);
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

      let ogTitle = $('meta[property="og:title"]').attr("content");
      let ogDescription = $('meta[property="og:description"]').attr("content");
      let ogImage = $('meta[property="og:image"]').attr("content");

      if (ogTitle == undefined) {
        ogTitle == "";
      }
      if (ogDescription == undefined) {
        ogDescription == "";
      }
      if (ogImage == undefined) {
        ogImage == "";
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

      param.READERMODE_CONTENTS = document.getElementsByTagName(
        "html"
      )[0].outerHTML;

      res(param);
    });
  },
  createColorPicker: () => {
    return new Promise(res => {
      // 팔렛트를 생성
      let hlGroupElement = document.createElement(GLOBAL_CONFIG.GROUP_ELEMENT);
      hlGroupElement.innerHTML = FORM.createColorPicker();
      let targetElement = document.getElementsByTagName(
        GLOBAL_CONFIG.TARGET_ELEMENT
      )[0];
      targetElement.appendChild(hlGroupElement);

      res(true);
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
  deleteHighlight: idx => {
    let param = new Object();
    param.IDX = idx;
    param.URL_KEY = URL.KEY;

    $("[" + GLOBAL_CONFIG.HL_ID_NAME + "=" + param.IDX + "]").each(function(
      idx,
      item
    ) {
      $(item)
        .contents()
        .unwrap();
    });

    EVENT.sendMessage({
      type: "delete.highlight",
      data: param
    });
  },
  updateHighlight: async (color, idx) => {
    let param = new Object();
    param.COLOR = color;
    param.IDX = idx;
    param.URL_KEY = URL.KEY;
    param.MEMO = "";

    FORM.clearColorPicker(param.COLOR); //color picker 버튼 초기화

    //이거 처리 해야함.
    $("[" + GLOBAL_CONFIG.HL_ID_NAME + '="' + param.IDX + '"]').each(function(
      idx,
      item
    ) {
      $(item).removeClass();
      $(item).addClass(param.COLOR);
    });

    // 저장
    EVENT.sendMessage({
      type: "update.highlight",
      data: param
    });
  },
  createHighlight: async (color, element) => {
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
    param.MEMO = $.trim($("#highlightMemoArea").val()); // Memo
    param.IDX = GLOBAL_CONFIG.CURRENT_IDX;
    param.COLOR = color; // HIGHLIGHT
    param.SITE_CHECK = GLOBAL_CONFIG.USE_CURRENT_SITE; // 사이트를 한번이상 저장한적있으면 Y, 처음이면 N
    param.GB_FILETYPE = "T"; // Text인지 Image인지 구분
    param.EMAIL = "kkuni.bear@gmail.com"; // loginInfo.EMAIL;
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

    // 드래그 후 바로 '메모'입력 버튼을 눌렀을 경우에는 사라지지 않도록 한다.
    /* if (memoFlag === undefined) {
                                                                          $('#highlight-toolbar').hide();
                                                                        } */

    CORE.executeHighlight(param); //화면에 하이라이팅 하기
    FORM.clearColorPicker(param.COLOR); //color picker 버튼 초기화

    // todo 처음 저장 일경우, 사이트 정보도 포함하여 저장하도록 한다.
    console.log(
      "GLOBAL_CONFIG.USE_CURRENT_SITE ",
      GLOBAL_CONFIG.USE_CURRENT_SITE
    );

    if (GLOBAL_CONFIG.USE_CURRENT_SITE == "N") {
      // 처음 저장이면...
      GLOBAL_CONFIG.USE_CURRENT_SITE = "Y";
      param = await CONTENT_ACTION.firstVisitSite(param); // 사이트 정보를 가져온다.
      GLOBAL_CONFIG.SITE_INFO = param;
    }
    //todo db에 저장
    console.log("FINAL PARAM ", param);

    // 저장
    EVENT.sendMessage({
      type: "create.highlight",
      data: param
    });

    return param;
  }
};

let VALIDATION_ACTION = {
  checkCurrentArea: (event, action) => {
    if (action === "click") {
      if ($(event.target).closest("#highlight-toolbar").length === 0) {
        $("#highlight-toolbar").hide();
      }
    } else if (action === "mousedown") {
      if (
        window.getSelection().isCollapsed === false &&
        $(event.target).attr(GLOBAL_CONFIG.HL_ID_NAME) === undefined
      ) {
        // mousedownPalleteView = true;
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

let STATUS = {
  checkHighlightArea: 0,
  widgetArea: 0,
  mouseDownFlag: false,
  mouseUpId: null,
  mouseDownId: null
};

let EVENT = {
  checkLastError: message => {
    let lastError = chrome.runtime.lastError;
    if (lastError) {
      console.log(message, lastError);
      return;
    }
  },
  sendMessage: parameter => {
    var reserveDefer = $.Deferred();
    try {
      console.log("parameter ", parameter);
      chrome.runtime.sendMessage(parameter, function(response) {
        console.log("response", response);
        EVENT.checkLastError("action.js:272" + parameter.type);

        reserveDefer.resolve(response);
      });
    } catch (e) {
      alert("ERROR:Message.ChromeException[LANG]");
    }
    console.log("reserveDefer ", reserveDefer);
    return reserveDefer;
  },
  mouseOnOverEvent: e => {
    console.log(
      " GLOBAL_CONFIG.MOUSE_OVER_ID ",
      GLOBAL_CONFIG.MOUSE_OVER_ID,
      GLOBAL_CONFIG.CURRENT_IDX
    );

    //클릭한 영역이 textarea 영역이면 팔렛트를 고정한다.
    //if (GLOBAL_CONFIG.MOUSE_CLICK_ID === "highlightMemoArea") return false;

    /* 현재 하이라이팅의 ID를 넣는다.*/
    GLOBAL_CONFIG.CURRENT_IDX = parseInt(
      $(e.target).attr(GLOBAL_CONFIG.HL_ID_NAME)
    );

    //같은 highlight Id의 영역에 마우스를 올렸을 경우, 다른 ID에 올리기 전까지 유지된다.(혹은 다른곳을 클릭하기 전까지 유지된다.)
    if (GLOBAL_CONFIG.MOUSE_OVER_ID != GLOBAL_CONFIG.CURRENT_IDX) {
      $("#highlight-toolbar").hide();
    } else {
      return false;
    }

    GLOBAL_CONFIG.MOUSE_OVER_ID = GLOBAL_CONFIG.CURRENT_IDX;

    /*레이어초기화*/
    let color = $(e.target)
      .attr("class")
      .split(" ")[0];
    $(".wafflepen-color-picker")
      .find("a")
      .removeClass("on");
    $(".wafflepen-color-picker")
      .find("." + color)
      .addClass("on");
    $("#editArea").show();
    //텍스트를 넣는다.
    $("#highlightMemoArea").val(
      GLOBAL_CONFIG.MEMO_LIST.get(parseInt(e.target.id))
    );
    $("#highlightDeleteBtn").show();

    GLOBAL_CONFIG.CURRENT_COLOR = color;

    let selectorTarget = $(
      "[" + GLOBAL_CONFIG.HL_ID_NAME + '="' + GLOBAL_CONFIG.CURRENT_IDX + '"]'
    )[0];

    //HighlightData.highlightPoint = true;

    //마우스를 따라간다.
    $("#highlight-toolbar").css({
      top: e.pageY + 10,
      left: e.pageX,
      position: "absolute"
    });

    //마우스 올렸을대 팔렛트가 나오는 속도
    setTimeout(function() {
      //메모가 있으면 보여준다.
      let memo = GLOBAL_CONFIG.MEMO_LIST.get(GLOBAL_CONFIG.CURRENT_IDX);
      if ($.trim(memo) != "") {
        $("#highlightMemoArea").val(memo);
        $("#highlight-toolbar-memo-area").show();
      } else {
        $("#highlight-toolbar-memo-area").hide();
      }

      $("#highlight-toolbar").fadeIn();
    }, 100);

    GLOBAL_CONFIG.CURRENT_MOUSE_STATUS = "drag";
  },
  mouseOnDownUpEvent: () => {
    CONTENT_ACTION.initUrlInfo(); //urlInitConfig();

    $(GLOBAL_CONFIG.TARGET_ELEMENT)
      .unbind("mousedown")
      .on("mousedown", function(event) {
        if (event.which === 3) return false; // 우클릭

        this.widgetArea = 0;

        // 하이라이팅 영역을 체크한다.
        VALIDATION_ACTION.checkCurrentArea(event, "mousedown");

        // STATUS.mouseDownId = $(event.target).attr(HighlightData.idName);

        // 드래그한영역에 wafflepen 태그가 있을경우를 체크한다.
        if (event.target.nodeName === GLOBAL_CONFIG.HL_TAG_NAME.toUpperCase()) {
          STATUS.mouseDownFlag = true;
        }
      })
      .unbind("mouseup")
      .on("mouseup", async event => {
        //다른곳 클릭하면 mouse_over_id 를 초기화 한다.
        GLOBAL_CONFIG.MOUSE_OVER_ID = 0;

        // 클릭된 영역의 ID를 저장한다.
        // (textarea 영역, 즉 highlightMemoArea일경우, 다른 하이라이트 영역에 mouseover를 해도 팔렛트를 재생성 하지 않는다.)
        //GLOBAL_CONFIG.MOUSE_CLICK_ID = $(event.target).attr("id");

        // 클릭할때마다 mouseup 이벤트가 함께 동작하므로, toolbar를 클릭할때에는 동작하지 않도록 한다.
        if ($(event.target).closest("#highlight-toolbar").length > 0) {
          FORM.hidePicker();
          return false;
        }

        // 하이라이팅 영역을 체크한다.
        VALIDATION_ACTION.checkCurrentArea(event, "click");

        if (STATUS.checkHighlightArea > 0) {
          window.getSelection().removeAllRanges();
          STATUS.checkHighlightArea = 0;
          return false;
        }

        // 로그인 체크
        if (!GLOBAL_CONFIG.IS_LOGIN) {
          return false;
        }

        let selection = window.getSelection();
        let range = selection.getRangeAt(0);
        let content = range.cloneContents();
        let customTag = document.createElement(GLOBAL_CONFIG.HL_TAG_NAME);
        customTag.appendChild(content);

        // 하이라이팅 태그가 있을경우, 하이라이팅을 제외한다.
        let rangeHtml = customTag.innerHTML.indexOf(
          "</" + GLOBAL_CONFIG.HL_TAG_NAME + ">"
        );

        if (
          rangeHtml !== -1 ||
          STATUS.mouseDownFlag ||
          event.target.nodeName === GLOBAL_CONFIG.HL_TAG_NAME.toUpperCase()
        ) {
          /* let currentId;
                                                                                                                                                                                STATUS.mouseUpId = $(event.target).attr(HighlightData.idName);
                                                                                                                                                                                if (HighlightCore.isNumber(STATUS.mouseUpId)) {
                                                                                                                                                                                  currentId = STATUS.mouseUpId;
                                                                                                                                                                                } */

          /* if (HighlightCore.isNumber(HighlightData.downId)) {
                                                                                                                                                                                  currentId = HighlightData.downId;
                                                                                                                                                                                } */
          STATUS.mouseDownFlag = false;
          return false;
        }
        STATUS.mouseDownFlag = false;

        // 영역에 대한 offset정보를 가져온다.
        let offset = await CORE.getStartEndOffset(GLOBAL_CONFIG.ELEMENT);

        // 한글자일경우 액션을 취소한다.
        if ($.trim(offset.hlText).length === 0) {
          return false;
        }

        // 위젯영역일경우 컬러 팔레트를 보여주지 않는다.
        // 컬러 피커가 사용하지 않음일경우 보여주지 않는다.
        /* chrome.storage.sync.get(['options'], result => {
                                                                                   let highlightYN = result.options.HIGHLIGHT;
                                                                                   if (STATUS.widgetArea === 0 && highlightYN === 'Y') {
                                                                                     HighlightCore.mouseDragAction(event); // todo 가장 중요!!
                                                                                   }
                                                                                 }); */

        CONTENT_ACTION.setHighlightRangeInfoData(event, offset);
        FORM.showPicker(event); // todo 가장 중요!!

        STATUS.checkHighlightArea = 0;
        // });
      });
  },
  colorPickerBtnEvent: () => {
    $("#highlight-toolbar")
      .find(".wafflepen-color-picker a")
      .each(function(idx, item) {
        $(item)
          .unbind("click")
          .on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();

            let _this = this;
            let color = $(_this).attr("class"); // hltcolor-x 값을 가져옴
            let colorTF = false;

            // 이미 선택되어진 컬러의 경우..
            if ($(_this).hasClass("on")) {
              // 하이라이팅을 삭제
              //let msg = '하이라이트를 삭제하시겠습니까?'// Message.DeleteHighlighting[LANG];
              /*if ($("#highlightMemoArea").val() != "") {
                                                                                msg = "삭제?"; // Message.DeleteHighlightingWithMemo[LANG];
                                                                            }*/

              let msg = "are you sure you want to delete the highlight?";

              if (confirm(msg)) {
                CONTENT_ACTION.deleteHighlight(GLOBAL_CONFIG.CURRENT_IDX);
                let highlightList = GLOBAL_CONFIG.HIGHLIGHT_LIST;
                GLOBAL_CONFIG.HIGHLIGHT_LIST = highlightList.filter(item => {
                  return item.IDX != GLOBAL_CONFIG.CURRENT_IDX;
                });
                return false;
              }
            }

            $("#highlight-toolbar")
              .find(".wafflepen-color-picker a")
              .each((idx, item) => {
                if ($(item).hasClass("on")) {
                  colorTF = true;
                }
              })
              .promise()
              .then(function() {
                //수정한다.
                if (colorTF) {
                  // 클릭할 경우 수정
                  CONTENT_ACTION.updateHighlight(
                    color,
                    GLOBAL_CONFIG.CURRENT_IDX
                  );
                } else {
                  //저장한다.
                  CONTENT_ACTION.createHighlight(color, GLOBAL_CONFIG.ELEMENT);
                }
              });
          });
      });
  },
  captureEvent: () => {
    $("#extensionMenu").on("click", () => {
      EVENT.sendMessage({
        type: "full.before.capture"
      }).then(imageDataUrl => {
        let captureImgElement = document.createElement("img");
        captureImgElement.src = imageDataUrl;
        captureImgElement.id = "highlight-img";
        captureImgElement.style.width = window.innerWidth + "px";
        captureImgElement.style.height = window.innerHeight + "px";

        let hlCaptureElement = document.createElement(
          GLOBAL_CONFIG.CAPTURE_ELEMENT
        );
        let hlGroupElement = document.getElementsByTagName(
          GLOBAL_CONFIG.GROUP_ELEMENT
        )[0];

        hlCaptureElement.appendChild(captureImgElement);

        hlCaptureElement.style.width = window.innerWidth + "px";
        hlCaptureElement.style.height = window.innerHeight + "px";
        hlCaptureElement.style.position = "absolute"; //relative
        hlCaptureElement.style.zIndex = "2000100000";
        hlCaptureElement.style.left = "0px";
        hlCaptureElement.style.right = "0px";
        hlCaptureElement.style.top = $("html").scrollTop() + "px";
        hlCaptureElement.style.bottom = "0px";

        hlGroupElement.appendChild(hlCaptureElement);

        let rootElement = document.getElementsByTagName("html")[0];
        rootElement.style.overflow = "hidden";

        let jcropApi;
        JCROP.init(
          $("#highlight-img"),
          {
            bgFade: false,
            minSize: 1,
            allowMove: true,
            allowSelect: true,
            allowResize: true,
            setSelect: [0, 0, 0, 0],

            onRelease: e => {
              //$('#' + GLOBAL_CONFIG.CAPTURE_BUTTON_ID).hide();
              //return false;
              jcropApi.animateTo([0, 0, 0, 0]);
            },
            onChange: function(e) {
              //console.log('>>> onchange ', e)
            },
            onSelect: function(position) {
              //
              console.log(">>>  onSelect ", position);

              //Button 생성
              /*if (document.getElementById(GLOBAL_CONFIG.CAPTURE_BUTTON_ID) == null) {
                                let captureButtonElement = document.createElement("button");
                                captureButtonElement.innerText = "CAPTURE";
                                captureButtonElement.id = GLOBAL_CONFIG.CAPTURE_BUTTON_ID;
                                captureButtonElement.style.marginLeft = "10px";
                                captureButtonElement.style.display = "none";
                                $('.ord-e.jcrop-dragbar').append(captureButtonElement);
                            }else{
                                $('#' + GLOBAL_CONFIG.CAPTURE_BUTTON_ID).show();
                            }*/

              let img = new Image();
              // create a temporary canvas sized to the cropped size
              let canvas = document.createElement("canvas");

              img.onload = () => {
                let ctx = canvas.getContext("2d");
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.drawImage(
                  img,
                  position.x,
                  position.y,
                  position.w,
                  position.h,
                  0,
                  0,
                  position.w,
                  position.h
                );
                console.log(canvas.toDataURL());

                //capture 영역 제거
                /*
                                              $('highlight-capture-area').remove();
                                              rootElement.style.overflow = "visible";
                                              */
              };
              img.src = imageDataUrl;
            }
          },
          function() {
            jcropApi = this;
          }
        );
      });
    });
  }
};

let ACTION = {
  init: data => {
    console.log("data ", data);
    CONTENT_ACTION.initUrlInfo();

    if (data == null) {
      return false;
    }
    //하이라이팅 대상 Element를 설정한다.
    GLOBAL_CONFIG.ELEMENT = document.getElementsByTagName(
      GLOBAL_CONFIG.TARGET_ELEMENT
    )[0];

    //현재 저장되어있는지 확인.
    GLOBAL_CONFIG.USE_CURRENT_SITE = data.allItems.SITE_CHECK;

    //하이라이트 Item을 저장한다.
    GLOBAL_CONFIG.HIGHLIGHT_LIST = data.allItems.HIGHLIGHT_LIST;

    // 팔렛트 생성
    CONTENT_ACTION.createColorPicker()
      .then(ret => {
        // todo 버튼 이벤트
        EVENT.colorPickerBtnEvent();
        EVENT.mouseOnDownUpEvent();
        EVENT.captureEvent();
      })
      .then(() => {
        //1초에 한번씩 하이라이트를 다시 생성한다.
        setInterval(() => {
          CORE.printHighlight(GLOBAL_CONFIG.HIGHLIGHT_LIST);
        }, 1000);
      })
      .then(() => {
        COMMON.detectSite();
      });
  }
};

export { ACTION, EVENT, CONTENT_ACTION };
