import _fetch from "./request";
//新增
export function addAddress(data) {
  return _fetch({
    url: "/addAddress",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data
  });
}
//编辑
export function editAddress(data) {
  return _fetch({
    url: "/editAddress",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data
  });
}
//查询
export function findAddressByAid(aid) {
  return _fetch({
    url: "/findAddressByAid",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    params:{
        aid
    }
  });
}
//编辑
export function deleteAddress(aid) {
  return _fetch({
    url: "/deleteAddress",
    method: "POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data:{
        aid
    }
  });
}