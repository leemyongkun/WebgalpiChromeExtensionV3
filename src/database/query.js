export default {
  getBackupSites: date => {
    return `
            SELECT 
                IDX,
                URL_KEY ,
                EMAIL ,
                TITLE,
                URL ,
                OG_TITLE,
                OG_DESCRIPTION,
                OG_IMAGE ,
                EMBEDURL ,
                FL_BOOKMARK,
                HOST ,
                FL_DELETE,
                UPDATE_TITLE,
                URL_TYPE ,
                TAGS,
                OWNER_EMAIL,
                FL_READMODE,
                FL_FAVORITE,
                FL_BACKUP,
                MEMO ,
                DATE_CREATE,
                DATE_UPDATE 
            FROM TBL_SITES
            WHERE EMAIL = ?
            AND FL_DELETE = 'N'
            `;
  },
  getBackupHighlights: date => {
    return `
            SELECT *
            FROM TBL_ITEMS
            WHERE EMAIL = ?
            AND FL_DELETE='N'
        `;
  },
  getBackupCategorys: () => {
    return `
            SELECT *
            FROM TBL_CATEGORY
            WHERE TYPE='CUSTOM'
            AND EMAIL = ?
        `;
  },
  getBackupCategorysRelation: () => {
    return `
            SELECT *
            FROM TBL_REL_CATEGORY
            WHERE EMAIL = ?
        `;
  },
  getAllCategoryCount: () => {
    return `SELECT COUNT(*) AS COUNT
        FROM TBL_SITES
        WHERE FL_DELETE = 'N'
        AND EMAIL = ?
        `;
  },
  getNoCategoryCount: () => {
    return `SELECT
            COUNT(*) AS COUNT
        FROM TBL_SITES
        WHERE URL_KEY NOT IN (SELECT URL_KEY from TBL_REL_CATEGORY)
        AND FL_DELETE = 'N'
        AND EMAIL = ?
        `;
  },
  updateMemberUse: () => {
    return `UPDATE TBL_MEMBER
        SET IS_USE = ?
        WHERE EMAIL = ?`;
  },
  selectMembers: () => {
    return `
        SELECT
            EMAIL,
            NAME,
            IMAGE_URL,
            IS_USE
        FROM
        TBL_MEMBER
        WHERE IS_USE = 'Y'
            `;
  },
  selectAllMembers: () => {
    return `
        SELECT
            EMAIL,
            PASSWORD,
            NAME,
            IMAGE_URL,
            IS_USE
        FROM
        TBL_MEMBER
            `;
  },
  insertMember: () => {
    return `
        INSERT
        INTO
        TBL_MEMBER
        (
            EMAIL,
            NAME,
            PASSWORD,
            IMAGE_URL,
            IS_USE,
            DATE_CREATE
        )
        VALUES(
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
        )`;
  },

  insertSite: param => {
    return `
        INSERT INTO TBL_SITES
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
            FL_BOOKMARK,
            HOST,
            FULL_TEXT,
            FL_DELETE,
            URL_TYPE,
            READERMODE_CONTENTS,
            FL_READMODE,
            DATE_CREATE,
            DATE_UPDATE,
            TAGS,
            FL_BACKUP,
            FL_FAVORITE
        )
        VALUES
            ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'N', ?, ?, 'Y', ?, ?, ?,?,'N') `;
  },
  updateItem: () => {
    return `
        UPDATE TBL_ITEMS
        SET MEMO = ?, COLOR = ?, DATE_UPDATE = ?
        WHERE URL_KEY = ?
        AND IDX = ?
        AND EMAIL = ? `;
  },
  deleteItem: () => {
    return `UPDATE TBL_ITEMS
        SET FL_DELETE = 'Y' , DATE_UPDATE = ?
        WHERE URL_KEY = ?
        AND IDX = ? 
        AND EMAIL = ?`;
  },
  deleteItems: () => {
    return `UPDATE TBL_ITEMS
        SET FL_DELETE = 'Y', DATE_UPDATE = ?
        WHERE URL_KEY = ? 
        AND EMAIL = ?`;
  },
  insertItem: () => {
    return `INSERT
        INTO
        TBL_ITEMS
        (IDX,
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
            DATE_CREATE,
            DATE_UPDATE
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'N', ?, ?, ?, ?, ?, ?)`;
  },

  getOptions: () => {
    return `
        SELECT
            EMAIL
            , COLOR
            , MESSAGE_ALERT
            , LANGUAGE
            , EXCLUDE_SITE
            , HIGHLIGHT
            , ROOT_SITE
            , VIEW_WIDGET
            , THEME
            , DATE_CREATE
            , SYNC_BOOKMARK
        FROM TBL_OPTIONS
        WHERE EMAIL = ?`;
  },
  getSites: params => {
    let joinCondition = "WHERE 1=1"; //" WHERE CATEGORY.URL_KEY IS NULL";
    if (params !== null && params.flag === null) {
      //일반 카테고리
      joinCondition = " WHERE REL_CATEGORY.CATEGORY_IDX = ?";
    }
    if (params !== null && params.flag === "nocategory") {
      //NO 카테고리
      joinCondition =
        "WHERE SITES.URL_KEY NOT IN (SELECT URL_KEY from TBL_REL_CATEGORY)";
    }
    if (params !== null && params.flag === "all") {
      //모든 SITE
      joinCondition = "WHERE 1=1";
    }

    let starCondition = "",
      detectCondition = "",
      sortCondition = " DESC ",
      searchCondition = [];
    if (params.filter !== null) {
      if (params.filter.sort) {
        // false : 내림차순 / true : 오름차순
        sortCondition = " ASC ";
      }

      if (params.filter.star) {
        starCondition = " AND FL_FAVORITE='Y'";
      }

      if (params.filter.detect) {
        detectCondition = " AND FL_READMODE='N'";
      }

      if (params.filter.search) {
        let keywords = params.filter.search.split(" ");
        let i = 0;
        for (; i < keywords.length; i++) {
          searchCondition.push(
            " TITLE LIKE '%" +
              keywords[i] +
              "%' OR FULL_TEXT LIKE '%" +
              keywords[i] +
              "%'"
          );
        }
        searchCondition = "AND ( " + searchCondition.join(" AND ") + ")";
      }
    }

    let limit = ""; //"LIMIT 5";

    return (
      `
        SELECT
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
            FL_BOOKMARK,
            HOST,
            FULL_TEXT,
            FL_DELETE,
            URL_TYPE,
            READERMODE_CONTENTS,
            FL_READMODE,
            SITES.DATE_CREATE,
            DATE_UPDATE,
            TAGS,
            FL_BACKUP,
            FL_FAVORITE,
            CASE WHEN CATEGORY.NAME
                IS NULL
                THEN 'NO_CATEGORY'
                ELSE CATEGORY.NAME
             END AS CATEGORY_NAME,
            '' as CLASS
        FROM
        TBL_SITES SITES
        LEFT JOIN TBL_REL_CATEGORY REL_CATEGORY
        ON SITES.URL_KEY = REL_CATEGORY.URL_KEY
          AND REL_CATEGORY.EMAIL = ?
        LEFT JOIN TBL_CATEGORY CATEGORY
        ON REL_CATEGORY.CATEGORY_IDX = CATEGORY.IDX
            ` +
      joinCondition +
      `
        AND SITES.FL_DELETE = 'N'
            ` +
      starCondition +
      `
            ` +
      detectCondition +
      `
            ` +
      searchCondition +
      `
        AND SITES.EMAIL = ?
        ORDER BY
        SITES.DATE_CREATE
        ` +
      sortCondition +
      `
        LIMIT ?, ? `
    );
  },
  getSite: () => {
    return `
        SELECT
        IDX,
            SITE.URL_KEY,
            SITE.EMAIL,
            TITLE,
            UPDATE_TITLE,
            URL,
            SITE.DATE_CREATE,
            OG_TITLE,
            OG_DESCRIPTION,
            OG_IMAGE,
            EMBEDURL,
            FL_BOOKMARK,
            HOST,
            TAGS,
            MEMO,
            FL_BACKUP,
            FL_FAVORITE,
            CATEGORY.CATEGORY_IDX
        FROM TBL_SITES SITE LEFT JOIN TBL_REL_CATEGORY CATEGORY
        ON SITE.URL_KEY = CATEGORY.URL_KEY
        WHERE SITE.URL_KEY = ?
        AND SITE.EMAIL = ?
        AND SITE.FL_DELETE = 'N'
        LIMIT 1`;
  },

  getCategory: flag => {
    let lostCondition = "";
    let systemCondition = " AND TYPE='CUSTOM'";
    if (flag === "all") {
      lostCondition = "AND PARENT != -1";
    }
    if (flag === "lost") {
      lostCondition = "AND PARENT = -1";
    }
    if (flag === "system") {
      systemCondition = " AND TYPE='SYSTEM'";
    }

    return (
      `SELECT
        id,
            name,
            parent,
            depth,
            type,
            flag,
            mouseOver,
            dropOver,
            class,
        SUM(CNT) as cnt
        FROM(
            SELECT
                IDX as id,
                NAME as name,
                PARENT as parent,
                DEPTH as depth,
                TYPE as type,
                FLAG as flag,
                false as mouseOver,
                false as dropOver,
                '' as class,
                CASE
                    WHEN B.CATEGORY_IDX IS NULL
                    THEN 0
                    ELSE 1
                    END AS CNT
            FROM TBL_CATEGORY A LEFT JOIN TBL_REL_CATEGORY B
            ON A.IDX = B.CATEGORY_IDX
            WHERE A.EMAIL = ?
            ` +
      lostCondition +
      `
            ` +
      systemCondition +
      `
      
            )

        GROUP
        BY
        id, name, parent, depth, mouseOver, dropOver`
    );
  },
  getAllItems: () => {
    return `
        SELECT
            EMAIL,
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
        AND EMAIL = ?
        AND FL_DELETE = 'N'`;
  },
  deleteSite: () => {
    return `UPDATE TBL_SITES
            SET FL_DELETE = 'Y', DATE_UPDATE = ?
            WHERE URL_KEY = ?
            AND EMAIL = ?
                `;
  },
  updateScrapSite: () => {
    return `UPDATE TBL_SITES
                    SET FL_READMODE = 'Y',
                    READERMODE_CONTENTS = ?,
                    FULL_TEXT= ?,
                    OG_TITLE = ?,
                    OG_DESCRIPTION = ?,
                    OG_IMAGE = ?
                WHERE URL_KEY = ?`;
  },
  deleteSiteInCategory: () => {
    return `DELETE FROM TBL_REL_CATEGORY
            WHERE URL_KEY = ?
            AND EMAIL = ?
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
            WHERE EMAIL = ?
            `;
  },
  insertCategoryRelation: () => {
    return `INSERT INTO TBL_REL_CATEGORY
            (
                CATEGORY_IDX,
                URL_KEY,
                EMAIL,
                SITE_IDX,
                DATE_CREATE
            )
            VALUES(?, ?, ?, ?, ?)`;
  },
  deleteCategoryRelation: () => {
    return `DELETE FROM TBL_REL_CATEGORY
            WHERE URL_KEY = ?
            AND EMAIL = ?
            `;
  },
  deleteCategoryRelationParent: () => {
    return `DELETE FROM TBL_REL_CATEGORY
            WHERE CATEGORY_IDX = ?
            AND EMAIL = ?
            `;
  },
  deleteCategory: () => {
    return `DELETE FROM TBL_CATEGORY
                WHERE IDX = ?
                AND EMAIL = ?`;
  },
  updateLostCategoryItem: () => {
    return `UPDATE  TBL_CATEGORY
            SET  PARENT = -1
            WHERE PARENT = ?
            `;
  },
  updateCategoryItem: () => {
    return `UPDATE  TBL_CATEGORY
            SET  NAME = ? , PARENT = ?
            WHERE IDX = ?
                `;
  },
  insertCategoryItem: () => {
    return `INSERT
        INTO
        TBL_CATEGORY(
            EMAIL,
            NAME,
            PARENT,
            DEPTH,
            SORT,
            DATE_CREATE,
            TYPE)
        VALUES(?, ?, ?, ?, ?, ?, 'CUSTOM')
            `;
  },
  updateConvertViewmode: () => {
    return `UPDATE TBL_SITES
            SET READERMODE_CONTENTS = ?, DATE_UPDATE = ?, FL_READMODE = 'Y'
            WHERE URL_KEY = ?
            AND EMAIL = ?
            `;
  },
  initDataOption: () => {
    return `INSERT INTO TBL_OPTIONS  VALUES(?,'highlight-color-1,highlight-color-2,highlight-color-3,highlight-color-4,highlight-color-5' --COLOR
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
  },
  initDataCategory: () => {
    return `INSERT INTO TBL_CATEGORY(
                                     EMAIL,
                                     NAME,
                                     PARENT,
                                     DEPTH,
                                     SORT,
                                     TYPE,
                                     FLAG,
                                     DATE_CREATE
                            ) VALUES  (? , 'DEFAULT CATEGORY', 0, 0, 0, 'SYSTEM','root', null),
                                      (? , 'ALL CATEGORY', ?, 1, 1, 'SYSTEM','all', null),
                                      (? , 'NO CATEGORY', ?, 1, 2, 'SYSTEM','nocategory', null)
                 `;
  },
  getCategoryMaxId: () => {
    return `select MAX(IDX) AS MAXID from TBL_CATEGORY`;
  },
  updateFavorite: () => {
    return `UPDATE TBL_SITES
                SET FL_FAVORITE = 'Y'
                WHERE EMAIL = ?
                AND IDX = ?
        `;
  },
  deleteFavorite: () => {
    return `UPDATE TBL_SITES
                SET FL_FAVORITE = 'N'
                WHERE EMAIL = ?
                AND IDX = ?
        `;
  },
  restoreSite: param => {
    return `
        INSERT INTO TBL_SITES
        (
            IDX,
            DATE_CREATE,
            DATE_UPDATE,
            EMAIL,
            EMBEDURL,
            FL_BACKUP,
            FL_BOOKMARK,
            FL_DELETE,
            FL_FAVORITE,
            FL_READMODE,
            HOST,
            MEMO,
            OG_DESCRIPTION,
            OG_IMAGE,
            OG_TITLE,
            OWNER_EMAIL,
            TAGS,
            TITLE,
            UPDATE_TITLE,
            URL,
            URL_KEY,
            URL_TYPE,
            READERMODE_CONTENTS,
            FULL_TEXT
        )
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;
  },
  restoreCategory: param => {
    return `
        INSERT INTO TBL_CATEGORY
        (
            IDX,
            DEPTH,
            EMAIL,
            FLAG,
            NAME,
            PARENT,
            SORT,
            TYPE,
            DATE_CREATE
        )
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?) `;
  },
  restoreCategoryRelation: param => {
    return `
        INSERT INTO TBL_REL_CATEGORY
        (
            CATEGORY_IDX,
            URL_KEY,
            EMAIL,
            SITE_IDX,
            DATE_CREATE
        )
        VALUES
            (?, ?, ?, ?, ?) `;
  },
  restoreHighlight: param => {
    return `
        INSERT INTO TBL_ITEMS
        (
            COLOR,
            EMAIL,
            FL_DELETE,
            FL_READMODE,
            GB_FILETYPE,
            IDX,
            IMAGE,
            MEMO,
            NEXT,
            PAGE_NUMBER,
            POSITION,
            PREV,
            PRINT_TEXT,
            TEXT,
            URL_KEY,
            DATE_CREATE,
            DATE_UPDATE
        )
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;
  },
  selectUpdateHistory: () => {
    return `SELECT * FROM TBL_UPDATE_HISTORY
                WHERE EMAIL = ?
            `;
  },
  insertUpdateHistory: () => {
    return ` INSERT INTO TBL_UPDATE_HISTORY
                (EMAIL) VALUES (?)
                `;
  },
  updateUpdateHistory: param => {
    let updateField = "";
    if (param.googleBackupDate !== undefined) {
      updateField = " LATEST_GOOGLE_BACKUP_DATE = " + param.googleBackupDate;
    } else if (param.googleRestoreDate !== undefined) {
      updateField = " LATEST_GOOGLE_RESTORE_DATE = " + param.googleRestoreDate;
    }

    return (
      ` UPDATE TBL_UPDATE_HISTORY
                 SET ` +
      updateField +
      `
                    WHERE EMAIL = '` +
      param.email +
      `'
                `
    );
  }
};
