<template>
  <div id="head">
    <UserLoginExpire/>
    <el-row>
      <el-col :span="3" class="head">雪域世界</el-col>
      <el-col :span="12">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" >
          <el-menu-item index="1" >
            <router-link to="/index">
              首页
            </router-link>
          </el-menu-item>
          <el-menu-item index="2" >
            <router-link to="/friends">好友</router-link>
          </el-menu-item>
          <el-menu-item index="3" >
            <router-link to="/dynamic" > 动态圈</router-link>
          </el-menu-item>
          <el-menu-item index="4" >
            <router-link to="/more" > 更多</router-link>

            <!--<router-link to="/">动态圈</router-link>-->
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="1" >
        <img :src="imageUrl" width="50" height="50">
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
              <span @click="open">联系我</span>
            </el-dropdown-item>
            <el-dropdown-item class="clearfix">
              <span @click="logout">注销</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="消息" placement="top-start">
          <el-badge :value="unreadMsgCount" class="item">
            <router-link to="/friends"><i class="el-icon-bell"></i></router-link>
          </el-badge>
        </el-tooltip>

      </el-col>
      <el-col :span="1" style="padding-top:10px">
        <el-tooltip class="item" effect="light" content="意见反馈" placement="top-start">
          <router-link to="/question">
            <i class="el-icon-tickets"></i>
          </router-link>
        </el-tooltip>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  import vueCookie from 'vue-cookies'
  import defaultImg from '../../assets/img/userImg.gif';
  import UserLoginExpire from '../user/UserLoginExpire'
  import axios from 'axios'
    export default {
      name: "Header",
      components:{UserLoginExpire},
      data(){
          return{
            activeIndex:'1',
            username:vueCookie.get('username'),
            unreadMsgCount: 0,
            imageUrl:'',

          }
      },
      methods:{
        open(){
          this.$alert('QQ:3144933378<br/>' +
            '微信:18270671294<br/>' +
            '邮箱:HuangChiXin6@163.com<br/>' +
            'github：https://github.com/xghjbvvg/springcloud-file-admin<br/>',

            '联系方式', {
            dangerouslyUseHTMLString: true
          });
        },
        logout() {
          vueCookie.remove('username');
          vueCookie.remove('access_token');
          sessionStorage.removeItem("user");
          this.$router.push("/user/login");

        },
        changeIndex(val){
          sessionStorage.setItem('activeIndex',val);
        },

      },
      mounted(){
        this.imageUrl = defaultImg;
        axios({
          url:'/api/user/getUser',
          method:'post',
          params:{
            access_token:vueCookie.get('access_token'),
            username:this.username
          },
        })
          .then((res)=>{
            //console.log(res.data);
            this.$store.commit('setUserInfo',res.data);
            if(res.data.imageUrl === null){
              this.imageUrl = defaultImg;
            }else{
              this.imageUrl = res.data.imageUrl;
            }
            sessionStorage.setItem('user',JSON.stringify(res.data));
            axios({
              url:'/api/message/getUnreadMsgCount',
              method:'post',
              params:{
                access_token:vueCookie.get('access_token'),
                uid:res.data.id
              },
            })
              .then((res)=>{
                this.unreadMsgCount = res.data;
              })
              .catch((err)=>{

                this.$message({
                  message:"用户加载失败",
                  type:'warning'
                })
              })

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
