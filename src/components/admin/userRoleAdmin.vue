<template>
    <div id="roleAdmin">
      <el-row>

        <el-col :span="5">
          <el-button @click=changeRole(1)>授权为管理员</el-button>
        </el-col>

        <el-col :span="5" >
          <el-button @click=changeRole(2)>授权为普通用户</el-button>
        </el-col>
        <el-col :span="2" style="color: grey;padding-top:5px">
          用户名：
        </el-col>
        <el-col :span="5" >
          <el-input v-model="username"
                    @keyup.enter.native="getByName"
                    placeholder="enter回车查找"
          ></el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button @click="getByName">查找</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="220">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="220">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="220">
        </el-table-column>
      </el-table>
    </div>
</template>

<script>

  import  axios from 'axios'
  import vueCookie from 'vue-cookies'

    export default {
      name: "userRoleAdmin",
      data(){
        return{
          tableData:[],
          username:'',
          selection:[],
          role:this.$route.query.role,

        }
      },
      watch:{
        $route() {
          this.role= this.$route.query.role; //获取传来的参数
          this.getUsersByRole(this.role)
        }
      },
      methods:{
        handleSelectionChange(rows){
          this.selection = rows;
        },
        getByName(){
          this.getUsers({username:this.username});
        },
        getUsers(user){
          axios({
            url: '/api/admin/getAllUser',
            method: 'post',
            data:user,
            params: {
              access_token: vueCookie.get('access_token'),
            },
          }).then((res)=>{
              this.tableData = res.data;
          }).catch(()=>{
              this.$message("用户加载失败");
          })
        },
        changeRole(flag){
          let uidList = [];
          for(let i = 0 ;i < this.selection.length;i++){
            uidList.push(this.selection[i].id);
          }
          console.log(uidList);
          axios({
            url: '/api/admin/changeRole',
            method: 'post',
            data:uidList,
            params: {
              roleId:flag,
              access_token: vueCookie.get('access_token'),
            },
          }).then((res)=>{
            if(res.data){
              this.$message({
                type:'success',
                message:'更新成功'
              });
              for(let i = this.tableData.length -1; i >= 0 ; i--){
                console.log(uidList.indexOf(this.tableData[i].id));
                console.log(this.tableData[i].id);
                if(uidList.indexOf(this.tableData[i].id) >= 0){
                  this.tableData.splice(i, 1);
                }
              }
            }else{
              this.$message("更新失败");
            }
          }).catch((err)=>{
            this.$message("更新失败"+err);
          })
        },
        getUsersByRole(role){
          axios({
            url: '/api/admin/getUsersByRole',
            method: 'post',
            params: {
              roleId:role,
              access_token: vueCookie.get('access_token'),
            },
          }).then((res)=>{
            this.tableData = res.data;
          }).catch(()=>{
            this.$message("用户加载失败");
          })
        }
      },
      mounted(){
        if(typeof (this.role) !== 'undefined'){
          this.getUsersByRole(this.role);
        }else{
          this.getUsers({});
        }

      }
    }
</script>

<style scoped>

</style>
