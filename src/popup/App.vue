<template>
  <div style="width: 200px; height: 300px; border: 0px solid ; margin: 3px">
    <el-row>
      <el-button type="primary" size="mini" @click="test" plain
        >Primary</el-button
      >
      <el-button type="success" size="mini" plain>Success</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    test() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "content.test",
            data: null
          },
          function(response) {}
        );
      });
      /*chrome.runtime.sendMessage({
                    type: "content.test",
                    data: null
                }, function(response) {
                    reserveDefer.resolve(response);
                });*/
    }
  }
};
</script>
