<template>
  <div id="tutorialSystemDetail"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{$route.query.keyword}}</span>
      </div>
      <div class="detailCtn">
        <div class="stepsCtn">
          <div class="step_item">
            <div class="lineCtn">
              <div class="step_num">1</div>
              <div class="step_line"></div>
            </div>
            <div class="contentCtn">
              <div class="textCtn">第一步<br />第二步</div>
              <div class="imageCtn"></div>
            </div>
          </div>
          <div class="step_item">
            <div class="lineCtn">
              <div class="step_num">2</div>
              <div class="step_line"></div>
            </div>
            <div class="contentCtn">
              <div class="textCtn">第二步<br />第二步</div>
              <div class="imageCtn">
                <el-image style="width: 100px; height: 100px"
                  :src="url"
                  :preview-src-list="srcList">
                </el-image>
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
            @click="$router.go(-1)">返回上一页</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      tutorialSystemInfo: [],
      searchInfo: [],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ]
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
@import "~@/assets/less/tutorialSystem/tutorialSystemDetail.less";
</style>
