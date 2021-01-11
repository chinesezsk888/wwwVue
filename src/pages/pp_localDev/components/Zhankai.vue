<template>
    <div class="intro_content" ref="desc">
      <!-- 非挂载部分 -->
      <span ref="unremound" :class="{show__up:unremoundShowUp}" class="merchant_desc" @click="showUnremoundAllMdesc()" v-html="description"></span>
      <!-- 挂载部分 -->
      <span ref="remound" :class="{show__up:remoundShowUp}" class="merchant_desc hhh" @click="showRemoundAllMdesc()" v-html="response">{{ response }}</span>
      <!-- 非挂载部分 -->
      <div :class="{warp_shouqi:exUnremoundButton===false}" class="unfold" @click="showUnremoundAllMdesc()" v-if="showUnremoundButton">
        {{exUnremoundButton ? '...展开' : '...收起'}}
      </div>
      <!-- 挂载部分 -->
      <div :class="{warp_shouqi:exRemoundButton===false}" class="unfold hhh" @click="showRemoundAllMdesc()" v-if="showRemoundButton">
        {{exRemoundButton ? '...展开' : '...收起'}}
      </div>
    </div>
</template>
<script>
export default {
  name: 'Spread',
  data () {
    return {
      // 显示挂载部分的展开还是收起按钮
      exRemoundButton: true,
      // 显示非挂载部分的展开还是收起按钮
      exUnremoundButton: true,
      // 决定挂载部分展开还是收起的显示隐藏
      showRemoundButton: Boolean,
      // 决定非挂载部分展开还是收起的显示隐藏
      showUnremoundButton: Boolean,
      isShowMore: Boolean,
      remoundShowUp: false,
      unremoundShowUp: false,
      // 非挂载部分标记(初始加载数据是否为超过两行，true：没有)
      unremoundFlag: true,
      // 挂载部分标记(初始加载数据是否为超过两行，true：没有)
      remoundFlag: true
    }
  },
  props: {
    hasResponse: Boolean,
    description: String,
    response: String,
    responseObject: String
  },
  methods: {
    showRemoundAllMdesc () {
      if (!this.remoundFlag) {
        this.exRemoundButton = !this.exRemoundButton
        this.remoundShowUp = !this.remoundShowUp
      }
    },
    showUnremoundAllMdesc () {
      if (!this.unremoundFlag) {
        this.exUnremoundButton = !this.exUnremoundButton
        this.unremoundShowUp = !this.unremoundShowUp
      }
    }
  },
  mounted () {
    if (this.$refs.remound) {
      var remoundDomHeight = this.$refs.remound.offsetHeight
      if (remoundDomHeight > 66) {
        this.remoundShowUp = true
        this.showRemoundButton = true
        this.remoundFlag = false
      } else {
        this.remoundShowUp = false
        this.showRemoundButton = false
        this.remoundFlag = true
      }
    }
    if (this.$refs.unremound) {
      var unremoundDomHeight = this.$refs.unremound.offsetHeight
      if (unremoundDomHeight > 43) {
        this.unremoundShowUp = true
        this.showUnremoundButton = true
        this.unremoundFlag = false
      } else {
        this.unremoundShowUp = false
        this.showUnremoundButton = false
        this.unremoundFlag = true
      }
    }
  }
}
</script>
