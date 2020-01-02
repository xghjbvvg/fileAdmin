<template>
  <el-container>
    <el-aside >
        <template >
          <el-tabs type="border-card">
            <el-tab-pane name="first">
              <span class="head" slot="label">
                <i class="el-icon-message"></i>会话
              </span>
              <div>
                <el-row >
                  <el-col :span="6">
                    <img
                      src="https://pan.baidu.com/sns/yun-static/disk-conversation/widget/sectionLists/img/service-icon_9096d0f.png"
                      width="60px" height="60px"/>
                  </el-col>
                  <el-col :span="7">
                    <router-link to="/friends/chat">新好友</router-link>
                  </el-col>
                  <el-col :span="10">
                    <span>02-24 18:28</span>
                  </el-col>
                </el-row>


              </div>
            </el-tab-pane>
            <el-tab-pane name="second">
              <span class="head" slot="label">
                <i class=" el-icon-mobile-phone"></i> 好友

              </span>
              <div class="friendsList">
                <el-row   v-for="friend in friends">
                  <el-col :span="7">
                    <!--https://pan.baidu.com/sns/yun-static/disk-conversation/widget/sectionLists/img/service-icon_9096d0f.png-->
                    <img
                      :src="friend.imagePath === null||friend.imagePath.length === 0 ?defaultImg:friend.imagePath"
                      width="60px" height="60px"/>
                  </el-col>
                  <el-col :span="7">

                    <router-link :to="{name:'detail',query:{'friendId':friend.code}}" :friendId="friend.code">{{friend.name}}</router-link>
                    <!--<router-link :to="{name:'chat',query:{'friendId':friend.code}}" :friendId="friend.code">{{friend.name}}</router-link>-->
                  </el-col>

                </el-row>
              </div>

            </el-tab-pane>
            <el-footer>
              <el-row class="footer">
                <el-col :span="10">
                  <el-button type="text" @click="addFriendsOrGroup">创建群组</el-button>

                </el-col>
                <el-col :span="12">
                  <el-button type="text" @click="addFriendsOrGroup">添加好友/群组</el-button>
                </el-col>

              </el-row>
            </el-footer>
          </el-tabs>

        </template>
    </el-aside>
    <el-main>
       <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
  import VueCookie from 'vue-cookies';
  import defaultImg from '../../assets/img/userImg.gif';
  import axios from 'axios'

  export default {
    data() {
      return {
        flag:true,
        defaultImg:defaultImg,
        activeName:'first',
        websock: null,
        access_token : VueCookie.get("access_token"),
        user: JSON.parse(sessionStorage.getItem("user")),
        friends:[],
      }
    },

    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      addFriendsOrGroup() {
        this.$prompt('请输入手机号/群组号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]*$/,
          inputErrorMessage: '格式不正确'
        }).then(({ value }) => {
          axios({
            url:'/api/friends/insertFriend',
            method:'post',
            params:{
              access_token:this.access_token,
              uid:this.user.id,
              code: value
            },
          })
            .then((res)=>{
              if (res.data === 0){
                this.$message({
                  type: 'warn',
                  message: '添加失败'
                });
              } else{
                this.$message({
                  type: 'success',
                  message: '添加成功'
                });
              }

              //sessionStorage.setItem('user',JSON.stringify(res.data));
            })
            .catch((err)=>{

              this.$message({
                message:"添加失败",
                type:'warning'
              })
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      getAllFriendsAndGroup(){
        axios({
          url: "/api/friends/getAllFriendsAndGroup",
          method: "get",
          params: {
            access_token: VueCookie.get("access_token"),
            uid:this.user.id
          }
        }).then(msg => {
            this.friends = msg.data;
            console.log(this.friends);
        })
          .catch(error => {
            console.log(error);
          });
      }
    },
    mounted(){
      this.getAllFriendsAndGroup();
    }
  }
</script>
<style scoped>
  .el-aside{
    width:330px;
    margin-left: 30px;
    margin-top:19px
  }
  .friendsList{
    font-size: 20px;
  }
  .head{
    font-size: 17px;
  }
  .el-tabs__content {
    overflow: hidden;
    position: absolute;
  }
  .el-row{
    width: 320px;
  }
  .footer{
    color: deepskyblue;
    margin-top:10px;
    cursor:pointer;
  }

</style>
<style>
  .el-tabs__nav .is-top{
    width: 150px;
  }
</style>
