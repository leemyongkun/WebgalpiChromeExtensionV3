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
      <v-card-text class="pl-0 pr-0" style="overflow-x:hidden">
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
import RestoreListArea from "./backup/RestoreListArea";
import BackupDescriptionArea from "./backup/BackupDescriptionArea";
import EventBus from "../../event-bus";
import GOOGLE_DRIVE from "../../../common/GoogleDriveBackupAndRestore";
import ACCOUNT from "../../../common/account";

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
    restoreFile: null,
    backupOverlay: false,
    backupData: null,
    email: null
  }),
  created() {
    this.$nextTick(() => {
      EventBus.$on("run.backup", description => {
        this.googleBackup(this.backupData, description);
      });
    });
  },
  mounted() {},
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    googleBackup(backupData, description) {
      this.backupOverlay = true;
      GOOGLE_DRIVE.executeGoogleDriveBackup(backupData, description).then(
        () => {
          this.backupOverlay = false;

          let params = new Object();
          params.googleBackupDate = new Date().getTime();
          params.email = this.email;
          CONTENT_LISTENER.sendMessage({
            type: "update.update.history",
            data: params
          });
        }
      );
    },
    async fileBackup(backupData) {},
    async backup(type) {
      let result = await Utils.getLocalStorage("loginInfo");
      this.email = result.loginInfo.EMAIL;
      CONTENT_LISTENER.sendMessage({
        type: "get.backup.data",
        data: this.email
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
    googleRestore() {
      this.backupOverlay = true;
      GOOGLE_DRIVE.executeGoogleDriveRestore().then(list => {
        this.backupOverlay = false;
        console.log("list ", list);
        if (list) {
          this.$refs.restoreListArea.open(list, GOOGLE_DRIVE.getPassword());
        }
      });
    }
  }
};

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
</script>
