<template>
  <div class="ldp__head" :class="{small_height_banner:scrollBol===true}">
    <div class="qh_img_box" :class="{small_height:scrollBol===true}">
      <div class="lh__complain" @click="btn_type=!btn_type">我要建言</div>
      <ul class="btn_type" :class="{'show':btn_type}">
        <li @click="showReply(1)">建言</li>
        <li @click="showReply(2)">咨询</li>
        <li @click="showReply(3)">投诉</li>
        <li @click="showReply(4)">求助</li>
        <li @click="showReply(5)">感谢</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Bus from '../bus.js'
export default {
  name: 'Head',
  props: {
    scrollBol: Boolean
  },
  data () {
    return {
      btn_type: false, // 按钮列表隐藏,
      interactionClassifyId: ''
    }
  },
  methods: {
    showComplainMadel () {
      Bus.$emit('showForm', this.interactionClassifyId)
      this.stop()
    },
    // 禁止滚动条
    stop () {
      var mo = function (e) { e.preventDefault() }
      document.body.style.overflow = 'hidden'
      document.addEventListener('touchmove', mo, false) // 禁止页面滑动
    },
    showReply (num) {
      var haslogin = this.mywindow.zlreIslogin()
      if (haslogin == 'false') {
        this.mywindow.lgwdsshow()
      } else {
        this.btn_type = false
        if (num == 2) {
          this.interactionClassifyId = '2'
        } else if (num == 3) {
          this.interactionClassifyId = '3'
        } else if (num == 4) {
          this.interactionClassifyId = '4'
        } else if (num == 5) {
          this.interactionClassifyId = '5'
        } else {
          this.interactionClassifyId = '1'
        }
        this.showComplainMadel()
      }
      // this.btn_type = false
      // if (num == 2) {
      //   this.interactionClassifyId = '2'
      // } else if (num == 3) {
      //   this.interactionClassifyId = '3'
      // } else if (num == 4) {
      //   this.interactionClassifyId = '4'
      // } else if (num == 5) {
      //   this.interactionClassifyId = '5'
      // } else {
      //   this.interactionClassifyId = '1'
      // }
      // this.showComplainMadel()
    }
  }
}
</script>
