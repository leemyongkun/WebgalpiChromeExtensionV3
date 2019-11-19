<template>
  <div>
    <p>Hello Options</p>
    <p>
      <el-container>
        <el-row>
          <el-col :span="24"
            ><div class="grid-content bg-purple-dark">111</div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="12"
            ><div class="grid-content bg-purple">222</div></el-col
          >
          <el-col :span="12"
            ><div class="grid-content bg-purple-light"></div
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple-light"></div
          ></el-col>
          <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
      </el-container>
    </p>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
