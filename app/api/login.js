import _fetch from "./request";
//登录
export function login(data) {
  return _fetch({
    url: "/login",
    method: "POST",
    needKey: true,
    data
  });
}

//注册
export function register(data) {
  return _fetch({
    url: "/register",
    method: "POST",
    needKey: true,
    data
  });
}
