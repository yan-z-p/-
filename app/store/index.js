import Vue from 'vue'
import Vuex from 'vuex'
import vuexAlong from "vuex-along";

Vue.use(Vuex)

export default new Vuex.Store({
  
    state:{
        //用户信息
        userInfo:'',
        //登录状态
        isLogin:false,
        // 个人资料
        myData:''
    },
    getters:{

    },
    mutations:{
        
        setisLoginStatus(state,value){
            state.isLogin=value
            // console.log("isLogin==>",state)
        },

        setuserInfoData(state,value){
            state.userInfo=value
            // console.log("isLogin==>",state)
        },

        setmyData(state,value){
            state.myData=value
            // console.log("isLogin==>",state)
        },
        //设置用户信息的某一项
        setuser(state,value){
            state.userInfo[value.key]=value.val
            // console.log("isLogin==>",state)
        }
    },
    actions:{
        
    },
    //防止刷新后数据初始化
    plugins: [
        vuexAlong({
          name: "myabout", // 设置保存的集合名字，避免同站点下的多项目数据冲突
          local: {// 过滤模块 ma 数据， 将其他的存入 localStorage
            list: [],//过滤数据
            isFilter: true 
          },
          session: {
            list: ["userInfo", "isLogin","myData"] // 保存 userInfo 和模块 isLogin 到 sessionStorage
          }
        })
      ]
})