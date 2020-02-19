<template>
  <div id="writeComments">
    <hr class="hr"/>
    <el-row id="usernameTxt">
      <el-col id="img"><img id="img2" src="../../../../blog/src/assets/comment/11111.gif" width="35" height="35">
      </el-col>
      <el-col id="username" :offset="1">
        <p class="p" v-if="user.username === ''|| user.username === null">
          <router-link to="/login" style="text-decoration: none;">please login</router-link>
        </p>
        <p class="p" v-else>
          {{user.username}}
        </p>
      </el-col>
    </el-row>
    <el-row>
      <div id="bendLine">
        <img src="../../assets/comment/border-t.png" width="900px">
      </div>
      <span>
        <img id="leftImg" src="../../assets/comment/border-l.png">
      </span>
      <textarea v-model="textarea" rows="5" placeholder="来说两句吧..."></textarea>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-button  type="success" @click="saveComment">评论</el-button>
      </el-col>

    </el-row>
    <el-row>
      <div id="commentHead">
        <div id="commentHeadLeft">
          <span>评论</span>
        </div>
        <div id="commentHeadRight">
          <span style="color:#5fbf5e;float:right">{{comments.length}}条评论</span>
        </div>
      </div>
      <div>
        <h4 style="color: #5fbf5e;float: left;">
          <img src="../../assets/comment/title-tag.png"/>
          最新评论
        </h4>
      </div>
      <div style="clear: left"></div>
      <div id="commentContent">
        <div class="comment" v-for="(comment,index) in comments">
          <el-row class="content">
            <el-col :span="3">
              <img class="userImg" :src="comment.user.imageUrl" width="80" height="80" alt="img"/>
            </el-col>
            <el-col :span="18">
              <el-row style="color: gray;">
                <el-col :span="6">{{comment.user.username}}</el-col>
                <el-col :span="18" style="float: right;">{{new Date(comment.date).toLocaleString()}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="22" :offset="1" style="font-size: 20px;margin:10px 10px 10px 10px">{{comment.content}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11" style="cursor: pointer;color:black">
                  <span style="float:right" v-if="comment.user.id === user.id" @click="deleteComment(index)">删除</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>

  </div>
</template>

<script>
  import vueCookie from 'vue-cookies'
  import axios from 'axios';

  export default {
    name: "publicComment",
    data() {
      return {
        blogId: '',
        textarea: '',
        imgPath: 'https://changyan.itc.cn/mdevp/extensions/cmt-list/061/images/ding.png',
        username: '',
        user: JSON.parse(sessionStorage.getItem("user")),
        comments: [],
        CommentArrayLenth: 0,
        flag: true,

      }
    },
    methods: {
      saveComment() {
        if (this.textarea !== '') {
          var comment = {
            content: this.textarea,
            user: {
              id: this.user.id
            },
            date: new Date(),
            dynamicId: this.dynamicId
          };
          //sorry,我不同意
          axios({
            url: '/api/dynamic/comment/save',
            method: 'post',
            data: comment,
            params: {
              access_token: vueCookie.get('access_token'),
            },
          })
            .then((msg) => {
              if (msg.data) {
                this.getAllComments();
                this.$message({
                  type: 'success',
                  message: '保存评论成功'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: '添加评论出错'
                })
              }

            })
            .catch((error) => {
              console.log(error);
              this.$message({
                type: 'warning',
                message: '添加评论出错' + error
              })
            })
        }
      },
      deleteComment(index) {
        var confirm = window.confirm("亲，确定要删除么？");
        if(confirm){
          var comment = {
            id: this.comments[index].id,
            user: {
              id: this.user.id
            },
            dynamicId: this.dynamicId
          };
          //sorry,我不同意
          axios({
            url: '/api/dynamic/comment/delete',
            method: 'post',
            data: comment,
            params: {
              access_token: vueCookie.get('access_token'),
            },
          })
            .then((msg) => {
              if (msg.data) {
                this.comments.splice(index, 1);
                this.$message({
                  type: 'success',
                  message: '删除评论成功'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: '删除评论出错'
                })
              }

            })
            .catch((error) => {
              console.log(error);
              this.$message({
                type: 'warning',
                message: '删除评论出错' + error
              })
            })
        }

      },
      getAllComments() {
        axios({
          url: '/api/dynamic/comment/getAll',
          method: 'post',
          params: {
            dynamicId: this.dynamicId,
            access_token: vueCookie.get('access_token'),
          },
        })
          .then((res) => {
            this.comments = res.data;
            console.log(this.comments);
          })
          .catch((error) => {
            console.log(error);
            this.$message({
              type: 'warning',
              message: '亲，加载评论出错' + error
            })
          })
      }
    },
    props: ['dynamicId'],
    mounted: function () {
      this.getAllComments();
    },
    watch: {
      blogId: function (newValue, oldValue) {
        this.blogId2 = newValue;
      }
    }

  }
</script>

<style scoped>
  #usernameTxt {
    margin-top: 10px
  }

  #img {
    padding-top: 10px;
    height: 40px;
    width: 40px;
    border-radius: 45px;
  }

  #img2 {
    border-radius: 15px;
    margin-top: 33px;
    margin-left: 3px;
  }

  #username {
    width: 100px;
    height: 70px;
    margin-left: 8px;
    padding-top: 10px;
  }

  .p {
    padding-top: 20px;
  }

  textarea {
    width: 900px;
    height: 86px;
    float: left;
    resize: none;
    border: 1px #5fbf5e solid;
    border-top: none;
    border-left: none;
    border-right: none;

    border-radius: 5px;
  }

  textarea:focus {
    outline: none;
  }

  .el-button {
    margin-top: 10px;
    float: right;

  }

  #bendLine img {
    margin: 10px 0px 0px 6px;
  }

  #leftImg {
    float: left;
    margin: -8px 0 0 0
  }

  #commentHead {
    width: 780px;
    height: 30px;
    /*border:1px #5fbf5e solid;*/
    margin-top: 20px;
  }

  #commentHeadLeft {
    float: left;
    width: 80px;
    border: 1px #5fbf5e solid;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: none;
  }

  #commentHeadRight {
    float: right;
    width: 700px;
    border-bottom: 1px #5fbf5e solid;
    margin-top: -20px;
  }

  #commentContent {
    border-bottom: 1px lightgray dashed;
  }

  .userImg {
    margin: 10px 10px 10px 10px
  }

  .content:hover {
    height: 100px;
    -webkit-transform: translate(0, -10px);
    -moz-transform: translate(0, -10px);
    -ms-transform: translate(0, -10px);
    -o-transform: translate(0, -10px);
    transform: translate(0, -10px);
  }


</style>
