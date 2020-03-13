<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" scrollable max-width="600px">
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
        style: "background: #e35a69; border-radius: 5px;"
      },
      {
        className: "highlight-color-2",
        style: "background: #f7b900; border-radius: 5px;"
      },
      {
        className: "highlight-color-3",
        style: "background: #2da64e; border-radius: 5px;"
      },
      {
        className: "highlight-color-4",
        style: "background: #d9c3ff; border-radius: 5px;"
      },
      {
        className: "highlight-color-5",
        style: "background: #97c2dd; border-radius: 5px;"
      },
      {
        className: "highlight-color-6",
        style: "background: #ef9a9a; border-radius: 5px;"
      },
      {
        className: "highlight-color-7",
        style: "background: #90a4ae; border-radius: 5px;"
      },
      {
        className: "highlight-color-8",
        style: "background: #CDDC39; border-radius: 5px;"
      },
      {
        className: "highlight-color-9",
        style: "background: #ffb540; border-radius: 5px;"
      },
      {
        className: "highlight-color-10",
        style: "background: #B2EBF2; border-radius: 5px;"
      },
      {
        className: "highlight-color-11",
        style: "background: #c0b6a7; border-radius: 5px;"
      }
    ],
    colorList: [
      "#e35a69",
      "#f7b900",
      "#2da64e",
      "#d9c3ff",
      "#97c2dd",
      "#ef9a9a",
      "#90a4ae",
      "#CDDC39",
      "#ffb540",
      "#B2EBF2",
      "#c0b6a7"
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
    saveColor() {
      if (this.pickColor.length === 0) {
        alert("1개 이상 선택");
        return false;
      }

      CONTENT_LISTENER.sendMessage({
        type: "update.option.color",
        data: [this.pickColor.join(","), "kkuni.bear@gmail.com"] //[todo] 2번째 파라메터는 Email 로 한다.
      }).then(response => {
        EventBus.$emit("open.snack", "COLOR가 저장되었습니다.");
        this.close();
      });
    },
    selectedColor() {
      if (this.pickColor.length === 7) {
        EventBus.$emit("open.snack", "Color지정은 6개까지입니다.", "red");
        this.pickColor = this.pickColor.slice(0, 6);
        return false;
      }

      if (this.pickColor.length === 0) {
        EventBus.$emit("open.snack", "Color를 1개 이상 지정해야합니다.", "red");
        return false;
      }
    }
  }
};
</script>
