import Query from "../database/query.js";

var db = openDatabase("HL", "1.0", "DATABASE", 200000);

let Api = {
  getBackupData: () => {
    return new Promise(res => {
      //todo : 모든 데이타를 가져온다.
      //getBackupSites
      //getBackupHighlights
      //getBackupOption
      //getBackupCategorys
      //getBackupCategorysRelation

      res(true);
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

          let loginInfo = new Object();
          loginInfo.NAME = "임용근";
          loginInfo.IMAGE_URL = "";
          loginInfo.EMMAIL = "kkuni.bear@gmail.com";

          obj.allItems = allItems;
          obj.options = options[0];
          obj.loginInfo = loginInfo;

          res(obj);
        },
        reason => {}
      );
    });
  },

  getOptions: () => {
    return select(Query.getOptions(), []);
  },
  getSite: params => {
    let param = [params.URL_KEY];
    console.log("param ", param);
    return select(Query.getSite(), param);
  },
  getSites: params => {
    let query = Query.getSites(params);
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
    let result = select(Query.getAllItems(), [parameter.URL_KEY]);
    return result;
  },
  updateItem: params => {
    let param = [params.MEMO, params.COLOR, params.URL_KEY, params.IDX];
    return update(Query.updateItem(), param);
  },

  postItem: params => {
    let param = [
      params.IDX,
      params.URL_KEY,
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
      params.DATE_CREATE
    ];
    return insert(Query.insertItem(), param);
  },
  deleteItem: params => {
    let param = [params.URL_KEY, params.IDX];
    return remove(Query.deleteItem(), param);
  },
  deleteItems: params => {
    let param = [params.URL_KEY];
    return remove(Query.deleteItems(), param);
  },
  deleteSite: params => {
    let param = [params.URL_KEY];
    return remove(Query.deleteSite(), param);
  },
  postSite: async params => {
    let date = new Date().getTime();
    let param = [
      params.URL_KEY,
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
    console.log("updateOptionTheme.params ", params);
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
    console.log("Query.insertCategoryItem() ", Query.insertCategoryItem());
    console.log("insertCategoryItem ", param);
    return insert(Query.insertCategoryItem(), param);
  },
  updateCategoryItem: param => {
    if (param[3]) {
      //root에서 child로 수정 시,
      param[1] = 0; //rootId
    }
    param = param.slice(0, 3);

    console.log("param ", param);
    return update(Query.updateCategoryItem(), param);
  }
};

function update(query, param) {
  return new Promise((res, rej) => {
    db.transaction(tx => {
      tx.executeSql(query, param, (tx, rs) => {
        console.log(tx, rs);
        res(param);
      });
    });
  });
}

function remove(query, param) {
  return new Promise(res => {
    db.transaction(tx => {
      tx.executeSql(query, param, (tx, rs) => {
        console.log("REMOVE", tx, rs);
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
          console.log(tx, rs);
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
