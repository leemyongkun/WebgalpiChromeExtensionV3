<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" persistent scrollable max-width="650px">
    <v-card>
      <v-card-title>SLACK</v-card-title>
      <v-card-subtitle
        >Incoming Webhook으로 Slack 채널에 공유할 수 있습니다.
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
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
          <v-col cols="auto" class="ml-0 pl-0 mr-0 pr-0">
            <v-btn
              class="ml-0 pl-0 mr-0 pr-0"
              style="min-width: 15px"
              text
              v-if="slackStatus === 1"
              @click="saveSlack"
            >
              <!--addSlackInfo-->
              <v-icon>mdi-plus</v-icon>
            </v-btn>

            <v-btn
              class="ml-0 pl-0 mr-0 pr-0"
              style="min-width: 15px"
              text
              v-if="slackStatus === 2"
              @click="updateSlack"
            >
              <!--addSlackInfo-->
              <v-icon>mdi-rotate-left</v-icon>
            </v-btn>

            <v-btn
              class="ml-0 pl-0 mr-0 pr-0"
              style="min-width: 15px"
              text
              v-if="slackStatus === 2"
              @click="deleteSlack"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              class="ml-0 pl-0 mr-0 pr-0"
              style="min-width: 15px"
              text
              v-if="slackStatus === 2"
              @click="addSlackInfo"
            >
              <v-icon>mdi-cancel</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small text color="warning" @click="close">CLOSE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";
import SnackBar from "../../snack/SnackBar";
import EventBus from "../../event-bus";
import Utils from "../../utils/Utils";

export default {
  components: { SnackBar },
  props: [],
  data: () => ({
    dialog: false,
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
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    getSlackList() {
      CONTENT_LISTENER.sendMessage({
        type: "get.slack",
        data: null
      }).then(slackList => {
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
        EventBus.$emit("open.snack", "SLACK URL이 수정되었습니다.");
        this.addSlackInfo();
        this.getSlackList();
      });
    },
    async deleteSlack() {
      if (!confirm("선택하신 Slack Url을 삭제하시겠습니까?")) return false;
      let result = await Utils.getLocalStorage("loginInfo");

      let slackParam = [this.slackIdx, result.loginInfo.EMAIL];
      CONTENT_LISTENER.sendMessage({
        type: "delete.slack",
        data: slackParam
      }).then(response => {
        EventBus.$emit("open.snack", "SLACK URL이 삭제되었습니다.");
        this.addSlackInfo();
        this.getSlackList();
      });
    },
    async saveSlack() {
      if (this._.trim(this.slackChannelName) === "") {
        alert("이름을 넣어주세요.");
        return false;
      }

      if (this._.trim(this.slackChannelUrl) === "") {
        alert("URL이 비었음.");
        return false;
      }

      let result = await Utils.getLocalStorage("loginInfo");
      let slackParam = [
        result.loginInfo.EMAIL,
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
