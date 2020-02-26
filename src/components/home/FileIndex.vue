<template>
  <el-container>
    <el-aside style="width: 183px;">
      <Aside
        v-on:tableData="receiveAsideData"
        :uploadPath="uploadPath"
        :userId="user.id"
        style="height: 100%"
      />
    </el-aside>
    <el-main>
      <div id="drop_element">
        <!--文件显示-->

        <!--上传下载等功能-->
        <el-row>
          <el-col :span="12">
            <el-button id="browse_button"
            ><i class="el-icon-upload2"></i>上传文件
            </el-button
            >
            <el-button @click="open"
            ><i class="el-icon-folder"></i>新建文件夹
            </el-button
            >
            <el-button @click="downloadMultipleFile"
            ><i class="el-icon-download"></i>下载文件
            </el-button
            >
          </el-col>
          <el-col :offset="6" :span="4">
            <el-input
              v-model="input"
              @input="findFileByKeyword"
              placeholder="search..."
            />
          </el-col>
        </el-row>
        <!--文件路径显示-->
        <el-row class="contentHead">
          <el-col :span="18" style=" color:#66b1ff;font-size: 15px;cursor:pointer;">
                <span

                  @click="getFileMainMenu"
                >主目录></span>
            <span
              style="display: inline"
              v-for="(item, index) in currentPath"
            >
                  <span @click="pathSkip(item,index)">{{item.split("/")[item.split("/").length-1]}}></span>
                </span>
          </el-col>
          <el-col :span="4" :offset="2">
            已全部加载，共{{ tableData.length }}个
          </el-col>
        </el-row>
        <!--文件主体-->
        <el-row>
          <template>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @header-click="sortTable"
              @selection-change="handleSelectionChange"
            >
              <!--多项选择-->
              <el-table-column type="selection" width="60">
              </el-table-column>
              <!--文件名-->
              <el-table-column label="文件名" width="400">
                <template slot-scope="scope">
                      <span>
                        <div
                          v-if="scope.row.isFolder"
                          class="folder"
                          @click="
                            toNext(
                              $event,
                              scope.row.path,
                            )
                          "
                        >
                          <i class="el-icon-folder"></i>
                          {{ scope.row.name }}
                        </div>
                        <div v-else>
                          <span @click="showFileMethod(scope.$index)">
                            {{ scope.row.name }}
                          </span>
                        </div>
                      </span>
                </template>
              </el-table-column>
              <!--大小-->
              <el-table-column prop="size" label="大小" width="100">
                <template slot-scope="scope">{{ scope.row.size }}</template>
              </el-table-column>
              <!--修改日期-->
              <el-table-column
                prop="date"
                label="修改日期"
                width="175"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{formatDate(scope.row.date ) }}</template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <i
                    class="el-icon-delete"
                    @click="deleteMenuFile(scope.$index)"
                  ></i>
                  <span class="operation" v-if="!scope.row.isFolder">
                        &nbsp;
                        <span v-if="!scope.row.isFolder">
                          <i
                            class="el-icon-download"

                            @click="downloadFile(scope.$index)"
                          ></i>
                        </span>

                        &nbsp;
                      </span>
                  <i class="el-icon-more-outline"></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-row>


        <el-container v-if="downloadFlag">
          <Download class="download"/>
        </el-container>
        <!--文件预览-->
        <el-container v-show="showFile">
          <FileShower :path="path" :showFile="showFile"/>
        </el-container>

        <!--文件上传组件页面-->
        <el-container class="upload" v-if="flag && uploadStyle">
          <el-header class="upload-header">
            <el-col :span="3">上传</el-col>
            <el-col :span="1" :offset="19">
              <i class="el-icon-minus" @click="changeUploadStyle"></i>
            </el-col>
            <el-col :span="1">
              <i class="el-icon-close" @click="removeUpload"></i>
            </el-col>
          </el-header>
          <el-main class="upload-content">
            <el-table :data="files" style="width: 100%; margin: 10px 10px;">
              <el-table-column label="文件名">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="大小">
                <template slot-scope="scope">
                  <span>{{ scope.row.size }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === -1">正在计算MD5</span>
                  <span v-if="scope.row.status === 1">
                        MD5计算完成，准备上传
                      </span>
                  <span v-if="scope.row.status === 4" style="color: brown"
                  >上传失败</span
                  >
                  <span
                    v-if="scope.row.status === 5"
                    style="color: chartreuse"
                  >已上传</span
                  >
                  <el-progress
                    v-if="scope.row.status === 2"
                    :text-inside="true"
                    :stroke-width="20"
                    :percentage="percent"
                  ></el-progress>
                </template>
              </el-table-column>
              <!--操作-->
              <el-table-column label="操作">
                <template slot-scope="scope">
                      <span @click="deleteFile(scope.row.id, scope.$index)">
                        <i class="el-icon-delete"></i>
                      </span>
                </template>
              </el-table-column>
            </el-table>
            <br/>

            <el-button
              :disabled="false"
              type="danger"
              @click="uploadStart()"
            >开始上传
            </el-button
            >
            <el-button
              :disabled="!uploading"
              type="warring"
              @click="uploadStop()"
            >暂停上传
            </el-button
            >
          </el-main>
        </el-container>

        <el-container id="drag" class="simpleUpload" v-drag v-if="flag && !uploadStyle">
          <el-header class="upload-header">
            <el-col :span="3">上传</el-col>
            <el-col :span="1" :offset="19">
              <i
                class="el-icon-copy-document"
                @click="changeUploadStyle"
              ></i>
            </el-col>
            <el-col :span="1">
              <i class="el-icon-close" @click="removeUpload"></i>
            </el-col>
          </el-header>
          <el-main style="margin-top: -40px">
            <el-row> 总共{{ files.length }}文件</el-row>
          </el-main>
        </el-container>
      </div>
    </el-main>
  </el-container>

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
  import SWF from "../../models/dfa.js";
  import VueCookie from "vue-cookies";
  import FileShower from "./FileShower";

  var fs = require("fs");


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
    directives: {
      drag: function (el) {
        el.onmousedown = function (e) {
          //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
          var divx = e.clientX - document.getElementById('drag').offsetLeft;
          var divy = e.clientY - document.getElementById('drag').offsetTop;
          //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
          document.onmousemove = function (e) {
            //获取移动后div的位置：鼠标位置-divx/divy
            var l = e.clientX - divx;
            var t = e.clientY - divy;
            document.getElementById('drag').style.left = l + 'px';
            document.getElementById('drag').style.top = t + 'px';
          }
          document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
          }
        }
      }
    },
    data() {
      return {
        showFile: false,
        username: VueCookie.get("username"),
        user: JSON.parse(sessionStorage.getItem("user")),
        input: "",
        count: 0,
        tableData: [
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
        rootPath: "",
        up: {},
        files: [],
        // tableData: [],
        dialogTableVisible: false,
        //控制开启与结束上传按钮是否可以点击
        uploading: false,
        //控制是否可以重复上传
        duplicates: false,
        //图片文件路径
        path: '',
        filterWord: [],
        percent:0,
        uploadFilePath:new Map(),
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
          /*this.files.forEach(e => {
            //console.log(e);
            this.tableData.push({
              name: e.name,
              size: e.size,
              status: e.status,
              id: e.id
            });
          });
          this.tableData = this.unique(this.tableData);*/
          // if(!this.fileIsExist){
          //   this.uploadStart();
          // }
        },
        deep: true
      }
    },
    methods: {
      //格式化时间
      formatDate(date){
        var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate()-1,
          year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
      },
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
        //console.log(this.currentPath);
        //重设上传路径
        this.uploadPath = path;
        //获得该路径下所有文件
        this.getTableDataByPath(path);
      },

      //根据索引删除文件
      deleteMenuFile(index) {
        var confirm = window.confirm("are you sure ?");
        //console.log(this.tableData[index]);
        if (confirm) {
          // console.log(this.tableData[index]);
          axios({
            url: "/api/file/delete",
            method: "post",
            params: {
              access_token: VueCookie.get("access_token"),
              id: this.tableData[index].id,
              path: this.tableData[index].path,
              uid: this.user.id
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
              uid: this.user.id
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
            // console.log(res);
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
          } else {
            this.$message({
              type: 'warning',
              message: '亲，不支持下载文件夹哦'
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
        var i = 0;

        while(sessionStorage.getItem('user') === null){
          i++;
          if (i > 10000){
            break;
          }
          console.log(sessionStorage.getItem('user') === null);
        }
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
            this.uploadPath = msg.data[0].absolutePath;
            this.rootPath = msg.data[0].absolutePath;
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
            console.log(msg.data);
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
      //根据文件路径获取文件
      pathSkip(path, index) {
        this.currentPath.splice(index + 1);
        this.uploadPath = path;
        this.getTableDataByPath(path);
      },

      addFiled(tableData) {
        tableData.forEach(data => {
          data.download = 0;
          data.downloading = 0;
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
          .then(({value}) => {


            //判断文件是否重名
            let flag = true;
            let len = this.tableData.length;
            let regEn = /[`~!@#$%^&()_+<>?:.*"{}\/;'[\]]/im;
            let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if (regEn.test(value) || regCn.test(value)) {
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
            this.$message("正在创建，请稍后！！！");
            //文件不重名时执行
            if (flag) {
              axios({
                url: "/api/file/mkdir",
                method: "post",
                params: {
                  access_token: VueCookie.get("access_token"),
                  path: this.uploadPath,
                  fileFolderName: value,
                  uid: this.user.id
                }
              })
                .then(msg => {
                  this.$message({
                    type: "success",
                    message: value + "文件夹创建成功 "
                  });

                  if (this.uploadPath == this.rootPath) {
                    this.getFileMainMenu();
                  } else {
                    this.getTableDataByPath(this.uploadPath);
                  }

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
            path: this.uploadPath,
            uid: this.user.id,
            access_token: VueCookie.get("access_token")
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
            //console.log(this.tableData);
          } else {
            //日期排序
            //从大到小
            this.sort("/api/file/sortFileBySizeDown");
            this.sizeFlag = true;

            //console.log(this.tableData);
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

        var temp = this.uploadFilePath.get(file.md5);
        console.log(temp);
        if(typeof(temp) === 'undefined'){
          this.uploadFilePath.set(file.md5,this.uploadPath);
        }
        up.setOption("multipart_params", {
          uid: this.user.id,
          size: file.size,
          md5: file.md5,
          uploadPath: this.uploadFilePath.get(file.md5),
          access_token: VueCookie.get('access_token')
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

      filesAdded: function (up, files) {

        console.log("有新文件添加至队列");
        this.flag = true;
        files.forEach((f, index) => {
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
                uid: this.user.id
              },
              header: {"content-type": "application/json;charset=utf-8"}
            })
              .then(msg => {
                this.fileIsExist = !msg.data;

                if (this.fileIsExist) {
                  this.$message({
                    message: '亲，' + f.name + '文件已经上传过了。。。。',
                    type: 'warning'
                  });
                  f.status = 5;

                } else {
                  files.forEach(f => {
                    this.files.push(f);

                  });
                  this.uploadStart();
                }
              })
              .catch(error => {
                console.log(error);
              });

          });
          this.up = up;
        });

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
        this.getTableDataByPath(this.uploadPath);
        console.log(errObject.message);
        this.$message({
          type: 'warn',
          message: '含有违法信息或服务器异常，请联系管理员'
        });

      },
      uploadStop() {
        this.uploading = false;
        this.up.stop();
      },
      fileUploaded() {
        this.getTableDataByPath(this.uploadPath);
      },
      uploadProgress(uploader,file){
        console.log(file.percent);
        this.percent = file.percent;
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
            Error: this.error,
            FileUploaded: this.fileUploaded,
            UploadProgress:this.uploadProgress,
            //ChunkUploaded:this.chunkUploaded
          }
        });
        this.plUploader.init();
      },

      //文件预览，路径传递
      showFileMethod(index) {
        this.path = this.tableData[index].url;
        //alert(this.path);
        this.showFile = true;
      },

    },
    mounted: function () {

      //初始化文件上传
      this.initPlUploader();
      this.getFileMainMenu();

    }
  };
</script>

<style scoped>
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

