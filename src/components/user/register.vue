<template>
    <div id="register">
      <el-container>
        <el-form :model="register" status-icon :rules="registerRule" ref="register"
                 label-width="110px" class="demo-ruleForm">
          <el-form-item style="margin: 0">
            <p class="registerHead">注册</p>
          </el-form-item>

          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="register.username" autocomplete="off" style="float: left;"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="register.password" autocomplete="off" style="float: left;"></el-input>
          </el-form-item>
          <el-form-item label="确定密码" prop="rePassword">
            <el-input type="password" v-model="register.rePassword" autocomplete="off" style="float: left;"></el-input>
          </el-form-item>

          <el-form-item label="电话" prop="phone">
            <el-input type="text" v-model="register.phone" autocomplete="off" style="float: left;"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="register.email" autocomplete="off" style="float: left;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       @click="submitForm('register')">提交</el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button  @click="resetForm('register')">重置</el-button>
          </el-form-item>

        </el-form>
      </el-container>
    </div>
</template>

<script>
  import axios from 'axios';
  import VueCookie from 'vue-cookies'
  import router from "../../router";

  import qs from 'qs';
    export default {
        name: "register",

        data(){
          var validateUsername = (rule, value, callback) => {
            var flag = true;
            axios({
              url:'/api/user/isExistUsername',
              method: 'get',
              params: {
                username: value,
              },
              header:{
                "content-type":"application/json;charset=utf-8"
              },
              withCredentials:true
            })
              .then((res)=>{
                console.log(res.data);
                flag = res.data;
                if(!flag){
                  callback(new Error('用户名已经被注册'));
                }
                if (value === '') {
                  callback(new Error('请再次输入用户名'));
                } else {
                  callback();
                }
              })
              .catch((error)=>{
                /*console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);*/
                this.errorByStatus(error.response.status);
              })


          };
          var validatePass = (rule, value, callback) => {

            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              callback();
            }
          };
          var validateRePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.register.password) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          };
          var validatePhone = (rule, value, callback) => {
            var flag = true;
            axios({
              url:'/api/user/isExistPhone',
              method: 'get',
              params: {
                phone: value,
              },
              header:{
                "content-type":"application/json;charset=utf-8"
              },
              withCredentials:true
            })
              .then((res)=>{
                flag = res.data;
                console.log(res.data);
                if(!flag){
                  // alert(flag);
                  callback(new Error('电话已经被注册'));
                }
                if(!(/^1[3456789]\d{9}$/.test(value))){
                  callback(new Error('手机号码有误，请重填'));
                }
                if (value === '') {
                  callback(new Error('请输入电话号码'));
                } else {
                  callback();
                }
              })
              .catch((error)=>{
                this.errorByStatus(error.response.status);
              })


          };
          var validateEmail = (rule, value, callback) => {
            var flag = true;
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
                flag = res.data;
                console.log(res.data);
                if(!flag){
                  // alert(flag);
                  callback(new Error('邮箱已经被注册'));
                }
                if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value))) {
                  callback(new Error('邮箱格式不正确!'));
                }
                if (value === '') {
                  callback(new Error('请输入邮箱'));
                } else {
                  callback();
                }
              })
              .catch((error)=>{
                this.errorByStatus(error.response.status);
              })



          };
          return{
            isSendCode: true,//是否发送验证码
            second: 60,
            register:{
              username:'',
              password:'',
              rePassword:'',
              email:'',
              phone:'',
            },
            registerRule:{
              username:[
                {validator: validateUsername, trigger: 'blur'}
              ],
              password:[
                {validator: validatePass, trigger: 'blur'}
              ],
              rePassword:[
                {validator: validateRePass, trigger: 'blur'}
              ],
              phone:[
                {validator: validatePhone, trigger: 'blur'}
              ],
              email:[
                {validator: validateEmail, trigger: 'blur'}
              ]
            },
            fullscreenLoading:false,
            loadingText:'注册中....',
            registerSuccess:false
          }
        },
        methods:{
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
               //注册中....
                const loading = this.$loading({
                  lock: true,
                  text: this.loadingText,
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                //注册完成关闭
                var interval = setInterval(() => {
                  if(this.registerSuccess){
                    loading.close();
                    this.$message({
                      message: '注册成功。。。。',
                      type: 'success'
                    });
                    clearInterval(interval);
                  }
                }, 1000);
                //注册请求后台接口
                axios({
                  url:'/api/user/register',
                  method: 'get',
                  params: {
                    username: this.register.username,
                    password: this.register.password,
                    phone:this.register.phone,
                    email:this.register.email,
                  },
                  header:{
                    "content-type":"application/json;charset=utf-8"
                  },
                  withCredentials:true
                })
                  .then((res)=>{
                    this.registerSuccess = true;
                    router.push("/user/login");
                  })
                  .catch((error)=>{
                    loading.close();
                    this.$message({
                      message: '亲，注册失败，请联系客服。。。',
                      type: 'warning'
                    });
                  })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          resetForm(formName) {
            this.$refs[formName].resetFields();
          },
          myBrowser() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
            var isIE = userAgent.indexOf("compatible") > -1
              && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
            var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
            var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1
              && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1
              && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

            if (isIE) {
              var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
              reIE.test(userAgent);
              var fIEVersion = parseFloat(RegExp["$1"]);
              if (fIEVersion == 7) {
                return "IE7";
              } else if (fIEVersion == 8) {
                return "IE8";
              } else if (fIEVersion == 9) {
                return "IE9";
              } else if (fIEVersion == 10) {
                return "IE10";
              } else if (fIEVersion == 11) {
                return "IE11";
              } else {
                return "0";
              }//IE版本过低
              return "IE";
            }
            if (isOpera) {
              return "Opera";
            }
            if (isEdge) {
              return "Edge";
            }
            if (isFF) {
              return "FF";
            }
            if (isSafari) {
              return "Safari";
            }
            if (isChrome) {
              return "Chrome";
            }

          },
          IsPC() {
            //判断是否移动端
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
              "SymbianOS", "Windows Phone",
              "iPad", "iPod"];
            var flag = true;
            for (var i = 0; i < Agents.length; i++) {
              if (userAgentInfo.indexOf(Agents[i]) !=-1) {
                flag = false;
                break;
              }
            }
            return flag?"PC端":"移动端";

          },
          errorByStatus(status){
            if(status === 401){
              alert("亲，Unauthorized，木有授权码或权限不足哦。。。。。")
            }
          }

        }
    }
</script>

<style scoped>
  .el-form {
    width: 400px;
    height: 460px;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .second {
    color: red;
    font-size: 18px;
  }
  .el-input {
    width: 250px;
  }
  .registerHead {
    color: black;
    font-size: 25px;
    text-align: center;
    padding-right: 80px;
  }

</style>
