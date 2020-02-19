<template>
  <div id="dynamicDetail">
    <el-main>

      <el-row id="htmlContent">
        <div v-html="dynamicItem.htmlContent"></div>
      </el-row>
      <el-row style="color:gray">
        <el-col :span="8" >
          <span style="cursor: pointer;" @click="vote(-1)" v-if="dynamicItem.isStar">
            <img src="../../assets/comment/star.png" width="24px" height="24px"/>
          </span>
          <span style="cursor: pointer;" @click="vote(1)" v-else>
            <img src="../../assets/comment/unstar.png" width="24px" height="24px"/>
          </span>
          {{dynamicItem.starCount}}
        </el-col>
        <el-col :span="8">时间:{{dynamicItem.date}}</el-col>
        <el-col :span="4" :offset="4">来源：{{dynamicItem.user.username}}</el-col>
      </el-row>
    </el-main>
    <PublicComment :dynamicId="id"/>
  </div>
</template>

<script>
  import axios from 'axios'
  import vueCookie from 'vue-cookies'
  import PublicComment from "./PublicComment";

  export default {
    name: "dynamicDetail",
    components: {PublicComment},
    data() {
      return {
        id: this.$route.query.id,
        dynamicItem: '',
        user: JSON.parse(sessionStorage.getItem("user")),

      }
    },
    methods: {
      getDynamicById() {
        axios({
          url: '/api/dynamic/getDynamicById',
          method: 'post',
          params: {
            access_token: vueCookie.get('access_token'),
            id: this.id,
          },
        })
          .then((res) => {
            this.dynamicItem = res.data;
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: '加载失败' + err
            })
          })
      },
      /**
       * 点赞获取取消点赞
       * @param num
       */
      vote(num){
        axios({
          url: '/api/dynamic/vote',
          method: 'post',
          params: {
            access_token: vueCookie.get('access_token'),
            did: this.id,
            uid: this.user.id,
            num: num
          },
        })
          .then((res) => {
            if(res.data){

              if(num > 0){
                this.dynamicItem.starCount++;
                this.dynamicItem.isStar = true;
                this.$message({
                  'type':'success',
                  'message':'点赞成功'
                });
              }else{
                this.dynamicItem.starCount--;
                this.dynamicItem.isStar = false;
                this.$message({
                  'type':'success',
                  'message':'取消成功'
                });
              }
            }else{
              this.$message({
                'type':'warning',
                'message':'点赞失败'
              })
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              'type':'warning',
              'message':'点赞失败'+err
            })
          })
      },

    },
    created() {
      this.getDynamicById();
    }
  }
</script>

<style>

  #htmlContent {
    background-color: ghostwhite;
    padding:10px 20px 10px 20px;

  }

  #htmlContent img {
    width: 100%;
    margin: auto;
  }
</style>
