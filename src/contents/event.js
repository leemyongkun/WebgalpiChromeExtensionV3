let $ = require("jquery");

import { GLOBAL_CONFIG, STATUS } from "./global/config";
import FORM from "./form";
import CORE from "./core/core";
import JCROP from "../lib/jcrop/jcrop";
import CONTENTS from "./contents";

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
  highlightClickEvent: e => {
    //mouseOnOverEvent

    //클릭한 영역이 textarea 영역이면 팔렛트를 고정한다.
    //if (GLOBAL_CONFIG.MOUSE_CLICK_ID === "highlightMemoArea") return false;

    /* 현재 하이라이팅의 ID를 넣는다.*/
    GLOBAL_CONFIG.CURRENT_IDX = parseInt(
      $(e.target).attr(GLOBAL_CONFIG.HL_ID_NAME)
    );

    //같은 highlight Id의 영역에 마우스를 올렸을 경우, 다른 ID에 올리기 전까지 유지된다.(혹은 다른곳을 클릭하기 전까지 유지된다.)
    /*if (GLOBAL_CONFIG.MOUSE_OVER_ID != GLOBAL_CONFIG.CURRENT_IDX) {
                $("#highlight-toolbar").hide();
            } else {
                return false;
            }*/

    GLOBAL_CONFIG.MOUSE_OVER_ID = GLOBAL_CONFIG.CURRENT_IDX;

    /*레이어초기화*/
    let color = $(e.target)
      .attr("class")
      .split(" ")[0];
    $("#highlight-toolbar")
      .find("a")
      .removeClass("on");
    $("#highlight-toolbar")
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
    CONTENTS.initUrlInfo(); //urlInitConfig();

    $(GLOBAL_CONFIG.TARGET_ELEMENT)
      .unbind("mousedown")
      .on("mousedown", function(event) {
        if (event.which === 3) return false; // 우클릭

        this.widgetArea = 0;

        // 하이라이팅 영역을 체크한다.
        CONTENTS.checkCurrentArea(event, "mousedown");

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
        CONTENTS.checkCurrentArea(event, "click");

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
        if (selection.focusOffset === 0) return false;
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

        CONTENTS.setHighlightRangeInfoData(event, offset);
        FORM.showPicker(event); // todo 가장 중요!!

        STATUS.checkHighlightArea = 0;
        // });
      });
  },
  colorPickerBtnEvent: () => {
    $("#highlight-toolbar")
      .find("a")
      .each(function(idx, item) {
        $(item)
          .unbind("click")
          .on("click", function(e) {
            console.log("a click event ", e);

            e.stopPropagation();
            e.preventDefault();

            let _this = this;
            let color = $(_this).attr("class"); // hltcolor-x 값을 가져옴
            let colorTF = false;

            console.log("colorPicker ", color);

            // 이미 선택되어진 컬러의 경우..
            if ($(_this).hasClass("on")) {
              // 하이라이팅을 삭제
              let msg = "are you sure you want to delete the highlight?";

              if (confirm(msg)) {
                CONTENTS.deleteHighlight(GLOBAL_CONFIG.CURRENT_IDX);
                let highlightList = GLOBAL_CONFIG.HIGHLIGHT_LIST;
                GLOBAL_CONFIG.HIGHLIGHT_LIST = highlightList.filter(item => {
                  return item.IDX != GLOBAL_CONFIG.CURRENT_IDX;
                });
                return false;
              }
            }

            $("#highlight-toolbar")
              .find("a")
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
                  CONTENTS.updateHighlight(color, GLOBAL_CONFIG.CURRENT_IDX);
                } else {
                  //저장한다.
                  CONTENTS.createHighlight(color, GLOBAL_CONFIG.ELEMENT);
                }
              });
          });
      });
  },
  captureEvent: () => {
    console.log("## captureEvent");

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
      var onSelectCount = 0;
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

            jcropApi.animateTo([0, 0, 0, 0]);
          },
          onChange: function(e) {
            //console.log('>>> onchange ', e)
          },
          onSelect: function(position) {
            if (onSelectCount == 0) {
              onSelectCount++;
              return false;
            }
            console.log(">>>  onSelect ", position);

            //Button 생성
            /*console.log("document.getElementById(GLOBAL_CONFIG.CAPTURE_BUTTON_ID) ", document.getElementById(GLOBAL_CONFIG.CAPTURE_BUTTON_ID));
                                    if (document.getElementById(GLOBAL_CONFIG.CAPTURE_BUTTON_ID) == null) {
                                        let captureButtonElement = document.createElement("button");
                                        captureButtonElement.innerText = "CAPTURE";
                                        captureButtonElement.id = GLOBAL_CONFIG.CAPTURE_BUTTON_ID;
                                        captureButtonElement.style.marginTop = "5px";
                                        $('.ord-s.jcrop-dragbar').append(captureButtonElement);

                                    } else {
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

            /*  document.addEventListener('keydown', event => {
                                        if (event.key === 'Escape' || event.keyCode === 27) {
                                            console.log("ESC")
                                            $(GLOBAL_CONFIG.CAPTURE_ELEMENT).remove();
                                            let rootElement = document.getElementsByTagName("html")[0];
                                            rootElement.style.overflow = "visible";
                                        }
                                    });*/
          }
        },
        function() {
          jcropApi = this;
        }
      );

      setTimeout(function() {
        console.log("jcropApi ", jcropApi);
      }, 1000);
    });
  }
};

export default EVENT;
