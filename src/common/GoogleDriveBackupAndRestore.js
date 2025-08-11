import Utils from "../dashboard/utils/Utils";
import Common from "./common";
import MODAL from "./modal";
import LANG from "./language";
import ACCOUNT from "./account";

import CryptoJS from "crypto-js";

let GOOGLE_DRIVE_DATA = {
  BACKUP_FOLDER_TITLE: "WEBGALPI",
  BACKUP_PASSWORD: "KKUNI_BEAR_GMAIL.COM_KKUNI"
};

let GOOGLE_DRIVE = {
  getPassword() {
    return GOOGLE_DRIVE_DATA.BACKUP_PASSWORD;
  },
  getBackupData(item) {
    return new Promise(res => {
      chrome.identity.getAuthToken({ interactive: true }, token => {
        let url =
          "https://www.googleapis.com/drive/v3/files/" + item.id + "?alt=media";
        fetch(url, {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + token
          })
        }).then(file => {
          file.text().then(result => {
            let data = JSON.parse(result);
            let bytes = CryptoJS.AES.decrypt(
              data.data,
              GOOGLE_DRIVE_DATA.BACKUP_PASSWORD
            );
            let originalText = bytes.toString(CryptoJS.enc.Utf8);
            res(originalText);
          });
        });
      });
    });
  },
  executeGoogleDriveRestore() {
    return new Promise(resolve => {
      //구글 드라이브에서 리스트 가져오기
      chrome.identity.getAuthToken({ interactive: true }, token => {
        //todo : 현재 계정과맞는 로그인을 했는지 체크가 필요함.

        gapi.auth.setToken({
          access_token: token
        });

        new Promise(res => {
          gapi.client.load("drive", "v2", () => {
            let retrievePageOfFiles = (request, result) => {
              request.execute(async resp => {
                if (resp.code == 401) {
                  this.invalidCredentionsProcess();
                  return false;
                }

                result = result.concat(resp.items);
                let nextPageToken = resp.nextPageToken;
                if (nextPageToken) {
                  request = gapi.client.drive.files.list({
                    pageToken: nextPageToken
                  });
                  retrievePageOfFiles(request, result);
                } else {
                  let files = new Array();
                  const promise = result.map(item => {
                    if (
                      item.title.indexOf("WEBGALPI_BACKUP_") !== -1 &&
                      item.explicitlyTrashed === false &&
                      item.labels.trashed === false
                    ) {
                      //PARENT를 찾는다. , explicitlyTrashed가 false 인것들.
                      //console.log(item);
                      files.push(item);
                    }
                  });
                  await Promise.all(promise);
                  res(files);
                }
              });
            };
            let initialRequest = gapi.client.drive.files.list();
            retrievePageOfFiles(initialRequest, []);
          });
        }).then(list => {
          if (list.length === 0) {
            MODAL.alert(LANG.ALERT_MESSAGE("A0007"), "error");
            resolve(false);
          }
          resolve(list);
          //this.$refs.restoreListArea.open(list, this.backupPassword);
        });
      });
    });
  },
  executeGoogleDriveBackup(backupData, description) {
    return new Promise(async res => {
      let BACKUP_FOLDER_ID = await this.getBackupFolderId(); //this.getBackupFolderId();
      if (!BACKUP_FOLDER_ID) {
        BACKUP_FOLDER_ID = await this.createBackupFolder(); //this.createBackupFolder();
      }

      let result = await Utils.getLocalStorage("loginInfo");

      let info = new Object();
      info.email = result.loginInfo.EMAIL;
      info.created = new Date().getTime();
      info.version = Common.getVersion();
      info.chrome_id = chrome.runtime.id;

      backupData.info = info;

      let backupObj = new Object();

      // Encrypt
      backupObj.data = CryptoJS.AES.encrypt(
        JSON.stringify(backupData),
        GOOGLE_DRIVE_DATA.BACKUP_PASSWORD
      ).toString();

      this.sendBackupFile(
        JSON.stringify(backupObj),
        BACKUP_FOLDER_ID,
        description
      )
        .then(() => {
          res(true);
          //백업이 완료 되었습니다.
          MODAL.alert(LANG.ALERT_MESSAGE("A0004"));
        })
        .catch(error => {
          //백업 도중 에러가 발생하였습니다.
          MODAL.alert(LANG.ALERT_MESSAGE("A0008"));
        });
    });
  },
  sendBackupFile(fileContent, backupFolderId, description) {
    return new Promise(res => {
      chrome.identity.getAuthToken({ interactive: true }, token => {
        //let fileContent = "sample text2"; // As a sample, upload a text file.

        let file = new Blob([fileContent], { type: "text/plain" });
        let metadata = {
          name: "WEBGALPI_BACKUP_" + new Date().getTime(), // Filename at Google Drive
          mimeType: "text/plain", // mimeType at Google Drive
          parents: [backupFolderId], // Folder ID at Google Drive
          description: description
        };

        //let accessToken = token; //gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
        let form = new FormData();
        form.append(
          "metadata",
          new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );
        form.append("file", file);

        fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
          {
            method: "POST",
            headers: new Headers({
              Authorization: "Bearer " + token
            }),
            body: form
          }
        ).then(retValue => {
          res(retValue);
        });
      });
    });
  },
  createBackupFolder() {
    return new Promise(res => {
      chrome.identity.getAuthToken({ interactive: true }, token => {
        gapi.client
          .request({
            path: "/drive/v2/files/",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            body: {
              title: GOOGLE_DRIVE_DATA.BACKUP_FOLDER_TITLE,
              mimeType: "application/vnd.google-apps.folder"
            }
          })
          .execute(backupFolder => {
            res(backupFolder.id);
          });
      });
    });
  },
  getBackupFolderId() {
    return new Promise(resolve => {
      chrome.identity.getAuthToken({ interactive: true }, token => {
        gapi.auth.setToken({
          access_token: token
        });

        gapi.client.load("drive", "v2", () => {
          let retrievePageOfFiles = request => {
            request.execute(async resp => {
              if (resp.code === 401) {
                this.invalidCredentionsProcess();
                return false;
              }

              resp.items.filter(item => {
                if (
                  item.title === GOOGLE_DRIVE_DATA.BACKUP_FOLDER_TITLE &&
                  item.explicitlyTrashed === false
                ) {
                  resolve(item.id);
                  return true;
                }
              });

              let nextPageToken = resp.nextPageToken;
              if (nextPageToken) {
                request = gapi.client.drive.files.list({
                  pageToken: nextPageToken
                });
                retrievePageOfFiles(request);
              } else {
                resolve(false);
              }
            });
          };
          let initialRequest = gapi.client.drive.files.list();
          retrievePageOfFiles(initialRequest);
        });
      });
    });
  },
  invalidCredentionsProcess() {
    MODAL.alert(LANG.ALERT_MESSAGE("A0012"), "error", null, "450px");

    chrome.identity.getAuthToken({ interactive: true }, token => {
      ACCOUNT.removeGoogleTokenCache(token).then(res => {
        if (res) {
          ACCOUNT.googleLogin().then(async ret => {
            let result = await Utils.getLocalStorage("loginInfo");
            if (result.loginInfo.EMAIL !== ret.email) {
              let token = await Utils.getLocalStorage("googleToken");
              MODAL.alert(
                result.loginInfo.EMAIL + LANG.ALERT_MESSAGE("A0013"),
                "error",
                null,
                "450px"
              );
              ACCOUNT.removeGoogleTokenCache(token.googleToken);
              return false;
            }
          });
        }
      });
    });
  }
};

export default GOOGLE_DRIVE;
