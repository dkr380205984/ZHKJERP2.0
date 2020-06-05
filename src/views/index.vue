<template>
  <div id="index">
    <div class="header">
      <div class="navCtn">
        <div class="leftCtn">
          <div class="companyCtn"
            @click="$router.push('/homePage/homePage')">
            <div class="logo">
              <img :src="logo" />
            </div>
            <div class="name">{{companyName}}</div>
          </div>
          <zh-nav :data="navCmp"
            maxLength="4">
          </zh-nav>
        </div>
        <div class="rightCtn">
          <i v-show="false"
            class="el-icon-data-line elIcon"
            @click="$router.push('/other/chartIndex')"></i>
          <!-- <i class="el-icon-cpu elIcon"
            @click="$router.push('/equipment')"></i> -->
          <div class="msgCtn">
            <el-badge :is-dot="total>0">
              <i class="el-icon-bell elIcon"
                @click="$router.push('/other/msgList')"></i>
            </el-badge>
            <div class="msgTop"></div>
            <div class="msgBox">
              <div class="msgOpr">
                <span>消息通知</span>
                <span @click="readAll">全部标记已读</span>
              </div>
              <div class="msgContent">
                <div class="noMsg"
                  v-show="msgList.length===0">暂无新通知</div>
                <div class="oneMsg"
                  v-for="item in msgList"
                  :key="item.id">
                  <div class="oneMsgLeft">
                    <div class="oneMsgLine1">
                      <span class="oneMsgTitle"
                        @click="readMsg(item)"
                        :class="{'must':item.type==='紧急','normal':item.type==='普通','important':item.type==='重要'}">{{item.title}}</span>
                      <span class="mark"
                        :class="{'blue':item.tag==='工序'||item.tag==='审核','purple':item.tag==='公司','yellow':item.tag==='系统'}">{{item.tag}}</span>
                    </div>
                    <div class="oneMsgLine2">
                      <div class="oneMsgInfo"
                        v-html="item.content"></div>
                    </div>
                  </div>
                  <div class="oneMsgRight">
                    <div class="oneMsgLine1">{{item.create_time.slice(0,10)}}</div>
                    <div class="oneMsgLine2">{{item.user_name}}</div>
                  </div>
                </div>
              </div>
              <div class="msgBottom"><span @click="$router.push('/other/msgList')">查看全部通知</span></div>
            </div>
          </div>
          <i class="el-icon-setting elIcon"
            v-show="haveSet"
            @click="$router.push('/setting/setting')"></i>
          <div class="headImg">{{userName.charAt(userName.length-1)}}</div>
          <div class="selectCtn">
            <el-dropdown @command="commondHandler"
              trigger="click">
              <span class="el-dropdown-link">
                个人中心<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sendMsg">发布通知</el-dropdown-item>
                <el-dropdown-item command="changePas"
                  divided>修改密码</el-dropdown-item>
                <el-dropdown-item command="logout"
                  divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="breadCtn">
      <div class="bread">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item,index) in breadUrl"
            :key="index"><span class="breadText"
              @click="goBack(index)">{{item}}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="titleCtn">
      <div class="title">
        {{title}}
      </div>
    </div>
    <div class="body">
      <div class="main">
        <!-- keep-alive是Vue提供的一个抽象组件，用来对组件进行缓存  -->
        <router-view />
      </div>
    </div>
    <div class="popup"
      v-if="changePasPopupFlag">
      <div class="main">
        <div class="title">
          <span class="text">修改密码</span>
          <span class="el-icon-close"
            @click="closePopup"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">原密码：</span>
            <span class="info">
              <zh-input placeholder="请输入原密码"
                v-model="oldPasd" />
            </span>
          </div>
          <div class="row">
            <span class="label">新密码：</span>
            <span class="info">
              <zh-input placeholder="请输入新密码"
                v-model="firstPasd" />
            </span>
          </div>
          <div class="row">
            <span class="label">确认密码：</span>
            <span class="info">
              <zh-input placeholder="请再次输入新密码"
                v-model="lastPasd" />
            </span>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="closePopup">取消</div>
          <div class="btn btnBlue"
            @click="changePasd">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pusher from 'pusher-js' // 全局方法
import { logout, notify, changeUserPasd } from '@/assets/js/api.js'
export default {
  data () {
    return {
      moduleArr: window.sessionStorage.getItem('module_id') ? JSON.parse(window.sessionStorage.getItem('module_id')) : [],
      userName: window.sessionStorage.getItem('user_name'),
      logo: window.sessionStorage.getItem('logo') || require('@/assets/image/index/noPic.jpg'),
      companyName: window.sessionStorage.getItem('company_name') || '未登录',
      msgList: [],
      total: 0,
      changePasPopupFlag: false,
      oldPasd: '',
      firstPasd: '',
      lastPasd: '',
      navData: [{
        name: '样品管理',
        icon: require('@/assets/image/index/样品管理.png'),
        id: 1,
        children: [{
          name: '样品添加',
          url: '/sample/sampleCreate'
        }, {
          name: '样品列表',
          url: '/sample/sampleList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&user_id=&&has_plan=&&has_craft=&&has_quotation='
        }, {
          name: '样品订单添加',
          url: '/sample/sampleOrderCreate'
        }, {
          name: '样品订单列表',
          url: '/sample/sampleOrderList/page=1&&keyword=&&date=&&has_material=&&has_materialPlan=&&has_materialStock=&&has_weave=&&group_id=&&company_id=&&state=&&searchOrderOrProduct='
        }]
      }, {
        name: '报价管理',
        icon: require('@/assets/image/index/报价单管理.png'),
        id: 2,
        children: [{
          name: '添加报价单',
          url: '/price/priceCreate'
        }, {
          name: '报价单列表',
          url: '/price/priceList/page=1&&keyword=&&date=&&status=&&client_id=&&user_id='
        }]
      }, {
        name: '产品管理',
        id: 3,
        icon: require('@/assets/image/index/产品管理.png'),
        children: [{
          name: '产品添加',
          url: '/product/productCreate'
        }, {
          name: '产品列表',
          url: '/product/productList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&user_id=&&has_plan=&&has_craft=&&has_quotation='
        }]
      }, {
        name: '工艺配料管理',
        id: 4,
        icon: require('@/assets/image/index/工艺单管理.png'),
        children: [{
          name: '工艺单列表',
          url: '/product/productCraftList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&user_id=&&has_plan=&&has_craft=&&has_quotation='
        }, {
          name: '配料单列表',
          url: '/product/productPlanList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&user_id=&&has_plan=&&has_craft=&&has_quotation='
        }]
      }, {
        name: '订单管理',
        id: 5,
        icon: require('@/assets/image/index/订单管理.png'),
        children: [{
          name: '添加订单',
          url: '/order/orderCreate'
        }, {
          name: '订单列表',
          url: '/order/orderList/page=1&&keyword=&&date=&&has_materialOrder=&&has_materialPlan=&&has_materialStock=&&has_weave=&&has_productInOut=&&has_inspection=&&has_boxing=&&group_id=&&company_id=&&state=&&searchOrderOrProduct='
        }, {
          name: '订单发货列表',
          url: '/order/orderStat/page=1&&keyword=&&date=&&group_id=&&company_id='
        }]
      }, {
        name: '物料计划生产管理',
        id: 6,
        icon: require('@/assets/image/index/计划生产管理.png'),
        url: '/materialPlan/materialPlanList/page=1&&keyword=&&date=&&has_materialPlan=&&group_id=&&company_id=&&searchOrderOrProduct=/1'
      }, {
        name: '物料订购管理',
        id: 7,
        icon: require('@/assets/image/index/物料管理.png'),
        children: [{
          name: '物料预订购',
          url: '/materialOrder/materialOrderCreate'
        }, {
          name: '预订购列表',
          url: '/materialOrder/materialOrderList/page=1&&client_id=&&date='
        }, {
          name: '订单物料列表',
          url: '/material/materialList/page=1&&keyword=&&date==&&group_id=&&company_id=&&searchOrderOrProduct=/1'
          // }, {
          //   name: '批量订购列表',
          //   url: '/material/materialBatchList/page=1&&keyword=&&date==&&group_id=&&company_id=&&searchOrderOrProduct=/1'
        }]
      }, {
        name: '物料出入库管理',
        id: 15,
        icon: require('@/assets/image/index/装箱管理.png'),
        url: '/materialStock/materialStockList/page=1&&keyword=&&date==&&group_id=&&company_id=&&searchOrderOrProduct=/1'
      }, {
        name: '织造加工管理',
        id: 8,
        icon: require('@/assets/image/index/织造加工管理.png'),
        children: [{
          name: '生产织造列表',
          url: '/weavingProcessing/weavingList/page=1&&keyword=&&date==&&group_id=&&company_id=&&searchOrderOrProduct=/1'
        }, {
          name: '半成品加工列表',
          url: '/weavingProcessing/processingList/page=1&&keyword=&&date==&&group_id=&&company_id=&&searchOrderOrProduct=/1'
        }]
      }, {
        name: '产品收发管理',
        id: 9,
        icon: require('@/assets/image/index/收发管理.png'),
        url: '/receiveDispatch/receiveDispatchList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state=&&searchOrderOrProduct='
      }, {
        name: '产品检验管理',
        id: 10,
        icon: require('@/assets/image/index/检验管理.png'),
        url: '/inspection/inspectionList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state=&&searchOrderOrProduct='
      }, {
        name: '装箱管理',
        id: 11,
        icon: require('@/assets/image/index/装箱管理.png'),
        children: [{
          name: '装箱计划单列表',
          url: '/packPlan/packPlanList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state=&&searchOrderOrProduct='
        }, {
          name: '包装订购列表',
          url: '/packPlan/packOrderList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state=&&searchOrderOrProduct='
        }, {
          name: '装箱出库列表',
          url: '/packPlan/packStockList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state=&&searchOrderOrProduct='
        }]
      }, {
        name: '库存管理',
        id: 12,
        icon: require('@/assets/image/index/库存管理.png'),
        url: '/stock/stockList/page=1&&keyword=&&type='
      }, {
        name: '客户管理',
        id: 13,
        icon: require('@/assets/image/index/客户管理.png'),
        url: '/client/clientList/page=1&&keyword=&&clientType='
      }, {
        name: '财务统计',
        id: 16,
        icon: require('@/assets/image/index/财务管理.png'),
        children: [{
          name: '订单财务统计',
          url: '/financialStatistics/orderStatistics/page=1&&keyword=&&date=&&group_id=&&company_id='
        }, {
          name: '样单财务统计',
          url: '/financialStatistics/sampleStatistics/page=1&&keyword=&&date=&&group_id=&&company_id='
        }, {
          name: '产品产量统计',
          url: '/financialStatistics/productStatistics/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&XDZS=&&PJJG=&&HJCZ=&&CPL=&&KCSL='
        }, {
          name: '物料使用统计',
          url: '/financialStatistics/materialStatistics/page=1&&keyword=&&type=1&&HJSY=&&DGSL=&&PJJG=&&HJJG=&&KCSY='
        }, {
          name: '合作公司财务统计',
          url: '/financialStatistics/clientStatistics/page=1&&keyword=&&company_id=&&company_type='
        }, {
          name: '操作记录统计',
          url: '/financialStatistics/logStatistics/page=1&&type=物料订购调取&&date=&&client_id=&&product_code=&&order_type=1&&production_type=&&operate_user=&&material_name='
        }]
      }, {
        name: '员工管理',
        id: 17,
        icon: require('@/assets/image/index/员工管理.png'),
        children: [{
          name: '添加员工',
          url: '/staff/staffCreate'
        }, {
          name: '员工列表',
          url: '/staff/staffList/page=1&&keyword=&&date=&&department=&&type=&&state='
        }, {
          name: '日常工资结算表',
          url: '/staff/staffPay'
        }, {
          name: '合计工资结算单',
          url: '/staff/staffSettle'
        }]
      }]
    }
  },
  computed: {
    title () {
      return this.$store.state.title
    },
    breadUrl () {
      return this.$store.state.breadUrl
    },
    haveSet () {
      return !this.moduleArr || this.moduleArr.indexOf(14) !== -1
    },
    navCmp () {
      let moduleArr = window.sessionStorage.getItem('module_id') ? JSON.parse(window.sessionStorage.getItem('module_id')) : null
      if (moduleArr) {
        return this.navData.filter((item) => {
          return moduleArr.indexOf(Number(item.id)) !== -1
        })
      } else {
        return this.navData
      }
    }
  },
  watch: {
    $route: {
      handler (val) {
        // 首次进入页面触发
        this.$nextTick(() => {
          this.$fuckSelect()
        })
        let body = document.getElementsByClassName('body')[0]
        if (body) {
          body.scrollTop = 0
        }
      },
      deep: true
    }
  },
  methods: {
    commondHandler (cmd) {
      if (cmd === 'sendMsg') {
        this.$router.push('/other/sendMsg')
      } else if (cmd === 'logout') {
        logout().then((res) => {
          if (res.data.status) {
            window.sessionStorage.setItem('token', '')
            window.sessionStorage.setItem('user_id', '')
            window.sessionStorage.setItem('company_id', '')
            window.localStorage.setItem('zhUsername', '')
            this.$message.success('已退出登录')
          } else {
            this.$message.error(res.data.message)
          }
          this.$router.push('/login')
        })
      } else if (cmd === 'sendMsg') {

      } else if (cmd === 'changePas') {
        this.changePasPopupFlag = true
      }
    },
    goBack (index) {
      if (index < (this.breadUrl.length - 1)) {
        if (index === 0) {

        } else {
          this.$router.go(index - (this.breadUrl.length - 1))
        }
      }
    },
    getNotify () {
      notify.list({
        limit: 5,
        page: 1,
        status: 1,
        type: null
      }).then((res) => {
        this.msgList = res.data.data
        this.total = res.data.meta.total
      })
    },
    readMsg (item) {
      if (item.tag === '公司') {
        this.$alert('通知详情：' + item.content, item.title, {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      } else {
        window.open(item.router_url)
      }
      notify.read({
        id: item.id
      }).then((res) => {
        if (res.data.status) {
          this.getNotify()
        } else {
          this.$message.error({
            message: res.data.message
          })
        }
      })
    },
    readAll () {
      this.$confirm('是否已读所有通知', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        notify.read({
          id: null
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.msgList = []
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    closePopup () {
      this.changePasPopupFlag = false
    },
    changePasd () {
      if (!this.oldPasd) {
        this.$message.error('请输入原密码')
        return
      }
      if (!this.firstPasd || !this.lastPasd) {
        this.$message.error('请输入新密码')
        return
      }
      if (this.firstPasd !== this.lastPasd) {
        this.$message.warning('请确认输入的密码一致')
      } else {
        changeUserPasd({
          old_pass: this.oldPasd,
          new_pass: this.firstPasd
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('修改密码成功，请重新登录')
            this.$router.push('/login')
          }
        })
      }
    }
  },
  mounted () {
    // 页面刷新后触发
    this.$fuckSelect()
    let vue = this
    let pusher = new Pusher('117b8da677e144ce8212', {
      cluster: 'ap1',
      forceTLS: true
    })
    let channel = pusher.subscribe('my-channel-' + window.sessionStorage.getItem('user_id'))
    channel.bind('my-event', function (data) {
      let color = data.content.type === '普通' ? '#1a95ff' : data.content.type === '重要' ? '#E6A23C' : '#F5222D'
      vue.$notify({
        title: data.content.title,
        dangerouslyUseHTMLString: true,
        duration: 0,
        message: '<span style="display: inline-block;background:' + color + ';color: #fff;border-radius: 4px;padding: 0px 6px;margin-right: 4px;">' + data.content.type + '</span>' + data.content.content + '<a style="color:#1a95ff" href=' + data.content.router_url + '>(点击查看)</a>'
      })
    })
    this.getNotify()
    this.$message.duration = 500
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/index.less";
</style>
