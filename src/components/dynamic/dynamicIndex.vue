<template>
  <div id="dynamicIndex">
    <el-container>
      <el-main style="text-align: center">
        <el-row v-if="arr1.length === 0" style="color:grey">
          <img src="../../assets/img/enpty.png"/>
          <div>what's life without whimsy</div>
          <div>不为无益之事，何以遣有涯之生</div>
        </el-row>
        <el-row v-else>
          <el-col :span="8" ref="arr1">
            <el-row class="content" v-for="(item,index) in arr1">

              <el-col v-if="item.firstImage.length !== 0">
                <img style="align-items: center" :src="item.firstImage" width="320px" height="250px"/>
              </el-col>
              <el-col>
                <span style="font-size: 13px;color:grey">
                  <router-link :to="{name:'dynamicDetail',query:{'id':item.id}}">{{item.content}}</router-link>
                </span>
              </el-col>
              <el-col style="font-size: 13px;color:grey;margin-top:10px">
                <span>{{item.date}}</span>
                <span style="float:right;">
                    来源：
                    <span style="color:#141414">
                      {{item.user.username}}
                    </span>
                  </span>
              </el-col>
            </el-row>
            <div :id="index"></div>
          </el-col>
          <el-col :span="8" ref="arr2">
            <el-row class="content" v-for="(item,index) in arr2">
              <el-col v-if="item.firstImage.length !== 0">
                <img style="align-items: center" :src="item.firstImage" width="320px" height="250px"/>
              </el-col>
              <el-col>
                <span style="font-size: 13px;color:grey">

                  <router-link :to="{name:'dynamicDetail',query:{'id':item.id}}">{{item.content}}</router-link>
                </span>
              </el-col>
              <el-col style="font-size: 13px;color:grey">
                <span>{{item.date}}</span>
                <span style="float:right;">
                    来源：
                    <span style="color:#141414">
                      {{item.user.username}}
                    </span>
                  </span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" ref="arr3">
            <el-row class="content" v-for="(item,index) in arr3">
              <el-col v-if="item.firstImage.length !== 0">
                <img style="align-items: center" :src="item.firstImage" width="320px" height="250px"/>
              </el-col>
              <el-col>
                <span style="font-size: 13px;color:grey">
                  <router-link :to="{name:'dynamicDetail',query:{'id':item.id}}">{{item.content}}</router-link>
                </span>
              </el-col>
              <el-col style="font-size: 13px;color:grey">
                <span>{{item.date}}</span>
                <span style="float:right;">
                    来源：
                    <span style="color:#141414">
                      {{item.user.username}}
                    </span>
                  </span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </el-main>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import vueCookie from 'vue-cookies'

  export default {
    name: "dynamicIndex",
    created() {

    },
    data() {
      return {
        dynamicList: [],
        index: '',
        arr1: [],
        arr2: [],
        arr3: [],
        user: JSON.parse(sessionStorage.getItem("user")),
        currentPage: 1,
        flag: true
      }
    },
    methods: {

      getAllDynamic(currentPage) {
        this.$message('正在玩命加载中，请稍后。。。');
        axios({
          url: '/api/dynamic/getAllDynamic',
          method: 'post',
          params: {
            access_token: vueCookie.get('access_token'),
            uid: this.user.id,
            currentPage: currentPage
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.length !== 0) {
              for (let i = 0; i < res.data[0].length; i++) {
                if (typeof (res.data[0]) !== 'undefined') {
                  this.arr1.splice(this.arr1.length, 0, res.data[0][i]);
                }
                if (typeof (res.data[1]) !== 'undefined') {
                  this.arr2.splice(this.arr2.length, 0, res.data[1][i]);
                }
                if (typeof (res.data[2]) !== 'undefined') {
                  this.arr3.splice(this.arr3.length, 0, res.data[2][i]);
                }
              }

            } else {
              this.flag = false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: '加载失败' + err
            })
          })
      },
      /**
       * 三列数据调整
       * */
      checkHeight() {
        let arr1Height = this.$refs.arr1.$el.offsetHeight;
        let arr2Height = this.$refs.arr2.$el.offsetHeight;
        let arr3Height = this.$refs.arr3.$el.offsetHeight;
        var max = Math.max(arr1Height, arr2Height, arr3Height);
        var min = Math.min(arr1Height, arr2Height, arr3Height);

        if (max - min > 500) {
          if (max === arr1Height) {
            if (min === arr2Height) {
              //arr1 max;arr2 min
              this.moveArr(this.arr1, this.arr2);
            } else {
              //arr1 max;arr3 min
              this.moveArr(this.arr1, this.arr3);
            }
          } else if (max === arr2Height) {
            if (min === arr1Height) {
              //arr2 max;arr1 min
              this.moveArr(this.arr2, this.arr1);
            } else {
              //arr2 max;arr3 min
              this.moveArr(this.arr2, this.arr3);
            }
          } else {
            if (min === arr1Height) {
              //arr3 max;arr1 min
              this.moveArr(this.arr3, this.arr1);
            } else {
              //arr3 max;arr2 min
              this.moveArr(this.arr3, this.arr1);
            }
          }
        }

        console.log(arr1Height + ":" + arr2Height + ":" + arr3Height);
      },
      /**
       *
       * @param arr1 max
       * @param arr2 min
       */
      moveArr(arr1, arr2) {
        arr2.splice(arr2.length, 0, arr1[arr1.length - 1]);
        arr1.splice(arr1.length - 1, 1);
      }
    },
    updated() {
      this.checkHeight();
    },
    mounted() {
      this.getAllDynamic(1);

        window.onscroll = () => {
          if (this.$route.name === 'dynamicMain') {
            //变量scrollTop是滚动条滚动时，距离顶部的距离
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//变量windowHeight是可视区的高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
//变量scrollHeight是滚动条的总高度
            var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            //滚动条到底部的条件
            if (scrollTop + windowHeight === scrollHeight) {
              //写后台加载数据的函数
              //console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
              if (this.flag) {
                ++this.currentPage;
                this.getAllDynamic(this.currentPage);
              } else {
                this.$message("亲，到底了");
              }
            }
          }

        };



    }
  }
</script>


<style scoped>
  a {
    color: grey;
  }

  a:hover {
    color: black;
  }

  .content {
    border-bottom: 1px lightgrey solid;
    padding: auto auto;
    padding-right: 10px;
    margin: 10px 15px 15px 10px;
    word-wrap: break-word;
  }

  .content:hover {
    cursor: pointer;
    -webkit-transform: translate(0, -10px);
    -moz-transform: translate(0, -10px);
    -ms-transform: translate(0, -10px);
    -o-transform: translate(0, -10px);
    transform: translate(0, -10px);
  }

  .router-link-active {
    text-decoration: none;
  }
</style>
