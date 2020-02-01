import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
Vue.use(Vuex);

/*const modulea = {
  namespaced:true,
  state:{
    num:1
  },
  mutations:{
    increment(state){
      state.num++;
    }
  },
  //只能提交mutation方法，不能直接操作state里面的数据
  actions:{
    increment(context){
      context.commit('increment');
    }
  },
  getters:{
    addTwo(state){
      return state.num;
    }
  }
}
const moduleb = {
  namespaced:true,
  state:{
    num:2
  },
  mutations:{
    increment(state){
      state.num++;
    }
  },
  //只能提交mutation方法，不能直接操作state里面的数据
  actions:{
    increment(context){
      context.commit('increment');
    }
  },
  getters:{
    addTwo(state){
      return state.num +=2;
    }
  }
}
const modulec = {
  namespaced:true,
  state:{
    num:3
  },
  mutations:{
    increment(state){
      state.num++;
    }
  },
  //只能提交mutation方法，不能直接操作state里面的数据
  actions:{
    increment(context){
      context.commit('increment');
    }
  },
  getters:{
    addTwo(state){
      return state.num++;
    }
  }
}*/
const store = new Vuex.Store({
  state:{
    downloadList:[],
    percent:0,
    userInfo:{},
    previewFilePath:'',
    fileSharerFlag:false,
    shareOrSave:true,//false:保存；true：分享
    fileSharerSavePath:'',
    fileItem:[],
  },
  getters:{
    getDownload(state){
      return state.downloadList;
    },
    getUserInfo(state){
      return state.userInfo;
    },
    getPreviewFilePath(state){
      return state.previewFilePath;
    },
    getFileSharerFlag(state){
      return state.fileSharerFlag;
    },
    getShareOrSave(state){
      return state.shareOrSave;
    },
    getFileSharerSavePath(state){
      return state.fileSharerSavePath;
    },
    getFileItem(state){
      return state.fileItem;
    }
  },
  mutations:{
    getDownload(state,data){
       state.downloadList = data;
    },
    setDownload(state,data){
      state.downloadList = data;
    },

    getPreviewFilePath(state,data){
       state.previewFilePath  = data;
    },
    setPreviewFilePath(state,data){
      state.previewFilePath  = data;
    },

    setUserInfo(state,data){
     state.userInfo = data;
    },
    setFileSharerFlag(state,data){
      state.fileSharerFlag = data;
    },
    setShareOrSave(state,data){
      state.shareOrSave = data;
    },
    setFileSharerSavePath(state,data){
      state.fileSharerSavePath = data;
    },
    setFileItem(state,data){
      state.fileItem = data;
    }
  },
  actions:{

  },
  modules:{

  }
});

export default store;
