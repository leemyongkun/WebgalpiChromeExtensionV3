import Query from "../database/query.js";

import store from "../store";
var db = openDatabase("HL", "1.0", "DATABASE", 200000);
let Api = {
  getBackupData: param => {
    return new Promise(res => {
      //todo : 모든 데이타를 가져온다.
      Promise.all([
        Api.getBackupSites(null),
        Api.getBackupHighlights(null),
        Api.getOptions(),
        Api.getBackupCategorys(),
        Api.getBackupCategorysRelation()
      ]).then(values => {
        let data = new Object();
        data.sites = values[0];
        data.highlights = values[1];
        data.options = values[2];
        data.categorys = values[3];
        data.categoryRelation = values[4];

        res(data);
      });
    });
  },
  getBackupSites: () => {
    return select(Query.getBackupSites());
  },
  getBackupHighlights: () => {
    return select(Query.getBackupHighlights());
  },
  getBackupCategorysRelation: () => {
    return select(Query.getBackupCategorys());
  },
  getBackupCategorys: () => {
    return select(Query.getBackupCategorysRelation());
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
      let obj = new Object();

      let site = Api.getSite(parameter);
      let items = Api.getAllItems(parameter);
      let options = Api.getOptions();

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
          } else {
            allItems.HIGHLIGHT_LIST = null;
            allItems.SITE_CHECK = "N";
          }

          obj.allItems = allItems;
          obj.options = options[0];

          res(obj);
        },
        reason => {}
      );
    });
  },
  getAllCategoryCount: () => {
    return select(Query.getAllCategoryCount(), []);
  },
  getNoCategoryCount: () => {
    return select(Query.getNoCategoryCount(), []);
  },
  getOptions: () => {
    return select(Query.getOptions(), []);
  },
  getSite: params => {
    let param = [params.URL_KEY, params.EMAIL];
    return select(Query.getSite(), param);
  },
  getSites: params => {
    let query = Query.getSites(params);
    let parameter = params;
    if (params !== null && params.flag === null) {
      //일반 카테고리
      parameter = [
        params.id,
        params.EMAIL,
        params.startOffset,
        params.endOffset
      ];
    } else {
      parameter = [params.EMAIL, params.startOffset, params.endOffset];
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
    let param = [
      params.MEMO,
      params.COLOR,
      new Date().getTime(),
      params.URL_KEY,
      params.IDX
    ];
    return update(Query.updateItem(), param);
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
    let param = [new Date().getTime(), params.URL_KEY, params.IDX];
    return remove(Query.deleteItem(), param);
  },
  deleteItems: params => {
    let param = [new Date().getTime(), params.URL_KEY];
    return remove(Query.deleteItems(), param);
  },
  deleteSiteInCategory: params => {
    let param = [params.URL_KEY];
    return remove(Query.deleteSiteInCategory(), param);
  },
  deleteSite: params => {
    let currentDate = new Date().getTime();
    console.log("currentDate ", currentDate);
    let param = [currentDate, params.URL_KEY];
    return remove(Query.deleteSite(), param);
  },
  postSite: async params => {
    console.log("### ", params);
    let date = new Date().getTime();
    let param = [
      params.URL_KEY,
      params.EMAIL, //email
      params.EMAIL, //owner_email
      params.TITLE,
      params.UPDATE_TITLE,
      params.URL,
      params.OG_TITLE,
      params.OG_DESCRIPTION,
      params.OG_IMAGE,
      params.EMBEDURL,
      "", //params.SHARE_KEY,
      params.HOST,
      params.FULL_TEXT,
      params.URL_TYPE,
      params.READERMODE_CONTENTS,
      date,
      date,
      params.TAG
    ];

    await insert(Query.insertSite(), param);
    return Api.getSite(params);
  },
  getSlack: params => {
    return select(Query.selectSlack(), params);
  },
  updateSlack: params => {
    return insert(Query.updateSlack(), params);
  },
  deleteSlack: params => {
    return insert(Query.deleteSlack(), params);
  },
  postSlack: params => {
    return insert(Query.insertSlack(), params);
  },
  updateOptionColor: params => {
    return update(Query.updateOptionColor(), params);
  },
  updateOptionTheme: params => {
    return update(Query.updateOptionTheme(), params);
  },
  deleteCategoryRelation: param => {
    param = param.slice(1, 2); //URL_KEY만 가져온다
    return remove(Query.deleteCategoryRelation(), param);
  },
  deleteCategoryRelationParent: categoryId => {
    //Relation 에 있는 parent <-> site 의 정보를 삭제한다.
    remove(Query.deleteCategoryRelationParent(), categoryId); //parent IDX를 보낸다
  },
  postCategoryRelation: param => {
    return insert(Query.insertCategoryRelation(), param);
  },
  updateLostCategoryItem: param => {
    //parentId에 categoryId가 포함된 column 을 모두 -1로 변경 (미아로 만든다)
    return update(Query.updateLostCategoryItem(), param);
  },
  insertCategoryItem: param => {
    return insert(Query.insertCategoryItem(), param);
  },
  updateCategoryItem: param => {
    if (param[3]) {
      //root에서 child로 수정 시,
      param[1] = 0; //rootId
    }
    param = param.slice(0, 3);

    return update(Query.updateCategoryItem(), param);
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
  }
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
            console.log("rej ", error);
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
