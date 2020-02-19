<template>
  <div id="fileShare" v-drag v-if="this.$store.state.fileSharerFlag">
    <el-header style="height: 23px">
      <el-col >
        <i class="el-icon-close" @click="remove"></i>
      </el-col>
    </el-header>
    <el-container>
      <el-main>

        <div >
          <!--文件显示-->
          <!--文件路径显示-->
          <el-row>
            <span v-if="!show" style="color:lightslategray;font-size: 20px;font-weight:bolder">
            选择文件保存路径
            </span>
          </el-row>
          <el-row class="contentHead">
            <el-col :span="14" style=" color:#66b1ff;font-size: 15px;cursor:pointer;">
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
            <el-col :span="10" style="color: grey">
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
                           <span>
                            {{ scope.row.name }}
                          </span>
                        </div>
                      </span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-row>
        </div>
      </el-main>
    </el-container>
    <el-footer>
        <el-button @click="fileShare">
          确定
        </el-button>
      <el-button @click="remove">
        取消
      </el-button>
    </el-footer>
  </div>
</template>

<script>
  import axios from "axios";
  import VueCookie from "vue-cookies";

  export default {
    name: "fileSharer",
    directives:{
      drag:function(el){
        el.onmousedown = function(e){
          //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
          var divx = e.clientX - document.getElementById('fileShare').offsetLeft;
          var divy = e.clientY - document.getElementById('fileShare').offsetTop;
          //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
          document.onmousemove = function(e){
            //获取移动后div的位置：鼠标位置-divx/divy
            var l = e.clientX - divx;
            var t = e.clientY - divy;
            document.getElementById('fileShare').style.left=l+'px';
            document.getElementById('fileShare').style.top=t+'px';
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
        tableData: [],
        multipleSelection: [],
        currentPath: [],
        uploadPath: "",
        user: JSON.parse(sessionStorage.getItem("user")),
        isShow:this.$store.state.fileSharerFlag,
        flag:this.$store.getters.getShareOrSave
      }
    },
    computed:{
      show(){
        return this.$store.getters.getShareOrSave;
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
            this.uploadPath = msg.data[0].absolutePath;
            this.tableData = msg.data;
            if (!this.show) {
              for (let i = 0; i < msg.data.length; i++) {
                if (!msg.data[i].isFolder) {
                  this.tableData .splice(i, 1);
                }
              }
            }
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
              this.tableData = [];
            } else
              if (!this.show) {
              var temp = [];
                this.tableData = [].concat(msg.data);
                for (let i = 0; i < msg.data.length; i++) {
                  if (!msg.data[i].isFolder) {
                     //this.tableData .splice(i, 1);
                    delete this.tableData[i];
                    console.log(msg.data.length+":"+this.tableData.length);
                  }
                }

              }else{
                this.tableData = msg.data;
              }

            })
          .catch(error => {
            console.log(error);
          });
      },

      pathSkip(path, index) {
        this.currentPath.splice(index + 1);
        this.uploadPath = path;
        this.getTableDataByPath(path);
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

      remove(){
        this.isShow = false;
        this.$store.commit('setFileSharerFlag', false);

      },
      fileShare(){
        let temp = true;
        if(!this.show){
          //保存
          //var fileItem = this.$store.state.fileItem;
          if(this.multipleSelection.length === 0) {
            this.$message({
              message: '请勾选一个文件目录',
              type: 'warning'
            });
            temp = false;
            return;
          }
          if(this.multipleSelection.length > 1) {
            this.$message({
              message: '只能勾选一个文件目录',
              type: 'warning'
            });
            temp = false;
            return;
          }
        }
        this.$emit('receive',this.multipleSelection);
        if(temp){
          this.remove();
        }

      }
    },
    mounted() {
      this.getFileMainMenu();

    }
  }
</script>

<style scoped>
#fileShare{
  width: 550px;
  height: 500px;
  background: whitesmoke;
  /*box-shadow: -5px -5px -5px -5px gainsboro;*/
  position: fixed;
  top: 10%;
  right: 25%;
  bottom: 40%;
  z-index: 999;
  overflow-x: hidden;
  overflow-y: auto;
}

</style>
