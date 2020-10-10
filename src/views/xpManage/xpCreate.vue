<template>
  <div id="xpCreate"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加芯片</span>
        <div class="btn btnWhiteBlue"
          style="float:right;margin-top:12px;margin-right:32px"
          @click="downloadXp">下载芯片控件</div>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="xpCtn">
              <div class="icon"></div>
              <div class="message">
                <span v-if="xpState===0"
                  style="cursor:pointer"
                  @click="startRead(),xpState=1">点击开始绑定芯片</span>
                <span v-if="xpState===1">请放入芯片</span>
                <span v-if="xpState===2">正在读取数据...</span>
                <span v-if="xpState===3">正在写入数据...</span>
                <span v-if="xpState===4">写入成功，请放入下一个芯片</span>
                <span v-if="xpState===5"
                  style="color:#F5222D">写入失败，请换一个芯片</span>
                <span v-if="xpState===6"
                  style="color:#01B48C">芯片已绑定，请换取下一个芯片
                  <div>当前编号：{{xpNo}}</div>
                </span>
                <span v-if="xpState===7"
                  style="color:#F5222D">请点击下载芯片控件按钮下载控件，刷新页面后重试</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { YOWORFIDReader } from '@/assets/js/YOWOCloudRFIDReader.js'
import { xpManage } from '@/assets/js/api.js'
export default {
  data () {
    return {
      xpNo: '',
      rfidreader: {},
      xpState: 0,
      readTimer: null,
      loading: false
    }
  },
  methods: {
    ReadEPC () {
      this.rfidreader.Repeat = 0
      this.rfidreader.G2_Inventory(0)
    },
    WriteEPC (id) {
      console.log(id)
      this.rfidreader.KeyStringMode = 1
      this.rfidreader.KeyString = '0'
      this.rfidreader.Repeat = 0
      this.rfidreader.G2_WriteEPC(id)
    },
    startRead () {
      this.readTimer = setInterval(() => {
        this.ReadEPC()
      }, 1000)
    },
    getXpId () {
      this.loading = true
      xpManage.create({
        chip_id: '',
        order_id: '',
        product_id: '',
        color_id: '',
        size_id: ''
      }).then((res) => {
        this.loading = false
        this.xpState = 3
        this.WriteEPC(res.data.data.chip_id)
      })
    },
    GetErrStr (ErrCode) {
      let ErrText = '未知错误'
      switch (ErrCode) {
        case -1: ErrText = '没有找到IC卡读卡器，支持型号：YW-605HA或者YW-607,YW-627'; break
        case -3: ErrText = '寻卡失败'; break
        case -4: ErrText = '寻卡失败'; break
        case -5: ErrText = '卡休眠失败'; break
        case -6: ErrText = '密钥认证失败'; break
        case -7: ErrText = '读失败'; break
        case -8: ErrText = '写失败'; break
        case -9: ErrText = '钱包初始化失败'; break
        case -10: ErrText = '钱包读余额失败'; break
        case -11: ErrText = '钱包充值失败'; break
        case -12: ErrText = '钱包减值失败'; break
        case -13: ErrText = '复位错误'; break
        case -14: ErrText = 'COS执行错误'; break
        case -101: ErrText = '参数错误'; break
        case -102: ErrText = 'DES校验错误'; break
        case -103: ErrText = '读卡器不支持'; break
        case -600: ErrText = '没找到YW-602系列UHF读卡器'; break
        case -601: ErrText = '寻G2标签失败'; break
        case -602: ErrText = '读G2标签失败'; break
        case -603: ErrText = '写G2标签失败'; break
        case -604: ErrText = '执行失败'; break
      }
      return ErrText
    },
    goNext () {
      this.xpState = 2
      this.startRead()
    },
    connectXp () {
      this.rfidreader = null
      try {
        this.rfidreader = YOWORFIDReader.createNew()
      } catch (e) {
        this.$message.error('连接芯片读写器失败，请先下载安装或插入设备！')
        this.xpState = 8
      }
      if (!this.rfidreader.TryConnect()) {
        this.$message.error('连接芯片读写器失败，请先下载安装或插入设备！')
      }
      this.rfidreader.onResult((resultdata) => {
        switch (resultdata.FunctionID) {
          // 读EPC
          case 23:
            if (resultdata.Result > 0) {
              if (resultdata.CardNo && resultdata.CardNo.length > 7 && resultdata.CardNo.substring(0, 6) === '7A7779') {
                this.xpNo = resultdata.CardNo
                this.xpState = 6
              } else {
                clearInterval(this.readTimer)
                this.readTimer = null
                this.xpState = 2
                this.getXpId()
              }
            } else {
              console.log('读EPC失败，错误：' + this.GetErrStr(resultdata.Result))
            }
            break
          // 写EPC
          case 26:
            if (resultdata.Result > 0) {
              this.xpState = 4
              this.goNext()
            } else {
              clearInterval(this.readTimer)
              this.readTimer = null
              this.xpState = 5
              this.startRead()
            }
            break
        }
      })
    },
    bindOver () {
      this.xpState = 1
      clearInterval(this.readTimer)
      this.readTimer = null
      this.rfidreader.Disconnect()
    },
    downloadXp () {
      window.location = 'http://www.youwokeji.com.cn/CloudReader/YOWORFIDReaderCloudForWeb.exe'
    }
  },
  mounted () {
    this.connectXp()
  },
  beforeDestroy () {
    this.bindOver()
  }
}
</script>
<style scoped lang='less'>
@import "~@/assets/less/xpManage/xpCreate.less";
</style>
