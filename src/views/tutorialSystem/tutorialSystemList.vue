<template>
  <div class="indexMain"
    v-loading='loading'
    id="tutorialSystemList">
    <div class="module">
      <div class="inputCtn_page">
        <el-autocomplete v-model="searchString"
          class="searchInput"
          :fetch-suggestions="querySearch"
          placeholder="请输入搜索内容"
          @select="handleSelect"></el-autocomplete>
      </div>
      <div class="tutorialCtn">
        <el-collapse v-model="activeName"
          accordion>
          <el-collapse-item v-for="(item,index) in tutorialModule"
            :key="index"
            :name="item.id">
            <template slot="title">{{item.module}}({{item.module_info ? item.module_info.length : 0}}) </template>
            <div class="collapse__inner_item"
              v-for="(value,key) in item.module_info || []"
              :key="key">
              <span class="text"
                @click="$router.push('/tutorialSystem/tutorialSystemDetail/' + value.id)">{{key+1}}<strong>、</strong>{{value.title}}</span>
            </div>
            <div class="collapse__inner_item"
              v-if="!item.module_info || item.module_info.length === 0">
              <span class="text orange">该模块暂无教程</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import { tutorial } from '@/assets/js/api.js'
import { permissions } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: true,
      searchString: '',
      tutorialModule: [
        {
          id: 99,
          module: '常见问题'
        },
        ...permissions
      ],
      activeName: ''
    }
  },
  methods: {
    querySearch (queryString, cb) {
      let beforeReturnInfo = this.tutorialModule.map(item => item.module_info || []).reduce((a, b) => {
        return a.concat(b)
      }).map(item => {
        return {
          value: item.title,
          id: item.id
        }
      })
      cb(queryString ? beforeReturnInfo.filter(item => item.value.indexOf(queryString) !== -1) : beforeReturnInfo)
    },
    handleSelect (event) {
      this.$router.push('/tutorialSystem/tutorialSystemDetail/' + event.id)
    },
    init () {
      this.tutorialModule.forEach(item => {
        item.module_info = []
      })
      Promise.all([
        tutorial.list()
      ]).then(res => {
        let tutorialDetail = res[0].data.data || []
        tutorialDetail.forEach(item => {
          let moduleFlag = this.tutorialModule.find(val => val.id === item.module_id)
          if (moduleFlag) {
            if (!moduleFlag.module_info) {
              moduleFlag.module_info = [item]
            } else {
              moduleFlag.module_info.push(item)
            }
          }
        })
        this.loading = false
      })
    }
  },
  created () {
    this.init()
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
