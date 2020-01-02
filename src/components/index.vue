<template>
  <el-container>
    <el-header>
      <UserLoginExpire/>
      <Header/>
    </el-header>
    <el-container>
      <el-aside style="width: 200px;">
        <Aside v-on:tableData="receiveAsideData" :uploadPath="uploadPath" style="height: 100%"/>
      </el-aside>
      <el-main style="position: relative">
        <div id="drop_element">
          <!--文件显示-->

          <!--上传下载等功能-->
          <el-row>
            <el-col :span="12">
              <el-button id="browse_button"><i class="el-icon-upload2"></i>上传文件</el-button>
              <el-button @click="open"><i class="el-icon-folder"></i>新建文件夹</el-button>
              <el-button @click="downloadMultipleFile"><i class="el-icon-download"></i>下载文件</el-button>
            </el-col>
            <el-col :offset="6" :span="4">
              <el-input v-model="input" @input="findFileByKeyword" placeholder="search..."/>
            </el-col>
          </el-row>
          <!--文件路径显示-->
          <el-row class="contentHead">
            <el-col :span="18">
              <span style=" color:#66b1ff;font-size: 15px;cursor:pointer;" @click="getFileMainMenu">主目录></span>
              <span style="display: inline" v-for="(item,index) in currentPath">
                  <BackPathItem v-on:msg="receiveChildData" :index="index" :completedPath="item"/>
                </span>
            </el-col>
            <el-col :span="3" :offset="3">
              已全部加载，共{{tableData.length}}个
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
                @selection-change="handleSelectionChange">
                <!--多项选择-->
                <el-table-column
                  type="selection"
                  width="60">
                </el-table-column>
                <!--文件名-->
                <el-table-column
                  label="文件名"
                  width="400">
                  <template slot-scope="scope">
                    <span>
                      <div v-if="scope.row.isFolder" class="folder"
                           @click="toNext($event,scope.row.parentPath, scope.row.absolutePath)">
                        <i class="el-icon-folder"></i>
                        {{ scope.row.name }}
                      </div>
                      <div v-else>
                        {{ scope.row.name }}
                      </div>
                    </span>
                  </template>
                </el-table-column>
                <!--大小-->
                <el-table-column
                  prop="size"
                  label="大小"
                  width="100">
                  <template slot-scope="scope">{{ scope.row.size }}</template>
                </el-table-column>
                <!--修改日期-->
                <el-table-column
                  prop="date"
                  label="修改日期"
                  width="175"
                  show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="200"
                >
                  <template slot-scope="scope">
                    <i class="el-icon-delete" @click="deleteMenuFile(scope.$index)"></i>
                    <span class="operation" v-if="!scope.row.isFolder">
                              &nbsp;
                              <span v-if="!scope.row.isFolder">
                                <i class="el-icon-download" @click="downloadFile(scope.$index)"></i>
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

          <!--文件上传组件页面-->
          <el-container class="upload" v-if="flag&&uploadStyle">
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
              <el-table
                :data=files
                style="width: 100%; margin: 10px 10px;">
                <el-table-column
                  label="文件名">
                  <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="大小">
                  <template slot-scope="scope">
                    <span>{{scope.row.size}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status === -1">正在计算MD5</span>
                    <span v-if="scope.row.status === 1">
              MD5计算完成，准备上传
          </span>
                    <span v-if="scope.row.status === 4" style="color: brown">上传失败</span>
                    <span v-if="scope.row.status === 5" style="color: chartreuse">已上传</span>
                    <el-progress v-if="scope.row.status === 2" :text-inside="true" :stroke-width="20"
                                 :percentage="scope.row.percent"></el-progress>
                  </template>
                </el-table-column>
                <!--操作-->
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                      <span @click="deleteFile(scope.row.id,scope.$index)">
                        <i class="el-icon-delete"></i>
                      </span>
                  </template>
                </el-table-column>
              </el-table>
              <br/>

              <el-button :disabled="false" type="danger" @click="uploadStart()">开始上传</el-button>
              <el-button :disabled="!uploading" type="warring" @click="uploadStop()">暂停上传</el-button>
            </el-main>
          </el-container>

          <el-container class="simpleUpload" v-if="flag&&!uploadStyle">
            <el-header class="upload-header">
              <el-col :span="3">上传</el-col>
              <el-col :span="1" :offset="19">
                <i class="el-icon-copy-document" @click="changeUploadStyle"></i>
              </el-col>
              <el-col :span="1">
                <i class="el-icon-close" @click="removeUpload"></i>
              </el-col>
            </el-header>
            <el-main style="margin-top: -40px">
              <el-row>
                总共{{files.length}}文件
              </el-row>
            </el-main>
          </el-container>
        </div>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import HelloWorld from './test/HelloWorld'
  import axios from 'axios'
  import FileMd5 from '../models/file-md5.js'
  import plupload from 'plupload'
  import BackPathItem from './home/BackPathItem'
  import ElSlPanel from "element-ui/packages/color-picker/src/components/sv-panel";
  import Aside from "./home/Aside";
  import Header from "./home/Header";
  import Download from "./home/Download";
  import VuexDemo from './test/VuexDemo'
  import UserLoginExpire from'./user/UserLoginExpire'

  export default {
    name: "index",
    components: {UserLoginExpire,VuexDemo, Download, Header, Aside, ElSlPanel, HelloWorld, BackPathItem},
    data() {
      return {
        input: '',
        count: 0,
        tableData: [{
          name: 'hcx',
          size: '12kb',
          date: '2102-8-9'

        },],
        multipleSelection: [],
        currentPath: ['全部文件'],
        sizeFlag: true,
        dateFlag: true,

        downloadFlag: true,

        //upload模板是否显示
        flag: false,
        fileIsExist: '',
        uploadStyle: true,
        //http://120.78.88.169:8080
        //http://127.0.0.1:8081
        server_config: 'http://120.78.88.169:8080/fileUpload',
        uploadPath: '',
        up: {},
        files: [],
        // tableData: [],
        dialogTableVisible: false,
        //控制开启与结束上传按钮是否可以点击
        uploading: false,
        //控制是否可以重复上传
        duplicates: false,
      }
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
          this.files.forEach((e) => {
            console.log(e);
            this.tableData.push({
              name: e.name,
              size: e.size,
              status: e.status,
              id: e.id,
              percent: e.percent
            });
          })
          this.tableData = this.unique(this.tableData);
          // if(!this.fileIsExist){
          //   this.uploadStart();
          // }

        },
        deep: true
      },
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
      toNext(event, parentPath, absolutePath) {
        this.currentPath.push(parentPath + absolutePath);
        //重设上传路径
        this.uploadPath = parentPath + absolutePath;
        //获得该路径下所有文件
        this.getTableDataByPath(parentPath + absolutePath)
      },


      //根据索引删除文件
      deleteMenuFile(index) {
        let confirm = window.confirm("are you sure ?");
        if (confirm) {
          axios({
            url: '/api/delete',
            method: 'post',
            params: {
              path: this.tableData[index].parentPath + this.tableData[index].absolutePath
            }
          })
            .then((msg) => {
              if (msg.data) {
                alert("文件删除成功");
              } else {
                alert("文件删除失败");
              }
            })
            .catch((error) => {
              console.log(error);
            })
        }
        this.tableData.splice(index, 1);
      },
      //删除操作
      delete(data) {
        let confirm = window.confirm("are you sure ?");
        if (confirm) {
          axios({
            url: '/api/delete',
            method: 'post',
            params: {
              path: this.data.parentPath + this.data.absolutePath
            }
          })
            .then((msg) => {
              if (msg.data) {
                alert("文件删除成功");
              } else {
                alert("文件删除失败");
              }
            })
            .catch((error) => {
              console.log(error);
            })
        }
      },
      //下载文件，引用download方法
      downloadFile(index) {
        let downloadList = this.$store.state.downloadList;
        let flag = false;
        downloadList.forEach((data) => {
          if (data.name === this.tableData[index].name) {
            alert("亲，下载文件已经存在");
            flag = true;
          }
        });
        if(!flag){
          this.$store.state.downloadList.push(this.tableData[index]);
        }
      },
      //下载实际操作
      download(path) {
        axios({
          url: '/api/download',
          method: 'get',
          responseType: 'blob',
          params: {
            filePath: path
          }
        })
          .then((res) => {
            console.log(res);
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
      //批量下载
      downloadMultipleFile() {
        this.multipleSelection.forEach((data, index) => {
          if (!data.isFolder) {
            let path = data.parentPath + data.absolutePath;
            this.download(path);
          }
        })
      },

      //重命名
      rename(index) {
        alert(index);
      },
      //接收子组件backPathItem的tableData值
      receiveChildData(msg) {
        if (msg.tableData.length === 0) {
          this.uploadPath = this.currentPath[msg.index];
          alert('此路径文件为空，上传路径：' + this.uploadPath);
        } else {
          this.uploadPath = this.currentPath[msg.index];
          alert('上传路径：' + this.uploadPath);
        }
        // this.uploadPath =msg.tableData[0].parentPath;
        this.tableData = msg.tableData;
        let index = msg.index;
        console.log(index);
        this.currentPath.splice(index + 1, this.currentPath.length);

      },
      //接收侧边栏数据
      receiveAsideData(tableData) {
        this.tableData = tableData;
      },
      //  查找根目录文件
      getFileMainMenu() {
        this.currentPath = [];
        axios({
          url: '/api/getMainMenu',
          method: 'get',
          header: {
            'content-type': 'application/json;charset=utf-8'
          }
        })
          .then((msg) => {
            //将上传路径
            this.uploadPath = msg.data[0].parentPath;
            // alert(this.uploadPath);
            this.tableData = msg.data;
            this.addFiled(this.tableData);
          })
          .catch((error) => {
            console.log(error);
          })

      },

      //获得指定路径的所有文件
      getTableDataByPath(path) {
        axios({
          url: '/api/getMenuByPath',
          method: 'get',
          params: {
            path: path
          },
          header: {
            'content-type': 'application/json;charset=utf-8'
          }
        })
          .then((msg) => {
            if (msg.data.length === 0) {
              // this.uploadPath = this.currentPath[this.currentPath.length];
              this.tableData = [];
            } else {
              // this.uploadPath = msg.data[0].parentPath;
              this.tableData = msg.data;
              this.addFiled(this.tableData);
            }

          })
          .catch((error) => {
            console.log(error);
          })

      },

      addFiled(tableData){
        tableData.forEach((data) => {
          data.download = 0;
          data.downloading = 0;
          data.percent = 0;
        })
      },

      //新建文件夹
      open() {
        this.$prompt('请输入文件名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '文件名为空'
        })
          .then(({value}) => {

            //判断文件是否重名
            let flag = true;
            let len = this.tableData.length;
            for (var j = 0; j < len; j++) {
              if (this.tableData[j].name === value) {
                flag = false;
              }
            }
            alert(flag);
            //文件不重名时执行
            if (flag) {
              axios({
                url: '/api/mkdir',
                method: 'post',
                params: {
                  path: this.uploadPath,
                  fileFolderName: '/' + value
                }
              })
                .then((msg) => {
                  this.$message({
                    type: 'success',
                    message: value + '文件夹创建成功 ',
                  });
                  this.getTableDataByPath(this.uploadPath);
                })
                .catch((error) => {
                  console.log(error);
                })
            } else {
              this.$message({
                type: 'warning',
                message: '文件重名'
              });
            }

          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          })
      },

      //根据api从后台获取信息（实际操作）
      sort(api) {
        axios({
          url: api,
          method: 'get',
          header: {
            'content-type': 'application/json;charset=utf-8'
          },
          params: {
            path: this.uploadPath,
          }
        })
          .then((msg) => {
            this.tableData = msg.data;
          })
          .catch((error) => {
            console.log(error);
          })
      },
      //根据表格点击信息重排序，调用sort方法，传入api地址
      sortTable(column, event) {
        // alert(column.label);
        //按照文件大小排序
        if (column.label === "大小") {
          //从小到大
          if (this.sizeFlag) {
            this.sort('/api/sortFileBySizeUp');
            this.sizeFlag = false;
            console.log(this.tableData);
          } else {
            //日期排序
            //从大到小
            this.sort('/api/sortFileBySizeDown');
            this.sizeFlag = true;
            console.log(this.tableData);
          }

        } else {
          //从早到晚
          if (this.dateFlag) {
            this.sort('/api/sortFileByDateUp');
            this.dateFlag = false;
          } else {
            //从晚到早
            this.sort('/api/sortFileByDateDown');
            this.dateFlag = true;
          }
        }
      },
      //根据关键字查找文件
      findFileByKeyword() {

        if (this.input === '') {
          this.getTableDataByPath(this.uploadPath);
        } else {
          axios({
            url: '/api/findFileByKey',
            method: 'get',
            header: {
              'content-type': 'application/json;charset=utf-8'
            },
            params: {
              path: this.uploadPath,
              keyword: this.input
            }
          })
            .then((msg) => {
              this.tableData = msg.data;
            })
            .catch((error) => {
              console.log(error);
            })
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
        up.setOption("multipart_params", {"size": file.size, "md5": file.md5, "relativePath": this.uploadPath});
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
        console.log('有新文件添加至队列');
        this.flag = true;
        files.forEach((f) => {
          f.status = -1;
          FileMd5(f.getNative(), (e, md5) => {
            f["md5"] = md5;
            f.status = 1;
            f.relativePath = this.uploadPath;
            axios({
              url: '/api/checkIsExist',
              method: 'get',
              params: {
                md5: f.md5
              },
              header: {'content-type': 'application/json;charset=utf-8'}
            })
              .then((msg) => {
                this.fileIsExist = !msg.data;
                if (this.fileIsExist) {
                  alert("亲，文件已经上传过了。。。。")
                  f.status = 5;
                } else {
                  this.uploadStart();
                }
              })
              .catch((error) => {
                console.log(error);
              })
          });
        });
        this.up = up;
        files.forEach((f) => {
          this.files.push(f);
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
          runtimes: 'html5,flash,silverlight,html4',
          url: this.server_config,
          browse_button: "browse_button",
          drop_element: "drop_element",
          chunk_size: "2MB",
          filters: {
            prevent_duplicates: this.duplicates,
          },
          init: {
            FilesAdded: this.filesAdded,
            BeforeUpload: this.beforeUpload,
            /* UploadProgress: this.uploadProgress,
             FileUploaded: this.fileUploaded,*/
            Error: this.error
          }
        })
        this.plUploader.init()
      }
    },
    mounted: function () {
      //初始化文件上传
      this.initPlUploader();
      this.getFileMainMenu();
    }
  }
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
    right: 10px;
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
    bottom: 30px;
    right: 50px;
    z-index: 999;
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
