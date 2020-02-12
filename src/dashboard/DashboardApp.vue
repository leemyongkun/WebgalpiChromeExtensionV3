<template>
  <v-app>
    <v-app-bar app clipped-left color="">
      <!--<v-app-bar-nav-icon @click="drawer = !drawer"/>-->
      <span class="title ml-3 mr-5"
        >WEB&nbsp;<span class="font-weight-light" @click="googleLogin"
          >Galpi</span
        >
      </span>
      <!--<v-text-field
                                                              solo-inverted
                                                              flat
                                                              hide-details
                                                              label="Search"
                                                              prepend-inner-icon="mdi-feature-search-outline"
                                                      />-->
      <v-spacer />
      <v-btn text @click="">
        <v-icon>mdi-information-outline</v-icon>&nbsp;README
      </v-btn>
    </v-app-bar>
    <MenuPage />
    <v-content>
      <v-container fluid>
        <ContentBody></ContentBody>
        <!--<SiteListWidePage></SiteListWidePage>-->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MenuPage from "./layout/MenuPage";
import SiteListWidePage from "./content/SiteListWidePage";
import ContentBody from "./content/ContentBody";

export default {
  components: { ContentBody, SiteListWidePage, MenuPage },
  data: () => ({}),
  methods: {
    googleLogin() {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        console.log("getAuthToken", token);
        if (token === undefined) return false;
        //https://www.google.com/search?q=chrome.identity.getAuthToken+cache&rlz=1C5CHFA_enKR819KR819&oq=chrome.identity.getAuthToken+cache&aqs=chrome..69i57.1571j0j7&sourceid=chrome&ie=UTF-8
        //GOOGLE 로그인

        let init = {
          method: "GET",
          async: true,
          headers: {
            "Content-Type": "application/json"
          },
          cache: "no-cache",
          contentType: "json"
        };
        fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
            token,
          init
        )
          .then(response => response.json())
          .then(function(data) {
            alert(JSON.stringify(data));
            //upload();
            chrome.identity.removeCachedAuthToken({ token: token }, () => {});
          });

        return false;

        let upload = () => {
          let fileContent = "sample text2"; // As a sample, upload a text file.
          let file = new Blob([fileContent], { type: "text/plain" });
          let metadata = {
            name: token.split("_")[0], // Filename at Google Drive
            mimeType: "text/plain" // mimeType at Google Drive
            //'parents': ['WEBGALPI'], // Folder ID at Google Drive
          };

          let accessToken = token; //gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
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
                Authorization: "Bearer " + accessToken
              }),
              body: form
            }
          )
            .then(res => {
              return res.json();
            })
            .then(function(val) {
              console.log(val);
            });
        };

        //https://console.developers.google.com/apis/api/drive.googleapis.com/metrics?project=chrome-webgalpi
        //https://developers.google.com/drive/api/v3/reference/files/create
        //https://github.com/GoogleChrome/chrome-app-samples/tree/master/samples/identity -- 샘플

        /*

                                                                            let init = {
                                                                                method: "GET",
                                                                                async: true,
                                                                                headers: {
                                                                                    Authorization: "Bearer " + token,
                                                                                    "Content-Type": "application/json"
                                                                                },
                                                                                contentType: "json"
                                                                            };
                                                                            fetch(
                                                                                "https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=AIzaSyABpHVfr6b4twYbVxyDbYutJEPGLSAHibo",
                                                                                init
                                                                            ).then(response => response.json()).then(function (data) {
                                                                                console.log(data);
                                                                            });*/
      });
    }
  },
  created() {
    this.$nextTick(() => {
      chrome.storage.local.get(["options"], result => {
        let options = result.options;
        console.log(" >>> options ", options);
        if (options.THEME === "dark") {
          this.$vuetify.theme.dark = true;
        } else {
          this.$vuetify.theme.dark = false;
        }
      });
    });
  },
  mounted() {}
};
</script>
