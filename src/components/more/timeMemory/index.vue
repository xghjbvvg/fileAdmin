<template>
  <div id="timeMemory">
    <div style=" width:80%; height:100%;left:10%; margin: auto;position: absolute">
      <el-row>
        <audio id="media" autoplay preload @onended="musicEnded" >
          <source :src="audioSrc[0]">
        </audio>
      </el-row>
      <el-row>

      </el-row>
      <el-row style="text-align: center;color:grey">
        <h2>时间隧道</h2>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="19">
          <template>
            <el-radio v-model="radio" label="1">一年后接收</el-radio>
            <el-radio v-model="radio" label="3">三年后接收</el-radio>
            <el-radio v-model="radio" label="5">五年后接收</el-radio>
          </template>
        </el-col>
        <el-col :span="1"  class="music">
          <el-tooltip class="item" effect="dark" content="暂停" placement="top-start">
            <i @click="playMusic" v-show="isPlay" class="el-icon-video-pause"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="播放" placement="top-start">
            <i @click="playMusic" v-show="!isPlay" class="el-icon-video-play"></i>
          </el-tooltip>

        </el-col>
        <el-col :span="2" class="info">
          <el-popover
            placement="top-start"
            title="提示"
            trigger="hover"
            content="愿一段优美静谧的音乐过后，写一封信给 1/3/5后的你，写下你所有的期待,
            信件将在多年后发送到你的邮箱之中(保存之后你无法见到此信件)。再次，衷心祝愿美好如期而至，谢谢">
            <el-button slot="reference" style="border: none;background: none;padding-top: 0px">
              <i class="el-icon-info"></i>
            </el-button>

          </el-popover>

        </el-col>
      </el-row>
      <mavon-editor :toolbars="markdownOption" v-model="value" ref=markdown @save="$save" @change="$change" @imgAdd="$imgAdd" />

    </div>

  </div>
</template>


<script>

  import  axios from 'axios'
  import vueCookie from 'vue-cookies'
  import router from '../../../router'
  export default {
    name: "timeMemory",
    data(){
      return{
        audioSrc: [require('../../../assets/夜的钢琴曲五.mp3'),
          require('../../../assets/夜的钢琴曲一.mp3'),
          require('../../../assets/大野克夫 - オセンチな歩美.mp3'),
          require('../../../assets/昼夜 - 【钢琴】雨的印记（Kiss The Rain）（Cover YIRUMA）.mp3'),
          require('../../../assets/高梨康治 - 白映.mp3')
        ],
        value:vueCookie.get('email') === null ? '':vueCookie.get('email'),
        head:'',
        isPlay:true,
        tags:[],
        firstImg:'',
        user:JSON.parse(sessionStorage.getItem("user")),
        markdownOption:{
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
        },
        radio:'3',
        flag:2,

      }
    },
    methods: {
      $change(value,render){
        this.value = value;
      },
      // 绑定@imgAdd event
      $imgAdd(pos, $file){
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('file', $file);
        this.markdownOption.save = false;
        axios({
          url:'/api/upload',
          method:'post',
          headers: { 'Content-Type': 'multipart/form-data' },
          params:{
            access_token:vueCookie.get('access_token'),
          },
          data:formdata
        }).then((url)=> {
          if(url.data){
            this.firstImg = url.data;
            console.log(this.firstImg);
            this.$refs.markdown.$img2Url(pos, url.data);
            this.markdownOption.save = true;
          }else{
            this.$message({
              'type':'warning',
              message:'图片上传失败，请重试'
            });
          }
        }).catch((err)=>{
          this.$message({
            'type':'warning',
            message:'图片上传失败，请重试'
          });
        })
      },

      $save(value,render){
        if(value.length !== 0){
          var email = {
            content:value,
            year:this.radio,
            htmlContent: render,
            user:{
              id: this.user.id
            },
          };
          this.$message('正在保存中，请稍后。。。。');
          axios({
            url:'/api/more/email/save',
            method:'post',
            data:email,
            params:{
              access_token:vueCookie.get('access_token'),
            },
          })
            .then((res)=>{
              if(res.data){
                this.$message({
                  type:'success',
                  duration:10000,
                  message:'保存成功,此信件将在'+this.radio+"年后发送至你的邮箱，谢谢！！！！"
                });
                vueCookie.set("email",'',1);
                this.$message('即将返回上一级。。。。');
                router.push("/more/");
              }else{
                this.$message({
                  type:'warning',
                  message:'保存失败'
                })
              }

            })
            .catch((err)=>{
              this.$message({
                type:'warning',
                message:'保存失败'+err
              })
            })
        }else{
          this.$message("内容不能为空");
        }
      },
      playMusic(){
        if(this.isPlay){
          this.isPlay = false;
          document.getElementById("media").pause();
          console.log(document.getElementById("media"));
        }else{
          this.isPlay = true;
          document.getElementById("media").play();
        }
      },
      musicEnded(){

      }
    },
    components:{},
    mounted(){
      document.addEventListener(
        "WeixinJSBridgeReady",
        function() {
          let media = document.getElementById("media");

        },
        false
      );
      window.setInterval(()=>{
        let media = document.getElementById("media");
        try{
          if(media.ended){
            media.src = this.audioSrc[++this.flag];
            if(this.flag >= 4){
              this.flag = 0;
            }
          }
        }catch (e) {

        }

      },500)
    },
    beforeRouteLeave(to,from,next){
      vueCookie.set("email",this.value,86500);
      next();
    },
  }
</script>

<style scoped>
#timeMemory{
  width: 100%;
  height:100%;
  position: relative;
}
  .music,.info{
    cursor: pointer;
    text-align: center;
  }
</style>
