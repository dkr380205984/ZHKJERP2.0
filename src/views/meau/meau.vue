<template>
  <div id='meau'
    class='indexMain'>
    <div class="module">
      <div class="titleLine">生产流程管理</div>
      <div class="meauList">
        <div class="meau_item"
          v-for="(item,index) in meauList.production"
          :key="index"
          @click="$router.push(item.path)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
      <div class="titleLine">其他管理</div>
      <div class="meauList">
        <div class="meau_item"
          v-for="(item,index) in meauList.other"
          :key="index"
          @click="$router.push(item.path)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
      <div class="titleLine">财务管理</div>
      <div class="meauList">
        <div class="meau_item"
          v-for="(item,index) in meauList.finance"
          :key="index"
          @click="$router.push(item.path)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      meauList: {
        production: [
          {
            name: '工艺单管理',
            id: 3,
            path: '/craft/craftList/page=1&&keyword=&&date=',
            icon: 'icon-gongyidan'
          },
          {
            name: '物料计划生产',
            id: 6,
            path: '/materialPlan/materialPlanList/page=1&&keyword=&&date=&&has_materialPlan=&&group_id=&&company_id=&&searchOrderOrProduct=/1',
            icon: 'icon-wuliaojihua'
          },
          {
            name: '物料订购加工',
            id: 7,
            path: '/material/materialList/page=1&&keyword=&&has_materialPlan=1&&date==&&group_id=&&company_id=&&searchOrderOrProduct=/1',
            icon: 'icon-wuliaodinggou'
          },
          {
            name: '物料出入库',
            id: 15,
            path: '/materialStock/materialStockList/page=1&&keyword=&&has_materialPlan=1&&date==&&group_id=&&company_id=&&searchOrderOrProduct=/1',
            icon: 'icon-wuliaochuruku'
          },
          {
            name: '织造加工计划',
            id: 8,
            path: '/weavingProcessing/weavingList/page=1&&keyword=&&date==&&group_id=&&company_id=&&has_materialPlan=1&&searchOrderOrProduct=/1',
            icon: 'icon-zhizaojiagong'
          },
          {
            name: '半成品检验收发',
            id: 9,
            path: '/receiveDispatch/receiveDispatchList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state=&&searchOrderOrProduct=',
            icon: 'icon-chanpinshoufa'
          },
          {
            name: '芯片读取出入库',
            id: 10,
            path: '/receiveDispatch/batchXpList',
            icon: 'icon-xinpianguanli'
          },
          {
            name: '成品检验加工',
            id: 10,
            path: '/productProcess/productProcessList/page=1&&keyword=&&date=&&group_id=&&company_id=&&searchOrderOrProduct=',
            icon: 'icon-chanpinjianyan'
          },
          {
            name: '装箱计划订购',
            id: 11,
            path: '/packPlan/packPlanList/page=1&&keyword=&&date=&&group_id=&&company_id=&&state=&&searchOrderOrProduct=',
            icon: 'icon-jincangdan'
          },
          {
            name: '进仓运输',
            id: 19,
            path: '/warehouse/warehouseList/page=1&&keyword=&&date=&&address=',
            icon: 'icon-zhuangxiangchuku'
          }
        ],
        other: [
          {
            name: '预订购管理',
            id: 7,
            path: '/materialOrder/materialOrderList/page=1&&client_id=&&date=',
            icon: 'icon-wuliaoyudinggou'
          },
          {
            name: '单证管理',
            id: 21,
            path: '/document/index/list',
            icon: 'icon-danzheng'
          },
          {
            name: '员工管理',
            id: 17,
            path: '/staff/staffList/page=1&&keyword=&&date=&&department=&&type=&&state=',
            icon: 'icon-yuangongguanli'
          },
          {
            name: '客户管理',
            id: 13,
            path: '/client/clientListEasy/page=1&&keyword=&&clientType=',
            icon: 'icon-kehuguanli'
          },
          {
            name: '仓库管理',
            id: 12,
            path: '/stock/stockList',
            icon: 'icon-kucunguanli'
          },
          {
            name: '系统设置',
            id: 14,
            path: '/setting/setting',
            icon: 'icon-xitongshezhi'
          }
        ],
        finance: [
          {
            name: '客户结算管理',
            id: 22,
            path: '/client/clientList/page=1&&keyword=&&clientType=',
            icon: 'icon-kehujiesuanguanli'
          },
          {
            name: '报销单管理',
            id: 18,
            path: '/reimbursement/reimbursementList/page=1&&keyword=&&date=&&applyUser=&&status=',
            icon: 'icon-baoxiaodanguanli'
          },
          {
            name: '票据管理',
            id: 23,
            path: '/financialStatistics/ticketStatistics/page=1&&code=&&order_code=&&client_name=&&date=&&type=开票管理',
            icon: 'icon-caiwushoujuguanli'
          }
        ]
      }
    }
  },
  created () {
    let modules = window.sessionStorage.getItem('module_id') ? JSON.parse(window.sessionStorage.getItem('module_id')) : []
    this.meauList.production = this.meauList.production.filter(itemF => modules.indexOf(itemF.id) !== -1)
    this.meauList.other = this.meauList.other.filter(itemF => modules.indexOf(itemF.id) !== -1)
    this.meauList.finance = this.meauList.finance.filter(itemF => modules.indexOf(itemF.id) !== -1)
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/meau/meau.less";
</style>
