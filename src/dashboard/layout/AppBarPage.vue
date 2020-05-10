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
import RestoreProcessArea from "../dialog/setting/backup/RestoreProcessArea";
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

      //파일 가져오기

      fetch(
        "https://drive.google.com/uc?id=1Bl7P7Uvxlr3dWUo2Tu4u1KQ9p18EattG&export=download",
        {
          method: "GET"
          /*, headers: new Headers({
                            Authorization: "Bearer " + token
                        })*/
        }
      ).then(file => {
        file.text().then(result => console.log(result));
      });

      /*chrome.identity.getAuthToken({interactive: true}, function (token) {
                   /!* fetch(
                        "https://content.googleapis.com/drive/v2/files/1Bl7P7Uvxlr3dWUo2Tu4u1KQ9p18EattG?alt=media&source=downloadUrl",
                        {
                            method: "GET",
                            headers: new Headers({
                                Authorization: "Bearer " + token
                            })
                        }
                    )
                        .then(file => {
                            console.log("download file ", file);
                        });
*!/



                    gapi.client.load("drive", "v2", () => {
                        function downloadGDriveFile (file) {
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', "https://content.googleapis.com/drive/v2/files/1Bl7P7Uvxlr3dWUo2Tu4u1KQ9p18EattG?alt=media&source=downloadUrl");
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                            xhr.onload = function() {
                                var content = xhr.responseText;
                                console.log("content " , content)
                            };

                            xhr.onerror = function() {
                                alert("Download failure.");
                            };

                            xhr.send();
                        }

                        var request = gapi.client.drive.files.get({'fileId': "1Bl7P7Uvxlr3dWUo2Tu4u1KQ9p18EattG"});
                        request.execute(downloadGDriveFile);

                    });
                });*/

      //리스트
      /*chrome.identity.getAuthToken({interactive: true}, function (token) {
                    // APIのアクセストークンを設定。
                    gapi.auth.setToken({
                        access_token: token
                    });

                    let BACKUP_FOLDER_ID = null;

                    new Promise(res => {
                        let BACKUP_FOLDER_TITLE = 'WEBGALPI';

                        gapi.client.load("drive", "v2", () => {
                            let retrievePageOfFiles = function (request, result) {
                                request.execute(async resp => {

                                    BACKUP_FOLDER_ID = resp.items.filter(item => {
                                        if (item.title === BACKUP_FOLDER_TITLE && item.explicitlyTrashed === false) {
                                            console.log("item parent ", item);
                                            return item.id;
                                        }
                                    });

                                    /!* if (BACKUP_FOLDER_ID !== null) {
                                         res(BACKUP_FOLDER_ID);
                                         return false;
                                     }*!/
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
                                            if (item.title.indexOf("WEBGALPI_BACKUP_") !== -1 && item.explicitlyTrashed === false) {
                                                //PARENT를 찾는다. , explicitlyTrashed가 false 인것들.
                                                console.log(item);
                                                files.push(item)
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

                    }).then(result => {
                        console.log("result ", result);
                        console.log("BACKUP_FOLDER_ID ", BACKUP_FOLDER_ID);
                    })

                });*/

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
                            "labels": {
                                "viewed": false
                            }
                        }
                    }).execute((res => {
                        console.log("res", res);
                    }));

                });*/

      //파일 업로드
      /*chrome.identity.getAuthToken({interactive: true}, function (token) {
                    let fileContent = "sample text2"; // As a sample, upload a text file.
                    let file = new Blob([fileContent], {type: "text/plain"});
                    let metadata = {
                        name: "WEBGALPI_BACKUP_" + new Date().getTime(), // Filename at Google Drive
                        mimeType: "text/plain", // mimeType at Google Drive
                        'parents': ["1tv8aJQL7kxI12vSsbZecJGrOTbR-LnQ9"], // Folder ID at Google Drive
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
                            console.log("val ", res);
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
