import { DROP_TABLE_QUERY, CREATE_TABLE_QUERY, DDL } from "./DDL_Query";
let db = openDatabase("HL", "1.0", "DATABASE", 200000);

export default {
  initData: () => {
    //let insertData = `insert into TBL_AUTHORITY values ('kkuni.bear@gmail.com', '1' , 'n', 11029394)`;
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
                        ,'light' --THEME
                    )`;
    let TRUNC_CATEGORY = `DELETE FROM TBL_CATEGORY`;
    let INIT_CATEGORY = `INSERT INTO TBL_CATEGORY(
                                    IDX,
                                     EMAIL,
                                     NAME,
                                     PARENT,
                                     DEPTH,
                                     SORT,
                                     DATE_CREATE
                            ) VALUES  (1,'kkuni.bear@gmail.com', '기술', 0, 0, 0, null),
                                          (5,'kkuni.bear@gmail.com', '자바', 1, 1, 1, null),
                                          (6,'kkuni.bear@gmail.com', '크롬', 1, 1, 2, null),
                                          (7,'kkuni.bear@gmail.com', '자바스크립트', 1, 1, 3, null),
                                      (2,'kkuni.bear@gmail.com', '취미', 0, 0, 0, null),
                                          (8,'kkuni.bear@gmail.com', '사진', 2, 1, 1, null),
                                          (9,'kkuni.bear@gmail.com', '영화', 2, 1, 2, null),
                                          (10,'kkuni.bear@gmail.com', '도서', 2, 1, 3, null),
                                      (3,'kkuni.bear@gmail.com', '쇼핑', 0, 0, 0, null),
                                          (11,'kkuni.bear@gmail.com', '쿠팡', 3, 1, 1, null),
                                          (12,'kkuni.bear@gmail.com', '위메프', 3, 1, 2, null),
                                          (13,'kkuni.bear@gmail.com', '티몬', 3, 1, 3, null),
                                      (4,'kkuni.bear@gmail.com', '잡동사니', 0, 0, 0, null),
                                          (14,'kkuni.bear@gmail.com', '뉴스', 4, 1, 1, null)
                                              
                                          `;

    db.transaction(function(tx) {
      tx.executeSql(TRUNC_OPTIONS, []);
      tx.executeSql(INIT_OPTIONS, []);
      tx.executeSql(TRUNC_CATEGORY, []);
      // tx.executeSql(INIT_CATEGORY, []);
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
