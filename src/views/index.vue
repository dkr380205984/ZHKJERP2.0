<template>
  <div id="index">
    <div class="header">
      <div class="navCtn">
        <div class="leftCtn">
          <div class="companyCtn"
            @click="$router.push('/index')">
            <div class="logo"></div>
            <div class="name">预留企业名称</div>
          </div>
          <zh-nav :data="navData"
            maxLength="5">
          </zh-nav>
        </div>
        <div class="rightCtn">
          <el-badge is-dot>
            <i class="el-icon-bell elIcon"></i>
          </el-badge>
          <i class="el-icon-setting elIcon"
            @click="showSetting=true"></i>
          <div class="headImg"></div>
          <div class="selectCtn">
            <el-dropdown @command="commondHandler"
              trigger="click">
              <span class="el-dropdown-link">
                个人中心<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sendMsg">发布通知</el-dropdown-item>
                <el-dropdown-item command="personManage"
                  divided>人员管理</el-dropdown-item>
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
import { logout } from '@/assets/js/api.js'
export default {
  data () {
    return {
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
        children: [{
          name: '样品添加',
          url: '/sample/sampleCreate'
        }, {
          name: '样品列表',
          url: '/sample/sampleList/page=1'
        }, {
          name: '样单添加',
          url: '/sample/sampleOrderCreate'
        }, {
          name: '样单列表',
          url: '/sample/sampleOrderList'
        }]
      }, {
        name: '报价管理',
        icon: require('@/assets/image/index/报价单管理.png'),
        children: [{
          name: '添加报价单',
          url: '/price/priceCreate'
        }, {
          name: '报价单列表',
          url: '/price/priceList'
        }]
      }, {
        name: '产品管理',
        icon: require('@/assets/image/index/产品管理.png'),
        children: [{
          name: '添加新产品',
          url: '/product/productCreate'
        }, {
          name: '产品列表',
          url: '/product/productList/page=&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&has_plan=&&has_craft=&&has_quotation='
        }, {
          name: '产品库存列表',
          url: '/product/productStockList'
        }]
      }, {
        name: '工艺单管理',
        icon: require('@/assets/image/index/工艺单管理.png'),
        children: [{
          name: '添加工艺单',
          url: '/index/designFormAdd'
        }, {
          name: '工艺单列表',
          url: '/index/designFormList'
        }, {
          name: '添加设计单',
          url: '/index/designFormPlanCreate'
        }, {
          name: '设计单列表',
          url: '/index/designFormPlanList'
        }]
      }, {
        name: '配料单管理',
        icon: require('@/assets/image/index/配料单管理.png'),
        children: [{
          name: '添加配料单',
          url: '/index/productPlanAdd'
        }, {
          name: '配料单列表',
          url: '/index/productPlanList'
        }]
      }, {
        name: '订单管理',
        icon: require('@/assets/image/index/订单管理.png'),
        children: [{
          name: '添加新订单',
          url: '/index/orderCreate'
        }, {
          name: '订单列表',
          url: '/index/orderList'
        }, {
          name: '订单发货列表',
          url: '/index/orderStat'
        }]
      }, {
        name: '计划生产管理',
        icon: require('@/assets/image/index/计划生产管理.png'),
        children: [{
          name: '新建生产计划单',
          url: '/index/productDesignCreateList'
        }, {
          name: '生产计划单列表',
          url: '/index/productDesignList'
        }]
      }, {
        name: '物料管理',
        icon: require('@/assets/image/index/物料管理.png'),
        children: [{
          name: '原料预订购',
          url: '/index/rawMaterialPurchase'
        }, {
          name: '预订购入库',
          url: '/index/rawMaterialPurchaseList'
        }, {
          name: '物料订购加工',
          url: '/index/rawMaterialOrderList'
        }, {
          name: '物料出库入库',
          url: '/index/rawMaterialStockList'
        }]
      }, {
        name: '织造加工管理',
        icon: require('@/assets/image/index/织造加工管理.png'),
        children: [{
          name: '织造加工分配',
          url: '/index/productDesignList2'
        }]
      }, {
        name: '收发管理',
        icon: require('@/assets/image/index/收发管理.png'),
        children: [{
          name: '产品出入库列表',
          url: '/index/orderStockList'
        }]
      }, {
        name: '检验管理',
        icon: require('@/assets/image/index/检验管理.png'),
        children: [{
          name: '产品检验列表',
          url: '/index/productExaminationList'
        }]
      }, {
        name: '装箱出库管理',
        icon: require('@/assets/image/index/装箱出库管理.png'),
        children: [{
          name: '装箱出库列表',
          url: '/index/packagOutStockList'
        }]
      }, {
        name: '库存管理',
        icon: require('@/assets/image/index/库存管理.png'),
        children: [
          {
            name: '添加仓库',
            url: '/index/stockCreate'
          }, {
            name: '仓库列表',
            url: '/index/stockList'
          }]
      }, {
        name: '财务管理',
        icon: require('@/assets/image/index/财务管理.png'),
        children: [{
          name: '订单财务统计',
          url: '/index/orderFinancialList'
        }, {
          name: '合作公司财务统计',
          url: '/index/foreignTradeFinancialList'
        }, {
          name: '产品产量统计',
          url: '/index/productFinancialList'
        }, {
          name: '物料使用统计',
          url: '/index/materialFinancialList'
        }]
      }, {
        name: '客户管理',
        icon: require('@/assets/image/index/客户管理.png'),
        children: [{
          name: '添加客户',
          url: '/index/foreignTradeCreate'
        }, {
          name: '客户列表',
          url: '/index/foreignTradeList'
        }]
      }, {
        name: '系统设置',
        icon: require('@/assets/image/index/系统设置.png'),
        children: [{
          name: '系统设置',
          url: '/index/setting'
        }, {
          name: '权限设置',
          url: '/index/permissionsAdd'
        }, {
          name: '添加权限',
          url: '/index/permissionsAppend'
        }, {
          name: '工厂信息设置',
          url: '/index/companyInfoSetting'
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
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/index.less";
</style>
