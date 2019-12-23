<template>
  <div id="sampleDetail"
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
                  <div class="contents">{{detail.sample_product_code}}</div>
                </div>
                <div class="items">
                  <span class="labels">品类:</span>
                  <div class="contents">{{detail.category_name + ' / ' + detail.type_name + ' / ' + detail.style_name}}</div>
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
            <div class="btn btnBlue">打印标签</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">样品编号：</span>
            <span class="text">{{detail.sample_product_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">样品名称：</span>
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
            <span class="label">样品图片：</span>
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
            <span class="label">样品品类：</span>
            <span class="text">{{detail.category_name + ' / ' + detail.type_name + ' / ' + detail.style_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">样品花型：</span>
            <span class="text">{{detail.flower_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">样品成分：</span>
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
            <span class="label">样品针型：</span>
            <span class="text">{{detail.needle_type?detail.needle_type:'无'}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">样品规格：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in detail.size"
                :key="index">{{item.size_name+ ' ' + item.size_info + 'cm ' + item.weight + 'g'}}</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">关联单据：</span>
            <div class="rectCtn">
              <div class="rect">
                <div class="tab"
                  v-if="detail.craft_info&&detail.craft_info.length>1">
                  <div class="circle"
                    :class="{'active':craft_index===index-1}"
                    v-for="index in detail.craft_info.length"
                    :key="index"
                    @click="craft_index=index-1">
                  </div>
                </div>
                <div class="main">
                  <div class="icon"
                    :class="{'yellow':detail.craft_info&&detail.craft_info.length>0,'gray':!detail.craft_info||detail.craft_info.length===0}">
                    <img src="../../assets/image/sample/craft_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">工艺单</div>
                    <div class="text"
                      v-if="!detail.craft_info||detail.craft_info.length===0">待添加</div>
                    <div class="text"
                      v-if="detail.craft_info&&detail.craft_info.length>0">{{detail.craft_info[craft_index].user_name}}</div>
                    <div class="text"
                      v-if="detail.craft_info&&detail.craft_info.length>0">{{detail.craft_info[craft_index].create_time.slice(0,10)}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="!detail.craft_info||detail.craft_info.length===0"
                    class="opration"
                    @click="$router.push('/craft/craftCreate/'+ $route.params.id + '/2')">添加</span>
                  <span v-if="detail.craft_info&&detail.craft_info.length>0"
                    class="opration">预览</span>
                  <span v-if="detail.craft_info&&detail.craft_info.length>0"
                    class="opration">打印</span>
                  <span v-if="detail.craft_info&&detail.craft_info.length>0"
                    class="opration"
                    @click="$router.push('/craft/craftDetail/'+ $route.params.id + '/2')">详情</span>
                  <span v-if="detail.craft_info&&detail.craft_info.length>0"
                    class="opration">...</span>
                </div>
              </div>
              <div class="rect">
                <div class="tab"
                  v-if="detail.plan_info&&detail.plan_info.length>1">
                  <div class="circle"
                    :class="{'active':plan_index===index-1}"
                    v-for="index in detail.plan_info.length"
                    :key="index"
                    @click="plan_index=index-1">
                  </div>
                </div>
                <div class="main">
                  <div class="icon"
                    :class="{'blue':detail.plan_info&&detail.plan_info.length>1,'gray':!detail.plan_info||detail.plan_info.length===0}">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">配料单</div>
                    <div class="text"
                      v-if="!detail.plan_info||detail.plan_info.length===0">待添加</div>
                    <div class="text"
                      v-if="detail.plan_info&&detail.plan_info.length>1">{{detail.plan_info[plan_index].user_name}}</div>
                    <div class="text"
                      v-if="detail.plan_info&&detail.plan_info.length>1">{{detail.plan_info[plan_index].update_time.slice(0,10)}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="!detail.plan_info||detail.plan_info.length===0"
                    class="opration"
                    @click="$router.push('/productPlan/productPlanCreate/'+ $route.params.id + '/2')">添加</span>
                  <span v-if="detail.plan_info&&detail.plan_info.length>1"
                    class="opration">预览</span>
                  <span v-if="detail.plan_info&&detail.plan_info.length>1"
                    class="opration">打印</span>
                  <span v-if="detail.plan_info&&detail.plan_info.length>1"
                    class="opration"
                    @click="$router.push('/productPlan/productPlanDetail/'+ $route.params.id + '/2')">详情</span>
                  <span v-if="detail.plan_info&&detail.plan_info.length>1"
                    class="opration">...</span>
                </div>
              </div>
              <div class="rect">
                <div class="tab"
                  v-if="detail.quotation_info.length>1">
                  <div class="circle"
                    :class="{'active':quotation_index===index-1}"
                    v-for="index in detail.quotation_info.length"
                    :key="index"
                    @click="quotation_index=index-1"></div>
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
      v-for="(item,index) in detail.part_info"
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
            @click="$router.push('/sample/sampleUpdate/'+$route.params.id)">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { sample } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      detail: {
        category_info: {
          product_category: '',
          name: ''
        },
        part_info: [],
        style_name: '',
        type_name: '',
        flower_id: '',
        color: [],
        has_craft: 0,
        craft_info: [],
        has_plan: 0,
        plan_info: [],
        quotation_info: [],
        img: [],
        materials: [],
        product_code: '',
        sample_title: '',
        size: [],
        description: '',
        needle_type: ''
      },
      plan_index: 0,
      craft_index: 0,
      quotation_index: 0,
      chinaNum: chinaNum,
      qrCodeUrl: ''
    }
  },
  filters: {
    filterMaterials (arr) {
      if (arr) {
        let newArr = arr.filter(item => item.component_name && item.number).map(item => {
          return item.component_name + item.number + '%'
        })
        return newArr.join('/')
      } else {
        return '无'
      }
    }
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.href, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
    sample.detail({
      id: this.$route.params.id
    }).then((res) => {
      if (res.data.status) {
        this.detail = res.data.data
        if (this.detail.image.length === 0) {
          this.detail.image = [{ image_url: require('@/assets/image/index/noPic.jpg') }]
        }
        if (!this.detail.quotation_info) {
          this.detail.quotation_info = []
        }
        this.loading = false
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/sample/sampleDetail.less";
</style>
