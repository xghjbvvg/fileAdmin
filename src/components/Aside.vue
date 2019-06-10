<template>
    <el-container>
      <el-menu style="width: 200px;height: 100%"
        default-active="2"
        class="el-menu-vertical-demo"
        >
        <el-menu-item index="1" @click="findFileByType(1)">
          <i class="el-icon-picture"></i>
          <span slot="title">图片</span>
        </el-menu-item>
        <el-menu-item index="2" @click="findFileByType(2)">
          <i class="el-icon-headset"></i>
          <span slot="title">音乐</span>
        </el-menu-item>
        <el-menu-item index="3" @click="findFileByType(3)">
          <i class="el-icon-video-camera-solid"></i>
          <span slot="title">视频</span>
        </el-menu-item>
        <el-menu-item index="4" @click="findFileByType(4)">
          <i class="el-icon-s-order"></i>
          <span slot="title">种子</span>
        </el-menu-item>
        <el-menu-item index="5" @click="findFileByType(5)">
          <i class="el-icon-paperclip"></i>
          <span slot="title">压缩</span>
        </el-menu-item>
        <el-menu-item index="6" @click="findFileByType(6)">
          <i class="el-icon-document"></i>
          <span slot="title">文档</span>
        </el-menu-item>
        <el-menu-item index="7" @click="findFileByType(7)">
          <i class="el-icon-question"></i>
          <span slot="title">其他</span>
        </el-menu-item>
      </el-menu>
    </el-container>
</template>

<script>
  import axios from 'axios'
    export default {
      name: "Aside",
      props:['uploadPath'],
      data(){
        return{
          path:''
        }
      },
      watch:{
        uploadPath:function(newVal,oldVal){
          this.path = newVal;
          // alert(this.path);
        }
      },
      methods:{
        findFileByType(num){
          // alert(this.path);
          axios({
            url:'/api/findFileByType',
            method:'get',
            params:{
              num:num,
              path:this.path
            }
          })
            .then((msg)=>{
              console.log(msg.data);
              this.$emit("tableData",msg.data);
            })
            .catch((error)=>{
              console.log(error);
            })
        }
      }
    }
</script>

<style scoped>

</style>
