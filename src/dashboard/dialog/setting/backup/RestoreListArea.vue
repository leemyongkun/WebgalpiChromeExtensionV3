<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="750px"
    overlay-opacity="0.9"
  >
    <v-card>
      <v-card-title>
        Backup Files
      </v-card-title>
      <v-card-text class="pl-0 pr-0">
        <v-data-table v-model="selected" :headers="headers" :items="items">
          <template slot="item" slot-scope="props">
            <tr
              style="cursor: pointer;"
              @click="selectedTargetRestoreFile(props.item)"
            >
              <td>{{ props.item.description }}</td>
              <td class="text-xs-right">
                {{ convertDate(props.item.title.split("_")[2]) }}
              </td>
              <td class="text-xs-right">{{ props.item.fileSize }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="blue" text @click="close">CLOSE</v-btn>
      </v-card-actions>
    </v-card>

    <RestoreProcessArea ref="restoreProcessArea"></RestoreProcessArea>
    <v-overlay :value="restoreOverlay">
      <v-progress-circular indeterminate size="32"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>
<script>
import RestoreProcessArea from "./RestoreProcessArea";

let CryptoJS = require("crypto-js");

export default {
  components: { RestoreProcessArea },
  props: [],
  data: () => ({
    dialog: false,
    restoreOverlay: false,
    selected: [],
    items: [],
    backupPassword: null,
    headers: [
      {
        text: "Description",
        align: "center",
        value: "description",
        width: "60%"
      },
      {
        text: "Modified Date",
        align: "center",
        sortable: false,
        value: "modifiedDate",
        width: "25%"
      },
      {
        text: "File Size(KB)",
        align: "center",
        sortable: false,
        value: "fileSize",
        width: "15%"
      }
    ]
  }),
  created() {},
  mounted() {},
  methods: {
    open(list, password) {
      this.items = list;
      this.backupPassword = password;
      this.dialog = true;
    },
    close() {
      this.selected = [];
      this.items = [];
      this.backupPassword = [];
      this.dialog = false;
    },
    convertDate(time) {
      let date = new Date(Number(time));
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();

      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }

      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    selectedTargetRestoreFile(item) {
      console.log(item.webContentLink);
      // console.log("a", item,item.title, item.id);
      if (!confirm(item.title + "로 복구 하시겠습니까?")) return false;
      this.restoreOverlay = true;
      fetch(item.webContentLink, {
        method: "GET"
      }).then(file => {
        file.text().then(result => {
          console.log("result ", result);
          let data = JSON.parse(result);
          let bytes = CryptoJS.AES.decrypt(data.data, this.backupPassword);
          let originalText = bytes.toString(CryptoJS.enc.Utf8);
          this.$refs.restoreProcessArea.open(originalText);
          this.restoreOverlay = false;
          this.close();
        });
      });
    }
  }
};
</script>
