<template>
  <el-carousel :autoplay="false" arrow="always"
    ><!--:interval="5000" -->
    <el-carousel-item v-for="item in 4" :key="item">
      <el-row>
        <el-button
          type="info"
          icon="el-icon-message"
          @click="saveSiteInfo"
          circle
        ></el-button>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card :body-style="{ padding: '0px' }">
            <div style="padding: 14px;">
              <span>{{ image }}</span>
            </div>
            <img
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              class="image"
            />
            <div style="padding: 14px;">
              <span>Yummy hamburger</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-carousel-item>
  </el-carousel>
</template>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 200px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

/**/
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<script>
export default {
  name: "App",
  data() {
    return {
      image: null,
      siteInfo: null
    };
  },

  methods: {
    saveSiteInfo() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "content.test",
            data: "data!"
          },
          response => {
            console.log("response ", response);
            this.siteInfo = response;
          }
        );
      });
    }
  }
};
</script>
