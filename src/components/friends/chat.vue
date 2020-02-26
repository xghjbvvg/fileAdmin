<template>
  <el-container>
    <el-header>
      <el-row style="text-align: center;background: #F5F5F5;height: 70px;padding-top: 20px;">
        <el-col :span="24">{{friend.username}}</el-col>
      </el-row>
    </el-header>
    <el-main>

      <div style="text-align: right;">

        <el-popover
          placement="top-start"
          title="帮助"
          width="200"
          trigger="hover"
          content="鼠标向下滑动展示更多内容， 顶部向上滑动加载更多内容">
          <i class="el-icon-info" slot="reference"></i>
          <!--<el-button slot="reference">hover 激活</el-button>-->
        </el-popover>
      </div>
      <div class="talk_con ">
        <div class="wrapper" id="wrapper" :style="wrapper" ref="wrapper">
          <ul class="content" :style="content">
            <li style="margin-top:0px;text-align: center;color:grey">
              <div v-if="loadingFlag"><i class="el-icon-loading"></i>加载中...</div>
              <div v-if="!loadingFlag">下拉加载更多...</div>
            </li>
            <li class="chatlist">
              <div v-for="msg in messages">

                <!--message:{&nbsp;boolean:{{msg.from == to}}-->
                <div style="color:darkgrey;font-size: 15px;text-align: center">{{msg.date}}</div>
                <!-- {{msg.toUser}}&nbsp;{{user.id}}-->

                <div class="chatin" v-if="msg.toUser == user.id">

                  <!--https://ss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/netdisk.1.5f14a41b.xngdALbPHMrnb9LbPTPmRA.jpg-->
                  <img width="40px" height="40px"
                       :src="friend.imageUrl=== null?defaultImg:friend.imageUrl">
                  <span v-if="msg.flag === 1"
                        v-html="msg.message.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"></span>
                  <div v-if="msg.flag === 0">

                    <span v-if="msg.fileItem.name.split('.').length >= 2">

                      <p v-if="doc.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Word_24_2f2aefb.png"
                          style="float: left;" width="50px" height="50px"/>{{msg.fileItem.name}}
                      </p>
                      <p v-else-if="ppt.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/PPT_24_79bc280.png"
                          width="50px" height="50px"
                          style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="excel.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Excel_24_851dee6.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="pdf.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/PDF_24_694b0da.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="music.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Music_24_2ac587d.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="vedio.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Video_24_703ade3.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="txt.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Text_24_7c9f4e9.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="zip.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/ZIP_24_7d2970f.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="img.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Picture_24_7d34de9.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="torrent.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/BT_24_e6ceec7.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="code.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Code_24_cbd51f7.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else>
                        <img
                          src="../../assets/img/fileCategoryImg/Misc_24_af08942.png"
                          width="50px" height="50px" style="float: left;"/>{{msg.fileItem.name}}
                      </p>
                    </span>
                    <span v-else-if="msg.fileItem.name.split('.').length === 1">
                      <img
                        src="../../assets/img/fileCategoryImg/Folder_54.png"
                        width="50px" height="50px" style="float: left;"/> {{msg.fileItem.name}}
                    </span>
                    <span>
                      <el-tooltip class="item" effect="dark" content="保存" placement="top-start">
                          <i class="el-icon-download" @click="showFileShare(false,msg.fileItem)" style="font-size: 18px"></i>
                      </el-tooltip>
                    </span>
                  </div>

                </div>

                <!--{msg.to === user.id}}&nbsp;{{msg.from}}&nbsp;{{user.id}}-->
                <div class="chatout" v-if="msg.from === user.id">
                  <img width="40px" height="40px"
                       :src="user.imageUrl=== null ?defaultImg:user.imageUrl">
                  <span v-if="msg.flag === 1"
                        v-html="msg.message.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"></span>
                  <span v-if="msg.flag === 0">

                     <span v-if="msg.fileItem.name.split('.').length >= 2">

                      <p v-if="doc.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Word_24_2f2aefb.png"
                          style="float: left;" width="50px" height="50px"/>{{msg.fileItem.name}}
                      </p>
                      <p v-else-if="ppt.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/PPT_24_79bc280.png"
                          width="50px" height="50px"
                          style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="excel.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Excel_24_851dee6.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="pdf.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/PDF_24_694b0da.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="music.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Music_24_2ac587d.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="vedio.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Video_24_703ade3.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="txt.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Text_24_7c9f4e9.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="zip.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/ZIP_24_7d2970f.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="img.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Picture_24_7d34de9.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="torrent.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/BT_24_e6ceec7.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else-if="code.indexOf(msg.fileItem.name.substring(msg.fileItem.name.lastIndexOf('.')+1, msg.fileItem.name.length).toLowerCase()) !== -1">
                        <img
                          src="../../assets/img/fileCategoryImg/Code_24_cbd51f7.png"
                          width="50px" height="50px" style="float: left;"/>
                        {{msg.fileItem.name}}
                      </p>
                      <p v-else>
                        <img
                          src="../../assets/img/fileCategoryImg/Misc_24_af08942.png"
                          width="50px" height="50px" style="float: left;"/>{{msg.fileItem.name}}
                      </p>
                    </span>
                     <p  v-else-if="msg.fileItem.name.split('.').length === 1">
                        <img
                          src="../../assets/img/fileCategoryImg/Folder_54.png"
                          width="50px" height="50px" style="float: left;"/>
                      {{msg.fileItem.name}}
                    </p>
                  </span>
                </div>
              </div>
            </li>
            <li class="anchor"></li>
          </ul>
        </div>

      </div>


    </el-main>
    <el-footer>
      <el-row>
        <el-col :span="4">
          <el-button @click="showFileShare(true,1)">分享文件</el-button>
        </el-col>
        <el-col :span="14">

          <el-input v-model="outMessage" @keyup.enter.native="sendMessage(1)"></el-input>
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
          <el-button @click="sendMessage(1)">发送</el-button>
        </el-col>
        <div v-show="fileSharerFlag">
          <fileSharer @receive="getReceive"/>
        </div>
      </el-row>

    </el-footer>
  </el-container>
</template>

<script>
  import Emotion from '@/components/Emotion/index'
  import VueCookie from 'vue-cookies';
  import defaultImg from '../../assets/img/userImg.gif';
  import axios from 'axios'
  import BScroll from "better-scroll"
  import fileSharer from './fileSharer'
  import qs from 'qs'

  /**
   * 时间对象的格式化;
   */
  Date.prototype.format = function(format){
    /*
    * eg:format="YYYY-MM-dd hh:mm:ss";
    */
    var o = {
      "M+" : this.getMonth()+1, //month
      "d+" : this.getDate(),   //day
      "h+" : this.getHours(),  //hour
      "m+" : this.getMinutes(), //minute
      "s+" : this.getSeconds(), //second
      "q+" : Math.floor((this.getMonth()+3)/3), //quarter
      "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
      if(new RegExp("("+ k +")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
      }
    }
    return format;
  }

  export default {

    name: 'chat',
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
        inMessage: '',
        defaultImg: defaultImg,
        messages: [],
        comment: '',
        date: new Date().toLocaleDateString(),
        websock: null,
        to: this.$route.query.friendId,
        friend: {},
        access_token: VueCookie.get("access_token"),
        user: JSON.parse(sessionStorage.getItem("user")),
        loadingFlag: false,//加载图标是否显示
        wrapperHeight: 0,
        wrapper: {
          //'height':  this.wrapperHeight+'px',
          'height': '750px',
        },
        contentHeight: 5,
        content: {
          'height': this.contentHeight + 'px',
          //'height':  '755px',
        },
        mouthInterval: 0,
        fileSharerFlag: true,
        receiveData: [],//文件分享返回数据
        isFirst: true,
        doc: ['doc', 'dot', 'docx', 'dotx', 'docm', 'dotm'],
        excel: ['xls', 'xlt', 'xla', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlam', 'xlsb'],
        ppt: ['ppt', 'pot', 'pps', 'ppa', 'pptx', 'potx', 'ppsx', 'ppam', 'pptm', 'potm', 'ppsm'],
        txt: ['txt', 'md'],
        zip: ['zip', 'jar', 'rar', 'cab', 'iso', 'ace', '7z', 'tar', 'gz', 'arj', 'lzh', 'uue', 'bz2'],
        img: ['gif', 'jpg', 'peg', 'bmp', 'png'],
        torrent: ['torrent'],
        music: ['mp3', 'midi', 'wma', 'vqf', 'amr'],
        vedio: ['mp4', 'flv', 'avi', 'rm', 'rmvb', 'mov', 'mtv', 'dat', 'wmv', '3gb', 'amv', 'dmv', 'wmv'],
        pdf: ['pdf'],
        code: ['c', 'c#', 'java', 'jsp', 'html', 'css', 'vue', 'js', 'php', 'yml', 'asp', 'go',]

      }
    },

    computed: {

    },
    watch: {

      $route() {
        this.to = this.$route.query.friendId;
      },
      to: {
        handler(val, oldVal) {
          this.messages.splice(0, this.messages.length);
        },
        immediate: true
      },
      messages: function (val, oldVal) {
        //var length =  val.length - oldVal.length;

        // this.wrapperHeight = this.wrapperHeight + length*40;
        this.contentHeight = this.contentHeight + val.length * 40;
        //this.wrapperHeight = this.wrapperHeight + val.length*40;
      }
    },

    // props: ['friendId'],

    methods: {
      handleEmotion(i) {
        this.outMessage += i
      },
      // 将匹配结果替换表情图片
      emotion(res) {
        let word = res.replace(/\#|\;/gi, '')
        const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
        let index = list.indexOf(word)
        return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
      },

      sendMessage(flag) {
        var date = new Date();
        this.outMessage = {
          "from": this.user.id,
          "toUser": this.to,
          "message": this.outMessage,
          "flag": flag,
          "date": date.format("yyyy-MM-dd hh:mm:ss")
        };

        if (this.outMessage.message.replace(/(^\s*)|`(\s*$)/g, "").length !== 0) {
          this.websocketsend(JSON.stringify(this.outMessage));
        }
        this.outMessage = '';
      },

      initWebSocket() { //初始化weosocket
        const wsuri = "ws://120.78.88.169:8763/websocket/" + this.user.id;
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen() { //连接建立之后执行send方法发送数据

      },
      websocketonerror() {//连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e) { //数据接收
        console.log(e.data);
        var s = e.data.trim().substring(1, e.data.length - 1).replace(/[\\]/g, '');
        console.log(s);
        this.inMessage = JSON.parse(s);
        console.log(this.inMessage);
        this.messages.splice(this.messages.length, 0, this.inMessage);

        console.log(this.messages);
      },
      websocketsend(Data) {//数据发送
        debugger;
        this.outMessage = JSON.parse(Data);
        this.messages.splice(this.messages.length, 0, this.outMessage);
        this.websock.send(Data);
      },
      websocketclose(e) {  //关闭
        console.log('断开连接', e);
        this.$message({
          message: '好友连接关闭。。。',
          type: 'warning'
        });
      },

      getUserMsg() {
        axios({
          url: '/api/message/getUserMsg',
          method: 'post',
          params: {
            access_token: VueCookie.get('access_token'),
            friendId: this.to,
            uid: this.user.id,
            interval: ++this.mouthInterval
          },
        })
          .then((res) => {
            this.loadingFlag = false;
            this.messages.splice(0);
            for (let i = 0; i < res.data.length; i++) {
              this.messages.splice(this.messages.length, 0, res.data[i]);
            }
            if (this.isFirst) {
              this.scrollToBottom();
              this.isFirst = false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "好友消息加载失败",
              type: 'warning'
            })
          });
      },
      scrollToBottom() {
        this.$nextTick(() => {
          var div = document.getElementById('wrapper');
          div.scrollTop = div.scrollHeight;

        })
      },
      //文件共享接收子组件需共享文件
      getReceive(data) {
        var shareOrSave = this.$store.state.shareOrSave;
        if(shareOrSave){
          //分享
          this.receiveData = data;
          data.forEach((item, index, array) => {
            this.outMessage = {
              "from": this.user.id,
              "toUser": this.to,
              "fileItem": item,
              "flag": 0,
              "date": new Date().format("yyyy-MM-dd hh:mm:ss")
            };
            this.websocketsend(JSON.stringify(this.outMessage));
            this.outMessage = '';
          });

        }else{
          //保存 save
          var fileItem = this.$store.state.fileItem;
          var parentId = data[0].id;//保存文件父级id
          this.$message('正在保存中，请稍后。。。');
          axios({
            url: '/api/message/fileShare',
            method: 'post',
            headers:{
              'Content-Type':'application/json;charset=UTF-8',
            },
            params:{
              access_token: VueCookie.get('access_token'),
              friendId: this.to,
              uid: this.user.id,
              parentId: parentId
            },
            data: fileItem,

          })
            .then((res) => {
              this.$message({
                message: "保存成功",
                type: 'success'
              })
              this.$message({
                type: 'warning',
                message:"注意，文件夹只会保存子文件，当前目录不保存"
              })
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                message: "保存失败,可能文件已存在。。。",
                type: 'warning'
              })
            });
        }

      },
      showFileShare(flag,item) {
        this.$store.commit('setFileSharerFlag', true);
        if(!flag){
          //保存
          this.$store.commit('setFileItem', item);
          this.$store.commit('setShareOrSave', false);
        }else{
          this.$store.commit('setShareOrSave', true);
        }

      },
      updateMsgRead(){

        axios({
          url: '/api/message/updateMsgRead',
          method: 'post',
          headers:{
            'Content-Type':'application/json;charset=UTF-8',
          },
          params:{
            access_token: VueCookie.get('access_token'),
            friendId: this.to,
            uid: this.user.id,
          },
        })
          .then((res) => {
            if(!res.data){
              this.$message("服务器异常")
            }
          })
          .catch((err) => {
            this.$message("服务器异常")
          });
      }
    },
    components: {
      Emotion, fileSharer
    },
    mounted() {
      //获取用户聊天
      this.getUserMsg();
      //获取好友信息
      axios({
        url: '/api/friends/getFriend',
        method: 'post',
        params: {
          access_token: VueCookie.get('access_token'),
          friendId: this.to,
        },
      })
        .then((res) => {
          this.friend = res.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "好友加载失败",
            type: 'warning'
          })
        });

      //聊天框滚动加载
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
        console.log('处理下拉刷新操作');
        this.loadingFlag = true;
        this.getUserMsg();
        setTimeout(() => {
          this.scroll.finishPullDown()
        }, 1000)
      });

      this.updateMsgRead();
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
    /*border-radius: 50%;*/
    margin: 0 30px 0 10px;
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

    /*border-radius: 50%;*/
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

  li {
    list-style-type: none;
  }

  .wrapper {
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    /*overflow: hidden;*/
    scrollbar-arrow-color: #A1A1A1; /**//*三角箭头的颜色*/
    scrollbar-face-color: #A1A1A1; /**//*立体滚动条的颜色*/
    scrollbar-3dlight-color: transparent; /**//*立体滚动条亮边的颜色*/
    scrollbar-highlight-color: transparent; /**//*滚动条空白部分的颜色*/
    scrollbar-shadow-color: transparent; /**//*立体滚动条阴影的颜色*/
    scrollbar-darkshadow-color: transparent; /**//*立体滚动条强阴影的颜色*/
    scrollbar-track-color: #F9F9F9; /**//*立体滚动条背景颜色*/
    scrollbar-base-color: transparent; /**//*滚动条的基本颜色*/
  }

  .content {
    width: 100%;
    background: snow;
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

  ::-webkit-scrollbar {

    /*滚动条整体样式*/

    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/

    height: 4px;

  }

  ::-webkit-scrollbar-thumb {

    /*滚动条里面小方块*/

    border-radius: 5px;

    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

    background: rgba(0, 0, 0, 0.2);

  }

  ::-webkit-scrollbar-track {

    /*滚动条里面轨道*/

    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

    border-radius: 0;

    background: rgba(0, 0, 0, 0.1);
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
