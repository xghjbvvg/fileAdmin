<template>
  <div id="detailInfo" v-show="flag">
    <el-row>
      <img :src="friendDetail.friend.imageUrl === null ?defaultImg:friendDetail.friend.imageUrl" width="150px" height="150px">
    </el-row>
    <el-row>
      <el-col :span="2" :offset="8">
        账号名:
      </el-col>
      <el-col :span="2">
        {{friendDetail.friend.username}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2" :offset="8">
        备注名:
      </el-col>
      <el-col :span="2" >
        {{friendDetail.remark}}
      </el-col>
      <el-col :span="2" >
        <i class="el-icon-edit" @click="updateRemark"></i>
      </el-col>


    </el-row>
    <el-row>
      <el-col :span="2" :offset="8">
        添加时间:
      </el-col>
      <el-col :span="5" >
        {{friendDetail.date}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" :offset="8">
        <router-link :to="{name:'chat',query:{'friendId':friendDetail.friend.id}}" :friendId="friendDetail.friend.id">
          <el-button size="small" round>发送消息</el-button>
        </router-link>
      </el-col>
      <el-col :span="2" >
        <el-button size="small" round @click="deleteFriend"> 删除好友</el-button>
      </el-col>
      <el-col :span="3" >
        <el-button size="small" round @click="report">举报</el-button>

      </el-col>
    </el-row>
    <el-row>

    </el-row>
  </div>
</template>

<script>
  import VueCookie from 'vue-cookies';
  import defaultImg from '../../assets/img/userImg.gif';
  import axios from 'axios'
  export default {
    name: "detailInfo",
    data() {
      return {
        friendId: this.$route.query.friendId,
        friendDetail:{},
        defaultImg:defaultImg,
        flag:true
      }
    },
    methods: {
      getDetail(){
        axios({
          url:'/api/friends/getFriendDetail',
          method:'post',
          params:{
            access_token:VueCookie.get('access_token'),
            friendId:this.friendId
          },
        })
          .then((res)=>{
            this.friendDetail = res.data;

          })
          .catch((err)=>{
            console.log(err);
            this.$message({
              message:"好友信息加载失败",
              type:'warning'
            })
          })
      },
      updateRemark(){
        this.$prompt('请输入备注名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          axios({
            url:'/api/friends/updateRemark',
            method:'post',
            params:{
              access_token:VueCookie.get('access_token'),
              uid: JSON.parse(sessionStorage.getItem("user")).id,
              friendId:this.friendId,
              remark:value
            },
          })
            .then((res)=>{
              if(res.data){
                this.$message({
                  message:"更新成功",
                  type:'success'
                });
                this.friendDetail.remark = value;
              }else{
                this.$message({
                  message:"更新失败",
                  type:'warning'
                })
              }

            })
            .catch((err)=>{
              this.$message({
                message:"更新失败,"+err,
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
      deleteFriend(){
        this.$confirm('此操作将永久好友, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            url:'/api/friends/deleteFriend',
            method:'post',
            params:{
              access_token:VueCookie.get('access_token'),
              uid: JSON.parse(sessionStorage.getItem("user")).id,
              friendId:this.friendId
            },
          })
            .then((res)=>{
              if(res.data){
                this.$message({
                  message:"删除成功",
                  type:'success'
                });
                this.flag = false;
              }else{
                this.$message({
                  message:"删除失败",
                  type:'warning'
                })
              }

            })
            .catch((err)=>{
              this.$message({
                message:"删除失败,"+err,
                type:'warning'
              })
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      report(){

      }
    },
    mounted(){
      this.getDetail();
    }
  }
</script>

<style scoped>
  #detailInfo {
    text-align: center;
    font-size: 18px;
    color: grey;

  }

  .el-row {
    margin-top: 8px;
    margin-bottom: 8px;
  }
</style>
