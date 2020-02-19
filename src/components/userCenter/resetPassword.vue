<template>
  <div id="resetPassword">
    <el-row>
      <el-col :span="8">
        <el-row>
          <el-col :span="20" style="padding-top:75px">
            <img src="../../assets/img/email.jpg" width="150" height="150"/>
          </el-col>
          <el-col :span="20">
            邮箱改密
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="14" style="margin-top: 50px">
        <el-row>
          <el-col :span="20">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="新密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input type="email" v-model="ruleForm.email"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="numberCode">
                <el-input type="text" v-model="ruleForm.numberCode" @blur="isEquals" autocomplete="off"
                          style="width: 100px;float: left;">
                </el-input>
                <el-button v-if="isSendCode">
                  <span  @click="sendCodeByEmail('ruleForm')" style="padding: 0 0;">发送验证码</span>
                </el-button>
                <el-button v-if="!isSendCode">
                  <span><span class="second">{{second}}</span>秒重试</span>
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitFormByEmail('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <hr/>

  </div>

</template>

<script>
  import axios from 'axios'
  import vueCookie from 'vue-cookies'
    export default {
      name: "resetPassword",
      data() {
        var validateEmail = (rule, value, callback) => {
          if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value))) {
            callback(new Error('邮箱格式不正确!'));
          }else{
            axios({
              url:'/api/user/isExistEmail',
              method: 'get',
              params: {
                email: value,
              },
              header:{
                "content-type":"application/json;charset=utf-8"
              },
              withCredentials:true
            })
              .then((res)=>{
                console.log(res.data);
                if(res.data){
                  callback(new Error('邮箱没有被注册'));
                } else {
                  callback();
                }
              })
              .catch((error)=>{
                this.errorByStatus(error.response.status);
              })
          }
        };
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.ruleForm.checkPass !== '') {
              this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.pass) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        var validatePhone = (rule, value, callback) => {
          if(!(/^1[3456789]\d{9}$/.test(value))){
            callback(new Error('手机号码有误，请重填'));
          }
          if (value === '') {
            callback(new Error('请输入电话号码'));
          } else {
            callback();
          }
        };

        return {
          isSendCode: true,//是否发送验证码
          second:60,
          user:{},
          ruleForm: {
            pass: '',
            checkPass: '',
            email: '',
            numberCode:'',
            phone:''
          },
          rules: {
            pass: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validatePass2, trigger: 'blur' }
            ],
            email: [
              { validator: validateEmail, trigger: 'blur' }
            ]
          },
          validate:true
        };
      },
      methods: {
        //更新密码，请求后台接口

        updatePass(){
          axios({
            url:'/api/user/updatePass',
            method:'post',
            params:{
              access_token:vueCookie.get('access_token'),
              id:this.user.id,
              username:this.user.username,
              password:this.ruleForm.pass
            },
          }).then((res)=>{
            this.$message({
              message: '更新密码成功',
              type: 'success'
            })
            this.user.password = res.data;
            sessionStorage.setItem('user',JSON.stringify(this.user));
          }).catch(()=>{
            this.$message({
              message: '更新密码失败',
              type: 'error'
            })
          })
        },
        submitFormByEmail(formName) {
          this.$refs[formName].validate((valid) => {

            if (valid) {
              if (this.validate){
                this.updatePass();
              } else{
                this.$message({
                  message:'验证码不正确。。。',
                  warning:'warning'
                })
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        // 发送验证码
        sendCodeByEmail(formName) {
          this.$refs[formName].validate((valid) => {
            if(valid){
              this.isSendCode = !this.isSendCode;
          //60s时间计时
              var interval = window.setInterval( () =>{
                this.second  = this.second - 1;
                if(this.second === 0){
                  window.clearInterval(interval);
                  this.isSendCode = !this.isSendCode;
                  this.second  = 60;
                }
                console.log(this.second);
              },1000);
              this.$message({
                message:'邮件正在发送中。。。',
                type:'success'
              });

              axios({
                url:'/api/email/sendEmail',
                method:'post',
                params:{
                  access_token:vueCookie.get('access_token'),
                  toMail:this.ruleForm.email
                },
              }).then((res)=>{
                console.log(res);
                if(res.data){
                  this.$message({
                    message:'邮件已经发送，请耐心等一下。。。',
                    type:'success'
                  })
                }
              }).catch((err)=>{
                console.log(err);
                this.$message({
                  message:'亲，邮件发送失败，请稍后重试.....',
                  type:'warning'
                })
              })

            }else {
              this.$message({
                message: '校验失败',
                type: 'warning'
              });
            }

          });


        },
        //判断验证码是否与redis中数据是否一致
        isEquals(){
          axios({
            url:'/api/email/isEquals',
            method:'post',
            params:{
              access_token:vueCookie.get('access_token'),
              toMail:this.ruleForm.email,
              code:this.ruleForm.numberCode,
            },
          }).then((res)=>{
            // console.log(res);
            if(!res.data){
              this.validate = false;
              console.log(this.validate);
              this.$message({
                message:'亲，验证码错误。。。',
                type:'warning'
              })
            }
          }).catch((err)=>{
            console.log(err);
            this.$message({
              message:'亲，校验验证码失败，请稍后重试.....',
              type:'warning'
            })
          })
        }
      },
      mounted(){
        this.user = JSON.parse(sessionStorage.getItem('user'));
      }

    }
</script>

<style scoped>
  .second {
    color: red;
    font-size: 18px;
  }
</style>
