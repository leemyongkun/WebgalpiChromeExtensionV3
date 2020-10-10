import Query from "../database/query.js";

import store from "../store";
import Utils from "../dashboard/utils/Utils";
import Common from "../common/common";

var db = openDatabase("HL", "1.0", "DATABASE", 200000);
let Api = {
  getBackupData: email => {
    return new Promise(async res => {
      //let param = [email];
      let obj = new Object();
      obj.EMAIL = email;
      Promise.all([
        Api.getBackupSites(obj),
        Api.getBackupHighlights(obj),
        Api.getOptions(obj),
        Api.getBackupCategorys(obj),
        Api.getBackupCategorysRelation(obj),
        Api.getBackupOneTabsHistory(obj)
      ]).then(values => {
        let data = new Object();
        data.sites = values[0];
        data.highlights = values[1];
        data.options = values[2];
        data.categorys = values[3];
        data.categoryRelation = values[4];
        data.onetabs = values[5];
        res(data);
      });
    });
  },
  getBackupSites: param => {
    return select(Query.getBackupSites(param), null);
  },
  getBackupHighlights: param => {
    return select(Query.getBackupHighlights(param), null);
  },
  getBackupCategorysRelation: param => {
    return select(Query.getBackupCategorysRelation(param), null);
  },
  getBackupCategorys: param => {
    return select(Query.getBackupCategorys(param), null);
  },
  getBackupOneTabsHistory: param => {
    //모아보기
    return select(Query.getBackupOneTabsHistory(param), null);
  },

  getMemberInfo: () => {
    return new Promise(res => {
      Api.getMembers().then(members => {
        let loginInfo = new Object();
        if (members.length === 0) {
          loginInfo.NAME = "NO_NAME";
          loginInfo.IMAGE_URL = "";
          loginInfo.EMAIL = "";
        } else {
          loginInfo.NAME = members[0].NAME;
          loginInfo.IMAGE_URL = members[0].IMAGE_URL;
          loginInfo.EMAIL = members[0].EMAIL;
        }

        res(loginInfo);
      });
    });
  },
  getInitInfo: parameter => {
    return new Promise(res => {
      let site = Api.getSite(parameter);
      let items = Api.getAllItems(parameter);
      let options = Api.getOptions(parameter);

      const arr = [site, items, options];
      Promise.all(arr).then(
        values => {
          let obj = new Object();
          let site = values[0];
          let items = values[1];
          let options = values[2];

          let allItems = new Object();

          if (site.length != 0) {
            allItems.SITE = site;
            allItems.HIGHLIGHT_LIST = items;
            allItems.SITE_CHECK = "Y";
            allItems.SITE_OPEN = site[0].FL_READMODE;
          } else {
            allItems.HIGHLIGHT_LIST = null;
            allItems.SITE_CHECK = "N";
            allItems.SITE_OPEN = "Y";
          }

          obj.allItems = allItems;
          obj.options = options[0];

          res(obj);
        },
        reason => {}
      );
    });
  },
  getAllCategoryCount: params => {
    return select(Query.getAllCategoryCount(params), null);
  },
  getNoCategoryCount: params => {
    return select(Query.getNoCategoryCount(params), null);
  },
  getOptions: param => {
    return select(Query.getOptions(param), null);
  },
  getSite: params => {
    return select(Query.getSite(params), null);
  },
  getSites: params => {
    let query = Query.getSites(params);
    let parameter = params;

    if (params !== null && params.flag === null) {
      //일반 카테고리
      parameter = [
        params.EMAIL,
        params.id,
        params.EMAIL,
        params.startOffset,
        params.endOffset
      ];
    } else {
      parameter = [
        params.EMAIL,
        params.EMAIL,
        params.startOffset,
        params.endOffset
      ];
    }

    return select(query, parameter);
  },

  getSystemCategory: params => {
    return select(Query.getCategory(params, "system"), null);
  },
  getLostCategory: params => {
    return select(Query.getCategory(params, "lost"), null);
  },
  getCategory: params => {
    return select(Query.getCategory(params, "all"), null);
  },
  getAllItems: param => {
    return select(Query.getAllItems(param), null);
  },
  updateItem: params => {
    return update(Query.updateItem(params));
  },
  updateHighlightMemo: params => {
    return update(Query.updateHighlightMemo(params));
  },
  postItem: params => {
    return insert(Query.insertItem(params), null);
  },
  deleteItem: params => {
    return remove(Query.deleteItem(params));
  },
  deleteItems: params => {
    return remove(Query.deleteItems(params));
  },
  deleteSiteInCategory: params => {
    return remove(Query.deleteSiteInCategory(params), null);
  },
  deleteSite: params => {
    params.updateDate = new Date().getTime();
    return remove(Query.deleteSite(params), null);
  },
  updateScrapSite: param => {
    return update(Query.updateScrapSite(param), null);
  },
  postSite: async params => {
    params.DATE = new Date().getTime();
    params.TITLE = Common.replaceSpecialWord(params.TITLE);
    params.UPDATE_TITLE = Common.replaceSpecialWord(params.UPDATE_TITLE);
    params.OG_TITLE = Common.replaceSpecialWord(params.OG_TITLE);
    params.OG_DESCRIPTION = Common.replaceSpecialWord(params.OG_DESCRIPTION);
    params.FULL_TEXT = Common.replaceSpecialWord(params.FULL_TEXT);
    params.READERMODE_CONTENTS = Common.replaceSpecialWord(
      params.READERMODE_CONTENTS
    );
    //let param = [params.FULL_TEXT, params.READERMODE_CONTENTS];

    await insert(Query.insertSite(params), null);
    return Api.getSite(params);
  },
  updateOptionColor: params => {
    return update(Query.updateOptionColor(params), null);
  },
  updateOptionTheme: params => {
    return update(Query.updateOptionTheme(params), null);
  },
  updateOptionLanguage: params => {
    return update(Query.updateOptionLanguage(params));
  },
  deleteCategory: param => {
    return remove(Query.deleteCategory(param), null); //URLKEY , EMAIL
  },
  deleteCategoryRelation: param => {
    return remove(Query.deleteCategoryRelation(param), null); //URLKEY , EMAIL
  },
  deleteCategoryRelationParent: param => {
    //Relation 에 있는 parent <-> site 의 정보를 삭제한다.
    remove(Query.deleteCategoryRelationParent(param), null); //parent IDX를 보낸다
  },
  updateCategorySort: param => {
    return update(Query.updatecategorySort(param), null);
  },
  postCategoryRelation: param => {
    return insert(Query.insertCategoryRelation(param), null);
  },
  updateLostCategoryItem: param => {
    //parentId에 categoryId가 포함된 column 을 모두 -1로 변경 (미아로 만든다)
    return update(Query.updateLostCategoryItem(param), null);
  },
  insertCategoryItem: param => {
    return insert(Query.insertCategoryItem(param), null);
  },
  updateCategoryItem: param => {
    if (param.CHECK_ROOT) {
      //root에서 child로 수정 시,
      param.CATEGORY_PARENT = 0; //rootId
    }
    delete param.CHECK_ROOT;
    delete param.CATEGORY_TYPE;

    return update(Query.updateCategoryItem(param), null);
  },
  postMember: param => {
    return insert(Query.insertMember(param), null);
  },
  updateMemberUse: param => {
    return update(Query.updateMemberUse(param), null);
  },
  getMembers: () => {
    return select(Query.selectMembers(), null);
  },
  getAllMembers: () => {
    return select(Query.selectAllMembers(), null);
  },
  //todo : 미사용(삭제검토)
  updateConvertViewmode: param => {
    return update(Query.updateConvertViewmode(), param);
  },
  initDataOption: param => {
    return insert(Query.initDataOption(param), null);
  },
  initDataCategory: param => {
    return insert(Query.initDataCategory(param), null);
  },
  getCategoryMaxId: () => {
    return select(Query.getCategoryMaxId(), []);
  },
  updateFavorite: param => {
    return update(Query.updateFavorite(param), null);
  },
  deleteFavorite: param => {
    return update(Query.deleteFavorite(param), null);
  },
  //todo : SERVER로 이관되면 사용하지 않을듯..
  restoreSite: params => {
    let param = [
      params.IDX,
      params.DATE_CREATE,
      params.DATE_UPDATE,
      params.EMAIL,
      params.EMBEDURL,
      params.FL_BACKUP,
      params.FL_BOOKMARK,
      params.FL_DELETE,
      params.FL_FAVORITE,
      params.FL_READMODE,
      params.HOST,
      params.MEMO,
      params.OG_DESCRIPTION,
      params.OG_IMAGE,
      params.OG_TITLE,
      params.OWNER_EMAIL,
      params.TAGS,
      params.TITLE,
      params.UPDATE_TITLE,
      params.URL,
      params.URL_KEY,
      params.URL_TYPE,
      params.READERMODE_CONTENTS,
      params.FULL_TEXT
    ];

    return insert(Query.restoreSite(), param);
  },
  //todo : SERVER로 이관되면 사용하지 않을듯..
  restoreCategory: params => {
    let param = [
      params.IDX,
      params.DEPTH,
      params.EMAIL,
      params.FLAG,
      params.NAME,
      params.PARENT,
      params.SORT,
      params.TYPE,
      new Date().getTime() //params.DATE_CREATE,
    ];
    return insert(Query.restoreCategory(), param);
  },
  //todo : SERVER로 이관되면 사용하지 않을듯..
  restoreCategoryRelation: params => {
    let param = [
      params.CATEGORY_IDX,
      params.URL_KEY,
      params.EMAIL,
      params.SITE_IDX,
      new Date().getTime() //params.DATE_CREATE,
    ];
    return insert(Query.restoreCategoryRelation(), param);
  },
  //todo : SERVER로 이관되면 사용하지 않을듯..
  restoreHighlight: params => {
    let date = new Date().getTime();
    let param = [
      params.COLOR,
      params.EMAIL,
      params.FL_DELETE,
      params.FL_READMODE,
      params.GB_FILETYPE,
      params.IDX,
      params.IMAGE,
      params.MEMO,
      params.NEXT,
      params.PAGE_NUMBER,
      params.POSITION,
      params.PREV,
      params.PRINT_TEXT,
      params.TEXT,
      params.URL_KEY,
      date, //params.DATE_CREATE,
      date //params.DATE_UPDATE
    ];
    return insert(Query.restoreHighlight(), param);
  },
  //todo : SERVER로 이관되면 사용하지 않을듯..
  restoreOnetab: params => {
    return insert(Query.restoreOnetab(params), null);
  },
  getUpdateHistory: param => {
    return select(Query.selectUpdateHistory(param), null);
  },
  insertUpdateHistory: params => {
    return select(Query.insertUpdateHistory(params), null);
  },
  updateUpdateHistory: params => {
    return update(Query.updateUpdateHistory(params), null);
  },
  deleteTabInfoGroup: params => {
    return remove(Query.deleteTabInfoGroup(params));
  },
  selectTabInfoGroup: params => {
    return select(Query.selectTabInfoGroup(params));
  },
  selectTabInfos: params => {
    return select(Query.selectTabInfos(params));
  },
  insertTabInfo: params => {
    return insert(Query.insertTabInfo(params));
  },
  unlockSite: params => {
    return update(Query.unlockSite(params));
  },
  restoreLog: params => {}
};

function update(query, param) {
  return new Promise((res, rej) => {
    db.transaction(tx => {
      tx.executeSql(query, param, (tx, rs) => {
        //console.log(tx, rs);
        res(param);
      });
    });
  });
}

function remove(query, param) {
  return new Promise(res => {
    db.transaction(tx => {
      tx.executeSql(query, param, (tx, rs) => {
        res(param);
      });
    });
  });
}

function insert(query, param) {
  return new Promise(res => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        param,
        (tx, rs) => {
          res(param);
        },
        (tx, error) => {
          console.log("tx ", tx);
          console.log("error ", error);
        }
      );
    });
  });
}

function select(query, param) {
  return new Promise((res, rej) => {
    db.transaction(tx => {
      tx.executeSql(query, param, (tx, rs) => {
        setData(rs)
          .then(obj => {
            res(obj);
          })
          .catch(error => {
            rej(error);
          });
      });
    });
  });
}

function setData(rs) {
  return new Promise(res => {
    let obj = new Array();
    for (let i = 0; i < rs.rows.length; i++) {
      obj.push(rs.rows.item(i));
    }
    res(obj);
  });
}

export default Api;
