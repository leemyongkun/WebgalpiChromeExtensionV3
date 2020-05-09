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
        Restore List
      </v-card-title>
      <v-data-table v-model="selected" :headers="headers" :items="items">
        <template slot="item" slot-scope="props">
          <tr @click="selectedTargetRestoreFile(props.item)">
            <td>{{ props.item.title }}</td>
            <td class="text-xs-right">{{ props.item.title.split("_")[2] }}</td>
            <td class="text-xs-right">{{ props.item.fileSize }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <RestoreProcessArea ref="restoreProcessArea"></RestoreProcessArea>
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
    selected: [],
    items: [],
    backupPassword: null,
    headers: [
      {
        text: "File Name",
        align: "center",
        sortable: false,
        value: "title"
      },
      { text: "Modified Date", value: "modifiedDate" },
      { text: "File Size(KB)", value: "fileSize" }
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
    selectedTargetRestoreFile(item) {
      // console.log("a", item,item.title, item.id);
      if (!confirm(item.title + "로 복구 하시겠습니까?")) return false;
      fetch(item.webContentLink, {
        method: "GET"
      }).then(file => {
        file.text().then(result => {
          let data = JSON.parse(result);
          let bytes = CryptoJS.AES.decrypt(data.data, this.backupPassword);
          let originalText = bytes.toString(CryptoJS.enc.Utf8);
          this.$refs.restoreProcessArea.open(originalText);
          this.close();
        });
      });
    }
  }
};
</script>
