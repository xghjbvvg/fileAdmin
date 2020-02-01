<template>
  <div id="friendReq">

      <el-row v-for="o in info " style="background-color: snow">
        <el-col :span="3">
          <img :src="o.image_url == null ? imageUrl:o.image_url" width="100px" height="100px" >
        </el-col>
        <div class="text">
          <el-col :span="8" >
            <el-row v-text="o.username" class="username"></el-row>
            <el-row v-text="o.message"></el-row>
          </el-col>

          <el-col :span="7">

            <div v-if="o.flag === 2">
              <el-button round @click="agree(o.id,o.code)">同意</el-button>
              <el-button round @click="disAgree(o.id)">拒绝</el-button>
              <el-button round @click="remove(o.id)">删除</el-button>
            </div>

          </el-col>
        </div>

      </el-row>

  </div>
</template>

<script>
  import axios from 'axios'
  import VueCookie from 'vue-cookies';

  export default {
    name: "friendRequest",
    data(){
      return{
        info: [],
        user: JSON.parse(sessionStorage.getItem("user")),
        imageUrl:require ('../../assets/img/userImg.gif')
      }
    },
    methods:{
      agree(mid,code){
        axios({
          url: "/api/friends/agree",
          method: "get",
          params: {
            access_token: VueCookie.get("access_token"),
            uid:this.user.id,
            code:code,
            mid:mid
          }
        }).then(msg => {

            this.$message({
              type:'success',
              message:'添加成功'
            });
            this.getRequestOfFriend();

        })
          .catch(error => {
            this.$message({
              type:'warn',
              message:'删除失败'
            })
          });
      },
      remove(mid){
        axios({
          url: "/api/friends/remove",
          method: "get",
          params: {
            access_token: VueCookie.get("access_token"),
            mid:mid
          }
        }).then(msg => {
          if(msg.data === 1){
            this.$message({
              type:'success',
              message:'删除成功,同步需要刷新页面'
            });
            this.getRequestOfFriend();
          }else{
            this.$message({
              type:'warn',
              message:'删除失败'
            })
          }
        })
          .catch(error => {
            this.$message({
              type:'warn',
              message:'删除失败'
            })
          });
      },
      disAgree(mid){
        axios({
          url: "/api/friends/disagree",
          method: "get",
          params: {
            access_token: VueCookie.get("access_token"),
            mid:mid
          }
        }).then(msg => {
          console.log(msg.data);
          if(msg.data === 1){
            this.$message({
              type:'success',
              message:'拒绝成功'
            });
            this.getRequestOfFriend();
          }else{
            this.$message({
              type:'warn',
              message:'拒绝失败'
            })
          }
        })
          .catch(error => {
            this.$message({
              type:'warn',
              message:'拒绝失败'
            })
          });

      },

      getRequestOfFriend(){
        axios({
          url: "/api/friends/getRequestOfFriend",
          method: "get",
          params: {
            access_token: VueCookie.get("access_token"),
            uid:this.user.id
          }
        }).then(msg => {
          this.info = msg.data;
          console.log(msg.data);
        })
          .catch(error => {
              this.$message({
                type:'warn',
                message:'好友请求加载失败'
              });
          });
      }
    },
    mounted(){
      this.getRequestOfFriend();
    }


  }
</script>

<style scoped>
.text{
  padding-top: 30px;
}
  .username{
    color:lightskyblue;
  }
</style>
