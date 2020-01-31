<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-list-item>
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
                    >SAVE</v-btn
                  >
                  <v-btn
                    v-if="slackStatus === 2"
                    color="warning"
                    @click="updateSlack"
                    >UPDATE</v-btn
                  >
                  <v-btn
                    v-if="slackStatus === 2"
                    color="red"
                    @click="deleteSlack"
                    >DELETE</v-btn
                  >
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
export default {
  components: {},
  props: [],
  data: () => ({
    slackChannels: [
      { CHANNEL_NAME: "001_co공지", CHANNEL_URL: "www.naver.com" },
      { CHANNEL_NAME: "OS_그냥방", CHANNEL_URL: "www.naver.com" },
      { CHANNEL_NAME: "OS_업무방", CHANNEL_URL: "www.naver.com" },
      { CHANNEL_NAME: "전사공지", CHANNEL_URL: "www.naver.com" },
      { CHANNEL_NAME: "게임방", CHANNEL_URL: "www.naver.com" },
      { CHANNEL_NAME: "중고나라", CHANNEL_URL: "www.naver.com" },
      { CHANNEL_NAME: "서비스 배포", CHANNEL_URL: "www.naver.com" }
    ],
    slackChannelName: "",
    slackChannelUrl: "",
    slackStatus: 1 // 1 : SAVE , 2 : UPDATE
  }),
  created() {},
  mounted() {},
  methods: {
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
      /*if(this._.trim(this.slackChannelName) === ''){
                    alert('비었음.')
                }

                if(this._.trim(this.slackChannelName) === ''){
                    alert('비었음.')
                }*/
    },
    detailSlackInfo(item) {
      this.slackStatus = 2;
      this.slackChannelName = item.CHANNEL_NAME;
      this.slackChannelUrl = item.CHANNEL_URL;
    }
  }
};
</script>
<style>
.v-text-field__details {
  display: none !important;
}
</style>
