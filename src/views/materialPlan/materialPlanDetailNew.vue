<template>
  <div id="materialPlanDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">{{$route.params.type==='1'?'订':'样'}}单信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">编号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">{{$route.params.type==='1'?'订':'样'}}单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">批次信息：</span>
            <span class="text">
              <zh-batch :data="orderInfo.batch_info"></zh-batch>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{orderInfo.contacts}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{orderInfo.group_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':orderInfo.desc}">{{orderInfo.desc?orderInfo.desc:'无'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-for="(itemPlan,indexPlan) in materialPlansInfo"
      :key="indexPlan">
      <div class="titleCtn">
        <span class="title hasBorder">计划单{{chinaNum[indexPlan]}}</span>
        <div class="positionBtn">
          <div class="btn noBorder noPadding"
            @click="$openUrl('/materialPlanTable/' + $route.params.id + '/' + $route.params.type + '?type=1')">打印</div>
          <div class="btn noBorder noPadding">拆分</div>
          <div class="btn noBorder noPadding red">删除</div>
        </div>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="tableCtnLv2 haveBorder">
            <span class="tb_content">
              <span class="tb_row">
                计划单名称：{{itemPlan.title}}
              </span>
            </span>
            <span class="tb_content">
              <span class="tb_row">包含产品：{{'19ABA220206'}}</span>
            </span>
            <span class="tb_content">
              <span class="tb_row fontBold">物料名称</span>
              <span class="tb_row fontBold">物料类型</span>
              <span class="tb_row fontBold">物料颜色及属性</span>
              <span class="tb_row fontBold">所需数量</span>
            </span>
            <span class="tb_content minH30 noBorder"
              v-for="(itemMa,indexMa) in itemPlan.material_data"
              :key="indexMa">
              <span class="tb_row">{{itemMa.material_name}}</span>
              <span class="tb_row"
                :class="itemMa.material_type === 1 ? 'green' : 'orange'">{{itemMa.material_type === 1 ? '原料' : '辅料'}}</span>
              <span class="tb_row">{{itemMa.material_attribute}}</span>
              <span class="tb_row">{{itemMa.weight}}{{itemMa.unit}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">物料统计</span>
        <div class="positionBtn">
          <div class="btn btnWhiteBlue"
            @click="$openUrl('/materialPlanTable/' + $route.params.id + '/' + $route.params.type + '?type=1')">打印原料单</div>
          <div class="btn btnWhiteBlue"
            @click="$openUrl('/materialPlanTable/' + $route.params.id + '/' + $route.params.type + '?type=2')">打印辅料单</div>
        </div>
      </div>
      <div class="detailCtn paddingTop60">
        <div class="flexTb">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn center flex04">物料类型</span>
              <span class="tcolumn">物料名称</span>
              <span class="tcolumn flex20 noPad">
                <span class="trow">
                  <span class="tcolumn">颜色</span>
                  <span class="tcolumn">重量/数量</span>
                </span>
              </span>
              <span class="tcolumn">总计</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(itemMa,indexMa) in materialPlanTotalInfo"
              :key="indexMa">
              <span class="tcolumn center flex04"
                :class="itemMa.type === 1 ? 'green' : 'orange'">{{itemMa.type === 1 ? '原料' : '辅料'}}</span>
              <span class="tcolumn">{{itemMa.material_name}}</span>
              <span class="tcolumn flex20 noPad">
                <span class="trow"
                  v-for="(itemColor,indexColor) in itemMa.color_info"
                  :key="indexColor">
                  <span class="tcolumn">{{itemColor.material_attribute}}</span>
                  <span class="tcolumn">{{itemColor.weight + itemMa.unit}}</span>
                </span>
              </span>
              <span class="tcolumn">{{itemMa.total_weight + itemMa.unit}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnRed"
            @click="deleteMaterialPlan($route.params.id,$route.params.type)">删除</div>
          <div class="btn btnBlue"
            @click="$router.push('/materialPlan/materialPlanUpdate/' + $route.params.id + '/' + $route.params.type)">修改</div>
          <div class="btn btnBlue"
            @click="$openUrl('/material/materialDetail/' + $route.params.id + '/1' + '/' + $route.params.type + '/easy')">去订原料</div>
          <div class="btn btnBlue"
            @click="$openUrl('/material/materialDetail/' + $route.params.id  +'/2'+ '/' + $route.params.type + '/easy')">去订辅料</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showRouterPopup">
      <div class="main">
        <div class="title">
          <span style="display:flex;justify-content:center;flex:auto">请选择需要您要跳转的页面</span>
          <span class="el-icon-close"
            @click="showRouterPopup = false"></span>
        </div>
        <div class="content">
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/material/materialDetail/' + $route.params.id + '/1/' + $route.params.type + '/normal' )">原料订购</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/material/materialDetail/' + $route.params.id + '/2/' + $route.params.type  + '/normal')">辅料订购</div>
          </div>
          <div class="row"
            style="display:flex;justify-content:space-around;align-items:center">
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id + '/1/' + $route.params.type)">原料出入库</div>
            <div class="btn btnWhiteBlue"
              style="width:6em;text-align:center"
              @click="$router.push('/materialStock/materialStockDetail/' + $route.params.id + '/2/' + $route.params.type)">辅料出入库</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { materialPlan, order, sampleOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      chinaNum: chinaNum,
      orderInfo: {},
      materialPlanInfo: [],
      materialPlanTotalInfo: [],
      materialPlansInfo: [],
      showRouterPopup: false,
      checkedAll: false
    }
  },
  created () {
    let orderOrSample = this.$route.params.type === '1' ? order : sampleOrder
    Promise.all([
      orderOrSample.detail({
        id: this.$route.params.id
      }),
      materialPlan.getDressDetailForOrder({
        order_id: this.$route.params.id,
        order_type: this.$route.params.type
      })
    ]).then(res => {
      let orderInfo = res[0].data.data
      if (this.$route.params.type === '1') {
        this.orderInfo = {
          order_code: orderInfo.order_code,
          client_name: orderInfo.client_name,
          contacts: orderInfo.contacts,
          group_name: orderInfo.group_name,
          order_time: orderInfo.order_time,
          desc: orderInfo.remark
        }
      } else {
        this.orderInfo = {
          order_code: orderInfo.title,
          client_name: orderInfo.client_name,
          contacts: orderInfo.contacts,
          group_name: orderInfo.group_name,
          order_time: orderInfo.order_time,
          desc: orderInfo.desc
        }
      }
      this.materialPlansInfo = res[1].data.data.detail_data
      this.materialPlanTotalInfo = this.$mergeData(res[1].data.data.total_data, { mainRule: ['material_type/type', 'material_name', 'unit'], childrenName: 'color_info', childrenRule: { mainRule: 'material_attribute', otherRule: [{ name: 'weight', type: 'add' }] } })
      this.materialPlanTotalInfo.forEach(itemMa => {
        itemMa.total_weight = itemMa.color_info.map(itemColor => Number(itemColor.weight) || 0).reduce((a, b) => {
          return a + b
        })
      })
      this.loading = false
    })
    if (this.$route.query.showRouterPopup === 'true') {
      this.showRouterPopup = true
    }
  },
  methods: {
    deleteMaterialPlan (id, type) {
      materialPlan.delete({
        order_id: id,
        order_type: type
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('删除成功')
          this.$router.push('/materialPlan/materialPlanCreate/' + id + '/' + type)
        }
      })
    }
  },
  filters: {
    filterType (item) {
      return [item.category_info.category_name, item.category_info.style_name, item.category_info.type_name].join('/')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/assets/less/materialPlan/materialPlanDetail.less";
</style>

<style lang="less">
#materialPlanDetail {
  .el-collapse-item__header {
    position: relative;
    min-height: 54px;
    display: flex;
    .el-collapse-item__arrow {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%) rotateZ(90deg);
      color: #1a95ff;
      &.is-active {
        transform: translateY(-50%) rotateZ(270deg);
      }
    }
  }
  .el-collapse-item__wrap {
    background-color: #f2f4f7;
  }
}
</style>
