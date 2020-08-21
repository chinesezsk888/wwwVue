<template>
  <div class="news_li">

      <div class="header clearfix" v-if="hasAuthor==1&&item.authorInfo">
          <a :href="item.authorInfo.userUrl" target="_blank" class="author">
              <img :src="item.authorInfo.pic">
              <span class="icon_vip" v-if="item.authorInfo.isAuth"></span>
          {{item.authorInfo.name}}</a>
          <div class="header_btn" :class="{'on':isOrder}" @click="follow">关注</div>
      </div>
      <a :href="href" target="_blank">
          <div class="con">
              <div class="thum_bg" v-if="item.pic">
                  <img class="thum" :src="item.pic">
                  <WaterMark :item = 'item'></WaterMark>
              </div>
              <div class="title">{{item.name}}</div>
              <div class="abstract">改革前个税收入，在去年的1—9月份是同比增长20%，改革后的4个月，同比减少14.2%。2019年1月，第二步个税改革落地以后，单月的同比减负23.5%。</div>
          </div>
      </a>
      <div class="infor clearfix">
          <div class="extra_bg">
              <div class="extra clearfix">
                  <div>{{item.pubTime}}</div>
                  <div><span  @click="pphPraise(item.contId,item.praiseTimes)" class="icon_zan icon_paike" :class="{'on':praised}"></span>{{item.praiseTimes}}</div>
                  <div v-if="item.interactionNum>10"><span class="icon_talk icon_paike"></span>{{item.interactionNum}}</div>
                  <div v-else><span class="icon_talk icon_paike"></span></div>
              </div>
          </div>
      </div>
      <div class="common_share" :id="'pphNews'+item.contId" :data-id="item.contId" :data-title="item.name"  data-description="改革前个税收入，在去年的1—9月份是同比增长20%，改革后的4个月，同比减少14.2%。2019年1月，第二步个税改革落地以后，单月的同比减负23.5%。" data-picurl="//139.196.248.235:8089/www/v3/img/mediaWxSharePic.png" data-portalurl="//139.196.248.235:8089/www">
          <span class="txt">分享到</span>
          <a class="weixin_share" onclick="pphNewsToWeixin()" ref="nofollow"></a>
          <a class="sina" onclick="pphrNewsToSina()" ref="nofollow"></a>
          <a class="zone" onclick="pphNewsToZone()" ref="nofollow"></a>
      </div>
      <div class="label" v-if="item.cornerLabelDesc != ''">{{item.cornerLabelDesc}}</div>
  </div>
</template>

<script>
import WaterMark from './WaterMark'
import { pphPraiseAPI, followUserAPI, unFollowUserAPI } from '../util/common.js'
export default {
  name: 'PphCard',
  props: {
    item: Object,
    hasAuthor: Number
  },
  data () {
    return {
      praised:false
    }
  },
  components: {
    WaterMark
  },
  computed: {
    href () {
      return 'newsDetail_forward_' + this.item.contId
    },
    isOrder () {
      return (this.item.authorInfo.isOrder == 1)
    }
  },
  methods:{
    pphPraise (contId, praiseTimes) {
      if (!this.praised) {
        pphPraiseAPI({ contId, praiseTimes }, (res)=>{
          this.item.praiseTimes = res.voteTimes
          this.praised = true
        })
      }
    },
    follow () {
      if (!this.isOrder) {
        followUserAPI(this.item.authorInfo.userId, (res) => {
          if(res.resultCode == 1){
            this.item.authorInfo.isOrder = 1
          }
        })
      } else {
        unFollowUserAPI(this.item.authorInfo.userId, (res) => {
          if(res.resultCode == 1){
            this.item.authorInfo.isOrder = 0
          }
        })
      }
    }

  }
}
</script>