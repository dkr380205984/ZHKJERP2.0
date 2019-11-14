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
            <div class="btn noBorder">预览标签</div>
            <div class="btn btnBlue">打印标签</div>
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
              :class="{'blue':detail.sample_title}">{{detail.sample_title?detail.sample_title:'无'}}</span>
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
              <img v-for="(item,index) in detail.img"
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
            <span class="text">{{detail.materials|filterMaterials}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">配色方案：</span>
            <span class="text">
              <span v-for="(item,index) in detail.color"
                :key="index">{{(index+1) + '. ' +item.color_name + ' '}}</span>
            </span>
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
                    :class="{'yellow':detail.has_craft===1,'gray':detail.has_craft===0}">
                    <img src="../../assets/image/sample/craft_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">工艺单</div>
                    <div class="text"
                      v-if="detail.has_craft===0">待添加</div>
                    <div class="text"
                      v-if="detail.has_craft===1">{{detail.craft_info.user_name}}</div>
                    <div class="text"
                      v-if="detail.has_craft===1">{{detail.craft_info.create_time.slice(0,10)}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="detail.has_craft===0"
                    class="opration">添加</span>
                  <span v-if="detail.has_craft===1"
                    class="opration">预览</span>
                  <span v-if="detail.has_craft===1"
                    class="opration">打印</span>
                  <span v-if="detail.has_craft===1"
                    class="opration">详情</span>
                  <span v-if="detail.has_craft===1"
                    class="opration">...</span>
                </div>
              </div>
              <div class="rect">
                <div class="main">
                  <div class="icon"
                    :class="{'blue':detail.has_plan===1,'gray':detail.has_plan===0}">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">配料单</div>
                    <div class="text"
                      v-if="detail.has_craft===0">待添加</div>
                    <div class="text"
                      v-if="detail.has_plan===1">{{detail.product_plan_info.user_name}}</div>
                    <div class="text"
                      v-if="detail.has_plan===1">{{detail.product_plan_info.create_time.slice(0,10)}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="detail.has_plan===0"
                    class="opration">添加</span>
                  <span v-if="detail.has_plan===1"
                    class="opration">预览</span>
                  <span v-if="detail.has_plan===1"
                    class="opration">打印</span>
                  <span v-if="detail.has_plan===1"
                    class="opration">详情</span>
                  <span v-if="detail.has_plan===1"
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
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">配件一</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">配件名称：</span>
            <span class="text">拉链</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">配件成分：</span>
            <span class="text">拉链100%</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">配件规格：</span>
            <div class="lineCtn">
              <div class="line">儿童款 10*20*30cm xxx 1个</div>
              <div class="line">成人款 10*20*30cm xxx 2个</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">关联单据：</span>
            <div class="rectCtn">
              <div class="rect">
                <div class="main">
                  <div class="icon yellow">
                    <img src="../../assets/image/sample/craft_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">工艺单</div>
                    <div class="text">隔壁老王</div>
                    <div class="text">2019-08-23</div>
                  </div>
                </div>
                <div class="menu">
                  <span class="opration">预览</span>
                  <span class="opration">打印</span>
                  <span class="opration">详情</span>
                  <span class="opration">...</span>
                </div>
              </div>
              <div class="rect">
                <div class="main">
                  <div class="icon blue">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">配料单</div>
                    <div class="text">隔壁老王</div>
                    <div class="text">2019-08-23</div>
                  </div>
                </div>
                <div class="menu">
                  <span class="opration">预览</span>
                  <span class="opration">打印</span>
                  <span class="opration">详情</span>
                  <span class="opration">...</span>
                </div>
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
        craft_info: {},
        has_plan: 0,
        product_plan_info: '',
        quotation_info: [],
        img: [],
        materials: [],
        product_code: '',
        sample_title: '',
        size: [],
        description: ''
      },
      quotation_index: 0,
      chinaNum: chinaNum
    }
  },
  filters: {
    filterMaterials (arr) {
      let str = ''
      arr.forEach((item) => {
        str += item.ingredient_name + item.ingredient_value + '%' + ' / '
      })
      return str.substring(0, str.length - 2)
    }
  },
  mounted () {
    product.detail({
      id: this.$route.params.id
    }).then((res) => {
      console.log(res)
      if (res.data.status) {
        this.detail = res.data.data
        if (this.detail.img.length === 0) {
          this.detail.img = [{ image_url: require('@/assets/image/index/noPic.jpg') }]
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
