<template>
    <div class="send_from_box">
        <div class="complain_page" id="complainpage" v-if="isshow">
            <div class="cmp_gray_madel"></div>
            <div class="cmp_form">
                <p class="cf_title">我要投诉</p>
                <div class="cf_madel_close" @click="closeMadel()"></div>
                <form class="cf_complain_form" id="cf_complain_form" ref="cf_complain_form">
                    <!-- 分类 -->
                    <div class="ccf_sort_box">
                        <div class="csb_title">
                        <p class="must_icon">*</p>
                        <p>分类</p>
                        </div>
                        <div class="csb_menu_box">
                            <div class="cmb_button_box" :class="{errorbod:checkError.showbodError}" @click="showMenu" id="menul" ref="menul">
                                <div class="csb_product_text" :class="{black_word:blackWord}" :v-model="sendmgs.selectValue">{{sendmgs.selectValue}}</div>
                                <div class="cmb_caret_box" :class="{errorbod:checkError.showbodError}">
                                    <p class="cpt_caret"></p>
                                    <ul class="csb_dropdown_menu" v-if="showOption">
                                         <li @click="choice($event,item.categoryId)" v-for="item in leftList" :key="item.categoryId">{{item.categoryName}}</li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- 投诉对象 -->
                    <div class="ccf_tousu_box">
                        <div class="csb_title">
                            <p class="must_icon">*</p>
                            <p>投诉对象</p>
                            <p class="error" v-if="checkError.tousuRequireed!=''">{{checkError.tousuRequireed}}</p>
                        </div>
                        <textarea type='text' class="ctb_text_area" :class="{errorbod:checkError.tousuRequireed !=''}"  name="ctb_textarea" placeholder="如：公司名、机构名、产品名" v-model="sendmgs.tousuDesc"></textarea>
                        <p class="desc_max_word_length"><span class="desc_word_length">{{showTsLength(sendmgs.tousuDesc,30)}}</span>/30</p>
                    </div>
                    <!-- 标题 -->
                    <div class="ccf_biaoti_box">
                        <div class="csb_title">
                            <p class="must_icon">*</p>
                            <p>标题</p>
                            <p class="error" v-if="checkError.titleRequireed">{{checkError.titleRequireed}}</p>
                        </div>
                        <textarea type='text' class="cbb_text_area" :class="{errorbod:checkError.titleRequireed!=''}" name="cbb_textarea" placeholder="核心信息，如：违规行为、造成后果" v-model="sendmgs.titleDesc"></textarea>
                        <p class="desc_max_word_length"><span class="desc_word_length">{{showTitleLength(sendmgs.titleDesc,40)}}</span>/40</p>
                    </div>
                    <!-- 详细说明 -->
                    <div class="ccf_explain_box">
                            <div class="csb_title">
                                <p class="must_icon">*</p>
                                <p>详细说明</p>
                                <p class="error" v-if="checkError.explainRequireed">{{checkError.explainRequireed}}</p>
                            </div>
                        <textarea type='text' placeholder='' class="ceb_text_area" :class="{errorbod:checkError.explainRequireed!=''}" name="ceb_textarea" v-model="sendmgs.explainDesc"></textarea>
                        <p class="desc_max_word_length"><span class="desc_word_length">{{showExplainLength(sendmgs.explainDesc,800)}}</span>/800</p>
                    </div>
                    <!-- 匿名投诉 -->
                    <div class="ccf_anonymous_box">
                    <div class="cab_true" :class="{show_true:sendmgs.showTrue==true}" @click="agreeChange()"></div>
                    <p class="cab_desc">匿名投诉，选勾后投诉页讲不显示您的澎湃昵称</p>
                    </div>
                    <!-- 联系方式 -->
                    <div class="ccf_user_tel_box">
                        <div class="csb_title">
                            <p class="must_icon">*</p>
                            <p>联系方式</p>
                        </div>
                        <input type="text" v-model="sendmgs.userTel" name="userTel" :class="{errorbod:checkError.telError}" class="cutb_userTel" placeholder="手机号，仅用于信息核对">
                        <p class="error" v-if="checkError.telError">{{checkError.telError}}</p>
                    </div>
                    <!-- 同意将投诉内容 -->
                    <div class="ccf_sendtousu_box">
                    <div class="cab_true" :class="{show_true:sendmgs.showTsTrue==true}" @click="agreeChangeTs()"></div>
                    <p class="csb_desc">同意将投诉内容、联系方式提供给投诉方，用于信息核对</p>
                    </div>
                    <!-- 提交按钮 -->
                    <div class="ccf_subtn" @click="flag && submitForm()">提交</div>
                </form>
                <Loading :status="loading"></Loading>
            </div>

        </div>

    </div>
</template>

<script>
import Bus from '../bus.js'
import alertSuccess from '../../../util/submitsuccess/success'
// import successwaiting from '../../../util/sumbitwait/submitwait'
import Loading from '../../../components/Loading'
export default {
  name: 'Complain',
  props: {
    leftList: Array
  },
  components: {
    Loading
  },
  data () {
    return {
      isshow: false,
      sendmgs: {
        selectValue: '请选择',
        selectId: '',
        tousuDesc: '',
        titleDesc: '',
        explainDesc: '',
        // 0不同意； 1同意
        showTrue: false,
        userTel: '',
        // 0不同意； 1同意
        showTsTrue: true
      },
      // 校验错误提示
      checkError: {
        // 分类
        showbodError: false,
        // 投诉对象
        tousuRequireed: '',
        // 标题
        titleRequireed: '',
        // 详细说明
        explainRequireed: '',
        // 联系方式
        telError: false
      },
      showOption: false,
      blackWord: false,
      // 重复点击标志
      flag: true,
      // 是否成功
      showSuccess: false,
      loading: false
    }
  },
  methods: {
    closeMadel () {
      this.isshow = false
      this.move()
    },
    // 滚动条出现
    move () {
      var mo = function (e) { e.preventDefault() }
      document.body.style.overflow = '' // 出现滚动条
      document.removeEventListener('touchmove', mo, false)
    },
    showMenu () {
      this.showOption = true
    },
    choice (e, id) {
      // 实现下拉菜单的内容变化
      this.sendmgs.selectValue = e.target.innerText
      // option消失
      this.showOption = false
      // 选中后下拉框的字体颜色变化
      this.blackWord = true
      // 获取下拉菜单的id
      this.sendmgs.selectId = id
    },
    showTsLength (val, maxlength) {
      if (val.length <= maxlength) {
        this.sendmgs.tousuDesc = this.sendmgs.tousuDesc
        return val.length
      } else {
        this.sendmgs.tousuDesc = this.sendmgs.tousuDesc.slice(0, -1)
        return maxlength
      }
    },
    showTitleLength (val, maxlength) {
      if (val.length <= maxlength) {
        this.sendmgs.titleDesc = this.sendmgs.titleDesc
        return val.length
      } else {
        this.sendmgs.titleDesc = this.sendmgs.titleDesc.slice(0, -1)
        return maxlength
      }
    },
    showExplainLength (val, maxlength) {
      if (val.length <= maxlength) {
        this.sendmgs.explainDesc = this.sendmgs.explainDesc
        return val.length
      } else {
        this.sendmgs.explainDesc = this.sendmgs.explainDesc.slice(0, -1)
        return maxlength
      }
    },
    placeholderWarp () {
      var placeholder = '如：发生时间、事情经过、当前进展、投诉诉求等\n\n注意：此处请勿填写身份证、手机号等个人信息'
      var textarea = document.getElementsByClassName('ceb_text_area')[0]
      textarea.setAttribute('placeholder', placeholder)
      textarea.onfocus = function () {
        if (this.innerText === placeholder) {
          this.innerText = ''
        }
      }
      textarea.onblur = function () {
        if (this.innerText === '') {
          this.setAttribute('placeholder', placeholder)
        }
      }
    },
    // 同意匿名
    agreeChange () {
      this.sendmgs.showTrue = !this.sendmgs.showTrue
    },
    // 同意将投诉内容
    agreeChangeTs () {
      this.sendmgs.showTsTrue = !this.sendmgs.showTsTrue
    },
    addFormMgs () {
      var from = document.getElementsByClassName('cf_complain_form')[0]
      var formData = new FormData(from)
      // 添加下拉菜单的值
      formData.append('categoryId', this.sendmgs.selectId)
      // 添加投诉对象的值
      formData.append('complaintObject', this.sendmgs.tousuDesc)
      // 添加标题的值
      formData.append('title', this.sendmgs.titleDesc)
      // 添加详细说明的值
      formData.append('description', this.sendmgs.explainDesc)
      // 添加匿名投诉的值
      if (this.sendmgs.showTrue == false) {
        formData.append('anonymous', 0)
      } else {
        formData.append('anonymous', 1)
      }
      // 添加联系方式的值
      formData.append('contactInformation', this.sendmgs.userTel)
      // 添加同意将投诉内容的值
      if (this.sendmgs.showTsTrue == false) {
        formData.append('verify', 0)
      } else {
        formData.append('verify', 1)
      }
      return formData
    },
    // 防止用户重复提交表单
    disabledTi () {
      this.flag = false
      var needtime = 3
      var interval = setInterval(() => {
        needtime--
        if (needtime <= 0) {
          this.flag = true
          clearInterval(interval)
          return 0
        }
      }, 1000)
      event.preventDefault()
    },
    submitForm () {
      this.disabledTi()
      this.checkFormRules()
      var adopt = this.checkSuccess()
      if (adopt === 'success') {
        var formmgs = this.addFormMgs()
        // this.changePage();
        this.sendAxios(formmgs)
      }
    },
    // 校验函数
    checkFormRules () {
      if (this.sendmgs.selectValue === '请选择') {
        this.checkError.showbodError = true
      } else {
        this.checkError.showbodError = false
      }
      if (this.sendmgs.tousuDesc === '') {
        this.checkError.tousuRequireed = '必填'
      } else {
        this.checkError.tousuRequireed = ''
      }
      if (this.sendmgs.titleDesc === '') {
        this.checkError.titleRequireed = '必填'
      } else {
        this.checkError.titleRequireed = ''
      }
      if (this.sendmgs.explainDesc === '') {
        this.checkError.explainRequireed = '必填'
      } else {
        this.checkError.explainRequireed = ''
      }
      if (this.sendmgs.userTel === '') {
        this.checkError.telError = '必填'
      } else if (!(/^1[3-8]\d{9}$/.test(this.sendmgs.userTel))) {
        this.checkError.telError = '请输入正确的手机号'
      } else {
        this.checkError.telError = false
      }
    },
    // 校验成功
    checkSuccess () {
      if (this.checkError.showbodError == false &&
      this.checkError.tousuRequireed == '' &&
      this.checkError.titleRequireed == '' &&
      this.checkError.explainRequireed == '' &&
      this.checkError.telError == false) {
        return 'success'
      }
    },
    // 提交成功，跳转页面
    changePage () {
      this.showSuccess = true
      this.move()
      this.isshow = false
      alertSuccess(true)
      // 重置表单(先将下拉菜单的请选择设为灰色)
      this.blackWord = false
      Object.assign(this.$data.sendmgs, this.$options.data().sendmgs)
    },
    // 发送请求
    sendAxios (formmgs) {
      var url = '/www/consumerComplaintSubmit.msp'
      // successwaiting.show();
      this.loading = true
      // this.isshow = false;
      this.axios({
        url: url,
        method: 'post',
        data: formmgs
      })
        .then(res => {
          // successwaiting.hide();
          this.loading = false
          if (res.status == 200 && res.data.resultCode == 1) {
            this.changePage()
          } else {
            alert(res.data.resultMsg)
          }
        })
        .catch((err) => {
          // successwaiting.hide();
          this.loading = false
          console.log(err)
        })
    }
  },
  created () {
    // 实现点击其他下拉菜单以外的部分下拉菜单栏隐藏
    document.addEventListener('click', (e) => {
      if (this.showOption == true && e.target.className != 'cf_madel_close' && !this.$refs.menul.contains(e.target)) {
        this.showOption = false
      }
    })
  },
  mounted () {
    Bus.$on('showForm', data => {
    // data就是组件LaftSider传过来的值
      this.isshow = data
    })
  },
  updated () {
    if (this.isshow == true) {
      this.placeholderWarp()
    }
  }
}
</script>
