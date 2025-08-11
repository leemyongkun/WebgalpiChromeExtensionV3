import CONTENT_LISTENER from "./content-listener";

import $ from "jquery";
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
  replaceSpecialWord(text) {
    if (text === null || text === undefined) return text;
    return text.replace(/\'/g, "&#039;").replace(/\"/g, "&quot;");
  },
  restoreSpecialWord(text) {
    if (text === null || text === undefined) return text;
    return text.replace(/&#039;/g, "'").replace(/&quot;/g, '"');
  },
  styleWebgalpiTabFont: () => {
    document.querySelectorAll("webgalpi-tag").forEach(element => {
      element.style.color = "#42423C";
    });
  },
  unwrapTags: (document, tag) => {
    let element = document.getElementsByTagName(tag);
    let elementList = Array.prototype.slice.call(element);
    elementList.forEach(value => {
      $(value)
        .contents()
        .unwrap();
    });
  },
  reloadingDashboard: () => {
    CONTENT_LISTENER.sendMessage({
      type: "reloading.dashboard",
      data: null
    });
  },
  reloadingSameSite: site => {
    let param = null;
    if (site !== undefined) {
      param = site;
    }
    //같은 사이트가 열려있다면 리로딩 한다.
    CONTENT_LISTENER.sendMessage({
      type: "reloading.same.site",
      data: param
    });
  },
  closeDuplicateDashboard: () => {
    chrome.tabs.query({ active: true, currentWindow: true }, currentTab => {
      let count = 0;
      chrome.tabs.query({}, tabs => {
        tabs.map(item => {
          if (
            currentTab[0].id !== item.id &&
            currentTab[0].url === item.url &&
            item.url === Common.getDashboardUrl()
          ) {
            chrome.tabs.remove(item.id);
            count++;
          }
        });
      });
    });
  },
  intervalCall: interval => {
    let elapsed = true;
    return fn => {
      if (!elapsed) {
        return; // 마지막 호출 후 제한된 경과시간이 지나지 않은 경우 리턴
      }
      elapsed = false;
      fn();
      setTimeout(() => {
        elapsed = true;
      }, interval);
    };
  },
  goDashboard: () => {
    chrome.tabs.create({ url: Common.getDashboardUrl() });
  },
  getAppDefaultUrl: () => {
    return "chrome-extension://" + chrome.runtime.id;
  },
  getDashboardUrl: () => {
    return "chrome-extension://" + chrome.runtime.id + "/dashboard/index.html";
  },
  getVersion: () => {
    return chrome.runtime.getManifest().version;
  },
  getConvertDate: date => {
    return new Date(date).format("yyyy년 MM월 dd일 a/p hh시 mm분 ss초");
  },
  getConvertColor: color => {
    switch (color) {
      case "highlight-color-1":
        return "#F2D3D9"; //"#e35a69";
      case "highlight-color-2":
        return "#D8CCDA"; //#f7b900
      case "highlight-color-3":
        return "#C7D0ED"; //#2da64e
      case "highlight-color-4":
        return "#CCDFE6"; //d9c3ff
      case "highlight-color-5":
        return "#C7E7E6"; //97c2dd
      case "highlight-color-6":
        return "#D7EBDF"; //ef9a9a
      case "highlight-color-7":
        return "#D3ECC5"; //90a4ae
      case "highlight-color-8":
        return "#FDECA7"; //CDDC39
      case "highlight-color-9":
        return "#F2D9BA"; //ffb540
      case "highlight-color-10":
        return "#F8DFD8"; //B2EBF2
      case "highlight-color-11":
        return "#EFEDE1"; //c0b6a7
    }
  },
  toHashMap: (list, key) => {
    let hashMap = new Object();
    list.forEach(obj => {
      hashMap[obj[key]] = obj;
    });
    return hashMap;
  }
};

export default Common;
