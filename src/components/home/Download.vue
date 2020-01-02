<template>
  <div  :class="activeClass == 1?'display':'noDisplay'" id="download">
      <el-header class="download-header">
        <el-col :span="3">下载</el-col>
        <el-col :span="1" :offset="19">
          <i class="el-icon-minus" @click="changeDownloadStyle"></i>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-close" @click="removeDownload"></i>
        </el-col>
      </el-header>
      <el-main class="downloadBody">
        <el-table
          :data="$store.state.downloadList"
          height="200"
          border
          style="width: 100%;">
          <el-table-column
            prop="name"
            label="文件名"
            width="200">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            label="进度"
            prop="date"
            width="300">
            <template slot-scope="scope">
              <!--<button @click="len">click</button>-->
              <el-progress v-if="scope.row.download !== 1" :text-inside="true" :stroke-width="26"
                           :percentage="scope.row.percent"></el-progress>

              <span v-if="scope.row.download === 1" class="downloadSuccess"> 下载成功</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>


  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import Vue from 'vue'
  import axios from 'axios'
  import VueCookie from "vue-cookies";

  export default {
    name: "Download",
    components: {
      VueCookie
    },
    data() {
      return {
        tableData: this.$store.state.downloadList,
        percent: 0,
        activeClass:0,
        access_token:VueCookie.get("access_token"),
      }
    },
    computed: {
      ...mapState({
        downloadList: state => state.downloadList,
        num: state => state.num,
      }),
      ...mapGetters(['getDownload'])
    },
    directives:{
      drag:function(el){
        el.onmousedown = function(e){
          //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
          var divx = e.clientX - document.getElementById('download').offsetLeft;
          var divy = e.clientY - document.getElementById('download').offsetTop;
          //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
          document.onmousemove = function(e){
            //获取移动后div的位置：鼠标位置-divx/divy
            var l = e.clientX - divx;
            var t = e.clientY - divy;
            document.getElementById('download').style.left=l+'px';
            document.getElementById('download').style.top=t+'px';
          }
          document.onmouseup = function(e){
            document.onmousemove = null;
            document.onmouseup = null;
          }
        }
      }
    },
    watch: {
      display1:function (newVal, oldVal) {
        this.display1 = newVal;
      },
      percent: function (newVal, oldVal) {
        this.percent = newVal;
      },
      tableData: ((newVal) => {
        this.tableData = newVal;
      })
    },


    methods: {
      changeDownloadStyle() {

      },
      removeDownload() {
          let b = window.confirm("are you sure");
          if(b){
            this.activeClass = 0;
          }
      },
      //下载实际操作
      download(path) {
        axios({
          url: '/api/file/download',
          method: 'get',
          responseType: 'blob',
          params: {
            filePath: path,
            access_token:this.access_token,
          }
        })
          .then((res) => {
            //木有数据则返回
            if (!res) {
              return
            }
            //文件名
            var filename = path.split('/')[path.split('/').length - 1];

            //URL.createObjectURL() 静态方法会创建一个 DOMString，
            // 其中包含一个表示参数中给出的对象的URL。
            // 这个 URL 的生命周期和创建它的窗口中的 document 绑定。
            // 这个新的URL 对象表示指定的 File 对象或 Blob 对象。
            let url = window.URL.createObjectURL(res.data);
            //创建dom a标签接收url地址
            let link = document.createElement('a');
            link.style.display = 'none'
            link.href = url;
            //设置文件名
            link.setAttribute('download', filename)
            //将a标签添加到dom中
            document.body.appendChild(link);
            //a标签点击事件，默认自动下载
            link.click()
          })
          .catch((error) => {
            console.log(error);
          })
      },


      len() {
        alert(this.$store.state.downloadList.length);
      },
      interval(list, j) {
        this.percent = 0;
        let path = this.$store.state.downloadList[j].absolutePath;
        this.download(path);
        let interval = setInterval(() => {
          axios({
            url: '/api/file/getDownloadPercent',
            method: 'get',
            async: false,
            params:{
              filename:list[j].name,
              access_token:this.access_token,
            },
            header: {'content-type': 'application/json;charset=utf-8'}
          })
            .then((msg) => {
              list[j].percent = msg.data * 100;
              console.log(this.$store.state.downloadList[j]);
              Vue.set(this.$store.state.downloadList, j, list[j]);
            })
            .catch((error) => {
              console.log(error);
            });
          if (list[j].percent >= 100) {
            clearInterval(interval);
            list[j].download = 1;
            let listElement = this.$store.state.downloadList[j];
            let temp = listElement;
            listElement.download = 1;
            Vue.set(this.$store.state.downloadList, j, temp);
          }
        }, 1000);

      },
      //参数n为休眠时间，单位为毫秒:
      sleep(ms) {
        var temple = new Promise(
          (resolve) => {
            console.log(111);
            setTimeout(resolve, ms)
          });
        return temple;
      }


    },
    updated() {
      let i = 0;
      let length = this.$store.state.downloadList.length;
      let list = this.$store.getters.getDownload;
      while (i < length) {
        //遍历文件，文件下载完成并且文件不再下载时执行
        if (list[i].download !== 1 && list[i].downloading !== 1) {
          this.activeClass = 1;
          list[i].downloading = 1;
          // alert(list[i].download+"  :   "+list[i].downloading);
          this.interval(list, i);
        }
        this.$store.commit('setDownload', list)
        i++;
      }
    }
  }
</script>

<style scoped>
  #download {
    width: 550px;
    height: 250px;
    top: 200px;
    right: 20px;
  }

  .el-header {
    height: 25px !important;

  }

  .el-main {
    margin-top: 0px !important;
    width: 100%;
  }

  .download-header {
    font-size: 15px;
    color: grey;
    margin: 10px;
  }

  .downloadBody {
    padding: 0;
  }

  .downloadSuccess {
    color: greenyellow;
  }

  .display{
    display: block ;
  }
  .noDisplay{
    display: none !important;
  }
</style>
