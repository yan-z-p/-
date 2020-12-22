import _fetch from "./request";

//轮播图
export function banner(params) {
  return _fetch({
    url: "/banner",
    params
  });
}
//商品数据
export function shopData() {
  return _fetch({
    url: "/typeProducts",
    needKey: true,
    params: {
      key: "isHot",
      value: 1
    }
  });
}
