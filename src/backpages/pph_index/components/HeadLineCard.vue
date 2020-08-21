<template>
    <!--澎湃号头条-->
    <div class="pph_toutiao clearfix" v-if="item">
        <div class="left">
            <img :src="item.pic" @click='goNewsDetail'>
            <WaterMark :item = 'item'></WaterMark>
        </div>
        <div class="right">
            <div class="title" @click='goNewsDetail'>{{item.name}}</div>
            <div class="abstract">{{item.summary}}</div>
            <div class="infor">
                <div class="author" v-if='item.authorInfo'>
                    <img :src="item.authorInfo.pic">
                    <span class="icon_vip" v-if="item.authorInfo.isAuth"></span>
                    <span class="author_name">{{item.authorInfo.name}}</span>
                    <span class="author_btn" :class="{'on':isOrder}" @click="follow">关注</span>、
                </div>
                <div class="extra clearfix">
                    <div>{{item.pubTime}}</div>
                    <div><span  @click="pphPraise(item.contId,item.praiseTimes)" class="icon_zan icon_paike" :class="{'on':praised}"></span>{{item.praiseTimes}}</div>
                    <div v-if="item.interactionNum>10"><span class="icon_talk icon_paike"></span>{{item.interactionNum}}</div>
                    <div v-else><span class="icon_talk icon_paike"></span></div>
                </div>
            </div>
            <div class="label" v-if="item.cornerLabelDesc != ''">{{item.cornerLabelDesc}}</div>
        </div>
    </div>
</template>
<script>
import WaterMark from '../../../components/WaterMark'
import {pphPraiseAPI,followUserAPI,unFollowUserAPI} from '../../../util/common.js'
export default {
  name: 'HeadLineCard',
  props: {
    item: Object
  },
  data(){
    return{
        
    }
  },
  components:{
    WaterMark
  },
  computed:{
    isOrder(){
      return (this.item.authorInfo.isOrder == 1);
    }
  },
  methods:{
      goNewsDetail(){
        let url = "newsDetail_forward_"+this.item.contId;
        window.open(url);
      },
      pphPraise(contId,praiseTimes){
        if(!this.praised){
            pphPraiseAPI({contId,praiseTimes},(res)=>{
            this.item.praiseTimes = res.voteTimes;
            this.praised = true;
            })
        }
      },
    follow(){
      if(!this.isOrder){
        followUserAPI(this.item.authorInfo.userId,(res)=>{
          if(res.resultCode == 1){
            this.item.authorInfo.isOrder = 1;
          }
          
        })
      }else{
        unFollowUserAPI(this.item.authorInfo.userId,(res)=>{
          if(res.resultCode == 1){
            this.item.authorInfo.isOrder = 0;
          }
        })
      }
    }

  }
}
</script>