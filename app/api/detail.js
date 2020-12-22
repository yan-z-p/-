import _fetch from "./request";
//商品详情
export function detail(params) {
  return _fetch({
    url: "/productDetail",
    // 是否需要token/appkey
    needKey: true,
    params
  });
}
//收藏
export function like(data) {
  return _fetch({
    url: "/like",
    method:'POST',
    // 是否需要token/appkey
    needKey: true,
    needToken:true,
    data
  });
}
//收藏
export function notlike(data) {
  return _fetch({
    url: "/notlike",
    method:'POST',
    // 是否需要token/appkey
    needKey: true,
    needToken:true,
    data
  });
}
//是否收藏
export function findlike(params) {
  return _fetch({
    url: "/findlike",
    // 是否需要token/appkey
    needKey: true,
    needToken:true,
    params
  });
}
//加入购物车
export function addShopcart(data) {
  return _fetch({
    url: "/addShopcart",
    method:'POST',
    // 是否需要token/appkey
    needKey: true,
    needToken:true,
    data
  });
}
//查看购物车商品条数
export function findAllShopcart() {
  return _fetch({
    url: "/findAllShopcart",
    // 是否需要token/appkey
    needKey: true,
    needToken:true,
    params:{}
  });
}
