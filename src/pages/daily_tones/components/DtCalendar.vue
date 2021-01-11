<template>
  <div
  class="calendar_panel"
  @click="closeMsg($event)"
  >
    <div class="calendar_pbox" ref="calendardom">
      <div class="title">
        <span class="prev" @click="calendarPrev"></span>
        {{dateYearMonth}}
        <span class="next" @click="calendarNext" :class="{next_hide:!hasNext}"></span>
      </div>
      <!-- 日历 -->
      <div class="calendar">
        <ul class='week'>
            <li>SUN</li>
            <li>MON</li>
            <li>TUE</li>
            <li>WED</li>
            <li>THU</li>
            <li>FRI</li>
            <li>SAT</li>
        </ul>
        <ul class="days">
          <li
          v-for="value in calendarData"
          :key="value.day"
          >
            <div
            :class="{ week_usable: value.nodeList, week_current:currentDay==value.day }"
            @click="initSwiperInfo(value.nodeList,value)"
            >
            {{value.day}}
            </div>
          </li>
        </ul>
      </div>
      <!-- 按钮 -->
      <div class="today_btn" @click="calendarNewest"></div>
    </div>
  </div>
</template>

<script>
import { calendarUrl } from '../config'
export default {
  name: 'DtCalendar',
  props: {
    cdata: Object,
    current: Object,
    showCalendarStatus: Boolean
  },
  data () {
    return {
      dateInfo: {},
      calendar: {},
      minDateInfo: {},
      maxDateInfo: {},
      calendarData: {},
      currentDay: 0, // 当前的时间高亮
      nodeList: {}, // 传给父级组件的数据list
      hasNext: false
    }
  },
  watch: {
    dateInfo () {
      this.calendarData = this.getCalendarData()
    }
  },
  computed: {
    dateYearMonth () {
      let month = ''
      switch (this.dateInfo.month) {
        case '01':
          month = 'JAN'
          break
        case '02':
          month = 'FEB'
          break
        case '03':
          month = 'Mar'
          break
        case '04':
          month = 'MAR'
          break
        case '05':
          month = 'May'
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
      return month + ' ' + this.dateInfo.year
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    getPageData () {
      let { month, year } = this.current
      if (this.cdata.resultMsg != 'success') {
        return
      }
      this.dateInfo = this.cdata.dateInfo // 当前日期
      this.minDateInfo = this.cdata.minDateInfo
      this.maxDateInfo = this.cdata.maxDateInfo
      this.calendar = this.cdata.calendar // 当前日历
      this.currentDay = parseInt(this.current.day) || 0
      if (getTime({ year, month }) < getTime(this.maxDateInfo)) {
        this.hasNext = true
      }
    },
    calendarPrev () {
      let { month, year } = this.dateInfo
      if (month == 1) {
        year--
        month = 12
      } else {
        month--
      }
      if (getTime({ year, month }) < getTime(this.minDateInfo)) {
        return
      }
      this.sendCalendar(month, year)
      this.hasNext = true
    },
    calendarNext () {
      if (this.hasNext) {
        let { month, year } = this.dateInfo
        if (month == 12) {
          year++
          month = 1
        } else {
          month++
        }
        if (getTime({ year, month }) >= getTime(this.maxDateInfo)) {
          this.hasNext = false
        }
        this.sendCalendar(month, year)
      } else {
        return false
      }
    },
    getCalendarData () {
      let result = []
      let extra = new Date(this.dateInfo.year, parseInt(this.dateInfo.month) - 1, '01').getDay() // 补充天数
      if (extra == 7) {
        extra = 0
      }
      let days = new Date(this.dateInfo.year, parseInt(this.dateInfo.month), 0).getDate() // 该月天数
      let dayIndex = '1'
      let maxDay = extra + days // 总共循环次数算上补充，比如1号是星期2，则需要补充星期7，星期1两个空对象
      for (let i = 0; i < maxDay; i++) {
        let temp = {}
        if (i >= extra) { // 补充空结束，放上实际数据
          for (let j = 0; j < this.calendar.length; j++) {
            if (this.calendar[j].day == dayIndex) {
              temp.nodeList = this.calendar[j].nodeList
              break
            }
          }
          temp.day = dayIndex
          dayIndex++
        }
        result.push(temp)
      }
      return result
    },
    initSwiperInfo (list, value) {
      if (!list) {
        return false
      }
      this.nodeList = list
      this.currentDay = value.day
      this.$emit('sendNewList', value)
    },
    calendarNewest () {
      let month = formitMonth(this.maxDateInfo.month)
      let url = calendarUrl + this.maxDateInfo.year + month
      this.axios.get(url).then(res => {
        this.dateInfo = res.data.dateInfo
        this.calendar = res.data.calendar
        this.currentDay = this.maxDateInfo.day // 最新需要默认选 天
        this.hasNext = false
        this.getCurrentDayId(res.data.dateInfo, res.data.calendar)
      }).catch(() => {
        console.log('请稍后重试')
      })
    },
    sendCalendar (month, year) {
      month = formitMonth(month)
      let url = calendarUrl + year + month
      this.axios.get(url).then(res => {
        this.dateInfo = res.data.dateInfo
        this.calendar = res.data.calendar
        if (year + month == this.current.year + formitMonth(this.current.month)) { // 文章相同月保留文章选择信息
          this.currentDay = parseInt(this.current.day) || 0
        } else { // 其余月选择区域置空
          this.currentDay = 0
          this.nodeList = {}
        }
      }).catch(() => {
        console.log('请稍后重试')
      })
    },
    closeMsg (ev) {
      if (!this.$refs.calendardom.contains(ev.target)) {
        this.$emit('sendPackUpCalendarMsg')
      }
    },
    getCurrentDayId (info, calendar) {
      const data = info.day
      for (var i=0; i < calendar.length; i++) {
        if (data == calendar[i].day) {
          this.$emit('sendNewList', calendar[i])
        }
      }
    }
  }
}
// 月份补充0
function formitMonth (month) {
  let result = parseInt(month)
  if (result < 10) {
    result = '0' + result
  } else {
    result = '' + result
  }
  return result
}
// 已知年月获取 距今秒值用于比较
function getTime (date) {
  let { year, month } = date
  return (new Date(year, month)).getTime()
}
</script>
<style lang="scss">
* {
    padding: 0;
    margin: 0;
  }
ul,li,ol {
  list-style: none;
}
.calendar_panel {
  width: 300px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  background-color: #0F0F0F;
  // transition: all 0.5s;
  // &.show_calendar {
  //   left: 100px;
  // }
  &::after {
    display: inline-block;
    content: '';
    clear: both;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #4A4A4A 0%, #191919 100%);
    box-shadow: 2px 0 3px -1px rgba(0,0,0,0.5); //右边阴影
    position: absolute;
    top: 0;
    left: 0;
  }
  .calendar_pbox {
    width: 100%;
    padding-top: 70px;
    padding-bottom: 10px;
    box-sizing: border-box;
    position: relative;
    z-index: 9;
    .title {
      font-size: 24px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 62px;
      box-sizing: border-box;
      font-family: 'robotocondensed-regular-webfont';
      .prev {
        width: 24px;
        height: 24px;
        background: url(~@/assets/dtImage/prve_icon.png) center no-repeat;
        background-size: 100% 100%;
        margin-right: 24px;
      }
      .next {
        width: 24px;
        height: 24px;
        background: url(~@/assets/dtImage/next_icon.png) center no-repeat;
        background-size: 100% 100%;
        margin-left: 24px;
        &.next_hide {
          opacity: 0;
        }
      }
    }
    .calendar {
      padding: 0 20px;
      box-sizing: border-box;
      width: 100%;
      .week {
        li {
          font-size: 12px;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 12px;
        }
      }
    }
    .calendar ul{
      display:flex;
      flex-wrap: wrap;
    }
    .calendar li {
      font-size: 12px;
      font-weight: 400;
      width: 14%;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #FFFFFF;
      z-index: 2;
      cursor: pointer;
      font-family: 'robotocondensed-regular-webfont';
      margin-bottom: 8px;
    }
    .calendar .days li div{
      opacity: 0.5;
    }
    .today_btn {
      width: 68px;
      height: 26px;
      background: url(~@/assets/dtImage/www_today_icon.png) center no-repeat;
      background-size: 100% 100%;
      margin: 48px auto 0;
    }
    .week_current{
      position: relative;
      color:#fff;
    }
    .calendar .days li .week_usable{
      opacity: 1;
    }
    .week_usable.week_current:after{
      content: " ";
      display: block;
      position: absolute;
      background: #FF5300;
      width: 28px;
      height: 26px;
      border-radius: 50%;
      z-index: -1;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
}
</style>
