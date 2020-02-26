<template>
  <div id="note">
    <el-container>
      <el-row style="width:100%">
        <el-col :span="24">
          <vue-event-calendar :events="events"  @month-changed="monthChanged">
            <template scope="props">
              <div v-for="(event, index) in props.showEvents" class="event-item">
                <!-- 这里拿到的是传入的单个event所有数据 -->
                <div class="wrapper">
                  <h3 class="title">{{index+1}}.{{event.title}}</h3>
                  <p class="time">{{event.date}}</p>
                  <p class="desc">{{event.content}}</p>
                  <el-row >
                    <el-col :span="3" :offset="15">
                      <el-button @click="updateItem(index)" size="mini" round  icon="el-icon-edit"></el-button>
                    </el-col>
                    <span :span="3">
                       <el-button @click="deleteItem(index)" size="mini" round  icon="el-icon-delete"></el-button>
                    </span>
                   </el-row>
                </div>
              </div>
            </template>
          </vue-event-calendar>
        </el-col>
      </el-row>
    </el-container>
    <el-footer>
      <el-row style="text-align: center;color: grey;font-size: 20px;">
        <el-col :span="16">
         <router-link to="/more/noteWrite" style="color: grey">事件编写</router-link>
        </el-col>
      </el-row>

    </el-footer>
  </div>
</template>

<script>

  import  axios from 'axios'
  import vueCookie from 'vue-cookies'
  import router from '../../../router'


  export default {
    name: "note",
    data() {
      return {
        value: '',
        events: [],
        user: JSON.parse(sessionStorage.getItem("user")),
      }
    },
    components: {},
    methods:{
      monthChanged(date) {

        let year = date.substr(0,4);
        let month = date.substr(5,7).substr(0,2);
        let date1 = new Date();
        date1.setMonth(month-1);
        date1.setFullYear(year);
        this.getAll(date1);
      },
      clickDay(data) {
        console.log(data); //选中某天
      },
      changeDate(data) {
        console.log(data); //左右点击切换月份
      },
      clickToday(data) {
        console.log(data); // 跳到了本月
      },
      updateItem(index) {
        router.push({path: '/more/noteWrite', query: {id: this.events[index].id}});
      },
      deleteItem(index) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            url: '/api/more/note/delete',
            method: 'post',
            params: {
              access_token: vueCookie.get('access_token'),
              id:this.events[index].id
            },
          }).then((res)=>{
            if(res.data){
              this.$message({
                type:'success',
                message:'删除成功'
              });
              this.events.splice(index,1);
            }else{
              this.$message({
                type:'warning',
                message:'删除错误'
              })
            }
          }).catch((err)=>{
            console.log(err);

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });




      },
      getAll(date){
        axios({
          url: '/api/more/note/getAll',
          method: 'post',
          data:{
            dateVo: date,
            user:{
              id:this.user.id
            }
          },
          params: {
            access_token: vueCookie.get('access_token'),
          },
        }).then((res)=>{
          this.events = res.data;
          console.log(this.events);
        }).catch((err)=>{
          console.log(err)
          this.$message({
            type:'warning',
            message:'加载错误'+err
          })
        })
      }
    },
    mounted(){
      this.getAll(new Date());
    }
  }
</script>

<style>
  .__vev_calendar-wrapper {

  }
  .__vev_calendar-wrapper{
    width:200%
  }
  .__vev_calendar-wrapper .cal-wrapper {
    width:40%;
    padding: 30px 20px;
  }
  .__vev_calendar-wrapper .events-wrapper{

  }
</style>
<style scoped>

  .el-calendar {
    width: 350px;
    text-align: center;
    padding-left: 30px;

  }
</style>
