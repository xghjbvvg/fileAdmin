<template>
  <el-container class="hello">
    <el-aside style="width: 200px;height: 800px;">
      <el-menu
      default-active="2"
      class="el-menu-vertical-demo">
      <el-menu-item index="1">
        <i class="el-icon-location"></i>
        <span slot="title"><router-link class="router-link" to="/home/smallFileUpload">小文件上传</router-link></span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title"><router-link class="router-link" to="/home/bigFileUpload">大文件上传</router-link></span>
      </el-menu-item>
    </el-menu>
    </el-aside>
    <el-main style="height: 800px;">
        <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        }
      }
    }
  }
}
</script>

<style scoped>
  .el-container{
    height:800px;
  }
  .el-aside{
    width:800px;
  }
  .el-menu{
    height:100%;
  }
  .el-main{
    /*background: lightgray;*/
    width:800px;
  }
  .router-link{
    text-decoration: none;
  }
</style>
