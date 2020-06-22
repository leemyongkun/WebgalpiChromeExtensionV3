<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="750px"
    overlay-opacity="0.9"
  >
    <v-card>
      <v-card-title>백업/복구</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pl-0 pr-0">
        <v-row>
          <v-col cols="6">
            <v-card flat>
              <v-card-title>백업</v-card-title>
              <v-card-text>
                <ul>
                  <li>구글 드라이브에 파일형태로 백업됩니다.</li>
                  <li>모든 데이타는 암호화 처리됩니다.</li>
                  <li>임의로 파일명/폴더명/파일내용을 변경하지 마십시오.</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card flat>
              <v-card-title>복구</v-card-title>
              <v-card-text>
                <ul>
                  <li>복구 시, 기존 데이타는 모두 삭제 됩니다.</li>
                  <li>
                    현재 계정과 일치하지 않을 경우, 복구되지 않으니
                    주의바랍니다.
                  </li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-card flat>
              <v-card-text>
                <v-btn small color="primary" @click="backup('google')"
                  >백업
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card flat>
              <v-card-text>
                <v-btn small color="warning" @click="googleRestore()"
                  >복구 / 삭제
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="blue" text @click="close">CLOSE</v-btn>
      </v-card-actions>
    </v-card>

    <RestoreListArea ref="restoreListArea"></RestoreListArea>
    <BackupDescriptionArea ref="backupDescriptionArea"></BackupDescriptionArea>

    <v-overlay :value="backupOverlay">
      <v-progress-circular indeterminate size="32"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import Utils from "../../utils/Utils";
import LANG from "../../../common/language";
import MODAL from "../../../common/modal";

import RestoreListArea from "./backup/RestoreListArea";
import BackupDescriptionArea from "./backup/BackupDescriptionArea";
import EventBus from "../../event-bus";
import ACCOUNT from "../../../common/account";
import Common from "../../../common/common";

let CryptoJS = require("crypto-js");
let md5 = require("md5");
/*
        let firebaseConfig = {
          apiKey: "AIzaSyABpHVfr6b4twYbVxyDbYutJEPGLSAHibo",
          authDomain: "chrome-webgalpi.firebaseapp.com",
          databaseURL: "https://chrome-webgalpi.firebaseio.com",
          projectId: "chrome-webgalpi",
          storageBucket: "chrome-webgalpi.appspot.com",
          messagingSenderId: "360661693058",
          appId: "1:360661693058:web:bb726edb30cafe2cd4fa9b",
          measurementId: "G-P4BNDS8D9S"
        };
        // Initialize Firebase
        Firebase.initializeApp(firebaseConfig);
        */

export default {
  components: { BackupDescriptionArea, RestoreListArea },
  props: [],
  data: () => ({
    tab: null,
    dialog: false,
    backupPassword: "KKUNI_BEAR_GMAIL.COM_KKUNI",
    restoreFile: null,
    BACKUP_FOLDER_TITLE: "WEBGALPI",
    backupOverlay: false,
    backupData: null,
    backupDescription: ""
  }),
  created() {
    this.$nextTick(() => {
      EventBus.$on("run.backup", description => {
        this.backupDescription = description;
        this.googleBackup(this.backupData);
      });
    });
  },
  mounted() {},
  methods: {
    onFilePicked() {
      alert("pick file");
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    getBackupFolderId() {
      return new Promise(resolve => {
        chrome.identity.getAuthToken({ interactive: true }, token => {
          gapi.auth.setToken({
            access_token: token
          });

          let BACKUP_FOLDER_ID = null;
          gapi.client.load("drive", "v2", () => {
            let retrievePageOfFiles = request => {
              request.execute(async resp => {
                if (resp.code === 401) {
                  this.invalidCredentionsProcess();
                  return false;
                }

                resp.items.filter(item => {
                  if (
                    item.title === this.BACKUP_FOLDER_TITLE &&
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
                title: this.BACKUP_FOLDER_TITLE,
                mimeType: "application/vnd.google-apps.folder"
              }
            })
            .execute(backupFolder => {
              res(backupFolder.id);
            });
        });
      });
    },
    sendBackupFile(fileContent, backupFolderId) {
      return new Promise(res => {
        chrome.identity.getAuthToken({ interactive: true }, token => {
          //let fileContent = "sample text2"; // As a sample, upload a text file.

          let file = new Blob([fileContent], { type: "text/plain" });
          let metadata = {
            name: "WEBGALPI_BACKUP_" + new Date().getTime(), // Filename at Google Drive
            mimeType: "text/plain", // mimeType at Google Drive
            parents: [backupFolderId], // Folder ID at Google Drive
            description: this.backupDescription
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

    async googleBackup(backupData) {
      //if (!confirm("구글 드라이브로 백업을 진행하시겠습니까?")) return false;

      this.backupOverlay = true;
      let BACKUP_FOLDER_ID = await this.getBackupFolderId();
      if (!BACKUP_FOLDER_ID) {
        BACKUP_FOLDER_ID = await this.createBackupFolder();
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
        this.backupPassword
      ).toString();

      this.sendBackupFile(JSON.stringify(backupObj), BACKUP_FOLDER_ID)
        .then(res => {
          //백업이 완료 되었습니다.
          MODAL.alert(LANG.getMessage("M0003"));
        })
        .catch(error => {
          //백업 도중 에러가 발생하였습니다.
          MODAL.alert(LANG.getMessage("M0004"));
        })
        .finally(() => {
          this.backupOverlay = false;
        });

      //FILE
      /*let filename = "backup.json";
                                                                  let ele = document.createElement("a");
                                                                  ele.setAttribute(
                                                                      "href",
                                                                      "data:text/plain;charset=utf-8," +
                                                                      encodeURIComponent(JSON.stringify(backupObj))
                                                                  );
                                                                  ele.setAttribute("download", filename);

                                                                  ele.style.display = "none";
                                                                  document.body.appendChild(ele);
                                                                  ele.click();
                                                                  document.body.removeChild(ele);*/
    },
    async fileBackup(backupData) {
      //FILE
      /*let filename = "backup.json";
                                                                  let ele = document.createElement("a");
                                                                  ele.setAttribute(
                                                                      "href",
                                                                      "data:text/plain;charset=utf-8," +
                                                                      encodeURIComponent(JSON.stringify(backupObj))
                                                                  );
                                                                  ele.setAttribute("download", filename);

                                                                  ele.style.display = "none";
                                                                  document.body.appendChild(ele);
                                                                  ele.click();
                                                                  document.body.removeChild(ele);*/
    },
    firebaseBackup(backupData) {
      //FIREBASE
      /*Firebase.database()
                            .ref("users/" + md5(result.loginInfo.EMAIL))
                            .set(backupData)
                            .then(res => {
                              console.log("res ", res);
                            });*/
    },
    async backup(type) {
      let result = await Utils.getLocalStorage("loginInfo");

      CONTENT_LISTENER.sendMessage({
        type: "get.backup.data",
        data: result.loginInfo.EMAIL
      }).then(backupData => {
        if (backupData !== undefined) {
          switch (type) {
            case "google":
              this.backupData = backupData;
              this.$refs.backupDescriptionArea.open();
              //this.googleBackup(backupData);
              break;
            case "file":
              this.fileBackup(backupData);
              break;
            case "public_cloud":
              //this.firebaseBackup(backupData);
              break;
            case "private_cloud":
              break;
          }
        }
      });
    },
    invalidCredentionsProcess() {
      this.backupOverlay = false;
      alert(
        "Google이 로그아웃 되어있습니다. \n새창이 열리면 로그인 후 다시 시도해주세요."
      );
      chrome.identity.getAuthToken({ interactive: true }, token => {
        ACCOUNT.removeGoogleTokenCache(token).then(res => {
          if (res) {
            ACCOUNT.googleLogin().then(async ret => {
              let result = await Utils.getLocalStorage("loginInfo");
              if (result.loginInfo.EMAIL !== ret.email) {
                let token = await Utils.getLocalStorage("googleToken");
                alert(
                  result.loginInfo.EMAIL +
                    " 계정과 다른 계정으로 로그인 하셨습니다."
                );
                ACCOUNT.removeGoogleTokenCache(token.googleToken);
                return false;
              }
            });
          }
        });
      });
    },
    googleRestore() {
      this.backupOverlay = true;

      //구글 드라이브에서 리스트 가져오기
      chrome.identity.getAuthToken({ interactive: true }, token => {
        //todo : 현재 계정과맞는 로그인을 했는지 체크가 필요함.

        gapi.auth.setToken({
          access_token: token
        });

        //let BACKUP_FOLDER_ID = null;
        new Promise(res => {
          gapi.client.load("drive", "v2", () => {
            let retrievePageOfFiles = (request, result) => {
              request.execute(async resp => {
                if (resp.code == 401) {
                  this.invalidCredentionsProcess();
                  return false;
                }

                /*
                                    BACKUP_FOLDER_ID = resp.items.filter(item => {
                                      if (
                                        item.title === this.BACKUP_FOLDER_TITLE &&
                                        item.explicitlyTrashed === false &&
                                        item.labels.trashed === false
                                      ) {
                                        //console.log("item parent ", item);
                                        return item.id;
                                      }
                                    });*/

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
          this.backupOverlay = false;
          if (list.length === 0) {
            alert("복구 할 대상이 존재하지 않습니다.");
            return false;
          }
          this.$refs.restoreListArea.open(list, this.backupPassword);
        });
      });
    }
    /*restore() {
                                                        if (this.restoreFile === null) {
                                                            alert("파일을 선택하십시오.");
                                                            return false;
                                                        }
                                                        if (!this.restoreFile) {
                                                            this.data = "No File Chosen";
                                                        }
                                                        let reader = new FileReader();
                                                        reader.readAsText(this.restoreFile);
                                                        reader.onload = () => {
                                                            // this.data = reader.result;
                                                            try {
                                                                let data = JSON.parse(reader.result);
                                                                // Decrypt
                                                                let bytes = CryptoJS.AES.decrypt(data.data, this.backupPassword);
                                                                let originalText = bytes.toString(CryptoJS.enc.Utf8);

                                                                this.$refs.restoreProcessArea.open(originalText);
                                                                this.close();
                                                            } catch (e) {
                                                                EventBus.$emit(
                                                                    "open.snack",
                                                                    "정상적인 백업 파일이 아닙니다.",
                                                                    "error"
                                                                );
                                                                console.log("e", e);
                                                            }
                                                        };
                                                    }*/
  }
};
</script>
