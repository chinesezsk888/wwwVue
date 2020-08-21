<template>
  <div class="pph_empty">
    <div class="pph_empty_bg"></div>
    <p class="pph_empty_txt">{{msg}}</p>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    type: {
      default: '1',
      type: String
    }
  },
  data () {
    return {
      msg: ''
    }
  },
  mounted () {
    if (this.type == 1) {
      this.msg = '没有发表任何内容'
    } else {
      this.msg = '该用户已注销'
    }
  }
}
</script>
