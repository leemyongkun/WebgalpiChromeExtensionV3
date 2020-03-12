import { DROP_TABLE_QUERY, CREATE_TABLE_QUERY, DDL } from "./DDL_Query";

let db = openDatabase("HL", "1.0", "DATABASE", 200000);

export default {
  initData: () => {
    let TRUNC_OPTIONS = `DELETE FROM TBL_OPTIONS`;
    let INIT_OPTIONS = `INSERT INTO TBL_OPTIONS  VALUES(
                        'kkuni.bear@gmail.com'
                        ,'highlight-color-1,highlight-color-2,highlight-color-3,highlight-color-4,highlight-color-5' --COLOR
                        ,'KR'
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

    let TRUNC_CATEGORY = `DELETE FROM TBL_CATEGORY`;
    let INIT_CATEGORY = `INSERT INTO TBL_CATEGORY(
                                    IDX,
                                     EMAIL,
                                     NAME,
                                     PARENT,
                                     DEPTH,
                                     SORT,
                                     TYPE,
                                     FLAG,
                                     DATE_CREATE
                            ) VALUES  (1,'', 'DEFAULT CATEGORY', 0, 0, 0, 'SYSTEM','root', null),
                                          (5,'', 'ALL CATEGORY', 1, 1, 1, 'SYSTEM','all', null),
                                          (6,'', 'NO CATEGORY', 1, 1, 2, 'SYSTEM','nocategory', null)
                                          `;

    db.transaction(function(tx) {
      tx.executeSql(TRUNC_OPTIONS, []);
      tx.executeSql(INIT_OPTIONS, []);
      tx.executeSql(TRUNC_CATEGORY, []);
      tx.executeSql(INIT_CATEGORY, []);
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
  }
};
