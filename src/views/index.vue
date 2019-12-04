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
          url: '/sample/sampleList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&has_plan=&&has_craft=&&has_quotation='
        }, {
          name: '样品订单添加',
          url: '/sample/sampleOrderCreate'
        }, {
          name: '样品订单列表',
          url: '/sample/sampleOrderList/page=&&keyword=&&date=&&client_id=&&group_id='
        }]
      }, {
        name: '报价管理',
        icon: require('@/assets/image/index/报价单管理.png'),
        children: [{
          name: '添加报价单',
          url: '/price/priceCreate'
        }, {
          name: '报价单列表',
          url: '/price/priceList/page=&&keyword=&&date=&&status=&&client_id='
        }]
      }, {
        name: '产品管理',
        icon: require('@/assets/image/index/产品管理.png'),
        children: [{
          name: '产品添加',
          url: '/product/productCreate'
        }, {
          name: '产品列表',
          url: '/product/productList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&has_plan=&&has_craft=&&has_quotation='
        }, {
          name: '产品库存列表',
          url: '/product/productStockList'
        }]
      }, {
        name: '订单管理',
        icon: require('@/assets/image/index/订单管理.png'),
        children: [{
          name: '添加订单',
          url: '/order/orderCreate'
        }, {
          name: '订单列表',
          url: '/order/orderList/page=&&keyword=&&date=&&client_id=&&group_id='
        }, {
          name: '订单发货列表',
          url: '/order/orderStat'
        }]
      }, {
        name: '物料计划生产管理',
        icon: require('@/assets/image/index/计划生产管理.png'),
        children: [{
          name: '新建物料计划单',
          url: '/materialPlan/materialPlanCreate'
        }, {
          name: '物料计划单列表',
          url: '/materialPlan/materialPlanList'
        }]
      }, {
        name: '预定购管理',
        icon: require('@/assets/image/index/物料管理.png'),
        children: [{
          name: '物料预订购',
          url: '/materialOrder/materialOrderCreate'
        }, {
          name: '物料预定购列表',
          url: '/materialOrder/materialOrderList/page=1&&keyword=&&date='
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
