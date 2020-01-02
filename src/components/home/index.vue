<template>
  <div id="index">
    <el-container>
      <el-header>
        <UserLoginExpire />
        <Header />
      </el-header>
      <el-container>

        <router-view></router-view>

      </el-container>
    </el-container>
  </div>
</template>

<script>
import UserLoginExpire from "../user/UserLoginExpire";
import Header from "./Header";
import Aside from "./Aside";
import BackPathItem from "./BackPathItem";
import Uploader from "./Uploader";
import Download from "./Download";
import plupload from "plupload";
import axios from "axios";
import FileMd5 from "../../models/file-md5.js";
import VueCookie from "vue-cookies";
import FileShower from "./FileShower";



export default {
  name: "index",
  components: {
    FileShower,
    VueCookie,
    UserLoginExpire,
    Header,
    Aside,
    BackPathItem,
    Uploader,
    Download
  },
  // 自定义指令
  directives:{
    drag:function(el){
      el.onmousedown = function(e){
        //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
        var divx = e.clientX - document.getElementById('drag').offsetLeft;
        var divy = e.clientY - document.getElementById('drag').offsetTop;
        //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
        document.onmousemove = function(e){
          //获取移动后div的位置：鼠标位置-divx/divy
          var l = e.clientX - divx;
          var t = e.clientY - divy;
          document.getElementById('drag').style.left=l+'px';
          document.getElementById('drag').style.top=t+'px';
        }
        document.onmouseup = function(e){
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }
  },
  data() {
    return {
      showFile:false,
      username: VueCookie.get("username"),
      user: JSON.parse(sessionStorage.getItem("user")),
      input: "",
      count: 0,
      tableData: [
        {
          name: "hcx",
          size: "12kb",
          date: "2102-8-9"
        }
      ],
      multipleSelection: [],
      currentPath: [],
      sizeFlag: true,
      dateFlag: true,

      downloadFlag: true,

      //upload模板是否显示
      flag: false,
      fileIsExist: "",
      uploadStyle: true,
      //http://120.78.88.169:8080
      //http://127.0.0.1:8081
      server_config: "/api/file/fileUpload",
      uploadPath: "",
      up: {},
      files: [],
      // tableData: [],
      dialogTableVisible: false,
      //控制开启与结束上传按钮是否可以点击
      uploading: false,
      //控制是否可以重复上传
      duplicates: false,
      //图片文件路径
      path:'',
    };
  },
  computed: {
    status() {
      return this.files.length > 0 ? this.files[0].status : null;
    }
  },
  watch: {
    files: {
      handler() {
        // this.tableData = [];
        this.files.forEach(e => {
          console.log(e);
          this.tableData.push({
            name: e.name,
            size: e.size,
            status: e.status,
            id: e.id,
            percent: e.percent
          });
        });
        this.tableData = this.unique(this.tableData);
        // if(!this.fileIsExist){
        //   this.uploadStart();
        // }
      },
      deep: true
    }
  },
  methods: {
    /*文件显示操作*/
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //跳转到下层路径
    toNext(event, path) {
      this.currentPath.push(path);
      console.log(this.currentPath);
      //重设上传路径
      this.uploadPath = path;
      //获得该路径下所有文件
      this.getTableDataByPath(path);
    },

    //根据索引删除文件
    deleteMenuFile(index) {
      var confirm = window.confirm("are you sure ?");
      if (confirm) {
        // console.log(this.tableData[index]);
        axios({
          url: "/api/file/delete",
          method: "post",
          params: {
            access_token: VueCookie.get("access_token"),
            path: this.tableData[index].absolutePath,
            uid:this.user.id
          }
        })
          .then(msg => {
            if (msg.data) {
              alert("文件删除成功");
              this.tableData.splice(index, 1);
            } else {
              alert("文件删除失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }

    },
    //删除操作
    delete(data) {
      let confirm = window.confirm("are you sure ?");
      if (confirm) {
        axios({
          url: "/api/file/delete",
          method: "post",
          params: {
            access_token: VueCookie.get("access_token"),
            path: this.data.path,
            uid:this.user.id
          }
        })
          .then(msg => {
            if (msg.data) {
              alert("文件删除成功");
            } else {
              alert("文件删除失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },



    //下载文件，引用download方法
    downloadFile(index) {
      let downloadList = this.$store.state.downloadList;
      let flag = false;
      downloadList.forEach(data => {
        if (data.name === this.tableData[index].name) {
          alert("亲，下载文件已经存在");
          flag = true;
        }
      });
      if (!flag) {
        this.$store.state.downloadList.push(this.tableData[index]);
      }
    },
    //下载实际操作
    download(path) {
      axios({
        url: "/api/file/download",
        method: "get",
        responseType: "blob",
        params: {
          access_token: VueCookie.get("access_token"),
          filePath: path
        }
      })
        .then(res => {
          console.log(res);
          //木有数据则返回
          if (!res) {
            return;
          }
          //文件名
          var filename = path.split("/")[path.split("/").length - 1];

          //URL.createObjectURL() 静态方法会创建一个 DOMString，
          // 其中包含一个表示参数中给出的对象的URL。
          // 这个 URL 的生命周期和创建它的窗口中的 document 绑定。
          // 这个新的URL 对象表示指定的 File 对象或 Blob 对象。
          let url = window.URL.createObjectURL(res.data);
          //创建dom a标签接收url地址
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          //设置文件名
          link.setAttribute("download", filename);
          //将a标签添加到dom中
          document.body.appendChild(link);
          //a标签点击事件，默认自动下载
          link.click();
        })
        .catch(error => {
          console.log(error);
        });
    },
    //批量下载
    downloadMultipleFile() {
      this.multipleSelection.forEach((data, index) => {
        if (!data.isFolder) {
          // let path = data.absolutePath;
          this.downloadFile(index);
        }else{
          this.$message({
            type:'warning',
            message:'亲，不支持下载文件夹哦'
          })
        }
      });
    },

    //重命名
    rename(index) {
      alert(index);
    },

    //接收侧边栏数据
    receiveAsideData(tableData) {
      this.tableData = tableData;
    },
    //  查找根目录文件
    getFileMainMenu() {
      this.currentPath = [];
      axios({
        url: "/api/file/getMainMenu",
        method: "get",
        params: {
          access_token: VueCookie.get("access_token"),
          uid: this.user.id
        },
        header: {
          "content-type": "application/json;charset=utf-8"
        }
      })
        .then(msg => {
          //将上传路径
          this.uploadPath = msg.data[0].parentPath;
          // alert(this.uploadPath);
          this.tableData = msg.data;
          this.addFiled(this.tableData);
        })
        .catch(error => {
          console.log(error);
        });
    },

    //获得指定路径的所有文件
    getTableDataByPath(path) {
      axios({
        url: "/api/file/getMenuByPath",
        method: "get",
        params: {
          uid: this.user.id,
          path: path,
          access_token: VueCookie.get("access_token")
        },

        header: {
          "content-type": "application/json;charset=utf-8"
        }
      })
        .then(msg => {
          if (msg.data.length === 0) {
            // this.uploadPath = this.currentPath[this.currentPath.length];
            this.tableData = [];
          } else {
            // this.uploadPath = msg.data[0].parentPath;
            this.tableData = msg.data;
            this.addFiled(this.tableData);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    pathSkip(path,index){
        this.currentPath.splice(index+1);
        this.uploadPath = path;
        this.getTableDataByPath(path);
    },

    addFiled(tableData) {
      tableData.forEach(data => {
        data.download = 0;
        data.downloading = 0;
        data.percent = 0;
      });
    },

    //新建文件夹
    open() {
      this.$prompt("请输入文件名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      //   var regEn = /[`~!@#$%^&()_+<>?:.*"{}\/;'[\]]/im;
      // regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        inputPattern: /$/,
        inputErrorMessage: "文件名为空"
      })
        .then(({ value }) => {


          //判断文件是否重名
          let flag = true;
          let len = this.tableData.length;
          let regEn = /[`~!@#$%^&()_+<>?:.*"{}\/;'[\]]/im;
          let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
          if(regEn.test(value) || regCn.test(value)) {
            this.$message({
              type: "warning",
              message: "文件含有特殊字符"
            });
            return;
          }

          for (var j = 0; j < len; j++) {
            if (this.tableData[j].name === value) {
              flag = false;
              this.$message({
                type: "warning",
                message: "文件重名"
              });
              return;
            }
          }

          //文件不重名时执行
          if (flag) {
            axios({
              url: "/api/file/mkdir",
              method: "post",
              params: {
                access_token: VueCookie.get("access_token"),
                path: this.uploadPath,
                fileFolderName:  value,
                uid:this.user.id
              }
            })
              .then(msg => {
                this.$message({
                  type: "success",
                  message: value + "文件夹创建成功 "
                });
                this.getTableDataByPath(this.uploadPath);
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },

    //根据api从后台获取信息（实际操作）
    sort(api) {
      axios({
        url: api,
        method: "get",
        header: {
          "content-type": "application/json;charset=utf-8"
        },
        params: {
          path: this.uploadPath
        }
      })
        .then(msg => {
          this.tableData = msg.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //根据表格点击信息重排序，调用sort方法，传入api地址
    sortTable(column, event) {
      // alert(column.label);
      //按照文件大小排序
      if (column.label === "大小") {
        //从小到大
        if (this.sizeFlag) {
          this.sort("/api/file/sortFileBySizeUp");
          this.sizeFlag = false;
          console.log(this.tableData);
        } else {
          //日期排序
          //从大到小
          this.sort("/api/file/sortFileBySizeDown");
          this.sizeFlag = true;
          console.log(this.tableData);
        }
      } else {
        //从早到晚
        if (this.dateFlag) {
          this.sort("/api/file/sortFileByDateUp");
          this.dateFlag = false;
        } else {
          //从晚到早
          this.sort("/api/file/sortFileByDateDown");
          this.dateFlag = true;
        }
      }
    },
    //根据关键字查找文件
    findFileByKeyword() {
      if (this.input === "") {
        this.getTableDataByPath(this.uploadPath);
      } else {
        axios({
          url: "/api/file/findFileByKey",
          method: "get",
          header: {
            "content-type": "application/json;charset=utf-8"
          },
          params: {
            access_token: VueCookie.get("access_token"),
            userId: this.user.id,
            keyword: this.input
          }
        })
          .then(msg => {
            this.tableData = msg.data;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    /*上传头部设置*/
    changeUploadStyle() {
      this.uploadStyle = !this.uploadStyle;
    },

    //移除上传界面
    removeUpload() {
      let confirm = window.confirm("are you remove all");
      if (confirm) {
        // let file = this.up.getFile();
        // console.log(file);
        this.up.splice(0, this.files.length);
        this.files.splice(0, this.files.length);
        this.flag = !this.flag;
      }
    },

    /*文件上传操作,上传参数设置*/
    beforeUpload(up, file) {
      console.log(this.user);

      up.setOption("multipart_params", {
        uid: this.user.id,
        size: file.size,
        md5: file.md5,
        uploadPath: this.uploadPath,
        access_token:VueCookie.get('access_token')
      });
    },
    //去除重复数据
    unique(arr) {
      var hash = [];
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].name === arr[j].name) {
            ++i;
          }
        }
        hash.push(arr[i]);
      }

      return hash;
    },

    filesAdded: function(up, files) {
      console.log("有新文件添加至队列");
      this.flag = true;
      files.forEach((f) => {
        f.status = -1;
        FileMd5(f.getNative(), (e, md5) => {
          f["md5"] = md5;
          f.status = 1;
          f.relativePath = this.uploadPath;
          axios({
            url: "/api/file/checkIsExist",
            method: "get",
            params: {
              access_token: VueCookie.get("access_token"),
              md5: f.md5,
              uid:this.user.id
            },
            header: { "content-type": "application/json;charset=utf-8" }
          })
            .then(msg => {
              this.fileIsExist = !msg.data;
              if (this.fileIsExist) {
                alert("亲，文件已经上传过了。。。。");
                f.status = 5;
              } else {


              }

            })
            .catch(error => {
              console.log(error);
            });
          files.forEach(f => {
            this.files.push(f);
          });
          this.uploadStart();
        });

      });
      this.up = up;

    },
    //删除上传文件
    deleteFile(id, index) {
      let file = this.up.getFile(id);
      this.up.removeFile(file);
      this.files.splice(index, 1);
    },
    uploadStart() {
      if (this.files.length === 0) {
        // alert("亲，木有文件上传。。。。。")
      } else {
        this.uploading = true;
        this.up.start();
      }
    },
    error(uploader, errObject) {
      //同一文件可以重复上传
      this.duplicates = true;
      // alert(66);
      alert(errObject.message);
    },
    uploadStop() {
      this.uploading = false;
      this.up.stop();
    },
    //初始化pluploader
    initPlUploader() {
      this.plUploader = new plupload.Uploader({
        runtimes: "html5,flash,silverlight,html4",
        url: this.server_config,
        browse_button: "browse_button",
        drop_element: "drop_element",
        chunk_size: "8MB",
        filters: {
          prevent_duplicates: this.duplicates
        },
        init: {
          FilesAdded: this.filesAdded,
          BeforeUpload: this.beforeUpload,
          /* UploadProgress: this.uploadProgress,
             FileUploaded: this.fileUploaded,*/
          Error: this.error
        }
      });
      this.plUploader.init();
    },

    //文件预览，路径传递
    showFileMethod(index){
        this.path = this.tableData[index].url;
        alert(this.path);
        this.showFile = true;
    }
  },
  mounted: function() {
    //初始化文件上传
    this.initPlUploader();
    this.getFileMainMenu();
  }
};
</script>

<style scoped>
  #index{
    height:1000px;
    width:1350px;
  }
  .el-aside {
    background: lightgray;
    width: 200px;
  }

  .el-main {
    background: ghostwhite;
  }

  .el-input {
    width: 200px;
    border-radius: 6px;
  }

  .contentHead {
    font-size: 12px;
    color: gray;
    margin: 10px auto;
  }

  .operation {
    cursor: pointer
  }

  .folder {
    cursor: pointer;
  }

  .move {
    cursor: pointer
  }

  .rename {
    cursor: pointer
  }

  .upload {
    width: 700px;
    height: 400px;
    background: ghostwhite;
    box-shadow: -5px -5px 5px gainsboro;
    position: fixed;
    top: 200px;
    right: 20px;
    z-index: 999;
  }

  .simpleUpload {
    width: 700px;
    height: 90px;
    background: ghostwhite;
    box-shadow: -5px -5px 5px gainsboro;
    font-size: 15px;
    color: grey;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999;
    /*position: absolute;*/
  }

  .upload-header {
    background: ghostwhite;
    font-size: 15px;
    color: grey;
    margin-top: 10px;
  }

  .upload-content {
    margin-top: -43px;
  }

  .download {
    /*width: 500px;*/
    /*height: 200px;*/
    background: ghostwhite;
    box-shadow: -5px -5px 5px gainsboro;
    position: fixed;
    top: 100px;
    right: 10px;
    z-index: 999;
  }

</style>
