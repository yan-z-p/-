import _fetch from "./request";
//获取验证码
export function checkValidCode(validCode) {
  return _fetch({
    url: "/checkValidCode",
    method: "POST",
    // 是否需要token/appkey
    needKey: true,
    data: {
      validCode
    }
  });
}
//获取验证码
export function retrievePassword(data) {
  return _fetch({
    url: "/retrievePassword",
    method: "POST",
    // 是否需要token/appkey
    needKey: true,
    data
  });
}
