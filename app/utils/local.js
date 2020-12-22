// 获取token

export function getLocal (key = '__tk') {
    return localStorage.getItem(key)
  }
  // 保存token
  export function saveLocal (value, key = '__tk') {
    localStorage.setItem(key, value)
  }
  // 删除token
  export function removeLocal (key = '__tk') {
    localStorage.removeItem(key)
  }