<template>
  <div id="head">
    <UserLoginExpire/>
    <el-row>
      <el-col :span="3" class="head">雪域世界</el-col>
      <el-col :span="12">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" >
          <el-menu-item index="1">
            <router-link to="/">首页</router-link>
          </el-menu-item>
          <el-menu-item index="2">
            <router-link to="/friends">好友</router-link>
          </el-menu-item>
          <el-menu-item index="3">
            动态圈
            <!--<router-link to="/">动态圈</router-link>-->
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="1" >
        <img src="../../assets/img/userImg.gif" width="50" height="50">
      </el-col>
      <el-col :span="3" >
        <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          {{username}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix first">
              <img src="../../assets/img/userImg.gif" width="50" height="50">
              <span style="color: #f0c78a;font-size: 25px">
                {{username}}
              </span>
            </el-dropdown-item>
            <el-dropdown-item class="clearfix">
              <router-link to="/userCenter">个人资料</router-link>
            </el-dropdown-item>
            <el-dropdown-item class="clearfix">
              个人帮助
            </el-dropdown-item>
            <el-dropdown-item class="clearfix">
              注销
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="消息" placement="top-start">
          <el-badge :value="12" class="item">
            <i class="el-icon-bell"></i>
          </el-badge>
        </el-tooltip>

      </el-col>
      <el-col :span="1">
        <el-tooltip class="item" effect="light" content="意见反馈" placement="top-start">
          <i class="el-icon-tickets"></i>
        </el-tooltip>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  import VueCookie from 'vue-cookies'
  import UserLoginExpire from '../user/UserLoginExpire'
  import axios from 'axios'
    export default {
      name: "Header",
      components:{UserLoginExpire},
      data(){
          return{
            activeIndex:"1",
            username:VueCookie.get('username'),
            // flag:true,
          }
      },
      mounted(){
        axios({
          url:'/api/user/getUser',
          method:'post',
          params:{
            access_token:VueCookie.get('access_token'),
            username:this.username
          },
        })
          .then((res)=>{
            this.$store.commit('setUserInfo',res.data);
            sessionStorage.setItem('user',JSON.stringify(res.data));
          })
          .catch((err)=>{
            console.log(err);
            this.$message({
              message:"用户加载失败",
              type:'warning'
            })
          })
      }
    }
</script>

<style scoped>
  #head{
    height:100%;
    width:100%;
  }
  .el-container{
    width: 1200px;
    height: 200px
  }
  .el-main li{
    font-size:25px;
  }
  .head{
    /*color:grey;*/
    text-transform: uppercase;
    margin: 10px 10px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    transform: translate3d(0, 0, 0);
    font-size: 30px;
  }
  .el-menu-item{
    font-size: 18px;
  }
  img{
    border-radius: 25px;
    border: grey 1px solid;
    margin-top: 3px;
    /*margin-top: 8px;*/
  }
  .el-dropdown-link{
    color: lightblue;
    margin-left: 10px;

  }
  .el-col-3{
    height: 60px;
    text-align: left;
    padding-top: 10px;
  }
  .el-dropdown-menu{
    background-color: rgba(255, 255, 255, 0.8);
    width: 200px;
    height: 250px;
  }
  .el-dropdown-menu{
    padding: 0 0;
  }
  .first{
    height:75px;
    /*background: lightskyblue;*/
    padding-top: 25px;
    padding-left: 18px;
   }
  .el-tooltip{
    margin-top: 15px;
  }



</style>
