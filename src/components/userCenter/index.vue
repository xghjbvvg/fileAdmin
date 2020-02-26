<template>
    <div id="index">

      <el-row>
        <el-col :span="8">
          <el-row>
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :show-file-list="false"
              :data="token"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-row>
          <el-row style="font-size: 18px;color:lightskyblue;cursor: pointer;">
            修改头像
          </el-row>
        </el-col>
        <el-col :span="8" style="padding-top: 50px">
          <el-row>
            <el-col :span="24">
              昵称：<el-input style="width: 150px" v-model="updateUsername" placeholder="请输入昵称"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="margin-top: 15px">
              <el-button @click="updateName">更改昵称</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" style="padding-top:7px ;padding-bottom:7px ;">
          <span class="randomImg">推荐头像</span>(10秒刷新):
        </el-col>
        <el-col :offset="8" :span="8" style="text-align: right;cursor: pointer;">
          <i class="el-icon-refresh" @click="randomImg"></i>
        </el-col>
      </el-row>
      <el-row v-if="flag">
        <el-col :span="4" v-for="item in randomImgList">
          <img :src="item" width="110" height="120" @click="updateImg(item)"/>
        </el-col>
      </el-row>
      <el-row>
        <h2>登入历史</h2>
      </el-row>
      <el-row>
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="browser"
              label="浏览器">
            </el-table-column>
            <el-table-column
              prop="way"
              label="登入方式">
            </el-table-column>
            <el-table-column
              prop="device"
              label="设备">
            </el-table-column>
          </el-table>
      </el-row>


    </div>
</template>

<script>
  import vueCookie from 'vue-cookies'
  import axios from 'axios'
  export default {
      name: "index",
      data() {
        return {
          username: vueCookie.get('username'),
          token: {
            access_token:vueCookie.get('access_token')
          },
          imageUrl: '',
          randomImgList: [],
          flag: false,
          tableData: [],
          user:'',
          updateUsername: this.username,
        }
      },
      methods: {
        //上传头像成功
        handleAvatarSuccess(res, file) {
          this.$message({
            message:'文件上传成功',
            type: 'success'
          })
          this.imageUrl = URL.createObjectURL(file.raw);
          var user = JSON.parse(sessionStorage.getItem('user'));
          user.imageUrl = this.imageUrl;
          console.log(user);
          sessionStorage.setItem('user',JSON.stringify(user));
          // this.$store.state.userInfo.imageUrl = this.imageUrl;
            // console.log(res);
          this.updateImg(res);
        },
        //上传头像之前校验
        beforeAvatarUpload(file) {
          this.$message('正在上传，请稍后！！！');
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        //随机推荐头像
        randomImg() {
          this.flag = false;
          this.randomImgList= [];
          for (var i = 0; i <= 5; i++) {
            var num = Math.floor((Math.random() * 50) + 1);
            this.randomImgList[i] = "http://120.78.88.169:8763/static/head/img"+num+".jpg";
          }

          this.flag = true;
        },
        //校验浏览器
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
        //判断是否为pc端
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
        //获得历史登入记录
        getHistory(){
          axios({
            url:'/api/user/findLoginHistory',
            method:'post',
            params:{
              access_token:vueCookie.get('access_token'),
              username:this.username
            },
          }).then((res)=>{
            // console.log(res);
            this.tableData = res.data;
          }).catch((err)=>{
             this.$message({
               message: '加载失败',
               type: 'warning'
             })
          })
        },
        //更新昵称
        updateName(){
          axios({
            url:'/api/user/updateUsername',
            method:'post',
            params:{
              access_token:vueCookie.get('access_token'),
              id:this.user.id,
              username:this.updateUsername,
            },
          }).then((res)=>{
            vueCookie.set('username',this.updateUsername);
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            var user = JSON.parse(sessionStorage.getItem('user'));
            user.username = this.updateUsername;
            sessionStorage.setItem('user',JSON.stringify(user));
          }).catch((err)=>{
            this.$message({
              message: '加载失败',
              type: 'warning'
            })
          })
        },
        //向后台请求接口，上传头像路径
        updateImg(path){
          axios({
            url:'/api/user/updateImgUrl',
            method:'post',
            params:{
              access_token:vueCookie.get('access_token'),
              id:this.user.id,
              imageUrl:path,
            },
          }).then(()=>{
            this.$message({
              message:'更新图像成功',
              type:'success'
            });
            this.imageUrl = path;
            // this.user.imageUrl = this.imageUrl;
            this.user.imageUrl = path;
            console.log(this.user);
            sessionStorage.setItem('user',JSON.stringify(this.user));
          })
        },

      },
      mounted(){
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.randomImg();
        window.setInterval(()=>{
          this.randomImg();
        },10000);
        this.getHistory();
      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload .el-icon-plus {
    border: 1px dashed grey;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .updateUsername{
    font-size: 30px;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .randomImg{
    font-size: 23px;
    cursor: pointer;
  }
</style>
