<template>
  <div id="dynamicWriter">
    <el-row style="text-align: center;color:grey">
      <h2>动态发布</h2>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <template>
        <el-radio v-model="radio" label="1">全部可见</el-radio>
        <el-radio v-model="radio" label="2">好友可见</el-radio>
      </template>
    </el-row>
    <mavon-editor :toolbars="markdownOption" v-model="value" ref=markdown @save="$save" @change="$change" @imgAdd="$imgAdd" />

  </div>

</template>

<script>
  // import Tags from './Tags'
  import  axios from 'axios'
  import vueCookie from 'vue-cookies'
  import router from '../../router'
  export default {
    name: "dynamicWriter",
    data(){
      return{
        value:vueCookie.get('dynamicContent'),
        head:'',
        tags:[],
        firstImg:'',
        user:JSON.parse(sessionStorage.getItem("user")),
        markdownOption:{
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
        },
        radio:'1',
        flag:false,//保存跳转
      }
    },
    methods: {
      $change(value,render){
        this.value = value;
      },
      // 绑定@imgAdd event
      $imgAdd(pos, $file){
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('file', $file);
        this.markdownOption.save = false;
        axios({
          url:'/api/upload',
          method:'post',
          headers: { 'Content-Type': 'multipart/form-data' },
          params:{
            access_token:vueCookie.get('access_token'),
          },
          data:formdata
        }).then((url)=> {
          if(url.data){
            this.firstImg = url.data;
            console.log(this.firstImg);
            this.$refs.markdown.$img2Url(pos, url.data);
            this.markdownOption.save = true;
          }else{
            this.$message({
              'type':'warning',
              message:'图片上传失败，请重试'
            });
          }
        }).catch((err)=>{
          this.$message({
            'type':'warning',
            message:'图片上传失败，请重试'
          });
        })
      },
      $save(value,render){
        if(value.length !== 0){
          var dynamic = {
            content:value,
            htmlContent: render,
            visible: parseInt(this.radio),
            user:{
              id: this.user.id
            },
            firstImage: this.firstImg,
          };
          this.$message('正在保存中，请稍后。。。。');
          axios({
            url:'/api/dynamic/write',
            method:'post',
            data:dynamic,
            params:{
              access_token:vueCookie.get('access_token'),
            },
          })
            .then((res)=>{
              if(res.data){
                this.$message({
                  type:'success',
                  message:'保存成功'
                });
                vueCookie.remove('dynamicContent');
                router.push("/dynamic");
              }else{
                this.$message({
                  type:'warning',
                  message:'保存失败'
                })
              }

            })
            .catch((err)=>{
              this.$message({
                type:'warning',
                message:'保存失败'
              })
            })
        }else{
          this.$message("内容不能为空");
        }
      },
    },
    components:{},
    mounted(){

    },
    beforeRouteLeave(to,from,next){
      vueCookie.set("dynamicContent",this.value,86500);
      next();
    },
  }
</script>

<style scoped>

</style>
