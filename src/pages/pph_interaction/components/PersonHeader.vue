<template>
    <div class="pph_person_header clearfix">
        <div class="pph_person_thum">
            <img :src="item.facePic">
            <span class="icon_vip" v-if="item.isAuth!=0"></span>
        </div>
        <div class="pph_pheader_con">
            <div class="pph_pheader_author clearfix">
                <span class="name">{{item.sname}}</span><span class="type" v-if="item.userLable != ''">{{item.userLable}}</span><span class="sex" v-if="item.gender != ''" >{{item.gender}}</span><span class="city" v-if="item.area != ''" >{{item.area}}</span>
            </div>
            <div class="pph_pheader_info"  v-if="item.authInfo != ''">
                {{item.authInfo}}
            </div>
            <div class="pph_pheader_extra clearfix">
                <div class="left">
                    <template v-if="item.followNum != ''" >关注 {{item.followNum}} | </template>
                    <template v-if="item.fansNum != ''">粉丝 {{item.fansNum}} | </template>
                    <template v-if="item.praiseTimes != 0">获赞 {{item.praiseTimes}}</template>
                </div>
                <div class="right statis"  v-if="item.userLable != ''">{{item.userLable}}指数： {{item.powerNum===""?0:item.powerNum}}</div>
            </div>
            <div class="pph_pheader_des"  v-if="item.desc != ''">
                {{item.desc}}
            </div>
            <div class="pph_pheader_btn">+&nbsp;关注</div>
        </div>
        <div :class="decorate"></div>
    </div>
</template>
<script>
export default {
  name: 'PersonHeader',
  props: {
      item: Object
  },
  computed: {
    decorate () {
      let result = ''
      if (this.item.userType == 0) {
        result = 'decorate_paike'
      } else if(this.item.userType == 1) {
        result = 'decorate_media'
      } else if(this.item.userType == 2) {
        result = 'decorate_gov'
      }
      return result
    }
  }
}
</script>
