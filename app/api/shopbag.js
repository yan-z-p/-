import _fetch from "./request";
//所有商品数据
export function findAllShopcart() {
  return _fetch({
    url: "/findAllShopcart",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    params: {}
  });
}
//商品数据数量
export function modifyShopcartCount(data) {
  return _fetch({
    url: "/modifyShopcartCount",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data
  });
}
//删除商品
export function deleteShopcart(sids) {
  return _fetch({
    url: "/deleteShopcart",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data:{
        sids
    }
  });
}
