import Query from "../database/query.js";

var db = openDatabase("HL", "1.0", "DATABASE", 200000);

let Api = {
  getInitInfo: parameter => {
    return new Promise(res => {
      let obj = new Object();

      let site = Api.getSite(parameter);
      let items = Api.getAllItems(parameter);
      let authority = Api.getAuthority();
      let options = Api.getOptions();
      let excludes_url = Api.getExcludeSite();

      const arr = [site, items, authority, options, excludes_url];
      Promise.all(arr).then(
        values => {
          let obj = new Object();
          let site = values[0];
          let items = values[1];
          let authority = values[2];
          let options = values[3];
          let excludes_url = values[4];

          let allItems = new Object();
          console.log("site ", site);
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
          obj.authority = authority;
          obj.excludes_url = excludes_url;
          obj.loginInfo = loginInfo;

          res(obj);
        },
        reason => {
          console.log("REASON ", reason);
        }
      );
    });
  },
  getExcludeSite: () => {
    return select(Query.getExcludeSite(), []);
  },
  getOptions: () => {
    return select(Query.getOptions(), []);
  },
  getSite: params => {
    let param = [params.URL_KEY];
    return select(Query.getSite(), param);
  },
  getSites: params => {
    return select(Query.getSites(), params);
  },
  getMenus: params => {
    return select(Query.getMenus(), params);
  },
  getAllItems: parameter => {
    //alert("parameter " + JSON.stringify(parameter));
    console.log("parameter ", JSON.stringify(parameter));
    let result = select(Query.getAllItems(), [parameter.URL_KEY]);
    return result;
  },
  getAuthority: () => {
    return select(Query.getAuthority(), []);
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
  postSite: params => {
    let param = [
      params.URL_KEY,
      params.TITLE,
      params.UPDATE_TITLE,
      params.URL,
      params.OG_TITLE,
      params.OG_DESCRIPTION,
      params.OG_IMAGE,
      "", //params.SHARE_KEY,
      params.HOST,
      params.FULL_TEXT,
      params.URL_TYPE,
      params.READERMODE_CONTENTS,
      new Date().getMilliseconds,
      new Date().getMilliseconds,
      params.TAG
    ];
    return insert(Query.insertSite(), param);
  },
  updateOptionColor: params => {
    return update(Query.updateOptionColor(), params);
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
