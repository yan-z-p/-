import _fetch from "./request";
//我的
export function getmy() {
  return _fetch({
    url: "/findMy",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    params: {}
  });
}
//背景上传
export function updateUserBg(data) {
  return _fetch({
    url: "/updateUserBg",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data
  });
}
//头像上传
export function updateAvatar(data) {
  return _fetch({
    url: "/updateAvatar",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data
  });
}
//简介
export function updateDesc(data) {
  return _fetch({
    url: "/updateDesc",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data:{
      desc:data
    }
  });
}
//退出登录
export function logout() {
  return _fetch({
    url: "/logout",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data:{}
  });
}
//我的
export function allmyData() {
  return _fetch({
    url: "/findAccountInfo",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    params: {}
  });
}
//签名
export function updateNickName(data) {
  return _fetch({
    url: "/updateNickName",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data:{
      desc:data
    }
  });
}
//查询地址
export function findAddress() {
  return _fetch({
    url: "/findAddress",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    params:{}
  });
}
//搜索
export function search(name) {
  return _fetch({
    url: "/search",
    // 是否需要token/appkey
    needKey: true,
    params:{
      name
    }
  });
}