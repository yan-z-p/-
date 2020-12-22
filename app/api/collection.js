import _fetch from "./request";
//收藏
export function findAllLike() {
  return _fetch({
    url: "/findAllLike",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    params: {}
  });
}
//取消收藏
export function notlike(pid) {
  return _fetch({
    url: "/notlike",
    method:"POST",
    // 是否需要token/appkey
    needToken: true,
    needKey: true,
    data: {
        pid
    }
  });
}