<template>
  <div id="hope">

    <transition name="bounce">
      <div id="wishes" v-if="show">
        <h2>凡心所向</h2>
        <h2>
          <!--&nbsp;&nbsp;&nbsp;-->
          素履所往
        </h2>
        <h2>
          <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
          生如逆旅
        </h2>
        <h2>
          <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
          一苇以航
        </h2>
      </div>
    </transition>
  </div>
</template>

<script>
  import router from "../../router";

  export default {
    name: "hope",
    data(){
      return{
        show:false,
      }
    },
    mounted(){
      this.show = true;
      this.$message("15秒后将跳转页面，请稍后");
      window.setTimeout(()=>{
        this.show = false;
        window.setTimeout(()=>{
          //router.push('/more/time');
        },5000)
      },6000)
    }
  }
</script>

<style scoped>
  #hope {
    margin-top:-20px;
    width: 100%;
    height: 600px;
    background-image: url("../../assets/img/more/poppy-seed-1080x720.jpg");
    background-size: cover;
    position: relative;
  }

  /*.fade-enter-active, .fade-leave-active {
    transition: opacity 3s;
  }
  .fade-enter, .fade-leave-to !* .fade-leave-active below version 2.1.8 *! {
    opacity: 0;
  }*/
  #wishes{
    font-family: "Times New Roman", Times, serif;
    color: #323232;
    left:50%;
    text-align: center;
    padding-top:10%;
    font-size: larger;
  }

  .bounce-enter-active {
    animation: bounce-in 4.5s;
  }
  .bounce-leave-active {
    animation: bounce-in 4.5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }


</style>
