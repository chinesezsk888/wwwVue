<template>
  <div class="pp_laft_sider" :class="{small_top:scrollBol===true}">
     <ul>
          <li :class="{plsblue:categoryIndex == item.categoryId}" @click="getblue(item.categoryId)" v-for="item in leftList" :key="item.categoryId">
           {{item.categoryName}}
           <div class="pls_lihove_line"></div>
          </li>
     </ul>
  </div>
</template>
<script>
export default {
  name: 'LeftSider',
  components: {},
  props: {
    leftList: Array,
    scrollBol: Boolean,
    defaultCategoryid: String
  },
  data () {
    return {
      categoryIndex: this.defaultCategoryid
    }
  },
  methods: {
    getblue (id) {
      this.$emit('getLeftMsg', { 'id': id })
      this.categoryIndex = id
    }
  }
}
</script>
