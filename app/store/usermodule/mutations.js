export const mutations = {
     
    setisLoginStatus(state,value){
        state.isLogin=value
        console.log("isLogin==>",state)
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
} 