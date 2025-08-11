let GLOBAL_CONFIG = {
  //HIGHLIGHT_POINT: false, //highlightPoint
  ELEMENT: null,
  GROUP_ELEMENT: "webgalpi-group",
  CAPTURE_ELEMENT: "webgalpi-capture-area",
  CAPTURE_BUTTON_ID: "webgalpi-capture-button",
  TARGET_ELEMENT: "body", //targetElement
  HL_TAG_NAME: "webgalpi-tag", //custom-tagName :wafflepen-highlight /
  HL_ID_NAME: "webgalpi-id", //idName
  IS_LOGIN: true,
  URL_TYPE: "",
  PREV_NEXT_OFFSET: 20, //prevNextOffset
  CURRENT_MOUSE_STATUS: "", //currentFlag
  PAGE_NUMBER: 0,
  SELECT_RANGE_TEXT: "",
  SELECT_RANGE_TEXT_PREV: "",
  SELECT_RANGE_TEXT_NEXT: "",
  SELECT_START: 0,
  SELECT_END: 0,
  SELECT_IMAGE: "",
  MOUSE_CLICK_ID: "", //mouseClickId
  MOUSE_OVER_ID: 0, //mouseOverId : mouseOver된 Id가 저장된다. (currentIdx로부터 할당받는다.), 만약 currentIdx와 mouseOverId가 같다면 팔렛트를 보여주지 않도록 하기위함이다. // core.js.line.137
  INCREMENT_IDX: 0, //incrementIDx
  CURRENT_IDX: new Date().getTime(), //currentIdx
  MEMO_LIST: new Map(),
  HIGHLIGHT_LIST: new Array(),
  HIGHLIGHT_FALI_LIST: new Array(),
  USE_CURRENT_SITE: "N", //useSite
  SITE_OPEN: "Y", //사이트가 Lock 걸려있는지 확인.
  SITE_INFO: null,
  MOUSE_POSISION_EVENT: null,
  CURRENT_COLOR: null //currentColor
};

let URL = {
  TYPE: "",
  KEY: "",
  SITE: "" //URL
};

let STATUS = {
  rangeCollapse: false,
  checkHighlightArea: 0,
  widgetArea: 0,
  mouseDownFlag: false,
  mouseUpId: null,
  mouseDownId: null
};

let USER_INFO = {
  EMAIL: null
};
let ELEMENT = {};

export { GLOBAL_CONFIG, URL, STATUS, USER_INFO, ELEMENT };
