<template>
   <div class="footer_gradient">
      <!-- 标签 -->
      <p class="card_label" :class="trueCardType(item.cardType)"></p>
      <!-- 点击区域 -->
      <div class="card_click_box" @click="goDetailPage($event, item.relationIds)">
        <p class="card_title" v-if="item.name !=''" v-html="item.name"></p>
        <p class="card_dec" v-if="item.summary !=''">{{item.summary}}</p>
        <p class="read_more" v-if="item.relationIds!=''">Read More</p>
      </div>
    </div>
</template>

<script>
export default {
  name: 'FooterGradient',
  props: {
    item: Object
  },
  methods: {
    goDetailPage (e, cid) {
      const fathertDom = e.currentTarget.parentElement.parentElement
      if (fathertDom.getAttribute('class') === 'dt_video_card') {
        this.$emit('playVideoFn')
      } else {
        if (cid == '') {
          return false
        } else {
          location.href = '/news/' + cid // 跳到对应文章详情页
        }
      }
    },
    trueCardType (value) {
      let type = ''
      switch (value) {
        case '1':
          type = 'card_photo'
          break
        case '2':
          type = 'card_video'
          break
        case '3':
          type = 'card_trending'
          break
        case '4':
          type = 'card_data'
          break
        case '5':
          type = 'card_quote'
          break
        case '6':
          type = 'card_buzzword'
          break
        default:
          type = 'card_editors'
      }
      return type
    }
  }
}
</script>
<style lang="scss">
  .footer_gradient {
    width: 452px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 6;
    box-sizing: border-box;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
    .card_label {
      width: 100%;
      height: 100%;
      position: relative;
      margin-left: 20px;
    }
    .card_click_box {
      width: 100%;
      padding: 0 20px 10px ;
      box-sizing: border-box;
      margin-top: 30px;
      cursor: pointer;
      p {
         animation:opacityA 0.4s;
      }
      .card_title {
        font-size: 30px;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 30px;
        margin-bottom: 10px;
        font-family: 'robotocondensed-bold-webfont';
        letter-spacing: -1px;
      }
      .card_dec {
        font-size: 16px;
        font-weight: 300;
        color: #FFFFFF;
        line-height: 20px;
        margin-bottom: 10px;
      }
      .read_more {
        font-size: 20px;
        font-weight: 400;
        color: #FF5300;
        line-height: 24px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-family: 'robotocondensed-regular-webfont';
        &::after {
          display: inline-block;
          content: '';
          clear: both;
          width: 22px;
          height: 22px;
          background: url(~@/assets/dtImage/www_dt_detail_more.png) center no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
  @keyframes opacityA {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
