<template>
  <div id="reply">
    <el-row id="main">
      <el-row class="item">
        <el-col :span="24" style="text-align: center">
          <h2>用户问题反馈解决</h2>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="2">
          <span class="demonstration">邮箱:</span>
        </el-col>
        <el-col :span="18">
          <el-input v-model="email" placeholder="请输入邮箱"  :disabled="true"></el-input>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="2">
          <span class="demonstration">标题:</span>
        </el-col>
        <el-col :span="18">
          <el-input
            placeholder="请输入标题"
            v-model="title"
            maxlength="50"
            show-word-limit
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="2">
          <span class="demonstration">内容:</span>
        </el-col>
        <el-col :span="18">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="textarea"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row style="text-align: center;margin-bottom: 50px">
        <el-col :span="12">
          <el-button @click="save" type="primary">提交</el-button>
        </el-col>
        <el-col :span="12">
          <el-button @click="clear">清空</el-button>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
  import  axios from 'axios'
  import vueCookie from 'vue-cookies'
  import router from '../../router'
    export default {
      name: "reply",
      data(){
        return{
          email:this.$route.query.email,
          id:this.$route.query.id,
          title:'',
          textarea:''
        }
      },
      methods: {
        clear() {
          this.textarea = '';
          this.title = '';
        },
        save() {
          var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
          if (!reg.test(this.email)) { //正则验证不通过，格式不对
            this.$message("邮箱不正确");
            return;
          }
          if(this.textarea.length === 0){
            this.$message("内容不能为空");
            return;
          }
          let question = {
            content:this.textarea,
            title:this.title,
            fromEmail:this.email,
            flag:1
          };
          this.$message("正在发送中。。。。。");
          axios({
            url: '/api/email/sendReplyToUser',
            method: 'post',
            data:question,
            params: {
              access_token: vueCookie.get('access_token'),
            },
          }).then((res)=>{
            if(res.data){
              this.$message({
                type:'success',
                message:'发送成功'
              });

              axios({
                url: '/api/admin/updateQuestion',
                method: 'post',
                data:{
                 id:this.id,
                 fromEmail:this.email
                },
                params: {
                  access_token: vueCookie.get('access_token'),
                },
              }).then((res)=>{
                router.push('/admin/index');
              }).catch((err)=>{

              })

            }else{
              this.$message({
                type:'warning',
                message:'发送错误'
              })
            }
          }).catch((err)=>{
            console.log(err)
            this.$message({
              type:'warning',
              message:'发送错误'+err+"!请重试"
            })
          })


        }
      },
      mounted(){

      }
    }
</script>

<style>
  .el-input__inner,.el-textarea__inner{
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
<style scoped>
  #reply {
    margin-top: -50px;
    width: 100%;
    height: 700px;
    background-size: cover;
    position: relative;
    background-image: url("../../assets/img/more/poppy-seed-1080x720.jpg");
  }

  #main {
    box-shadow: 0 3px 11px 2px rgba(0, 0, 0, .1);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    margin: 50px auto;
    top: 10%;
    color: #323232;
    width: 50%;
    height: 65%;
  }

  .item {
    padding: 15px;
  }
</style>
