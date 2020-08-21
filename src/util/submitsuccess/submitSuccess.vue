<template>
   <div class="submit_success" v-if="showSuccess">
        <div class="am_shadow"></div>
        <div class="ss_true_box as_comment">
            <div class="st_bgimg"></div>
            <span>提交成功</span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SubmitSuccess',
  props: {
    showSuccess: Boolean
  }
}
</script>
