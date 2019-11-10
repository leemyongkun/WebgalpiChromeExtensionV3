import GLOBAL_CONFIG from '../global/config.js';
import HIGHLIGT_CORE from './hl-core.js';

let $ = require('jquery');

let CORE = {
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
        hlNext: hlNext,
      };
      res(ret);
    });
  },
  executeHighlight: async param => {
    let original2 = $(GLOBAL_CONFIG.TARGET_ELEMENT).text();
    let str = param.PREV + param.TEXT + param.NEXT;
    let start = original2.indexOf(str);
    let end = start + str.length;
    let hlTF = true;
    let hlidx;
    if (start < 0) {
      hlTF = false;
    }
    if (param.PREV !== '') {
      start = start + GLOBAL_CONFIG.PREV_NEXT_OFFSET;
      end = end - GLOBAL_CONFIG.PREV_NEXT_OFFSET;
    }
    // console.log("hlTF " , hlTF, start , end,str);
    if (hlTF) {
      await CORE.setSelectionRange(GLOBAL_CONFIG.ELEMENT, start, end);
      hlidx = await CORE.setHighlightColor(param.TEXT, param.COLOR, param.IDX);
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
        HIGHLIGT_CORE.execute(range, color, GLOBAL_CONFIG.HL_TAG_NAME, idx, text).then(function() {
          win.getSelection().removeAllRanges();
          $('[' + GLOBAL_CONFIG.HL_ID_NAME + '="' + idx + '"]')
            .unbind('mouseover')
            .on('mouseover', HighlightCore.mouseOverAction);
        });
      }
      res(idx);
      rej(false);
    });
  },
};

export default CORE;
