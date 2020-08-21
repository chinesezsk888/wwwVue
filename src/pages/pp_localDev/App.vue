<template>
  <div class="pp__local__dev__page">
       <Head :scrollBol="scrollBol"></Head>
       <div class="pldv__center--box">
        <LeftSider @getLeftMsg='getLeftMsg'
         :defaultCategoryid="defaultCategoryid"
         :leftList="leftList"></LeftSider>
        <!-- 主体部分 -->
        <div class="ldp_main_card"
              id="masonryContent"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="scroll_busy"
              infinite-scroll-distance="200">
          <div class="lmc_center_box">
            <div class="lmc_user_card" v-for="item in contList" :key='item.id'>
              <div class="puc_top_box">
                <div class="ptb_left">
                  <div class="ptl_user_img">
                    <img :src="item.userInfo.pic">
                  </div>
                  <div class="ptl_zhiding" v-if="item.lable!=''">{{item.lable}}</div>
                </div>
                <div class="ptb_right">
                    <!-- 信息 -->
                    <div class="ptr_user_msg">
                        <span>{{item.userInfo.name}}</span>
                        <span>{{item.create_time}}</span>
                    </div>
                    <!-- 举报介绍 -->
                    <p class="ptr_tip_obj">{{item.title}}</p>
                    <!-- 投诉对象 -->
                    <div class="ptr_tousu_obj">
                      <span>{{item.interactionClassify}}-{{item.messagesDomain}} · </span>
                      <span>{{item.area}}</span>
                    </div>
                    <!-- 展开 -->
                    <Zhankai :hasResponse=false :description="item.description"></Zhankai>
                </div>
              </div>
              <!-- 挂载 -->
              <div class="puc_gaizai_box" v-if="item.response!=''">
                <div class="pgb_zhankai">
                  <div class="pgz_left_icon">回应</div>
                  <!-- <Zhankai :hasResponse=true :response="item.response" :responseObject="item.responseObject"></Zhankai> -->
                  <Zhankai :hasResponse=true :response="item.response"></Zhankai>
                </div>
              </div>
            </div>
          </div>
          <Empty v-if ="showEmpty"></Empty>
        </div>
        <RightSider></RightSider>
       </div>
      <Complain :leftList="leftList" :areaList="areaList"></Complain>
      <Loading :status="loading"></Loading>
      <div class="has_bottom" v-if="hasBottom">已经加载到底部</div>
      <div id="bg_overlay"></div>
  </div>
</template>
<script>
import Head from './components/Head'
import LeftSider from './components/LeftSider'
import RightSider from './components/RightSider'
import Loading from '../../components/Loading'
import Zhankai from './components/Zhankai'
import Complain from './components/Complain'
import infiniteScroll from 'vue-infinite-scroll'
import Empty from '../../components/Empty'
import { getUrlKey } from '../../util/common'
import { apiUrl } from './config.js'
export default {
  name: 'app',
  components: {
    Head,
    LeftSider,
    Loading,
    Zhankai,
    Complain,
    Empty,
    RightSider
  },
  data () {
    return {
      loading: true,
      scroll_busy: false,
      // 主体卡片
      contList: [],
      nextUrl: '',
      // 左侧栏
      leftList: [],
      // 领域
      areaList: [],
      showEmpty: false,
      hasBottom: false,
      scrollBol: false,
      defaultCategoryid: ''
    }
  },
  directives: { infiniteScroll },
  methods: {
    getLeftMsg (value) {
      this.scroll_busy = true
      this.loading = true
      var categoryId = value.id
      var url = ''
      if (categoryId == '0') {
        url = apiUrl
      } else {
        url = apiUrl + '&categoryId=' + categoryId
      }
      this.clickLeft(url)
    },
    render (nextUrl) {
      let url = ''
      if (nextUrl) {
        url = nextUrl
      } else {
        url = apiUrl
      }
      this.axios.get(url).then(res => {
        this.addDate(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    addDate (res) {
      this.hasBottom = false
      var resp = res.data
      if (resp.contList) {
        this.contList = this.contList.concat(resp.contList)
        if (this.contList.length == 0) {
          this.showEmpty = true
        } else {
          this.showEmpty = false
        }
      }
      this.leftList = resp.categoryList
      this.areaList = resp.messagesDomainList
      this.nextUrl = resp.nextUrl
      if (this.nextUrl == '') {
        // 第一页
        this.hasBottom = true
      } else {
        this.hasBottom = false
      }
      if (this.showEmpty) {
        this.hasBottom = false
      }
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
      this.render(this.nextUrl)
    },
    // 点击左侧发送请求
    clickLeft (url) {
      this.contList = []
      this.hasBottom = false
      this.mywindow.scrollTo(0, 0)
      // this.loading = true;
      this.axios.get(url).then(res => {
        this.contList = res.data.contList
        this.areaList = res.data.messagesDomainList
        if (this.leftList.length == 0) {
          this.leftList = res.data.categoryList
        }
        if (this.contList.length == 0) {
          this.showEmpty = true
        } else {
          this.showEmpty = false
        }
        this.nextUrl = res.data.nextUrl
        if (this.nextUrl == '') {
          this.hasBottom = true
        } else {
          this.hasBottom = false
        }
        if (this.showEmpty) {
          this.hasBottom = false
        }
        this.scroll_busy = false
        this.loading = false
      }).catch((err) => {
        console.log(err)
      })
    },
    // 监听页面滚动事件
    scrollToTop () {
      var scrollTop = this.mywindow.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0) {
        this.scrollBol = true
      } else {
        this.scrollBol = false
      }
    }
  },
  created () {
    let url = ''
    let categoryId = getUrlKey('categoryId')
    if (categoryId != null && categoryId != undefined && categoryId != '') { // 初始传分类
      this.defaultCategoryid = categoryId
      url = apiUrl + '&categoryId=' + categoryId
      this.clickLeft(url)
    } else {
      this.defaultCategoryid = '0'
      this.render()
    }
  },
  mounted () {
    this.mywindow.addEventListener('scroll', this.scrollToTop)
  }
}
</script>
