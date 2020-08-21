<template>
    <div>
        <Nav :type="type"></Nav>
        <HeadLineCard :item="toutiaoItem"></HeadLineCard>
        <RecommendCard :item="recommendUser"></RecommendCard>
        <a class="apply_btn" href=""><span class="apply_btn_icon"></span>申请成为澎湃号</a>
        <SelectTopic :item="selectTopic"></SelectTopic>
        <div class="pph_newsbox" id="masonryContent" v-infinite-scroll="loadMore" infinite-scroll-disabled="scroll_busy" infinite-scroll-distance="200">
            <PphCard :item="item" v-for="item in contList" :key='item.contId' :hasAuthor="1"></PphCard>
            <Loading :status="loading"></Loading>
        </div>
    </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll'
import RecommendCard from './components/RecommendCard'
import HeadLineCard from './components/HeadLineCard'
import SelectTopic from './components/SelectTopic'
import Nav from './components/Nav'
import PphCard from '../../components/PphCard'
import Loading from '../../components/Loading'

import {getUrlKey} from '../../util/common.js'

export default{
    name:'app',
    data(){
        return{
            contList:[],
            recommendUser:{},//推荐用户
            toutiaoItem:[],// 头条
            selectTopic:{},//湃客精选
            nextUrl:"",
            loading:true,
            type:1,//类别
            scroll_busy:false
        }
    },
    components:{
        RecommendCard,
        SelectTopic,
        PphCard,
        HeadLineCard,
        Loading,
        Nav
    },
    filters: {
        langName:function(value,length){//更多专题字数超出
            if(value.length > length){
                value = value.substr(0, length-1)+"..."
            }
            return value
        }
    },
    computed:{

    },
    
    directives: {infiniteScroll},
    mounted(){

    },
    updated(){
        this.mywindow.$("#masonryContent").masonry('reloadItems').masonry();
        this.mywindow.$(".news_li").addClass("show");
        setTimeout(()=>{
            this.scroll_busy = false;
            this.loading = false;
        },1300)
    },
    created() {
        this.type = getUrlKey("type") || 1;
        this.getPageData();
        this.$nextTick(()=> {
            this.mywindow.$("#masonryContent").masonry({
                itemSelector: '.news_li',
                singleMode: true,
                transitionDuration: 0
            });
            this.mywindow.$(".news_li").addClass("show");
        })
    },
    methods:{
        getPageData(nextUrl){
            let url = ""
            if(nextUrl){
                url = nextUrl
            }else{
                url = "http://139.196.248.235:8089/wap/v3/jsp/wap_pph_channel.jsp";
                url+="?type="+this.type;
            }
            this.axios.get(url)
            .then(res => {
                this.addData(res);
            }).catch(() => {
                console.log('请稍后重试');
            }); 
        },
        addData(res){
            let resp = res.data;
            this.toutiaoItem = resp.contList[0];
            this.contList = this.contList.concat(resp.contList)
            //this.recommendUser = resp.recommendUser;
            //this.selectTopic = resp.selectTopic;
            this.nextUrl = resp.nextUrl;
        },
        loadMore(){
            if(this.nextUrl == ""){
                return;
            }
            this.scroll_busy = true;
            this.loading = true;
            this.getPageData(this.nextUrl);
        }
    }
}

</script>








