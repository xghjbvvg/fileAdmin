<template>
  <div id="resetPwd">
    <el-row id="main">
      <el-row class="item">
        <el-col :span="24" style="text-align: center">
          <h2>密码重置</h2>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="3">
          <span class="demonstration">密码</span>
        </el-col>
        <el-col :span="18">
          <el-input type="password" v-model="password" placeholder="请输入密码"></el-input>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="3">
          <span class="demonstration">密码:</span>
        </el-col>
        <el-col :span="18">
          <el-input type="password" v-model="repassword" placeholder="请重新输入密码"></el-input>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="3">
          <span class="demonstration">邮箱:</span>
        </el-col>
        <el-col :span="18">
          <el-input v-model="email" placeholder="请输入邮箱"></el-input>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="3">
          <span class="demonstration">验证码:</span>
        </el-col>
        <el-col :span="18">
          <el-input type="text" v-model="numberCode" @blur="checkNumber" autocomplete="off"
                    style="width: 200px;float: left;">
          </el-input>
          &nbsp;
          <el-button>
            <span v-if="isSendCode" @click="sendCode()" style="padding: 0 0;">发送验证码</span>
            <span v-else><span class="second">{{second}}</span>秒重试</span>
          </el-button>
        </el-col>

      </el-row>
      <el-row style="text-align: center;margin-bottom: 50px">
        <el-col :span="12">
          <el-button @click="updatePwd" :disabled="!checkNum" type="primary">提交</el-button>
        </el-col>
        <el-col :span="12">
          <el-button @click="clear">清空</el-button>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import vueCookie from 'vue-cookies'
  export default {
    name: "resetPwd",
    data() {
      return {
        password: '',
        repassword: '',
        numberCode: '',
        second: 60,
        email: '',
        isSendCode: true,
        checkNum:false,
      }
    },
    methods: {
      updatePwd() {
        if(this.checkNum){
          this.$message("正在修改，请稍后！！！");
          axios({
            url:'/api/user/updatePassByEmail',
            method: 'get',///11138
            params:{
              email: this.email,
              password:this.password,
            }
          })
            .then((res)=>{
              if(res.data){
                this.$message({
                  type:'success',
                  message:'更新成功！！！！'
                });
                this.$router.push("/user/login")
              }else{
                this.$message({
                  type:'warning',
                  message:'更新失败！！！！'
                })
              }
            })
            .catch((error)=>{
              this.$message({
                type:'warning',
                message:'更新失败'+error+'！！！！'
              })
            })
        }else{
          this.$message({
            type:'warning',
            message:'验证码不正确！！！！'
          })
        }

      },
      clear() {
          this.email = '';
          this.password = '';
          this.repassword = '';
          this.numberCode = '';
      },
      checkNumber(){

        axios({
          url:'/api/email/isEquals',
          method: 'get',
          params: {
            toMail: this.email,
            code:this.numberCode,
          },
        })
          .then((res)=>{
            console.log(res.data);
            if(res.data){
              this.checkNum = true;
            }else{
              this.$message({
                type:'warning',
                message:'验证码不正确！！！！'
              })
            }
          })
          .catch((error)=>{
            this.$message({
              type:'warning',
              message:'发生异常！！！！'
            })
          })
      },
      // 发送验证码
      sendCode() {
        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        if (this.password.length === 0 || this.repassword.length === 0) {
          this.$message("密码不能为空");
          return;
        }
        if (this.password !==  this.repassword ) {
          this.$message("密码必须一致");
          return;
        }
        if (!reg.test(this.email)) { //正则验证不通过，格式不对
          this.$message("邮箱不正确");
          return;
        }

        this.isSendCode = !this.isSendCode;
        //60s时间计时
        var interval = window.setInterval(() => {
          this.second = this.second - 1;
          if (this.second === 0) {
            window.clearInterval(interval);
            this.isSendCode = !this.isSendCode;
            this.second = 60;
          }
        },1000);
        this.$message("正在发送验证码，请稍后！！！")
        axios({
          url:'/api/email/sendNumberByEmail',
          method: 'get',
          params: {
            toMail: this.email,
          },
        })
          .then((res)=>{
            if(res.data){
              this.$message({
                type:'success',
                message:'邮件已发送，请注意查收！！！！'
              })
            }else{
              this.$message({
                type:'warning',
                message:'邮件发送失败！！！！'
              })
            }
          })
          .catch((error)=>{
            this.$message({
              type:'warning',
              message:'邮件发送失败！！！！'
            })
          })

      }
    }

  }
</script>

<style scoped>
  #resetPwd {
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

  .second {
    color: red;
    font-size: 18px;
  }

  .item {
    padding: 15px;
  }
</style>
