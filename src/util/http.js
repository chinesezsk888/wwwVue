/* eslint-disable no-console */
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const sendHttp = {
  pphPraiseInter (params, success) { // 互动点赞
    axios({
      method: 'post',
      url: '/www/notePraise.msp',
      params: {
        c: params.contId,
        ot: params.objectType,
        origPraiseNum: params.praiseTimes
      }
    })
      .then(function (res) {
        if (success) success(res.data)
      })
      .catch(function (error) {
        console.log('praise error ' + error)
      })
  },
  pphPraise (params, success) { // 文章点赞
    axios({
      method: 'post',
      url: '/www/addVote.msp',
      params: {
        contentId: params.contId,
        origPraiseNum: params.praiseTimes
      }
    })
      .then(function (res) {
        if (success) success(res.data)
      })
      .catch(function (error) {
        console.log('praise error ' + error)
      })
  },
  followUser ({ userId, userType }, success) { // 关注
    axios({
      method: 'post',
      url: '/www/followUser.msp',
      params: {
        followUserId: userId,
        userType: userType
      }
    })
      .then(function (res) {
        if (success) success(res.data)
      })
      .catch(function (error) {
        console.log('follow error ' + error)
      })
  },
  unFollowUser ({ userId, userType }, success) { // 取消关注
    axios({
      method: 'post',
      url: '/www/unFollowUser.msp',
      params: {
        followUserId: userId,
        userType: userType
      }
    })
      .then(function (res) {
        if (success) success(res.data)
      })
      .catch(function (error) {
        console.log('unfollow error ' + error)
      })
  }
}
export default sendHttp