<template>
  <div ref="wrapper" class="wrappe">
    <ul class="conten">
      <li>...</li>
      <li>...</li>
    </ul>
  </div>
 </template>

<script>
  import BScroll from "better-scroll";

  export default {

    mounted () {
      this.scroll = new BScroll(this.$refs.wrapper, {
// 上拉加载
        pullUpLoad: {
// 当上拉距离超过30px时触发 pullingUp 事件
          threshold: -30
        },
// 下拉刷新
        pullDownRefresh: {
// 下拉距离超过30px触发pullingDown事件
          threshold: 30,
// 回弹停留在距离顶部20px的位置
          stop: 20
        }
      })
      this.scroll.on('pullingUp', () => {
        console.log('处理上拉加载操作')
        setTimeout(() => {
// 事情做完，需要调用此方法告诉 better-scroll 数据已加载，否则上拉事件只会执行一次
          this.scroll.finishPullUp()
        }, 2000)
      })
      this.scroll.on('pullingDown', () => {
        console.log('处理下拉刷新操作')
        setTimeout(() => {
          console.log('asfsaf')
// 事情做完，需要调用此方法告诉 better-scroll 数据已加载，否则下拉事件只会执行一次
          this.scroll.finishPullDown()
        }, 1000)
      })
    },
    methods: {

    },
  };
</script>

<style  scoped>
  /*对外层div进行了高度上的限制*/
  .wrappe {
    display: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height:300px;
    overflow:hidden;
  }
  .conten {
    width:100%;
    height:800px;
    background:blue;
  }
</style>
