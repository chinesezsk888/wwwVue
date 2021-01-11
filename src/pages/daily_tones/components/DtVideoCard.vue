<template>
  <div class="dt_video_card">
    <div class="video__cover" @click="playVideo" v-show="flagShowCover">
      <!-- <div class="play_modal"></div> -->
      <div :style="backgrounImg(item.pic)"></div>
    </div>
    <div class="video_box" v-show="!flagShowCover">
      <video
        class="dt_video"
        controls="controls"
        preload="auto"
        ref="video"
        >
          <source :src="item.link">
      </video>
    </div>
    <FooterGradient :item="item" v-show="flagShowCover" @playVideoFn="playVideo"/>
  </div>
</template>

<script>
import FooterGradient from './FooterGradient'
export default {
  name: 'DtVideoCard',
  components: {
    FooterGradient
  },
  props: {
    item: Object,
    showCover: Boolean
  },
  data () {
    return {
      flagShowCover: Boolean
    }
  },
  watch: {},
  computed: {},
  methods: {
    playVideo () {
      this.flagShowCover = false
      this.$refs.video.play()
      // this.$emit('hideModal')
    },
    backgrounImg (pic) {
      return {
        background: 'url(' + pic + ') center no-repeat',
        backgroundSize: 'cover'
      }
    }
  },
  created () {
    this.flagShowCover = this.showCover
  },
  mounted () {}
}
</script>
<style lang="scss">
.dt_video_card {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  .video__cover {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    div {
      width: 100%;
      height: 100%;
    }
    &::after {
      display: inline-block;
      content: '';
      clear: both;
      width: 96px;
      height: 96px;
      background: url(~@/assets/dtImage/play_icon.png) center no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .video_box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .dt_video {
      width: 100%;
      height: 100%;
      // object-fit: fill;
    }
  }
}
</style>
