<template>
    <div v-show="status" class="pph_loading">
        <img alt="Loading..." src="//www.thepaper.cn/www/resource/v3/img/loading.gif">
    </div>
</template>

<script>
export default {
  props: {
    status: Boolean
  }
}
</script>
