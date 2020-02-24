<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-expansion-panel>
    <v-expansion-panel-header
      >SLACK : Incoming Webhook으로 Slack 채널에 공유할 수 있습니다.
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col
          cols="auto"
          v-for="(item, idx) in slackChannels"
          :key="idx"
          style="padding-top: 0px; padding-bottom: 0px;"
        >
          <v-chip class="ma-2" outlined @click="detailSlackInfo(item)">
            <v-icon dense size="16px" left>mdi-slack</v-icon>
            {{ item.CHANNEL_NAME }}
          </v-chip>
        </v-col>
        <v-col
          cols="12"
          sm="2"
          md="2"
          style="padding-top: 0px; padding-bottom: 0px;"
        >
          <v-chip class="ma-2" outlined @click="addSlackInfo">
            <v-icon>mdi-plus</v-icon>
          </v-chip>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="auto">
          <v-text-field
            label="NAME"
            placeholder="Slack Channel"
            outlined
            dense
            autofocus
            clearable
            :value="slackChannelName"
            v-model="slackChannelName"
          ></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-text-field
            label="URL"
            placeholder="incoming-webhook URL"
            outlined
            dense
            clearable
            :value="slackChannelUrl"
            v-model="slackChannelUrl"
          >
            <template v-slot:append>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click="helpUrl"
                    >mdi-help-circle-outline
                  </v-icon>
                </template>
                What is Incoming-Webhook URL?
              </v-tooltip>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-btn v-if="slackStatus === 1" color="primary" @click="saveSlack"
            >SAVE
          </v-btn>
          <v-btn v-if="slackStatus === 2" color="warning" @click="updateSlack"
            >UPDATE
          </v-btn>
          <v-btn v-if="slackStatus === 2" color="red" @click="deleteSlack"
            >DELETE
          </v-btn>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import SnackBar from "../../snack/SnackBar";

export default {
  components: { SnackBar },
  props: [],
  data: () => ({
    slackChannels: [],
    slackChannelName: "",
    slackChannelUrl: "",
    slackIdx: "",
    slackStatus: 1 // 1 : SAVE , 2 : UPDATE
  }),
  created() {},
  mounted() {
    this.getSlackList();
  },
  methods: {
    getSlackList() {
      CONTENT_LISTENER.sendMessage({
        type: "get.slack",
        data: null
      }).then(slackList => {
        console.log("slackList ", slackList);
        this.slackChannels = slackList;
      });
    },
    helpUrl() {
      let open = window.open(
        "https://api.slack.com/messaging/webhooks#getting-started",
        "_blank"
      );
      open.focus();
    },
    addSlackInfo() {
      this.slackStatus = 1;
      this.slackChannelName = "";
      this.slackChannelUrl = "";
    },
    updateSlack() {
      if (!confirm("선택하신 Slack Url을 수정하시겠습니까?")) return false;
      let slackParam = [
        this.slackChannelName,
        this.slackChannelUrl,
        this.slackIdx
      ];
      CONTENT_LISTENER.sendMessage({
        type: "update.slack",
        data: slackParam
      }).then(response => {
        this.snackbarMessage = "SLACK URL이 수정되었습니다.";
        this.snackbar = true;
        this.getSlackList();
      });
    },
    deleteSlack() {
      if (!confirm("선택하신 Slack Url을 삭제하시겠습니까?")) return false;
      let slackParam = [this.slackIdx];
      CONTENT_LISTENER.sendMessage({
        type: "delete.slack",
        data: slackParam
      }).then(response => {
        this.snackbarMessage = "SLACK URL이 삭제되었습니다.";
        this.snackbar = true;
        this.slackChannelName = "";
        this.slackChannelUrl = "";
        this.getSlackList();
      });
    },
    saveSlack() {
      console.log("slackChannelName ", this.slackChannelName);
      if (this._.trim(this.slackChannelName) === "") {
        alert("이름을 넣어주세요.");
        return false;
      }

      if (this._.trim(this.slackChannelUrl) === "") {
        alert("URL이 비었음.");
        return false;
      }

      let slackParam = [
        "",
        this.slackChannelName,
        this.slackChannelUrl,
        new Date().getTime()
      ];
      CONTENT_LISTENER.sendMessage({
        type: "post.slack",
        data: slackParam
      }).then(response => {
        this.snackbarMessage = "SLACK URL이 저장되었습니다.";
        this.snackbar = true;
        this.slackChannelUrl = "";
        this.slackChannelName = "";
        this.getSlackList();
      });
    },
    detailSlackInfo(item) {
      console.log("slack item ", item);
      this.slackStatus = 2;
      this.slackChannelName = item.CHANNEL_NAME;
      this.slackChannelUrl = item.WEBHOOK_URL;
      this.slackIdx = item.IDX;
    }
  }
};
</script>
<style>
.v-text-field__details {
  display: none !important;
}
</style>
