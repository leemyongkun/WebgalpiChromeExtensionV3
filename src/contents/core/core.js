import GLOBAL_CONFIG from '../global/config.js';

let $ = require('jquery');

let CORE = {
  getStartEndOffset: element => {
    return new Promise(res => {
      let doc = element.ownerDocument; //해당 요소를 포함하는 최상위의 문서 개체를 참조(노드가 속해 있는 Document 인터페이스를 구현하는 객체를 돌려주는 프로퍼티)
      let win = doc.defaultView;
      let range = win.getSelection().getRangeAt(0);
      let preSelectionRange = range.cloneRange();

      preSelectionRange.selectNodeContents(element);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);

      let start = preSelectionRange.toString().length;

      let prev = start - GLOBAL_CONFIG.PREV_NEXT_OFFSET;
      let end = start + range.toString().length;
      let next = end + GLOBAL_CONFIG.PREV_NEXT_OFFSET;


      let hlPrev = $(GLOBAL_CONFIG.ELEMENT).text().substring(prev, start);
      let hlNext = $(GLOBAL_CONFIG.ELEMENT).text().substring(end, next);

      let ret = {
        'start': start,
        'end': end,
        'hlText': range.toString(),
        'hlPrev': hlPrev,
        'hlNext': hlNext,
      };
      res(ret);

    });
  }
};

export default CORE;