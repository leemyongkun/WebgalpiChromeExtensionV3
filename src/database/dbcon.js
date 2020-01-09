import { DROP_TABLE_QUERY, CREATE_TABLE_QUERY, DDL } from "./DDL_Query";
let db = openDatabase("HL", "1.0", "DATABASE", 200000);

export default {
  initData: () => {
    //let insertData = `insert into TBL_AUTHORITY values ('kkuni.bear@gmail.com', '1' , 'n', 11029394)`;
    let TRUNC_OPTIONS = `DELETE FROM TBL_OPTIONS`;
    let INIT_OPTIONS = `INSERT INTO TBL_OPTIONS  VALUES(
                        ''
                        ,'1'
                        ,'KR'
                        ,'Y'--MESSAGE_ALTER
                        ,'Y' --highlight
                        ,'N' --rootsite
                        ,'N' --excute_iframe
                        ,'N' --viewWidget
                        ,0
                        ,null --EXCLUDE_SITE
                        ,'N' --SYNC_BOOKMARK
                        ,'Y' --SYMPLE_WIDGET
                    )`;
    let TRUNC_CATEGORY = `DELETE FROM TBL_CATEGORY`;
    let INIT_CATEGORY = `INSERT INTO TBL_CATEGORY(
                                     IDX,
                                     EMAIL,
                                     NAME,
                                     DATE_CREATE,
                                     PARENT,
                                     DEPTH,
                                     CATEGORY_STATUS,
                                     SHARE, --Y/N
                                     TYPE, --SYSTEM / CUSTOM
                                     FL_LOCK, --Y/N
                                     FL_PUBLISH --Y/N
                            ) VALUES (
                                      7,
                                      null, --EMAIL
                                      '개발관련',
                                      null, --DATE_CREATE
                                      null, --parent 최상위
                                      0, --depth 
                                      null, --category_status
                                      'N', --share
                                      'SYSTEM', --type
                                      'N', --fl_locl
                                      'N' --fl_publish
                                     ),(
                                      0,
                                      null, --EMAIL
                                      '컨텐츠',
                                      null, --DATE_CREATE
                                      null, --parent 최상위
                                      0, --depth 
                                      null, --category_status
                                      'N', --share
                                      'SYSTEM', --type
                                      'N', --fl_locl
                                      'N' --fl_publish
                                     ),(
                                      1,
                                      null, --EMAIL
                                      'YOUTUBE',
                                      null, --DATE_CREATE
                                      0, --parent 
                                      1, --depth 
                                      null, --category_status
                                      'N', --share
                                      'SYSTEM', --type
                                      'N', --fl_locl
                                      'N' --fl_publish
                                     ),(
                                      2,
                                      null, --EMAIL
                                      'FACEBOOK',
                                      null, --DATE_CREATE
                                      0, --parent 
                                      1, --depth 
                                      null, --category_status
                                      'N', --share
                                      'SYSTEM', --type
                                      'N', --fl_locl
                                      'N' --fl_publish
                                     ),(
                                      3,
                                      null, --EMAIL
                                      'TWITTER',
                                      null, --DATE_CREATE
                                      0, --parent 
                                      1, --depth 
                                      null, --category_status
                                      'N', --share
                                      'SYSTEM', --type
                                      'N', --fl_locl
                                      'N' --fl_publish
                                     ),(
                                      4,
                                      null, --EMAIL
                                      'NAVER-BLOG',
                                      null, --DATE_CREATE
                                      0, --parent 
                                      1, --depth 
                                      null, --category_status
                                      'N', --share
                                      'SYSTEM', --type
                                      'N', --fl_locl
                                      'N' --fl_publish
                                     ),(
                                      5,
                                      null, --EMAIL
                                      'DAUM-BLOG',
                                      null, --DATE_CREATE
                                      0, --parent 
                                      1, --depth 
                                      null, --category_status
                                      'N', --share
                                      'SYSTEM', --type
                                      'N', --fl_locl
                                      'N' --fl_publish
                                     ),(
                                      6,
                                      null, --EMAIL
                                      'NEWS',
                                      null, --DATE_CREATE
                                      0, --parent 
                                      1, --depth 
                                      null, --category_status
                                      'N', --share
                                      'SYSTEM', --type
                                      'N', --fl_locl
                                      'N' --fl_publish
                                     )`;
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
