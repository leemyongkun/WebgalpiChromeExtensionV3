<template>
  <el-container>
    <el-header style="line-height: 30px; height:30px; text-align: right;">
      <el-button
        type="primary"
        style="padding: 2px 11px;"
        icon="el-icon-edit"
      ></el-button>
      <el-button
        type="primary"
        style="padding: 2px 11px;"
        icon="el-icon-share"
      ></el-button>
      <el-button
        type="primary"
        style="padding: 2px 11px;"
        icon="el-icon-delete"
      ></el-button>
    </el-header>

    <el-main style="padding: 3px;">
      <el-tabs tab-position="left" style="height: 320px;">
        <el-tab-pane label="INFO">
          <div style="width: 380px">
            <div>
              <span style="height: 10px;">Custom</span>
            </div>
            <div>
              <el-image :src="src" fit="fill">
                <div slot="placeholder" class="image-slot">
                  Loading<span class="dot">...</span>
                </div>
              </el-image>
            </div>
            <div>
              <span>
                ---- 소스 네비게이션 ----- Ctrl + 마우스커서(혹은 F3) : 클래스나
                메소드 혹은 멤버를 상세하게 검색하고자 할때 Alt + Left, Alt +
                Right : 이후, 이전 Ctrl + O : 해당 소스의 메소드 리스트를
                확인하려 할때 F4 : 클래스명을 선택하고 누르면 해당 클래스의
                Hierarchy 를
              </span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="HIGHLIGT">
          <el-scrollbar wrap-class="list" :native="false">
            <div style="height: 300px;">
              <el-timeline
                style="padding-left: 2px; margin-top: 12px; margin-right: 20px;"
              >
                <el-timeline-item
                  v-for="(activity, index) in Highlight.activities"
                  :key="index"
                  :icon="activity.icon"
                  :type="activity.type"
                  :color="activity.color"
                  :size="activity.size"
                  :timestamp="activity.DATE_CREATE"
                >
                  {{ activity.PRINT_TEXT }}
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="OPTION">OPTION</el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>

  <!-- el-tabs tab-position="left" style="height: 320px;">
                <el-tab-pane label="INFO">

                    <div style="width: 380px">
                        <span class="demonstration">Custom</span>
                        <el-image :src="src" fit="fill">
                            <div slot="placeholder" class="image-slot">
                                Loading<span class="dot">...</span>
                            </div>
                        </el-image>
                    </div>
                </el-tab-pane>


                <el-tab-pane label="HIGHLIGT">
                    <el-scrollbar wrap-class="list" :native="false">
                        <div style="height: 300px;">
                            <el-timeline
                                    style="padding-left: 2px; margin-top: 12px; margin-right: 20px;"
                            >
                                <el-timeline-item
                                        v-for="(activity, index) in Highlight.activities"
                                        :key="index"
                                        :icon="activity.icon"
                                        :type="activity.type"
                                        :color="activity.color"
                                        :size="activity.size"
                                        :timestamp="activity.timestamp"
                                >
                                    {{ activity.content }}
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="Role">Role</el-tab-pane>
                <el-tab-pane label="Task">Task</el-tab-pane>
            </el-tabs -->
</template>

<script>
import { EVENT } from "../contents/action.js";
import { GLOBAL_CONFIG, URL } from "../contents/global/config.js";

export default {
  name: "App",
  data() {
    return {
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      Highlight: {
        activities: []
      },
      OG: {
        isTitle: false,
        isImage: false,
        isDescription: false
      },
      image: null,
      isCollapse: true
    };
  },
  mounted() {
    let port = chrome.extension.connect({
      name: "Sample Communication"
    });

    port.postMessage({
      action: "highlights"
    });
    port.onMessage.addListener(response => {
      console.log(" >>> ", response);
      this.Highlight.activities = response;
    });

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let tabId = tabs[0].id;

      chrome.tabs.sendMessage(
        tabId,
        {
          action: "content.test",
          data: "data!"
        },
        siteInfo => {
          console.log("siteInfo >> ", siteInfo);

          if (siteInfo.OG_IMAGE != null) {
            this.OG.isImage = true;
          }
          if (siteInfo.OG_TITLE != null) {
            this.OG.isTitle = true;
          }
          if (siteInfo.OG_DESCRIPTION != null) {
            this.OG.isDescription = true;
          }
          this.siteInfo = siteInfo;
        }
      );
    });
  },
  methods: {}
};
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
