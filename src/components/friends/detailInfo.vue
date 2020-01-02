<template>
    <div id="detailInfo">
      <el-row>
        <img src="">
      </el-row>
      <el-row>
        账号名:
      </el-row>
      <el-row>
        备注名:
      </el-row>
      <el-row>
        <el-button>发送消息</el-button>
      </el-row>
      <el-row>
        <el-button>删除好友</el-button>
      </el-row>
      <el-row>
        举报
      </el-row>
    </div>
</template>

<script>
    export default {
      name: "detailInfo",
      data(){
        return{
          friendId:this.$route.query.friendId
        }
      }
    }
</script>

<style scoped>
  #detailInfo{
    text-align: center;
    font-size:18px;
    color: darkgrey;

  }
  .el-row{
    margin-top: 8px;
    margin-bottom: 8px;
  }
</style>
