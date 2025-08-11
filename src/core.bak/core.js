var HighlightCore = {
  setImageHighlight: item => {
    var itemImgs = item.split(" ");
    var docImgs = $(document).find("img");
    $(docImgs).each(function(idx, docImg) {
      if (itemImgs.includes(docImg.src)) {
        $(docImg).addClass("wf-img");
        $(docImg).attr("wafflepen-image-id", item.IDX);
      }
    });
  },
  setColor: async function(text, color, id) {
    return new Promise(function(res, rej) {
      var doc = HighlightData.element.ownerDocument; //해당 요소를 포함하는 최상위의 문서 개체를 참조(노드가 속해 있는 Document 인터페이스를 구현하는 객체를 돌려주는 프로퍼티)
      var win = doc.defaultView;
      if (!win.getSelection().isCollapsed) {
        var range = win.getSelection().getRangeAt(0);
        highlightRange(range, color, HighlightData.tagName, id, text).then(
          function() {
            win.getSelection().removeAllRanges();
            $("[" + HighlightData.idName + '="' + id + '"]')
              .unbind("mouseover")
              .on("mouseover", HighlightCore.mouseOverAction);
          }
        );
      }
      res(id);
      rej(false);
    });
  },
  setDocumentSize: function() {
    var element = HighlightData.element;
    var doc = element.ownerDocument;
    var win = doc.defaultView;
    var range = doc.createRange();
    range.setStart(element, 0);
    var preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(element);
    HighlightData.documentSize = preSelectionRange.toString().length;
  },
  getStartEndOffset: function(element) {
    return new Promise(function(res, rej) {
      var doc = element.ownerDocument; //해당 요소를 포함하는 최상위의 문서 개체를 참조(노드가 속해 있는 Document 인터페이스를 구현하는 객체를 돌려주는 프로퍼티)
      var win = doc.defaultView;
      var range = win.getSelection().getRangeAt(0);
      var preSelectionRange = range.cloneRange();

      preSelectionRange.selectNodeContents(element);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);

      var start = preSelectionRange.toString().length;

      var prev = start - HighlightData.PrevNextOffset;
      var end = start + range.toString().length;
      var next = end + HighlightData.PrevNextOffset;

      var hlPrev = $(HighlightData.element)
        .text()
        .substring(prev, start);
      var hlNext = $(HighlightData.element)
        .text()
        .substring(end, next);

      var ret = {
        start: start,
        end: end,
        hlText: range.toString(),
        hlPrev: hlPrev,
        hlNext: hlNext
      };
      res(ret);
      rej(false);
    });
  },
  setSelectionRange: async function(element, start, end) {
    return new Promise(function(res, rej) {
      var doc = element.ownerDocument,
        win = doc.defaultView;
      var charIndex = 0,
        range = doc.createRange();
      range.setStart(element, 0);
      range.collapse(true);

      var nodeStack = [element],
        node,
        foundStart = false,
        stop = false;

      while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType == 3) {
          var nextCharIndex = charIndex + node.length;
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
          var i = node.childNodes.length;
          while (i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }

      var sel = win.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      HighlightCore.getStartEndOffset(HighlightData.element).then(function(
        ret
      ) {
        res(ret);
        rej(false);
      });
    });
  },
  isNumber: function(s) {
    s += "";
    s = s.replace(/^\s*|\s*$/g, "");
    if (s == "" || isNaN(s)) return false;
    return true;
  },
  mouseOverAction: function(e) {
    /* 현재 하이라이팅의 ID를 넣는다.*/
    HighlightData.currentIdx = parseInt($(e.target).attr(HighlightData.idName));

    //같은 highlight Id의 영역에 마우스를 올렸을 경우, 다른 ID에 올리기 전까지 유지된다.(혹은 다른곳을 클릭하기 전까지 유지된다.)
    if (HighlightData.mouseOverId != HighlightData.currentIdx) {
      $("#webgalpi-highlight-toolbar").hide();
      $("#webgalpi-highlight-update-toolbar").hide();
    } else {
      return false;
    }

    /*레이어초기화*/
    var layerValue = HlLayerAction.colorClickAction(e);
    HighlightData.currentColor = layerValue.color;

    HighlightData.mouseOverId = HighlightData.currentIdx;
    var selectorTarget = $(
      "[" + HighlightData.idName + '="' + HighlightData.currentIdx + '"]'
    )[0];

    HighlightData.highlightPoint = true;

    //하이라이팅의 가장 앞에서 노출한다.
    /*   $('#highlight-toolbar').css({
            "top": $(selectorTarget).offset().top + 20,
            "left": $(selectorTarget).offset().left,
            "position": "absolute"
        }); */

    //마우스를 따라간다.
    $("#webgalpi-highlight-toolbar").css({
      top: e.pageY + 10,
      left: e.pageX,
      position: "absolute"
    });

    //마우스 올렸을대 팔렛트가 나오는 속도
    HighlightCore.mouseOverTimeout = setTimeout(function() {
      //메모가 있으면 보여준다.
      var memo = HighlightData.memoList.get(HighlightData.currentIdx);
      if ($.trim(memo) != "") {
        $("#highlightMemoArea").val(memo);
        $("#highlight-toolbar-memo-area").show();
      } else {
        $("#highlight-toolbar-memo-area").hide();
      }

      $("#webgalpi-highlight-toolbar").fadeIn();
    }, 100);

    HighlightData.currentFlag = "click";
  },
  mouseDragAction: function(e) {
    HlLayerAction.dragInit();

    $("#webgalpi-highlight-toolbar").hide();

    s = window.getSelection();
    //Drag 영역이 없으면 false 리턴한다.
    if (s.isCollapsed) return false;
    oRange = s.getRangeAt(0); //get the text range
    oRect = oRange.getBoundingClientRect();
    /* console.log("oRange ",oRange);
        console.log("oRect ",oRect); */
    $("#webgalpi-highlight-toolbar").css({
      top: e.pageY + 10,
      left: e.pageX,
      position: "absolute",
      width: "auto"
    });

    setTimeout(function() {
      $("#highlight-toolbar-memo-area").hide();
      $("#webgalpi-highlight-toolbar").show();
    }, 100);

    //console.log(oRange, oRect);
    HighlightData.currentFlag = "drag";
    return true;
  },
  mouseBlockAction: function(element) {
    //console.log("e.pageX , e.pageY ", e.pageX, e.pageY);
    HlLayerAction.dragInit();

    $("#webgalpi-highlight-toolbar").hide();

    $("#webgalpi-highlight-toolbar").css({
      top: 0,
      left: 0,
      position: "absolute"
    });

    setTimeout(function() {
      $("#highlight-toolbar-memo-area").hide();
      $("#webgalpi-highlight-toolbar").show();
    }, 100);

    //console.log(oRange, oRect);
    HighlightData.currentFlag = "block";
  }
};
