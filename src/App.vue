<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    /**
     * 初始化上传插件
     */
    name: "HelloWorld",
  }
</script>
<style>
  a:-webkit-any-link{
    text-decoration: none;
  }
  a{
    text-decoration: none;
  }
</style>
<style scoped>
  #app{
    width:100%;

    margin:0 0;
  }
</style>

