let TRUNCATION_TABLE_QUERY = {
  SITES: param => {
    return `DELETE FROM TBL_SITES
            WHERE EMAIL = '${param.EMAIL}'
            `;
  },
  HIGHLIGHTS: param => {
    return `DELETE FROM TBL_ITEMS
            WHERE EMAIL = '${param.EMAIL}'
            `;
  },
  CATEGORY: param => {
    return `DELETE FROM TBL_CATEGORY 
            WHERE EMAIL = '${param.EMAIL}'
            AND TYPE ='CUSTOM'`;
  },
  CATEGORY_RELATION: param => {
    return `DELETE FROM TBL_REL_CATEGORY 
            WHERE EMAIL = '${param.EMAIL}'
            `;
  },
  ONETAB: param => {
    return `DELETE FROM TBL_ONETAB
            WHERE EMAIL = '${param.EMAIL}'
            `;
  }
};

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
  TBL_ONETAB: () => {
    return `DROP TABLE TBL_ONETAB `;
  },
  TBL_SLACK: () => {
    return `DROP TABLE TBL_SLACK `;
  },
  TBL_UPDATE_HISTORY: () => {
    return `DROP TABLE TBL_UPDATE_HISTORY `;
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
            HOST TEXT,
            FULL_TEXT TEXT,
            FL_DELETE TEXT,
            UPDATE_TITLE TEXT,
            URL_TYPE TEXT,
            TAGS TEXT,
            OWNER_EMAIL TEXT,
            READERMODE_CONTENTS TEXT,
            FL_BOOKMARK TEXT,
            FL_READMODE TEXT,
            FL_FAVORITE TEXT,
            FL_BACKUP TEXT,
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
    return `
        CREATE TABLE IF NOT EXISTS TBL_CATEGORY (
               IDX INTEGER PRIMARY KEY AUTOINCREMENT,
               EMAIL TEXT,
               NAME TEXT,
               PARENT INTEGER,
               DEPTH INTEGER,
               SORT INTEGER,
               TYPE TEXT,
               FLAG TEXT,
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
        FL_READMODE TEXT,
        PRINT_TEXT TEXT,
        PREV TEXT,
        NEXT TEXT,
        PAGE_NUMBER INTEGER,
        DATE_CREATE NUMERIC,
        DATE_UPDATE NUMERIC
        )`;
  },

  TBL_MEMBER: () => {
    return `CREATE TABLE IF NOT EXISTS TBL_MEMBER (
                        EMAIL TEXT,
                         NAME TEXT,
                         PASSWORD TEXT,
                         IMAGE_URL TEXT,
                         IS_USE TEXT,
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

  TBL_UPDATE_HISTORY: () => {
    return `CREATE TABLE IF NOT EXISTS TBL_UPDATE_HISTORY (
                      EMAIL TEXT PRIMARY KEY,
                      LATEST_GOOGLE_BACKUP_DATE NUMERIC,
                      LATEST_GOOGLE_RESTORE_DATE NUMERIC,
                      LATEST_FIREBASE_BACKUP_DATE NUMERIC,
                      LATEST_FIREBASE_RESTORE_DATE NUMERIC,
                      RESERVE_DATE_1 NUMERIC,
                      RESERVE_DATE_2 NUMERIC,
                      RESERVE_DATE_3 NUMERIC,
                      RESERVE_DATE_4 NUMERIC,
                      RESERVE_DATE_5 NUMERIC,
                      RESERVE_DATE_6 NUMERIC)`;
  },
  TBL_ONETAB: () => {
    return `CREATE TABLE IF NOT EXISTS TBL_ONETAB (
                    EMAIL TEXT,
                    GROUP_ID INTEGER,
                    URL TEXT,
                    URL_KEY TEXT,
                    TITLE TEXT,
                    DESCRIPTION TEXT,
                    FL_DELETE TEXT,
                    DATE_CREATE NUMERIC
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
  ADD_TABLE: db => {
    return new Promise(function(res) {
      db.transaction(function(tx) {
        tx.executeSql(CREATE_TABLE_QUERY.TBL_UPDATE_HISTORY(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(CREATE_TABLE_QUERY.TBL_ONETAB(), []);
      });
      res(true);
    });
  },
  DROP_TABLE: db => {
    return new Promise(function(res) {
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_SLACK(), []);
      });
      res(true);
    });
  },
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
        tx.executeSql(DROP_TABLE_QUERY.TBL_UPDATE_HISTORY(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_ONETAB(), []);
      });
      res(true);
    });
  },
  CREATE: db => {
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
      tx.executeSql(CREATE_TABLE_QUERY.TBL_UPDATE_HISTORY(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_ONETAB(), []);
    });
  },
  TRUNCATE: (db, param) => {
    //SITE
    db.transaction(function(tx) {
      tx.executeSql(TRUNCATION_TABLE_QUERY.SITES(param), []);
    });

    //HIGHLIGHT
    db.transaction(function(tx) {
      tx.executeSql(TRUNCATION_TABLE_QUERY.HIGHLIGHTS(param), []);
    });

    //CATEGORY
    db.transaction(function(tx) {
      tx.executeSql(TRUNCATION_TABLE_QUERY.CATEGORY(param), []);
    });
    //CATEGORY_RELATION
    db.transaction(function(tx) {
      tx.executeSql(TRUNCATION_TABLE_QUERY.CATEGORY_RELATION(param), []);
    });
    /*  //ONETAB
        db.transaction(function(tx) {
          tx.executeSql(TRUNCATION_TABLE_QUERY.ONETAB(param), []);
        });*/
  }
};

export { DDL };
