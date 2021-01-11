<template>
  <div class="dt_page">
    <div class="header"></div>
    <div class="dp_main_box">
        <div class="dt_left" @mouseenter="showCalendar" @mouseleave="hideCalendar">
            <div class="dl_time">
              <span class="dt_month">{{ dateInfo.month | initMonth }}</span>
              <span class="dt_data">{{dateInfo.day}}</span>
              <span class="dt_year">{{dateInfo.year}}</span>
              <span class="dt_week">{{dateInfo.week}}</span>
            </div>
            <!-- 日历 -->
            <div class="calendar_box" v-if="calendarData.resultCode==1" :class="{show_calendar:showCalendarStatus}">
              <DtCalendar
              :cdata="calendarData"
              :current='dateInfo'
              :showCalendarStatus='showCalendarStatus'
              @sendNewList="getNewList"
              />
            </div>
        </div>
        <!-- 卡片 -->
        <div class="dt_right" ref="dtRight">
          <div
          class="dr_card"
          v-for="(detailItem, detailIndex) in cardList"
          :style="calculativeWidth(cardList)"
          :key="detailItem.contId"
          :class="{mouse_biggrt_size:currentIndex==detailIndex}"
          @mouseenter="biggerCard(detailIndex)"
          @mouseleave="defaultCard()"
          >
            <!-- 默认样式 -->
            <div class="dc_default" v-if="currentIndex != detailIndex">
              <div class="dd_img">
                <div :style="backgrounImg(detailItem.pic)"></div>
              </div>
              <div class="dd_card_type" :class="trueCardType(detailItem.cardType)"></div>
            </div>
            <!-- 鼠标放大样式 -->
            <div class="dc_bigger" v-else>
              <!-- 视频卡片 -->
              <dt-video-card
              :item="detailItem"
              v-if="detailItem.cardType=='2'"
              :showCover="showCover"
              ref="dtVideoCard">
              </dt-video-card>
              <!-- 普通卡片 -->
              <dt-default-item-card :item="detailItem" v-else></dt-default-item-card>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { apiUrl, calendarUrl, getUrlKey } from './config'
import DtVideoCard from './components/DtVideoCard'
import DtDefaultItemCard from './components/DtDefaultItemCard'
import DtCalendar from './components/DtCalendar'
export default {
  components: {
    DtVideoCard,
    DtDefaultItemCard,
    DtCalendar
  },
  props: {},
  data () {
    return {
      dateInfo: {}, // 左侧日期在list接口里面
      cardList: [],
      defaultSize: false,
      currentIndex: '0',
      showCover: true,
      showCalendarStatus: false,
      calendarData: {}
    }
  },
  filters: {
    initMonth (monthNum) {
      let month = ''
      switch (monthNum) {
        case '01':
          month = 'JAN'
          break
        case '02':
          month = 'FEB'
          break
        case '03':
          month = 'MAR'
          break
        case '04':
          month = 'APR'
          break
        case '05':
          month = 'MAY'
          break
        case '06':
          month = 'JUN'
          break
        case '07':
          month = 'JUL'
          break
        case '08':
          month = 'AUG'
          break
        case '09':
          month = 'SEP'
          break
        case '10':
          month = 'OCT'
          break
        case '11':
          month = 'NOV'
          break
        default:
          month = 'DEC'
      }
      return month
    }
  },
  watch: {},
  computed: {},
  methods: {
    getPageData (src) {
      let url = src
      let nodeId = getUrlKey('n')
      if (nodeId) {
        url = src + nodeId
      } else {
        url = src
      }
      this.axios.get(url)
        .then(res => {
          let resp = res.data.data
          this.dateInfo = resp.dateInfo
          this.cardList = resp.contList
          console.log(this.cardList)
          this.getCalendar(this.dateInfo.year + this.dateInfo.month)
        }).catch(() => {
          console.log('请稍后重试')
        })
    },
    backgrounImg (pic) {
      return {
        background: 'url(' + pic + ') center no-repeat',
        backgroundSize: 'cover'
      }
    },
    biggerCard (i) {
      this.currentIndex = i
    },
    defaultCard () {
      // this.currentIndex = '0'
    },
    showCalendar () {
      this.showCalendarStatus = true
    },
    hideCalendar () {
      this.showCalendarStatus = false
    },
    getNewList (value) {
      this.showCalendarStatus = false
      location.href = '/dtAggregate.jsp?n=' + value.nodeList[0].nodeId
    },
    getCalendar (yearMonth) {
      let url = calendarUrl + yearMonth
      this.axios.get(url).then(res => {
        this.calendarData = res.data
      }).catch(() => {
        console.log('请稍后重试')
      })
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
    },
    calculativeWidth (list) {
      // console.log(this.$refs)
      console.log(this.$refs.dtRight.offsetWidth)
      let mainWidth = this.$refs.dtRight.offsetWidth
      let listLength = list.length
      let itemWidth = (mainWidth - 452) / (listLength - 1) + 'px'
      return {
        width: itemWidth
      }
    }
  },
  created () {
    this.getPageData(apiUrl)
  },
  mounted () {}
}
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
.dt_page{
  width: 100%;
  height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
  position: relative;
  .header {
    width: 100%;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: black;
  }
  .dp_main_box {
    width: 100%;
    height: 100%;
    padding-left: 100px;
    position: relative;
    box-sizing: border-box;
    .dt_left {
      position: absolute;
      left: 0;
      top: 0;
      width: 100px;
      height: 100%;
      background: linear-gradient(180deg, #4A4A4A 0%, #191919 100%);
      .dl_time {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 60px;
        box-sizing: border-box;
        z-index: 999;
        background: linear-gradient(180deg, #4A4A4A 0%, #191919 100%);
        span {
          font-family: 'robotocondensed-bold-webfont';
          font-weight: bold;
          color: #FFFFFF;
          margin-bottom: 10px;
          &.dt_month {
            font-size: 30px;
            line-height: 30px;
            position: relative;
            margin-bottom: 5px;
          }
          &.dt_month::after {
            display: inline-block;
            content: '';
            clear: both;
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #FF5300;
          }
          &.dt_data {
            font-size: 54px;
            line-height: 54px;
            margin-bottom: 60px;
            margin-top: 10px;
          }
          &.dt_year {
            font-size: 24px;
            line-height: 28px;
          }
          &.dt_week {
            width: 48px;
            height: 18px;
            background: #FF5300;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    .dt_right {
      width: 100%;
      height: 100%;
      display: flex;
      position: relative;
      overflow: hidden;
      .dr_card {
        // width: 200px;
        transition: all 0.4s;
        position: relative;
        &.mouse_biggrt_size {
          width: 452px !important;
          transition: all 0.4s;
          overflow: hidden;
        }
        .dc_default {
          width: 100%;
          height: 100%;
          position: relative;
          &::after {
            display: inline-block;
            content: '';
            clear: both;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0.8;
          }
        }
        .dc_bigger {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
          &::after {
            display: inline-block;
            content: '';
            clear: both;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            width: 100%;
            height: 100%;
            box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.7);
          }
        }
      }
    }
    .calendar_box {
      width: 300px;
      height: 100%;
      position: absolute;
      left: -300px;
      top: 0;
      transition: all 0.5s;
      &.show_calendar {
        left: 100px;
      }
    }
  }
  .dd_img {
    width: 100%;
    height: 100%;
    div {
      width: 100%;
      height: 100%;
    }
  }
  .dd_card_type {
    position: absolute;
    left: 20px;
    bottom: 102px;
    z-index: 99;
  }
  .card_photo {
    width: 58px;
    height: 23px;
    background: url(~@/assets/dtImage/card_photo.png) center no-repeat;
    background-size: 100% 100%;
  }
  .card_video {
    width: 50px;
    height: 23px;
    background: url(~@/assets/dtImage/card_video.png) center no-repeat;
    background-size: 100% 100%;
  }
  .card_trending {
    width: 95px;
    height: 23px;
    background: url(~@/assets/dtImage/card_trending.png) center no-repeat;
    background-size: 100% 100%;
  }
  .card_data {
    width: 45px;
    height: 23px;
    background: url(~@/assets/dtImage/card_data.png) center no-repeat;
    background-size: 100% 100%;
  }
  .card_quote {
    width: 56px;
    height: 23px;
    background: url(~@/assets/dtImage/card_quote.png) center no-repeat;
    background-size: 100% 100%;
  }
  .card_buzzword {
    width: 93px;
    height: 23px;
    background: url(~@/assets/dtImage/card_buzzword.png) center no-repeat;
    background-size: 100% 100%;
  }
  .card_editors {
    width: 117px;
    height: 23px;
    background: url(~@/assets/dtImage/card_editors.png) center no-repeat;
    background-size: 100% 100%;
  }
}
</style>
