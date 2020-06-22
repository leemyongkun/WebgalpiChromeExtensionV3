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
        <!-- <v-data-table v-model="selected" :headers="headers" :items="items">
                     <template slot="item" slot-scope="props">
                         <tr
                                 style="cursor: pointer;"
                                 @click="selectedTargetRestoreFile(props.item)"
                         >
                             <td>{{ props.item.description }}</td>
                             <td class="text-xs-right">
                                 {{ convertDate(props.item.title.split("_")[2]) }}
                             </td>
                             <td class="text-xs-right">
                                 {{ convertByteToKB(props.item.fileSize) }}
                             </td>
                         </tr>
                     </template>
                 </v-data-table>-->

        <v-data-table v-model="selected" :headers="headers" :items="items">
          <template v-slot:item.description="{ item }">
            {{ item.description }}
          </template>
          <template v-slot:item.modifiedDate="{ item }">
            {{ convertDate(item.title.split("_")[2]) }}
          </template>

          <template v-slot:item.fileSize="{ item }">
            {{ convertByteToKB(item.fileSize) }}
          </template>
          <template v-slot:item.id="{ item }">
            <v-btn color="green" icon @click="selectedTargetRestoreFile(item)">
              <v-icon>mdi-backup-restore</v-icon>
            </v-btn>
            <v-btn color="red" icon @click="deleteRestoreFile(item)">
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="blue" text @click="close">CLOSE</v-btn>
      </v-card-actions>
    </v-card>

    <RestoreProcessArea
      :reRendering="reRendering"
      :key="Key.restoreProcessArea"
      ref="restoreProcessArea"
    ></RestoreProcessArea>
    <v-overlay :value="restoreOverlay">
      <v-progress-circular indeterminate size="32"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>
<script>
import RestoreProcessArea from "./RestoreProcessArea";
import MODAL from "../../../../common/modal";
import EventBus from "../../../event-bus";

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
    Key: {
      restoreProcessArea: 0
    },
    headers: [
      {
        text: "Description",
        align: "center",
        value: "description",
        width: "40%"
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
      },
      {
        text: "Action",
        align: "center",
        sortable: false,
        value: "id",
        width: "15%"
      }
    ]
  }),
  created() {},
  mounted() {},
  methods: {
    open(list, password) {
      console.log("list ", list);
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
    convertByteToKB(val) {
      val = val / 1024;
      return Math.floor(val * 100) / 100;
    },
    async deleteRestoreFile(item) {
      let confirm = `<b>${item.description}</b> 를 삭제 하시겠습니까?"`;
      if (this.items.length === 1) {
        confirm += "<br> 주의 : 마지막 백업파일입니다.";
      }

      let result = await MODAL.confirm(confirm, null, null, null, "450px");
      if (result.value === undefined) return false;
      this.restoreOverlay = true;

      chrome.identity.getAuthToken({ interactive: true }, token => {
        let url = "https://www.googleapis.com/drive/v3/files/" + item.id;
        fetch(url, {
          method: "DELETE",
          headers: new Headers({
            Authorization: "Bearer " + token
          })
        }).then(file => {
          let result = this.items.filter(i => {
            return i.id !== item.id;
          });
          this.items = result;
          EventBus.$emit("open.snack", "삭제 되었습니다.");

          this.restoreOverlay = false;
        });
      });
    },
    async selectedTargetRestoreFile(item) {
      let confirm = `<b>${item.description}</b> 로 복구 하시겠습니까?"`;
      let result = await MODAL.confirm(confirm);
      if (result.value === undefined) return false;
      this.restoreOverlay = true;

      chrome.identity.getAuthToken({ interactive: true }, token => {
        let url =
          "https://www.googleapis.com/drive/v3/files/" + item.id + "?alt=media";
        fetch(url, {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + token
          })
        }).then(file => {
          file.text().then(result => {
            let data = JSON.parse(result);
            let bytes = CryptoJS.AES.decrypt(data.data, this.backupPassword);
            let originalText = bytes.toString(CryptoJS.enc.Utf8);
            this.$refs.restoreProcessArea.open(originalText);
            this.restoreOverlay = false;
            this.close();
          });
        });
      });
    },
    reRendering(type) {
      this.Key.restoreProcessArea += 1;
    }
  }
};
</script>
