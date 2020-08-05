<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="600px"
    overlay-opacity="0.9"
  >
    <v-card>
      <v-card-title>COLOR</v-card-title>
      <v-card-subtitle> 최대 6개의 컬러를 지정할 수 있습니다.</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="auto" v-for="(item, idx) in colorValue" :key="idx">
            <v-checkbox
              @change="selectedColor"
              v-model="pickColor"
              :value="item.className"
              hide-details
            >
              <template v-slot:label>
                <div :style="item.style">
                  <span style="color: black">&nbsp;COLOR&nbsp;</span>
                </div>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small text color="warning" @click="close">CLOSE</v-btn>
        <v-btn small text color="primary" @click="saveColor">SAVE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
//color https://www.materialpalette.com/colors
import CONTENT_LISTENER from "../../../common/content-listener";
import EventBus from "../../event-bus";
import Utils from "../../utils/Utils";
import LANG from "../../../common/language";

export default {
  props: [],
  data: () => ({
    dialog: false,
    pickColor: [
      "highlight-color-1",
      "highlight-color-2",
      "highlight-color-3",
      "highlight-color-4",
      "highlight-color-5",
      "highlight-color-6"
    ],
    colorValue: [
      {
        className: "highlight-color-1",
        style: "background: #F2D3D9; border-radius: 5px;"
      },
      {
        className: "highlight-color-2",
        style: "background: #D8CCDA; border-radius: 5px;"
      },
      {
        className: "highlight-color-3",
        style: "background: #C7D0ED; border-radius: 5px;"
      },
      {
        className: "highlight-color-4",
        style: "background: #CCDFE6; border-radius: 5px;"
      },
      {
        className: "highlight-color-5",
        style: "background: #C7E7E6; border-radius: 5px;"
      },
      {
        className: "highlight-color-6",
        style: "background: #D7EBDF; border-radius: 5px;"
      },
      {
        className: "highlight-color-7",
        style: "background: #D3ECC5; border-radius: 5px;"
      },
      {
        className: "highlight-color-8",
        style: "background: #FDECA7; border-radius: 5px;"
      },
      {
        className: "highlight-color-9",
        style: "background: #F2D9BA; border-radius: 5px;"
      },
      {
        className: "highlight-color-10",
        style: "background: #F8DFD8; border-radius: 5px;"
      },
      {
        className: "highlight-color-11",
        style: "background: #EFEDE1; border-radius: 5px;"
      }
    ]
  }),
  created() {},
  mounted() {
    chrome.storage.local.get(["options"], result => {
      this.pickColor = result.options.COLOR.split(",");
    });
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    async saveColor() {
      if (this.pickColor.length === 0) {
        alert("1개 이상 선택");
        return false;
      }
      let result = await Utils.getLocalStorage("loginInfo");

      CONTENT_LISTENER.sendMessage({
        type: "update.option.color",
        data: [this.pickColor.join(","), result.loginInfo.EMAIL] //[todo] 2번째 파라메터는 Email 로 한다.
      }).then(response => {
        EventBus.$emit("open.snack", LANG.SNACK_MESSAGE("S0010"), "success");
        this.close();
      });
    },
    selectedColor() {
      if (this.pickColor.length === 7) {
        EventBus.$emit("open.snack", LANG.SNACK_MESSAGE("S0011"), "red");
        this.pickColor = this.pickColor.slice(0, 6);
        return false;
      }

      if (this.pickColor.length === 0) {
        EventBus.$emit("open.snack", LANG.SNACK_MESSAGE("S0012"), "red");
        return false;
      }
    }
  }
};
</script>
