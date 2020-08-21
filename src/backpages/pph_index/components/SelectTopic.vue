<template>
    <div v-if="item.childList">
        <!--澎湃号用户滚动-->
        <div class="pph_common_title pph_choice_title">
            <span></span>{{item.title}}
        </div>
        <div class="pph_choice">
            <div class="pph_choice_bd">
                <div class="tempWrap">
                    <ul class="clearfix">
                        <li class="pph_choice_item" v-for="child in item.childList" :key="child.nodeId">
                            <a :href="'newsDetail_forward_'+child.nodeId" target="_blank">
                                <img :src="child.pic" class="thum">
                                <div class="title_bg">
                                    <div class="title">{{child.name}}</div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
  name: 'SelectTopic',
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
