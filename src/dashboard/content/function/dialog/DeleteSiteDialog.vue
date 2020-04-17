<template>
  <v-dialog v-model="deleteDialog" persistent max-width="290">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        <v-icon>mdi-delete-forever</v-icon>
        사이트 삭제
      </v-card-title>
      <v-card-text
        ><u>하이라이트도 함께 삭제됩니다.</u><br />(복구되지 않음)
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">CANCEL</v-btn>
        <v-btn color="green darken-1" text @click="remove">DELETE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../../common/content-listener";
import EventBus from "../../../event-bus";
import Utils from "../../../utils/Utils";

export default {
  components: {},
  props: ["currentSite"],
  data: () => ({
    deleteDialog: false
  }),
  methods: {
    async remove() {
      //모든 하이라이트 삭제
      await CONTENT_LISTENER.sendMessage({
        type: "delete.all.highlight",
        data: this.currentSite
      });

      //category에 포함된 사이트 삭제
      await CONTENT_LISTENER.sendMessage({
        type: "delete.site.in.category",
        data: this.currentSite
      });

      //사이트 삭제
      CONTENT_LISTENER.sendMessage({
        type: "delete.site",
        data: this.currentSite
      }).then(() => {
        //처음 저장 하므로 같은 사이트를 리로딩 한다.
        CONTENT_LISTENER.sendMessage({
          type: "reloading.same.site",
          data: this.currentSite
        });
        EventBus.$emit("reload.category");
        EventBus.$emit("hideSite", this.currentSite.URL_KEY);
        this.close();
      });
    },
    close() {
      this.deleteDialog = false;
    }
  }
};
</script>
