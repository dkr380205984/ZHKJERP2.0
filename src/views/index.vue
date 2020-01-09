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
          <i class="el-icon-cpu elIcon"
            @click="$router.push('/equipment')"></i>
          <el-badge is-dot>
            <i class="el-icon-bell elIcon"></i>
          </el-badge>
          <i class="el-icon-setting elIcon"
            @click="$router.push('/setting/setting')"></i>
          <div class="headImg"></div>
          <div class="selectCtn">
            <el-dropdown @command="commondHandler"
              trigger="click">
              <span class="el-dropdown-link">
                个人中心<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sendMsg">发布通知</el-dropdown-item>
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
  </div>
</template>

<script>
import Pusher from 'pusher-js' // 全局方法
import { logout } from '@/assets/js/api.js'
export default {
  data () {
    return {
      logo: window.sessionStorage.getItem('logo') || require('@/assets/image/index/noPic.jpg'),
      companyName: window.sessionStorage.getItem('company_name') || '未登录',
      navData: [{
        name: '样式参考',
        icon: require('@/assets/image/index/样品管理.png'),
        children: [{
          name: '编辑页面',
          url: '/css/edit'
        }, {
          name: '详情页',
          url: '/css/detail'
        }, {
          name: '列表页',
          url: '/css/list'
        }]
      }, {
        name: '样品管理',
        icon: require('@/assets/image/index/样品管理.png'),
        id: 1,
        children: [{
          name: '样品添加',
          url: '/sample/sampleCreate'
        }, {
          name: '样品列表',
          url: '/sample/sampleList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&has_plan=&&has_craft=&&has_quotation='
        }, {
          name: '样品订单添加',
          url: '/sample/sampleOrderCreate'
        }, {
          name: '样品订单列表',
          url: '/sample/sampleOrderList/page=1&&keyword=&&date=&&has_material=&&has_materialPlan=&&has_materialStock=&&has_weave=&&group_id=&&company_id=&&state='
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
          url: '/price/priceList/page=1&&keyword=&&date=&&status=&&client_id='
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
          url: '/product/productList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&has_plan=&&has_craft=&&has_quotation='
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
          url: '/order/orderList/page=1&&keyword=&&date=&&has_materialOrder=&&has_materialPlan=&&has_materialStock=&&has_weave=&&has_productInOut=&&has_inspection=&&has_boxing=&&group_id=&&company_id=&&state='
        }, {
          name: '订单发货列表',
          url: '/order/orderStat'
        }]
      }, {
        name: '物料计划生产管理',
        id: 6,
        icon: require('@/assets/image/index/计划生产管理.png'),
        url: '/materialPlan/materialPlanList/page=1&&keyword=&&date=&&has_materialPlan=&&group_id=&&company_id=/1'
      }, {
        name: '物料订购管理',
        id: 7,
        icon: require('@/assets/image/index/物料管理.png'),
        children: [{
          name: '物料预订购',
          url: '/materialOrder/materialOrderCreate'
        }, {
          name: '预订购列表',
          url: '/materialOrder/materialOrderList/page=1&&keyword=&&date='
        }, {
          name: '订单物料列表',
          url: '/material/materialList/page=1&&keyword=&&date==&&group_id=&&company_id=/1'
        }]
      }, {
        name: '物料出入库管理',
        id: 15,
        icon: require('@/assets/image/index/装箱管理.png'),
        url: '/materialStock/materialStockList/page=1&&keyword=&&date==&&group_id=&&company_id=/1'
      }, {
        name: '织造加工管理',
        id: 8,
        icon: require('@/assets/image/index/织造加工管理.png'),
        children: [{
          name: '织造分配列表',
          url: '/weavingProcessing/weavingList/page=1&&keyword=&&date==&&group_id=&&company_id=/1'
        }, {
          name: '半成品加工分配列表',
          url: '/weavingProcessing/processingList/page=1&&keyword=&&date==&&group_id=&&company_id=/1'
        }]
      }, {
        name: '产品收发管理',
        id: 9,
        icon: require('@/assets/image/index/收发管理.png'),
        url: '/receiveDispatch/receiveDispatchList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
      }, {
        name: '产品检验管理',
        id: 10,
        icon: require('@/assets/image/index/检验管理.png'),
        url: '/inspection/inspectionList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
      }, {
        name: '库存管理',
        id: 12,
        icon: require('@/assets/image/index/库存管理.png'),
        children: [{
          name: '仓库列表',
          url: '/stock/stockList/page=1&&keyword=&&type='
        }]
      }, {
        name: '装箱管理',
        id: 7,
        icon: require('@/assets/image/index/装箱管理.png'),
        children: [{
          name: '装箱计划单列表',
          url: '/packPlan/packPlanList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
        }, {
          name: '包装订购列表',
          url: '/packPlan/packOrderList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
        }, {
          name: '装箱出库列表',
          url: '/packPlan/packStockList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state='
        }]
      }, {
        name: '客户管理',
        id: 13,
        icon: require('@/assets/image/index/客户管理.png'),
        url: '/client/clientList/page=1&&keyword=&&date==&&clientType='
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
  methods: {
    commondHandler (cmd) {
      if (cmd === 'personManage') {

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

      }
    },
    goBack (index) {
      if (index < (this.breadUrl.length - 1)) {
        if (index === 0) {

        } else {
          this.$router.go(index - (this.breadUrl.length - 1))
        }
      }
    }
  },
  mounted () {
    let vue = this
    let pusher = new Pusher('117b8da677e144ce8212', {
      cluster: 'ap1',
      forceTLS: true
    })
    let channel = pusher.subscribe('my-channel-' + window.sessionStorage.getItem('user_id'))
    channel.bind('my-event', function (data) {
      console.log('消息通知接收', data)
      let color = data.content.type === '普通' ? '#1a95ff' : data.content.type === '重要' ? '#E6A23C' : '#F5222D'
      vue.$notify({
        title: data.content.title,
        dangerouslyUseHTMLString: true,
        duration: 0,
        message: '<span style="display: inline-block;background:' + color + ';color: #fff;border-radius: 4px;padding: 0px 6px;margin-right: 4px;">' + data.content.type + '</span>xx人' + data.content.content + '<a style="color:#1a95ff" href=' + data.content.router_url + '>(点击查看)</a>'
      })
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/index.less";
</style>
