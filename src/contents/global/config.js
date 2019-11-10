let GLOBAL_CONFIG = {
  ELEMENT: null,
  GROUP_ELEMENT: "hl-group",
  TARGET_ELEMENT: "body", //targetElement
  HL_TAG_NAME: "wafflepen-highlight", //tagName
  HL_ID_NAME: "wafflepen-id", //idName
  IS_LOGIN: true,
  URL_TYPE: '',
  PREV_NEXT_OFFSET: 20, //prevNextOffset
  CURRENT_MOUSE_STATUS: '', //currentFlag
  HIGHLIGHT_POINT: false, //highlightPoint
  PAGE_NUMBER: 0,
  SELECT_RANGE_TEXT: '',
  SELECT_RANGE_TEXT_PREV: '',
  SELECT_RANGE_TEXT_NEXT: '',
  SELECT_START: 0,
  SELECT_END: 0,
  SELECT_IMAGE: '',
  MOUSE_CLICK_ID: '',
  INCREMENT_IDX: 0, //incrementIDx
  CURRENT_IDX: new Date().getTime(),//currentIdx
  MEMO_LIST: new Map(),
  HIGHLIGHT_LIST: new Array(),
  HIGHLIGHT_FALI_LIST: new Array(),
  USE_CURRENT_SITE: 'N' //useSite
};
export default GLOBAL_CONFIG;
