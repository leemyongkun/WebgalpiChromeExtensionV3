export default {
  insertSite: () => {
    return `INSERT INTO TBL_SITES
		(
            URL_KEY,
            EMAIL,
            OWNER_EMAIL,
            TITLE,
            UPDATE_TITLE,
            URL,
            OG_TITLE,
            OG_DESCRIPTION,
            OG_IMAGE,
            EMBEDURL,
            SHARE_KEY,
            HOST,
            FULL_TEXT,
            FL_DELETE,
            URL_TYPE,
            READERMODE_CONTENTS,
            DATE_CREATE,
            DATE_UPDATE,
            TAGS
		)
		VALUES
		(
         ?,'','',?,?,?,?,?,?,?,?,?,?,'N',?,?,?,?,?)`;
  },
  updateItem: () => {
    return `UPDATE TBL_ITEMS
		SET MEMO = ?, COLOR=?
		WHERE URL_KEY = ?
		AND IDX = ?`;
  },
  deleteItem: () => {
    return `DELETE FROM TBL_ITEMS
		WHERE URL_KEY = ?
		AND IDX = ?`;
  },
  insertItem: () => {
    return `INSERT INTO TBL_ITEMS
		( 	IDX,
            URL_KEY,
            EMAIL,
            TEXT,
            PREV,
            NEXT,
            PRINT_TEXT,
            POSITION,
            COLOR,
            MEMO,
            FL_DELETE,
            GB_FILETYPE,
            IMAGE,
            FL_READMODE,
            PAGE_NUMBER,
            DATE_CREATE
		)
		VALUES (?,?,'',?,?,?,?,?,?,?,'N',?,?,?,?,?)`;
  },

  getOptions: () => {
    return `SELECT
                    EMAIL
                    ,COLOR
                    ,MESSAGE_ALERT
                    ,LANGUAGE
                    ,EXCLUDE_SITE
                    ,HIGHLIGHT
                    ,ROOT_SITE
                    ,VIEW_WIDGET
                    ,THEME
                    ,DATE_CREATE
                    ,SYNC_BOOKMARK
                FROM TBL_OPTIONS`;
  },
  getSite: () => {
    return `SELECT 
                    IDX,
                    URL_KEY,
                    EMAIL,
                    TITLE,
                    UPDATE_TITLE,
                    URL,
                    DATE_CREATE,
                    OG_TITLE,
                    OG_DESCRIPTION,
                    OG_IMAGE,
                    EMBEDURL,
                    SHARE_KEY,
                    HOST,
                    TAGS,
                    MEMO
                    FROM TBL_SITES
                    WHERE URL_KEY = ?
                    AND FL_DELETE = 'N'
                    LIMIT 1 `;
  },
  getSites: params => {
    let joinCondition = ""; //" WHERE CATEGORY.URL_KEY IS NULL";
    let limit = ""; //"LIMIT 5";
    if (params !== null) {
      joinCondition = " WHERE REL_CATEGORY.CATEGORY_IDX = ?";
    }
    return (
      `SELECT 
                    SITES.IDX,
                     SITES.URL_KEY,
                    SITES.EMAIL,
                    SITES.OWNER_EMAIL,
                    TITLE,
                    UPDATE_TITLE,
                    URL,
                    OG_TITLE,
                    OG_DESCRIPTION,
                    OG_IMAGE,
                    EMBEDURL,
                    SHARE_KEY,
                    HOST,
                    FULL_TEXT,
                    FL_DELETE,
                    URL_TYPE,
                    READERMODE_CONTENTS,
                    SITES.DATE_CREATE,
                    DATE_UPDATE,
                    TAGS,
                    CASE WHEN CATEGORY.NAME IS NULL THEN 'NO_CATEGORY' ELSE CATEGORY.NAME END AS CATEGORY_NAME,
                    '' as CLASS
                    FROM TBL_SITES SITES LEFT JOIN TBL_REL_CATEGORY REL_CATEGORY
                    ON SITES.URL_KEY = REL_CATEGORY.URL_KEY
                    LEFT JOIN TBL_CATEGORY CATEGORY
                    ON REL_CATEGORY.CATEGORY_IDX = CATEGORY.IDX
                    ` +
      joinCondition +
      `
                    AND SITES.FL_DELETE = 'N'
                     ORDER BY SITES.DATE_CREATE DESC
                    `
    );
  },
  getCategory: flag => {
    let lostCondition = "WHERE PARENT = -1";
    if (flag === "all") {
      lostCondition = "WHERE PARENT != -1";
    }
    return (
      `SELECT id,
                   name,
                   parent,
                   depth,
                   mouseOver,
                   dropOver,
                   class,
                   SUM(CNT) as cnt
            FROM (
                     SELECT IDX     as id,
                            NAME    as name,
                            PARENT  as parent,
                            DEPTH   as depth,
                            false   as mouseOver,
                            false   as dropOver,
                            ''      as class,
                            CASE
                                WHEN B.CATEGORY_IDX IS NULL
                                    THEN 0
                                ELSE 1
                                END AS CNT
                     FROM TBL_CATEGORY A
                              LEFT JOIN TBL_REL_CATEGORY B
                                        ON A.IDX = B.CATEGORY_IDX
                                       ` +
      lostCondition +
      `
                 )
            GROUP BY id, name, parent, depth, mouseOver, dropOver`
    );
  },
  getAllItems: () => {
    return `SELECT 
                    IDX,
                    URL_KEY,
                    TEXT,
                    NEXT,
                    PREV,
                    PRINT_TEXT,
                    IMAGE,
                    POSITION,
                    COLOR,
                    MEMO,
                    FL_DELETE,
                    GB_FILETYPE,
                    DATE_CREATE,
                    PAGE_NUMBER,
                    FL_READMODE AS FL_READERMODE
                FROM TBL_ITEMS 
                WHERE URL_KEY = ?
                AND FL_DELETE = 'N'`;
  },
  selectSlack: () => {
    return `
            SELECT
                IDX, 
                CHANNEL_NAME ,
                WEBHOOK_URL ,
                DATE_CREATE 
             FROM TBL_SLACK
             `;
  },
  updateSlack: () => {
    return `
             UPDATE TBL_SLACK
                SET CHANNEL_NAME = ?,
                WEBHOOK_URL = ? 
            WHERE IDX = ?
             `;
  },
  deleteSlack: () => {
    return `
             DELETE FROM TBL_SLACK
            WHERE IDX = ?
             `;
  },
  insertSlack: () => {
    return `
            INSERT INTO TBL_SLACK
                        (
                        EMAIL,
                        CHANNEL_NAME ,
                        WEBHOOK_URL ,
                        DATE_CREATE
                        )
                        VALUES (?,?,?,?)
             `;
  },
  updateOptionColor: () => {
    return `UPDATE TBL_OPTIONS 
                SET COLOR = ? 
                WHERE EMAIL = ?
      `;
  },
  updateOptionTheme: () => {
    return `UPDATE TBL_OPTIONS 
                SET THEME = ? 
                `;
  },
  insertCategoryRelation: () => {
    return `INSERT INTO TBL_REL_CATEGORY
		( 	CATEGORY_IDX,
            URL_KEY,
            EMAIL,
            SITE_IDX,
            DATE_CREATE
		)
		VALUES (?,?,?,?,?)`;
  },
  deleteCategoryRelation: () => {
    return `DELETE FROM TBL_REL_CATEGORY
                WHERE URL_KEY = ? 
		`;
  },
  deleteCategoryRelationParent: () => {
    return `DELETE FROM TBL_REL_CATEGORY
                WHERE CATEGORY_IDX = ? 
		`;
  },
  updateLostCategoryItem: () => {
    return `UPDATE TBL_CATEGORY
                SET PARENT = -1 
                WHERE PARENT = ?
		`;
  },
  updateCategoryItem: () => {
    return `UPDATE TBL_CATEGORY
                SET NAME = ? 
                , PARENT = ?
                WHERE IDX = ? 
		`;
  },
  insertCategoryItem: () => {
    return `INSERT INTO TBL_CATEGORY(
                                     EMAIL,
                                     NAME,
                                     PARENT,
                                     DEPTH,
                                     SORT,
                                     DATE_CREATE) 
                VALUES (?,?,?,?,?,?) 
		`;
  }
};
