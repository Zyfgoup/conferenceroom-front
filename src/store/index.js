import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo:{},
    token:''
  },
  mutations: {

    //set 把值传给上面的state里定义的属性
    SET_TOKEN:(state,token) =>{
      state.token = token
      //存在浏览器
      localStorage.setItem("token",token)
    },

    SET_USERINFO:(state,userInfo)=>{
      state.userInfo = userInfo

      //不能存对象 只能转化成json
      sessionStorage.setItem("userInfo",JSON.stringify(userInfo));

      let millisecond = new Date().getTime();
      let expiresTime = new Date(millisecond + 60*60*24*6 *1000 );

      //设置7天 与token有效期一样
      Cookies.set("userInfo",JSON.stringify(userInfo),{ expires: expiresTime });

    },
    REMOVE_INFO:(state)=>{
      Vue.set(state,'token','');
      Vue.set(state,'userInfo',{})
      localStorage.removeItem("token");
      sessionStorage.removeItem("userInfo")
      Cookies.remove("userInfo")

    }

  },

  getters:{
    getUserInfo:(state)=>{
      return state.userInfo
    },

    getToken:(state)=>{
      return state.token
    }
  },


  actions: {
  },
  modules: {
  }
})
