<template>
    <div class="">
        <PersonHeader :item="userInfo"></PersonHeader>
        <div class="pph_person_nav"><span class="on">文章</span><span>互动</span></div>
        <div class="pph_newsbox" id="masonryContent" v-infinite-scroll="loadMore" infinite-scroll-disabled="scroll_busy" infinite-scroll-distance="200">
            <PphCard :item="item" v-for="item in contList" :key='item.contId'  :hasAuthor="0"></PphCard>
             <Loading :status="loading"></Loading>
        </div>
    </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll'
import PphCard from '../../components/PphCard'
import PersonHeader from './components/PersonHeader'
import Loading from '../../components/Loading'

import {getUrlKey} from '../../util/common.js'

export default{
    name:'app',
    data(){
        return{
            userInfo:{},
            contList:[],
            nextUrl:"",
            loading:true,
            scroll_busy:false
        }
    },
    filters: {
        langName:function(value,length){//更多专题字数超出
            if(value.length > length){
                value = value.substr(0, length-1)+"..."
            }
            return value
        }
    },
    components:{
        PphCard,
        PersonHeader,
        Loading
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
                let n = getUrlKey("uid");
                url = "http://139.196.248.235:8089/wap/v3/jsp/mp_gov.jsp";
                if(n&&n!=""){
                    url+="?uid="+n;
                }
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
            if(resp.userInfo){
                this.userInfo = resp.userInfo;
            }
            if(resp.contList){
                this.contList = this.contList.concat(resp.contList);
            }
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








