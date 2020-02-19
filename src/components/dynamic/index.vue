<template>
  <div id="index">
    <el-container>
      <el-aside style="text-align: center;color: gray">
        <el-row>
          <el-col :span="24"  >
            <img class="headImg"  :src="user.imageUrl"/>
          </el-col>
          <el-col :span="24" style="font-size: 20px;">
            <span>{{user.username}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:30px; text-align: center;padding-left:30px">
          <el-col :span="6">
            <router-link to="/dynamic/markdown">动态发布</router-link>
          </el-col>
          <el-col :span="6">
            <router-link to="/dynamic/user">个人动态</router-link>
          </el-col>
          <el-col :span="6">
            获赞数:{{starCount}}
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import vueCookie from 'vue-cookies'

  export default {
    name: "index",
    data() {
      return {
        user: JSON.parse(sessionStorage.getItem("user")),
        starCount:0,
      }
    },
    methods:{
      getAllStar(){
        axios({
          url: '/api/dynamic/getAllStar',
          method: 'post',
          params: {
            access_token: vueCookie.get('access_token'),
            uid: this.user.id,
          },
        })
          .then((res) => {

            this.starCount = res.data;
          })
          .catch((err) => {
          })
      }
    },
    mounted() {
      this.getAllStar();
    }
  }
</script>

<style>



</style>
<style scoped>
  .el-aside {
    width: 10%;

  }
  .el-main {
    width: 90%;
    padding:0 0 0 0
  }
  .headImg{
    width:150px;
    height:150px;
    border-radius: 110px;
    margin-top:50px
  }
</style>
