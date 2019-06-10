<template>
    <el-container>
      <el-menu :default-active="activeIndex" class="menu" mode="horizontal">
        <el-menu-item class="el-menu-demo" index="1">网盘</el-menu-item>
      </el-menu>
    </el-container>
</template>

<script>
    export default {
      name: "Header",
      data(){
          return{
            activeIndex:"1"
          }
      }
    }
</script>

<style scoped>
  .menu li{
    font-size:25px;
  }
.el-menu-demo{

}
</style>
