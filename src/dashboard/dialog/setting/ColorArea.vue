<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-expansion-panel>
    <v-expansion-panel-header
      >COLOR : 최대 6개의 컬러를 지정할 수 있습니다.
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-row>
        <v-col
          cols="12"
          sm="3"
          md="3"
          v-for="(item, idx) in colorValue"
          :key="idx"
        >
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
      <v-row>
        <v-col>
          <v-btn block small color="primary" @click="saveColor">SAVE </v-btn>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
//color https://www.materialpalette.com/colors
import CONTENT_LISTENER from "../../../common/content-listener";
import SnackBar from "../../snack/SnackBar";
export default {
  components: { SnackBar },
  props: [],
  data: () => ({
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
    saveColor() {
      if (this.pickColor.length === 0) {
        alert("1개 이상 선택");
        return false;
      }

      CONTENT_LISTENER.sendMessage({
        type: "update.option.color",
        data: [this.pickColor.join(","), "kkuni.bear@gmail.com"] //[todo] 2번째 파라메터는 Email 로 한다.
      }).then(response => {
        this.snackbarMessage = "COLOR가 저장되었습니다."; //스낵바 기본 메시지
        this.snackbar = true; //스낵바 open /close 여부
      });
    },
    selectedColor() {
      if (this.pickColor.length === 7) {
        alert("6개까지입니다.");
        this.pickColor = this.pickColor.slice(0, 6);
        return false;
      }

      if (this.pickColor.length === 0) {
        alert("1개 이상 선택");
        return false;
      }
    }
  }
};
</script>
