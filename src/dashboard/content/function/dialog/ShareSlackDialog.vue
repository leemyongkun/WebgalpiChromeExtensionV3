<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" @click="open">
        <v-icon>mdi-slack</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline"><v-icon>mdi-slack</v-icon> Share</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <!--<v-text-field label="CHANNEL" required></v-text-field>-->
              <v-select
                v-model="slackChannels"
                :items="slackChannelList"
                attach
                chips
                item-text="CHANNEL_NAME"
                item-value="WEBHOOK_URL"
                label="SLACK CHANNELS"
                multiple
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                outlined
                name="input-7-4"
                label="MESSAGE"
                :value="slackMessage"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Close</v-btn>
        <v-btn color="green darken-1" text @click="share">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
import CONTENT_LISTENER from "../../../../common/content-listener";
import Utils from "../../../utils/Utils";

export default {
  components: {},
  props: ["currentSite"],
  data: () => ({
    dialog: false,
    slackMessage: "",
    slackChannels: [],
    slackChannelList: []
  }),
  created() {},
  mounted() {},
  methods: {
    share() {
      let payload = {
        attachments: [
          {
            fallback: "WEBGALPI로부터 공유되었습니다.",
            username: "WEBGALPI",
            color: "#36a64f",
            pretext: this.slackMessage,
            author_name: this.currentSite.HOST,
            author_icon: "chrome://favicon/" + this.currentSite.HOST,
            title: this.currentSite.TITLE,
            title_link: this.currentSite.URL,
            text: this.currentSite.OG_DESCRIPTION,
            /*'fields': [
                                                {
                                                    'title': '공유할 사이트 타이틀',
                                                    'value': '공유할 사이트 DESCRIPTION',
                                                    'short': false
                                                }
                                            ],*/
            image_url: "image_url",
            thumb_url: "thumb_url",
            footer: "공유된 날짜",
            footer_icon: "footer_icon",
            ts: 123456789
          }
        ]
      };
      this.slackChannels.forEach(slackChannelUrl => {
        axios.post(slackChannelUrl, payload).then(res => {});
      });

      this.close();
    },
    close() {
      this.dialog = false;
      this.slackChannelList = [];
      this.slackChannels = [];
      this.slackMessage = "";
    },
    open() {
      this.$nextTick(async () => {
        let result = await Utils.getLocalStorage("loginInfo");
        //Highlight 내용 가져오기
        let param = new Object();
        param.KEY = this.currentSite.URL_KEY;
        param.EMAIL = result.loginInfo.EMAIL;

        CONTENT_LISTENER.sendMessage({
          type: "get.highlights",
          data: param
        }).then(highlights => {
          this.slackMessage = "* HIGHLIGHTS *\n\n";
          highlights.forEach((item, idx) => {
            this.slackMessage += idx + 1 + ". " + item.PRINT_TEXT + "\n\n";
          });
        });

        //Slack 채널 가져오기
        CONTENT_LISTENER.sendMessage({
          type: "get.slack",
          data: null
        }).then(slackList => {
          slackList.map(item => {
            this.slackChannelList.push(item);
          });
        });
      });
    }
  }
};
/*    let payload = {
                          // bot 이름을 바꿀 수 있다.
                          username: "WEBGALPI",
                          // bot 아이콘을 바꿀 수 있다.
                          icon_url:
                              "https://ca.slack-edge.com/T04GMRZQS-UJFE5M63E-6dafd967707e-48",
                          // bot 아이콘을 이모티콘으로 사용할 수 있다. 위의 icon_url 중 하나만 사용하면 된다.
                          icon_emoji: "icon_emoji",
                          // 본문 내용을 입력한다. (필수)
                          text: "본문 : https://www.bithumb.com/additional_service/defilending"
                          // 채널을 override 시킬 수 있다.
                          //"channel" : ""
                      };
      */
</script>
