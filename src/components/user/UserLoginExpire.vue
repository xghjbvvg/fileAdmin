<template>
    <div id="userLoginExpire"></div>
</template>

<script>
  import vueCookie from 'vue-cookies'
  import axios from 'axios'
  import router from "../../router";

  export default {
        name: "UserLoginExpire",
      mounted(){
          axios({
            url:'/api/user/query',
            method:'get',
            params:{
              access_token:vueCookie.get('access_token'),
            },
          }).then(()=>{

          }).catch((err)=>{
            console.log(err.response.status);
            if(err.response.status === 401){
              router.push("/user/login")
              vueCookie.set('username','',-1);
              vueCookie.set('access_token','',-1);
            }
          })
      }

    }
</script>

<style scoped>

</style>
