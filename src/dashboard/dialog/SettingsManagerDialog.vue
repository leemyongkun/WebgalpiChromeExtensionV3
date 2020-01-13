<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- 다이얼로그 -->
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="closeDialog">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-list three-line subheader>
        <v-subheader>Data Controll</v-subheader>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Connect Socket</v-list-item-title>
            <v-list-item-subtitle
              >같은 대역의 네트워크에 포함된 플랫폼끼리 데이터를 공유 할 수
              있다.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Backup</v-list-item-title>
            <v-list-item-subtitle>
              <v-btn color="secondary" fab x-small dark @click="backupDownload">
                <v-icon>mdi-television</v-icon>
              </v-btn>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-row>
        <v-col cols="6">
          <v-list three-line subheader>
            <v-subheader>General</v-subheader>
            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-theme-light-dark</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Theme</v-list-item-title>
                <v-list-item-subtitle>
                  <v-radio-group v-model="theme" row>
                    <v-radio
                      label="DARK"
                      value="dark"
                      @change="changeTheme"
                    ></v-radio>
                    <v-radio
                      label="LIGHT"
                      value="light"
                      @change="changeTheme"
                    ></v-radio>
                  </v-radio-group>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item disabled>
              <v-list-item-action>
                <v-icon>mdi-slack</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>SLACK : 준비</v-list-item-title>
                <v-list-item-content>
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-header
                        >Panel 3</v-expansion-panel-header
                      >
                      <v-expansion-panel-content>
                        Some content
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-list-item-content>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-format-color-fill</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  >COLOR : 5개의 컬러를 지정할 수 있습니다.</v-list-item-title
                >
                <v-list-item-subtitle>
                  <v-checkbox
                    label="COLOR-1"
                    background-color="red"
                    value="red"
                    hide-details
                  >
                    <template v-slot:label>
                      <div>
                        I agree that
                        <div style="background: #ff90c3">
                          Opens in new window
                        </div>
                        is awesome
                      </div>
                    </template>
                  </v-checkbox>
                  <v-checkbox
                    label="COLOR-2"
                    color="#ffcd86"
                    value="red darken-3"
                    hide-details
                  ></v-checkbox>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="widgets"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Auto-add widgets</v-list-item-title>
                <v-list-item-subtitle
                  >Automatically add home screen widgets
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6">
          <v-divider vertical></v-divider>
          READY
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
  <!-- 다이얼로그 -->
</template>
<script>
export default {
  components: {},
  props: ["dialog"],
  data: () => ({
    theme: "dark",
    notifications: false,
    widgets: false,
    color1: "ff90c3"
  }),
  created() {},
  mounted() {},
  methods: {
    backupDownload() {
      let obj = new Object();
      let filename = "test.json";

      obj.category = this.category;
      let ele = document.createElement("a");
      ele.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
          encodeURIComponent(JSON.stringify(obj))
      );
      ele.setAttribute("download", filename);

      ele.style.display = "none";
      document.body.appendChild(ele);
      ele.click();
      document.body.removeChild(ele);
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
};
</script>
