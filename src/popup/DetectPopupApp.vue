<template>
  <v-app>
    <div :style="style">
      <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1"
              >차단된 사이트
            </v-list-item-title>
            <v-list-item-subtitle class="pb-4 pt-2"
              >이 사이트에서는 WEBGALPI를 사용할 수
              없습니다.</v-list-item-subtitle
            >
            <v-list-item-subtitle style="color: #e35a69"
              >페이스북/트위터는 패치중입니다.</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <v-btn color="primary" text block @click="goDashboard" block
            >Dashboard 이동하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-app>
</template>

<script>
export default {
  components: {},
  data: () => ({
    style: "max-height: 390px; height: 42x; width: 350px;"
  }),
  created() {},
  methods: {
    goDashboard() {
      let extensionDashboard =
        "chrome-extension://" + chrome.runtime.id + "/dashboard/index.html";
      let open = window.open(extensionDashboard, "_blank");
      open.focus();
    }
  },
  mounted() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
<style></style>
