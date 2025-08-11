import API from "../api/api.js";
import Common from "../common/common";

let emitOptionsAllTabs = (actionCommand, data) => {
  chrome.tabs.query({ currentWindow: true, active: false }, function(tabs) {
    chrome.windows.getAll({ populate: true }, function(windows) {
      windows.forEach(function(window) {
        window.tabs.forEach(function(tab) {
          chrome.tabs.sendMessage(
            tab.id,
            { action: actionCommand, data: data },
            function(response) {
              checkLastError("emit.action");
            }
          );
        });
      });
    });
  });
};

function checkLastError(message) {
  let lastError = chrome.runtime.lastError;
  if (lastError) {
    console.log(message, lastError);
    return;
  }
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  switch (msg.type) {
    // 옵션 데이터 초기화
    case "init.data.option":
      console.log("#########################");
      API.initDataOption(msg.data).then(() => {
        sendResponse(true);
      });
      return true;
      break;
    // 카테고리 최대 ID 가져오기
    case "get.category.max.id":
      API.getCategoryMaxId().then(result => {
        sendResponse(result);
      });
      return true;
      break;
    // 카테고리 데이터 초기화
    case "init.data.category":
      API.initDataCategory(msg.data).then(() => {
        sendResponse(true);
      });
      return true;
    // 특정 사이트 탭 닫기
    case "close.site":
      let target = msg.data;
      //현재 열려있는 구글 TAB 제거
      chrome.tabs.query({ currentWindow: true, active: false }, function(tabs) {
        chrome.windows.getAll({ populate: true }, function(windows) {
          windows.forEach(function(window) {
            window.tabs.forEach(function(tab) {
              if (tab.url === target) {
                chrome.tabs.remove(tab.id);
              }
            });
          });
        });
      });
      return true;
      break;
    // 모든 탭 새로고침 (설치/업데이트 시)
    case "reload.all.tab":
      //설치 , 업데이트 시 모든 탭을 리로딩 한다.
      chrome.tabs.query({ currentWindow: true, active: false }, function(tabs) {
        chrome.windows.getAll({ populate: true }, function(windows) {
          windows.forEach(function(window) {
            window.tabs.forEach(function(tab) {
              chrome.tabs.reload(tab.id);
            });
          });
        });
      });
      break;
    // 동일한 사이트 탭들 새로고침
    case "reloading.same.site":
      //같은 사이트를 리로딩 한다.
      chrome.tabs.query({ active: true, currentWindow: true }, currentTab => {
        chrome.tabs.query({}, tabs => {
          tabs.map(item => {
            //하이라이팅 / 사이트 저장시
            if (msg.data === null) {
              if (
                currentTab[0].id !== item.id &&
                currentTab[0].url === item.url
              ) {
                chrome.tabs.reload(item.id);
              }
            } else {
              //dashboard에서 사이트 삭제 시
              if (msg.data.URL === item.url) {
                chrome.tabs.reload(item.id);
              }
            }
          });
        });
      });
      sendResponse(true);
      return true;
      break;
    // 대시보드 탭 새로고침
    case "reloading.dashboard":
      chrome.tabs.query({ active: true, currentWindow: true }, currentTab => {
        chrome.tabs.query({}, tabs => {
          tabs.map(item => {
            //하이라이팅 / 사이트 저장시
            if (item.url === Common.getDashboardUrl()) {
              chrome.tabs.reload(item.id);
            }
          });
        });
      });
      return true;
      break;
    // 사용자 정보 추가
    case "insert.member":
      let data = msg.data;
      data.name = "";
      data.isUse = "Y";
      data.date = new Date().getTime();

      API.postMember(data).then(() => {
        sendResponse(true);
      });
      break;
    // 백업 데이터 가져오기
    case "get.backup.data":
      API.getBackupData(msg.data).then(backupdata => {
        sendResponse(backupdata);
      });
      return true;
      break;
    // 사용자 사용 상태 업데이트
    case "update.member.use":
      API.updateMemberUse(msg.data).then(members => {
        sendResponse(members);
      });
      return true;
      break;
    // 모든 사용자 정보 가져오기
    case "get.all.members":
      API.getAllMembers().then(members => {
        sendResponse(members);
      });
      return true;
      break;
    // 하이라이트 생성
    case "create.highlight":
      if (msg.data.SITE_CHECK === "N") {
        API.postSite(msg.data);
      }

      API.updateSiteUpdateDate(msg.data);

      API.postItem(msg.data).then(() => {
        sendResponse(true);
      });
      return true;
      break;
    // 하이라이트 업데이트
    case "update.highlight":
      API.updateItem(msg.data).then(() => {
        sendResponse(true);
      });
      return true;
      break;
    // 하이라이트 삭제
    case "delete.highlight":
      API.deleteItem(msg.data).then(res => {
        sendResponse(true);
      });
      return true;
      break;
    // 모든 하이라이트 삭제
    case "delete.all.highlight":
      API.deleteItems(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 카테고리 내 사이트 삭제
    case "delete.site.in.category":
      API.deleteSiteInCategory(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 사이트 삭제
    case "delete.site":
      API.deleteSite(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 사이트 등록
    case "post.site":
      if (msg.data.USE_CURRENT_SITE === "N") {
        API.postSite(msg.data).then(site => {
          sendResponse(site);
        });
      }
      return true;
      break;
    // 화면 캡처 실행
    case "full.before.capture":
      chrome.tabs.captureVisibleTab(
        sender.tab.windowId,
        { format: "png", quality: 100 },
        function(dataUrl) {
          sendResponse(dataUrl);
        }
      );
      return true;
      break;
    // 하이라이트 메모 업데이트
    case "update.highlight.memo":
      API.updateHighlightMemo(msg.data).then(res => {
        sendResponse(true);
      });
      return true;
      break;
    // 하이라이트 목록 가져오기
    case "get.highlights":
      let param = new Object();
      if (msg.data === undefined) {
        return false;
      }
      param.URL_KEY = msg.data.KEY;
      param.EMAIL = msg.data.EMAIL;
      API.getAllItems(param).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 스크랩 사이트 정보 업데이트
    case "update.scrap.site":
      API.updateScrapSite(msg.data).then(res => {
        sendResponse(res);
      });
      break;
    // 사이트 정보 가져오기
    case "get.site.info":
      API.getSite(msg.data).then(res => {
        sendResponse(res); //조건
      });
      return true;
      break;
    // 사이트 개수 가져오기
    case "get.sites.count":
      API.getSites(msg.data).then(res => {
        sendResponse(res); //조건
      });
      return true;
      break;
    // 사이트 목록 가져오기
    case "get.sites":
      API.getSites(msg.data).then(sites => {
        sites.map(site => {
          site.TITLE = Common.restoreSpecialWord(site.TITLE);
          site.UPDATE_TITLE = Common.restoreSpecialWord(site.UPDATE_TITLE);
          site.OG_TITLE = Common.restoreSpecialWord(site.OG_TITLE);
          site.OG_DESCRIPTION = Common.restoreSpecialWord(site.OG_DESCRIPTION);
          site.FULL_TEXT = Common.restoreSpecialWord(site.FULL_TEXT);
          site.READERMODE_CONTENTS = Common.restoreSpecialWord(
            site.READERMODE_CONTENTS
          );
        });
        sendResponse(sites); //조건
      });
      return true;
      break;
    // 카테고리 가져오기 (대시보드)
    case "get.category":
      API.getCategory(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 시스템 카테고리 가져오기 (대시보드)
    case "get.system.category":
      API.getSystemCategory(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 전체 카테고리 개수 가져오기 (대시보드)
    case "get.system.all.category.count":
      API.getAllCategoryCount(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 미분류 카테고리 개수 가져오기 (대시보드)
    case "get.system.no.category.count":
      API.getNoCategoryCount(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 미아 카테고리 가져오기 (대시보드)
    case "get.lost.category":
      API.getLostCategory(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 옵션 색상 설정 업데이트
    case "update.option.color":
      API.updateOptionColor(msg.data);
      //emit all Tab
      API.getOptions(msg.data).then(option => {
        emitOptionsAllTabs("emit.action", option);
        sendResponse(true);
      });
      return true;
      break;
    // 옵션 설정 가져오기
    case "get.option":
      API.getOptions(msg.data).then(option => {
        sendResponse(option);
      });
      return true;
      break;
    // 옵션 테마 설정 업데이트
    case "update.option.theme":
      API.updateOptionTheme(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 옵션 언어 설정 업데이트
    case "update.option.language":
      API.updateOptionLanguage(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 카테고리 정렬 순서 업데이트
    case "update.category.sort":
      API.updateCategorySort(msg.data).then(() => {
        sendResponse(true);
      });
      return true;
      break;
    // 카테고리 관계 등록 (대시보드)
    case "post.category.relation":
      API.deleteCategoryRelation(msg.data).then(() => {
        API.postCategoryRelation(msg.data).then(res => {
          sendResponse(res);
        });
      });
      return true;
      break;
    // 카테고리 항목 추가 (대시보드)
    case "insert.category.item":
      API.insertCategoryItem(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 카테고리 항목 삭제 (대시보드)
    case "delete.category.item":
      let deleteCategoryParam = msg.data;

      if (deleteCategoryParam.CHECK_ROOT) {
        //삭제 시, 하위 Directory 는 미아로 변경
        API.updateLostCategoryItem(deleteCategoryParam);
      } else {
        //category와 연관되어있는 contents relation을 삭제한다.
        API.deleteCategoryRelationParent(deleteCategoryParam);
      }
      //삭제한다.
      API.deleteCategory(deleteCategoryParam).then(() => {
        sendResponse(true);
      });
      return true;
      break;
    // 카테고리 항목 업데이트 (대시보드)
    case "update.category.item":
      let categoryParam = msg.data;

      if (categoryParam.CATEGORY_TYPE !== "SYSTEM") {
        if (categoryParam.CHECK_ROOT) {
          //checkRoot가 true 일경우
          API.deleteCategoryRelationParent(categoryParam);
        }

        if (categoryParam.CATEGORY_PARENT === 0 && categoryParam.CHECK_ROOT) {
        } else {
          //카테고리 변경 시, parent에 포함된 category를 미아로 변경
          API.updateLostCategoryItem(categoryParam);
        }
      }

      API.updateCategoryItem(categoryParam).then(res => {
        sendResponse(res);
      });

      return true;
      break;
    // 뷰모드 변환 업데이트 (미사용 - 삭제검토)
    case "update.convert.viewmode":
      API.updateConvertViewmode(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 사이트 복원
    case "restore.site":
      API.restoreSite(msg.data).then(site => {
        sendResponse(site);
      });
      return true;
      break;
    // 카테고리 복원
    case "restore.category":
      API.restoreCategory(msg.data).then(category => {
        sendResponse(category);
      });
      return true;
      break;
    // 카테고리 관계 복원
    case "restore.category.relation":
      API.restoreCategoryRelation(msg.data).then(relation => {
        sendResponse(relation);
      });
      return true;
      break;
    // 하이라이트 복원
    case "restore.highlight":
      API.restoreHighlight(msg.data).then(highlight => {
        sendResponse(highlight);
      });
      return true;
      break;
    // 원탭 데이터 복원
    case "restore.onetab":
      API.restoreOnetab(msg.data).then(onetab => {
        sendResponse(onetab);
      });
      return true;
      break;
    // 로그 복원
    case "restore.log":
      API.restoreLog(msg.data).then(log => {
        sendResponse(log);
      });
      return true;
      break;
    // 즐겨찾기 업데이트
    case "update.favorite":
      API.updateFavorite(msg.data).then(log => {
        sendResponse(log);
      });
      return true;
      break;
    // 즐겨찾기 삭제
    case "delete.favorite":
      API.deleteFavorite(msg.data).then(log => {
        sendResponse(log);
      });
      return true;
      break;
    // 업데이트 히스토리 가져오기
    case "get.update.history":
      API.getUpdateHistory(msg.data).then(updateHistory => {
        sendResponse(updateHistory);
      });
      return true;
      break;
    // 탭 정보 추가
    case "insert.tabinfo":
      API.insertTabInfo(msg.data).then(res => {
        sendResponse(true);
      });
      return true;
      break;
    // 업데이트 히스토리 추가
    case "insert.update.history":
      API.insertUpdateHistory(msg.data).then(updateHistory => {
        sendResponse(updateHistory);
      });
      return true;
      break;
    // 업데이트 히스토리 수정
    case "update.update.history":
      API.updateUpdateHistory(msg.data).then(() => {
        sendResponse(true);
      });
      return true;
      break;
    // 탭 정보 그룹 조회
    case "select.tabinfo.group":
      API.selectTabInfoGroup(msg.data).then(tabGroup => {
        sendResponse(tabGroup);
      });
      return true;
      break;
    // 탭 정보 그룹 삭제
    case "delete.tabinfo.group":
      API.deleteTabInfoGroup(msg.data).then(() => {
        sendResponse(true);
      });
      return true;
      break;
    // 탭 정보 목록 가져오기
    case "get.tabinfos":
      API.selectTabInfos(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
    // 사이트 잠금 해제
    case "unlock.site":
      API.unlockSite(msg.data).then(res => {
        sendResponse(res);
      });
      return true;
      break;
  }
});

/*chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(async msg => {
    switch (msg.action) {
      case "popup.save.site":
        API.postSite(msg.data);
        break;
    }
  });
});*/
