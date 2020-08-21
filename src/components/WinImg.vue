<template>
    <div v-show="flag">
      <div class="md_popup_shade" @click="handleClose"></div>
      <transition name="fade">
          <div class="md_popup" v-show="flag">
              <div class="md_popup_close" @click="handleClose"></div>
              <div class="md_popup_body">
                  <img :src="img">
              </div>
              <div class="md_popup_prev" @click="handlePrev"></div>
              <div class="md_popup_next" @click="handleNext"></div>
          </div>
      </transition>
    </div>
</template>
<script>
export default {
  name: 'WinImg',
  props: {
    img: String,
    flag: Boolean
  },
  methods: {
    handleClose () {
      this.$emit('winClose')
    },
    handlePrev () {
      this.$emit('prev')
    },
    handleNext () {
      this.$emit('next')
    }
  }
}
</script>
