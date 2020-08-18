import { DDL } from "./DDL_Query";
import Utils from "../dashboard/utils/Utils";

let db = openDatabase("HL", "1.0", "DATABASE", 200000);

export default {
  initData: accountInfo => {
    return new Promise(res => {
      let INIT_OPTIONS =
        `INSERT INTO TBL_OPTIONS  VALUES(\'` +
        accountInfo.email +
        `\','highlight-color-1,highlight-color-2,highlight-color-3,highlight-color-4,highlight-color-5,highlight-color-6' --COLOR
                        ,'EN'
                        ,'Y'--MESSAGE_ALTER
                        ,'Y' --highlight
                        ,'N' --rootsite
                        ,'N' --excute_iframe
                        ,'N' --viewWidget
                        ,0
                        ,null --EXCLUDE_SITE
                        ,'N' --SYNC_BOOKMARK
                        ,'dark' --THEME (dark / light);
                    )`;

      let INIT_CATEGORY =
        `INSERT INTO TBL_CATEGORY(
                                    IDX,
                                     EMAIL,
                                     NAME,
                                     PARENT,
                                     DEPTH,
                                     SORT,
                                     TYPE,
                                     FLAG,
                                     DATE_CREATE
                            ) VALUES  (1,\'` +
        accountInfo.email +
        `\', 'DEFAULT CATEGORY', 0, 0, 0, 'SYSTEM','root', null),
                                          (5,\'` +
        accountInfo.email +
        `\', 'ALL CATEGORY', 1, 1, 1, 'SYSTEM','all', null),
                                          (6,\'` +
        accountInfo.email +
        `\', 'NO CATEGORY', 1, 1, 2, 'SYSTEM','nocategory', null)
                                          `;

      db.transaction(tx => {
        tx.executeSql(INIT_OPTIONS, []);
        tx.executeSql(INIT_CATEGORY, []);
      });
      res(true);
    });
  },
  selectData: query => {
    return new Promise(res => {
      db.transaction(tx => {
        tx.executeSql(query, null, (tx, rs) => {
          let retArray = new Array();
          for (let i = 0; i < rs.rows.length; i++) {
            retArray.push(rs.rows.item(i));
          }
          res(retArray);
        });
      });
    });
  },
  createTable: () => {
    DDL.CREATE(db);
  },
  dropTable: () => {
    DDL.DROP(db);
  },
  addTable: () => {
    DDL.ADD_TABLE(db);
  },
  removeTable: () => {
    DDL.DROP_TABLE(db);
  },
  truncateTable: async () => {
    let result = await Utils.getLocalStorage("loginInfo");
    DDL.TRUNCATE(db, result.loginInfo);
  }
};
