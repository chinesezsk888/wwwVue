<template>
    <div>
        <div class="label_video" v-if="item.watermark==1&&!item.liveType&&item.videoNum==1">{{item.duration}}</div>
        <div class="label_videos" v-if="item.watermark==1&&!item.liveType&&item.videoNum>1">
            <span class="icon"></span>
            {{item.videoNum}}
        </div>
        <div class="label_vliving" v-if="item.watermark==1&&item.liveType==1">正在直播</div>
        <div class="label_vliving" v-if="item.watermark==1&&item.liveType==2">直播录像</div>
        <div class="label_images" v-if="item.watermark==2">
            <span class="icon"></span>
            {{item.imageNum}}
        </div>
        <!--
        <div class="label_topic" v-if="item.watermark==3">专题</div>
        <div class="label_vliving" v-if="item.watermark==4">直播</div>
        -->
    </div>
</template>
<script>
export default {
  name: 'WaterMark',
  props: {
      item: Object
  }
}
</script>
