<template>
  <el-container>
    <VuexDemo/>
    <br/>
    <button @click="increment">click</button><br/>
    {{num}}
  </el-container>

</template>

<script>
  import {mapState,mapActions} from 'vuex';
  import VuexDemo from "./VuexDemo";
  export default {
    name: "Demo",
    components: {VuexDemo},
    computed: {
      ...mapState(['num'])
    },
    methods:{
      ...mapActions(['increment']),
    }
  }
</script>

<style scoped>

</style>
