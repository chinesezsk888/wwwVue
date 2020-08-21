<template>
  <div class="pq_head" :class="{small_height_banner:scrollBol===true}">
    <div class="qh_img_box" :class="{small_height:scrollBol===true}">
        <div class="pib_logo" @click="gohomePage()"></div>
        <div class="pr_complain" @click="isLogin()" :class="{small_top:scrollBol===true}">
            <div class="pc_icon"></div>
            <p>我要投诉</p>
        </div>
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
  methods: {
    showComplainMadel () {
      Bus.$emit('showForm', true)
      this.stop()
    },
    // 禁止滚动条
    stop () {
      var mo = function (e) { e.preventDefault() }
      document.body.style.overflow = 'hidden'
      document.addEventListener('touchmove', mo, false) // 禁止页面滑动
    },
    isLogin () {
      var haslogin = this.mywindow.zlreIslogin()
      if (haslogin == 'false') {
        this.mywindow.lgwdsshow()
      } else {
        this.showComplainMadel()
      }
    },
    gohomePage () {
      location.href = 'index.jsp'
    }
  }
}
</script>
