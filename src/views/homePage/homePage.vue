<template>
  <div id='homePage'
    class="indexMain">
    <div class="indexCtn">
      <div class="main">
        <div class="leftCtn">
          <div class="img">
            {{username.charAt(username.length-1)}}
          </div>
          <div class="content">
            <div class="line1">{{nowTime}}，{{username}}</div>
            <div class="line2">
              <span class="span">{{station}}</span>
              <span class="span">{{group}}</span>
            </div>
          </div>
        </div>
        <div class="rightCtn">
          <div class="box">
            <span class="label">今日发货</span>
            <span class="number">{{dispatchCount.day}}</span>
          </div>
          <div class="box">
            <span class="label">本周发货</span>
            <span class="number">{{dispatchCount.week}}</span>
          </div>
          <div class="box">
            <span class="label">本月发货</span>
            <span class="number">{{dispatchCount.month}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flexCtn flexCtn1">
      <div class="leftCtn">
        <div class="title">搜索</div>
        <div class="content">
          <div class="searchCtn">
            <el-input class="input"
              placeholder="请输入产品/样品/报价单/订单信息按回车搜索"
              v-model="searchValue"
              @keydown.native.enter="searchInfo">
              <i slot="suffix"
                class="el-input__icon el-icon-search"></i>
              <el-select v-model="searchType"
                slot="prepend"
                class="select"
                placeholder="请选择">
                <el-option label="所有"
                  value="1"></el-option>
                <el-option label="样品"
                  value="2"></el-option>
                <el-option label="样品订单"
                  value="3"></el-option>
                <el-option label="报价单"
                  value="4"></el-option>
                <el-option label="产品"
                  value="5"></el-option>
                <el-option label="订单"
                  value="6"></el-option>
              </el-select>
            </el-input>
            <div class="btn btnBlue"
              @click="searchInfo">搜索</div>
          </div>
          <div class="seachHistory">
            <div class="container">
              <span class="label">近期搜索记录</span>
              <span class="normal"
                v-for="(item,index) in history"
                :key="index"
                @click="searchHistory(item)">{{item}}</span>
            </div>
            <div class="btn noBorder"
              @click="resetHistory">清空历史</div>
          </div>
          <div class="searchBox"
            v-show="showSearch"
            v-loading="searchLoading">
            <i class="el-icon-circle-close icons"
              @click="showSearch = false"></i>
            <div class="block"
              v-show="searchType==='1'||searchType==='2'">
              <div class="titled">相关样品</div>
              <div class="info"
                v-for="item in sampleProductCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.product_code"
                  @click="$router.push('/sample/sampleDetail/' + item.id)"></span>
                <span class="text">{{item.category_info.category_name + '/' + item.category_info.type_name + '/' + item.category_info.style_name }}</span>
                <span class="text">{{item.product_title}}</span>
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="noMsg"
                v-if="sample_product.length===0">暂无相关信息</div>
            </div>
            <div class="block"
              v-show="searchType==='1'||searchType==='3'">
              <div class="titled">相关样单</div>
              <div class="info"
                v-for="item in sampleOrderCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.order_code"
                  @click="$router.push('/sample/sampleOrderDetail/' + (item.pid!==0?item.pid:item.id))"></span>
                <span class="text">{{item.client_name}}</span>
                <span class="text">{{item.total_number}}</span>
                <span class="text">{{item.group_name}}</span>
              </div>
              <div class="noMsg"
                v-if="sample_order.length===0">暂无相关信息</div>
            </div>
            <div class="block"
              v-show="searchType==='1'||searchType==='5'">
              <div class="titled">相关产品</div>
              <div class="info"
                v-for="item in productCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.product_code"
                  @click="$router.push('/product/productDetail/' + item.id)"></span>
                <span class="text">{{item.category_info.category_name + '/' + item.category_info.type_name + '/' + item.category_info.style_name }}</span>
                <span class="text">{{item.product_title}}</span>
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="noMsg"
                v-if="product.length===0">暂无相关信息</div>
            </div>
            <div class="block"
              v-show="searchType==='1'||searchType==='4'">
              <div class="titled">相关报价单</div>
              <div class="info"
                v-for="item in quotationCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.quotation_code"
                  @click="$router.push('/price/priceDetail/' + item.id)"></span>
                <span class="text">{{item.client_name}}</span>
                <span class="text">{{item.total_price}}元</span>
                <span class="text">{{item.status===1?'待审核':(item.status===2?'已通过':'驳回')}}</span>
              </div>
              <div class="noMsg"
                v-if="quotation.length===0">暂无相关信息</div>
            </div>
            <div class="block"
              v-show="searchType==='1'||searchType==='6'">
              <div class="titled">相关订单</div>
              <div class="info"
                v-for="item in orderCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.order_code"
                  @click="$router.push('/order/orderDetail/' + item.id)"></span>
                <span class="text">{{item.client_name}}</span>
                <span class="text">{{item.total_number}}</span>
                <span class="text">{{item.group_name}}</span>
              </div>
              <div class="noMsg"
                v-if="order.length===0">暂无相关信息</div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightCtn">
        <div class="title">快捷操作
          <span class="btn noBorder"
            style="padding-right:0"
            @click="easyOprFlag = true">编辑</span>
        </div>
        <div class="content">
          <span class="opr"
            v-for="(item,index) in userChoosedOpr"
            :key="index"
            @click="$router.push(item.url)">{{item.opr}}</span>
        </div>
      </div>
    </div>
    <div class="flexCtn flexCtn2">
      <div class="leftCtn">
        <div class="title">近期消息
          <span class="btn noBorder"
            style="padding-right:0"
            @click="$router.push('/other/msgList')">查看全部</span>
        </div>
        <div class="box"
          v-for="(item,index) in msgList"
          :key="index">
          <div class="iconCtn"
            :class="{'red':item.type==='紧急','blue':item.type==='普通','orange':item.type==='重要'}">
            <img class="img"
              :src="img[item.tag]" />
          </div>
          <div class="userInfo">
            <span class="userName">{{item.user_name}}</span>
            <span class="time">{{item.create_time|filterTime}}</span>
          </div>
          <div class="message">
            <span v-if="item.tag==='工序'|| item.tag==='审核'"
              v-html="item.content"
              @click="openWin(item.router_url)"></span>
            <span v-if="item.tag==='系统'|| item.tag==='公司'">这是一条{{item.tag}}通知,<span class="blue"
                @click="showMsg(item.content,item.title)">点击查看详情</span></span>
          </div>
        </div>
      </div>
      <div class="rightCtn">
        <div class="title">使用教学
          <span class="btn noBorder"
            style="padding-right:0"
            @click="$openUrl('/tutorialSystem/tutorialSystemList')">查看全部</span>
        </div>
        <div class="line"
          v-for="(item,index) in tutorialSystemArr"
          :key="index">
          <div class="number">{{index + 1}}</div>
          <div class="text"
            @click.prevent="$openUrl('/tutorialSystem/tutorialSystemDetail/' + item.id)">{{item.title}}</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="easyOprFlag">
      <div class="main">
        <div class="title">
          <div class="text">标题</div>
          <i class="el-icon-close"
            @click="easyOprFlag=false"></i>
        </div>
        <div class="content">
          <div class="box">
            <div class="text">当前操作</div>
            <div class="tagCtn">
              <el-tag closable
                v-for="(item,index) in userEasyOpr"
                :key="index"
                @close="deleteOpr(index)">
                {{item}}
              </el-tag>
            </div>
          </div>
          <div class="box">
            <div class="text">可选内容</div>
            <div class="tagCtn">
              <el-checkbox-group v-model="userEasyOpr">
                <el-checkbox v-for="(item,index) in userChooseOpr"
                  :key="index"
                  :label="item.opr"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="easyOprFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="saveOpr">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { notify, globleSearch, indexCount, tutorial } from '@/assets/js/api.js'
export default {
  data () {
    return {
      history: window.localStorage.getItem('searchHistory') ? JSON.parse(window.localStorage.getItem('searchHistory')) : [],
      product: [],
      sample_product: [],
      order: [],
      sample_order: [],
      quotation: [],
      searchType: '1',
      searchValue: '',
      showSearch: false,
      searchLoading: true,
      username: window.sessionStorage.getItem('user_name'),
      station: window.sessionStorage.getItem('has_check') === '1' ? '系统管理员' : '普通用户',
      group: window.sessionStorage.getItem('group_name'),
      msgList: [],
      img: {
        '公司': require('../../assets/image/homePage/公司消息.png'),
        '工序': require('../../assets/image/homePage/工序消息.png'),
        '审核': require('../../assets/image/homePage/审核消息.png'),
        '系统': require('../../assets/image/homePage/系统消息.png')
      },
      easyOprFlag: false,
      easyOpr: [{
        id: 1,
        opr: '添加样品',
        url: '/sample/sampleCreate'
      }, {
        id: 1,
        opr: '样品列表',
        url: '/sample/sampleList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&has_plan=&&has_craft=&&has_quotation='
      }, {
        id: 3,
        opr: '添加产品',
        url: '/product/productCreate'
      }, {
        id: 3,
        opr: '产品列表',
        url: '/product/productList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&has_plan=&&has_craft=&&has_quotation='
      }, {
        id: 2,
        opr: '添加报价单',
        url: '/price/priceCreate',
        check: true
      }, {
        id: 2,
        opr: '报价单列表',
        url: '/price/priceList/page=1&&keyword=&&date=&&status=&&client_id=',
        check: true
      }, {
        id: 5,
        opr: '添加订单',
        url: '/order/orderCreate'
      }, {
        id: 5,
        opr: '订单列表',
        url: '/order/orderList/page=1&&keyword=&&date=&&has_materialOrder=&&has_materialPlan=&&has_materialStock=&&has_weave=&&has_productInOut=&&has_inspection=&&has_boxing=&&group_id=&&company_id=&&state='
      }, {
        id: 6,
        opr: '物料计划单列表',
        url: '/materialPlan/materialPlanList/page=1&&keyword=&&date=&&has_materialPlan=&&group_id=&&company_id=/1'
      }, {
        id: 7,
        opr: '物料预订购',
        url: '/materialOrder/materialOrderCreate'
      }, {
        id: 7,
        opr: '物料预订购列表',
        url: '/materialOrder/materialOrderList/page=1&&keyword=&&date='
      }, {
        id: 7,
        opr: '订单物料订购列表',
        url: '/material/materialList/page=1&&keyword=&&date==&&group_id=&&company_id=/1'
      }, {
        id: 15,
        opr: '物料出入库列表',
        url: '/materialStock/materialStockList/page=1&&keyword=&&date==&&group_id=&&company_id=/1'
      }, {
        id: 8,
        opr: '织造分配列表',
        url: '/weavingProcessing/weavingList/page=1&&keyword=&&date==&&group_id=&&company_id=/1'
      }, {
        id: 8,
        opr: '半成品加工分配列表',
        url: '/weavingProcessing/processingList/page=1&&keyword=&&date==&&group_id=&&company_id=/1'
      }, {
        id: 9,
        opr: '产品收发列表',
        url: '/receiveDispatch/receiveDispatchList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
      }, {
        id: 10,
        opr: '产品检验列表',
        url: '/inspection/inspectionList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
      }, {
        id: 12,
        opr: '仓库列表',
        url: '/stock/stockList/page=1&&keyword=&&type='
      }, {
        id: 11,
        opr: '装箱计划单列表',
        url: '/packPlan/packPlanList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
      }, {
        id: 11,
        opr: '包装订购列表',
        url: '/packPlan/packOrderList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
      }, {
        id: 11,
        opr: '装箱出库列表',
        url: '/packPlan/packStockList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
      }],
      userEasyOpr: window.localStorage.getItem('userEasyOpr') ? JSON.parse(window.localStorage.getItem('userEasyOpr')) : [],
      dispatchCount: {
        day: 0,
        week: 0,
        month: 0
      },
      tutorialSystemArr: []
    }
  },
  computed: {
    nowTime () {
      let hour = (new Date()).getHours()
      if (hour <= 9) {
        return '早安'
      } else if (hour > 9 && hour <= 11) {
        return '上午好'
      } else if (hour > 11 && hour <= 13) {
        return '中午好'
      } else if (hour > 13 && hour <= 17) {
        return '下午好'
      } else {
        return '晚上好'
      }
    },
    productCmp () {
      if (this.searchType === '1') {
        return this.product.slice(0, 3)
      } else {
        return this.product
      }
    },
    sampleProductCmp () {
      if (this.searchType === '1') {
        return this.sample_product.slice(0, 3)
      } else {
        return this.sample_product
      }
    },
    orderCmp () {
      if (this.searchType === '1') {
        return this.order.slice(0, 3)
      } else {
        return this.order
      }
    },
    sampleOrderCmp () {
      if (this.searchType === '1') {
        return this.sample_order.slice(0, 3)
      } else {
        return this.sample_order
      }
    },
    quotationCmp () {
      if (this.searchType === '1') {
        return this.quotation.slice(0, 3)
      } else {
        return this.quotation
      }
    },
    // 用户可选的操作
    userChooseOpr () {
      let moduleArr = window.sessionStorage.getItem('module_id') ? JSON.parse(window.sessionStorage.getItem('module_id')) : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      if (moduleArr) {
        return this.easyOpr.filter((item) => {
          return moduleArr.find((itemFind) => itemFind === item.id)
        })
      } else {
        return this.easyOpr
      }
    },
    // 用户已选的操作
    userChoosedOpr () {
      let arr = []
      this.userEasyOpr.forEach((item) => {
        arr.push(this.easyOpr.find((itemFind) => itemFind.opr === item))
      })
      return arr
    }
  },
  filters: {
    filterTime (time) {
      let time1 = Date.parse(new Date(time))
      let time2 = Date.parse(new Date())
      let deltTime = parseInt((time2 - time1) / (1000 * 60)) // 分钟数
      if (deltTime < 3) {
        return '刚刚'
      } else if (deltTime >= 3 && deltTime < 60) {
        return parseInt(deltTime) + '分钟前'
      } else if (deltTime >= 60 && deltTime <= 1440) {
        return parseInt(deltTime / 60) + '小时前'
      } else if (deltTime > 1440 && deltTime <= 4320) {
        return parseInt(deltTime / 60 / 24) + '天前'
      } else {
        return '3天前'
      }
    }
  },
  methods: {
    openWin (url) {
      window.open(url)
    },
    showMsg (content, title) {
      this.$alert('通知详情：' + content, title, {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      })
    },
    searchHistory (item) {
      this.searchValue = item
      this.searchInfo()
    },
    resetHistory () {
      this.history = []
      window.localStorage.setItem('searchHistory', JSON.stringify([]))
    },
    searchInfo () {
      if (!this.searchValue) {
        this.$message.error('请输入产品/样品/报价单/订单信息按回车搜索')
        return
      }
      this.searchLoading = true
      this.showSearch = true
      if (!this.history.find((item) => item === this.searchValue)) {
        if (this.history.length < 10) {
          this.history.unshift(this.searchValue)
        } else {
          this.history.unshift(this.searchValue)
          this.history.pop()
        }
        window.localStorage.setItem('searchHistory', JSON.stringify(this.history))
      }
      globleSearch.search({
        keyword: this.searchValue
      }).then((res) => {
        let data = res.data.data
        this.product = this.mark(data.product, ['product_code'], this.searchValue)
        this.sample_product = this.mark(data.sample_product, ['product_code'], this.searchValue)
        this.order = this.mark(data.order, ['order_code'], this.searchValue)
        this.sample_order = this.mark(data.sample_order, ['order_code'], this.searchValue)
        this.quotation = this.mark(data.quotation, ['quotation_code'], this.searchValue)
        this.searchLoading = false
      })
    },
    // 标记函数，用于字体高亮
    mark (data, markArr, markStr) {
      let newData = JSON.parse(JSON.stringify(data))
      newData.forEach((item) => {
        markArr.forEach((itemMark) => {
          item[itemMark] = item[itemMark].replace(markStr, '<span style="color:#1a95ff">' + markStr + '</span>')
        })
      })
      return newData
    },
    deleteOpr (index) {
      this.userEasyOpr.splice(index, 1)
    },
    saveOpr () {
      window.localStorage.setItem('userEasyOpr', JSON.stringify(this.userEasyOpr))
      this.$message.success('编辑成功')
      this.easyOprFlag = false
    }
  },
  mounted () {
    document.getElementsByClassName('body')[0].scrollTo(0, 0)
    Promise.all([
      notify.list({
        limit: 7,
        page: 1,
        status: null,
        tag: null
      }),
      indexCount.dispatchCount(),
      tutorial.list()
    ]).then((res) => {
      this.msgList = res[0].data.data
      this.dispatchCount = res[1].data.data
      this.tutorialSystemArr = res[2].data.data.splice(0, 16)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/homePage/homePage.less";
</style>
<style lang="less">
#homePage {
  .searchCtn {
    .el-input-group__prepend {
      background-color: #fff !important;
    }
    .select {
      width: 120px;
      .el-input .el-input__inner {
        border-color: transparent !important;
      }
      .el-input .el-input__inner:focus {
        border-color: transparent !important;
      }
    }
  }
}
</style>
