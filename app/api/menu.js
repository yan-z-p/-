import _fetch from "./request";
//我的
export function typeProducts(params) {
  return _fetch({
    url: "/typeProducts",
    // 是否需要token/appkey
    needKey: true,
    params
  });
}
