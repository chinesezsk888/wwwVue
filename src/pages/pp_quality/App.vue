<template>
  <div class="pp_quality_page">
       <Head :scrollBol="scrollBol"></Head>
        <LeftSider @getLeftMsg='getLeftMsg' :scrollBol="scrollBol"
         :defaultCategoryid="defaultCategoryid"
         :leftList="leftList"></LeftSider>
        <!-- 主体部分 -->
        <div class="pp_main_card"
              id="masonryContent"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="scroll_busy"
              infinite-scroll-distance="200">
          <div class="pmc_center_box">
            <div class="pmc_user_card" v-for="item in contList" :key='item.id'>
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
                        <span>{{item.pubTime}}</span>
                    </div>
                    <!-- 举报介绍 -->
                    <p class="ptr_tip_obj">{{item.title}}</p>
                    <!-- 投诉对象 -->
                    <div class="ptr_tousu_obj">
                      <span>投诉对象 :</span>
                      <span>{{item.complaintObject}}</span>
                    </div>
                    <!-- 展开 -->
                    <Zhankai :hasResponse=false :description ="item.description"></Zhankai>
                </div>
              </div>
              <!-- 挂载 -->
              <div class="puc_gaizai_box" :class="{puc_report:JSON.stringify(item.quoteCont) != '{}'}" v-if="JSON.stringify(item.quoteCont) != '{}' || item.response!=''">
                <a class="pgb_report_box" v-if="JSON.stringify(item.quoteCont) != '{}'" :href="item.quoteCont.url" target="_blank">
                  <div class="prb_left">
                    <img :src="item.quoteCont.pic" alt="">
                  </div>
                  <div class="prb_right">
                    <span>澎湃跟踪报道：</span>
                    <span>{{item.quoteCont.content}}</span>
                  </div>
                </a>
                <div class="pgb_zhankai" v-if="JSON.stringify(item.quoteCont) == '{}' && item.response!=''">
                  <div class="pgz_left_icon">回应</div>
                  <Zhankai :hasResponse=true :response="item.response" :responseObject="item.responseObject"></Zhankai>
                </div>
              </div>
              <!-- 状态 -->
              <div class="status_icon" :class="{result_icon:item.status=='4',solve_icon:item.status=='3'}" ></div>
            </div>
          </div>
          <Empty v-if ="showEmpty"></Empty>
        </div>
      <Complain :leftList="leftList"></Complain>
      <Loading :status="loading"></Loading>
      <div class="has_bottom" v-if="hasBottom">已经加载到底部</div>
      <div id="bg_overlay"></div>
  </div>
</template>
<script>
import Head from './components/Head'
import LeftSider from './components/LeftSider'
import Loading from '../../components/Loading'
import Zhankai from './components/Zhankai'
import Complain from './components/Complain'
import infiniteScroll from 'vue-infinite-scroll'
import Empty from '../../components/Empty'
import { getUrlKey } from '../../util/common'
export default {
  name: 'app',
  components: {
    Head,
    LeftSider,
    Loading,
    Zhankai,
    Complain,
    Empty
  },
  data () {
    return {
      loading: true,
      scroll_busy: false,
      // 主体卡片
      contList: [],
      nextUrl: '',
      // 右侧文章列表卡片
      rightCardList: [],
      // 左侧栏
      leftList: [],
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
        url = 'consumer_complaint_data.jsp'
      } else {
        url = 'consumer_complaint_data.jsp?categoryId=' + categoryId
      }
      this.clickLeft(url)
    },
    render (nextUrl) {
      let url = ''
      if (nextUrl) {
        url = nextUrl
      } else {
        url = 'consumer_complaint_data.jsp'
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
      // if(!resp.contList){
      //   return;
      // }
      this.leftList = resp.categoryList
      this.nextUrl = resp.nextUrl
      if (this.nextUrl == '') {
        // 第一页
        this.hasBottom = true
      } else {
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
      url = 'consumer_complaint_data.jsp?categoryId=' + categoryId
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
