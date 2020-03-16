<template>
  <div id="tutorialSystemDetail"
    class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{tutorialSystemInfo.title}}</span>
      </div>
      <div class="detailCtn">
        <div class="stepsCtn">
          <div class="step_item"
            v-for="(item,index) in tutorialSystemInfo.content"
            :key="index">
            <div class="lineCtn">
              <div class="step_num">{{index+1}}</div>
              <div class="step_line"></div>
            </div>
            <div class="contentCtn">
              <div class="textCtn">{{item.describe}}</div>
              <div class="imageCtn">
                <template v-if="item.file_data.length>0">
                  <el-image v-for="(itemImg,indexImg) in item.file_data"
                    :key="indexImg"
                    :src="item.file_data[indexImg]"
                    :preview-src-list="[item.file_data[indexImg]]">
                  </el-image>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnOrange"
            @click="$router.push('/tutorialSystem/tutorialSystemList')">不是我想要的，返回重新搜索</div>
          <div class="btn btnBlue"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tutorial } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      tutorialSystemInfo: []
    }
  },
  methods: {
    // handleSelect ($event) {
    //   this.searchInfo = $event.info.sort((a, b) => {
    //     return a.step_id - b.step_id
    //   })
    // },
    // querySearch (queryString, cb) {
    //   let data = this.tutorialSystemInfo.map(item => {
    //     let matching = 0
    //     if (item.name.indexOf(queryString) !== -1) {
    //       matching += 100
    //     }
    //     let searchArr = queryString.split('')
    //     searchArr.forEach(itemSearch => {
    //       if (item.name.indexOf(itemSearch) !== -1) {
    //         matching++
    //       }
    //     })
    //     return {
    //       ...item,
    //       value: item.name,
    //       matching: matching
    //     }
    //   })
    //   let afterSearchData = data.filter(item => item.matching > 0).sort((a, b) => {
    //     return b.matching - a.matching
    //   })
    //   let results = queryString ? afterSearchData : data
    //   cb(results)
    // },
    // checkFirst (queryString) {
    //   let data = this.tutorialSystemInfo.map(item => {
    //     let matching = 0
    //     if (item.name.indexOf(queryString) !== -1) {
    //       matching += 100
    //     }
    //     let searchArr = queryString.split('')
    //     searchArr.forEach(itemSearch => {
    //       if (item.name.indexOf(itemSearch) !== -1) {
    //         matching++
    //       }
    //     })
    //     return {
    //       ...item,
    //       value: item.name,
    //       matching: matching
    //     }
    //   })
    //   let afterSearchData = data.filter(item => item.matching > 0).sort((a, b) => {
    //     return b.matching - a.matching
    //   })
    //   let results = queryString ? afterSearchData : data
    //   this.handleSelect(results[0])
    // }
  },
  created () {
    // if (this.$route.query.queryString) {
    //   this.queryString = this.$route.query.queryString
    // }
    // this.checkFirst(this.queryString || '')
    tutorial.detail({
      id: this.$route.params.id
    }).then(res => {
      if (res.data.status !== false) {
        this.tutorialSystemInfo = res.data.data
        this.tutorialSystemInfo.content = JSON.parse(this.tutorialSystemInfo.content)
        this.loading = false
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/tutorialSystem/tutorialSystemDetail.less";
</style>
