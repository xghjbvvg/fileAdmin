<template>
  <div>
    <div id="drop_element" style="width: 100%;height: 200px;">
      <div style="height: 200px;width: 200px; border: gray 1px dashed;color: grey;">
        <i class="el-icon-plus" style="margin:89px 87px" ></i>
      </div>
    </div>
    <hr/>
    <el-button id="browse_button" type="primary">选择文件</el-button>
    <br/>
    <el-table
      :data=tableData
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
          <el-progress v-if="scope.row.status === 2" :text-inside="true" :stroke-width="20" :percentage="scope.row.percent"></el-progress>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
<!--
          <el-button type="primary" icon="el-icon-refresh" @click="uploadStart()" id="button">重试</el-button>
-->
          <el-button type="danger" @click="deleteFile(scope.row.id,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br/>

    <el-button :disabled="false" type="danger" @click="uploadStart()">开始上传</el-button>
    <el-button :disabled="!uploading" type="warring" @click="uploadStop()">暂停上传</el-button>
  </div>
</template>

<script>
  import FileMd5 from '../../models/file-md5.js'
  import plupload from 'plupload'
  import Upload from '../home/Uploader'
    export default {
      name: "BigFileUpload",
      data() {
        return {
          server_config: 'http://localhost:8081/fileUpload',
          up: {},
          files:[],
          tableData: [],
          dialogTableVisible: false,
          uploading: false,
          duplicates:false,
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
            this.tableData = [];
            this.files.forEach((e) => {
              this.tableData.push({
                name: e.name,
                size: e.size,
                status: e.status,
                id: e.id,
                percent: e.percent
              });
            });
          },
          deep: true
        },
      },
      components:{Upload},
      methods: {
        inputUploader(up) {
          this.up = up;
          this.files = up.files;
        },
        beforeUpload(up, file) {
          up.setOption("multipart_params", {"size":file.size,"md5":file.md5});
        },
        filesAdded: function(up, files) {
          console.log('有新文件添加至队列');
          files.forEach((f) => {
            f.status = -1;
            FileMd5(f.getNative(), (e, md5) => {
              f["md5"] = md5;
              f.status = 1;
              axios({
                url: '/api/checkIsExist',
                method: 'get',
                params: {
                  md5: f.md5
                },
                header:{'content-type':'application/json;charset=utf-8'}
              })
                .then((msg)=>{
                  if(!msg.data){
                    alert("亲，文件已经上传过了。。。。")
                    f.status =5;
                  }else{
                    this.uploadStart();
                  }
                })
                .catch((error)=>{
                  console.log(error);
                })
            });
          });

          console.log(this.files);
          this.up = up;
          files.forEach((f)=>{
            this.files .push(f) ;
          });
        },

        deleteFile(id,index) {
          let file = this.up.getFile(id);
          this.up.removeFile(file);
          this.files.splice(index,1);
          this.tableData.splice(index,1);
        },
        uploadStart() {
          if (this.files.length === 0){
            alert("亲，木有文件上传。。。。。")
          } else{
            this.uploading = true;
            this.up.start();
          }
        },
        error(uploader,errObject){
          // this.duplicates = true;
          alert(66);
          // alert(errObject.message);

        },
        uploadStop() {
          this.uploading = false;
          this.up.stop();
        },
        initPlUploader(){
          this.plUploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            url: this.server_config,
            browse_button: "browse_button",
            drop_element:"drop_element",
            chunk_size:"2MB",
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
      mounted:function(){
        this.initPlUploader()
      }
    }
</script>

<style scoped>
#button{
  width:74px;
  padding-left:12px;
}
</style>
