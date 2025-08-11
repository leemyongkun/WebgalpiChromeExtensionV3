import { DDL } from "./DDL_Query";
import Utils from "../dashboard/utils/Utils";

// WebSQL is deprecated and not supported in Chrome extensions
// Using chrome.storage.local instead

export default {
  initData: accountInfo => {
    return new Promise(res => {
      // Initialize data using chrome.storage.local
      if (accountInfo && accountInfo.email) {
        chrome.storage.local.set(
          {
            currentUser: accountInfo.email,
            userProfile: accountInfo
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error("Storage error:", chrome.runtime.lastError);
              res(false);
            } else {
              console.log("User data initialized:", accountInfo.email);
              res(true);
            }
          }
        );
      } else {
        res(true);
      }
    });
  },
  // selectData function removed - use direct chrome.storage.local operations instead
  createTable: () => {
    // Chrome extensions use chrome.storage.local - no table creation needed
    console.log(
      "Storage ready - no table creation needed for chrome.storage.local"
    );
    return Promise.resolve(true);
  },
  dropTable: tableName => {
    return new Promise(res => {
      // Remove specific data from chrome.storage.local
      chrome.storage.local.remove([tableName], () => {
        if (chrome.runtime.lastError) {
          console.error("Storage remove error:", chrome.runtime.lastError);
          res(false);
        } else {
          console.log("Storage data cleared:", tableName);
          res(true);
        }
      });
    });
  },
  addTable: (tableName, data) => {
    return new Promise(res => {
      // Add data to chrome.storage.local
      let storageData = {};
      storageData[tableName] = data;

      chrome.storage.local.set(storageData, () => {
        if (chrome.runtime.lastError) {
          console.error("Storage add error:", chrome.runtime.lastError);
          res(false);
        } else {
          console.log("Storage data added:", tableName);
          res(true);
        }
      });
    });
  },
  removeTable: tableName => {
    return new Promise(res => {
      chrome.storage.local.remove([tableName], () => {
        if (chrome.runtime.lastError) {
          console.error("Storage remove error:", chrome.runtime.lastError);
          res(false);
        } else {
          console.log("Storage table removed:", tableName);
          res(true);
        }
      });
    });
  },
  truncateTable: async tableName => {
    return new Promise(res => {
      chrome.storage.local.remove([tableName], () => {
        if (chrome.runtime.lastError) {
          console.error("Storage truncate error:", chrome.runtime.lastError);
          res(false);
        } else {
          console.log("Storage table truncated:", tableName);
          res(true);
        }
      });
    });
  }
};
