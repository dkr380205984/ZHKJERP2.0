<template>
  <div class='zh_editor_content'
    :ref="refId"
    @click.right="showMeauEvent"
    @dragover="(e)=>{e.preventDefault()}"
    @drop="eventFun">
    <div class="zh_editor_content__box"
      :ref="`${refId}_main`">
      <zh-editor-text @select='selectComponent'
        v-for="(itemText,indexText) in editorTextArr"
        v-model="itemText.value"
        :key="indexText+'text'"
        :zIndex="itemText.zIndex"
        :isSelect="selectId"
        :pId="refId"
        @zIndex='changeZIndex($event,itemText)' />
      <zh-editor-img @select='selectComponent'
        v-for="(itemImg,indexImg) in editorImgArr"
        v-model="itemImg.value"
        :key="indexImg+'image'"
        :zIndex="itemImg.zIndex"
        :isSelect="selectId"
        :pId="refId"
        @zIndex='changeZIndex($event,itemImg)' />
    </div>
    <ul class="zh_editor_content__meau"
      v-show="showMeau"
      @click.stop="(e)=>false"
      :style="`top:${meauTop}px;left:${meauLeft}px`">
      <li class="zh_editor_content__meau_item"
        @click="addTxt">添加文本</li>
      <li class="zh_editor_content__meau_item"
        @click="showFileCheckPopup = true; showMeau = false">添加图片</li>
      <li class="zh_editor_content__meau_item"
        @click="downloadImage">导出图片</li>
    </ul>
    <div class="zh_editor_content__popup"
      :style="`z-index:${maxLength + 1}`"
      @click.right.stop="(e)=>false"
      v-if="showFileCheckPopup">
      <div class="main">
        <input type="file"
          accept="image/*"
          class="file_input"
          :ref="`${refId}_file`">
        <div class="handleCtn">
          <div class="btn"
            @click="showFileCheckPopup =false">取消</div>
          <div class="btn blueBtn"
            @click="addImg">添加</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ZhEditorText from './zhEditorText/index.vue'
import ZhEditorImg from './zhEditorImg/index.vue'
// import html2canvas from 'html2canvas'
import { getNodeOutset } from './index.js'
export default {
  name: 'zhkjEditor',
  props: {
    canChangeSize: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      refId: Math.random().toString(32).slice(2, 8),
      offsetLeft: 0,
      offsetTop: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      selectId: '',
      showMeau: false,
      meauTop: 0,
      meauLeft: 0,
      editorTextArr: [],
      editorImgArr: [],
      showFileCheckPopup: false
    }
  },
  methods: {
    getImage () {
      return new Promise((resolve, reject) => {
        const html2canvas = require('html2canvas')
        const $EC = this.$refs[`${this.refId}_main`]
        html2canvas($EC, { allowTaint: true, useCORS: true }).then(res => {
          const base64Url = res.toDataURL('image/png')
          const info = Array.from($EC.childNodes).map(itemN => {
            return itemN.$getEditorNodeInfo()
          })
          console.log({ base64Url, info })
          resolve({ base64Url, info })
        })
      })
    },
    downloadImage () {
      this.getImage().then(res => {
        let aLink = document.createElement('a')
        aLink.href = res.base64Url
        aLink.download = new Date().getTime() + '.png'
        aLink.click()
      })
    },
    showMeauEvent (e) {
      e.preventDefault()
      this.selectId = ''
      this.meauTop = e.clientY
      this.meauLeft = e.clientX
      this.showMeau = true
    },
    // 改变画布大小
    changeSize (e) {
      if (e.clientX <= (this.offsetWidth + this.offsetLeft + 1) && e.clientX >= (this.offsetWidth + this.offsetLeft - 5) && e.clientY <= (this.offsetHeight + this.offsetTop + 1) && e.clientY >= (this.offsetHeight + this.offsetTop - 5)) {
        // console.log(e.clientX, e.clientY)
        document.body.style.cursor = 'se-resize'
        window.addEventListener('mousedown', this.changeDowm)
      } else {
        document.body.style.cursor = 'auto'
        window.removeEventListener('mousedown', this.changeDowm)
      }
    },
    changeDowm (e) {
      this.selectId = ''
      window.addEventListener('mousemove', this.changeMove)
      window.addEventListener('mouseup', this.changeUp)
    },
    changeMove (e) {
      console.log(e)
      // 跟随鼠标改变宽高
      this.selfNode.style.width = `${e.clientX - this.offsetLeft}px`
      this.selfNode.style.height = `${e.clientY - this.offsetTop}px`
      // 更新width,height,left,top
      this.updateNodeInfo()
    },
    changeUp (e) {
      window.removeEventListener('mousemove', this.changeMove)
      window.removeEventListener('mouseup', this.changeUp)
    },
    selectComponent (id) {
      this.selectId = id
    },
    updateNodeInfo () {
      const nodeInfo = getNodeOutset(this.selfNode, true)
      this.offsetLeft = nodeInfo.left
      this.offsetTop = nodeInfo.top
      this.offsetWidth = this.selfNode.offsetWidth
      this.offsetHeight = this.selfNode.offsetHeight
    },
    addTxt () {
      this.editorTextArr.push({
        zIndex: this.maxLength + 1,
        value: {}
      })
      this.showMeau = false
    },
    addImg () {
      const value = this.$refs[`${this.refId}_file`].files
      if (value.length === 0) {
        this.$message.warning('请选择一个图片')
        return
      }
      const fr = new FileReader()
      fr.readAsDataURL(value[0])
      fr.onload = () => {
        const img = new Image()
        img.src = fr.result
        img.onload = () => {
          this.editorImgArr.push({
            zIndex: this.maxLength + 1,
            value: {
              width: img.width,
              height: img.height,
              imgUrl: fr.result
            }
          })
        }
        this.showFileCheckPopup = false
      }
    },
    eventFun (e) {
      if (!e.dataTransfer.files[0]) return
      const fr = new FileReader()
      fr.readAsDataURL(e.dataTransfer.files[0])
      fr.onload = () => {
        const img = new Image()
        img.src = fr.result
        img.onload = () => {
          const { imgW, imgH } = {
            imgW: img.width,
            imgH: img.height
          }
          const { maxW, maxH } = {
            maxW: this.selfNode.offsetWidth,
            maxH: this.selfNode.offsetHeight
          }
          if (imgW > maxW || imgH > maxH) {
            const ratio = imgW / imgH
            if (imgW > imgH) {
              this.editorImgArr.push({
                zIndex: this.maxLength + 1,
                value: {
                  imgUrl: fr.result,
                  width: maxW,
                  height: maxW / ratio
                }
              })
            } else {
              this.editorImgArr.push({
                zIndex: this.maxLength + 1,
                value: {
                  imgUrl: fr.result,
                  width: maxH * ratio,
                  height: maxH
                }
              })
            }
          } else {
            this.editorImgArr.push({
              zIndex: this.maxLength + 1,
              value: {
                imgUrl: fr.result,
                width: imgW,
                height: imgH
              }
            })
          }
        }
      }
    },
    changeZIndex (flag, item) {
      if (!flag && item.zIndex === 1) return
      if (flag && item.zIndex === this.maxLength) return
      const changedIndex = flag ? item.zIndex + 1 : item.zIndex - 1
      let finded = this.editorImgArr.find(itemF => itemF.zIndex === changedIndex) || this.editorTextArr.find(itemF => itemF.zIndex === changedIndex)
      console.log(finded)
      if (finded) {
        finded.zIndex = item.zIndex
        item.zIndex = changedIndex
      }
    }
  },
  mounted () {
    this.updateNodeInfo()
    if (this.canChangeSize) {
      window.addEventListener('mousemove', this.changeSize)
    }
    window.addEventListener('click', () => {
      this.selectId = ''
      this.showMeau = false
    })
    document.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
    document.addEventListener('drop', (e) => {
      e.preventDefault()
    })
  },
  computed: {
    selfNode () {
      return this.$refs[this.refId]
    },
    maxLength () {
      return this.editorTextArr.length + this.editorImgArr.length
    }
  },
  components: {
    ZhEditorText,
    ZhEditorImg
  }
}
</script>

<style scoped lang='less'>
@import "./index.less";
</style>
