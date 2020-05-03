<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" persistent scrollable max-width="650px">
    <v-card>
      <v-card-title>백업/복구</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pl-0 pr-0">
        <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
          <v-tab>
            FILE
          </v-tab>
          <v-tab>
            PUBLIC CLOUD
          </v-tab>
          <v-tab>
            PRIVATE CLOUD
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-row>
              <v-col cols="6">
                <v-card flat>
                  <v-card-title>백업</v-card-title>
                  <v-card-text>
                    파일 형태로 백업이 진행되며, 모든 데이타는 암호화 처리
                    됩니다.<br />
                    아래와 같은 경우, 복구되지 않을 수 있으니 주의 바랍니다.<br />
                    <li>파일 내용을 임의로 수정하지 마세요.</li>
                    <li>현재 계정과 같은 계정으로 복구됩니다.</li>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card flat>
                  <v-card-title>복구</v-card-title>
                  <v-card-text>
                    복구 시, 기존 데이타는 모두 제거 됩니다.<br />
                    <span style="color: orangered"
                      >현재 계정과 불일치 할 경우, 복구되지 않으니 주의
                      바랍니다.</span
                    >
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6" class="text-right">
                <v-btn small color="primary" @click="backup('file')"
                  >백업
                </v-btn>
              </v-col>
              <v-col cols="4" class="text-left">
                <v-file-input
                  label="select a restore file"
                  outlined
                  v-model="restoreFile"
                  dense
                >
                </v-file-input>
              </v-col>
              <v-col cols="auto" class="pl-0 text-right">
                <v-btn small color="warning" @click="restore">복구</v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    서버 비용이 만만치 않아서요..<br />
                    Cloud Backup 편할텐데 말이죠?<br /><br />
                    돈 많이 벌면 오픈하겠습니다.
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    Server Application과 DATABASE TABLE SCHEME를 제공합니다.<br />
                    서버 구성 후, Server Endpoint를 등록 하시면 Private Cloud를
                    사용 하실 수 있습니다.<br />
                    (구성이 어려우신 분들은 커피한잔으로, 주변 개발자에게
                    부탁해보세요~ )<br />
                    <br />
                    GIT :
                    <font style="color: orangered"
                      >죄송합니다.. 사실 회사일이 바빠서 아직
                      못만들었습니다.</font
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      placeholder="PRIVATE CLOUD ENDPOINT"
                      outlined
                      dense
                      disabled
                    ></v-text-field>
                    <v-btn small color="primary">백업</v-btn>
                    <v-btn small color="warning">복구</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="blue" text @click="close">CLOSE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import Utils from "../../utils/Utils";
import Firebase from "firebase";
import EventBus from "../../event-bus";

let CryptoJS = require("crypto-js");
let md5 = require("md5");
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

export default {
  props: [],
  data: () => ({
    tab: null,
    dialog: false,
    backupPassword: "KKUNI_BEAR_GMAIL.COM_KKUNI",
    restoreFile: null
  }),
  created() {},
  mounted() {},
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    async fileBackup(backupData) {
      let result = await Utils.getLocalStorage("loginInfo");

      backupData.email = result.loginInfo.EMAIL;
      let backupObj = new Object();

      // Encrypt
      let cipherBackupData = CryptoJS.AES.encrypt(
        JSON.stringify(backupData),
        this.backupPassword
      ).toString();
      backupObj.data = cipherBackupData;

      //FILE
      let filename = "backup.json";
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
      document.body.removeChild(ele);
    },
    firebaseBackup(backupData) {
      //FIREBASE
      Firebase.database()
        .ref("users/" + md5(result.loginInfo.EMAIL))
        .set(backupData)
        .then(res => {
          console.log("res ", res);
        });
    },
    async backup(type) {
      let result = await Utils.getLocalStorage("loginInfo");

      CONTENT_LISTENER.sendMessage({
        type: "get.backup.data",
        data: result.loginInfo.EMAIL
      }).then(backupData => {
        if (backupData !== undefined) {
          switch (type) {
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
    restore() {
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
          console.log("originalText ", JSON.parse(originalText));
        } catch (e) {
          EventBus.$emit(
            "open.snack",
            "정상적인 백업 파일이 아닙니다.",
            "error"
          );
          console.log("e", e);
        }
      };
    }
  }
};
</script>
