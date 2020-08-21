<template>
    <div class="pph_nav clearfix">
        <div class="pph_nav_btn">
            <span :class="{'on':setNav(1)}"><a href="PaiAccountsHome.jsp?type=1">政务</a></span>
            <span :class="{'on':setNav(3)}"><a href="PaiAccountsHome.jsp?type=3">媒体</a></span>
            <span :class="{'on':setNav(2)}"><a href="PaiAccountsHome.jsp?type=2">湃客</a></span>
        </div>
        <div class="pph_nav_search">
            <input />
        </div>
    </div>
</template>
<script>
export default {
    name: 'Nav',
    props:{
        type:String
    },
    methods:{
        setNav(type){
            if(type == this.type){
                return true;
            }else{
                return false;
            }
        }
    }
    
}
</script>
