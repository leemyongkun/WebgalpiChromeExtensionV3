import { GLOBAL_CONFIG, URL } from "../global/config.js";
import HIGHLIGT_CORE from "./hl-core.js";
import { EVENT } from "../action.js";

let $ = require("jquery");

let CORE = {
  printHighlight: async list => {
    for (let i = 0; i < list.length; i++) {
      //카운트를 넣는다.(DEL)
      /*if (list[i].FL_READERMODE == 'Y') readermodeCount++; else highlightCount++;*/

      let str = "";
      let original = $(GLOBAL_CONFIG.TARGET_ELEMENT).text();
      str = list[i].PREV + list[i].TEXT + list[i].NEXT;
      let start = original.indexOf(str);

      let end = start + str.length;
      let hlTF = true;
      if (start < 0) {
        hlTF = false;
      }
      if (list[i].PREV != "") {
        start = start + GLOBAL_CONFIG.PREV_NEXT_OFFSET;
        end = end - GLOBAL_CONFIG.PREV_NEXT_OFFSET;
      }
      // console.log(" start, end", start, end);

      if (hlTF) {
        await CORE.setSelectionRange(GLOBAL_CONFIG.ELEMENT, start, end);
        await CORE.setHighlightColor(list[i].TEXT, list[i].COLOR, list[i].IDX);

        //메모값 담아두기
        GLOBAL_CONFIG.MEMO_LIST.set(list[i].IDX, list[i].MEMO);
      } else {
        GLOBAL_CONFIG.HIGHLIGHT_FALI_LIST.push(list[i]);
      }

      //위젯에 담기 (Defulat / readermode)
      /*HlWidgetAction.appendHighlightWidget(list[i], hlTF, list[i].FL_READERMODE);*/

      //전체 하이라이팅을 담는다.
      /*HlWidgetAction.appendHighlightWidget(list[i], hlTF, "ALL");*/

      //메모 위젯에 담기
      /*if (list[i].MEMO != '') {
                memoCount++;
                HlWidgetAction.appendMemoWidget(list[i].IDX, list[i].MEMO, Util.getTimeString(list[i].DATE_CREATE));
            }*/

      //이미지에 하이라이팅 하기
      /*if ($.trim(list[i].IMAGE) != '') {
                GLOBAL_CONFIG.SELECT_IMAGE = list[i].IMAGE.split(' ');
                HighlightCore.setImageHighlight(list[i].IMAGE);
                imageCount += HlWidgetAction.appendImageWidget(list[i]);
            }*/

      //메모가 있는경우, 메모 아이콘 표시
      /*if (list[i].MEMO != '') {
                var destItem = $('[' + HighlightData.idName + '="' + list[i].IDX + '"]')[0];
                $(destItem).addClass('wf-memo');
            }*/
    }

    let interval = setInterval(() => {
      //todo : 해야함 >> dynamicLoadingItems();
    }, 3000);
  },
  getStartEndOffset: element => {
    return new Promise(res => {
      let doc = element.ownerDocument; // 해당 요소를 포함하는 최상위의 문서 개체를 참조(노드가 속해 있는 Document 인터페이스를 구현하는 객체를 돌려주는 프로퍼티)
      let win = doc.defaultView;
      let range = win.getSelection().getRangeAt(0);
      let preSelectionRange = range.cloneRange();

      preSelectionRange.selectNodeContents(element);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);

      let start = preSelectionRange.toString().length;

      let prev = start - GLOBAL_CONFIG.PREV_NEXT_OFFSET;
      let end = start + range.toString().length;
      let next = end + GLOBAL_CONFIG.PREV_NEXT_OFFSET;

      let hlPrev = $(GLOBAL_CONFIG.ELEMENT)
        .text()
        .substring(prev, start);
      let hlNext = $(GLOBAL_CONFIG.ELEMENT)
        .text()
        .substring(end, next);

      let ret = {
        start: start,
        end: end,
        hlText: range.toString(),
        hlPrev: hlPrev,
        hlNext: hlNext
      };
      res(ret);
    });
  },
  executeHighlight: async param => {
    let original = $(GLOBAL_CONFIG.TARGET_ELEMENT).text();
    let str = param.PREV + param.TEXT + param.NEXT;
    let start = original.indexOf(str);
    let end = start + str.length;
    let hlTF = true;
    if (start < 0) {
      hlTF = false;
    }
    if (param.PREV !== "") {
      start = start + GLOBAL_CONFIG.PREV_NEXT_OFFSET;
      end = end - GLOBAL_CONFIG.PREV_NEXT_OFFSET;
    }

    if (hlTF) {
      await CORE.setSelectionRange(GLOBAL_CONFIG.ELEMENT, start, end);
      await CORE.setHighlightColor(param.TEXT, param.COLOR, param.IDX); //return hlidx
      // 메모값 담아두기
      GLOBAL_CONFIG.MEMO_LIST.set(param.IDX, param.MEMO);
    } else {
      GLOBAL_CONFIG.HIGHLIGHT_FALI_LIST.push(param);
    }
  },
  setSelectionRange: (element, start, end) => {
    return new Promise(function(res, rej) {
      let doc = element.ownerDocument;
      let win = doc.defaultView;
      let charIndex = 0;
      let range = doc.createRange();
      range.setStart(element, 0);
      range.collapse(true);

      let nodeStack = [element];
      let node;
      let foundStart = false;
      let stop = false;

      while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType === 3) {
          let nextCharIndex = charIndex + node.length;
          if (!foundStart && start >= charIndex && start <= nextCharIndex) {
            range.setStart(node, start - charIndex);
            foundStart = true;
          }
          if (foundStart && end >= charIndex && end <= nextCharIndex) {
            range.setEnd(node, end - charIndex);
            stop = true;
          }
          charIndex = nextCharIndex;
        } else {
          let i = node.childNodes.length;
          while (i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }

      let sel = win.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      CORE.getStartEndOffset(GLOBAL_CONFIG.ELEMENT).then(function(ret) {
        res(ret);
        // eslint-disable-next-line prefer-promise-reject-errors
        rej(false);
      });
    });
  },
  setHighlightColor: (text, color, idx) => {
    return new Promise(function(res, rej) {
      let doc = GLOBAL_CONFIG.ELEMENT.ownerDocument; // 해당 요소를 포함하는 최상위의 문서 개체를 참조(노드가 속해 있는 Document 인터페이스를 구현하는 객체를 돌려주는 프로퍼티)
      let win = doc.defaultView;
      if (!win.getSelection().isCollapsed) {
        let range = win.getSelection().getRangeAt(0);
        // eslint-disable-next-line no-undef
        HIGHLIGT_CORE.execute(
          range,
          color,
          GLOBAL_CONFIG.HL_TAG_NAME,
          idx,
          text
        ).then(function() {
          console.log("in mouseOnOverEvent");
          win.getSelection().removeAllRanges();
          $("[" + GLOBAL_CONFIG.HL_ID_NAME + '="' + idx + '"]')
            .unbind("mouseover")
            .on("mouseover", EVENT.mouseOnOverEvent); //
        });
      }
      res(idx);
      rej(false);
    });
  }
};

export default CORE;
