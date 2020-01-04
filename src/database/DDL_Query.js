let DROP_TABLE_QUERY = {
  TBL_SITES: () => {
    return `DROP TABLE TBL_SITES `;
  },

  TBL_REL_CATEGORY_WEB: () => {
    return `DROP TABLE TBL_REL_CATEGORY_WEB`;
  },

  TBL_AUTHORITY: () => {
    return `DROP TABLE TBL_AUTHORITY `;
  },

  TBL_CAPTURE: () => {
    return `DROP TABLE  TBL_CAPTURE `;
  },

  TBL_CATEGORY_GRANT: () => {
    return `DROP TABLE TBL_CATEGORY_GRANT`;
  },

  TBL_CATEGORY: () => {
    return `DROP TABLE TBL_CATEGORY `;
  },
  TBL_EXCLUDE_SITE: () => {
    return `DROP TABLE TBL_EXCLUDE_SITE `;
  },
  TBL_FILES: () => {
    return `DROP TABLE TBL_FILES `;
  },
  TBL_ITEMS: () => {
    return `DROP TABLE TBL_ITEMS `;
  },
  TBL_LOG_COPY_SITE: () => {
    return `DROP TABLE TBL_LOG_COPY_SITE `;
  },

  TBL_LOG_LOGIN: () => {
    return `DROP TABLE TBL_LOG_LOGIN `;
  },

  TBL_MEMBER: () => {
    return `DROP TABLE TBL_MEMBER `;
  },

  TBL_NOTICE: () => {
    return `DROP TABLE TBL_NOTICE `;
  },

  TBL_OPTIONS: () => {
    return `DROP TABLE TBL_OPTIONS `;
  },

  TBL_QNA: () => {
    return `DROP TABLE TBL_QNA `;
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
  TBL_REL_CATEGORY_WEB: () => {
    return `
                CREATE TABLE IF NOT EXISTS TBL_REL_CATEGORY_WEB (
                   CATEGORY_IDX INTEGER,
                   URL_KEY TEXT,
                   EMAIL TEXT,
                   OWNER_EMAIL TEXT,
                   STATUS TEXT,
                   SITE_IDX INTEGER,
                   DATE_CREATE NUMERIC
                )`;
  },

  TBL_AUTHORITY: () => {
    return `
            CREATE TABLE IF NOT EXISTS TBL_AUTHORITY (
            EMAIL TEXT,
            TYPE TEXT,
            FL_DELETE  TEXT,
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

  TBL_CATEGORY_GRANT: () => {
    return `
CREATE TABLE IF NOT EXISTS TBL_CATEGORY_GRANT (
                 IDX INTEGER PRIMARY KEY,
                 CATEGORY_IDX INTEGER,
                 EMAIL TEXT,
                 OWNER_EMAIL TEXT,
                 FL_MASTER  TEXT,
                 GRANT_READ  TEXT,
                 GRANT_WRITE  TEXT,
                 GRANT_DELETE  TEXT,
                 DATE_CREATE NUMERIC,
                 FL_MEMBER TEXT,
                 FL_CONFIRM TEXT,
                 PARENT_CATEGORY_IDX INTEGER,
                 DEPTH  TEXT
)`;
  },

  TBL_CATEGORY: () => {
    return `
CREATE TABLE IF NOT EXISTS TBL_CATEGORY (
               IDX INTEGER PRIMARY KEY,
               EMAIL TEXT,
               NAME TEXT,
               DATE_CREATE NUMERIC,
               PARENT INTEGER,
               DEPTH INTEGER,
               CATEGORY_STATUS TEXT,
               SHARE TEXT,
               TYPE TEXT,
               FL_LOCK TEXT,
               FL_PUBLISH TEXT
               )`;
  },
  TBL_EXCLUDE_SITE: () => {
    return `
CREATE TABLE IF NOT EXISTS TBL_EXCLUDE_SITE (
               SITE_PATTERN TEXT,
               EMAIL TEXT
               )`;
  },
  TBL_FILES: () => {
    return `
CREATE TABLE IF NOT EXISTS TBL_FILES (
        IDX INTEGER PRIMARY KEY,
        NAME TEXT,
        ORIGINAL_NAME TEXT,
        LINK_URL_KEY TEXT,
        SERVICE_URL_KEY TEXT,
        DATE_CREATE NUMERIC,
        ORIGINAL_URL TEXT,
        REPOSITORY_URL TEXT,
        EMAIL TEXT,
        TYPE TEXT,
        SIZE INTEGER,
        URL_KEY TEXT,
        THUMBNAIL TEXT
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

  TBL_LOG_COPY_SITE: () => {
    return `
                CREATE TABLE IF NOT EXISTS TBL_LOG_COPY_SITE (
                EMAIL TEXT,
                CATEGORY_IDX INTEGER,
                SITE_IDX INTEGER,
                OWNER_EMAIL TEXT,
                OWNER_CATEGORY_IDX INTEGER,
                OWNER_SITE_IDX INTEGER,
                COPY_DATE NUMERIC
                )`;
  },

  TBL_LOG_LOGIN: () => {
    return `
CREATE TABLE IF NOT EXISTS TBL_LOG_LOGIN (
            EMAIL TEXT,
            USER_AGENT TEXT,
            BROWSER_NAME TEXT,
            BROWSER_GROUP TEXT,
            BROWSER_VERSION TEXT,
            OS_NAME TEXT,
            OS_GROUP TEXT,
            OS_VERSION TEXT,
            COUNTRY TEXT,
            IP TEXT,
            LOGIN_DATE NUMERIC
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

  TBL_NOTICE: () => {
    return `CREATE TABLE IF NOT EXISTS TBL_NOTICE (
                     IDX INTEGER PRIMARY KEY,
                     TITLE TEXT,
                     LINK TEXT,
                     DATE TEXT,
                     DATE_CREATE NUMERIC
                     )`;
  },

  TBL_OPTIONS: () => {
    return `CREATE TABLE IF NOT EXISTS TBL_OPTIONS (
                      EMAIL TEXT,
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
                      SIMPLE_WIDGET TEXT
                      )`;
  },

  TBL_QNA: () => {
    return `CREATE TABLE IF NOT EXISTS TBL_QNA (
                      EMAIL TEXT,
                      NAME TEXT,
                      BODY TEXT,
                      HEAD TEXT,
                      URL TEXT,
                      DATE_CREATE NUMERIC,
                      MESSAGE_ID TEXT
                      )`;
  }
};

let DDL = {
  DROP: db => {
    return new Promise(function(res) {
      console.log("DROP TABLE");
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_SITES(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_REL_CATEGORY_WEB(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_AUTHORITY(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_CAPTURE(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_CATEGORY_GRANT(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_CATEGORY(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_EXCLUDE_SITE(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_FILES(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_ITEMS(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_LOG_COPY_SITE(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_LOG_LOGIN(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_MEMBER(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_NOTICE(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_OPTIONS(), []);
      });
      db.transaction(function(tx) {
        tx.executeSql(DROP_TABLE_QUERY.TBL_QNA(), []);
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
      tx.executeSql(CREATE_TABLE_QUERY.TBL_REL_CATEGORY_WEB(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_AUTHORITY(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_CAPTURE(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_CATEGORY_GRANT(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_CATEGORY(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_EXCLUDE_SITE(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_FILES(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_ITEMS(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_LOG_COPY_SITE(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_LOG_LOGIN(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_MEMBER(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_NOTICE(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_OPTIONS(), []);
    });
    db.transaction(function(tx) {
      tx.executeSql(CREATE_TABLE_QUERY.TBL_QNA(), []);
    });
  }
};

export { DROP_TABLE_QUERY, CREATE_TABLE_QUERY, DDL };
