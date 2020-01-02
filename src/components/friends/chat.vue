<template>
  <el-container>
    <el-header>
      <el-row style="text-align: right;background: #F5F5F5;height: 70px;padding-top: 20px;">
        <el-col :span="12">殇璃雪域</el-col>
        <el-col :span="11">
          <el-button>文件库</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="talk_con">
        <div class="chatlist">

          <div v-for="msg in messages">

            <!--message:{{msg.message}}&nbsp;from:{{msg.from}}&nbsp;to:{{to}}&nbsp;boolean:{{msg.from == to}}-->

            <div class="chatin" v-if="msg.from == to">
              <img width="40px" height="40px"
                src="https://ss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/netdisk.1.5f14a41b.xngdALbPHMrnb9LbPTPmRA.jpg">
              <span>{{msg.message}}</span>
            </div>

            <div class="chatout" v-if="msg.to === to">
              <img width="40px" height="40px"
                src="https://ss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/netdisk.1.5f14a41b.xngdALbPHMrnb9LbPTPmRA.jpg">
              <span>{{msg.message}}</span>
            </div>
          </div>

        </div>

      </div>


    </el-main>
    <el-footer>
      <el-row>
        <el-col :span="4">
          <el-button>分享文件</el-button>
        </el-col>
        <el-col :span="14">
          <el-input v-model="outMessage" @keyup.enter.native="sendMessage"></el-input>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-popover
            ref="popover"
            placement="right"
            width="250"
            trigger="click">
            <emotion @emotion="handleEmotion" :height="350"></emotion>
          </el-popover>

          <svg v-popover:popover t="1574585810330" class="icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="2000" width="200" height="200">
            <path
              d="M1024 512C1024 229.230208 794.769792 0 512 0 229.230208 0 0 229.230208 0 512 0 794.769792 229.230208 1024 512 1024 629.410831 1024 740.826187 984.331046 830.768465 912.686662 841.557579 904.092491 843.33693 888.379234 834.742758 877.590121 826.148587 866.801009 810.43533 865.021658 799.646219 873.615827 718.470035 938.277495 618.001779 974.048781 512 974.048781 256.817504 974.048781 49.951219 767.182496 49.951219 512 49.951219 256.817504 256.817504 49.951219 512 49.951219 767.182496 49.951219 974.048781 256.817504 974.048781 512 974.048781 599.492834 949.714859 683.336764 904.470807 755.960693 897.177109 767.668243 900.755245 783.071797 912.462793 790.365493 924.170342 797.659191 939.573897 794.081058 946.867595 782.373508 997.013826 701.880796 1024 608.898379 1024 512Z"
              p-id="2001"></path>
            <path
              d="M337.170731 499.512194C371.654852 499.512194 399.609756 471.557291 399.609756 437.073171 399.609756 402.58905 371.654852 374.634146 337.170731 374.634146 302.686611 374.634146 274.731708 402.58905 274.731708 437.073171 274.731708 471.557291 302.686611 499.512194 337.170731 499.512194ZM711.804879 499.512194C746.288998 499.512194 774.243902 471.557291 774.243902 437.073171 774.243902 402.58905 746.288998 374.634146 711.804879 374.634146 677.320757 374.634146 649.365854 402.58905 649.365854 437.073171 649.365854 471.557291 677.320757 499.512194 711.804879 499.512194Z"
              p-id="2002"></path>
            <path
              d="M352.788105 768.770967C396.165222 803.472661 453.151987 824.195121 524.487806 824.195121 595.823622 824.195121 652.810387 803.472661 696.187505 768.770967 722.700531 747.560546 738.882517 725.984565 746.631548 710.486505 752.800254 698.149092 747.799529 683.146916 735.462114 676.978208 723.124702 670.809502 708.122526 675.810227 701.953818 688.147642 701.03616 689.982957 698.492224 694.172969 694.165854 699.941463 686.602473 710.025971 676.927317 720.210345 664.983226 729.765617 630.311565 757.502948 584.273939 774.243902 524.487806 774.243902 464.70167 774.243902 418.664045 757.502948 383.992384 729.765617 372.048292 720.210345 362.373137 710.025971 354.809756 699.941463 350.483386 694.172969 347.93945 689.982957 347.021792 688.147642 340.853084 675.810227 325.850908 670.809502 313.513495 676.978208 301.176081 683.146916 296.175356 698.149092 302.344062 710.486505 310.093092 725.984565 326.275078 747.560546 352.788105 768.770967Z"
              p-id="2003"></path>
          </svg>
        </el-col>
        <el-col :span="3">
          <el-button @click="sendMessage">发送</el-button>
        </el-col>
      </el-row>

    </el-footer>
  </el-container>
</template>

<script>
  import Emotion from '@/components/Emotion/index'
  import VueCookie from 'vue-cookies';
  import Vue from 'vue';
  export default {
    created() {
      this.initWebSocket();

    },

    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    data() {
      return {
        //发送消息内容
        outMessage: '',
        //接收消息内容
        inMessage:'',

        messages:[],
        comment: '',
        date: new Date().toLocaleDateString(),
        websock: null,
        to:this.$route.query.friendId,
        access_token : VueCookie.get("access_token"),
        user: JSON.parse(sessionStorage.getItem("user")),
      }
    },
    watch:{

      $route(){
        this.to= this.$route.query.friendId;
      },
      to:{
        handler(val, oldVal){

          this.messages.splice(0,this.messages.length);
        },
        immediate: true
      }

    },
    props:['friendId'],
    methods: {
      handleEmotion(i) {
        this.content += i
      },
      // 将匹配结果替换表情图片
      emotion(res) {

        let word = res.replace(/\#|\;/gi, '')
        const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
        let index = list.indexOf(word)
        return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
      },

      sendMessage(){
        this.outMessage = {"from":this.user.id,"to":this.to,"message":this.outMessage,"flag":1,"date":new Date()};

        if(this.outMessage.message.replace(/(^\s*)|`(\s*$)/g, "").length != 0){
          this.websocketsend(JSON.stringify(this.outMessage));

        }
        this.outMessage='';
      },

      initWebSocket(){ //初始化weosocket
        const wsuri = "ws://127.0.0.1:8763/websocket/"+this.user.id;
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        // let actions = {"test":"12345"};
        //alert(this.$route.params.friendId);
        // this.websocketsend(JSON.stringify(actions));
      },
      websocketonerror(){//连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
        console.log(e.data);
        console.log(e.data.substring(1,e.data.length - 1));
        this.inMessage = JSON.parse(e.data.substring(1,e.data.length - 1).replace(/[\\]/g,''));
        console.log(this.inMessage);
        this.messages.splice(this.messages.length,0,this.inMessage);
        console.log(this.messages);
      },
      websocketsend(Data){//数据发送
        console.log(Data);
        this.outMessage = JSON.parse(Data);
        this.messages.splice(this.messages.length,0,this.outMessage);
        this.websock.send(Data);

      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
        this.$message({
          message: '好友连接关闭。。。',
          type: 'warning'
        });
      },
    },
    components: {
      Emotion
    }
  }
</script>
<style scoped>
  .talk_con {

    border: lightgrey solid 1px;
  }

  .chatlist {
    margin-top: 44px;
    padding: 12px;
  }

  .chatlist p.time {
    margin: 0;
    text-align: center;
  }

  .chatlist p.time span {
    padding: 0 18px;
    display: inline-block;
    font-size: 9pt;
    color: #fff;
    border-radius: 2px;
    background-color: #dcdcdc;
  }

  .chatlist .chatout, .chatlist .chatin {
    margin: 10px 0;
  }

  .chatlist .chatout {
    text-align: right;
  }

  .chatlist .chatout img {
    float: right;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 0 0 10px;
  }

  .chatlist .chatout span {
    display: inline-block;
    position: relative;
    padding: 10px;
    max-width: calc(100% - 90px);
    min-height: 40px;
    line-height: 20px;
    font-size: 13px;
    word-break: break-all;
    border-radius: 4px;
    background-color: grey;
    color: #fff;
  }

  .chatlist .chatout span:before {
    content: " ";
    position: absolute;
    top: 9px;
    left: 100%;
    border: 6px solid transparent;
    border-left-color: grey;
  }

  .chatlist .chatin img {
    float: left;

    border-radius: 50%;
    margin: 0 10px 0 0;
  }

  .chatlist .chatin span {
    display: inline-block;
    position: relative;
    padding: 10px;
    max-width: calc(100% - 90px);
    min-height: 40px;
    line-height: 20px;
    font-size: 13px;
    word-break: break-all;
    border-radius: 4px;
    text-align: left;
    background-color: #fafafa;
  }

  .chatlist .chatin span:before {
    content: " ";
    position: absolute;
    top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: #fafafa;
  }

</style>
<style>
  .su[data-v-133ed8df] {
    background-color: snow !important;
  }

  .user-img img[data-v-5811d9ee] {
    display: none;
  }

  .el-header {
    height: 200px;
  }

  .icon {
    width: 35px;
    height: 35px;
  }
</style>


<!--
<p>文本输入框</p>
<textarea class="text" rows="5" v-model="content" ></textarea>
<p>表情选择框</p>
<emotion @emotion="handleEmotion" :height="200" ></emotion>
<p>效果显示框</p>
<div class="text-place">
  &lt;!&ndash; /\#[\u4E00-\u9FA5]{1,3}\;/gi 匹配出含 #XXX; 的字段 &ndash;&gt;
  <p v-html="content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"></p>
</div>-->
