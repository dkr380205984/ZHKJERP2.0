<template>
  <div id="tutorialSystem"
    class="indexMain">
    <div class="module">
      <div class="contentCtn_page">
        <div class="searchCtn_page">
          <el-autocomplete v-model="queryString"
            class="elInput"
            :fetch-suggestions="querySearch"
            placeholder="请输入问题描述"
            @select="handleSelect">
            <el-button slot="append"
              class="el-icon-search blue"
              @click="checkFirst"></el-button>
          </el-autocomplete>
        </div>
        <div class="searchContent_page">
          <div class="searchItem_page"
            v-for="(item,index) in searchInfo"
            :key="index">
            <span class="searchTitle_page">
              <span :class="{'stepsIndex_page':true,'marginLeft':true}">{{item.step_id}}</span>
              {{item.name || ('第 ' + item.step_id + ' 步')}}
            </span>
            <span class="searchImgDescribe_page">{{item.describe}} </span>
            <span class="searchImg_page"
              v-for="(itemImg,indexImg) in item.image_name"
              :key="indexImg">
              <img :src='require("../../assets/image/price/" + itemImg)'
                class="elImage"
                alt="说明图片"
                @click.right="()=>{return false}">
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryString: '',
      tutorialSystemInfo: [
        {
          name: '怎样添加样品?',
          info: [
            {
              step_id: 1,
              name: '',
              describe: '',
              image_name: ['pass.png']
            },
            {
              step_id: 2,
              name: '添加数据',
              describe: '先点击这，然后点击那，然后。。。',
              image_name: ['pass.png']
            },
            {
              step_id: 3,
              name: '提交数据',
              describe: '先点击这，然后点击那，然后。。。',
              image_name: ['pass.png']
            }
          ]
        },
        {
          name: '怎样添加产品?',
          info: [
            {
              step_id: 1,
              name: '进入产品添加页',
              describe: '先点击这，然后点击那，然后。。。',
              image_name: ['pass.png', 'tongguo.png']
            },
            {
              step_id: 2,
              name: '添加数据',
              describe: '先点击这，然后点击那，然后。。。',
              image_name: ['tongguo.png']
            },
            {
              step_id: 3,
              name: '提交数据',
              describe: '先点击这，然后点击那，然后。。。',
              image_name: ['pass.png']
            }
          ]
        }
      ],
      searchInfo: []
    }
  },
  methods: {
    handleSelect ($event) {
      this.searchInfo = $event.info.sort((a, b) => {
        return a.step_id - b.step_id
      })
    },
    querySearch (queryString, cb) {
      let data = this.tutorialSystemInfo.map(item => {
        let matching = 0
        if (item.name.indexOf(queryString) !== -1) {
          matching += 100
        }
        let searchArr = queryString.split('')
        searchArr.forEach(itemSearch => {
          if (item.name.indexOf(itemSearch) !== -1) {
            matching++
          }
        })
        return {
          ...item,
          value: item.name,
          matching: matching
        }
      })
      let afterSearchData = data.filter(item => item.matching > 0).sort((a, b) => {
        return b.matching - a.matching
      })
      let results = queryString ? afterSearchData : data
      cb(results)
    },
    checkFirst (queryString) {
      let data = this.tutorialSystemInfo.map(item => {
        let matching = 0
        if (item.name.indexOf(queryString) !== -1) {
          matching += 100
        }
        let searchArr = queryString.split('')
        searchArr.forEach(itemSearch => {
          if (item.name.indexOf(itemSearch) !== -1) {
            matching++
          }
        })
        return {
          ...item,
          value: item.name,
          matching: matching
        }
      })
      let afterSearchData = data.filter(item => item.matching > 0).sort((a, b) => {
        return b.matching - a.matching
      })
      let results = queryString ? afterSearchData : data
      this.handleSelect(results[0])
    }
  },
  created () {
    if (this.$route.query.queryString) {
      this.queryString = this.$route.query.queryString
    }
    this.checkFirst(this.queryString || '')
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/tutorialSystem/tutorialSystem.less";
</style>
