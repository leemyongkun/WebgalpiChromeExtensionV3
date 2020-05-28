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
        <v-btn text x-small v-on="on">
          {{ member.EMAIL }}
        </v-btn>
      </template>
      <v-list class="pt-0 pb-0">
        <v-list-item class="pt-0 pb-0" @click="signOut">
          로그아웃
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn text @click="showInfo">
      <v-icon>mdi-information-outline</v-icon>
    </v-btn>
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
    ciPath: ""
  }),
  props: ["member"],
  created() {
    this.$nextTick(async () => {
      this.ciPath =
        "chrome-extension://" + chrome.runtime.id + "/icons/icon_48.png";
    });
  },
  methods: {
    showInfo() {
      MODAL.alert(
        "[미정]<br>Update 진행상황에 대해 알림 예정입니다.",
        null,
        null,
        "400px"
      );
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
