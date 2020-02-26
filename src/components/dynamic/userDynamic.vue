<template>
  <div id="userDynamic">
    <el-row style="text-align: center" v-if="dynamics.length === 0">
      <img src="../../assets/img/enpty.png"/>
    </el-row>
    <el-container v-else class="content" v-for="(item,index) in dynamics">
      <el-row v-if="item.firstImage.length !== 0">
        <el-col :span="16">
          <img style="align-items: center" :src="item.firstImage" width="320px" height="250px"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
            <span style="font-size: 15px;color:grey">
              <router-link :to="{name:'dynamicDetail',query:{'id':item.id}}">{{item.content}}</router-link>
            </span>
        </el-col>
      </el-row>
      <el-row style="font-size: 15px;color:grey;margin-top:10px;">
          <el-col :span="6">
            <span>{{item.date}}</span>
          </el-col>
          <el-col :span="6">
            来源：
            <span style="color:#141414">
              {{item.user.username}}
            </span>
          </el-col>
          <el-col :span="6">
            <span @click="deleteDynamic(item.id,index)" style="cursor: pointer">删除</span>
          </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import vueCookie from 'vue-cookies'

  export default {
    name: "userDynamic",
    data() {
      return {
        user: JSON.parse(sessionStorage.getItem("user")),
        dynamics: [],
      }
    },
    methods: {
      deleteDynamic(id, index) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            url: '/api/dynamic/deleteDynamic',
            method: 'post',
            params: {
              access_token: vueCookie.get('access_token'),
              id: id,
            },
          })
            .then((res) => {
              if (res.data) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.dynamics.splice(index, 1);
              } else {
                this.$message({
                  type: 'warning',
                  message: '删除失败'
                })
              }
            })
            .catch((err) => {
              this.$message({
                type: 'warning',
                message: '删除失败' + err
              })
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      }
    },
    mounted() {
      axios({
        url: '/api/dynamic/getUserDynamic',
        method: 'post',
        params: {
          access_token: vueCookie.get('access_token'),
          uid: this.user.id,
        },
      })
        .then((res) => {
          this.dynamics = res.data;
        })
        .catch((err) => {
        })
    }
  }
</script>

<style scoped>
  #userDynamic {
    /*width:1200px;
    height: 100%;*/
  }

  a {
    color: grey;
  }

  a:hover {
    color: black;
  }

  .content {
    padding: auto auto;
    padding-right: 10px;
    width:90%;
    margin: 10px 15px 15px 10px;
    display: inline-block;
  }

  .content:hover {
    cursor: pointer;
    -webkit-transform: translate(0, -10px);
    -moz-transform: translate(0, -10px);
    -ms-transform: translate(0, -10px);
    -o-transform: translate(0, -10px);
    transform: translate(0, -10px);
  }
</style>
