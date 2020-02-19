<template>
    <div id="more">
      <el-row>
          <el-col :span="6">
            <el-row>
              <el-col :span="24">
                <img src="../../assets/img/more/note.png" width="94px" height="94px">
              </el-col>
            </el-row>
            <el-row>
              <router-link to="/more/noteWrite">事件记录</router-link>
            </el-row>
          </el-col>
          <el-col :span="6">
          <el-row>
            <el-col :span="24">
              <img src="../../assets/img/more/share.png" width="94px" height="94px">
            </el-col>
          </el-row>
          <el-row>
            <router-link to="/more/note">记事本</router-link>
          </el-row>
        </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="24">
                <img src="../../assets/img/more/time-memory.png" width="94px" height="85px">
              </el-col>
            </el-row>
            <el-row>
              <router-link to="/wishes">时间隧道</router-link>
            </el-row>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row>
            <el-col :span="24">
              <img src="../../assets/img/more/1201158.gif" width="94px" height="90px">
            </el-col>
          </el-row>
          <el-row>
            敬请期待
          </el-row>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>
#more{
  width: 100%;
  height: 100%;

  margin:10px auto;
  text-align: center;
}
</style>
