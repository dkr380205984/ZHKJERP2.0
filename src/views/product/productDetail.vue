<template>
  <div id="productDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="btnCtn">
            <div class="btn noBorder">预览标签
              <div class="printInfo">
                <div class="items">
                  <span class="labels">编号:</span>
                  <div class="contents">{{detail.product_code}}</div>
                </div>
                <div class="items">
                  <span class="labels">品类:</span>
                  <div class="contents">{{detail.category_info.product_category + ' / ' + detail.type_name + ' / ' + detail.style_name}}</div>
                </div>
                <div class="items">
                  <span class="labels">成分:</span>
                  <div class="contents">{{detail.component|filterMaterials}}</div>
                </div>
                <div class="items">
                  <span class="labels">规格:</span>
                  <div class="contents col"
                    style="align-items:flex-start">
                    <span style="white-space:nowrap;"></span>
                    <span style="word-break: break-word;"></span>
                  </div>
                </div>
                <div class="items">
                  <span class="labels">克重:</span>
                  <div class="contents"></div>
                </div>
                <div class="items">
                  <span class="labels">颜色:</span>
                  <div class="contents"></div>
                </div>
                <div class="items">
                  <span class="labels">描述:</span>
                  <div class="contents">
                    <span>{{detail.description ? detail.description : '无'}}</span>
                  </div>
                </div>
                <div class="items"
                  style="margin-top:30px;">
                  <div class="contents col">
                    <img :src="qrCodeUrl"
                      class="qrCode"
                      alt="">
                    <span class="littleBlack">扫码查看更多</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn btnBlue"
              @click="printFlag = true">打印标签</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">产品编号：</span>
            <span class="text">{{detail.product_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">产品名称：</span>
            <span class="text"
              :class="{'blue':detail.name}">{{detail.name?detail.name:'无'}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{detail.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建时间：</span>
            <span class="text">{{detail.create_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品图片：</span>
            <div class="imgCtn">
              <img v-for="(item,index) in detail.image"
                :key="index"
                :src="item.image_url" />
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':detail.description}">{{detail.description?detail.description:'无'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">大身信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">产品品类：</span>
            <span class="text">{{detail.category_info.product_category + ' / ' + detail.type_name + ' / ' + detail.style_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">产品花型：</span>
            <span class="text">{{detail.flower_id}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">产品成分：</span>
            <span class="text">{{detail.component|filterMaterials}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="flex:2">
            <span class="label">配色方案：</span>
            <span class="text">
              <span v-for="(item,index) in detail.color"
                :key="index">{{(index+1) + '. ' +item.color_name + ' '}}</span>
            </span>
          </div>
          <div class="colCtn"
            style="flex:1;margin-left:72px">
            <span class="label">产品针型：</span>
            <span class="text">{{detail.needle_type?detail.needle_type:'无'}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品规格：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in detail.size"
                :key="index">{{item.measurement+ ' ' + item.size_info + 'cm ' + item.weight + 'g'}}</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">关联单据：</span>
            <div class="rectCtn">
              <div class="rect">
                <div class="main">
                  <div class="icon"
                    :class="{'yellow':detail.craft_info,'gray':!detail.craft_info}">
                    <img src="../../assets/image/sample/craft_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">工艺单</div>
                    <div class="text"
                      v-if="!detail.craft_info">待添加</div>
                    <div class="text"
                      v-if="detail.craft_info">{{detail.craft_info.user_name}}</div>
                    <div class="text"
                      v-if="detail.craft_info">{{detail.craft_info.create_time.slice(0,10)}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="!detail.craft_info"
                    class="opration"
                    @click="$router.push('/craft/craftCreate/'+ $route.params.id + '/1')">添加</span>
                  <span v-if="detail.craft_info"
                    class="opration">预览</span>
                  <span v-if="detail.craft_info"
                    class="opration">打印</span>
                  <span v-if="detail.craft_info"
                    class="opration"
                    @click="$router.push('/craft/craftDetail/'+ $route.params.id + '/1')">详情</span>
                  <span v-if="detail.craft_info"
                    class="opration">...</span>
                </div>
              </div>
              <div class="rect">
                <div class="main">
                  <div class="icon"
                    :class="{'blue':detail.product_plan_info,'gray':!detail.product_plan_info}">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">配料单</div>
                    <div class="text"
                      v-if="!detail.product_plan_info">待添加</div>
                    <div class="text"
                      v-if="detail.product_plan_info">{{detail.product_plan_info.user_name}}</div>
                    <div class="text"
                      v-if="detail.product_plan_info">{{detail.product_plan_info.update_time.slice(0,10)}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="!detail.product_plan_info"
                    class="opration"
                    @click="$router.push('/productPlan/productPlanCreate/'+ $route.params.id + '/1')">添加</span>
                  <span v-if="detail.product_plan_info"
                    class="opration">预览</span>
                  <span v-if="detail.product_plan_info"
                    class="opration">打印</span>
                  <span v-if="detail.product_plan_info"
                    class="opration"
                    @click="$router.push('/productPlan/productPlanDetail/'+ $route.params.id + '/1')">详情</span>
                  <span v-if="detail.product_plan_info"
                    class="opration">...</span>
                </div>
              </div>
              <div class="rect">
                <div class="tab"
                  v-if="detail.quotation_info.length>1">
                  <div class="circle"
                    :class="{'active':quotation_index===index}"
                    v-for="index in detail.quotation_info.length"
                    :key="index"
                    @click="quotation_index=index"></div>
                </div>
                <div class="main">
                  <div class="icon"
                    :class="{'green': detail.quotation_info.length > 0,'gray': detail.quotation_info.length===0}">
                    <img src="../../assets/image/sample/price_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">报价单</div>
                    <div class="text"
                      v-if="detail.quotation_info.length ===0">待添加</div>
                    <div class="text"
                      v-if="detail.quotation_info.length > 0"
                      style="color:#1A95FF">{{detail.quotation_info.length>0?detail.quotation_info[quotation_index].total_price + '元':''}}</div>
                    <div class="text"
                      v-if="detail.quotation_info.length > 0">{{detail.quotation_info.length>0?detail.quotation_info[quotation_index].client_name:''}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="detail.quotation_info.length===0"
                    class="opration">添加</span>
                  <span v-if="detail.quotation_info.length > 0"
                    class="opration">预览</span>
                  <span v-if="detail.quotation_info.length > 0"
                    class="opration">打印</span>
                  <span v-if="detail.quotation_info.length > 0"
                    class="opration">详情</span>
                  <span v-if="detail.quotation_info.length > 0"
                    class="opration">...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-for="(item,index) in detail.part_data"
      :key="index">
      <div class="titleCtn">
        <span class="title hasBorder">配件{{chinaNum[index]}}</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">配件名称：</span>
            <span class="text">{{item.part_title}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">配件成分：</span>
            <span class="text">{{item.part_component|filterMaterials}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">配件规格：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in item.size"
                :key="index">
                <span style="margin-right:8px">{{item.measurement}}</span>
                <span style="margin-right:8px">{{item.size_info}}cm</span>
                <span style="margin-right:8px">{{item.weight}}g</span>
                <span style="color:#1A95FF">{{item.number}}个</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="$router.push('/product/productUpdate/'+$route.params.id)">修改</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="printFlag">
      <div class="main">
        <div class="title">
          <span class="text">打印标签</span>
          <span class="el-icon-close"
            @click="printFlag = false"></span>
        </div>
        <div class="content">
          <span class="row">
            <span class="label">产品编号：</span>
            <span class="info colCenter blue">{{detail.product_code}}</span>
          </span>
          <span class="row">
            <span class="label">产品规格：</span>
            <span class="info colCenter">
              <el-checkbox :indeterminate="isIndeterminateSize"
                v-model="checkAllSize"
                @change="handleCheckAllSize">全选</el-checkbox>
              <el-checkbox v-for="size in detail.size"
                :label="size.measurement"
                :key="size.measurement"
                v-model="size.checked"
                @change="handleCheckSize">{{size.measurement}}</el-checkbox>
            </span>
          </span>
          <span class="row">
            <span class="label">产品配色：</span>
            <span class="info colCenter">
              <el-checkbox :indeterminate="isIndeterminateColor"
                v-model="checkAllColor"
                @change="handleCheckAllColor">全选</el-checkbox>
              <el-checkbox v-for="color in detail.color"
                :label="color.color_name"
                :key="color.color_name"
                v-model="color.checked"
                @change="handleCheckColor">{{color.color_name}}</el-checkbox>
            </span>
          </span>
        </div>
        <div class="opr">
          <div class="btn btnGray">取消</div>
          <div class="btn btnBlue"
            @click="openTagPrint">去打印</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { product } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      detail: {
        category_info: {
          product_category: '',
          name: ''
        },
        style_name: '',
        type_name: '',
        flower_id: '',
        color: [],
        has_craft: 0,
        craft_info: null,
        has_plan: 0,
        product_plan_info: null,
        quotation_info: [],
        image: [],
        component: [],
        product_code: '',
        sample_title: '',
        size: [],
        description: '',
        needle_type: ''
      },
      quotation_index: 0,
      chinaNum: chinaNum,
      qrCodeUrl: '',
      printFlag: false,
      isIndeterminateSize: true,
      checkAllSize: false,
      checkedSize: [],
      isIndeterminateColor: true,
      checkAllColor: false,
      checkedColor: []
    }
  },
  filters: {
    filterMaterials (arr) {
      let str = ''
      if (arr[0] && arr[0].component_name) {
        arr.forEach((item) => {
          str += item.component_name + item.number + '%' + ' / '
        })
        return str.substring(0, str.length - 2)
      } else {
        return '无'
      }
    }
  },
  methods: {
    handleCheckAllSize ($event) {
      this.isIndeterminateSize = false
      this.detail.size.forEach(itemSize => {
        itemSize.checked = $event
      })
    },
    handleCheckSize () {
      let data = this.detail.size.filter(itemSize => !itemSize.checked)
      if (data.length > 0) {
        this.checkAllSize = false
        if (data.length === this.detail.size.length) {
          this.isIndeterminateSize = false
        } else {
          this.isIndeterminateSize = true
        }
      } else {
        this.checkAllSize = true
        this.isIndeterminateSize = false
      }
    },
    handleCheckAllColor ($event) {
      this.isIndeterminateColor = false
      this.detail.color.forEach(itemColor => {
        itemColor.checked = $event
      })
    },
    handleCheckColor () {
      let data = this.detail.color.filter(itemColor => !itemColor.checked)
      if (data.length > 0) {
        this.checkAllColor = false
        if (data.length === this.detail.color.length) {
          this.isIndeterminateColor = false
        } else {
          this.isIndeterminateColor = true
        }
      } else {
        this.checkAllColor = true
        this.isIndeterminateColor = false
      }
    },
    openTagPrint () {
      this.printFlag = false
      let checkSize = this.detail.size.filter(itemSize => itemSize.checked).map(itemSize => itemSize.measurement)
      let checkColor = this.detail.color.filter(itemColor => itemColor.checked).map(itemColor => itemColor.color_name)
      if (checkSize.length === 0) {
        this.$message.error('检测到未选择尺码规格')
        return
      }
      if (checkColor.length === 0) {
        this.$message.error('检测到未选择配色')
        return
      }
      this.$openUrl('/tagProductPrint/' + this.$route.params.id + '/' + checkSize.join('&') + '&&' + checkColor.join('&'))
    }
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.href, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
    product.detail({
      id: this.$route.params.id
    }).then((res) => {
      console.log(res)
      if (res.data.status) {
        this.detail = res.data.data
        this.detail.size.forEach((itemSize, indexSize) => {
          if (indexSize === 0) {
            itemSize.checked = true
          } else {
            itemSize.checked = false
          }
        })
        this.detail.color.forEach((itemColor, indexColor) => {
          if (indexColor === 0) {
            itemColor.checked = true
          } else {
            itemColor.checked = false
          }
        })
        this.handleCheckSize()
        this.handleCheckColor()
        if (this.detail.image.length === 0) {
          this.detail.image = [{ image_url: require('@/assets/image/index/noPic.jpg') }]
        }
        this.loading = false
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/product/productDetail.less";
</style>
