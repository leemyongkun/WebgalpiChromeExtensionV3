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
         ?,'','',?,?,?,?,?,?,?,?,?,'N',?,?,?,?,?)`;
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
  getExcludeSite: () => {
    return `SELECT SITE_PATTERN
		FROM TBL_EXCLUDE_SITE`;
  },
  getAuthority: () => {
    return `select * from TBL_AUTHORITY`;
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
                    ,SIMPLE_WIDGET
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
                    SHARE_KEY,
                    HOST,
                    TAGS,
                    MEMO
                    FROM TBL_SITES
                    WHERE URL_KEY = ?
                    AND FL_DELETE = 'N'
                    LIMIT 1 `;
  },
  getSites: () => {
    return `SELECT 
                    IDX,
                     URL_KEY,
                    EMAIL,
                    OWNER_EMAIL,
                    TITLE,
                    UPDATE_TITLE,
                    URL,
                    OG_TITLE,
                    OG_DESCRIPTION,
                    OG_IMAGE,
                    SHARE_KEY,
                    HOST,
                    FULL_TEXT,
                    FL_DELETE,
                    URL_TYPE,
                    READERMODE_CONTENTS,
                    DATE_CREATE,
                    DATE_UPDATE,
                    TAGS
                    FROM TBL_SITES
                    WHERE FL_DELETE = 'N'
                    `;
    /*
        AND URL_KEY IN (
                        SELECT URL_KEY
                        FROM TBL_REL_CATEGORY
                        WHERE CATEGORY_IDX = ?
                    )
         */
  },
  getMenus: () => {
    return `SELECT 
                     IDX as id,
                    -- EMAIL,
                     NAME as name,
                    -- DATE_CREATE,
                     PARENT as parent,
                     DEPTH as depth,
                     false as mouseOver ,
                     false as dropOver
                     --CATEGORY_STATUS,
                     --SHARE, --Y/N
                     --TYPE, --SYSTEM / CUSTOM
                     --FL_LOCK, --Y/N
                     --FL_PUBLISH --Y/N
                FROM TBL_CATEGORY`;
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
  updateOptionColor: () => {
    return `UPDATE TBL_OPTIONS SET COLOR = ? WHERE EMAIL = ?
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
                WHERE CATEGORY_IDX = ?
                AND URL_KEY = ? 
		`;
  }
};
