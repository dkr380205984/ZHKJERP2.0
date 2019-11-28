<template>
  <div id='priceDetail'
    class='indexMain'>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">报价单信息</span>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="btnCtn">
            <div class="btn btnGray"
              @click="$router.push('/price/priceUpdate/' + $route.params.id)">修改</div>
            <div class="btn btnGray"
              @click="$openUrl('/pricePrintTable/'+$route.params.id)">打印</div>
            <div class="btn btnBlue">审核</div>
          </div>
          <div class="otherInfo">
            <div class="block">
              <span class="label">状态</span>
              <span :class="['text',status === 1 ? 'blue' : (status === 2 ? 'green' : 'red')]">{{status|filterStatus}}</span>
            </div>
            <div class="block">
              <span class="label">订单金额</span>
              <span class="text">￥{{total_price ? total_price : 0}}</span>
            </div>
          </div>
        </div>
        <div :class="['statuIcon',status === 1 ? 'reasoning' : false,status === 3 ? 'pass' : false,status === 2 ? 'tongguo' : false]"></div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">报价单号：</span>
            <span class="text">{{code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{create_user}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">外贸公司：</span>
            <span class="text">{{client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{contact_man}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">结算单位：</span>
            <span class="text">{{unit}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">结算汇率：</span>
            <span class="text">{{exchange_rate}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">更新时间：</span>
            <span class="text">{{update_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">驳回理由：</span>
            <span class="text">{{reason}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">产品信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">起订数量：</span>
            <span class="text">{{set_num}}件</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">起订备注：</span>
            <span class="text">{{set_desc ? set_desc : '暂无备注'}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品需求：</span>
            <span class="text">{{product_need ? product_need : '暂无需求'}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品信息：</span>
            <span class="rectCtn">
              <el-carousel trigger="click"
                :autoplay="false"
                style="width:654px;height:212px">
                <el-carousel-item v-for="(item,index) in product_info"
                  :key="index">
                  <zh-card :data="item"
                    :key="index"></zh-card>
                </el-carousel-item>
              </el-carousel>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品文件：</span>
            <span class="imgCtn">
              <el-image style="width: 100px; height: 100px"
                :src="file_url[0]"
                :preview-src-list="file_url">
              </el-image>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">报价信息</span>
      </div>
      <div class="priceInfoCtn hasBorder">
        <div class="priceInfo_item">
          <div class="item_title samllPadding item_row bold">产品费用</div>
          <div class="item_row bold">
            <span class="item_col flex_18">名称</span>
            <span class="item_col">克重/数量</span>
            <span class="item_col">单价</span>
            <span class="item_col">损耗</span>
            <span class="item_col flex_7">其他</span>
            <span class="item_col right flex_7">总价</span>
          </div>
          <div class="item_row"
            v-for="(item,index) in price_info"
            :key="index">
            <span class="item_col flex_18">{{item.name}}</span>
            <span class="item_col">{{item.number ? item.number + item.unit : '/'}}</span>
            <span class="item_col">{{item.price ? item.price + '元' : '/'}}</span>
            <span class="item_col">{{item.sunhao ? item.sunhao + '%' : '/'}}</span>
            <span class="item_col flex_7">{{item.other ? item.other : '/'}}</span>
            <span class="item_col right flex_7">{{item.totalPrice ? item.totalPrice + '元' : '0元'}}</span>
          </div>
          <div class="item_row item_title"
            style="padding:0 40px">
            <span class="item_col flex_18">
              <span class="fontBold">合计</span>
            </span>
            <span class="item_col right flex_7">
              <span class="fontBold">{{price_info|filterTotal}}</span>元
            </span>
          </div>
        </div>
        <div class="priceInfo_item">
          <div class="item_title samllPadding item_row bold">订单费用</div>
          <div class="item_row bold">
            <span class="item_col flex_7">名称</span>
            <span class="item_col right">费用比例</span>
            <span class="item_col right">总价</span>
          </div>
          <div class="item_row"
            v-for="(item,index) in basic_info"
            :key="index">
            <span class="item_col flex_7">{{item.name}}</span>
            <span class="item_col right">{{item.prop ? item.prop + '%' : '/'}}</span>
            <span class="item_col right ">{{item.totalPrice ? item.totalPrice + '元' : '0元'}}</span>
          </div>
          <div class="item_row item_title"
            style="padding:0 40px">
            <span class="item_col flex_18">
              <span class="fontBold">合计</span>
            </span>
            <span class="item_col right flex_7">
              <span class="fontBold">{{basic_info|filterTotal}}</span>元
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
          <div class="btn btnBlue">审核</div>
        </div>
        <div class="priceCtn">
          <span class="title">总价：</span>
          <span class="content">
            <span class="price">{{total_price}}</span>
            元
          </span>
          <span class="content marginLeft"
            v-if="unit && unit !== '元'">
            <span class="price">{{Number(total_price / exchange_rate * 100).toFixed(2)}}</span>
            {{unit}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { price } from '@/assets/js/api.js'
export default {
  data () {
    return {
      code: '',
      create_user: '',
      client_name: '',
      contact_man: '',
      unit: '',
      exchange_rate: '',
      update_time: '',
      reason: '',
      status: '',
      total_price: '',
      set_num: '',
      set_desc: '',
      product_need: '',
      product_info: [],
      file_url: [],
      price_info: [],
      basic_info: []
    }
  },
  methods: {

  },
  filters: {
    filterTotal (item) {
      if (item.length === 0) {
        return 0
      } else {
        return Number(item.reduce((total, val) => {
          return Number(total.totalPrice ? total.totalPrice : (total || 0)) + Number(val.totalPrice ? val.totalPrice : 0)
        })).toFixed(2)
      }
    },
    filterStatus (statu) {
      if (statu === 1) {
        return '待审核'
      } else if (statu === 2) {
        return '已通过'
      } else if (statu === 3) {
        return '驳回'
      }
    },
    filterType (item) {
      return '1'
    }
  },
  created () {
    price.detail({
      id: this.$route.params.id
    }).then(res => {
      if (res.data.status) {
        let data = res.data.data
        this.code = data.quotation_code
        this.create_user = data.user_name
        this.client_name = data.client_name
        this.contact_man = data.contact_name
        this.unit = data.account_unit
        this.exchange_rate = data.exchange_rate
        this.update_time = data.updated_at
        this.reason = (data.reason ? JSON.parse(data.reason).join(',') + (data.reason_text ? '(' + data.reason_text + ')' : '') : '')
        this.status = data.status
        this.total_price = data.total_price
        this.set_num = data.number
        this.set_desc = data.product_need_desc
        this.product_need = data.product_need
        this.product_info = data.product_info.map(item => {
          return {
            show: false,
            colorSize: item.color_size,
            product_code: item.product_info.product_code,
            img: item.product_info.images,
            category_name: item.product_info.category_name,
            type_name: item.product_info.type_name,
            style_name: item.product_info.style_name,
            color: item.product_info.color.map(vals => vals.color_name),
            size: item.product_info.size,
            description: item.product_info.description
            // ...item
          }
        })
        this.file_url = data.file_url ? JSON.parse(data.file_url) : [require('@/assets/image/index/noPic.jpg')]
        this.price_info.push(
          ...JSON.parse(data.material_info).map(item => {
            return {
              name: item.key ? item.key : '原料',
              number: item.weight,
              price: item.price,
              sunhao: item.sunhao,
              totalPrice: item.total_price,
              unit: 'g'
            }
          }),
          ...JSON.parse(data.assist_info).map(item => {
            return {
              name: item.key ? item.key : '辅料',
              number: item.weight,
              price: item.price,
              sunhao: item.sunhao,
              totalPrice: item.total_price,
              unit: item.unit
            }
          }),
          ...JSON.parse(data.weave_info).map(item => {
            return {
              name: item.key ? item.key : '织造',
              other: item.number,
              totalPrice: item.total_price || item.price
            }
          }),
          ...JSON.parse(data.semi_product_info).map(item => {
            return {
              name: item.key && item.key.length !== 0 ? item.key.join('/') : '半成品加工',
              totalPrice: item.total_price || item.price
            }
          }),
          ...JSON.parse(data.production_info).map(item => {
            return {
              name: item.key && item.key.length !== 0 ? item.key.join('/') : '成品加工',
              totalPrice: item.total_price || item.price
            }
          }),
          ...JSON.parse(data.pack_material_info).map(item => {
            return {
              name: item.key ? item.key : '包装',
              totalPrice: item.total_price || item.price
            }
          }),
          ...JSON.parse(data.desc_info).map(item => {
            return {
              name: item.key ? item.key : '其他',
              totalPrice: item.total_price || item.price
            }
          }),
          { name: '非生产费用', totalPrice: data.no_product_cost },
          { name: '运输', totalPrice: data.transport_cost }
        )
        this.basic_info.push(
          {
            name: '基本佣金',
            prop: JSON.parse(data.commission).prop,
            totalPrice: JSON.parse(data.commission).price
          }, {
            name: '基本税费',
            prop: JSON.parse(data.tax).prop,
            totalPrice: JSON.parse(data.tax).price
          }, {
            name: '基本利润',
            prop: JSON.parse(data.profit).prop,
            totalPrice: JSON.parse(data.profit).price
          }
        )
      } else {
        this.$message.error('出问题了，请刷新页面')
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/price/priceDetail.less";
</style>
