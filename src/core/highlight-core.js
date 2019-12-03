import { GLOBAL_CONFIG } from "../contents/global/config.js";

var colorMap = new Object();
(function() {
  colorMap["hltcolor-1"] =
    "background: #ff90c3 !important;display: inline !important;";
  colorMap["hltcolor-2"] =
    "background: #ffcd86 !important;display: inline !important;";
  colorMap["hltcolor-3"] =
    "background: #ffee7c !important;display: inline !important;";
  colorMap["hltcolor-4"] =
    "background: #8cf980 !important;display: inline !important;";
  colorMap["hltcolor-5"] =
    "background: #75dbff !important;display: inline !important;";
  colorMap["hltcolor-6"] =
    "background: #e7b2ff !important;display: inline !important;";
})();

function getColor(colorClass) {
  return colorMap[colorClass];
}

var hlText = "";
var highlightRange = (function() {
  function highlightRange(
    rangeObject,
    highlightClass,
    highlightTag,
    highlightId,
    hlghlightText
  ) {
    return new Promise(function(res) {
      // 비어있는 경우 범위를 무시힌다.
      if (rangeObject.collapsed) {
        return;
      }
      hlText = hlghlightText;

      if (typeof highlightClass == "undefined") {
        highlightClass = "highlighted-range";
      }

      if (typeof highlightTag == "undefined") {
        highlightTag = "span";
      }

      // 모든 노드를 배열에 넣는다. (시작과 끝 노느 분할작업)
      var nodes = textNodesInRange(rangeObject);
      // Remember range details to restore it later.
      var startContainer = rangeObject.startContainer;
      var startOffset = rangeObject.startOffset;
      var endContainer = rangeObject.endContainer;
      var endOffset = rangeObject.endOffset;

      // Highlight node
      var highlights = [];
      var count = 0;
      //console.log(">>>>>>>>>>>>>>>>>>>>>>> nodes " ,nodes);
      for (nodeIdx in nodes) {
        let ret = highlightNode(
          nodes[nodeIdx],
          highlightClass,
          highlightTag,
          highlightId,
          count
        );
        if (!ret) {
          //console.log("ret ",ret);
          highlights.push(ret);
        }
        count++;
      }

      rangeObject.setStart(startContainer, startOffset);
      rangeObject.setEnd(endContainer, endOffset);

      function cleanupHighlights() {
        var startContainer = rangeObject.startContainer;
        var startOffset = rangeObject.startOffset;
        var endContainer = rangeObject.endContainer;
        var endOffset = rangeObject.endOffset;

        for (var highlightIdx in highlights) {
          removeHighlight(highlights[highlightIdx]);
        }

        rangeObject.setStart(startContainer, startOffset);
        rangeObject.setEnd(endContainer, endOffset);
      }
      res(cleanupHighlights);
    });
  }

  function textNodesInRange(rangeObject) {
    setRangeToTextNodes(rangeObject);

    var nodes = [];

    if (rangeObject.collapsed) {
      return nodes;
    }

    if (rangeObject.startOffset != rangeObject.startContainer.length) {
      if (rangeObject.startOffset != 0) {
        var createdNode = rangeObject.startContainer.splitText(
          rangeObject.startOffset
        );

        if (rangeObject.endContainer === rangeObject.startContainer) {
          rangeObject.setEnd(
            createdNode,
            rangeObject.endOffset - rangeObject.startOffset
          );
        }

        rangeObject.setStart(createdNode, 0);
      }
    }

    // Create an iterator to iterate through the nodes.
    var root =
      typeof rangeObject.commonAncestorContainer != "undefined"
        ? rangeObject.commonAncestorContainer
        : document.body; // fall back to whole document for browser compatibility
    var iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT);

    // Find the start node (could we somehow skip this seemingly needless search?)
    while (
      iter.referenceNode !== rangeObject.startContainer &&
      iter.referenceNode !== null
    ) {
      iter.nextNode();
    }

    // Add each node up to (but excluding) the end node.
    while (
      iter.referenceNode !== rangeObject.endContainer &&
      iter.referenceNode !== null
    ) {
      nodes.push(iter.referenceNode);
      iter.nextNode();
    }

    // Include (part of) the end node if needed.
    if (rangeObject.endOffset != 0) {
      // If it is only partly included, we need to split it up.
      if (rangeObject.endOffset != rangeObject.endContainer.length) {
        // Split the node, breaking off the part outside the range.
        rangeObject.endContainer.splitText(rangeObject.endOffset);
        // Note that the range object need not be updated.

        //assert(rangeObject.endOffset == rangeObject.endContainer.length);
      }

      // Add the end node.
      nodes.push(rangeObject.endContainer);
    }
    return nodes;
  }

  // Normalise the range to start and end in a text node.
  // Copyright (c) 2015 Randall Leeds
  function setRangeToTextNodes(rangeObject) {
    function getFirstTextNode(node) {
      if (node.nodeType === Node.TEXT_NODE) return node;
      var document = node.ownerDocument;
      var walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      return walker.firstChild();
    }

    var startNode = rangeObject.startContainer;
    var startOffset = rangeObject.startOffset;

    // Drill down to a text node if the range starts at the container boundary.
    if (startNode.nodeType !== Node.TEXT_NODE) {
      if (startOffset === startNode.childNodes.length) {
        startNode = startNode.childNodes[startOffset - 1];
        startNode = getFirstTextNode(startNode);
        startOffset = startNode.textContent.length;
      } else {
        startNode = startNode.childNodes[startOffset];
        startNode = getFirstTextNode(startNode);
        startOffset = 0;
      }
      rangeObject.setStart(startNode, startOffset);
    }

    var endNode = rangeObject.endContainer;
    var endOffset = rangeObject.endOffset;

    // Drill down to a text node if the range ends at the container boundary.
    if (endNode.nodeType !== Node.TEXT_NODE) {
      if (endOffset === endNode.childNodes.length) {
        endNode = endNode.childNodes[endOffset - 1];
        endNode = getFirstTextNode(endNode);
        endOffset = endNode.textContent.length;
      } else {
        endNode = endNode.childNodes[endOffset];
        endNode = getFirstTextNode(endNode);
        endOffset = 0;
      }
      rangeObject.setEnd(endNode, endOffset);
    }
  }

  // Replace [node] with <span class=[highlightClass]>[node]</span>
  function highlightNode(
    node,
    highlightClass,
    highlightTag,
    highlightId,
    count
  ) {
    var BR = document.createElement("BR");
    if ($(node).closest("style").length != 0) return false;
    if ($(node).closest("script").length != 0) return false;
    if (
      $(node)
        .parent()
        .css("display") == "none"
    )
      return false;

    //ykleem@20180820 - 빈공간이면 하이라이팅을 할 필요가 없음.
    if ($.trim(node.textContent) == "") return false;

    //ykleem@20180816 - 포함되지 않은 단어는 하이라이팅에서 제거.
    if (hlText.indexOf(node.textContent) == -1) {
      return false;
    }

    //ykleem@20181002 - 첫번째 text가 맞지 않으면 무시한다.
    if (count == 0) {
      if (hlText.indexOf(node.textContent) != 0) return false;
    }

    // Create a highlight
    var highlight = document.createElement(highlightTag);
    highlight.classList.add(highlightClass);
    highlight.classList.add("wf-pen");

    //memo가 있는 경우
    //highlight.classList.add('wf-memo');
    //highlight.setAttribute('style', getColor(highlightClass));
    highlight.style.cssText = getColor(highlightClass); //rgb형태로 자동 변환되어 들어간다.
    highlight.setAttribute(GLOBAL_CONFIG.HL_ID_NAME, highlightId);

    // Wrap it around the text node
    node.parentNode.replaceChild(highlight, node);
    highlight.appendChild(node);

    return highlight;
  }

  // Remove a highlight <span> created with highlightNode.
  function removeHighlight(highlight) {
    // Move its children (normally just one text node) into its parent.
    while (highlight.firstChild) {
      highlight.parentNode.insertBefore(highlight.firstChild, highlight);
    }
    // Remove the now empty node
    highlight.remove();
  }

  return highlightRange;
})();

//Node.JS에서 사용할경우
/*if (typeof module !== 'undefined') {
        module.exports = highlightRange;
    } */
