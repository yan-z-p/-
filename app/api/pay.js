import _fetch from "./request";
//获取订单
export function commitShopcart(sids) {
  return _fetch({
    url: "/commitShopcart",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    params:{
        sids:JSON.stringify(sids)
    }
  });
}
//提交订单
export function pay(data) {
  return _fetch({
    url: "/pay",
    method:'POST',
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data
  });
}