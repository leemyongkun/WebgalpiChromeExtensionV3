//GLOBALS
//globals for classMausWork
import JCROP from "./jcrop/jcrop";

let gSelectedElement; //currently only one selection
let gHoverElement; //whatever element the mouse is over
let gHovering = false; //mouse is over something
let gObjArrMW = []; //global array of classMausWork objects.  for removing event listeners when done selecting.

//extended
let infoDiv; //currently just container for InfoDivHover, might add more here
let infoDivHover; //container for hoverText text node.
let hoverText; //show information about current element that the mouse is over
//const EXPERIMENTAL_NEW_CODE=true;	//debugging. new features.
let $ = require("jquery");

//START
let SELECTION = {
  init: () => {
    SetupDOMSelection();
  }
};

//(Section 1) Element Selection
function SetupDOMSelection() {
  {
    //setup event listeners
    //let pathx="//div | //span | //table | //td | //tr | //ul | //ol | //li | //p";
    let pathx =
      "//div | //span | //table | //tbody | //th | //td | //tr | //ul | //ol | //li | //p | //iframe | //h5 | //h4 | //h3 | //h2 | //h1 | //pre | //code | //dl | //dt | //blockquote | //b";
    let selection = $XPathSelect(pathx);
    for (let element, i = 0; (element = selection(i)); i++) {
      if (
        element.tagName.match(
          /^(div|span|table|tbody|td|tr|ul|ol|li|p|h5|h4|h3|h2|h1|pre|code|iframe|dl|dt|blockquote|b)$/i
        )
      ) {
        //redundant check.
        let m = new classMausWork(element);
        gObjArrMW.push(m);
        attachMouseEventListeners(m);
      }
    }

    document.body.addEventListener("mousedown", MiscEvent, false);
    document.body.addEventListener("mouseover", MiscEvent, false);
    document.body.addEventListener("mouseout", MiscEvent, false);
    document.addEventListener("keypress", MiscEvent, false);
    //ykleem@20180912 - esc key event
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" || event.keyCode === 27) {
        escCleanupDOMSelection();
      }
    });
  }
  {
    //setup informational div to show which element the mouse is over.
    infoDiv = document.createElement("div");
    let s = infoDiv.style;
    s.position = "fixed";
    s.top = "0";
    s.right = "0";

    s.display = "block";
    s.width = "auto";
    s.padding = "0px";
    document.body.appendChild(infoDiv);
    infoDivHover = document.createElement("div");
    s = infoDivHover.style;
    s.fontWeight = "bold";
    s.padding = "3px";
    s.Opacity = "0.8";
    s.borderWidth = "thin";
    s.borderStyle = "solid";
    s.borderColor = "white";
    s.backgroundColor = "black";
    s.color = "white";

    infoDiv.appendChild(infoDivHover);
    hoverText = document.createTextNode("selecting");
    infoDivHover.appendChild(hoverText);
  }
}

function escCleanupDOMSelection() {
  $("#wafflepen-inspectBtn").removeClass("on");
  for (let m; (m = gObjArrMW.pop()); ) {
    detachMouseEventListeners(m);
  }
  document.body.removeEventListener("mousedown", MiscEvent, false);
  document.body.removeEventListener("mouseover", MiscEvent, false);
  document.body.removeEventListener("mouseout", MiscEvent, false);
  document.removeEventListener("keypress", MiscEvent, false);
}

function CleanupDOMSelection() {
  $("#wafflepen-inspectBtn").removeClass("on");
  for (let m; (m = gObjArrMW.pop()); ) {
    detachMouseEventListeners(m);
  }
  ElementRemove(infoDiv);
  document.body.removeEventListener("mousedown", MiscEvent, false);
  document.body.removeEventListener("mouseover", MiscEvent, false);
  document.body.removeEventListener("mouseout", MiscEvent, false);
  document.removeEventListener("keypress", MiscEvent, false);
}

function attachMouseEventListeners(c) {
  //c is object of class classMausWork
  c.element.addEventListener("mouseover", c.mouse_over, false);
  c.element.addEventListener("mouseout", c.mouse_out, false);
  c.element.addEventListener("mousedown", c.mouse_click, false);
}

function detachMouseEventListeners(c) {
  //c is object of class classMausWork
  c.resetElementStyle();
  c.element.removeEventListener("mouseover", c.mouse_over, false);
  c.element.removeEventListener("mouseout", c.mouse_out, false);
  c.element.removeEventListener("mousedown", c.mouse_click, false);
}

//mouse event  handling class for element, el.
function classMausWork(element) {
  //store information about the element this object is assigned to handle. element,  original style, etc.
  this.element = element;

  let elementStyle = element.getAttribute("style");
  let target;

  this.mouse_over = function(ev) {
    if ($(ev.target).closest("wafflepen").length) return false;

    if (gHovering) return;
    let e = element;
    let s = e.style;
    s.backgroundColor = "aliceblue";
    s.borderWidth = "thin";
    s.borderColor = "#03a9f4";
    s.boxShadow = "0px 0px 8px rgba(0, 0, 0, 0.3)";
    s.borderStyle = "dashed";

    InfoMSG(ElementInfo(e), "yellow", "blue", "yellow");
    gHoverElement = e;
    gHovering = true;
    target = ev.target;
    ev.stopPropagation();
  };

  this.mouse_out = function(ev) {
    if (!gHovering) return;
    if (gHoverElement != element || ev.target != target) return;
    let e = element;
    e.setAttribute("style", elementStyle);
    InfoMSG("-", "white", "black", "white");
    gHoverElement = null;
    gHovering = false;
    target = null;
    //ev.stopPropagation();
  };

  this.mouse_click = function(ev) {
    if (!gHovering) return;
    if (gHoverElement != element || ev.target != target) return;
    let e = element;
    e.setAttribute("style", elementStyle);
    ev.stopPropagation();
    CleanupDOMSelection();
    gHoverElement = null;
    gHovering = false;
    target = null;

    if (ev.button == 0) {
      gSelectedElement = e;
      ElementSelected(e); //finished selecting, cleanup then move to next part (section 2), element isolation.
    }
  };

  this.resetElementStyle = function() {
    element.setAttribute("style", elementStyle);
  };
}

function MiscEvent(ev) {
  //keypress, and mouseover/mouseout/mousedown event on body.  cancel selecting.
  if (ev.type == "mouseout" && !gHovering) {
    InfoMSG("-", "white", "black", "white");
  } else if (ev.type == "mouseover" && !gHovering) {
    InfoMSG("cancel", "yellow", "red", "yellow");
  } //keypress on document or mousedown on body, cancel ops.
  else {
    CleanupDOMSelection();
  }
}

function InfoMSG(text, color, bgcolor, border) {
  let s = infoDivHover.style;
  if (color) s.color = color;
  if (bgcolor) s.backgroundColor = bgcolor;
  if (border) s.borderColor = border;
  if (text) hoverText.data = text;
}

//(Section 2) Element Isolation
function ElementSelected(element) {
  //finished selecting element.  setup string to prompt user.
  // console.log("ElementInfo(element)",ElementInfo(element));
  //PromptUserXpath(ElementInfo(element));

  selectImage(element);
  /* let ret = confirm('이미지(Y) / 텍스트선택(N)');
    if(ret){
        selectImage(element);
    }else{
        selectText(element);
        //[todo] 블럭 하이라이팅 (리더모드와의 동기화 문제로 구현보류))
        //let xPath = getXPath(element);
        //element.style.backgroundColor='yellow';
        //element.classList.add('hlt-block-ready');
        //HighlightCore.mouseBlockAction(element);
    }  */
}

//ykleem@120181015 - element를 이용하여 XPATH를 가져오기
function getXPath(element) {
  let xpath = "";
  for (; element && element.nodeType == 1; element = element.parentNode) {
    let id =
      $(element.parentNode)
        .children(element.tagName)
        .index(element) + 1;
    id > 1 ? (id = "[" + id + "]") : (id = "");
    xpath = "/" + element.tagName.toLowerCase() + id + xpath;
  }
  return xpath;
}

//ykleem@120181015 - XPATH를 이용하여 element를 가져오기
function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function getNodeForXPath(STR_XPATH) {
  let xresult = document.evaluate(
    STR_XPATH,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  let xnodes = [];
  let xres;
  while ((xres = xresult.iterateNext())) {
    xnodes.push(xres);
  }
  return xnodes;
}

//ykleem@20180903 @ 이미지 다운로드
function toDataUrl(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function() {
    let reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}

function selectImage(element) {
  $("#wafflepen-inspectBtn").removeClass("on");

  let images = $(element).find("img"); // 인자로 받은 영역에 처리해야 할 img 태그 객체
  let procImageCount = 0; // 처리된 항목에 따라 count 될 변수

  $(images).each(function(idx, item) {
    let _img = $(item);

    //ykleem@20180912 - image
    if (
      $(item)
        .attr("src")
        .indexOf("data:image") == 0
    ) {
      procImageCount++;
      return true;
    }

    let imagePath = (function(obj) {
      if (
        $(obj)
          .attr("src")
          .indexOf("http") != 0
      ) {
        return $(obj).attr(
          "src",
          window.location.origin + "/" + $(obj).attr("src")
        );
      } else {
        return $(obj).attr("src");
      }
    })(item);

    toDataUrl(imagePath, function(myBase64) {
      let arrMyBase64 = myBase64.split(",");
      // 0 : 데이터 타입, 1 : 실제 데이터 코드
      // toDataUrl 함수에서 데이터를 처리 후 나오는 결과값의 데이터 타입부분은 해당 파일의 타입에 따라 다양하게 나올 수 있음.
      // html2canvas가 처리할 수 있는 데이터 타입으로 통일해서 src의 속성값을 지정해준다. (해당 데이터타입은 고정으로 변경해도 이미지를 출력하는 데에는 문제가 없음)
      $(_img).attr("src", "data:image/png;base64," + arrMyBase64[1]);
    });
    // 처리 완료 시 완료 count 증가
    procImageCount++;
  });

  // 0.5초 간격으로 처리
  let repeat = setInterval(function() {
    // 처리 count와 실제 <img> 태그의 갯수가 동일 (처리완료)
    if (procImageCount == images.length) {
      html2canvas($(element)[0]).then(canvas => {
        window
          .open()
          .document.write(
            '<img src="' + canvas.toDataURL("image/png") + '" />'
          );
        /* console.log(">>>>> " , canvas.toDataURL("image/png"));
                                let param = {
                                    "URL": global.URL,
                                    "URL_KEY": global.URL_KEY,
                                    "EMAIL"   : loginInfo.EMAIL,
                                    "CAPTURE" :  canvas.toDataURL("image/png")
                                }
                                let parameter = {
                                    "type" : 'capture',
                                    "data" : param
                                }
                                chrome.runtime.sendMessage(
                                    parameter, function(response) {}
                                );
*/
      });
      // 설정된 Interval 해제
      clearInterval(repeat);
    }
  }, 500);
}

function selectText(element) {
  let page = {
    pageY: $(element).offset().top,
    pageX: $(element).offset().left
  };

  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(element);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("Could not select text in node: Unsupported browser.");
  }
  HighlightCore.getStartEndOffset(HighlightData.element).then(function(offset) {
    HighlightData.selectStart = offset.start;
    HighlightData.selectEnd = offset.end;
    HighlightData.currentFlag = "drag";
    HighlightCore.mouseDragAction(page);
  });
}

function PromptUserXpath(defaultpath) {
  //prompt user, isolate element.
  let userpath = prompt("XPath of elements to isolate : ", defaultpath);
  if (userpath && userpath.length > 0) {
    let addPredicate =
      "[count(./ancestor-or-self::head)=0][count(./ancestor-or-self::title)=0]"; //exclude head & title elements from selection so they aren't removed
    let addPath = "//script | //form | //object | //embed"; //include these elements in selection for removal
    let pathx = TransformXPath_NoAncestorDescendentSelf(
      userpath,
      addPredicate,
      addPath
    ); //the xpath selection of all elements to be removed/deleted.

    try {
      let element;
      let elements = $XPathSelect(pathx);
      for (let i = 0; (element = elements(i)); i++) {
        if (!element.nodeName.match(/^(head|title)$/i)) {
          //redundant check.
          ElementRemove(element);
        }
      }
    } catch (err) {
      alert("wtf: " + err);
    }
  }
}

//support
function $XPathSelect(p, context) {
  if (!context) context = document;
  let i,
    arr = [],
    xpr = document.evaluate(
      p,
      context,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
  return function(x) {
    return xpr.snapshotItem(x);
  }; //closure.  wooot!  returns function-type array of elements (usually elements, or something else depending on the xpath expression).
}

function ElementRemove(e) {
  if (e) e.parentNode.removeChild(e);
}

function ElementInfo(element) {
  let txt = "";
  if (element) {
    txt = element.tagName.toLowerCase(); //txt=element.tagName;
    txt = attrib(txt, element, "id");
    txt = attrib(txt, element, "class");
    txt = "//" + txt;
  }
  return txt;

  function attrib(t, e, a) {
    if (e.hasAttribute(a)) {
      t += "[@" + a + "='" + e.getAttribute(a) + "']";
    }
    return t;
  }
}

//function to 'invert' the XPath by selecting all elements that are not ancestor and not descendent and not self.
function TransformXPath_NoAncestorDescendentSelf(
  u,
  includePredicates,
  includePaths
) {
  //sample input (u):					//div[@class='sortbox']
  //sample output						//*[  not(./descendant-or-self::*=//div[@class='sortbox'])][  not(./ancestor-or-self::*=//div[@class='sortbox'])]
  //sample output with additional conditions:		//*[  not(./descendant-or-self::*=//div[@class='sortbox'])][  not(./ancestor-or-self::*=//div[@class='sortbox'])][count(./ancestor-or-self::head)=0][count(./ancestor-or-self::title)=0]

  //obsolete method.  much faster but can only be used for limited types of (simple) xpath expressions -- unlike the current version, which should be able to convert any xpath.
  //input:			table[@id='topbar']
  //output:			//*[not(./descendant-or-self::table[@id='topbar']) and not(./ancestor-or-self::table[@id='topbar'])]
  //output (alternative):	//*[count(./descendant-or-self::table[@id='topbar'])=0 and count(./ancestor-or-self::table[@id='topbar'])=0]

  let o1 = "./descendant-or-self::*=" + gr(u);
  o1 = "not" + gr(o1);
  o1 = nt(o1);
  let o2 = "./ancestor-or-self::*=" + gr(u);
  o2 = "not" + gr(o2);
  o2 = nt(o2);
  let o = "//*" + o1 + o2;
  if (includePredicates && includePredicates.length > 0) o += includePredicates;
  if (includePaths && includePaths.length > 0) o += " | " + includePaths;
  return o;

  function nt(term) {
    return wrap(term, "[]");
  } //node test; predicate - enclose with bracket.
  function gr(term) {
    return wrap(term, "()");
  } //group - parenthesize.
  function wrap(term, enclosure) {
    return enclosure.charAt(0) + term + enclosure.charAt(1);
  }
}

export default SELECTION;
