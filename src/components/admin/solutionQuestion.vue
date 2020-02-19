<template>
    <div id="solutionQuestion">
        <el-row class="item" v-for="item in questionList">
          <el-row>
            <el-col :span="4">
              <span style="font-weight: bolder;font-size: 30px">{{item.title}}</span>
            </el-col>
            <el-col :span="8" :offset="12">
              <span >{{item.date}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              {{item.content}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" :offset="20">
              <span style="cursor: pointer;color: lightskyblue">
                <router-link :to="{name:'reply',query:{'email':item.fromEmail,'id':item.id}}">
                  <span v-if="item.flag === 1">
                    回复
                  </span>
                  <span v-else style="color: forestgreen;">
                    已回复
                  </span>
                </router-link>
              </span>
            </el-col>
          </el-row>
        </el-row>
    </div>
</template>

<script>
  import  axios from 'axios'
  import vueCookie from 'vue-cookies'

    export default {
      name: "solutionQuestion",
      data(){
        return{
          questionList:[],
          flag:this.$route.query.flag,
        }
      },
      watch:{
        $route() {
          this.flag= this.$route.query.flag; //获取传来的参数
          this.getQuestions(this.flag)
        }
      },

      methods:{

        getQuestions(flag){
          axios({
            url: '/api/admin/getQuestions',
            method: 'post',
            params: {
              access_token: vueCookie.get('access_token'),
              flag:this.flag
            },
          }).then((res)=>{
            this.questionList = res.data;
            console.log(this.questionList);
          }).catch((err)=>{
            console.log(err);
            this.$message({
              type:'warning',
              message:'加载错误'+err
            })
          })
        }
      },
      mounted(){
        this.getQuestions(this.flag);
      }
    }
</script>

<style scoped>
.item{
  background-color: snow;
  padding:10px 20px
}
.item:hover{
  -webkit-transform: translate(0, -10px);
  -moz-transform: translate(0, -10px);
  -ms-transform: translate(0, -10px);
  -o-transform: translate(0, -10px);
  transform: translate(0, -10px);
}
</style>
