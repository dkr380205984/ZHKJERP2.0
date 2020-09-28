<template>
  <div id="xpOutIn"
    class="indexMain">
    <!-- <div class="module">
      <div class="listHead">
        <div class="box">
          <div class="boxTop">今日入库订单数量</div>
          <div class="boxBottom">
            <span class="num">{{statistic.orderNumber}}</span>
            <span class="em"></span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">今日入库产品种类</div>
          <div class="boxBottom">
            <span class="num">{{statistic.productNumber}}</span>
            <span class="em"></span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">本次入库产品种类</div>
          <div class="boxBottom">
            <span class="num">{{statistic.nowType}}</span>
            <span class="em"></span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">本次入库产品总量</div>
          <div class="boxBottom">
            <span class="num">{{statistic.nowNumber}}</span>
            <span class="em"></span>
          </div>
        </div>
      </div>
    </div> -->
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">选择入库工序：</span>
            <span class="filter_line">
              <el-select style="width:200px"
                v-model="process"
                placeholder="请先选择工序">
                <el-option v-for="item in processArr"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"></el-option>
              </el-select>
            </span>
          </div>
          <div class="leftCtn">
            <div style="font-size:14px;color:rgba(0,0,0,.65)">入库日期：{{$getTime(new Date())}}</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">芯片编号</span>
            </div>
            <div class="col">
              <span class="text">订单号</span>
            </div>
            <div class="col">
              <span class="text">产品信息</span>
            </div>
            <div class="col">
              <span class="text">尺码颜色</span>
            </div>
          </div>
          <div class="row"
            v-if="todayList.length===0">
            <div class="col"
              style="text-align:center;display:block;color:#ccc">
              今日暂无入库信息
            </div>
          </div>
          <div class="row"
            v-for="item in todayList"
            :key="item.id">
            <div class="col">
              <span class="text">{{item.chip_id}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.order_code}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.product_code}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.size_name}}/{{item.color_name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="xpFlag">
      <div class="main">
        <div class="stockState">
          <div class="icon"></div>
          <div class="message">
            <span v-if="xpState===1">正在读取芯片,请不要刷新页面
              <span>目前已经扫了{{dataBuffer.length}}个</span>
            </span>
            <span v-if="xpState===2">正在上传数据...</span>
            <span v-if="xpState===3">数据读取成功</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="downloadXp">下载芯片控件</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { process, xpManage } from '@/assets/js/api.js'
import { YOWORFIDReader } from '@/assets/js/YOWOCloudRFIDReader.js'
export default {
  data () {
    return {
      rfidreader: null,
      statistic: {
        orderNumber: '0',
        productNumber: '0',
        nowType: '0',
        nowNumber: '0'
      },
      process: '套口',
      processArr: '',
      xpFlag: false,
      xpState: 1,
      dataBuffer: [],
      todayList: [],
      timer: ''
    }
  },
  methods: {
    downloadXp () {
      window.location = 'http://www.youwokeji.com.cn/CloudReader/YOWORFIDReaderCloudForWeb.exe'
    },
    findBuffer (CardNo) {
      let flag = false
      let cardNoArr = CardNo.split('\n')
      cardNoArr.forEach((item) => {
        if (item && !this.dataBuffer.includes(item)) {
          if (item.substring(0, 6) === '7A7779') {
            this.dataBuffer.push(item)
            this.dataBuffer.sort()
            flag = true
          } else {
            this.$message.error('检测到当前批次中部分芯片不合格，芯片号码为：' + item + '，请自行处理')
          }
        }
      })
      return flag
    },
    connectXp () {
      try {
        this.rfidreader = YOWORFIDReader.createNew()
      } catch (e) {
        this.$message.error('连接芯片读写器失败，请先下载安装或插入设备！')
      }
      if (!this.rfidreader.TryConnect()) {
        this.$message.error('连接芯片读写器失败，请先下载安装或插入设备！')
      }
      this.rfidreader.onResult((resultdata) => {
        switch (resultdata.FunctionID) {
          // 读EPC
          case 23:
            if (resultdata.Result > 0) {
              if (!this.timer) {
                this.timer = setTimeout(() => {
                  this.submitXp()
                }, 10000)
              }
              this.xpFlag = true
              if (this.findBuffer(resultdata.CardNo)) {
                clearTimeout(this.timer)
                this.timer = null
              }
            } else {
              console.log('读EPC失败，错误：' + this.GetErrStr(resultdata.Result))
            }
            break
        }
      })
    },
    ReadEPC () {
      setTimeout(() => {
        // this.rfidreader.BeepOnSuccess = 0
        this.rfidreader.Repeat = 1
        this.rfidreader.G2_Inventory(0)
      }, 3000)
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
    submitXp () {
      this.rfidreader.Disconnect()
      this.xpState = 2
      console.log(this.dataBuffer)
      xpManage.outAndIn({
        id: this.dataBuffer.map((item) => Number(item.substring(9))),
        process: this.process
      }).then((res) => {
        this.$message.success('读取成功')
        this.xpState = 3
        setTimeout(() => {
          this.xpState = 1
          this.xpFlag = false
        }, 2000)
        this.dataBuffer = []
        this.todayList = this.todayList.concat(res.data.data)
        this.connectXp()
        this.ReadEPC()
      })
    }
  },
  mounted () {
    process.list().then((res) => {
      this.processArr = [{
        value: '套口',
        label: '套口'
      }].concat(res.data.data.filter(item => item.type === 3).map((item) => {
        return {
          value: item.name,
          label: item.name
        }
      }))
    })
    let _this = this
    window.onunload = function () {
      _this.rfidreader.Disconnect()
    }
    window.onbeforeunload = function () {
      _this.rfidreader.Disconnect()
    }
    this.connectXp()
    this.ReadEPC()
  },
  destroyed () {
    this.rfidreader.Disconnect()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/xpManage/xpOutIn.less";
</style>
