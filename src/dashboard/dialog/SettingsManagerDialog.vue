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
            <v-list-item-subtitle>정해진 날 / 위치 / WEB</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
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
        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="sound"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sound</v-list-item-title>
            <v-list-item-subtitle
              >Auto-update apps at any time. Data charges may apply
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
    sound: true,
    widgets: false
  }),
  created() {},
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
};
</script>
