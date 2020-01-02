<template>
    <div id="passwordProtect">
      <el-row>
        <el-col :span="8">
            <img src="../../assets/img/email.jpg" width="150" height="150"/>
        </el-col>
        <el-col :span="14" style="margin-top: 50px">
          <el-row>
            <el-col :span="20">
              新邮箱：<el-input  style="width: 200px" v-model="email" placeholder="请输入邮箱"></el-input>
            </el-col>
          </el-row>

          <el-row style="margin-top: 15px">
              <el-col :span="8" >
                <el-button style="margin-left: 50px;" @click="updateEmail">提交</el-button>
              </el-col>
            </el-row>
        </el-col>
      </el-row>
      <hr/>
      <el-row>
        <el-col :span="8">
          <img src="../../assets/img/1109709.gif" width="150" height="150"/>
        </el-col>
        <el-col :span="14" style="margin-top: 50px">
          <el-row>
            <el-col :span="20">
              新号码：<el-input style="width:200px" v-model="phone" placeholder="请输入号码"></el-input>
            </el-col>
          </el-row>

          <el-row style="margin-top: 15px">
            <el-col :span="8" >
              <el-button style="margin-left: 50px;" @click="updatePhone">提交</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import vueCookie from 'vue-cookies'
  import axios from 'axios'
  export default {
    name: "passwordProtect",
    data(){
      return{
        phone:"",
        email:"",
        user:{}
      }
    },
    methods:{
     updateEmail(){
       if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.email))) {
         callback(new Error('邮箱格式不正确!'));
       }else{
         axios({
           url:'/api/user/updateEmail',
           method:'post',
           params:{
             access_token:vueCookie.get('access_token'),
             id:this.user.id,
             username:this.user.username,
             email:this.email
           },
         }).then(()=>{
           this.$message({
             message: '更新邮箱成功',
             type: 'success'
           })
           this.user.email = this.email;
           sessionStorage.setItem('user',JSON.stringify(this.user));
         }).catch(()=>{
           this.$message({
             message: '更新邮箱失败',
             type: 'warning'
           })
         })
       }

     },
      updatePhone(){
        if(!(/^1[3456789]\d{9}$/.test(this.phone))){
          callback(new Error('手机号码有误，请重填'));
        }else{
          axios({
            url:'/api/user/updatePhone',
            method:'post',
            params:{
              access_token:vueCookie.get('access_token'),
              id:this.user.id,
              username:this.user.username,
              phone:this.phone
            },
          }).then(()=>{
            this.$message({
              message: '更新电话成功',
              type: 'success'
            })

            this.user.phone = this.phone;
            sessionStorage.setItem('user',JSON.stringify(this.user));
          }).catch(()=>{
            this.$message({
              message: '更新电话失败',
              type: 'error'
            })
          })
        }

      }
    },
    mounted(){
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }
  }
</script>

<style scoped>

</style>
