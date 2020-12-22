// 导入路由
import router from "@/router";
import store from "@/store";
import axios from "axios";
// import { fromCodePoint } from 'core-js/fn/string'
// 导入toast
import { Toast } from "vant";

import { removeLocal, getLocal } from "../utils/local.js";

//创建一个副本
let _fetch = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 5000 // 请求超时时间
});

// 请求拦截
_fetch.interceptors.request.use(config => {
  if (config.method == "get") {
    //是否需要token
    if (config.needToken) {
      config.params.tokenString = getLocal();
    }
    //是否需要appkey
    if (config.needKey) {
      config.params.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";
    }
  }
  if (config.method == "post") {
    //是否需要token
    if (config.needToken) {
      config.data.tokenString = getLocal();
    }
    //是否需要appkey
    if (config.needKey) {
      config.data.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";
    }
    //序列化post请求参数
    let paramsString = "";
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }
    //重新赋值config.data
    config.data = paramsString.slice(0, -1);
  }
  //必须返回config
  return config;
});
//响应拦截
_fetch.interceptors.response.use(
  res => {
    if (res.data.code == 700) {
      //token检验无效,则跳到登录页面//删除token
      Toast(res.data.msg);
      router.push({ name: "Login" });
      removeLocal();
      store.commit("setisLoginStatus", false);
      store.commit("setuserInfoData", "");
      return Promise.reject(res.data.msg);
    }
    if (res.data.statusCode === 404) {
      return Promise.reject(res.data.msg);
    }
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default _fetch;
