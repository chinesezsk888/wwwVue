<template>
  <div class="vote__panel">
    <div class="vote__title">{{data.title}}</div>
    <div class="vote__itemlist" :class="{'vote__itemlist--select':selectOptionId!=-1}" ref="voteList">
      <div class="vote__item" :class="{'vote__item--select':selectOptionId==item.optionId}" v-for="item in data.optionList" :key="item.optionId" @click="addVote(item.optionId,1)">
        <div class="vote__item__con__bg">{{item.name}}</div>
        <div class="vote__item__con">{{item.name}}<span class="vote__item__percent">{{votePercentListAction[item.optionId]}}</span></div>
        <div class="vote__item__bg" :style="{width:votePercentList[item.optionId]}"></div>
      </div>
      <div class="vote__count"><span>{{data.voteNum}}</span>人参与</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VotePanel',
  props: {
    data: Object
  },
  data () {
    return {
      voteCountList: {}, // 记录投票数
      votePercentList: {}, // 记录投票百分比
      votePercentListAction: {}, // 展示数据，用来做变化效果
      selectOptionId: -1, // 判断可投票情况是否已经投票
      saved: false // 客户端保存是否投票过，投票过不能继续投
    }
  },
  created () {
    this.resetVote()
    let saveOptionId = this.checkIsSave()
    if (saveOptionId != '-1') {
      // 直接展示
      this.addVote(saveOptionId, 0)
      this.saved = true
    }
  },
  methods: {
    resetVote () { // 重置投票
      let optionList = this.data.optionList
      for (let item of optionList) {
        this.voteCountList[item.optionId] = item.voteCount
        this.votePercentListAction[item.optionId] = 0
      }
    },
    getVoteStorage () { // 获取storage中投票数据
      let wlstorage = window.localStorage
      let voteStorageStr = wlstorage.getItem('voteStorage') || '{}'
      let voteStorage = JSON.parse(voteStorageStr)
      return voteStorage
    },
    checkIsSave () { // 判断当前投票是否保存，若存在则返回选项id
      let voteStorage = this.getVoteStorage()
      let optionId = voteStorage[this.data.voteId] || '-1'
      return optionId
    },
    saveVote (optionId) { // 投票保存storage中，key 投票id value 选项id
      let voteStorage = this.getVoteStorage()
      let voteId = this.data.voteId
      voteStorage[voteId] = optionId
      let voteStorageStr = JSON.stringify(voteStorage)
      window.localStorage.setItem('voteStorage', voteStorageStr)
    },
    getMaxVoteOptionId () { // 获取投票数最多的选项Id
      let maxVoteCount = -1
      let maxOptionId = -1
      for (let optionId in this.voteCountList) {
        let voteCount = parseInt(this.voteCountList[optionId])
        if (maxVoteCount < voteCount) {
          maxVoteCount = voteCount
          maxOptionId = optionId
        }
      }
      return maxOptionId
    },
    voteAnimate () { // 百分比动画
      let that = this
      let perActionIndex = 1
      let perActionTimer = setInterval(() => {
        let tempObject = {}
        for (let optionId in that.votePercentList) {
          if (perActionIndex == 9) {
            tempObject[optionId] = that.votePercentList[optionId]
          } else {
            let voteCount = parseInt(that.votePercentList[optionId])
            tempObject[optionId] = Math.round(voteCount / 10 * perActionIndex) + '%'
          }
        }
        that.votePercentListAction = tempObject
        perActionIndex++
        if (perActionIndex == 10) {
          clearInterval(perActionTimer)
          perActionTimer = null
        }
      }, 40) // 400好秒运行10次变化 因此变化间隔时间为400/10
    },
    changePercent (maxOptionId) { // 最大值采用1-其他计算
      let otherTotalPer = 0 // 排除最大值其余比例和
      for (let optionId in this.voteCountList) {
        let voteCount = parseInt(this.voteCountList[optionId])
        if (maxOptionId != optionId) {
          let bl = Math.round(voteCount / this.data.voteNum * 100)
          if (voteCount != 0 && bl == 0) {
            bl = 1
          }
          this.votePercentList[optionId] = bl + '%'
          otherTotalPer += bl
        }
      }
      this.votePercentList[maxOptionId] = (100 - otherTotalPer) + '%'
    },
    sendAjax (optionId, success, error) {
      this.axios({
        method: 'post',
        url: '/www/addContentNoteVote.msp',
        params: {
          optionId: optionId,
          voteId: this.data.voteId
        }
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            if (success) success()
          }
        })
        .catch(() => {
          if (error) error()
        })
    },
    dealAdd (optionId, newVote) {
      this.voteCountList[optionId] = newVote
      let maxOptionId = this.getMaxVoteOptionId()
      this.changePercent(maxOptionId)
      this.voteAnimate()
      this.saveVote(optionId)
    },
    addVote (optionId, num) {
      if (this.saved) {
        return
      }
      if (this.selectOptionId == -1) {
        this.data.voteNum = parseInt(this.data.voteNum) + num
      }
      this.resetVote()
      this.selectOptionId = optionId
      let newVote = parseInt(this.voteCountList[optionId]) + num
      this.saved = true
      var that = this
      if (num != 0) { // 为零设置初始状态不需要发请求
        this.sendAjax(optionId, function () {
          that.dealAdd(optionId, newVote)
        }, function () {
          that.saved = false
        })
      } else {
        that.dealAdd(optionId, newVote)
      }
    }
  }
}
</script>
<style lang="scss">
  .vote__panel,.vote__panel *{box-sizing:border-box}
  .vote__panel{
    background:#F6F6F6;
    width: 620px;
    border-radius: 2px;
    padding:23px 30px 50px 75px;
    position: relative;
    margin-bottom:20px;
  }
  .vote__title{
    font-size:16px;
    line-height:28px;
    font-weight:bold;
    color:#131313;
    position: relative;
    &::before{
      content:"";
      position: absolute;
      top: -9px;
      left: -64px;
      background: url("../assets/vote/vote_icon.png") no-repeat;
      width:54px;
      height:54px;
      background-size:100%;
    }
  }
  .vote__count{
    font-size:12px;
    color:#9C9C9C;
    position: absolute;
    right: 30px;
    bottom: 23px;
    span{
      font-size:16px;
      color:#131313;
    }
  }
  .vote__itemlist{
    margin-top:10px;
  }
  .vote__item{
    width:100%;
    height: auto;
    min-height: 43px;
    line-height: 28px;
    background: #FFF;
    box-sizing: content-box;
    color:#333;
    font-size:16px;
    margin-bottom:10px;
    position: relative;
    border:1px solid rgba(214,214,214,1);
    border-radius:4px;
    overflow: hidden;
    &:hover{
      cursor: pointer;
      color:#00A9FF;
      border:1px solid;
      border-image:linear-gradient(135deg, rgba(0,189,255,1), rgba(0,142,255,1)) 1 4px;
      border-radius:4px;
    }
  }
  .vote__item__con{
    width: 100%;
    height:100%;
    position: absolute;
    top:0;
    left:0;
    padding: 7px 70px 8px 16px;
    z-index: 10;
  }
  .vote__item__bg{
    width:0px;
    height:100%;
    position: absolute;
    background-color:#eceeee;
    top:0;
    left:0;
    z-index: 5;
    transition: width 0.4s;
  }
  .vote__item--select{
    color:#00A9FF;
    border:1px solid;
    border-image:linear-gradient(135deg, rgba(0,189,255,1), rgba(0,142,255,1)) 1 4px;
    border-radius:4px;
    .vote__item__percent{
      color:#00A5EB;
    }
    .vote__item__bg{
      background:rgba(129,218,255,0.1);
    }
  }
  .vote__itemlist--select{
    .vote__item__percent{
      display: block;
    }
    .vote__item__bg{
      display: block;
    }
  }
  .vote__itemlist.vote__itemlist--select{
    .vote__item:hover{
      cursor: default;
      color:#333;
      border:1px solid rgba(214,214,214,1);
      border-radius:4px;
    }
    .vote__item.vote__item--select:hover{
      cursor: default;
      color:#00A9FF;
      border:1px solid;
      border-image:linear-gradient(135deg, rgba(0,189,255,1), rgba(0,142,255,1)) 1 4px;
      border-radius:4px;
    }
  }
  .vote__item__percent{
    position: absolute;
    top:50%;
    transform: translate(0,-50%);
    right:19px;
    font-size:16px;
    color:#9c9c9c;
    display:none;
  }
  .vote__item__con__bg{
    width: 100%;
    height:100%;
    min-height: 43px;
    line-height: 28px;
    padding: 7px 70px 8px 16px;
    visibility: hidden;
  }
</style>
