<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-list-item>
    <v-snackbar
      v-model="snackbar"
      :timeout="snackbarTimeout"
      :color="`success`"
      top
    >
      {{ snackbarMessage }}
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <v-list-item-action>
      <v-icon>mdi-slack</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>
        <v-expansion-panels focusable flat>
          <v-expansion-panel>
            <v-expansion-panel-header
              >SLACK : Incoming Webhook으로 Slack 채널에 공유할 수 있습니다.
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col
                  cols="12"
                  sm="2"
                  md="2"
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
                <v-col cols="3">
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
                <v-col cols="6">
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
                <v-col cols="2">
                  <v-btn
                    v-if="slackStatus === 1"
                    color="primary"
                    @click="saveSlack"
                    >SAVE
                  </v-btn>
                  <v-btn
                    v-if="slackStatus === 2"
                    color="warning"
                    @click="updateSlack"
                    >UPDATE
                  </v-btn>
                  <v-btn
                    v-if="slackStatus === 2"
                    color="red"
                    @click="deleteSlack"
                    >DELETE
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-list-item-title>
      <v-list-item-subtitle>
        &nbsp;
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
import CONTENT_LISTENER from "../../../common/content-listener";

export default {
  components: {},
  props: [],
  data: () => ({
    snackbarTimeout: 3000, //스낵바 유지시간
    snackbarMessage: "", //스낵바 기본 메시지
    snackbar: false, //스낵바 open /close 여부
    slackChannels: [],
    slackChannelName: "",
    slackChannelUrl: "",
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
      alert("update slack");
    },
    deleteSlack() {},
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
      this.slackStatus = 2;
      this.slackChannelName = item.CHANNEL_NAME;
      this.slackChannelUrl = item.WEBHOOK_URL;
    }
  }
};
</script>
<style>
.v-text-field__details {
  display: none !important;
}
</style>
