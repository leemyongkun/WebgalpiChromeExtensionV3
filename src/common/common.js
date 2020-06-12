Date.prototype.format = function(f) {
  if (!this.valueOf()) return " ";

  var weekName = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일"
  ];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
    switch ($1) {
      case "yyyy":
        return d.getFullYear();
      case "yy":
        return (d.getFullYear() % 1000).zf(2);
      case "MM":
        return (d.getMonth() + 1).zf(2);
      case "dd":
        return d.getDate().zf(2);
      case "E":
        return weekName[d.getDay()];
      case "HH":
        return d.getHours().zf(2);
      case "hh":
        let h;
        return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case "mm":
        return d.getMinutes().zf(2);
      case "ss":
        return d.getSeconds().zf(2);
      case "a/p":
        return d.getHours() < 12 ? "오전" : "오후";
      default:
        return $1;
    }
  });
};

let colorMap = new Object();
(function() {
  colorMap["highlight-color-1"] = "#a1887f";
  colorMap["highlight-color-2"] = "#CDDC39";
  colorMap["highlight-color-3"] = "#4CAF50";
  colorMap["highlight-color-4"] = "#FF9800";
  colorMap["highlight-color-5"] = "#FBC02D";
  colorMap["highlight-color-6"] = "#B2EBF2";
})();
/*(function() {
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
})();*/

String.prototype.string = function(len) {
  var s = "",
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function(len) {
  return "0".string(len - this.length) + this;
};
Number.prototype.zf = function(len) {
  return this.toString().zf(len);
};

let Common = {
  getVersion: () => {
    return chrome.runtime.getManifest().version;
  },
  getConvertDate: date => {
    return new Date(date).format("yyyy년 MM월 dd일 a/p hh시 mm분 ss초");
  },
  getColor: color => {
    return colorMap[color];
  },
  getConvertColor: color => {
    switch (color) {
      case "highlight-color-1":
        return "#e35a69";
      case "highlight-color-2":
        return "#f7b900";
      case "highlight-color-3":
        return "#2da64e";
      case "highlight-color-4":
        return "#d9c3ff";
      case "highlight-color-5":
        return "#97c2dd";
      case "highlight-color-6":
        return "#ef9a9a";
      case "highlight-color-7":
        return "#90a4ae";
      case "highlight-color-8":
        return "#CDDC39";
      case "highlight-color-9":
        return "#ffb540";
      case "highlight-color-10":
        return "#B2EBF2";
      case "highlight-color-11":
        return "#c0b6a7";
    }
  }
};

export default Common;
