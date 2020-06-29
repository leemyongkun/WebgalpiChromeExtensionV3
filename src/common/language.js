let MESSAGE = {
  kr: {
    M0001: "현재 브라우저는 Web SQL Database를 지원합니다.",
    M0002: "현재 브라우저는 Web SQL Database를 지원하지 않습니다.",
    M0003: "백업이 완료 되었습니다.",
    M0004: "백업 도중 에러가 발생하였습니다."
  },
  en: {
    M0001: "EN 현재 브라우저는 Web SQL Database를 지원합니다.",
    M0002: "EN 현재 브라우저는 Web SQL Database를 지원하지 않습니다."
  }
};
let LANG = {
  lang: "en",
  getMessage: code => {
    return MESSAGE[LANG.lang][code];
  }
};
export default LANG;
