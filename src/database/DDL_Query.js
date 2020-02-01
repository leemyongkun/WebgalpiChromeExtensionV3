let DROP_TABLE_QUERY = {
  TBL_SITES: () => {
    return `DROP TABLE TBL_SITES `;
  },

  TBL_REL_CATEGORY: () => {
    return `DROP TABLE TBL_REL_CATEGORY`;
  },

  TBL_CAPTURE: () => {
    return `DROP TABLE  TBL_CAPTURE `;
  },

  TBL_CATEGORY: () => {
    return `DROP TABLE TBL_CATEGORY `;
  },
  TBL_ITEMS: () => {
    return `DROP TABLE TBL_ITEMS `;
  },
  TBL_MEMBER: () => {
    return `DROP TABLE TBL_MEMBER `;
  },

  TBL_OPTIONS: () => {
    return `DROP TABLE TBL_OPTIONS `;
  },

  TBL_SLACK: () => {
    return `DROP TABLE TBL_SLACK `;
  }
};
let CREATE_TABLE_QUERY = {
  TBL_SITES: () => {
    return `
        CREATE TABLE IF NOT EXISTS TBL_SITES (
            IDX INTEGER PRIMARY KEY,
            URL_KEY TEXT ,
            EMAIL TEXT,
            TITLE TEXT,
            URL TEXT,
            OG_TITLE TEXT,
            OG_DESCRIPTION TEXT,
            OG_IMAGE TEXT,
            EMBEDURL TEXT,
            SHARE_KEY TEXT,
            HOST TEXT,
            FULL_TEXT TEXT,
            FL_DELETE TEXT,
            UPDATE_TITLE TEXT,
            URL_TYPE TEXT,
            TAGS TEXT,
            OWNER_EMAIL TEXT,
            READERMODE_CONTENTS TEXT,
            FL_FAVORITE TEXT,
            MEMO TEXT,
            DATE_CREATE NUMERIC,
            DATE_UPDATE NUMERIC
    )`;
  },
  TBL_REL_CATEGORY: () => {
    return `
                CREATE TABLE IF NOT EXISTS TBL_REL_CATEGORY (
                   CATEGORY_IDX INTEGER,
                   URL_KEY TEXT,
                   EMAIL TEXT,
                   OWNER_EMAIL TEXT,
                   STATUS TEXT,
                   SITE_IDX INTEGER,
                   DATE_CREATE NUMERIC
                )`;
  },

  TBL_CAPTURE: () => {
    return `
        CREATE TABLE IF NOT EXISTS TBL_CAPTURE (
          IDX INTEGER PRIMARY KEY,
          EMAIL TEXT,
          URL_KEY TEXT,
          URL TEXT,
          SIZE INTEGER,
          PATH TEXT,
          DATE_CREATE NUMERIC,
          FL_DELETE TEXT,
          MEMO TEXT
          )`;
  },

  TBL_CATEGORY: () => {
    (0, "kkuni.bear@gmail.com", "기술", null, 0, 0, null),
      (3, "kkuni.bear@gmail.com", "자바", 0, 1, 1, null),
      (4, "kkuni.bear@gmail.com", "크롬", 0, 1, 2, null),
      (5, "kkuni.bear@gmail.com", "자바스크립트", 0, 1, 3, null),
      (1, "kkuni.bear@gmail.com", "취미", null, 0, 0, null),
      (6, "kkuni.bear@gmail.com", "사진", 1, 1, 1, null),
      (7, "kkuni.bear@gmail.com", "영화", 1, 1, 2, null),
      (8, "kkuni.bear@gmail.com", "도서", 1, 1, 3, null),
      (2, "kkuni.bear@gmail.com", "쇼핑", null, 0, 0, null),
      (9, "kkuni.bear@gmail.com", "사진", 2, 1, 1, null),
      (10, "kkuni.bear@gmail.com", "영화", 2, 1, 2, null),
      (11, "kkuni.bear@gmail.com", "도서", 2, 1, 3, null);

    return `
        CREATE TABLE IF NOT EXISTS TBL_CATEGORY (
               IDX INTEGER PRIMARY KEY AUTOINCREMENT,
               EMAIL TEXT,
               NAME TEXT,
               PARENT INTEGER,
               DEPTH INTEGER,
               SORT INTEGER,
               DATE_CREATE NUMERIC
               )`;
  },

  TBL_ITEMS: () => {
    return `
        CREATE TABLE IF NOT EXISTS TBL_ITEMS (
        IDX INTEGER PRIMARY KEY,
        URL_KEY TEXT,
        EMAIL TEXT,
        TEXT TEXT,
        IMAGE TEXT,
        MEMO TEXT,
        POSITION INTEGER,
        COLOR TEXT,
        FL_DELETE TEXT,
        GB_FILETYPE TEXT,
        DATE_CREATE NUMERIC,
        FL_READMODE TEXT,
        PRINT_TEXT TEXT,
        PREV TEXT,
        NEXT TEXT,
        PAGE_NUMBER INTEGER
        )`;
  },

  TBL_MEMBER: () => {
    return `CREATE TABLE IF NOT EXISTS TBL_MEMBER (
                        EMAIL TEXT,
                         NAME TEXT,
                         PASSWORD TEXT,
                         IMAGE_URL TEXT,
                         SIGNUP_FLAG TEXT,
                         AUTH_MAIL TEXT,
                         DATE_CREATE NUMERIC
                         )`;
  },

  TBL_OPTIONS: () => {
    return `CREATE TABLE IF NOT EXISTS TBL_OPTIONS (
                      EMAIL TEXT PRIMARY KEY,
                      COLOR TEXT,
                      LANGUAGE TEXT,
                      MESSAGE_ALERT TEXT,
                      HIGHLIGHT TEXT,
                      ROOT_SITE TEXT,
                      EXCUTE_IFRAME TEXT,
                      VIEW_WIDGET TEXT,
                      DATE_CREATE NUMERIC,
                      EXCLUDE_SITE TEXT,
                      SYNC_BOOKMARK TEXT,
                      THEME TEXT
                      )`;
  },

  TBL_SLACK: () => {
    return `CREATE TABLE IF NOT EXISTS TBL_SLACK (
                      IDX INTEGER PRIMARY KEY AUTOINCREMENT,
                      EMAIL TEXT,
                      CHANNEL_NAME TEXT,
                      WEBHOOK_URL TEXT,
                      DATE_CREATE NUMERIC
                      )`;
  }
};

let DDL = {
  DROP: db => {
    return new Promise(function(res) {
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_SITES(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_REL_CATEGORY(), []);
      });

      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_CATEGORY(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_ITEMS(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_MEMBER(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_OPTIONS(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_SLACK(), []);
      });

      res(true);
    });
  },
  CREATE: db => {
    console.log("DDL Init Database");
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_SITES(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_REL_CATEGORY(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_CAPTURE(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_CATEGORY(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_ITEMS(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_MEMBER(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_OPTIONS(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_SLACK(), []);
    });
  }
};

export { DROP_TABLE_QUERY, CREATE_TABLE_QUERY, DDL };
