<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->

    <span class="title ml-3 mr-5" @click="processTest">
      WEB-GALPI
    </span>
    <v-text-field
      solo-inverted
      flat
      hide-details
      label="Search"
      prepend-inner-icon="mdi-feature-search-outline"
      v-if="false"
    />
    <v-spacer />
    <v-menu
      transition="slide-y-transition"
      offset-y
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn text small v-on="on">
          {{ member.EMAIL }}
        </v-btn>
      </template>
      <v-list class="pt-0 pb-0">
        <v-list-item class="pt-0 pb-0" @click="signOut">
          로그아웃
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      v-model="infoMenu"
      :close-on-content-click="false"
      :close-on-click="false"
      offset-y
      max-width="500px"
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip v-model="infoTooltip" color="blue" bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn icon v-on="{ ...menu, ...tooltip }">
              <v-icon>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          <span>UPDATE를 확인합니다.</span>
        </v-tooltip>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>UPDATE WEBGALPI</v-list-item-title>
              <v-list-item-subtitle
                >{{ update.versionInfo }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <!--<v-btn :class="''" icon>
                                                            <v-icon>mdi-heart</v-icon>
                                                        </v-btn>-->
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-card>
                <v-card-title>개선 및 기능추가</v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.improvement"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
              <v-card>
                <v-card-title>디버깅</v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.debug"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
              <v-card>
                <v-card-title>해야할 기능</v-card-title>
                <v-card-text
                  class="pt-0 pb-2"
                  v-for="(item, idx) in update.todo"
                  :key="idx"
                  >{{ idx + 1 }}. {{ item }}
                </v-card-text>
              </v-card>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="infoMenu = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <SignArea ref="signout"></SignArea>
  </v-app-bar>
</template>
<script>
import SignArea from "../dialog/setting/SignArea";
import dbcon from "../../database/dbcon";
import Utils from "../utils/Utils";
import MODAL from "../../common/modal";

export default {
  components: { SignArea },
  data: () => ({
    ciPath: "",
    infoMenu: false,
    infoTooltip: false,
    update: {
      versionInfo: "1.0.8",
      improvement: [
        "[공통] 차단된 사이트에서는 WEBGALPI의 사용이 제한되며, ICON에 (X)가 표시됩니다.",
        "[공통] 업데이트 시, notification이 발생하여, 업데이트 내역을 확인 할 수 있습니다.",
        "[ALL PAGE] 네이버 BLOG 에서도 하이라이팅이 가능하게 되었습니다.",
        "[대쉬보드]SLACK 공유 기능이 제거되었습니다.",
        "[대쉬보드] 각 기능마다 툴팁으로 간략한 설명이 포함됩니다.",
        "[팝업] 아이콘이 변경되었습니다."
      ],
      debug: [
        "최초 가입 후, 열려있는 모든 탭의 로딩여부를 묻습니다."
        /*"(해야함) 가입 및 로그인 후, 임시로 열린 Google Tab을 닫는다."*/
      ],
      todo: [
        "OneTab과 같은 기능을 추가한다.",
        "다국어처리를 한다. (한국어/영어/일본어)",
        "제목/본문 키워드 검색기능을 추가한다.",
        "BOOKMARK -> WEBGALPI로 IMPORT기능을 추가한다.",
        "Google 검색 시, WEBGALPI에 이미 등록한 내용을 추천한다.",
        "스크래핑 재시도 기능을 추가한다.",
        "[복구] 시, 스크래핑이 되지 않은 컨텐츠 정보를 보여준다."
        /*"Private Backup Server를 개발한다.",*/
      ]
    }
  }),
  props: ["member"],
  created() {
    this.$nextTick(async () => {
      this.ciPath =
        "chrome-extension://" + chrome.runtime.id + "/icons/icon_48.png";
      this.update.versionInfo = "VER " + chrome.runtime.getManifest().version;
    });
  },
  methods: {
    showInfo() {
      this.infoMenu = true;
      let extensionDashboard =
        "chrome-extension://" + chrome.runtime.id + "/dashboard/index.html";
      history.pushState(null, null, extensionDashboard);
    },
    signOut() {
      this.$refs.signout.open();
    },
    async processTest() {
      /*  gapi.load('auth2', function() {
                                                    /!* Ready. Make a call to gapi.auth2.init or some other API *!/
                                                    var gauth = gapi.auth2.init({
                                                        client_id: '360661693058-ttivuuvbrjp1n0d8se709414tmoq2u4r.apps.googleusercontent.com',
                                                        cookie_policy: 'none'
                                                    });

                                                    gauth.then(function(){
                                                        console.log('init success');
                                                    }, function(e){
                                                        console.error('init fail',e);
                                                    })
                                                });*/
      //"1jUTMxYetjXvUwYslGFARoUP83wsEHpfB"
      //mimeType: "text/plain"
      /*      chrome.identity.getAuthToken({ interactive: true }, token => {
                                                                      var fileId = "1QRFYTIsKt1A-DUc-ZBXSGhbN879Nkr-g";
                                                                      var accessToken =token;
                                                                      var xhr = new XMLHttpRequest();
                                                                      xhr.open("GET", "https://www.googleapis.com/drive/v3/files/"+fileId+'?alt=media', true);
                                                                      xhr.setRequestHeader('Authorization','Bearer '+accessToken);
                                                                      xhr.responseType = 'text/plain';
                                                                      xhr.onload = function(){
                                                                          //base64ArrayBuffer from https://gist.github.com/jonleighton/958841
                                                                          console.log("xhr.response",xhr.response);

                                                                          //do something with the base64 image here

                                                                      }
                                                                      xhr.send();
                                                                  });*/
      /*
                                                                                  var request = gapi.client.drive.files.export({
                                                                                  fileId:id,
                                                                                  mimeType:type
                                                                              })
                                                                              request.execute(function(resp){
                                                                                  console.log(resp);
                                                                              });
                                                                              */
      /*console.log("gapi.auth.getToken().access_token " , token);
                                                                                              var xhr = new XMLHttpRequest();
                                                                                              xhr.open("GET", "https://www.googleapis.com/drive/v3/files/1sB6z38h-00K-oY_q2rGuK9sckYmLx2Ap", true);
                                                                                              xhr.setRequestHeader('Authorization','Bearer '+token);
                                                                                              xhr.onload = function(){
                                                                                                  console.log("xhr",xhr);
                                                                                              }
                                                                                              xhr.send('alt=media');*/
      //참고 : https://bumbu.me/gapi-in-chrome-extension  , https://qiita.com/takahiro1110/items/4ed2c4e894d2d359751e , https://developers.google.com/drive/api/v2/reference/files/list#javascript
    }
  }
};
</script>
