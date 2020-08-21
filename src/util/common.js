import sendHttp from './http'
function getCookie (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}
const store = {
  isLogin () {
    if (getCookie('PAPER_WWW_LOGIN') == 1) {
      return true
    } else {
      return false
    }
  }
}

function getUrlKey (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ['', ''])[1].replace(/\+/g, '%20')) || null
}
// user_interaction_3333
function getUrlKey2 () {
  let pathname = window.location.pathname
  var index = pathname.lastIndexOf('/')
  let dizhi = pathname.substring(index + 1, pathname.length)
  let index2 = dizhi.lastIndexOf('_')
  let result = false
  if (index2 != -1) {
    result = dizhi.substring(index2 + 1, dizhi.length)
  }
  return result
}

export const pphPraiseInterAPI = sendHttp.pphPraiseInter
export const pphPraiseAPI = sendHttp.pphPraise
export const followUserAPI = sendHttp.followUser
export const unFollowUserAPI = sendHttp.unFollowUser

export {
  store,
  getUrlKey2,
  getUrlKey
}
