<template>
    <div id="vuex">
      {{num}}
      <!-- mutations:commit   acitions: dispatch-->
      <button @click="increment">+1</button><br/>
      <!--getters:{{getDownload}}<br/>-->
      <!--{{downloadList.length}}-->
      <!--{{this.$store.state.downloadList.length}}-->
      <!--<button @click="getDownload">click</button>-->
    </div>
</template>

<script>
  import {mapState,mapActions,mapGetters,mapMutations} from 'vuex'
    export default {
      name: "VuexDemo",
      computed:{
        ...mapState({
          num:state =>state.num,
          downloadList : state => state.downloadList
        }),
        // ...mapGetters('a',['addTwo']),
        // ...mapGetters(['getDownload'])
      },
      methods:{
        ...mapActions(['increment']),
        ...mapMutations(['getDownload']),
        add(){
          this.$store.state.a.num = 56;
        },
        alertListLength(){
          console.log(this.$store.state.downloadList);
        }
      }
    }
</script>

<style scoped>

</style>
