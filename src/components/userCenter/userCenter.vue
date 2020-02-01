<template>
  <div id="userCenter">
    <el-container>
      <el-header>
        <userLoginExpire/>
        <el-row>
          <el-col class="logo" :span="2">雪域</el-col>
          <el-col :span="10" class="settingText">&nbsp;<span style="font-size: 30px">|</span>账户设置</el-col>
          <el-col :offset="3" :span="1">
            <img class="headImg" :src="imageUrl" width="60" height="60">
          </el-col>
          <el-col :span="5" :offset="1" style="font-size: 15px;margin-top: 10px;">
            {{user.username}}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <router-link to="/feedback">意见反馈</router-link>
            &nbsp;&nbsp;
            <router-link to="/contactMe">联系我</router-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-menu class="el-menu-demo" mode="horizontal">
              <el-menu-item index="1">
                <router-link to="/userCenter">首页</router-link>
              </el-menu-item>
              <el-menu-item index="2">
                <router-link to="/userCenter/passwordProtect">密码保护</router-link>
              </el-menu-item>
              <el-menu-item index="3">
                <router-link to="/userCenter/resetPassword">密码修改</router-link>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>

      </el-header>
      <el-container>
        <el-aside>
          <el-row style="height:160px;padding: 25px auto;">
            <el-col :span="12">
              <img class="headImg2" :src="imageUrl" width="150" height="150">
            </el-col>
            <el-col :span="12" style="padding-top: 50px;">
              <el-row>
                <el-col :span="20">
                  <span style="color: lightseagreen;font-size: 30px">{{username}}</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="quickWay">
            <span>快速通道</span>
          </el-row>
          <el-row class="common">
            <el-col :span="6" :offset="4">
              <i class="el-icon-phone-outline"></i>手机：
            </el-col>
            <el-col :span="12">
              {{user.phone}}
            </el-col>
          </el-row>
          <el-row class="common">
            <el-col :span="6" :offset="4">
              <i class="el-icon-message"></i>邮箱：
            </el-col>
            <el-col :span="12">
              {{user.email}}
            </el-col>
          </el-row>
          <el-row class="common">
            <el-col :span="8" :offset="4">
              <i class="el-icon-document"></i> 账户申诉
            </el-col>
          </el-row>
          <el-row class="common">
            <el-col :span="8" :offset="4" style="cursor: pointer">
              <i class="el-icon-refresh"></i><span @click="logout">账户注销</span>
            </el-col>
          </el-row>
          <el-row class="common" @click="deleteUser">
            <el-col :span="8" :offset="4" style="cursor: pointer">
              <i class="el-icon-refresh"></i><span @click="deleteUser">账户销毁</span>
            </el-col>
          </el-row>

        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import vueCookie from 'vue-cookies'
  import axios from 'axios'
  import userLoginExpire from '../user/UserLoginExpire'

  export default {
    name: "userCenter",
    components: {
      userLoginExpire
    },
    data() {
      return {
        username: vueCookie.get('username'),
        user: {},
        imageUrl: '',
        phone: '',
        email: '',
        destroyText: '销毁中。。。。',
        destroySuccess: false
      }
    },
    methods: {
      handlePhone() {
        var phone = this.user.phone;
        var s = phone.substring(0, 2);
        var s1 = phone.substring(9, 11);
        this.user.phone = s + "******" + s1
      },
      handleEmail() {
        var email = this.user.email;
        var split = email.split("@");
        var s = split[0].substring(0, 2);
        var s1 = split[0].substring(split[0].length - 2, split[0].length);
        this.user.email = s + "****" + s1 + '@' + split[1];
      },
      logout() {
        // alert(6);
        vueCookie.remove('username');
        vueCookie.remove('access_token');
        this.$router.push("/user/login");
      },
      deleteUser() {
        var confirm = window.confirm("亲，你确定要注销么？");
        if (confirm) {
          const loading = this.$loading({
            lock: true,
            text: this.destroyText,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          var interval = setInterval(() => {
            if (this.destroySuccess) {
              loading.close();
              this.$message({
                message: '亲，销毁成功，欢迎再次见到你。。。。。',
                type: 'success'
              });
              vueCookie.remove('username');
              vueCookie.remove('access_token');
              this.$router.push("/user/login");
              clearInterval(interval);
            }
          }, 1000);
          axios({
            url: '/api/user/deleteUser',
            method: 'post',
            params: {
              access_token: vueCookie.get('access_token'),
              id: this.user.id,
              username: this.user.username
            },
            header: {
              "content-type": "application/json;charset=utf-8"
            }
          })
            .then(() => {
              axios({
                url: '/api/oauth/token',
                method: 'delete',
                params: {
                  access_token: vueCookie.get('access_token'),
                  username: this.user.username,
                  password: this.user.pass,
                  grant_type: "password",
                  scope: "select",
                  client_id: "client_2",
                  client_secret: "123456"
                },
                header: {
                  "content-type": "application/json;charset=utf-8"
                }
              })
                .then(() => {
                  this.destroySuccess = true;
                })
                .catch(() => {
                  this.$message({
                    message: '亲，销毁用户失败。。。。。',
                    type: 'warning'
                  })
                })
            })
            .catch(() => {
              this.$message({
                message: '亲，销毁用户失败。。。。。',
                type: 'warning'
              })
            })
        }

      }
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      console.log(this.user);
      this.handlePhone();
      this.handleEmail();
      // this.user = JSON.parse(sessionStorage.getItem('user'));
      if (this.user.imageUrl === null) {
        this.imageUrl = 'http://localhost:8763/static/head/img51.gif';
      } else {
        this.imageUrl = this.user.imageUrl;
      }

      /* axios({
         url:'/api/user/getUser',
         method:'post',
         params:{
           access_token:vueCookie.get('access_token'),
           username:this.username
         },
       })
         .then((res)=>{

           this.$store.commit('setUserInfo',res.data);
           this.user = this.$store.state.userInfo;
           this.handlePhone();
           this.handleEmail();
           this.imageUrl = null?'http://localhost:8763/static/head/img51.gif':this.user.imageUrl
           console.log(this.user);
         })
         .catch((err)=>{
           console.log(err);
           this.$message({
             message:"用户加载失败",
             type:'warning'
           })
         })*/


    }
  }
</script>

<style scoped>
  #userCenter {
    transform: matrix(1, 0, 0, 1, 0, 0);
    transition: all 500ms linear 0s;
    width: 1100px;
    height: 700px;
    position: relative;
    margin: auto auto;
    /*background:red;*/
  }

  .el-menu-demo li {
    margin: 0 0;
  }

  .el-header {
    width: 100%;
    height: 150px !important;
    padding-top: 10px;
    /*padding: 5px 30px;*/
    font: 23px/1.5 Tahoma, Helvetica, Arial, '宋体', sans-serif;
  }

  .el-aside {
    color: #333;
    text-align: center;
    width: 300px !important;
    height: 500px;
    margin-left: 20px;
    background-color: #f8fdfd;
  }

  .el-main {
    color: #333;
    text-align: center;
    height: 800px;
    width: 500px !important;
  }

  .logo {
    text-transform: uppercase;
    /*margin: 10px 10px;*/
    font: 12px/1 Tahoma, Helvetica, Arial, "\5b8b\4f53", sans-serif;
    transform: translate3d(0, 0, 0);
    font-size: 40px;
  }

  .settingText {
    font-size: 20px;
    padding-top: 5px;
    color: lightskyblue;
  }

  .el-menu {
    background: lightskyblue;
    /*padding-top: 10px;*/
  }

  .el-menu li {
    font-size: 20px;
    color: #c0734e;
  }

  .feedback {
    font-size: 15px;
  }

  .quickWay {
    width: 100%;
    height: 30px;
    background-color: #c8e5f7;
  }

  .common {
    padding-top: 10px;
    height: 50px;
  }

  .common:hover {
    background-color: lightgoldenrodyellow;
  }

  .headImg {
    border-radius: 50px;
  }

  .headImg2 {
    border-radius: 75px;
  }


</style>
