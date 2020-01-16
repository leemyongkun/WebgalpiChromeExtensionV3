<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
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
              <v-text-field label="CHANNEL" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                outlined
                name="input-7-4"
                label="MESSAGE"
                value=""
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

export default {
  components: {},
  props: [],
  data: () => ({
    dialog: false
  }),
  created() {},
  mounted() {},
  methods: {
    share() {
      let webhookUrl =
        "https://hooks.slack.com/services/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";
      let payload = {
        // bot 이름을 바꿀 수 있다.
        username: "임용근",
        // bot 아이콘을 바꿀 수 있다.
        icon_url:
          "https://ca.slack-edge.com/T04GMRZQS-UJFE5M63E-6dafd967707e-48",
        // bot 아이콘을 이모티콘으로 사용할 수 있다. 위의 icon_url 중 하나만 사용하면 된다.
        icon_emoji: "",
        // 본문 내용을 입력한다. (필수)
        text: "https://www.bithumb.com/additional_service/defilending"
        // 채널을 override 시킬 수 있다.
        //"channel" : ""
      };
      axios.post(webhookUrl, payload).then(res => {
        console.log("res.data >>> ", res.data);
      });
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>
