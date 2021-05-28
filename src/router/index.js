import Vue from 'vue'
import Message from 'element-ui'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
import { isHasPermissions } from '@/assets/js/dictionary.js'
Vue.use(VueRouter)
// 解决ele组件点击当前页路由时出错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err)
}
// const newFinancialStatisticsUrl = '../views/newFinancialStatistics/'
const routes = [
  {
    path: '/test',
    component: () => import('@/views/test.vue')
  },
  {
    path: '/',
    redirect: '/login'
  }, {
    path: '/newfinancialStatistics',
    // redirect: '/homePage/homePage',
    name: '财务统计-新版',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: 'orderStatistics',
        name: '订单财务统计-新版',
        component: () => import(`../views/newFinancialStatistics/orderStatistics.vue`)
      }, {
        path: 'sampleStatistics',
        name: '样单财务统计-新版',
        component: () => import(`../views/newFinancialStatistics/sampleStatistics.vue`)
      }, {
        path: 'logStatistics',
        name: '生产记录统计-新版',
        component: () => import(`../views/newFinancialStatistics/logStatistics.vue`)
      }, {
        path: 'materialStatistics',
        name: '物料使用统计-新版',
        component: () => import(`../views/newFinancialStatistics/materialStatistics.vue`)
      }
    ]
  }, {
    path: '/document',
    redirect: '/homePage/homePage',
    name: '单据',
    component: () => import('@/views/documents/index.vue'),
    children: [
      {
        path: 'print',
        name: 'print',
        redirect: '/document/index/list',
        component: () => import('@/views/documents/index.vue'),
        children: [
          {
            path: 'CI/:id',
            name: '形式发票',
            component: () => import('@/views/documents/CI/print.vue')
          }, {
            path: 'PL/:id',
            name: '装箱单',
            component: () => import('@/views/documents/PL/print.vue')
          }, {
            path: 'ED/:id',
            name: '出口货物报关单',
            component: () => import('@/views/documents/ED/print.vue')
          }, {
            path: 'DE/:id',
            name: '申报要素',
            component: () => import('@/views/documents/DE/print.vue')
          }, {
            path: 'ET/:id',
            name: '货运委托书',
            component: () => import('@/views/documents/ET/print.vue')
          }
        ]
      }, {
        path: 'index',
        name: 'index',
        redirect: '/homePage/homePage',
        component: () => import('@/views/index.vue'),
        children: [
          {
            path: 'list',
            name: '单证列表',
            component: () => import('@/views/documents/list.vue')
          },
          {
            path: 'create',
            name: '添加单证',
            component: () => import('@/views/documents/create.vue')
          },
          {
            path: 'update/:id',
            name: '修改单证',
            component: () => import('@/views/documents/update.vue')
          },
          {
            path: 'detail/:id',
            name: '单证详情',
            component: () => import('@/views/documents/detail.vue')
          }
        ]
      }, {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/index.vue'),
        redirect: '/document/index/list',
        children: [
          {
            path: 'CI/:id',
            name: '编辑形式发票',
            component: () => import('@/views/documents/CI/edit.vue')
          }, {
            path: 'PL/:id',
            name: '编辑装箱单',
            component: () => import('@/views/documents/PL/edit.vue')
          }, {
            path: 'ED/:id',
            name: '编辑出口货物报关单',
            component: () => import('@/views/documents/ED/edit.vue')
          }, {
            path: 'DE/:id',
            name: '编辑申报要素',
            component: () => import('@/views/documents/DE/edit.vue')
          }, {
            path: 'ET/:id',
            name: '编辑货运委托书',
            component: () => import('@/views/documents/ET/edit.vue')
          }
        ]
      }
    ]
  }, {
    //   path: '/test',
    //   name: 'test',
    //   component: () => import('../views/test.vue')
    // }, {
    path: '/loginOld',
    name: 'loginOld',
    component: () => import('../views/login.vue')
  }, {
    path: '/login',
    name: 'login',
    component: () => import('../views/loginNew.vue')
  }, {
    path: '/error',
    name: 'error',
    component: () => import('../views/error.vue')
  }, {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue'),
    children: [{
      path: '/meau/meau',
      name: '其它菜单',
      component: () => import('../views/meau/meau.vue')
    }, {
      path: '/homePage/homePage',
      name: '首页',
      component: () => import('../views/homePage/homePage.vue')
    }, {
      path: '/css/edit',
      name: '编辑页',
      component: () => import('../views/css/edit.vue')
    }, {
      path: '/css/detail',
      name: '详情页',
      component: () => import('../views/css/detail.vue')
    }, {
      path: '/css/list',
      name: '列表页',
      component: () => import('../views/css/list.vue')
    }, {
      path: '/sample/sampleCreate',
      name: '样品添加',
      component: () => import('../views/sample/sampleCreate.vue')
    }, {
      path: '/sample/sampleDetail/:id',
      name: '样品详情',
      component: () => import('../views/sample/sampleDetail.vue')
    }, {
      path: '/sample/sampleUpdate/:id',
      name: '样品修改',
      component: () => import('../views/sample/sampleUpdate.vue')
    }, {
      path: '/sample/sampleList/:params',
      name: '样品列表',
      component: () => import('../views/sample/sampleList.vue')
    }, {
      path: '/sample/sampleOrderCreate',
      name: '样品订单添加',
      component: () => import('../views/sample/sampleOrderCreate.vue')
    }, {
      path: '/sample/sampleOrderUpdate/:id',
      name: '样品订单修改',
      component: () => import('../views/sample/sampleOrderUpdate.vue')
    }, {
      path: '/sample/sampleOrderList/:params',
      name: '样品订单列表',
      component: () => import('../views/sample/sampleOrderList.vue')
    }, {
      path: '/sample/sampleOrderDetail/:id',
      name: '样品订单详情',
      meta: {
        showAboutCom: true,
        orderId: 'id',
        idInHash: true,
        defaultType: 2
      },
      component: () => import('../views/sample/sampleOrderDetail.vue')
    }, {
      path: '/product/productCreate',
      name: '产品添加',
      component: () => import('../views/product/productCreate.vue')
    }, {
      path: '/product/productList/:params',
      name: '产品列表',
      component: () => import('../views/product/productList.vue')
    }, {
      path: '/product/productDetail/:id',
      name: '产品详情',
      component: () => import('../views/product/productDetail.vue')
    }, {
      path: '/product/productUpdate/:id',
      name: '产品修改',
      component: () => import('../views/product/productUpdate.vue')
    }, {
      path: '/price/priceCreate',
      name: '报价单添加',
      meta: {
        permissions_id: '02-01'
      },
      component: () => import('../views/price/priceCreate.vue')
    }, {
      path: '/price/priceUpdate/:id',
      name: '报价单修改',
      meta: {
        permissions_id: '02-02'
      },
      component: () => import('../views/price/priceUpdate.vue')
    }, {
      path: '/price/priceGiveAgain/:id',
      name: '再次报价',
      meta: {
        permissions_id: '02-01'
      },
      component: () => import('../views/price/priceGiveAgain.vue')
    }, {
      path: '/price/priceList/:params',
      name: '报价单列表',
      meta: {
        permissions_id: '02-05'
      },
      component: () => import('../views/price/priceList.vue')
    }, {
      path: '/price/priceDetail/:id',
      name: '报价单详情',
      meta: {
        permissions_id: '02-06'
      },
      component: () => import('../views/price/priceDetail.vue')
    }, {
      path: '/craft/craftCreate/:id/:type',
      name: '工艺单添加',
      component: () => import('../views/craft/craftCreate.vue')
    }, {
      path: '/craft/craftList/:params',
      name: '工艺单列表',
      component: () => import('../views/craft/craftList.vue')
    }, {
      path: '/craft/craftUpdate/:id/:type',
      name: '工艺单修改',
      component: () => import('../views/craft/craftUpdate.vue')
    }, {
      path: '/craft/craftDetail/:id/:type',
      name: '工艺单详情',
      component: () => import('../views/craft/craftDetail.vue')
    }, {
      path: '/order/orderList/:params',
      name: '订单列表',
      component: () => import('../views/order/orderList.vue')
    }, {
      path: '/order/orderStat',
      name: '订单发货列表',
      component: () => import('../views/order/orderStat.vue')
    }, {
      path: '/order/orderDetail/:id',
      name: '订单详情',
      meta: {
        showAboutCom: true,
        orderId: 'id',
        defaultType: 1
      },
      component: () => import('../views/order/orderDetail.vue')
    }, {
      path: '/order/orderCreate',
      name: '订单添加',
      component: () => import('../views/order/orderCreate.vue')
    }, {
      path: '/order/orderUpdate/:id',
      name: '订单修改',
      component: () => import('../views/order/orderUpdate.vue')
    }, {
      path: '/productPlan/productPlanCreate/:id/:type',
      name: '配料单添加',
      component: () => import('../views/productPlan/productPlanCreate.vue')
    }, {
      path: '/productPlan/productPlanUpdate/:id/:type',
      name: '配料单修改',
      component: () => import('../views/productPlan/productPlanUpdate.vue')
    }, {
      path: '/productPlan/productPlanDetail/:id/:type',
      name: '配料单详情',
      component: () => import('../views/productPlan/productPlanDetail.vue')
    }, {
      path: '/materialPlan/materialPlanCreate/:id/:type',
      name: '物料计划单添加',
      component: () => import('../views/materialPlan/materialPlanCreate.vue')
    }, {
      path: '/materialPlan/materialPlanUpdate/:id/:type',
      name: '物料计划单修改',
      component: () => import('../views/materialPlan/materialPlanUpdate.vue')
    }, {
      path: '/materialPlan/materialPlanDetail/:id/:type',
      name: '物料计划单详情',
      meta: {
        showAboutCom: true,
        orderId: 'id',
        orderType: 'type'
      },
      component: () => import('../views/materialPlan/materialPlanDetail.vue')
    }, {
      path: '/materialPlan/materialPlanList/:params/:type',
      name: '物料计划单列表',
      component: () => import('../views/materialPlan/materialPlanList.vue')
    }, {
      path: '/materialOrder/materialOrderCreate',
      name: '物料预订购',
      component: () => import('../views/materialOrder/materialOrderCreate.vue')
    }, {
      path: '/materialOrder/materialOrderUpdate/:id',
      name: '物料预订购修改',
      component: () => import('../views/materialOrder/materialOrderUpdate.vue')
    }, {
      path: '/materialOrder/materialOrderDetail/:id',
      name: '物料预订购入库',
      component: () => import('../views/materialOrder/materialOrderDetail.vue')
    }, {
      path: '/materialOrder/materialOrderList/:params',
      name: '物料预订购列表',
      component: () => import('../views/materialOrder/materialOrderList.vue')
    }, {
      path: '/material/materialDetail/:id/:type/:orderType/:easyOrder',
      name: '物料订购',
      meta: {
        showAboutCom: true,
        orderId: 'id',
        orderType: 'orderType'
      },
      component: () => import('../views/material/materialDetail.vue')
    }, {
      path: '/material/materialBatchDetail/:id/:orderType/:type',
      name: '物料批量订购',
      component: () => import('../views/material/materialBatchDetail.vue')
    }, {
      path: '/material/materialList/:params/:type',
      name: '物料订购列表',
      component: () => import('../views/material/materialList.vue')
    }, {
      path: '/material/materialBatchList/:params/:type',
      name: '物料批量订购列表',
      component: () => import('../views/material/materialBatchList.vue')
    }, {
      path: '/materialStock/materialStockList/:params/:type',
      name: '物料出入库列表',
      component: () => import('../views/materialStock/materialStockList.vue')
    }, {
      path: '/materialStock/materialStockDetail/:id/:type/:orderType',
      name: '物料出入库详情',
      meta: {
        showAboutCom: true,
        orderId: 'id',
        orderType: 'orderType'
      },
      component: () => import('../views/materialStock/materialStockDetail.vue')
    }, {
      path: '/materialStock/materialStockDetail/:id/:type',
      name: '辅料出入库详情',
      component: () => import('../views/materialStock/materialStockDetail.vue')
    }, {
      path: '/materialStock/materialStockBatchDetail/:id/:orderType/:type',
      name: '物料批量出入库详情',
      component: () => import('../views/materialStock/materialStockBatchDetail.vue')
    }, {
      path: '/weavingProcessing/weavingDetail/:id/:orderType',
      name: '织造分配详情',
      meta: {
        showAboutCom: true,
        orderId: 'id',
        orderType: 'orderType'
      },
      component: () => import('../views/weavingProcessing/weavingDetail.vue')
    }, {
      path: '/weavingProcessing/weavingList/:params/:type',
      name: '织造分配列表',
      component: () => import('../views/weavingProcessing/weavingList.vue')
    }, {
      path: '/weavingProcessing/processingDetail/:id/:orderType',
      name: '半成品加工分配详情',
      meta: {
        showAboutCom: true,
        orderId: 'id',
        orderType: 'orderType'
      },
      component: () => import('../views/weavingProcessing/processingDetail.vue')
    }, {
      path: '/weavingProcessing/processingList/:params/:type',
      name: '半成品加工分配列表',
      component: () => import('../views/weavingProcessing/processingList.vue')
    }, {
      path: '/setting/setting',
      name: '系统设置',
      component: () => import('../views/setting/setting.vue')
    }, {
      path: '/stock/stockList',
      name: '仓库列表',
      component: () => import('../views/stock/stockList.vue')
    }, {
      path: '/stock/stockDetail/:id/:type',
      name: '仓库详情',
      component: () => import('../views/stock/stockDetail.vue')
    }, {
      path: '/stock/stockTypeDetail/:type',
      name: '仓库库存详情',
      component: () => import('../views/stock/stockTypeDetail.vue')
    }, {
      path: '/packPlan/packIn/:id',
      name: '包装入库',
      component: () => import('../views/packPlan/packIn.vue')
    }, {
      path: '/packPlan/packPlanList/:params',
      name: '装箱管理列表',
      component: () => import('../views/packPlan/packPlanList.vue')
    }, {
      path: '/packPlan/packPlanCreate/:id',
      name: '装箱计划单详情',
      meta: {
        showAboutCom: true,
        orderId: 'id'
      },
      component: () => import('../views/packPlan/packPlanDetailNew.vue')
    }, {
      path: '/packPlan/packStockList/:params',
      name: '装箱出库列表',
      component: () => import('../views/packPlan/packStockList.vue')
    }, {
      path: '/packPlan/packStock/:id',
      name: '装箱出库详情',
      meta: {
        showAboutCom: true,
        orderId: 'id'
      },
      component: () => import('../views/packPlan/packStock.vue')
    }, {
      path: '/packPlan/packOrderList/:params',
      name: '包装订购列表',
      component: () => import('../views/packPlan/packOrderList.vue')
    }, {
      path: '/packPlan/packOrderDetail/:id',
      name: '包装订购详情',
      meta: {
        showAboutCom: true,
        orderId: 'id'
      },
      component: () => import('../views/packPlan/packOrderDetail.vue')
    }, {
      path: '/receiveDispatch/receiveDispatchList/:params',
      name: '产品收发列表',
      component: () => import('../views/receiveDispatch/receiveDispatchList.vue')
    }, {
      path: '/receiveDispatch/SJBB/:params',
      name: '产品收发-数据报表',
      component: () => import('../views/receiveDispatch/SJBB.vue')
    }, {
      path: '/receiveDispatch/receiveDispatchDetail/:id',
      name: '产品收发详情',
      component: () => import('../views/receiveDispatch/receiveDispatchDetail.vue')
    }, {
      path: '/receiveDispatch/jysf/:id',
      name: '检验收发详情-梭织',
      meta: {
        showAboutCom: true,
        orderId: 'id'
      },
      component: () => import('../views/receiveDispatch/jysf.vue')
    }, {
      path: '/receiveDispatch/jysfZZ/:id',
      name: '检验收发详情-针织',
      meta: {
        showAboutCom: true,
        orderId: 'id'
      },
      component: () => import('../views/receiveDispatch/jysfZZ.vue')
    }, {
      path: '/receiveDispatch/batchXpList',
      name: '芯片读取出入库列表',
      component: () => import('../views/receiveDispatch/batchXpList.vue')
    }, {
      //   path: '/receiveDispatch/batchXpOpration/:type',
      //   name: '芯片读取',
      //   component: () => import('../views/receiveDispatch/batchXpOpration.vue')
      // }, {
      path: '/inspection/inspectionList/:params',
      name: '产品检验列表',
      component: () => import('../views/inspection/inspectionList.vue')
    }, {
      path: '/inspection/finishedDetail/:id',
      name: '成品检验详情',
      component: () => import('../views/inspection/finishedDetail.vue')
    }, {
      path: '/inspection/semiFinishedDetail/:id',
      name: '半成品检验详情',
      component: () => import('../views/inspection/semiFinishedDetail.vue')
    }, {
      path: '/productProcess/productProcessList/:params',
      name: '成品加工列表',
      component: () => import('../views/productProcess/productProcessList.vue')
    }, {
      path: '/productProcess/SJBB/:params',
      name: '成品加工-数据报表',
      component: () => import('../views/productProcess/SJBB.vue')
    }, {
      path: '/productProcess/productProcessDetail/:id',
      name: '成品加工详情',
      meta: {
        showAboutCom: true,
        orderId: 'id'
      },
      component: () => import('../views/productProcess/productProcessDetail.vue')
    }, {
      path: '/equipment',
      name: '设备管理',
      component: () => import('../views/equipment/equipment.vue')
    }, {
      path: '/other/chartIndex',
      name: '数据可视化',
      component: () => import('../views/other/chartIndex.vue')
    }, {
      path: '/client/clientList/:params',
      name: '客户结算列表',
      component: () => import('../views/client/clientList.vue')
    }, {
      path: '/client/clientListEasy/:params',
      name: '客户列表',
      component: () => import('../views/client/clientListEasy.vue')
    }, {
      path: '/client/clientCreate',
      name: '客户添加',
      component: () => import('../views/client/clientCreate.vue')
    }, {
      path: '/client/clientUpdate/:id',
      name: '客户修改',
      component: () => import('../views/client/clientUpdate.vue')
    }, {
      path: '/client/clientDetail/:id',
      name: '客户详情',
      component: () => import('../views/client/clientDetail.vue')
    }, {
      path: '/other/msgList',
      name: '消息列表',
      component: () => import('../views/other/msgList.vue')
    }, {
      path: '/other/sendMsg',
      name: '发通知',
      component: () => import('../views/other/sendMsg.vue')
    }, {
      path: '/financialStatistics/orderStatistics/:params',
      name: '订单财务统计',
      component: () => import('../views/financialStatistics/orderStatistics.vue')
    }, {
      path: '/financialStatistics/annualStatistics',
      name: '年度财务统计',
      component: () => import('../views/financialStatistics/annualStatistics.vue')
    }, {
      path: '/financialStatistics/sampleStatistics/:params',
      name: '样单财务统计',
      component: () => import('../views/financialStatistics/sampleStatistics.vue')
    }, {
      path: '/financialStatistics/productStatistics/:params',
      name: '产品产量统计',
      component: () => import('../views/financialStatistics/productStatistics.vue')
    }, {
      path: '/financialStatistics/materialStatistics/:params',
      name: '物料使用统计',
      component: () => import('../views/financialStatistics/materialStatistics.vue')
    }, {
      path: '/financialStatistics/materialDetail/:name/:type',
      name: '物料使用详情',
      component: () => import('../views/financialStatistics/materialDetail.vue')
    }, {
      path: '/financialStatistics/clientStatistics/:params',
      name: '合作公司财务统计',
      component: () => import('../views/financialStatistics/clientStatistics.vue')
    }, {
      path: '/financialStatistics/clientDetail/:id/:type',
      name: '合作公司财务详情',
      component: () => import('../views/financialStatistics/clientDetail.vue')
    }, {
      path: '/financialStatistics/oprDetail/:clientId/:type/:oprId/:oprType',
      name: '合作公司财务操作记录',
      component: () => import('../views/financialStatistics/oprDetail.vue')
    }, {
      path: '/financialStatistics/clientDetail',
      name: '样单财务统计',
      component: () => import('../views/financialStatistics/clientDetail.vue')
    }, {
      path: '/financialStatistics/logStatistics/:params',
      name: '生产记录统计',
      component: () => import('../views/financialStatistics/logStatistics.vue')
    }, {
      path: '/financialStatistics/settleChargebacks/:params',
      name: '结算扣款统计',
      component: () => import('../views/financialStatistics/settleChargebacks.vue')
    }, {
      path: '/tutorialSystem/tutorialSystemDetail/:id',
      name: '系统教程详情',
      component: () => import('../views/tutorialSystem/tutorialSystemDetail.vue')
    }, {
      path: '/tutorialSystem/tutorialSystemList',
      name: '系统教程',
      component: () => import('../views/tutorialSystem/tutorialSystemList.vue')
    }, {
      path: '/tutorialSystem/tutorialSystemCreate',
      name: '添加系统教程',
      component: () => import('../views/tutorialSystem/tutorialSystemCreate.vue')
    }, {
      path: '/staff/staffCreate',
      name: '添加员工',
      component: () => import('../views/staff/staffCreate.vue')
    }, {
      path: '/staff/staffList/:params',
      name: '员工列表',
      component: () => import('../views/staff/staffList.vue')
    }, {
      path: '/staff/staffDetail/:id',
      name: '员工详情',
      component: () => import('../views/staff/staffDetail.vue')
    }, {
      path: '/staff/staffPay',
      name: '日常工资结算表',
      component: () => import('../views/staff/staffPay.vue')
    }, {
      path: '/staff/staffUpdate/:id',
      name: '修改员工',
      component: () => import('../views/staff/staffUpdate.vue')
    }, {
      path: '/staff/staffSettle',
      name: '合计工资结算单',
      component: () => import('../views/staff/staffSettle.vue')
    }, {
      path: '/reimbursement/reimbursementCreate',
      name: '添加报销单',
      component: () => import('../views/reimbursement/reimbursementCreate.vue')
    }, {
      path: '/reimbursement/reimbursementList/:params',
      name: '报销单列表',
      component: () => import('../views/reimbursement/reimbursementList.vue')
    }, {
      path: '/reimbursement/reimbursementDetail/:id',
      name: '报销单详情',
      component: () => import('../views/reimbursement/reimbursementDetail.vue')
    }, {
      path: '/reimbursement/reimbursementUpdate/:id',
      name: '报销单修改',
      component: () => import('../views/reimbursement/reimbursementUpdate.vue')
    }, {
      path: '/warehouse/warehouseList/:params',
      name: '进仓单列表',
      component: () => import('../views/warehouse/warehouseList.vue')
    }, {
      path: '/warehouse/warehouseDetail/:id',
      name: '进仓单详情',
      component: () => import('../views/warehouse/warehouseDetail.vue')
    }, {
      path: '/warehouse/warehouseCreate',
      name: '添加进仓单',
      component: () => import('../views/warehouse/warehouseCreate.vue')
    }, {
      path: '/warehouse/warehouseUpdate/:id',
      name: '修改进仓单',
      component: () => import('../views/warehouse/warehouseUpdate.vue')
    }, {
      path: '/transport/transportList/:params',
      name: '运输货款列表',
      component: () => import('../views/transport/transportList.vue')
    }, {
      path: '/transport/transportDetail/:id',
      name: '运输货款详情',
      component: () => import('../views/transport/transportDetail.vue')
    }, {
      path: '/financialStatistics/ticketStatistics/:params',
      name: '票据列表',
      component: () => import('../views/financialStatistics/ticketStatistics.vue')
    }]
  }, {
    path: '/tagProductPrint/:id',
    name: '产品标签',
    component: () => import('../views/product/tagPrint.vue')
  }, {
    path: '/tagSamplePrint/:id',
    name: '样品标签',
    component: () => import('../views/sample/tagPrint.vue')
  }, {
    path: '/craftTable/:id/:type/:craftId',
    name: '工艺单打印',
    component: () => import('../views/craft/craftTable.vue')
  }, {
    path: '/craftTableToPDF/:id/:type/:craftId/:colorIndex',
    name: '工艺单打印PDF',
    component: () => import('../views/craft/craftTableToPDF.vue')
  }, {
    path: '/productPlanTable/:id/:type/:index',
    name: '配料单打印',
    component: () => import('../views/productPlan/productPlanTable.vue')
  }, {
    path: '/materialPlanTable/:id/:type',
    name: '物料计划单',
    component: () => import('../views/materialPlan/materialPlanTable.vue')
  }, {
    path: '/materialOrderTable/:id',
    name: '物料预定购单',
    component: () => import('../views/materialOrder/materialOrderTable.vue')
  }, {
    path: '/materialStockLogTable/:id',
    name: '物料出入库日志单',
    component: () => import('../views/materialOrder/materialStockLogTable.vue')
  }, {
    path: '/materialStockTable/:id/:orderType/:type',
    name: '物料出入库日志单',
    component: () => import('../views/materialStock/materialStockTable.vue')
  }, {
    path: '/packOrderTable/:type/:id',
    name: '包装订购单',
    component: () => import('../views/packPlan/packOrderTable.vue')
  }, {
    path: '/replenishTable/:id/:type',
    name: '补纱单',
    component: () => import('../views/weavingProcessing/replenishTable.vue')
  }, {
    path: '/materialTable/:id/:orderType/:type',
    name: '物料订购调取单',
    component: () => import('../views/material/materialTable.vue')
  }, {
    path: '/materialProcessTable/:id/:orderType/:type',
    name: '物料加工单',
    component: () => import('../views/material/materialProcessTable.vue')
  }, {
    path: '/packPlanTable/:id/:planId',
    name: '包装计划单',
    component: () => import('../views/packPlan/packPlanTable.vue')
  }, {
    path: '/weaveTable/:id/:orderType',
    name: '生产加工单',
    component: () => import('../views/weavingProcessing/weaveTable.vue')
  }, {
    path: '/receiveDispatchTable/:id',
    name: '产品收发标签',
    component: () => import('../views/receiveDispatch/receiveDispatchTable.vue')
  }, {
    path: '/pricePrintTable/:id',
    name: '报价单',
    component: () => import('../views/price/pricePrintTable.vue')
  }, {
    path: '/priceBatchTable',
    name: '报价单_批量',
    component: () => import('../views/price/priceBatchTable.vue')
  }, {
    path: '/staffAnnualTable',
    name: '合计结算单',
    component: () => import('../views/staff/staffAnnualTable.vue')
  }, {
    path: '/staffDayTable',
    name: '日常结算单',
    component: () => import('../views/staff/staffDayTable.vue')
  }, {
    path: '/reimbursementTable/:id',
    name: '报销单',
    component: () => import('../views/reimbursement/reimbursementTable.vue')
  }, {
    path: '/screenShipmentsList',
    name: '大屏发货列表',
    component: () => import('../views/order/screenShipmentsList.vue')
  }, {
    path: '/orderBatchTable',
    name: '订单批次打印',
    component: () => import('../views/order/orderBatchTable.vue')
  }, {
    path: '/deductTable/:clientId/:type/:oprId/扣款',
    name: '扣款单',
    component: () => import('../views/financialStatistics/deductTable.vue')
  }
]

let router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 权限判断
  if (to.meta && to.meta.permissions_id) {
    if (!isHasPermissions(to.meta.permissions_id)) {
      next(false)
      Message.Message.warning('抱歉，您没有相应的权限')
      return
    }
  }
  // 获取标题
  store.commit('getTitle', to.name ? to.name : from.name)
  const routerTable = {
    '首页': ['织为云', '首页'],
    '编辑页': ['织为云', '编辑页'],
    '详情页': ['织为云', '详情页'],
    '列表页': ['织为云', '列表页'],
    '其它菜单': ['织为云', '其它菜单'],
    '样品添加': ['织为云', '样品添加'],
    '样品详情': ['织为云', '样品列表', '样品详情'],
    '样品修改': ['织为云', '样品列表', '样品修改'],
    '样品列表': ['织为云', '样品列表'],
    '样品订单添加': ['织为云', '样品订单添加'],
    '样品订单详情': ['织为云', '样品订单列表', '样品订单详情'],
    '样品订单修改': ['织为云', '样品订单列表', '样品订单修改'],
    '样品订单列表': ['织为云', '样品订单列表'],
    '产品添加': ['织为云', '产品添加'],
    '产品列表': ['织为云', '产品列表'],
    '产品详情': ['织为云', '产品列表', '产品详情'],
    '产品修改': ['织为云', '产品列表', '产品修改'],
    '报价单添加': ['织为云', '报价单添加'],
    '报价单修改': ['织为云', '报价单修改'],
    '报价单列表': ['织为云', '报价单列表'],
    '报价单详情': ['织为云', '报价单列表', '报价单详情'],
    '再次报价': ['织为云', '报价单列表', '报价单详情', '再次报价'],
    '工艺单添加': ['织为云', '产品列表', '工艺单添加'],
    '工艺单修改': ['织为云', '产品列表', '工艺单修改'],
    '工艺单详情': ['织为云', '产品列表', '工艺单详情'],
    '订单添加': ['织为云', '订单添加'],
    '订单列表': ['织为云', '订单列表'],
    '订单发货列表': ['织为云', '订单发货列表'],
    '订单修改': ['织为云', '订单列表', '订单修改'],
    '订单详情': ['织为云', '订单列表', '订单详情'],
    '配料单添加': ['织为云', '产品列表', '配料单添加'],
    '配料单修改': ['织为云', '产品列表', '配料单修改'],
    '配料单详情': ['织为云', '产品列表', '配料单详情'],
    '物料计划单添加': ['织为云', '物料计划单列表', '物料计划单添加'],
    '物料计划单列表': ['织为云', '物料计划单列表'],
    '物料计划单修改': ['织为云', '物料计划单列表', '物料计划单修改'],
    '物料计划单详情': ['织为云', '物料计划单列表', '物料计划单详情'],
    '物料预定购': ['织为云', '物料预定购'],
    '物料预定购列表': ['织为云', '物料预定购列表'],
    '物料预定购入库': ['织为云', '物料预定购列表', '物料预定购入库'],
    '物料预定购修改': ['织为云', '物料预定购列表', '物料预定购修改'],
    '仓库列表': ['织为云', '仓库列表'],
    '仓库详情': ['织为云', '仓库列表', '仓库详情'],
    '物料预订购': ['织为云', '物料预订购'],
    '物料预订购列表': ['织为云', '物料预订购列表'],
    '物料预订购入库': ['织为云', '物料预订购列表', '物料预订购入库'],
    '物料预订购修改': ['织为云', '物料预订购列表', '物料预订购修改'],
    '物料订购列表': ['织为云', '物料订购列表'],
    '物料订购': ['织为云', '物料订购列表', '物料订购'],
    // '物料批量订购列表': ['织为云', '物料批量订购列表'],
    '物料批量订购': ['织为云', '物料订购列表', '物料批量订购'],
    '系统设置': ['织为云', '系统设置'],
    '物料出入库列表': ['织为云', '物料出入库列表'],
    '物料出入库详情': ['织为云', '物料出入库列表', '物料出入库详情'],
    '物料批量出入库详情': ['织为云', '物料订购列表', '物料批量出入库详情'],
    '织造分配列表': ['织为云', '织造分配列表'],
    '织造分配详情': ['织为云', '织造分配列表', '织造分配详情'],
    '半成品加工分配列表': ['织为云', '半成品加工分配列表'],
    '半成品加工分配详情': ['织为云', '半成品加工分配详情'],
    '装箱管理列表': ['织为云', '装箱管理列表'],
    '装箱计划单详情': ['织为云', '装箱管理列表', '装箱计划单详情'],
    '包装订购列表': ['织为云', '包装订购列表'],
    '包装入库': ['织为云', '包装订购列表', '包装入库'],
    '包装订购详情': ['织为云', '装箱管理列表', '包装订购详情'],
    '产品收发列表': ['织为云', '产品收发列表'],
    '产品收发-数据报表': ['织为云', '产品收发-数据报表'],
    '成品加工-数据报表': ['织为云', '成品加工-数据报表'],
    '产品收发详情': ['织为云', '产品收发列表', '产品收发详情'],
    '检验收发详情-针织': ['织为云', '检验收发列表', '检验收发详情-针织'],
    '检验收发详情-梭织': ['织为云', '检验收发列表', '检验收发详情-梭织'],
    '产品检验列表': ['织为云', '产品检验列表'],
    '成品检验详情': ['织为云', '产品检验列表', '成品检验详情'],
    '半成品检验详情': ['织为云', '产品检验列表', '半成品检验详情'],
    '装箱出库列表': ['织为云', '装箱出库列表'],
    '装箱出库详情': ['织为云', '装箱管理列表', '装箱出库详情'],
    '设备管理': ['织为云', '设备管理'],
    '客户列表': ['织为云', '客户列表'],
    '客户添加': ['织为云', '客户列表', '客户添加'],
    '客户修改': ['织为云', '客户列表', '客户修改'],
    '客户详情': ['织为云', '客户列表', '客户详情'],
    '消息列表': ['织为云', '消息列表'],
    '发通知': ['织为云', '发通知'],
    '年度财务统计': ['织为云', '年度财务统计'],
    '订单财务统计': ['织为云', '订单财务统计'],
    '样单财务统计': ['织为云', '样单财务统计'],
    '产品产量统计': ['织为云', '产品产量统计'],
    '物料使用统计': ['织为云', '物料使用统计'],
    '物料使用详情': ['织为云', '物料使用统计', '物料使用详情'],
    '合作公司财务统计': ['织为云', '合作公司财务统计'],
    '合作公司财务详情': ['织为云', '合作公司财务统计', '合作公司财务详情'],
    '合作公司财务操作记录': ['织为云', '合作公司财务统计', '合作公司财务详情', '合作公司财务操作记录'],
    '添加员工': ['织为云', '添加员工'],
    '员工列表': ['织为云', '员工列表'],
    '员工详情': ['织为云', '员工列表', '员工详情'],
    '日常工资结算表': ['织为云', '员工列表', '日常工资结算表'],
    '修改员工': ['织为云', '员工列表', '修改员工'],
    '合计工资结算单': ['织为云', '合计工资结算单'],
    '生产记录统计': ['织为云', '生产记录统计'],
    '数据可视化': ['织为云', '数据可视化'],
    '添加报销单': ['织为云', '添加报销单'],
    '报销单详情': ['织为云', '报销单列表', '报销单详情'],
    '报销单修改': ['织为云', '报销单列表', '报销单修改'],
    '报销单列表': ['织为云', '报销单列表'],
    '进仓单列表': ['织为云', '进仓单列表'],
    '进仓单详情': ['织为云', '进仓单列表', '进仓单详情'],
    '运输货款列表': ['织为云', '运输货款列表'],
    '运输货款详情': ['织为云', '运输货款列表', '运输货款详情'],
    '成品加工列表': ['织为云', '成品加工列表'],
    '成品加工详情': ['织为云', '成品加工列表', '成品加工详情'],
    '芯片读取出入库列表': ['织为云', '芯片读取出入库列表'],
    '芯片读取': ['织为云', '芯片读取'],
    '结算扣款统计': ['织为云', '结算扣款统计'],
    '工艺单列表': ['织为云', '工艺单列表'],
    '订单财务统计-新版': ['织为云', '订单财务统计'],
    '样单财务统计-新版': ['织为云', '样单财务统计'],
    '物料使用统计-新版': ['织为云', '物料使用统计'],
    '结算扣款统计-新版': ['织为云', '结算扣款统计'],
    '年度财务统计-新版': ['织为云', '年度财务统计'],
    '生产记录统计-新版': ['织为云', '生产记录统计'],
    '客户结算列表': ['织为云', '客户结算列表'],
    '单证列表': ['织为云', '单证列表'],
    '添加单证': ['织为云', '添加单证'],
    '修改单证': ['织为云', '修改单证'],
    '单证详情': ['织为云', '单证列表', '单证详情'],
    '票据列表': ['织为云', '票据列表']
  }
  store.commit('getRoute', routerTable[to.name])
  next()
})

export default router
