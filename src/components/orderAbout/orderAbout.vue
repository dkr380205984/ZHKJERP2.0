<template>
  <div class="permission__com"
    :class="{'isActive':isShow}"
    @click.stop>
    <ul class="permission__container">
      <li class="permission__item"
        v-for="(itemL,indexL) in listArr"
        :key="indexL"
        @click="openUrl(itemL)">{{itemL.name}}</li>
    </ul>
    <div class="right_btn"
      @click="isShow = !isShow">
      {{isShow ? '收起列表' : '关联页面'}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderId: {
      type: [Number, String]
    },
    orderType: {
      type: [Number, String],
      default: 1
    }
  },
  data () {
    return {
      isShow: false,
      list: [
        {
          name: '物料计划单', //名称
          url (orderId, orderType) {
            return `/materialPlan/materialPlanDetail/${orderId}/${orderType}`
          },  //地址
          type: 6, //权限类型
          sampleNotHave: false //样单是否有该项
        }, {
          name: '原料订购加工详情',
          url (orderId, orderType) {
            return `/material/materialDetail/${orderId}/1/${orderType}/normal`
          },
          type: 7,
          sampleNotHave: false
        }, {
          name: '辅料订购加工详情',
          url (orderId, orderType) {
            return `/material/materialDetail/${orderId}/2/${orderType}/normal`
          },
          type: 7,
          sampleNotHave: false
        }, {
          name: '原料出入库详情',
          url (orderId, orderType) {
            return `/materialStock/materialStockDetail/${orderId}/1/${orderType}`
          },
          type: 15,
          sampleNotHave: false
        }, {
          name: '辅料出入库详情',
          url (orderId, orderType) {
            return `/materialStock/materialStockDetail/${orderId}/2/${orderType}`
          },
          type: 15,
          sampleNotHave: false
        }, {
          name: '织造分配详情',
          url (orderId, orderType) {
            return `/weavingProcessing/weavingDetail/${orderId}/${orderType}`
          },
          type: 8,
          sampleNotHave: false
        }, {
          name: '半成品加工分配详情',
          url (orderId, orderType) {
            return `/weavingProcessing/processingDetail/${orderId}/${orderType}`
          },
          type: 8,
          sampleNotHave: false
        }, {
          name: '检验收发详情',
          url (orderId) {
            return `/receiveDispatch/jysf/${orderId}`
          },
          type: 9,
          sampleNotHave: true
        }, {
          name: '成品加工详情',
          url (orderId) {
            return `/productProcess/productProcessDetail/${orderId}`
          },
          type: 10,
          sampleNotHave: true
        }, {
          name: '装箱计划单详情',
          url (orderId) {
            return `/packPlan/packPlanCreate/${orderId}`
          },
          type: 11,
          sampleNotHave: true
        }, {
          name: '包装订购详情',
          url (orderId) {
            return `/packPlan/packOrderDetail/${orderId}`
          },
          type: 11,
          sampleNotHave: true
        }, {
          name: '销售出库详情',
          url (orderId) {
            return `/packPlan/packStock/${orderId}`
          },
          type: 11,
          sampleNotHave: true
        }
      ]
    }
  },
  methods: {
    openUrl (item) {
      this.closePopup()
      this.$router.push(item.url(this.orderId, this.orderType))
    },
    closePopup () {
      this.isShow = false
    }
  },
  watch: {
    isShow (e) {
      if (e) {
        window.removeEventListener('click', this.closePopup)
        window.addEventListener('click', this.closePopup)
      } else {
        window.removeEventListener('click', this.closePopup)
      }
    }
  },
  computed: {
    listArr () {
      let moduleId = window.sessionStorage.getItem('module_id') && JSON.parse(window.sessionStorage.getItem('module_id'))
      if (+this.orderType === 2) {
        return this.list.filter(itemF => moduleId.includes(itemF.type)).filter(itemF => !itemF.sampleNotHave)
      }
      return this.list.filter(itemF => moduleId.includes(itemF.type))
    }
  }
}
</script>

<style scoped lang='less'>
@import "./orderAbout.less";
</style>
 