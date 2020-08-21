<template>
    <div class="pph_person_header clearfix">
        <div class="pph_person_thum">
            <img :src="item.facePic">
            <span class="icon_vip" v-if="item.isOrder"></span>
        </div>
        <div class="pph_pheader_con">
            <div class="pph_pheader_author clearfix">
                <span class="name">{{item.name}}</span><span class="type">{{item.cornerLabelDesc}}</span><span class="sex">男</span><span class="city">{{item.area}}</span>
            </div>
            <div class="pph_pheader_info">
                {{item.desc}}
            </div>
            <div class="pph_pheader_extra clearfix">
                <div class="left">关注 123 | 粉丝 28 | 获赞 416</div>
                <div class="right statis">{{item.cornerLabelDesc}}指数：923</div>
            </div>
            <div class="pph_pheader_des">
                {{item.govAffairsIntroduction}}
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
    computed:{
        decorate(){
            let result = "";
            if(this.item.userType == 1){
                result = "decorate_paike";
            }else if(this.item.userType == 2){
                result = "decorate_media";
            }else if(this.item.userType == 3){
                result = "decorate_gov";
            }
            return result;
        }
    },
}
</script>
