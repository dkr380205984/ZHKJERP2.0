<template>
  <div id="batchXpOpration"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listHead">
        <div class="box">
          <div class="boxTop">今日{{type[$route.params.type]}}记录</div>
          <div class="boxBottom">
            <span class="num">{{today.logNumber}}</span>
            <span class="em"></span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">今日{{type[$route.params.type]}}总数量</div>
          <div class="boxBottom">
            <span class="num">{{today.productNumber}}</span>
            <span class="em"></span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">本次{{type[$route.params.type]}}记录</div>
          <div class="boxBottom">
            <span class="num">{{now.logNumber}}</span>
            <span class="em"></span>
          </div>
        </div>
        <div class="box">
          <div class="boxTop">当前{{type[$route.params.type]}}总数量</div>
          <div class="boxBottom">
            <span class="num">{{now.productNumber}}</span>
            <span class="em"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
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
            <div class="col">
              <span class="text">数量/捆数</span>
            </div>
            <!-- <div class="col">
              <span class="text">次品数/原因</span>
            </div> -->
            <!-- <div class="col">
              <span class="text">状态</span>
            </div> -->
            <!-- <div class="col">
              <span class="text">操作</span>
            </div> -->
          </div>
          <div class="row"
            style="justify-content: space-around;color:#ccc"
            v-if="list.length === 0">
            今日暂无{{type[$route.params.type]}}记录
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">
              <span>
                {{(Array(8).join(0) + item.id).slice(-8)}}
              </span>
              <span v-if="item.blink"
                class="blink"
                style="margin-left:5px;vertical-align:middle;margin-bottom:2px">新</span>
            </div>
            <div class="col">
              {{item.order_code}}
            </div>
            <div class="col">
              <span>{{item.product_info.product_code}}</span>
              <span>({{item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name}})</span>
            </div>
            <div class="col">
              {{item.size_name + '/' + item.color_name}}
            </div>
            <div class="col">
              {{item.number}}({{item.count||0}}捆)
            </div>
            <!-- <div class="col"
              :style="{'color':item.shoddy_number&&Number(item.shoddy_number)>0?'#F5222D':'#ccc'}">
              {{item.shoddy_number||0}}<span v-if="item.shoddy_reason"
                style="color:#1a95ff;cursor:pointer"
                @click="$alert(item.shoddy_reason, '次品原因', {confirmButtonText: '确定'})">(查看)</span>
            </div> -->
            <!-- <div class="col">
              <div class="stateCtn"
                :class="{'green':item.is_chip===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_chip===1?'绑定日期：' + item.chip_time.slice(0,10):'未绑定'"
                  placement="top">
                  <span class="name">芯</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_weave_push===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_weave_push===1?'入库日期：' + item.weave_time.slice(0,10):'未入库'"
                  placement="top">
                  <span class="name">入</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_inspection===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_inspection===1?'检验日期：' + item.inspection_time.slice(0,10):'未检验'"
                  placement="top">
                  <span class="name">检</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_semi_pop===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_semi_pop===1?'出库日期：' + item.semi_pop_time.slice(0,10):'未出库'"
                  placement="top">
                  <span class="name">出</span>
                </el-tooltip>
              </div>
              <div class="stateCtn"
                :class="{'green':item.is_semi_push===1}">
                <div class="state"></div>
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_semi_push===1?'回库日期：' + item.semi_push_time.slice(0,10):'未回库'"
                  placement="top">
                  <span class="name">回</span>
                </el-tooltip>
              </div>
            </div> -->
            <!-- <div class="col">
              <span class="opr">入库</span>
              <span class="opr">出库</span>
              <span class="opr">回库</span>
            </div> -->
          </div>
        </div>
        <!-- <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getList">
          </el-pagination>
        </div> -->
      </div>
    </div>
    <div class="popup"
      v-show="xpFlag">
      <div class="main">
        <div class="stockState">
          <div class="icon"></div>
          <div class="message">
            <span v-if="xpState===1">正在读取芯片,请不要刷新页面
              <span>目前已经扫了{{dataBuffer.length}}捆</span>
            </span>
            <span v-if="xpState===2">正在上传数据...</span>
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
import { YOWORFIDReader } from '@/assets/js/YOWOCloudRFIDReader.js'
import { receiveDispatch } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      type: {
        1: '入库',
        2: '出库',
        3: '回库'
      },
      list: [],
      total: 0,
      pages: 1,
      rfidreader: null,
      timer: null,
      xpState: 1,
      xpFlag: false,
      readTimer: null,
      dataBuffer: [],
      today: {
        logNumber: 0,
        productNumber: 0
      },
      now: {
        logNumber: 0,
        productNumber: 0
      }
    }
  },
  watch: {
    $route () {
      this.rfidreader.Disconnect()
      clearInterval(this.readTimer)
      this.readTimer = null
    }
  },
  methods: {
    getList () {
      this.loading = true
      receiveDispatch.allDetail({
        order_id: '',
        order_type: 1,
        limit: 1000,
        page: this.pages,
        start_time: this.$getTime((new Date()).getTime() - 24 * 60 * 60 * 1000),
        end_time: this.$getTime(new Date()),
        time_type: this.$route.params.type === '1' ? 'is_weave_push' : (this.$route.params.type === '2' ? 'is_semi_pop' : 'is_semi_push'),
        is_weave_push: this.$route.params.type === '1' ? 1 : '',
        is_semi_pop: this.$route.params.type === '2' ? 1 : '',
        is_semi_push: this.$route.params.type === '3' ? 1 : ''
      }).then(res => {
        this.list = res.data.data
        this.today = this.cmpList(this.list)
        this.loading = false
      })
    },
    downloadXp () {
      window.location = 'http://www.youwokeji.com.cn/CloudReader/YOWORFIDReaderCloudForWeb.exe'
    },
    connectXp () {
      try {
        this.rfidreader = YOWORFIDReader.createNew()
        console.log(this.rfidreader)
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
    findBuffer (CardNo) {
      let flag = false
      let cardNoArr = CardNo.trim().split(/\s+\n/).map((item) => Number(item)).filter((item) => !Number.isNaN(item))
      console.log(cardNoArr)
      cardNoArr.forEach((itemChild) => {
        if (this.dataBuffer.indexOf(itemChild) === -1) {
          flag = true
        }
      })
      if (flag) {
        console.log(this.dataBuffer, cardNoArr)
        this.dataBuffer = Array.from(new Set(this.dataBuffer.concat(cardNoArr)))
      }
      return flag
    },
    ReadEPC () {
      this.rfidreader.BeepOnSuccess = 0
      this.rfidreader.Repeat = 0
      this.rfidreader.G2_Inventory(0)
    },
    startRead () {
      this.readTimer = setInterval(() => {
        this.ReadEPC()
      }, 10)
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
      clearInterval(this.readTimer)
      this.readTimer = null
      Promise.all([
        receiveDispatch.allDetailById({
          id: this.dataBuffer,
          type: this.$route.params.type === '1' ? 'is_weave_push' : (this.$route.params.type === '2' ? 'is_semi_pop' : 'is_semi_push')
        }).then((res) => {
          if (res.data.status) {
            this.now = this.cmpList(res.data.data)
            this.$message.success(this.type[this.$route.params.type] + '成功,本次入库' + this.now.logNumber + '捆,产品数量' + this.now.productNumber)
            this.list = this.list.concat(res.data.data.map((item) => {
              item.blink = true
              return item
            }))
            this.today = this.cmpList(this.list)
            this.xpState = 1
            this.xpFlag = false
            this.dataBuffer = []
            this.connectXp()
            this.startRead()
          }
        })
      ])
    },
    cmpList (data) {
      return {
        logNumber: data.length,
        productNumber: data.reduce((total, current) => {
          return total + current.number
        }, 0)
      }
    }
  },
  mounted () {
    let _this = this
    window.onunload = function () {
      _this.rfidreader.Disconnect()
      clearInterval(this.readTimer)
      _this.readTimer = null
    }
    window.onbeforeunload = function () {
      _this.rfidreader.Disconnect()
      clearInterval(this.readTimer)
      _this.readTimer = null
    }
    this.connectXp()
    this.startRead()
    this.loading = false
    this.getList()
  },
  destroyed () {
    this.rfidreader.Disconnect()
    clearInterval(this.readTimer)
    this.readTimer = null
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/receiveDispatch/batchXpOpration.less";
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
/* 添加兼容性前缀 */
@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
@-ms-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
@-o-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
/* 定义blink类*/
.blink {
  color: #01b48c;
  animation: blink 2s linear infinite;
  /* 其它浏览器兼容性前缀 */
  -webkit-animation: blink 2s linear infinite;
  -moz-animation: blink 2s linear infinite;
  -ms-animation: blink 2s linear infinite;
  -o-animation: blink 2s linear infinite;
}
</style>
