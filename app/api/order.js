import _fetch from "./request";
//订单数据
export function findOrder(status) {
  return _fetch({
    url: "/findOrder",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    params: {
      status
    }
  });
}
//切换状态
export function receive(oid) {
  return _fetch({
    url: "/receive",
    method:"POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data: {
        oid
    }
  });
}
//切换状态
export function removeOrder(oid) {
  return _fetch({
    url: "/removeOrder",
    method:"POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data: {
        oid
    }
  });
}
