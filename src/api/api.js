import Query from "../database/query.js";

import store from "../store";
import Utils from "../dashboard/utils/Utils";
import Common from "../common/common";

var db = openDatabase("HL", "1.0", "DATABASE", 200000);
let Api = {
  getBackupData: email => {
    return new Promise(async res => {
      let param = [email];
      let obj = new Object();
      obj.EMAIL = email;
      Promise.all([
        Api.getBackupSites(param),
        Api.getBackupHighlights(param),
        Api.getOptions(obj),
        Api.getBackupCategorys(param),
        Api.getBackupCategorysRelation(param),
        Api.getBackupOneTabsHistory(param)
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
    return select(Query.getBackupSites(), param);
  },
  getBackupHighlights: param => {
    return select(Query.getBackupHighlights(), param);
  },
  getBackupCategorysRelation: param => {
    return select(Query.getBackupCategorysRelation(), param);
  },
  getBackupCategorys: param => {
    return select(Query.getBackupCategorys(), param);
  },
  getBackupOneTabsHistory: param => {
    //모아보기
    return select(Query.getBackupOneTabsHistory(), param);
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
    return select(Query.getAllCategoryCount(), params);
  },
  getNoCategoryCount: params => {
    return select(Query.getNoCategoryCount(), params);
  },
  getOptions: parameter => {
    let param = [parameter.EMAIL];
    return select(Query.getOptions(), param);
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
    let query = Query.getCategory("system");
    return select(query, params);
  },
  getLostCategory: params => {
    let query = Query.getCategory("lost");
    return select(query, params);
  },
  getCategory: params => {
    let query = Query.getCategory("all");
    return select(query, params);
  },
  getAllItems: parameter => {
    let result = select(Query.getAllItems(), [
      parameter.URL_KEY,
      parameter.EMAIL
    ]);
    return result;
  },
  updateItem: params => {
    return update(Query.updateItem(params));
  },
  updateHighlightMemo: params => {
    return update(Query.updateHighlightMemo(params));
  },
  postItem: params => {
    let param = [
      params.IDX,
      params.URL_KEY,
      params.EMAIL,
      params.TEXT,
      params.PREV,
      params.NEXT,
      params.PRINT_TEXT,
      params.POSITION,
      params.COLOR,
      params.MEMO,
      params.GB_FILETYPE,
      params.IMAGE,
      params.FL_READMODE,
      params.PAGE_NUMBER,
      params.DATE_CREATE,
      params.DATE_CREATE //초기 저장시에는 같은 날짜가 date_update에 들어간다.
    ];
    return insert(Query.insertItem(), param);
  },
  deleteItem: params => {
    return remove(Query.deleteItem(params));
  },
  deleteItems: params => {
    return remove(Query.deleteItems(params));
  },
  deleteSiteInCategory: params => {
    let param = [params.URL_KEY, params.EMAIL];
    return remove(Query.deleteSiteInCategory(), param);
  },
  deleteSite: params => {
    let currentDate = new Date().getTime();
    let param = [currentDate, params.URL_KEY, params.EMAIL];
    return remove(Query.deleteSite(), param);
  },
  updateScrapSite: params => {
    let param = [
      params.READERMODE_CONTENTS,
      params.FULL_TEXT,
      params.OG_TITLE,
      params.OG_DESCRIPTION,
      params.OG_IMAGE,
      params.URL_KEY
    ];
    return update(Query.updateScrapSite(), param);
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
    let param = [params.FULL_TEXT, params.READERMODE_CONTENTS];

    await insert(Query.insertSite(params), param);
    return Api.getSite(params);
  },
  updateOptionColor: params => {
    return update(Query.updateOptionColor(), params);
  },
  updateOptionTheme: params => {
    return update(Query.updateOptionTheme(), params);
  },
  updateOptionLanguage: params => {
    return update(Query.updateOptionLanguage(params));
  },
  deleteCategory: async categoryId => {
    let result = await Utils.getLocalStorage("loginInfo");
    return remove(Query.deleteCategory(), [categoryId, result.loginInfo.EMAIL]); //URLKEY , EMAIL
  },
  deleteCategoryRelation: param => {
    return remove(Query.deleteCategoryRelation(), [param.URL_KEY, param.EMAIL]); //URLKEY , EMAIL
  },
  deleteCategoryRelationParent: async categoryId => {
    let result = await Utils.getLocalStorage("loginInfo");
    //Relation 에 있는 parent <-> site 의 정보를 삭제한다.
    remove(Query.deleteCategoryRelationParent(), [
      categoryId,
      result.loginInfo.EMAIL
    ]); //parent IDX를 보낸다
  },
  updateCategorySort: param => {
    return update(Query.updatecategorySort(param), null);
  },
  postCategoryRelation: param => {
    let params = [
      param.CATEGORY_ID,
      param.URL_KEY, //"URL_KEY":
      param.EMAIL, //"EMAIL":
      param.IDX, //"SITE_IDX":
      param.DATE_CREATE
    ];
    return insert(Query.insertCategoryRelation(), params);
  },
  updateLostCategoryItem: param => {
    //parentId에 categoryId가 포함된 column 을 모두 -1로 변경 (미아로 만든다)
    return update(Query.updateLostCategoryItem(), param);
  },
  insertCategoryItem: param => {
    return insert(Query.insertCategoryItem(param));
  },
  updateCategoryItem: param => {
    if (param.CHECK_ROOT) {
      //root에서 child로 수정 시,
      param.CATEGORY_PARENT = 0; //rootId
    }
    delete param.CHECK_ROOT;
    delete param.CATEGORY_TYPE;

    return update(Query.updateCategoryItem(), Object.values(param));
  },
  postMember: param => {
    return insert(Query.insertMember(), param);
  },
  updateMemberUse: param => {
    return update(Query.updateMemberUse(), param);
  },
  getMembers: () => {
    return select(Query.selectMembers(), null);
  },
  getAllMembers: () => {
    return select(Query.selectAllMembers(), null);
  },
  updateConvertViewmode: param => {
    return update(Query.updateConvertViewmode(), param);
  },
  initDataOption: param => {
    return insert(Query.initDataOption(), param);
  },
  initDataCategory: param => {
    return insert(Query.initDataCategory(), param);
  },
  getCategoryMaxId: () => {
    return select(Query.getCategoryMaxId(), []);
  },
  updateFavorite: param => {
    return update(Query.updateFavorite(), param);
  },
  deleteFavorite: param => {
    return update(Query.deleteFavorite(), param);
  },
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
  restoreOnetab: params => {
    return insert(Query.restoreOnetab(params), null);
  },
  getUpdateHistory: params => {
    let param = [params.EMAIL];
    return select(Query.selectUpdateHistory(), param);
  },

  insertUpdateHistory: params => {
    return select(Query.insertUpdateHistory(), params);
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
