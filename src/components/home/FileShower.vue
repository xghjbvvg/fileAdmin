<template>
  <div id="fileShower" v-drag v-if="flag">
    <div >
      <el-header style="height: 23px">
        <el-col >
          <i class="el-icon-close" @click="remove"></i>
        </el-col>
      </el-header>
      <el-container>

        <el-col v-if="type === 'pdf'">

          <p class="arrow">

            <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">Preview</span>
            {{currentPage}} / {{pageCount}}

            <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">Next</span>
          </p>
          <pdf :src="filePath"
               :page="currentPage"
               @num-pages="pageCount=$event"
               @page-loaded="currentPage=$event"
               @loaded="loadPdfHandler"  style="width:550px; height:400px">
          </pdf>


        </el-col>

        <el-col v-if="type === 'pic'">
          <img :src="path" width="550px" height="450px"/>
        </el-col>

        <el-col v-else-if="type === 'mp3'">
          <audio autoplay="autoplay"
                 controls="controls"
                 preload="auto"
                 :src="path">
          </audio>
        </el-col>
        <el-col v-else-if="type === 'mp4'" >
          <video class="video" controls style="width:550px; height:400px">
            <source :src="path" type="video/mp4">
          </video>
        </el-col>
        <el-col v-else-if="type === 'office'">
          <iframe  :src='filePath' style="width:550px; height:400px">

          </iframe>
        </el-col>
      </el-container>

    </div>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'

  export default {
      name: "FileShower",
      directives:{
        drag:function(el){
          el.onmousedown = function(e){
            //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
            var divx = e.clientX - document.getElementById('fileShower').offsetLeft;
            var divy = e.clientY - document.getElementById('fileShower').offsetTop;
            //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
            document.onmousemove = function(e){
              //获取移动后div的位置：鼠标位置-divx/divy
              var l = e.clientX - divx;
              var t = e.clientY - divy;
              document.getElementById('fileShower').style.left=l+'px';
              document.getElementById('fileShower').style.top=t+'px';
            }
            document.onmouseup = function(e){
              document.onmousemove = null;
              document.onmouseup = null;
            }
          }
        }
      },
      props:['path',"showFile"],
      components:{pdf},
      data(){
        return{
          filePath: "",
          type:'',
          flag:false,
          currentPage: 0, // pdf文件页码
          pageCount: 0, // pdf文件总页数
          // flag:true,
        }
      },
      watch:{
        path(val) {
          this.flag = false;
          this.flag = true;
          // var tableDatum = val;
          // var split = val.split(".");
          // var splitElement = split[split.length -1];
          // console.log(splitElement);
          var imgReg = /^.*\.(?:gif|jpg|peg|bmp|png)$/i;
          var mp4Reg =/^.*\.(?:mp4|flv|avi)$/i;
          var mp3Reg =/^.*\.(?:mp3)$/i;
          var docReg =/^.*\.(?:doc|dot|docx|dotx|docm|dotm|xls|xlt|xla|xlsx|xltx|xlsm|xltm|xlam|xlsb|ppt|pot|pps|ppa|pptx|potx|ppsx|ppam|pptm|potm|ppsm|txt|md)$/i;
          var pdfReg =/^.*\.(?:pdf)$/i;
          if (imgReg.test(val.toLowerCase())){
            // alert("img");
              this.type  = "pic";
              this.path = val;
              return;
          }else if (docReg.test(val.toLowerCase())){
            this.type  = "office";
            this.path = val;
            this.filePath = "http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc="+this.path;
            return;
          }else if (pdfReg.test(val)){
            // alert(val);
            this.type  = "pdf";
            this.path = val;
            this.filePath = pdf.createLoadingTask(this.path);
            return;
          }else if(mp3Reg.test(val.toLowerCase()) ){
            this.type  = "mp3";
            this.path = val;
            return;
          }else if(mp4Reg.test(val.toLowerCase())){
            this.type  = "mp4";
            this.path = val;
            return;
          }
        },
        showFile(val){
          this.flag = val;
        }
      },
      methods:{
        remove(){
          this.flag = false;
        },
        // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
        changePdfPage (val) {
          // console.log(val)
          if (val === 0 && this.currentPage > 1) {
            this.currentPage--
            // console.log(this.currentPage)
          }
          if (val === 1 && this.currentPage < this.pageCount) {
            this.currentPage++
            // console.log(this.currentPage)
          }
        },

        // pdf加载时
        loadPdfHandler (e) {
          this.currentPage = 1 // 加载的时候先加载第一页
        }

      },
      mounted(){
       // var path =  ;

      }
    }
</script>

<style scoped>
  #fileShower{
    width: 550px;
    height: 450px;
    background: ghostwhite;
    box-shadow: -5px -5px 5px gainsboro;
    position: fixed;
    top: 75px;
    right: 20px;
    bottom: 200px;
    z-index: 999;
  }
  .el-header{
    height: 15px;
  }
  .fileShower{
    font-size: 15px;
    color: red;
    margin: 0px;
  }
</style>
