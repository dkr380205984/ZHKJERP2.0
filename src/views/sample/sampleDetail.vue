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
                  <span class="labels">花型:</span>
                  <div class="contents">{{detail.flower_name}}</div>
                </div>
                <div class="items">
                  <span class="labels">成分:</span>
                  <div class="contents">{{detail.component|filterMaterials}}</div>
                </div>
                <div class="items">
                  <span class="labels">规格:</span>
                  <div class="contents col"
                    style="align-items:flex-start">
                    <span style="white-space:nowrap;">{{detail.size.length>0?detail.size[0].size_name:''}}</span>
                    <span style="word-break: break-word;">{{detail.size.length>0?detail.size[0].size_info:''}}cm</span>
                  </div>
                </div>
                <div class="items">
                  <span class="labels">克重:</span>
                  <div class="contents">{{detail.size.length>0?detail.size[0].weight:''}}g</div>
                </div>
                <div class="items">
                  <span class="labels">颜色:</span>
                  <div class="contents">{{detail.color.length>0?detail.color[0].color_name:''}}</div>
                </div>
                <div class="items">
                  <span class="labels">描述:</span>
                  <div class="contents">
                    <span>{{detail.description || '无'}}</span>
                  </div>
                </div>
                <div class="items"
                  style="margin-top:30px;">
                  <div class="contents col">
                    <img :src="qrCodeUrl"
                      class="qrCode"
                      alt="">
                    <span class="littleBlack">{{$getTime()}}</span>
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
            <span class="label">样品编号：</span>
            <span class="text">
              <span v-if="!updateFlag">{{detail.sample_product_code}}</span>
              <el-input v-if="updateFlag"
                v-model="detail.sample_product_code"
                placeholder="请输入样品编号"
                style="height:32px;width:200px"></el-input>
              <el-tooltip class="item"
                effect="dark"
                content="修改的样品编号尽量不要重复以便于搜索"
                placement="top-start"
                v-if="!updateFlag">
                <span class="btn noBorder"
                  style="margin-left:12px;padding:0"
                  @click="updateFlag = true">点击修改</span>
              </el-tooltip>
              <span class="btn noBorder"
                style="margin-left:12px;padding:0"
                v-if="updateFlag"
                @click="saveProcode">确认修改</span>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">样品名称：</span>
            <span class="text"
              :class="{'blue':detail.name}">{{detail.name?detail.name:'无'}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">客户款号：</span>
            <span class="text"
              :class="{'blue':detail.style_code}">{{detail.style_code?detail.style_code:'无'}}</span>
          </div>
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
              <!-- <img v-for="(item,index) in detail.image"
                :key="index"
                :src="item.image_url" /> -->
              <el-image style="width:150px;height:150px;margin-right:16px"
                v-for="(item,index) in detail.image"
                :key="index"
                :src="item.image_url || ''"
                :preview-src-list="[item.image_url]">
              </el-image>
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
                  <span v-if="(!detail.craft_info||detail.craft_info.length===0)"
                    class="opration"
                    @click="$router.push('/craft/craftCreate/'+ $route.params.id + '/2')">添加</span>
                  <!-- <span v-if="(!detail.craft_info||detail.craft_info.length===0) &&detail.order_info.length === 0"
                    class="text"
                    style="color:#ccc">请先给样品添加样单</span> -->
                  <span v-if="detail.craft_info&&detail.craft_info.length>0"
                    class="opration"
                    @click="$router.push('/craft/craftDetail/'+ $route.params.id + '/2')">预览</span>
                  <span v-if="detail.craft_info&&detail.craft_info.length>0"
                    class="opration"
                    @click="openWin('/craftTable/'+ $route.params.id + '/2/' + detail.craft_info[craft_index].id)">打印</span>
                  <span v-if="detail.craft_info&&detail.craft_info.length>0"
                    class="opration"
                    @click="$router.push('/craft/craftDetail/'+ $route.params.id + '/2')">详情</span>
                  <span v-if="detail.craft_info&&detail.craft_info.length>0"
                    class="opration"
                    @click="$router.push('/craft/craftCreate/'+ $route.params.id + '/2')">添加</span>
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
                    :class="{'blue':detail.plan_info&&detail.plan_info.length>0,'gray':!detail.plan_info||detail.plan_info.length===0}">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">配料单</div>
                    <div class="text"
                      v-if="!detail.plan_info||detail.plan_info.length===0">待添加</div>
                    <div class="text"
                      v-if="detail.plan_info&&detail.plan_info.length>0">{{detail.plan_info[plan_index].user_name}}</div>
                    <div class="text"
                      v-if="detail.plan_info&&detail.plan_info.length>0">{{$getTime(detail.plan_info[plan_index].update_time)}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="!detail.plan_info||detail.plan_info.length===0"
                    class="opration"
                    @click="$router.push('/productPlan/productPlanCreate/'+ $route.params.id + '/2')">添加</span>
                  <span v-if="detail.plan_info&&detail.plan_info.length>0"
                    class="opration"
                    @click="$router.push('/productPlan/productPlanDetail/'+ $route.params.id + '/2')">预览</span>
                  <span v-if="detail.plan_info&&detail.plan_info.length>0"
                    class="opration"
                    @click="openWin('/productPlanTable/' + $route.params.id + '/2/' + detail.plan_info[plan_index].id)">打印</span>
                  <span v-if="detail.plan_info&&detail.plan_info.length>0"
                    class="opration"
                    @click="$router.push('/productPlan/productPlanDetail/'+ $route.params.id + '/2')">详情</span>
                  <span v-if="detail.plan_info&&detail.plan_info.length>0"
                    class="opration"
                    @click="$router.push('/productPlan/productPlanCreate/'+ $route.params.id + '/2')">添加</span>
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
                    class="opration"
                    @click="$router.push('/price/priceCreate?productId=' + $route.params.id + '&productType=2')">添加</span>
                  <span v-if="detail.quotation_info.length > 0"
                    class="opration"
                    @click="$router.push('/price/priceDetail/'+ (detail.quotation_info[quotation_index].pid || detail.quotation_info[quotation_index].id) + '?priceId=' + detail.quotation_info[quotation_index].id)">预览</span>
                  <span v-if="detail.quotation_info.length > 0"
                    class="opration"
                    @click="openWin('/pricePrintTable/' + detail.quotation_info[quotation_index].id )">打印</span>
                  <span v-if="detail.quotation_info.length > 0"
                    class="opration"
                    @click="$router.push('/price/priceDetail/'+ (detail.quotation_info[quotation_index].pid || detail.quotation_info[quotation_index].id) + '?priceId=' + detail.quotation_info[quotation_index].id)">详情</span>
                  <span v-if="detail.quotation_info.length > 0"
                    class="opration"
                    @click="$router.push('/price/priceCreate?productId=' + $route.params.id + '&productType=2')">添加</span>
                </div>
              </div>
              <div class="rect">
                <div class="tab"
                  v-if="detail.order_info.length>1">
                  <div class="circle"
                    :class="{'active':order_index===index-1}"
                    v-for="index in detail.order_info.length"
                    :key="index"
                    @click="order_index=index-1"></div>
                </div>
                <div class="main">
                  <div class="icon"
                    :class="{'green': detail.order_info.length > 0,'gray': detail.order_info.length===0}">
                    <img src="../../assets/image/sample/price_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">样单</div>
                    <div class="text"
                      v-if="detail.order_info.length ===0">待添加</div>
                    <div class="text"
                      v-if="detail.order_info.length > 0"
                      style="color:#1A95FF">{{detail.order_info.length>0?detail.order_info[order_index].order_code:''}}</div>
                    <div class="text"
                      v-if="detail.order_info.length > 0">{{detail.order_info.length>0?detail.order_info[order_index].order_time:''}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="detail.order_info.length===0"
                    class="opration"
                    @click="$router.push('/sample/sampleOrderCreate?productId=' + $route.params.id)">添加</span>
                  <!-- <span v-if="detail.order_info.length > 0"
                    class="opration"
                    @click="$router.push('/price/priceDetail/'+detail.order_info[order_index].id)">预览</span> -->
                  <!-- <span v-if="detail.order_info.length > 0"
                    class="opration"
                    @click="openWin('/pricePrintTable/' + detail.order_info[order_index].id )">打印</span> -->
                  <span v-if="detail.order_info.length > 0"
                    class="opration"
                    @click="$router.push('/sample/sampleOrderDetail/' + (detail.order_info[order_index].pid || detail.order_info[order_index].id))">详情</span>
                  <!-- <span v-if="detail.order_info.length > 0"
                    class="opration"
                    @click="$router.push('/sample/sampleOrderCreate?productId=' + $route.params.id)">添加</span> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">关联产品：</div>
            <!-- <div class="text"> -->
            <div class="tableCtnLv2">
              <div class="tb_header">
                <span class="tb_row middle">产品编号</span>
                <span class="tb_col"
                  style="flex:4">
                  <span class="tb_col_item">
                    <span class="tb_row middle">工艺单编号</span>
                    <span class="tb_row middle">配料单编号</span>
                    <span class="tb_row middle">操作时间</span>
                    <span class="tb_row middle">操作</span>
                  </span>
                </span>
              </div>
              <div class="tb_content"
                v-if="detail.related_product.length > 0">
                <span class="tb_row middle">{{detail.sample_product_code}}</span>
                <span class="tb_col"
                  style="flex:4">
                  <span class="tb_col_item"
                    v-for="(item,index) in detail.related_product"
                    :key="index">
                    <span class="tb_row middle">
                      <span class="tb_handle_btn blue"
                        v-if="item.craft_code"
                        @click="$router.push('/craft/craftDetail/' + item.product_id + '/1')">{{item.craft_code}}</span>
                      <span style="color:rgba(0,0,0,0.4)"
                        v-else>无</span>
                    </span>
                    <span class="tb_row middle">
                      <span class="tb_handle_btn blue"
                        v-if="item.material_match_id"
                        @click="$router.push('/productPlan/productPlanDetail/' + item.product_id + '/1')">{{item.material_match_id}}</span>
                      <span style=""
                        v-else>无</span>
                    </span>
                    <span class="tb_row middle">{{item.create_time}}</span>
                    <span class="tb_row middle">
                      <span class="tb_handle_btn blue"
                        @click="$router.push('/product/productDetail/' + item.product_id)">详情</span>
                    </span>
                  </span>
                </span>
              </div>
              <div class="tb_content"
                style="align-items:center;justify-content: center;">暂无</div>
            </div>
            <!-- </div> -->
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
            <span class="text">{{item.name}}</span>
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
                v-for="(itemChild,index) in item.size"
                :key="index">
                <span style="margin-right:8px">{{itemChild.size_name}}</span>
                <span style="margin-right:8px">{{itemChild.size_info}}cm</span>
                <span style="margin-right:8px">{{itemChild.weight}}g</span>
                <span style="color:#1A95FF">{{itemChild.number}}{{item.unit}}</span>
              </div>
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
                    :class="{'yellow':item.has_craft===1,'gray':item.has_craft!==1}">
                    <img src="../../assets/image/sample/craft_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">工艺单</div>
                    <div class="text"
                      v-if="item.need_weave===1 && item.has_craft!==1">待添加</div>
                    <div class="text"
                      v-if="item.need_weave===1 && item.has_craft===1">已添加</div>
                    <div class="text"
                      v-if="item.need_weave===0">不需要工艺单</div>
                  </div>
                </div>
                <div class="menu">
                  <span v-if="!detail.craft_info &&detail.order_info.length === 0"
                    class="text"
                    style="color:#ccc">请先给产品添加订单</span>
                  <span v-if="item.need_weave===1 && item.has_craft!==1"
                    class="opration"
                    @click="$router.push('/craft/craftCreate/'+ item.id + '/2')">添加</span>
                  <span v-if="item.need_weave===1 && item.has_craft===1"
                    class="opration"
                    @click="$router.push('/craft/craftDetail/'+ item.id + '/2')">预览</span>
                  <span v-if="item.need_weave===1 && item.has_craft===1"
                    class="opration"
                    @click="openWin('/craftTable/' + item.id +'/2/'+ detail.craft_info.id)">打印</span>
                  <span v-if="item.need_weave===1 && item.has_craft===1"
                    class="opration"
                    @click="$router.push('/craft/craftDetail/'+ item.id + '/2')">详情</span>
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
            @click="updatePro">修改</div>
          <div class="btn btnBlue"
            @click="$router.push('/sample/sampleCreate?sampleId='+$route.params.id)">复制此样品</div>
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
            <span class="info colCenter blue">{{detail.sample_product_code}}</span>
          </span>
          <span class="row">
            <span class="label">产品规格：</span>
            <span class="info">
              <el-checkbox :indeterminate="isIndeterminateSize"
                v-model="checkAllSize"
                @change="handleCheckAllSize">全选</el-checkbox>
              <el-checkbox-group v-model="checkedSize"
                @change="handleCheckSize">
                <el-checkbox v-for="size in detail.size"
                  :label="size.size_name"
                  :key="size.size_name">{{size.size_name}}</el-checkbox>
              </el-checkbox-group>
            </span>
          </span>
          <span class="row">
            <span class="label">产品配色：</span>
            <span class="info">
              <el-checkbox :indeterminate="isIndeterminateColor"
                v-model="checkAllColor"
                @change="handleCheckAllColor">全选</el-checkbox>
              <el-checkbox-group v-model="checkedColor"
                @change="handleCheckColor">
                <el-checkbox v-for="color in detail.color"
                  :label="color.color_name"
                  :key="color.color_name">{{color.color_name}}</el-checkbox>
              </el-checkbox-group>
              <!-- <el-checkbox                 :key="color.color_name + detail.color.filter(item=>item.checked).length"
                v-model="color.checked">{{color.color_name}}</el-checkbox> -->
            </span>
          </span>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="printFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="openTagPrint">去打印</div>
        </div>
      </div>
    </div>
    <opr-history :id="$route.params.id"
      type='sample'></opr-history>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { sample } from '@/assets/js/api.js'
import oprHistory from '../../components/oprHistory/oprHistory.vue'
export default {
  components: { oprHistory },
  data () {
    return {
      canSeeUpdate: false,
      updateFlag: false,
      loading: true,
      detail: {
        category_info: {
          product_category: '',
          name: ''
        },
        related_product: [],
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
        order_info: [],
        image: [],
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
      order_index: 0,
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
  methods: {
    saveProcode () {
      if (!this.detail.sample_product_code) {
        this.$message.error('请输入样品编号')
        return
      }
      this.loading = true
      sample.updateCode({
        id: this.$route.params.id,
        product_code: this.detail.sample_product_code,
        product_type: 2
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.updateFlag = false
          this.loading = false
        }
      })
    },
    noOpr () {
      this.$message.warning('暂未开放该功能')
    },
    openWin (url) {
      window.open(url)
    },
    handleCheckAllSize ($event) {
      this.isIndeterminateSize = false
      if ($event) {
        this.checkedSize = this.detail.size.map(item => item.size_name)
      } else {
        this.checkedSize = []
      }
    },
    handleCheckSize (event) {
      event = event || this.checkedSize
      if (event.length === this.detail.size.length) {
        this.checkAllSize = true
        this.isIndeterminateSize = false
      } else if (event.length === 0) {
        this.isIndeterminateSize = false
        this.checkAllSize = false
      } else {
        this.checkAllSize = false
        this.isIndeterminateSize = true
      }
    },
    handleCheckAllColor ($event) {
      this.isIndeterminateColor = false
      if ($event) {
        this.checkedColor = this.detail.color.map(item => item.color_name)
      } else {
        this.checkedColor = []
      }
    },
    handleCheckColor (event) {
      event = event || this.checkedColor
      if (event.length === this.detail.color.length) {
        this.checkAllColor = true
        this.isIndeterminateColor = false
      } else if (event.length === 0) {
        this.isIndeterminateColor = false
        this.checkAllColor = false
      } else {
        this.checkAllColor = false
        this.isIndeterminateColor = true
      }
    },
    openTagPrint () {
      this.printFlag = false
      if (this.checkedSize.length === 0) {
        this.$message.error('检测到未选择尺码规格')
        return
      }
      if (this.checkedColor.length === 0) {
        this.$message.error('检测到未选择配色')
        return
      }
      this.$openUrl('/tagSamplePrint/' + this.$route.params.id + '?size=' + this.checkedSize + '&color=' + this.checkedColor.map(itemM => this.$strToAscII(itemM, false, ['#', '&', '='])))
    },
    // 修改样品判断是否新建订单
    updatePro () {
      if (this.detail.order_info.length === 0) {
        this.$router.push('/sample/sampleUpdate/' + this.$route.params.id)
      } else {
        this.$confirm('该产品已有样单信息，请问您修改此样品的目的是?', '提示', {
          confirmButtonText: '修改已有订单的样品',
          cancelButtonText: '创建新样品订单',
          showClose: false,
          type: 'warning'
        }).then(() => {
          this.$router.push('/sample/sampleUpdate/' + this.$route.params.id)
        }).catch(() => {
          this.$router.push('/sample/sampleCreate?sampleId=' + this.$route.params.id)
          this.$message({
            showClose: true,
            type: 'success',
            message: '创建新样品订单需要创建一个新的样品以便后续操作，已为您复制了原有的样品信息'
          })
        })
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
        this.detail.size.forEach((itemSize, indexSize) => {
          if (indexSize === 0) {
            this.checkedSize.push(itemSize.size_name)
          }
        })
        this.detail.color.forEach((itemColor, indexColor) => {
          if (indexColor === 0) {
            this.checkedColor.push(itemColor.color_name)
          }
        })
        this.handleCheckSize()
        this.handleCheckColor()
        if (this.detail.image.length === 0) {
          this.detail.image = [{ image_url: require('@/assets/image/index/noPic.jpg') }]
        }
        if (!this.detail.quotation_info) {
          this.detail.quotation_info = []
        }
        // this.detail.related_product = this.$mergeData(this.detail.related_product, { mainRule: 'product_code', childrenName: 'other_info' })
        this.loading = false
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/sample/sampleDetail.less";
</style>
