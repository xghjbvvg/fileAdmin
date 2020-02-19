<template>
  <!--:style="loginStyle"-->
  <div id="login" >
    <el-container>


      <el-form v-show="!flag" :model="phoneLogin" status-icon :rules="phoneRules" ref="phoneLogin"
               label-width="110px" class="demo-ruleForm">
        <el-form-item style="margin: 0">
          <p class="loginHead">邮箱登入</p>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input type="text" v-model="phoneLogin.phone" autocomplete="off" style="float: left;"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="numberCode">
          <el-input type="text" v-model="phoneLogin.numberCode" autocomplete="off"
                    style="width: 100px;float: left;">
          </el-input>
          <el-button>
            <span v-if="isSendCode" @click="sendCode('phoneLogin')" style="padding: 0 0;">发送验证码</span>
            <span v-else><span class="second">{{second}}</span>秒重试</span>
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @="submitByPhone('phoneLogin')">提交</el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <router-link to="/user/register">
            <el-button>注册</el-button>
          </router-link>
        </el-form-item>
        <el-form-item>
          <span class="forgetPassword">忘记密码?</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="loginByPhone" @click="changeLoginWay">用户名登入</span>
        </el-form-item>
      </el-form>

      <el-form v-show="flag" :model="userLogin" status-icon :rules="userRules"
               ref="userLogin" label-width="110px"
               class="demo-ruleForm">
        <el-form-item style="margin: 0">
          <p class="loginHead">用户名登入</p>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="userLogin.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="userLogin.pass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitByUsername('userLogin')">提交</el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <router-link to="/user/register">
            <el-button>注册</el-button>
          </router-link>
        </el-form-item>
        <el-form-item style="text-align: right">
          <span class="forgetPassword">
            <router-link to='/resetPwd'>忘记密码?</router-link>
          </span>

         <!-- <span class="loginByPhone" @click="changeLoginWay">手机登入</span>-->
        </el-form-item>
      </el-form>
    </el-container>
  </div>

</template>

<script>
  var url1 = require("../../assets/img/bg1.jpg")
  var url2 = require("../../assets/img/bg2.jpg");
  var url3 = require("../../assets/img/bg3.jpg");
  var url4 = require("../../assets/img/bg4.jpg");

  import SlideVerify from 'vue-monoplasty-slide-verify';
  import VueCookie from 'vue-cookies'
  import router from "../../router";
  import axios from 'axios'
  import QS from 'qs'
  export default {
    name: 'loginByUserName',
    components: {
      SlideVerify
    },
    data() {
      var validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入用户名'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
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
      var validateNumberCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      };

      return {
        flag: true,//用户登入与手机登入切换
        isSendCode: true,//是否发送验证码
        second: 60,
        msg: '',
        image: url1,
        word: '“安全存储，<br/>生活井井有条”',
        userLogin: {
          pass: '',
          username: '',
          rememberMe: '',
        },
        phoneLogin: {
          rememberMe: '',
          phone: '',
          numberCode: '',
        },
        phoneRules: {
          phone: [
            {validator: validatePhone, trigger: 'blur'}
          ],
          /*numberCode: [
            {validator: validateNumberCode, trigger: 'blur'}
          ]*/
        },
        userRules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ],
        },

        loginSuccess:false,
        loadingText:"凡心所向 素履所往  生如逆旅 一苇以航"
      };
    },
    methods: {
      submit(formName,params){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //登入中....
            const loading = this.$loading({
              lock: true,
              text: this.loadingText,
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            //登入完成关闭
            var start = new Date().getMilliseconds();
            var interval = setInterval(() => {
              var end = new Date().getMilliseconds();
              if (this.loginSuccess) {
                loading.close();
                this.$message({
                  message: '登入成功',
                  type: 'success'
                });
                clearInterval(interval);
              }
            },1000);
            //请求登入接口，获取token
            axios({
              url:'/api/oauth/token',
              method:'post',
              params:params,
              header:{
                "content-type":"application/json;charset=utf-8"
              }
            })
              .then((res)=>{
                //写入登入历史
                if(res.data.access_token != null){
                  console.log(res.data.access_token);
                  axios({
                    url:'/api/user/insertHistory',
                    method:'post',
                    params:{
                      access_token:res.data.access_token,
                    },
                    data:{
                      browser: this.myBrowser(),
                      device: this.IsPC(),
                      way: formName === 'userLogin' ? '密码登入' : '手机登入',
                      user: {
                        username: this.userLogin.username,
                        phone: this.phoneLogin.phone
                      }
                    },
                    header:{
                      "content-type":"application/json;charset=utf-8"
                    }
                  }).then(()=>{
                    this.loginSuccess = true;
                    VueCookie.set("access_token",res.data.access_token,86500);
                    VueCookie.set("username",this.userLogin.username,86500);
                    router.push("/index");
                  }).catch((err)=>{
                    loading.close();
                    this.$message({
                      message: '登入失败',
                      type: 'warning'
                    });
                  })

                }else{
                  loading.close();
                  this.$message({
                    message: '登入失败',
                    type: 'warning'
                  });
                }

              })
              .catch((err)=>{
                console.log(err);
                loading.close();
                this.$message({
                  message: 'sorry，登入失败，用户名或密码错误。。。',
                  type: 'warning'
                });
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitByPhone(formName) {
        var params = {
          grant_type:"client_credentials",
          scope:"select",
          client_id:"client_1",
          client_secret:"123456"
        };
        this.submit(formName,params);
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
      submitByUsername(formName) {
        var params = {
          username: this.userLogin.username,
          password: this.userLogin.pass,
          grant_type:"password",
          scope:"select",
          client_id:"client_2",
          client_secret:"123456"
        };
        this.submit(formName,params);
      },
      //改变登入方式，用户登入与手机登入
      changeLoginWay() {
        this.flag = !this.flag;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      resetPwd(){

      },
      // 发送验证码
      sendCode(formName) {
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
              // console.log(this.second);
            },1000);
          }else {
            this.$message({
              message: '手机号码格式不正确',
              type: 'warning'
            });
          }

        });

        //请求后台接口
        /*axios({
          url:'/api/user/verificationCode',
          method: 'get',
          params: {
            phone: this.phoneLogin.phone,
          },
          header:{
            "content-type":"application/json;charset=utf-8"
          },
          withCredentials:true
        })
          .then((res)=>{
            console.log(res.data);
          })
          .catch((error)=>{
            /!*console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);*!/
            this.errorByStatus(error.response.status);
          })*/
      },
    },
  }
</script>

<style scoped>
  #login {
    transform: matrix(1, 0, 0, 1, 0, 0);
    transition: all 500ms linear 0s;
    position: relative;
    margin: 0px 0px 0px 0px;
    width: 100%;
    height:100%;

    /*  !*background-image: url(../../assets/img/bg1.jpg);*!*/
  }
  .el-container{
    width: 400px;
    height: 400px;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .el-form {
    width: 400px;
    height: 400px;
    /*background-color: rgba(255, 255, 255, 0.5);*/
  }

  .el-input {
    width: 250px;
  }

  .el-switch {
    margin-left: -209px;
  }

  .forgetPassword {
    text-align: left;

    padding-right: 20px;
    cursor: pointer;
  }
  a{
    color:black;
  }

  .forgetPassword:hover {
    color: steelblue;
  }

  .loginByPhone:hover {
    color: steelblue;

  }

  .loginByPhone {
    text-align: right;
    cursor: pointer;
  }

  .second {
    color: red;
    font-size: 18px;
  }
  .loginHead {
    color: black;
    font-size: 25px;
    text-align: center;
    padding-right: 80px;
  }

  li {
    list-style: none;
    display: inline-block;
    cursor: pointer;
    /*text-decoration: none;*/
  }

  .footCircle {
    display: block;
    height: 8px;
    outline: medium none;
    overflow: hidden;
    width: 8px;
    border: 1px solid #fff;
    border-radius: 5px;
    background: #fff;
    filter: alpha(opacity=50);
    -moz-opacity: .5;
    opacity: .5;
    float: left;
  }

  .introduction {
    width: 300px;
    height: 300px;
    margin: 50px auto;
    font-weight: bolder;
    color: ghostwhite;
    font-size: 35px;
    /*background: lightseagreen;*/
  }


</style>




