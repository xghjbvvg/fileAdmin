<template>
    <div id="noteWrite">
      <el-row id="main">
        <el-row class="item">
          <el-col :span="24" style="text-align: center">
            <h2>事件记录</h2>
          </el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="2">
            <span class="demonstration">时间:</span>
          </el-col>
          <el-col :span="18">
            <div class="block">
              <el-date-picker
                v-model="date"
                align="right"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 100%;">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="2">
            <span class="demonstration">标题:</span>
          </el-col>
          <el-col :span="18">
            <el-input
              placeholder="请输入标题"
              v-model="title"
              maxlength="50"
              show-word-limit
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="2">
            <span class="demonstration">内容:</span>
          </el-col>
          <el-col :span="18">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="100"
              show-word-limit
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row style="text-align: center;margin-bottom: 50px">
          <el-col :span="12" >
            <el-button @click="save" type="primary">提交</el-button>
          </el-col>
          <el-col :span="12">
            <el-button @click="clear">清空</el-button>
          </el-col>
        </el-row>
      </el-row>
    </div>
</template>

<script>
  import  axios from 'axios'
  import vueCookie from 'vue-cookies'
  import router from '../../../router'
    export default {
      name: "noteWrite",
      data(){
          return{
            date:'',
            textarea:'',
            title:'',
            id:this.$route.query.id,
            user: JSON.parse(sessionStorage.getItem("user")),
          }
      },
      methods:{
        clear(){
          this.data = '0000-00-00';
          this.textarea = '';
          this.title = '';
        },
        save(){
          let note={
              id:this.id,
              date:this.date,
              title:this.title,
              content:this.textarea,
              user:{
                id:this.user.id
              }
            };
          let url = '';
          console.log(note);
          if(typeof(this.id) !== "undefined"){
            url = '/api/more/note/update';
          }else {
            url = '/api/more/note/save';
          }
            axios({
              url: url,
              method: 'post',
              data:note,
              params: {
                access_token: vueCookie.get('access_token'),
              },
            }).then((res)=>{
              if(res.data){
                this.$message({
                  type:'success',
                  message:'保存成功'
                });
                router.push('/more/note');
              }else{
                this.$message({
                  type:'warning',
                  message:'保存错误'
                })
              }
            }).catch((err)=>{
              console.log(err)
              this.$message({
                type:'warning',
                message:'加载错误'+err
              })
            })


        }
      },
      mounted(){

        if(typeof(this.id) !== "undefined"){
            axios({
              url: '/api/more/note/getById',
              method: 'post',
              params: {
                access_token: vueCookie.get('access_token'),
                id:this.id
              },
            }).then((res)=>{
              this.title = res.data.title;
              this.textarea = res.data.content;
              this.date = res.data.dateVo;
            }).catch((err)=>{
              console.log(err)
              this.$message({
                type:'warning',
                message:'加载错误'+err
              })
            })
        }
      }
    }
</script>

<style scoped>
  #noteWrite{
    width: 100%;
    height:100%;
    position: relative;
  }
  #main{
    box-shadow: 0 3px 11px 2px rgba(0,0,0,.1);
    background-color: #fff;
    border-radius: 5px;
    margin:50px auto;
    color: #323232;
    width:50%;
    height:100%;
  }
  .item{
    padding:15px;
  }

  .demonstration{
   text-align: center;
  }
</style>
