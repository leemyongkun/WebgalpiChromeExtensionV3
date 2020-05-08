<template>
  <v-app-bar app clipped-left color="">
    <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->
    <span class="title ml-3 mr-5" @click="processTest">WEB-GALPI</span>
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
    <v-btn text @click="">
      <v-icon>mdi-information-outline</v-icon>&nbsp;README
    </v-btn>
    <SignArea ref="signout"></SignArea>

    <RestoreProcessArea ref="restoreProcessArea"></RestoreProcessArea>
  </v-app-bar>
</template>
<script>
import SignArea from "../dialog/setting/SignArea";
import RestoreProcessArea from "../dialog/setting/RestoreProcessArea";
import dbcon from "../../database/dbcon";

export default {
  components: { RestoreProcessArea, SignArea },
  data: () => ({}),
  props: ["member"],
  created() {
    this.$nextTick(() => {});
  },
  methods: {
    signOut() {
      this.$refs.signout.open();
    },
    processTest() {
      //참고 : https://bumbu.me/gapi-in-chrome-extension  , https://qiita.com/takahiro1110/items/4ed2c4e894d2d359751e , https://developers.google.com/drive/api/v2/reference/files/list#javascript

      //리스트
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        // APIのアクセストークンを設定。
        gapi.auth.setToken({
          access_token: token
        });
        gapi.client.load("drive", "v2", function(r) {
          var retrievePageOfFiles = function(request, result) {
            request.execute(function(resp) {
              result = result.concat(resp.items);
              var nextPageToken = resp.nextPageToken;
              if (nextPageToken) {
                request = gapi.client.drive.files.list({
                  pageToken: nextPageToken
                });
                retrievePageOfFiles(request, result);
              } else {
                result.map(item => {
                  if (
                    item.title === "KKUNI" &&
                    item.explicitlyTrashed === false
                  ) {
                    //PARENT를 찾는다. , explicitlyTrashed가 false 인것들.
                    console.log(item);
                  }
                });
              }
            });
          };
          var initialRequest = gapi.client.drive.files.list();
          retrievePageOfFiles(initialRequest, []);
        });
      });

      //폴더 생성
      /*chrome.identity.getAuthToken({interactive: true}, function (token) {

                    gapi.client.request({
                        'path': '/drive/v2/files/',
                        'method': 'POST',
                        'headers': {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token,
                        },
                        'body': {
                            "title": "BACKUP_WEBGALPI",
                            "mimeType": "application/vnd.google-apps.folder",
                        }
                    }).execute((res => {
                        console.log("res", res);
                    }));

                });*/

      //파일 업로드
      /* chrome.identity.getAuthToken({ interactive: true }, function(token) {
                     let fileContent = "sample text2"; // As a sample, upload a text file.
                     let file = new Blob([fileContent], {type: "text/plain"});
                     let metadata = {
                         name: "KKUNI", // Filename at Google Drive
                         mimeType: "text/plain", // mimeType at Google Drive
                         'parents': ["1i5HLj5-UVqP_i_qYkoNS_sjy8Cua20o-"], // Folder ID at Google Drive
                     };

                     let accessToken = token; //gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
                     let form = new FormData();
                     form.append(
                         "metadata",
                         new Blob([JSON.stringify(metadata)], {type: "application/json"})
                     );
                     form.append("file", file);

                     fetch(
                         "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
                         {
                             method: "POST",
                             headers: new Headers({
                                 Authorization: "Bearer " + accessToken
                             }),
                             body: form
                         }
                     )
                         .then(res => {
                             return res.json();
                         })
                         .then(function (val) {
                             console.log("val " , val);
                         });
                 });*/

      /*dbcon.truncateTable();
                alert("초기화 되었습니다.");
                location.reload();*/
      /*let str = '';
                this.$refs.restoreProcessArea.open(str);*/
    }
  }
};
</script>
