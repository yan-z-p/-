import _fetch from "./request";
//修改密码
export function updatePassword(data) {
  return _fetch({
    url: "/updatePassword",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data
  });
}
//注销账号
export function destroyAccount() {
  return _fetch({
    url: "/destroyAccount",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data:{}
  });
}