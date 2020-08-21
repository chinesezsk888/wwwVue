<template>
  <div>
    <div class="pph_crumbs">
        <a href="channel_36079">澎湃号</a>
        &gt; <a href="">全部澎湃号</a>
    </div>
      <div class="more_pph_panel">
          <div class="more_pph_pheader">
              <div class="nav clearfix" :class="{small:inputShowStatus}">
                  <span :class="{'on':pageType==0}" @click="setPageType(0)">关注</span>
                  <span :class="{'on':pageType==3}" @click="setPageType(3)">湃客</span>
                  <span :class="{'on':pageType==1}" @click="setPageType(1)">政务</span>
                  <span :class="{'on':pageType==2}" @click="setPageType(2)">媒体</span>
              </div>
              <div class="input" :class="{show:inputShowStatus}">
                  <form id="searchResultForm" action="searchResult.jsp" ref="searchPph" >
                      <input placeholder="搜索澎湃号" name="inpsearch" />
                      <input type="hidden" value="pph" name="searchPre" />
                      <input type="hidden" value="1" name="userType" />
                  </form>
                  <div @click="handleInputClose" class="close_input"></div>
              </div>
              <span @click="handleInputBtn" class="icon_paike icon_search"></span>
          </div>
          <div class="clearfix">
              <div dir="rtl" class="more_pph_sidebar" v-if="pageType == 1 && resultCode==1" ref="sidebar">
                  <ul dir="ltr">
                      <li @click="changeRight(buweiNode)" :class="{'on':buweiNode.name==wordCurrent}">部委</li>
                      <template v-for="node in wordNode">
                        <template v-if="node.item.length > 0">
                          <li class="type" :key='node.word'>{{node.word}}</li>
                          <li v-for="item in node.item" @click="changeRight(item)" :key="item.name" :class="{'on':item.name==wordCurrent}">{{item.name}}</li>
                        </template>
                      </template>
                  </ul>
              </div>
              <div class="more_pph_main">
                  <div v-show="isLoading" class="loading"></div>
                  <div v-show="!isLoading">
                    <template v-if="resultCode==1&&userList.length != 0">
                      <div class="more_pph_plist">
                          <ul class="clearfix">
                            <li class="more_pph_pitem" v-for="item in userList" :key="item.userId">
                                <a :href="item.url" target="_blank">
                                    <div class="thum">
                                        <img :src="item.pic">
                                        <span class="icon_vip" v-if="item.isAuth == 1"></span>
                                    </div>
                                    <div class="name">{{item.sname}}</div>
                                </a>
                                <div class="btn" v-if="item.isOrder == 0" @click="follow(item)">关注</div>
                                <div class="btn on" v-else @click="follow(item)">关注</div>
                            </li>
                          </ul>
                      </div>
                      <div class="apply_btn" @click="goApply"><span class="apply_btn_icon"></span>申请成为澎湃号</div>
                      <div class="page_control" v-if="!isPageOne || pageNext!=''">
                          <div class="prev_page" @click="prevPage"></div>
                          <div class="next_page" @click="nextPage"></div>
                      </div>
                    </template>
                    <template v-if="pageType == 0&&resultCode==1&&userList.length == 0">
                      <div class="pph_empty empty_login">
                          <div class="pph_empty_bg"></div>
                          <div class="pph_empty_txt">
                              没有关注内容
                          </div>
                      </div>
                      <div class="apply_btn" @click="goApply"><span class="apply_btn_icon"></span>申请成为澎湃号</div>
                    </template>
                    <template v-if="resultCode==2">
                      <div class="pph_empty">
                          <div class="pph_empty_bg"></div>
                          <div class="pph_empty_txt">
                              登录后查看关注内容
                          </div>
                          <div class="pph_empty_btn" @click="showLogin">
                              立即登录
                          </div>
                      </div>
                      <div class="apply_btn" @click="goApply"><span class="apply_btn_icon"></span>申请成为澎湃号</div>
                    </template>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import { followUserAPI, getUrlKey, unFollowUserAPI } from '../../util/common.js'
export default {
  name: 'app',
  data () {
    return {
      isLoading: false,
      isPageOne: true,
      inputShowStatus: false,
      resultCode: 0,
      pageType: 3, // 0 关注  1政务 2媒体 3湃客
      userList: [], // 右侧显示的数据
      pageNext: '',
      pagePrev: '',
      wordArray: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      wordNode: [], // 政务左侧列表
      wordCurrent: '上海', // 左侧列表选中
      buweiNode: [ ] // 部委数据
    }
  },
  filters: {
    langName (value, length) { // 更多字数超出
      if (value.length > length) {
        value = value.substr(0, length - 1) + '...'
      }
      return value
    }
  },
  created () {
    this.pageType = getUrlKey('pageType') || 3
    let url = this.getPageUrl()
    this.getPageData(url, (res) => {
      this.addData(res)
    })
    this.$nextTick(() => {

    })
  },
  methods: {
    isLogin () {
      let result = false
      if (this.mywindow.$('#isLogin').val() == 'true') {
        result = true
      }
      return result
    },
    handleInputBtn () {
      if (!this.inputShowStatus) {
        this.inputShowStatus = true
      } else {
        // 提交表单
        window.bsForm('searchResultForm')
        this.$refs.searchPph.submit()
      }
    },
    handleInputClose () {
      this.inputShowStatus = false
    },
    showLogin () {
      this.mywindow.lgwdsshow()
    },
    getPageUrl () {
      let urlArray = [
        'pph_myOrderUsers.jsp?userType=-1',
        'allGovUsers.jsp', // 政务
        'pph_myOrderUsers.jsp?userType=1', // 媒体
        'pph_myOrderUsers.jsp?userType=0' // 湃客
      ]
      return urlArray[this.pageType]
    },
    resetPage () {
      this.isPageOne = true
      this.pageNext = ''
      this.pagePrev = ''
      this.wordCurrent = '上海'
      this.wordNode = []
      this.buweiNode = []
    },
    setPageType (type) {
      if (this.isLoading || this.pageType == type) {
        return
      }
      this.pageType = type
      this.resetPage()
      let url = this.getPageUrl()
      this.getPageData(url, (res) => {
        this.addData(res)
      })
    },
    goApply () {
      if (!this.isLogin()) {
        window.lgwdsshow()
        return
      }
      let urlArray = [
        'pph_apply.jsp?typechange=plain',
        'pph_apply.jsp?typechange=plain', // 政务
        'pph_apply.jsp?typechange=plain', // 媒体
        'pph_apply.jsp?typechange=plain' // 湃客
      ]
      this.mywindow.location.href = urlArray[this.pageType]
    },
    getPageData (url, callback) {
      if (!url) {
        return
      }
      this.isLoading = true
      this.axios.get(url)
        .then(res => {
          this.isLoading = false
          if (callback) callback(res)
        })
        .catch(() => {
          console.log('请稍后重试')
        })
    },
    prevPage () {
      this.getPageData(this.pagePrev, (res) => {
        this.addData(res)
      })
    },
    nextPage () {
      this.getPageData(this.pageNext, (res) => {
        this.addData(res)
        this.isPageOne = false
      })
    },
    changeRight (item) {
      this.userList = item.userList
      this.pageNext = item.nextUrl
      this.pagePrev = item.preUrl
      this.wordCurrent = item.name
    },
    addData (res) {
      let resp = res.data
      this.resultCode = resp.resultCode
      if (this.pageType == 1 && resp.nodeList) { // 第一次政务组装左侧数据
        let nodeList = resp.nodeList
        const wordArray = this.wordArray
        for (let i = 0; i < wordArray.length; i++) {
          let word = wordArray[i]
          let tempObj = {}
          tempObj.word = word
          tempObj.item = []
          for (let index in nodeList) {
            let item = nodeList[index]
            var tempItem = JSON.parse(JSON.stringify(item))
            if (item.wordPre == word) {
              tempObj.item.push(tempItem)
            }
            if (item.name == this.wordCurrent) {
              this.userList = tempItem.userList
              this.pageNext = tempItem.nextUrl
            }
            if (!item.wordPre) {
              this.buweiNode = tempItem
            }
          }
          this.wordNode.push(tempObj)
        }
      } else {
        this.userList = resp.userList
        this.pageNext = resp.nextUrl
        this.pagePrev = resp.preUrl
      }
    },
    follow (item) {
      if (!this.isLogin()) {
        window.lgwdsshow()
        return
      }
      let param = {
        userId: item.userId,
        userType: item.userType
      }
      if (item.isOrder == 0) {
        followUserAPI(param, (res) => {
          if (res.resultCode == 1) {
            item.isOrder = 1
          }
        })
      } else {
        unFollowUserAPI(param, (res) => {
          if (res.resultCode == 1) {
            item.isOrder = 0
          }
        })
      }
    }
  }
}

</script>
