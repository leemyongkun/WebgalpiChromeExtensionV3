import Common from "../common/common";

// Chrome storage local API wrapper - NO SQL queries
const STORAGE_KEYS = {
  SITES: "sites",
  ITEMS: "items",
  CATEGORIES: "categories",
  CATEGORY_RELATIONS: "categoryRelations",
  MEMBERS: "members",
  OPTIONS: "options"
};

// Helper function to get data from chrome.storage.local
const getStorageData = key => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], data => {
      if (chrome.runtime.lastError) {
        console.error(
          `Storage get error for ${key}:`,
          chrome.runtime.lastError
        );
        reject(chrome.runtime.lastError);
      } else {
        resolve(data[key] || []);
      }
    });
  });
};

// Helper function to save data to chrome.storage.local
const setStorageData = (key, data) => {
  return new Promise((resolve, reject) => {
    let storageObj = {};
    storageObj[key] = data;
    chrome.storage.local.set(storageObj, () => {
      if (chrome.runtime.lastError) {
        console.error(
          `Storage set error for ${key}:`,
          chrome.runtime.lastError
        );
        reject(chrome.runtime.lastError);
      } else {
        console.log(`✅ Data saved to ${key}:`, data.length || "object");
        resolve(true);
      }
    });
  });
};

// Helper function to filter data by email
const filterByEmail = (data, email) => {
  return Array.isArray(data) ? data.filter(item => item.EMAIL === email) : [];
};

// Helper function to filter data by URL_KEY
const filterByUrlKey = (data, urlKey) => {
  return Array.isArray(data)
    ? data.filter(item => item.URL_KEY === urlKey)
    : [];
};

let Api = {
  // ========== 백업 데이터 관련 함수들 ==========

  /**
   * 사용자의 모든 백업 데이터를 가져오는 함수
   * @param {string} email - 사용자 이메일
   * @returns {Object} 사이트, 하이라이트, 옵션, 카테고리, 관계, 원탭 데이터
   */
  getBackupData: async email => {
    try {
      const [
        sites,
        highlights,
        options,
        categories,
        categoryRelations,
        onetabs
      ] = await Promise.all([
        Api.getBackupSites({ EMAIL: email }),
        Api.getBackupHighlights({ EMAIL: email }),
        Api.getOptions({ EMAIL: email }),
        Api.getBackupCategorys({ EMAIL: email }),
        Api.getBackupCategorysRelation({ EMAIL: email }),
        Api.getBackupOneTabsHistory({ EMAIL: email })
      ]);

      return {
        sites,
        highlights,
        options,
        categories,
        categoryRelation: categoryRelations,
        onetabs
      };
    } catch (error) {
      console.error("getBackupData error:", error);
      return {
        sites: [],
        highlights: [],
        options: [],
        categories: [],
        categoryRelation: [],
        onetabs: []
      };
    }
  },

  /**
   * 백업용 사이트 목록 가져오기
   * @param {Object} param - EMAIL 속성을 포함한 매개변수
   * @returns {Array} 삭제되지 않은 사이트 목록
   */
  getBackupSites: async param => {
    const sites = await getStorageData(STORAGE_KEYS.SITES);
    return filterByEmail(sites, param.EMAIL).filter(
      site => site.FL_DELETE !== "Y"
    );
  },

  /**
   * 백업용 하이라이트 목록 가져오기
   * @param {Object} param - EMAIL 속성을 포함한 매개변수
   * @returns {Array} 삭제되지 않은 하이라이트 목록
   */
  getBackupHighlights: async param => {
    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    return filterByEmail(items, param.EMAIL).filter(
      item => item.FL_DELETE !== "Y"
    );
  },

  getBackupCategorysRelation: async param => {
    const relations = await getStorageData(STORAGE_KEYS.CATEGORY_RELATIONS);
    return filterByEmail(relations, param.EMAIL);
  },

  getBackupCategorys: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    return filterByEmail(categories, param.EMAIL).filter(
      cat => cat.TYPE === "CUSTOM"
    );
  },

  getBackupOneTabsHistory: async param => {
    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    return filterByEmail(items, param.EMAIL);
  },

  // ========== 멤버 관련 함수들 ==========

  /**
   * 현재 사용중인 멤버 정보 가져오기
   * @returns {Object|null} 사용중인 멤버 정보 또는 null
   */
  getMemberInfo: async () => {
    const members = await getStorageData(STORAGE_KEYS.MEMBERS);
    return members.find(member => member.FL_USE === "Y") || null;
  },

  getAllCategoryCount: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    const userCategories = filterByEmail(categories, param.EMAIL);
    return [{ COUNT: userCategories.length }];
  },

  getNoCategoryCount: async param => {
    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    const userItems = filterByEmail(items, param.EMAIL);
    const noCategoryItems = userItems.filter(
      item => !item.CATEGORY_ID || item.CATEGORY_ID === -1
    );
    return [{ COUNT: noCategoryItems.length }];
  },

  /**
   * 사용자 옵션 설정 가져오기 (색상, 언어 등)
   * @param {Object} param - EMAIL 속성을 포함한 매개변수
   * @returns {Array} 사용자 옵션 배열
   */
  getOptions: async param => {
    console.log("🔧 getOptions called with param:", param);
    const options = await getStorageData(STORAGE_KEYS.OPTIONS);
    console.log("🔧 Raw options from storage:", options);
    const filtered = filterByEmail(options, param.EMAIL);
    console.log("🔧 Filtered options for email", param.EMAIL, ":", filtered);

    // If no COLOR option found, create default one
    if (
      !filtered ||
      filtered.length === 0 ||
      !filtered.find(opt => opt.TYPE === "COLOR")
    ) {
      console.log("🔧 No COLOR option found, creating default");
      const defaultOptions = [
        {
          TYPE: "COLOR",
          COLOR: "#ffff00,#00ff00,#ff0000,#0000ff,#ff8000",
          EMAIL: param.EMAIL,
          DATE_CREATE: Date.now(),
          VERSION: "1.0",
          LANG: "JP"
        }
      ];
      return filtered.length > 0
        ? [...filtered, ...defaultOptions]
        : defaultOptions;
    }

    return filtered;
  },

  /**
   * 사이트 초기화에 필요한 모든 정보 가져오기
   * @param {Object} parameter - URL_KEY, EMAIL 등을 포함한 매개변수
   * @returns {Object} 사이트 등록 여부, 아이템, 옵션 정보
   */
  getInitInfo: async parameter => {
    try {
      const [site, items, options] = await Promise.all([
        Api.getSite(parameter),
        Api.getAllItems(parameter),
        Api.getOptions(parameter)
      ]);

      let obj = {};
      let allItems = {};

      if (site.length > 0) {
        obj.isRegist = true; // 사이트가 등록되었는지 확인 (background.js)
        allItems.SITE = site;
        allItems.HIGHLIGHT_LIST = items;
        allItems.SITE_CHECK = "Y";
        allItems.SITE_OPEN = site[0].FL_READMODE || "Y";
      } else {
        obj.isRegist = false;
        allItems.HIGHLIGHT_LIST = items.length > 0 ? items : null; // Load highlights even if site not registered
        allItems.SITE_CHECK = "N";
        allItems.SITE_OPEN = "Y";
      }

      obj.allItems = allItems;

      // Process options to create a single options object
      let processedOptions = {};
      if (options && options.length > 0) {
        options.forEach(option => {
          if (option.TYPE === "COLOR" && option.COLOR) {
            processedOptions.COLOR = option.COLOR;
          }
          // Copy other properties
          Object.keys(option).forEach(key => {
            if (key !== "TYPE" && key !== "COLOR") {
              processedOptions[key] = option[key];
            }
          });
        });
      }

      console.log("🔧 Processed options:", processedOptions);
      obj.options = processedOptions;

      return obj;
    } catch (error) {
      console.error("getInitInfo error:", error);
      return {
        isRegist: false,
        allItems: {
          HIGHLIGHT_LIST: null,
          SITE_CHECK: "N",
          SITE_OPEN: "Y"
        },
        options: {}
      };
    }
  },

  /**
   * 특정 URL_KEY에 해당하는 사이트 정보 가져오기
   * @param {Object} param - URL_KEY, EMAIL 속성을 포함
   * @returns {Array} 매칭되는 사이트 목록
   */
  getSite: async param => {
    const sites = await getStorageData(STORAGE_KEYS.SITES);
    const userSites = filterByEmail(sites, param.EMAIL);
    return filterByUrlKey(userSites, param.URL_KEY).filter(
      site => site.FL_DELETE !== "Y"
    );
  },

  getSites: async param => {
    const sites = await getStorageData(STORAGE_KEYS.SITES);
    return filterByEmail(sites, param.EMAIL).filter(
      site => site.FL_DELETE !== "Y"
    );
  },

  // Category functions
  getSystemCategory: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    const userCategories = filterByEmail(categories, param.EMAIL);
    return userCategories.filter(cat => cat.TYPE === "SYSTEM");
  },

  getLostCategory: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    const userCategories = filterByEmail(categories, param.EMAIL);
    return userCategories.filter(cat => cat.TYPE === "LOST");
  },

  getCategory: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    return filterByEmail(categories, param.EMAIL);
  },

  // ========== 아이템(하이라이트) 관련 함수들 ==========

  /**
   * 사용자의 모든 하이라이트 아이템 가져오기
   * @param {Object} param - URL_KEY, EMAIL 속성을 포함
   * @returns {Array} 복원된 특수문자가 포함된 하이라이트 목록
   */
  getAllItems: async param => {
    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    const userItems = filterByEmail(items, param.EMAIL).filter(
      item => item.FL_DELETE !== "Y"
    );

    return userItems.map(item => ({
      ...item,
      PRINT_TEXT: Common.restoreSpecialWord(item.PRINT_TEXT),
      TEXT: Common.restoreSpecialWord(item.TEXT),
      PREV: Common.restoreSpecialWord(item.PREV),
      NEXT: Common.restoreSpecialWord(item.NEXT)
    }));
  },

  // ========== 업데이트 관련 함수들 ==========

  /**
   * 하이라이트 아이템 업데이트
   * @param {Object} param - IDX, EMAIL 등을 포함한 업데이트 데이터
   * @returns {boolean} 업데이트 성공 여부
   */
  updateItem: async param => {
    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    const itemIndex = items.findIndex(
      item => item.IDX === param.IDX && item.EMAIL === param.EMAIL
    );

    if (itemIndex >= 0) {
      items[itemIndex] = { ...items[itemIndex], ...param };
      await setStorageData(STORAGE_KEYS.ITEMS, items);
      return true;
    }
    return false;
  },

  updateHighlightMemo: async param => {
    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    const itemIndex = items.findIndex(
      item => item.IDX === param.IDX && item.EMAIL === param.EMAIL
    );

    if (itemIndex >= 0) {
      items[itemIndex].MEMO = param.MEMO;
      await setStorageData(STORAGE_KEYS.ITEMS, items);
      return true;
    }
    return false;
  },

  // ========== 삽입 관련 함수들 ==========

  /**
   * 새로운 하이라이트 아이템 삽입
   * @param {Object} param - 하이라이트 정보(텍스트, 색상, 위치 등)
   * @returns {boolean} 삽입 성공 여부
   */
  postItem: async param => {
    const processedParam = {
      ...param,
      TEXT: Common.replaceSpecialWord(param.TEXT),
      PREV: Common.replaceSpecialWord(param.PREV),
      NEXT: Common.replaceSpecialWord(param.NEXT),
      PRINT_TEXT: Common.replaceSpecialWord(param.PRINT_TEXT)
    };

    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    items.push(processedParam);
    return await setStorageData(STORAGE_KEYS.ITEMS, items);
  },

  // ========== 삭제 관련 함수들 ==========

  /**
   * 하이라이트 아이템 삭제 (논리 삭제 - FL_DELETE = 'Y')
   * @param {Object} param - IDX, EMAIL 속성을 포함
   * @returns {boolean} 삭제 성공 여부
   */
  deleteItem: async param => {
    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    const updatedItems = items.map(item =>
      item.IDX === param.IDX && item.EMAIL === param.EMAIL
        ? { ...item, FL_DELETE: "Y" }
        : item
    );
    return await setStorageData(STORAGE_KEYS.ITEMS, updatedItems);
  },

  deleteItems: async param => {
    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    const updatedItems = items.map(item =>
      param.IDXS.includes(item.IDX) && item.EMAIL === param.EMAIL
        ? { ...item, FL_DELETE: "Y" }
        : item
    );
    return await setStorageData(STORAGE_KEYS.ITEMS, updatedItems);
  },

  deleteSiteInCategory: async param => {
    const relations = await getStorageData(STORAGE_KEYS.CATEGORY_RELATIONS);
    const filteredRelations = relations.filter(
      rel => !(rel.URL_KEY === param.URL_KEY && rel.EMAIL === param.EMAIL)
    );
    return await setStorageData(
      STORAGE_KEYS.CATEGORY_RELATIONS,
      filteredRelations
    );
  },

  deleteSite: async param => {
    const sites = await getStorageData(STORAGE_KEYS.SITES);
    const updatedSites = sites.map(site =>
      site.URL_KEY === param.URL_KEY && site.EMAIL === param.EMAIL
        ? { ...site, FL_DELETE: "Y", DATE_UPDATE: param.updateDate }
        : site
    );
    return await setStorageData(STORAGE_KEYS.SITES, updatedSites);
  },

  // Site functions
  updateScrapSite: async param => {
    param.OG_TITLE = Common.replaceSpecialWord(param.OG_TITLE);
    param.OG_DESCRIPTION = Common.replaceSpecialWord(param.OG_DESCRIPTION);
    param.READERMODE_CONTENTS = Common.replaceSpecialWord(
      param.READERMODE_CONTENTS
    );

    const sites = await getStorageData(STORAGE_KEYS.SITES);
    const siteIndex = sites.findIndex(
      site => site.URL_KEY === param.URL_KEY && site.EMAIL === param.EMAIL
    );

    if (siteIndex >= 0) {
      sites[siteIndex] = { ...sites[siteIndex], ...param };
      return await setStorageData(STORAGE_KEYS.SITES, sites);
    }
    return false;
  },

  updateSiteUpdateDate: async param => {
    const sites = await getStorageData(STORAGE_KEYS.SITES);
    const siteIndex = sites.findIndex(
      site => site.URL_KEY === param.URL_KEY && site.EMAIL === param.EMAIL
    );

    if (siteIndex >= 0) {
      sites[siteIndex].DATE_UPDATE = param.DATE_UPDATE;
      return await setStorageData(STORAGE_KEYS.SITES, sites);
    }
    return false;
  },

  postSite: async param => {
    param.OG_TITLE = Common.replaceSpecialWord(param.OG_TITLE);
    param.OG_DESCRIPTION = Common.replaceSpecialWord(param.OG_DESCRIPTION);
    param.READERMODE_CONTENTS = Common.replaceSpecialWord(
      param.READERMODE_CONTENTS
    );

    const sites = await getStorageData(STORAGE_KEYS.SITES);
    sites.push(param);
    await setStorageData(STORAGE_KEYS.SITES, sites);
    return Api.getSite(param);
  },

  // Options functions
  updateOptionColor: async param => {
    const options = await getStorageData(STORAGE_KEYS.OPTIONS);
    const optionIndex = options.findIndex(opt => opt.EMAIL === param.EMAIL);

    if (optionIndex >= 0) {
      options[optionIndex].COLOR = param.COLOR;
    } else {
      options.push({ ...param, TYPE: "COLOR" });
    }
    return await setStorageData(STORAGE_KEYS.OPTIONS, options);
  },

  updateOptionTheme: async param => {
    const optionsData = await getStorageData(STORAGE_KEYS.OPTIONS);
    const options = Array.isArray(optionsData) ? optionsData : [];
    console.log("updateOptionTheme - options data:", options);

    const optionIndex = options.findIndex(opt => opt.EMAIL === param.EMAIL);

    if (optionIndex >= 0) {
      options[optionIndex].THEME = param.THEME;
    } else {
      options.push({ ...param, TYPE: "THEME" });
    }
    console.log("updateOptionTheme - saving options:", options);
    return await setStorageData(STORAGE_KEYS.OPTIONS, options);
  },

  updateOptionLanguage: async param => {
    const optionsData = await getStorageData(STORAGE_KEYS.OPTIONS);
    const options = Array.isArray(optionsData) ? optionsData : [];
    console.log("updateOptionLanguage - options data:", options);

    const optionIndex = options.findIndex(opt => opt.EMAIL === param.EMAIL);

    if (optionIndex >= 0) {
      options[optionIndex].LANGUAGE = param.LANGUAGE;
    } else {
      options.push({ ...param, TYPE: "LANGUAGE" });
    }
    console.log("updateOptionLanguage - saving options:", options);
    return await setStorageData(STORAGE_KEYS.OPTIONS, options);
  },

  // Category functions
  deleteCategory: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    const filteredCategories = categories.filter(
      cat => !(cat.IDX === param.IDX && cat.EMAIL === param.EMAIL)
    );
    return await setStorageData(STORAGE_KEYS.CATEGORIES, filteredCategories);
  },

  deleteCategoryRelation: async param => {
    const relations = await getStorageData(STORAGE_KEYS.CATEGORY_RELATIONS);
    const filteredRelations = relations.filter(
      rel => !(rel.URL_KEY === param.URL_KEY && rel.EMAIL === param.EMAIL)
    );
    return await setStorageData(
      STORAGE_KEYS.CATEGORY_RELATIONS,
      filteredRelations
    );
  },

  deleteCategoryRelationParent: async param => {
    const relations = await getStorageData(STORAGE_KEYS.CATEGORY_RELATIONS);
    const filteredRelations = relations.filter(
      rel => rel.PARENT_IDX !== param.PARENT_IDX
    );
    return await setStorageData(
      STORAGE_KEYS.CATEGORY_RELATIONS,
      filteredRelations
    );
  },

  updateCategorySort: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    const categoryIndex = categories.findIndex(
      cat => cat.IDX === param.IDX && cat.EMAIL === param.EMAIL
    );

    if (categoryIndex >= 0) {
      categories[categoryIndex].SORT = param.SORT;
      return await setStorageData(STORAGE_KEYS.CATEGORIES, categories);
    }
    return false;
  },

  postCategoryRelation: async param => {
    const relations = await getStorageData(STORAGE_KEYS.CATEGORY_RELATIONS);
    relations.push(param);
    return await setStorageData(STORAGE_KEYS.CATEGORY_RELATIONS, relations);
  },

  updateLostCategoryItem: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    const updatedCategories = categories.map(cat => {
      if (cat.PARENT_ID && cat.PARENT_ID.includes(param.categoryId)) {
        return {
          ...cat,
          PARENT_ID: cat.PARENT_ID.replace(param.categoryId, "-1")
        };
      }
      return cat;
    });
    return await setStorageData(STORAGE_KEYS.CATEGORIES, updatedCategories);
  },

  insertCategoryItem: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    categories.push(param);
    return await setStorageData(STORAGE_KEYS.CATEGORIES, categories);
  },

  updateCategoryItem: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    const categoryIndex = categories.findIndex(
      cat => cat.IDX === param.IDX && cat.EMAIL === param.EMAIL
    );

    if (categoryIndex >= 0) {
      categories[categoryIndex] = { ...categories[categoryIndex], ...param };
      return await setStorageData(STORAGE_KEYS.CATEGORIES, categories);
    }
    return false;
  },

  // Member functions
  postMember: async param => {
    const members = await getStorageData(STORAGE_KEYS.MEMBERS);

    // Set all existing members to not in use
    const updatedMembers = members.map(member => ({ ...member, FL_USE: "N" }));

    // Add new member
    const newMember = {
      ...param,
      FL_USE: "Y",
      DATE_CREATE: new Date().getTime()
    };
    updatedMembers.push(newMember);

    return await setStorageData(STORAGE_KEYS.MEMBERS, updatedMembers);
  },

  updateMemberUse: async param => {
    const members = await getStorageData(STORAGE_KEYS.MEMBERS);

    // Set all to not in use, then set target to in use
    const updatedMembers = members.map(member => ({
      ...member,
      FL_USE: member.EMAIL === param.EMAIL ? "Y" : "N"
    }));

    return await setStorageData(STORAGE_KEYS.MEMBERS, updatedMembers);
  },

  getMembers: async () => {
    return await getStorageData(STORAGE_KEYS.MEMBERS);
  },

  getAllMembers: async () => {
    return await getStorageData(STORAGE_KEYS.MEMBERS);
  },

  // Utility functions
  updateConvertViewmode: async param => {
    // Implementation for viewmode conversion
    return true;
  },

  initDataOption: async param => {
    const options = await getStorageData(STORAGE_KEYS.OPTIONS);
    options.push(param);
    return await setStorageData(STORAGE_KEYS.OPTIONS, options);
  },

  initDataCategory: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    categories.push(param);
    return await setStorageData(STORAGE_KEYS.CATEGORIES, categories);
  },

  getCategoryMaxId: async () => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    const maxId =
      categories.length > 0
        ? Math.max(...categories.map(cat => cat.IDX || 0))
        : 0;
    return [{ MAXID: maxId }];
  },

  updateFavorite: async param => {
    const sites = await getStorageData(STORAGE_KEYS.SITES);
    const siteIndex = sites.findIndex(
      site => site.URL_KEY === param.URL_KEY && site.EMAIL === param.EMAIL
    );

    if (siteIndex >= 0) {
      sites[siteIndex].FL_FAVORITE = param.FL_FAVORITE;
      return await setStorageData(STORAGE_KEYS.SITES, sites);
    }
    return false;
  },

  deleteFavorite: async param => {
    const sites = await getStorageData(STORAGE_KEYS.SITES);
    const siteIndex = sites.findIndex(
      site => site.URL_KEY === param.URL_KEY && site.EMAIL === param.EMAIL
    );

    if (siteIndex >= 0) {
      sites[siteIndex].FL_FAVORITE = "N";
      return await setStorageData(STORAGE_KEYS.SITES, sites);
    }
    return false;
  },

  // Restore functions - simplified for chrome.storage.local
  restoreSite: async param => {
    const sites = await getStorageData(STORAGE_KEYS.SITES);
    sites.push(param);
    return await setStorageData(STORAGE_KEYS.SITES, sites);
  },

  restoreCategory: async param => {
    const categories = await getStorageData(STORAGE_KEYS.CATEGORIES);
    categories.push({
      ...param,
      DATE_CREATE: new Date().getTime()
    });
    return await setStorageData(STORAGE_KEYS.CATEGORIES, categories);
  },

  restoreCategoryRelation: async param => {
    const relations = await getStorageData(STORAGE_KEYS.CATEGORY_RELATIONS);
    relations.push(param);
    return await setStorageData(STORAGE_KEYS.CATEGORY_RELATIONS, relations);
  },

  restoreHighlight: async param => {
    const items = await getStorageData(STORAGE_KEYS.ITEMS);
    items.push(param);
    return await setStorageData(STORAGE_KEYS.ITEMS, items);
  },

  // Update history functions
  insertUpdateHistory: async param => {
    try {
      const updateHistoryData = {
        ...param,
        DATE_CREATE: new Date().getTime(),
        VERSION: "1.0", // 현재 버전
        TYPE: "REGISTRATION" // 등록 히스토리
      };

      // 업데이트 히스토리를 OPTIONS에 저장 (간단한 구조로)
      const options = await getStorageData(STORAGE_KEYS.OPTIONS);
      options.push({
        ...updateHistoryData,
        TYPE: "UPDATE_HISTORY"
      });

      await setStorageData(STORAGE_KEYS.OPTIONS, options);
      console.log("✅ Update history inserted:", updateHistoryData);

      return updateHistoryData;
    } catch (error) {
      console.error("insertUpdateHistory error:", error);
      throw error;
    }
  }
};

export default Api;
