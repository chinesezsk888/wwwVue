<template>
    <div class="intro_content" ref="desc">
      <span class="ic_respond" v-if="hasResponse" @click="showNextMdesc($event,response)">
         {{responseObject}} :
      </span>
      <!-- 非挂载部分 -->
      <span class="merchant_desc" @click="showMdesc($event,description)" v-if="!hasResponse">{{showIntroduce(description)}}</span>
      <!-- 挂载部分 -->
      <span class="merchant_desc hhh" @click="showMdesc($event,response)" v-if="hasResponse">{{showIntroduce(response)}}</span>
      <!-- 非挂载部分 -->
      <div class="unfold" :class="{warp_shouqi:exchangeButton===false}" @click="showAllMdesc($event,description)" v-if="!hasResponse && isShowButton(description)">
        {{exchangeButton ? '...展开' : '...收起'}}
      </div>
      <!-- 挂载部分 -->
      <div class="unfold hhh" :class="{warp_shouqi:exchangeButton===false}" @click="showAllMdesc($event,response)" v-if="hasResponse && isShowButton(response)">
        {{exchangeButton ? '...展开' : '...收起'}}
      </div>
    </div>
</template>
<script>
export default {
  name: 'Spread',
  data () {
    return {
      // 显示展开还是收起
      exchangeButton: true,
      isShowMore: Boolean
    }
  },
  props: {
    hasResponse: Boolean,
    description: String,
    response: String,
    responseObject: String
  },
  methods: {
    showIntroduce (val) {
      var addval = 0
      if (this.hasResponse) {
        addval = val.length + this.responseObject.length
        if (addval >= 104) {
          return val.slice(0, 101 - this.responseObject.length)
        } else {
          return val
        }
      } else {
        addval = val.length
        if (addval >= 104) {
          return val.slice(0, 101)
        } else {
          return val
        }
      }
    },
    isShowButton (val) {
      var addval = 0
      if (this.hasResponse) {
        addval = val.length + this.responseObject.length
        if (addval < 104) {
          return false
        } else {
          return true
        }
      } else {
        addval = val.length
        if (addval < 104) {
          return false
        } else {
          return true
        }
      }
    },
    showNextMdesc (e, val) {
      if (this.exchangeButton) {
        this.exchangeButton = !this.exchangeButton
        e.target.nextElementSibling.innerText = val
      }
    },
    showMdesc (e, val) {
      if (this.exchangeButton) {
        this.exchangeButton = !this.exchangeButton
        e.target.innerText = val
      }
    },
    showAllMdesc (e, val) {
      if (this.exchangeButton) {
        this.exchangeButton = !this.exchangeButton
        e.target.previousElementSibling.innerText = val
      } else {
        this.exchangeButton = !this.exchangeButton
        e.target.previousElementSibling.innerText = this.showIntroduce(e.target.previousElementSibling.innerText)
      }
    }
  }
}
</script>
