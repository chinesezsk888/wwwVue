<template>
    <div v-if="item.childList">
        <!--澎湃号用户滚动-->
        <div class="pph_common_title">
            <span></span>{{item.title}}<a href="sparkerTopicNode.jsp?n=27043" target="_blank"><i>全部&gt;&gt;</i></a>
        </div>
        <div class="pph_author_scroll">  <!-- no_gov -->
            <div class="link_more">
                <div class="pph_gov_logo"></div>
                <a href="www.baidu.com"><div class="btn">进入</div></a>
            </div>
            <div class="recommend_user">
                <div class="hd">
                    <a class="next"><span class="icon_next icon_pph"></span></a>
                    <a class="prev"><span class="icon_prev icon_pph"></span></a>
                </div>
                <div class="recommend_user_bd">
                    <ul class="clearfix">
                        <li class="user_item" v-for="child in item.childList" :key="child.userInfo.userId">
                            <div class="thum">
                                <img :src="child.userInfo.pic">
                                <span class="icon_vip" v-if="child.userInfo.isAuth"></span>
                            </div>
                            <div class="name">{{child.userInfo.name}}</div>
                            <div class="btn" v-if="child.userInfo.isOrder">已关注</div>
                            <div class="btn on" v-else>关注</div>
                        </li>
                    </ul>
                </div>
			</div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'RecommendCard',
  props: {
    item: Object
  },
  data(){
    return{
        
    }
  },
  computed:{

  }
}
</script>