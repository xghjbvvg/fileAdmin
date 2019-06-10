<template>
    <span id="backPathItem">
      <span class="path" @click='backPath(completedPath,index,$event)'>
        <span>
           {{completedPath.split('/')[completedPath.split('/').length-2]}}
        </span>
          >
      </span>
    </span>
</template>

<script>
  import axios from 'axios'
    export default {
      name: "BackPathItem",
      props:['completedPath','index'],
      data(){
        return{
            path:'',
            tableData:[],
        }
      },
      watch:{
        /*completedPath:function(newVal, oldVal){
          let split = newVal.split('/');
          alert(split.length);
          this.path = split[split.length];
        }*/
      },
      methods:{
        backPath(path,index,event){
          this.getFileByPath(path,index)
        },
        getFileByPath(path,index){
          axios({
            url:'/api/getMenuByPath',
            method:'get',
            params:{
              path:path
            },
            header:{
              'content-type':'application/json;charset=utf-8'
            }
          })
            .then((msg)=>{
              this.tableData = msg.data;
              // alert(msg.data.length);
              console.log(msg.data);
              this.$emit('tableData', this.tableData);
              this.$emit('msg',{'tableData':this.tableData,'index':index})
            })
            .catch((error)=>{
              console.log(error);
            })
        }
      }
    }
</script>

<style scoped>
.path{
  color:#66b1ff;
  font-size: 15px;
  cursor:pointer;
}
</style>
