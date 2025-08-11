// Chrome Storage Local API wrapper - NO SQL queries needed
// All operations are performed using chrome.storage.local with JavaScript filtering

export default {
  // Storage key constants
  TABLES: {
    SITES: "sites",
    ITEMS: "items",
    CATEGORIES: "categories",
    CATEGORY_RELATIONS: "categoryRelations",
    MEMBERS: "members",
    OPTIONS: "options"
  },

  // Helper functions for chrome.storage.local operations
  getTableName: operation => {
    // Map old query operations to storage table names
    const tableMap = {
      sites: "sites",
      items: "items",
      categories: "categories",
      categoryRelations: "categoryRelations",
      members: "members",
      options: "options"
    };
    return tableMap[operation] || operation;
  }
};
