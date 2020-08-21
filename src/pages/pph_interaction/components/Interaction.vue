<template>
   <div class="pph_interaction">
        <!-- 统一的卡片类型 -->
        <div class="pi_own_all_type">
            <!-- 主题点赞部分 -->
            <div class="pi_all_top">
                <div class="pi_at_time">{{item.pubTime}}</div>
                <div>
                    <div class="pi_at_zan" v-if="item.interactionNum && item.interactionNum != 0">
                        <div class="pi_az_bg_talk"></div>
                        <span>{{item.interactionNum}}</span>
                    </div>
                    <div class="pi_at_zan" @click="handleZan(item.contId,item.objectType,item.praiseTimes)">
                        <div class="pi_az_bg" :class={on:isPraise}></div>
                        <span v-if=" item.praiseTimes != 0">{{item.praiseTimes}}</span>
                    </div>
                </div>
            </div>
            <!-- 文字部分 -->
            <div class="pi_all_word">
                <span class="pi_aw_topword" v-if="item.topicWord&&item.topicWord.word != undefined">{{item.topicWord.word}}</span>
                <span class="pi_all_word_word" v-html="item.content"></span>
                <a :href="item.linkCont.link" class="pi_all_word_link"  target="_blank" v-if="item.linkCont.name!=''">
                    <span class="wl_bg"></span>
                    <span>{{item.linkCont.name}}</span>
                </a>
            </div>
            <!-- 视频部分 -->
            <div class="pi_all_video"
                v-if="item.videoList.length != 0 && item.videoList[0].url !=''"
            >
                <video
                    x5-playsinline=""
                    webkit-playsinline=""
                    playsinline=""
                    x-webkit-airplay="allow"
                    preload="preload"
                    controls="controls"
                    :poster="item.videoList[0].coverPic"
                    >
                    <source :src="item.videoList[0].url">
                    <div class="picv">
                        <a :href="item.videoList[0].url" class="m"></a>
                        <a :href="item.videoList[0].coverPic" alt="111"></a>
                    </div>
                </video>
            </div>
            <template v-if="item.imageList != undefined && item.imageList != ''">
                <div class="pi_all_photo_box pi_all_photo_sm" v-if="smimgClass(item.imageList)">
                    <div v-for="img in item.imageList" @click="showImg(img.url)" :style="{backgroundImage:'url('+img.previewPic+')'}" :key="img.url" class="pyq_img"></div>
                </div>
                <div class="pi_all_photo_box" v-else
                    :class="{ 'pi_all_photo_ml': mlimgClass(item.imageList), 'pi_all_photo_lg': lgimgClass(item.imageList)}">
                    <img :src="item.imageList[0].previewPic" @click="showImg(item.imageList[0].url)" class="pyq_img">
                </div>
            </template>
            <!-- 超链接 -->
            <div class="pi_link_box" v-if="item.quoteCont !=''">
                <!-- 非圆桌问吧结构 -->
                <div class="pi_all_link link"
                v-if="item.quoteCont.contType!=''&&item.quoteCont.contType<=3 && item.quoteCont.content != undefined && item.quoteCont.content!=''"
                >
                    <div class="pi_link_icon"
                    :class="{articlepic:item.quoteCont.contType=='1',askpic:item.quoteCont.contType=='2',resultpic:item.quoteCont.contType=='3'}">

                    </div>
                    <div class="pi_link_word">
                        <a class="pi_text" :href="item.quoteCont.url"  target="_blank" v-if="item.quoteCont.url!=''">{{item.quoteCont.content | langName(74)}}</a>
                        <i class="pi_text" v-else>{{item.quoteCont.content | langName(74)}}</i>
                    </div>
                </div>
                <!-- 圆桌问吧结构 -->
                <div class="pi_all_link_all link"
                    v-if="item.quoteCont.contType!=''&&item.quoteCont.contType>3">
                    <p class="pi_title_types pi_ask" v-if="item.quoteCont.contType== '4'">问吧</p>
                    <p class="pi_title_types pi_desk" v-if="item.quoteCont.contType== '5'">圆桌</p>
                    <a class="pi_text_indents" :href="item.quoteCont.url" target="_blank"> {{item.quoteCont.content}}</a>
                </div>
            </div>

            <vote-panel :data="item.voteObject" v-if="item.voteObject!=null&&item.voteObject!= undefined&&item.voteObject.title!=undefined"></vote-panel>

            <!-- 定位 -->
            <div class="pi_location" v-if="item.location != undefined && item.location != ''">
                <div></div>
                <span>{{item.location}}</span>
            </div>
        </div>

    </div>
</template>

<script>
import { pphPraiseInterAPI } from '../../../util/common.js'
import VotePanel from '../../../components/VotePanel'
export default {
  name: 'Interaction',
  props: {
    item: Object
  },
  data () {
    return {
      isPraise: false
    }
  },
  components: {
    VotePanel
  },
  filters: {
    langName (value, length) { // 更多专题字数超出
      if (value.length > length) {
        value = value.substr(0, length - 1) + '...'
      }
      return value
    }
  },
  mounted () {
    if (this.mywindow.ZanController.check(this.item.contId)) {
      this.isPraise = true
    }
  },
  methods: {
    handleZan (contId, objectType, praiseTimes) {
      if (this.isPraise) {
        return
      }
      pphPraiseInterAPI({ contId, objectType, praiseTimes }, (res) => {
        if (res.resultCode == 1) {
          if (objectType != 3) {
            this.mywindow.ZanController.save(contId, res.praiseTimes)
          }
          this.isPraise = true
          this.item.praiseTimes = res.praiseTimes
        }
      })
    },
    showImg (url) {
      this.$emit('showImg', url)
    },
    smimgClass (dom) {
      if (dom.length > 1) {
        return true
      } else {
        return false
      }
    },
    mlimgClass (dom) {
      if (dom.length < 2) {
        if (Number(dom[0].height) > Number(dom[0].width)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    lgimgClass (dom) {
      if (dom.length < 2) {
        if (Number(dom[0].height) < Number(dom[0].width)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }
}
</script>
