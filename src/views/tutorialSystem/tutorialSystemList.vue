<template>
  <div class="indexMain"
    v-loading='loading'
    id="tutorialSystemList">
    <div class="module">
      <div class="inputCtn_page">
        <el-input v-model="searchString"
          placeholder="请输入描述"
          class="searchInput">
          <span slot="append"
            class="btn btnBlue el-icon-search"
            @click="search">搜索</span>
        </el-input>
      </div>
      <div class="tutorialCtn">
        <el-collapse v-model="activeName"
          accordion>
          <el-collapse-item v-for="(item,index) in tutorialModule"
            :key="index"
            :title="item.module"
            :name="item.id">
            <div @click="$router.push('/tutorialSystem/tutorialSystemDetail?keyword=与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念')">与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import { permissions } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: true,
      searchString: '',
      tutorialModule: permissions,
      activeName: ''
    }
  },
  methods: {
    search () {

    }
  },
  created () {
    this.loading = false
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/tutorialSystem/tutorialSystemList.less";
</style>
<style lang="less">
#tutorialSystemList {
  .el-input-group__append {
    padding: 0;
  }
  .tutorialCtn {
    .el-collapse-item__header {
      padding: 0 60px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
      font-weight: bold;
      &.is-active {
        background: rgba(24, 144, 255, 0.1);
      }
    }
    .el-collapse-item__content {
      padding: 0 100px;
    }
  }
}
</style>
