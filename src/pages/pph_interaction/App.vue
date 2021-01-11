<template>
    <div class="interaction_page">
        <Empty v-if ="showEmpty" :type="emptyType"></Empty>
        <template v-else>
            <div class="pph_interaction_box"
                id="masonryContent"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="scroll_busy"
                infinite-scroll-distance="200"
            >

                <Interaction :item="item" v-for="item in contList" :key='item.contId' @showImg="winImgShow"></Interaction>

                <Loading :status="loading"></Loading>
            </div>
        </template>
        <win-img :flag="winImgflag" :img="winImgUrl" @winClose="winImgClose" @prev="winImgPrev" @next="winImgNext"></win-img>
    </div>
</template>
<script>

import WinImg from '../../components/WinImg'
import infiniteScroll from 'vue-infinite-scroll'
import Interaction from './components/Interaction'
import Loading from '../../components/Loading'
import Empty from '../../components/Empty'
import { getUrlKey2 } from '../../util/common.js'
import { apiUrl } from './config.js'
export default {
  name: 'app',
  data () {
    return {
      winImgflag: false,
      winImgUrl: '',
      userId: '',
      showEmpty: false,
      contList: [],
      nextUrl: '',
      loading: true,
      scroll_busy: false,
      winImgArray: [],
      emptyType: '1'
    }
  },
  computed: {
    winImgIndex () {
      let result = -1
      for (let [key, value] of new Map(this.winImgArray.map((value, key) => [key, value]))) {
        if (value == this.winImgUrl) {
          result = key
        }
      }
      return result
    }
  },
  filters: {
    langName (value, length) { // 更多专题字数超出
      if (value.length > length) {
        value = value.substr(0, length - 1) + '...'
      }
      return value
    }
  },
  components: {
    WinImg,
    Interaction,
    Loading,
    Empty
  },
  directives: { infiniteScroll },
  created () {
    this.userId = getUrlKey2()
    this.getPageData()
  },
  methods: {
    winImgNext () {
      if (this.winImgIndex == this.winImgArray.length - 1) {
        return
      }
      let index = this.winImgIndex + 1
      this.winImgUrl = this.winImgArray[index]
      this.winImgflag = true
    },
    winImgPrev () {
      if (this.winImgIndex == 0) {
        return
      }
      let index = this.winImgIndex - 1
      this.winImgUrl = this.winImgArray[index]
      this.winImgflag = true
    },
    winImgShow (url) {
      this.winImgUrl = url
      this.winImgflag = true
    },
    winImgClose () {
      this.winImgUrl = ''
      this.winImgflag = false
    },
    getPageData (nextUrl) {
      let url = ''
      if (nextUrl) {
        url = nextUrl
      } else {
        url = apiUrl
        if (this.userId && this.userId != '') {
          url += '?uid=' + this.userId
        }
      }
      if (window.bsParams) {
        url = url + window.bsParams()
      }
      this.axios.get(url)
        .then(res => {
          this.addData(res)
        })
        .catch(() => {
          console.log('请稍后重试')
        })
    },
    getImageUrl (itemList) {
      let winImgArrayTemp = []
      winImgArrayTemp = itemList.map(item => {
        var imageList = item.imageList
        if (imageList) {
          return imageList.map(img => img.url)
        }
      })
      winImgArrayTemp = winImgArrayTemp.flat()
      return winImgArrayTemp.filter(item => typeof item != 'undefined')
    },
    addData (res) {
      let resp = res.data
      if (this.nextUrl == '') {
        if (resp.contList.length == 0) {
          this.showEmpty = true
        }
      }
      if (resp.contList) {
        this.contList = this.contList.concat(resp.contList)
        let winImgArrayTemp = this.getImageUrl(resp.contList)
        this.winImgArray = this.winImgArray.concat(winImgArrayTemp)
      }
      if (resp.userInfo && resp.userInfo.userId == '') {
        this.emptyType = 2
      }
      this.nextUrl = resp.nextUrl
      this.scroll_busy = false
      this.loading = false
    },
    // 下一页
    loadMore () {
      if (this.nextUrl == '') {
        return
      }
      this.scroll_busy = true
      this.loading = true
      this.getPageData(this.nextUrl)
    }
  }
}
</script>
