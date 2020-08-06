<template>
  <v-app>
    <div :style="style">
      <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1"
              >{{ LANG.DESCRIPTION_MESSAGE("D0079") }}
            </v-list-item-title>
            <v-list-item-subtitle class="pb-4 pt-2"
              >{{ LANG.DESCRIPTION_MESSAGE("D0080") }}
            </v-list-item-subtitle>
            <v-list-item-subtitle style="color: #e35a69"
              >{{ LANG.DESCRIPTION_MESSAGE("D0081") }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <v-btn color="primary" text block @click="goDashboard" block
            >{{ LANG.BUTTON_MESSAGE("B0022") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import Common from "../common/common";
import LANG from "../common/language";

export default {
  components: {},
  data: () => ({
    style: "max-height: 390px; height: 42x; width: 350px;",
    LANG: LANG
  }),
  created() {},
  methods: {
    goDashboard() {
      Common.goDashboard();
    }
  },
  mounted() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
<style></style>
