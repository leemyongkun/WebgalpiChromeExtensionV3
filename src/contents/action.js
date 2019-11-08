import FORM from './form.js';
import GLOBAL_CONFIG from './global/config.js';
import GLOBAL_DATA from './global/data.js';
import URL from './global/url.js';

import CORE from './core/core.js';

let $ = require('jquery');

let CONTENT_ACTION = {
  createColorPicker: () => {
    return new Promise(res => {
      // 팔렛트를 생성
      let hlGroupElement = document.createElement(GLOBAL_CONFIG.GROUP_ELEMENT);
      hlGroupElement.innerHTML = FORM.CREATE_COLOR_PICKER();
      let targetElement = document.getElementsByTagName(GLOBAL_CONFIG.TARGET_ELEMENT)[0];
      targetElement.appendChild(hlGroupElement);

      res(true);
    });
  },
};

let VALIDATION_ACTION = {
  checkCurrentArea: (event, action) => {
    if (action === 'click') {
      if ($(event.target).closest('#highlight-toolbar').length === 0) {
        $('#highlight-toolbar').hide();
      }
    } else if (action === 'mousedown') {
      if (window.getSelection().isCollapsed === false && $(event.target).attr(GLOBAL_CONFIG.HL_ID_NAME) === undefined) {
        // mousedownPalleteView = true;
      }
    }

    // 부모중에 waffle-widget-form(위젯폼)이 있을 경우 하이라이팅을 하지 않음.
    STATUS.widgetArea += $(event.target).closest(GLOBAL_CONFIG.GROUP_ELEMENT).length;
    // 부모중에 리더모드 코멘트 영역일 경우 하이라이팅을 하지 않음.
    STATUS.widgetArea += $(event.target).closest('#waf-comment-containers').length;

    // 리드모드 일경우, 타이틀에 해당하는 영역이 있으면 하이라이팅을 하지 않음.
    STATUS.checkHighlightArea += $(event.target).closest('.wf-title').length;
    STATUS.checkHighlightArea += $(event.target).find('.wf-title').length;

    return true;
  },
};

let STATUS = {
  checkHighlightArea: 0,
  widgetArea: 0,
  mouseDownFlag: false,
  mouseUpId: null,
  mouseDownId: null,
};

let EVENT = {
  mouseOnDownUpEvent: () => {
    // urlInitConfig();

    $(GLOBAL_CONFIG.TARGET_ELEMENT)
      .unbind('mousedown')
      .on('mousedown', function(event) {

        if (event.which === 3) return false; // 우클릭

        this.widgetArea = 0;

        // 하이라이팅 영역을 체크한다.
        VALIDATION_ACTION.checkCurrentArea(event, 'mousedown');

        // STATUS.mouseDownId = $(event.target).attr(HighlightData.idName);

        // 드래그한영역에 wafflepen 태그가 있을경우를 체크한다.
        if (event.target.nodeName === GLOBAL_CONFIG.HL_TAG_NAME.toUpperCase()) {
          STATUS.mouseDownFlag = true;
        }
      })
      .unbind('mouseup')
      .on('mouseup', async event => {

        // 클릭된 영역의 ID를 저장한다.
        // (textarea 영역, 즉 highlightMemoArea일경우, 다른 하이라이트 영역에 mouseover를 해도 팔렛트를 재생성 하지 않는다.)
        GLOBAL_DATA.MOUSE_CLICK_ID = $(event.target).attr('id');

        console.log($(event.target).closest('#highlight-toolbar').length)
        // 클릭할때마다 mouseup 이벤트가 함께 동작하므로, toolbar를 클릭할때에는 동작하지 않도록 한다.
        if ($(event.target).closest('#highlight-toolbar').length > 0) {
          return false;
        }

        // 하이라이팅 영역을 체크한다.
        VALIDATION_ACTION.checkCurrentArea(event, 'click');

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
        let rangeHtml = customTag.innerHTML.indexOf('</' + GLOBAL_CONFIG.HL_TAG_NAME + '>');

        if (rangeHtml !== -1 || STATUS.mouseDownFlag || event.target.nodeName === GLOBAL_CONFIG.HL_TAG_NAME.toUpperCase()) {
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

        console.log('offset ', offset);

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

        FORM.SHOW_PICKER(event); // todo 가장 중요!!

        // pdf 페이지 번호
        if (URL.TYPE === 'PDF') {
          GLOBAL_DATA.PAGE_NUMBER = $(event.target)
            .closest('.page')
            .attr('data-page-number');
        } else {
          GLOBAL_DATA.PAGE_NUMBER = 0; // 없음.
        }

        GLOBAL_DATA.SELECT_RANGE_TEXT = offset.hlText;
        GLOBAL_DATA.SELECT_RANGE_TEXT_PREV = offset.hlPrev;
        GLOBAL_DATA.SELECT_RANGE_TEXT_NEXT = offset.hlNext;
        GLOBAL_DATA.SELECT_START = offset.start;
        GLOBAL_DATA.SELECT_END = offset.end;

        // 마우스 업했을때 최종 Doc 사이즈를 저장해둔다.
        // HighlightData.mouseUpDocTotalSize = $(HighlightData.targetElement).text().length

        // 드래그한 영역의 이미지가 있으면 이미지Path를 가져온다.
        let imageRange = window.getSelection().getRangeAt(0);
        let imageContent = imageRange.cloneContents();
        let images = imageContent.querySelectorAll('img');
        if (images != null) {
          let list = new Array();
          $(images)
            .each(function(idx, item) {
              list.push(item.currentSrc);
            })
            .promise()
            .then(function() {
              GLOBAL_DATA.SELECT_IMAGE = list.join(' ');
            });
        }

        STATUS.checkHighlightArea = 0;
        // });
      });
  },
  colorPickerBtnEvent: () => {
    $('#highlight-toolbar')
      .find('.wafflepen-color-picker a')
      .each(function(idx, item) {
        $(item)
          .unbind('click')
          .on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();

            // 로그인 되어있지 않다면 위젯을 열어준다.
            /* if (!HighlightData.isLogin) {
                HlLayerAction.loginCheckLayer();
                return false;
            } */

            let _this = this;
            // 이미 선택되어진 컬러의 경우..
            if ($(_this).hasClass('on')) {
              // 하이라이팅을 삭제
              let msg = Message.DeleteHighlighting[LANG];
              if ($('#highlightMemoArea').val() != '') {
                msg = '삭제?'; // Message.DeleteHighlightingWithMemo[LANG];
              }

              if (confirm(msg)) {
                highlightAjaxListener.deleteItem(HighlightData.currentIdx).then(res => {
                  if (res.status === 0) {
                    execute.deleteItem(res);
                    // Fail된 하이라이팅에서 삭제한다.
                  } else {
                    alert(Message.DeleteHighlightingFail[LANG]);
                  }
                });
              }
              return false;
            }

            let color = $(_this).attr('class'); // hltcolor-x 값을 가져옴
            let colorTF = false;

            $('#highlight-toolbar')
              .find('.wafflepen-color-picker a')
              .each((idx, item) => {
                if ($(item).hasClass('on')) {
                  colorTF = true;
                }
              })
              .promise()
              .then(function() {
                // 저장한다.
                if (colorTF) {
                  // 클릭할 경우 수정
                  let memo = $.trim($('#highlightMemoArea').val());
                  let idx = HighlightData.currentIdx;

                  if (HighlightData.currentFlag == 'block') {
                    highlightAjaxListener.updateBlock(idx, color, memo);
                  } else {
                    // drag 일경우
                    highlightAjaxListener.updateItem(idx, color, memo).then(res => {
                      execute.updateItem(res);
                    });
                  }
                } else {
                  // click
                  // 드래그 할경우 생성
                  if (HighlightData.currentFlag == 'block') {
                    highlightAjaxListener.insertBlock(color, HighlightData.element);
                  } else {
                    // drag일경우
                    highlightAjaxListener.insertItem(color, HighlightData.element).then(function() {
                      WidgetFormBtnEvent.simpleWidgetBookmarkLoadingHide();
                    });
                  }
                }
              });
          });
      });
  },
};

let Action = {
  init: data => {
    console.log('data ', data);

    if (data == null) {
      return false;
    }

    GLOBAL_CONFIG.ELEMENT = document.getElementsByTagName(GLOBAL_CONFIG.TARGET_ELEMENT)[0];

    // 팔렛트 생성
    CONTENT_ACTION.createColorPicker()
      .then(ret => {
        console.log('ret ', ret);
        // todo 캡쳐관련 form 등록

        // todo 버튼 이벤트
        EVENT.colorPickerBtnEvent();
      })
      .then(() => {
        EVENT.mouseOnDownUpEvent();
      });
  },
};

export default Action;
