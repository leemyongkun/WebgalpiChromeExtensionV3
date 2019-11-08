let $ = require("jquery");
import FORM from "./form.js";
import GLOBAL_CONFIG from "./config.js";

let ContentAction = {
  createColorPicker: () => {
    return new Promise(res => {
      //팔렛트를 생성
      let hl_group_element = document.createElement(
        GLOBAL_CONFIG.GROUP_ELEMENT
      );
      hl_group_element.innerHTML = FORM.PANEL();
      let targetElement = document.getElementsByTagName(
        GLOBAL_CONFIG.TARGET_ELEMENT
      )[0];
      targetElement.appendChild(hl_group_element);

      res(true);
    });
  }
};

let Event = {
  colorPickerBtnEvent: function() {
    $("#highlight-toolbar")
      .find(".wafflepen-color-picker a")
      .each(function(idx, item) {
        $(item)
          .unbind("click")
          .on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();

            //로그인 되어있지 않다면 위젯을 열어준다.
            /*if (!HighlightData.isLogin) {
                    HlLayerAction.loginCheckLayer();
                    return false;
                }*/

            let _this = this;
            //이미 선택되어진 컬러의 경우..
            if ($(_this).hasClass("on")) {
              //하이라이팅을 삭제
              let msg = Message.DeleteHighlighting[LANG];
              if ($("#highlightMemoArea").val() != "") {
                msg = "삭제?"; //Message.DeleteHighlightingWithMemo[LANG];
              }

              if (confirm(msg)) {
                highlightAjaxListener
                  .deleteItem(HighlightData.currentIdx)
                  .then(res => {
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

            let color = $(_this).attr("class"); //hltcolor-x 값을 가져옴
            let colorTF = false;

            $("#highlight-toolbar")
              .find(".wafflepen-color-picker a")
              .each((idx, item) => {
                if ($(item).hasClass("on")) {
                  colorTF = true;
                }
              })
              .promise()
              .then(function() {
                //저장한다.
                if (colorTF) {
                  //클릭할 경우 수정
                  let memo = $.trim($("#highlightMemoArea").val());
                  let idx = HighlightData.currentIdx;

                  if (HighlightData.currentFlag == "block") {
                    highlightAjaxListener.updateBlock(idx, color, memo);
                  } else {
                    //drag 일경우
                    highlightAjaxListener
                      .updateItem(idx, color, memo)
                      .then(res => {
                        execute.updateItem(res);
                      });
                  }
                } else {
                  //click
                  //드래그 할경우 생성
                  if (HighlightData.currentFlag == "block") {
                    highlightAjaxListener.insertBlock(
                      color,
                      HighlightData.element
                    );
                  } else {
                    //drag일경우
                    highlightAjaxListener
                      .insertItem(color, HighlightData.element)
                      .then(function() {
                        WidgetFormBtnEvent.simpleWidgetBookmarkLoadingHide();
                      });
                  }
                }
              });
          });
      });
  }
};

let Action = {
  init: data => {
    console.log("data ", data);

    if (data == null) {
      return false;
    }

    //팔렛트 생성
    ContentAction.createColorPicker().then(ret => {
      console.log("ret ", ret);
      //todo 캡쳐관련 form 등록

      //todo 버튼 이벤트
      Event.colorPickerBtnEvent();
    });
  }
};

export default Action;
