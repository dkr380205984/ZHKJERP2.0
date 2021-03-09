<template>
  <div class='indexMain'>
    <!-- <zh-editor class='zheditor'
      :canChangeSize='false' /> -->
    <input type="file"
      @change="fileUpdated"
      ref="file">
  </div>
</template>

<script>
// import ZhEditor from '@/components/zhEditor/index.vue'
export default {
  data () {
    return {

    }
  },
  // components: {
  //   ZhEditor
  // },
  methods: {
    getExcelData (file, callBack) {
      const XLSX = require('xlsx')
      const files = file.target.files
      const fileReader = new FileReader()
      fileReader.onload = function (e) {
        try {
          const data = e.target.result
          const bytes = new Uint8Array(data) // 无符号整型数组
          const len = bytes.byteLength
          const binarys = new Array(len) // 创建定长数组，存储文本
          for (let i = 0; i < len; i++) { binarys[i] = String.fromCharCode(bytes[i]) }
          const workbook = XLSX.read(binarys.join(''), { type: 'binary' })
          if (!workbook) { return null }
          const r = {}
          workbook.SheetNames.forEach(name => { // 遍历每张纸数据
            r[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name])
          })
          callBack && callBack(r)
        } catch (e) {
          console.log('文件类型不正确')
        }
      }
      fileReader.readAsArrayBuffer(files[0])
    }
  }
}
</script>

<style scoped lang='less'>
// .zheditor {
//   display: block;
//   width: 800px;
//   height: 800px;
//   background: rgba(0, 0, 0, 0.15);
//   margin: 0 auto;
// }
</style>
