<template>
  <div id="common" :style="loginStyle">
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="16">
              <span class="head letter">殇</span>
              <span class="head letter">璃</span>
              <span class="head letter">雪</span>
              <span class="head letter">域</span>
            </el-col>
            <el-col :span="6">
              <p class="contactMe" @click="open">联系我&nbsp;&nbsp;&nbsp;</p>
              <p class="contactMe">
                <router-link to="/question" style="color: white;">
                  问题反馈
                </router-link>
                &nbsp;&nbsp;&nbsp;</p>

            </el-col>
          </el-row>

        </el-header>
        <el-container>
          <el-aside>
            <div class="introduction">
              <span v-html="word"></span>
            </div>
          </el-aside>
          <el-main>
              <router-view></router-view>
          </el-main>
        </el-container>
        <el-footer>
          <ul class="ul">
            <li @click="changeImage(1)"><span class="footCircle"></span></li>
            <li @click="changeImage(2)"><span class="footCircle"></span></li>
            <li @click="changeImage(3)"><span class="footCircle"></span></li>
            <li @click="changeImage(4)"><span class="footCircle"></span></li>
          </ul>
        </el-footer>
      </el-container>
  </div>
</template>

<script>
  import url1 from '../../assets/img/bg1.jpg';
  import url2 from '../../assets/img/bg2.jpg';
  import url3 from '../../assets/img/bg3.jpg';
  import url4 from '../../assets/img/bg4.jpg';
    export default {
      name: "common",
      data() {
        return {
          loginStyle: {
            backgroundImage: 'url(' + url2 + ')'
          },
          image: url1,
          word: '“安全存储，<br/>生活井井有条”',
        };
      },
      methods: {
        open(){
          this.$alert('QQ:3144933378<br/>' +
            '微信:18270671294<br/>' +
            '邮箱:HuangChiXin6@163.com<br/>' +
            'github：https://github.com/xghjbvvg/springcloud-file-admin<br/>',

            '联系方式', {
              dangerouslyUseHTMLString: true
            });
        },

        //改变背景图片
        changeImage(i) {
          if (i === 1) {
            this.loginStyle.backgroundImage = 'url(' + url1 + ')';
            this.word = '“安全存储，<br/>生活井井有条”';
          } else if (i === 2) {
            this.loginStyle.backgroundImage = 'url(' + url2 + ')'
            this.word = '“在线预览，<br/>文件即打即看”';
          } else if (i === 3) {
            this.loginStyle.backgroundImage = 'url(' + url3 + ')';
            this.word = '“多端共用，<br/>数据随身携带”';
          } else if (i === 4) {
            this.loginStyle.backgroundImage = 'url(' + url4 + ')'
            this.word = '“好友分享，<br/>共度幸福时光”';
          }
        },
      },
      mounted: function () {
        var i = 1;
        window.setInterval(() => {
          i++;
          this.changeImage(i);
          // console.log(this.image);
          if (i === 4) {
            i = 0;
          }

        }, 5000)
      }
    }
</script>

<style scoped>
  #common {
    transform: matrix(1, 0, 0, 1, 0, 0);
    transition: all 500ms linear 0s;
    width: 100%;
    height: 700px;
    position: relative;
    margin: 0px 0px 0px 0px;
    background-size:cover;
  }
  .head{
    color:#fefefe;
    text-shadow:
      0px 1px 0px #c0c0c0,
      0px 2px 0px #b0b0b0,
      0px 3px 0px #a0a0a0,
      0px 4px 0px #909090,
      0px 5px 10px rgba(0, 0, 0, .9);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: "Helvetica Neue",Arial,sans-serif;
  }
  .letter {
    animation: bounce 0.75s cubic-bezier(0.05, 0, 0.2, 1) infinite alternate;
    display: inline-block;
    transform: translate3d(0, 0, 0);
    margin-top: 0.5em;
    font-size: 30px;
    font-weight: bolder;
    text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
    /*font: normal 100 6rem 'Varela Round', sans-serif;*/
  }
  .letter:nth-child(1) {
    animation-delay: 0s;
  }
  .letter:nth-child(2) {
    animation-delay: 0.1s;
  }
  .letter:nth-child(3) {
    animation-delay: 0.2s;
  }
  .letter:nth-child(4) {
    animation-delay: 0.3s;
  }
  @keyframes bounce {
    0% {
      transform: translate3d(0, 0, 0);
      text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
    }
    100% {
      transform: translate3d(0, -1em, 0);
      text-shadow: rgba(255, 255, 255, 0.4) 0 1em 0.35em;
    }
  }


  .el-header {
    color: floralwhite;
    width: 100%;
    height: 5% !important;
    padding: 5px 30px;
    font: 23px/1.5 Tahoma, Helvetica, Arial, '宋体', sans-serif;
  }

  .contactMe {
    /*float: left;*/
    font-size: 18px;
    float: left;
    margin-top: 33px;
  }

  .el-footer {
    width: 100%;
    height: 5% !important;
    margin: 0 auto;
    align-items: center;
    text-align: center;
  }

  .el-aside {
    color: #333;
    text-align: center;
    width: 45% !important;
    height: 500px;
  }

  .el-main {
    color: #333;
    text-align: center;
    height: 90%;
    width: 55% !important;
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

