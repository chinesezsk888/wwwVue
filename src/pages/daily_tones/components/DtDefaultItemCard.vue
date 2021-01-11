<template>
  <div class="dt_item_card">
    <div class="cover_img" :style="backgrounImg(item.pic)"></div>
    <FooterGradient :item="item" />
  </div>
</template>

<script>
import FooterGradient from './FooterGradient'
export default {
  name: 'DtDefaultItemCard',
  components: {
    FooterGradient
  },
  props: {
    item: Object
  },
  methods: {
    backgrounImg (pic) {
      return {
        background: 'url(' + pic + ') center no-repeat',
        backgroundSize: 'cover'
      }
    }
  }
}
</script>
<style lang="scss">
.dt_item_card {
  width: 100%;
  height: 100%;
  position: relative;
  .cover_img {
    width: 100%;
    height: 100%;
    margin: 0;
  }
}
</style>
