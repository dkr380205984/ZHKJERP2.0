<template>
  <div id='packPlanDetailNew'
    class='indexMain'
    v-loading='loading'>
    <div class="listCutCtn">
      <div class="cut_item active">
        <span class="icon packPlan"></span>
        <span class="name">装箱计划</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/packPlan/packOrderDetail/' + $route.params.id)">
        <span class="icon packOrder"></span>
        <span class="name">包装订购</span>
      </div>
      <!-- <div class="cut_item"
        @click="$router.push('/packPlan/packStock/' + $route.params.id)">
        <span class="icon packOut"></span>
        <span class="name">销售出库</span>
      </div> -->
    </div>
    <div class="module">
      <div class="titleCtn"
        style="justify-content:start">
        <div class="title">
          订单信息
          <zh-message :msgSwitch="msgSwitch"
            :url="msgUrl"
            :content="msgContent"
            :afterSend="$winReload"></zh-message>
        </div>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="btnCtn">
            <div class="btn btnBlue"
              @click="addNewPlan()">新增装箱单</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
            <span class="text">{{orderInfo.client_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{orderInfo.order_time}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">发货批次：</span>
            <span class="text">
              <zh-batch :data='orderInfo.order_batch'></zh-batch>
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
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">装箱资料：</span>
            <span class="text"></span>
          </div>
        </div>
        <div class="rowCtn">
          <el-tabs v-model="activePlanId"
            @tab-click='tabClick'
            style="width:100%">
            <el-tab-pane :label="'装箱计划单' + chinaNum[indexTb]"
              v-for="(itemTb,indexTb) in planTb"
              :key="indexTb"
              :name="itemTb.id.toString()"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">装箱信息</div>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="btn btnWhiteBlue"
              style="margin:0"
              @click="createPopupData">+添加进仓单</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="flexTb">
            <span class="leftBtn el-icon-d-arrow-left"
              style="left:160px"
              v-if="canShow('scroll_row','scroll_item','left')"
              @mousedown="scrollX('scroll_row','scroll_item',false)"
              @mouseup="timer = false"></span>
            <span class="rightBtn el-icon-d-arrow-right"
              v-if="canShow('scroll_row','scroll_item','right')"
              @mousedown="scrollX('scroll_row','scroll_item',true)"
              @mouseup="timer = false"></span>
            <div class="thead"
              v-for="item in 1"
              :key="item">
              <!-- 这里用v-for是因为直接绑定ref时 下方body v-for中ref会覆盖掉head中的ref 导致滚动时 head 不去滚动 -->
              <span class="trow">
                <span class="tcolumn w40 center">
                  <el-checkbox @change="checkedAll"></el-checkbox>
                </span>
                <span class="tcolumn w120 center row"> 装箱类型 </span>
                <span class="scroll_row flex14"
                  ref="scroll_row">
                  <span class="scroll_item"
                    ref="scroll_item">
                    <span class="tcolumn flex5 noPad">
                      <span class="trow">
                        <span class="tcolumn flex18">产品</span>
                        <span class="tcolumn flex18">尺码/颜色</span>
                        <span class="tcolumn flex08 right">袋装<br />(件/袋)</span>
                        <span class="tcolumn flex08 right">袋箱数量<br />(袋/箱)</span>
                        <span class="tcolumn flex08 right">总数量<br />(件)</span>
                      </span>
                    </span>
                    <span class="tcolumn center flex08">箱号</span>
                    <span class="tcolumn flex08 right">箱数<br />(箱)</span>
                    <span class="tcolumn flex08 right">每箱毛重<br />(kg)</span>
                    <span class="tcolumn flex08 right">总毛重<br />(kg)</span>
                    <span class="tcolumn flex08 right">每箱净重<br />(kg)</span>
                    <span class="tcolumn flex08 right">总净重<br />(kg)</span>
                    <span class="tcolumn flex18">长*宽*高<br />(cm)</span>
                    <span class="tcolumn flex08 right">单箱体积<br />(m³)</span>
                    <span class="tcolumn flex08 right">总体积<br />(m³)</span>
                    <span class="tcolumn flex18">备注</span>
                  </span>
                </span>
              </span>
            </div>
            <div class="tbody">
              <span class="trow"
                v-for="(itemType,indexType) in totalPlanPackInfo"
                :key="indexType">
                <span class="tcolumn w40 center">
                  <el-checkbox v-model="itemType.checked"
                    @change="checkedItem(itemType)"
                    :disabled="!itemType.isCommit"
                    title="仅能勾选已提交的数据"></el-checkbox>
                </span>
                <span class="tcolumn w120 green center row">
                  装箱类型{{chinaNum[indexType]}}
                </span>
                <span class="scroll_row flex14"
                  ref="scroll_row">
                  <span class="scroll_item"
                    ref="scroll_item">
                    <span class="tcolumn flex5 noPad">
                      <span class="trow"
                        v-for="(itemPro,indexPro) in itemType.product_info"
                        :key="indexPro">
                        <span class="tcolumn flex18">{{itemPro.product_code}}<br />{{itemPro.type}}</span>
                        <span class="tcolumn flex18">{{itemPro.sizeColorName.join('/')}}</span>
                        <span class="tcolumn flex08 right">{{itemPro.bags_number}}</span>
                        <span class="tcolumn flex08 right">{{itemPro.box_number}}</span>
                        <span class="tcolumn flex08 right">{{itemPro.total_number}}</span>
                      </span>
                    </span>
                    <span class="tcolumn center flex08">{{itemType.first_box + '~' + itemType.last_box}}</span>
                    <span class="tcolumn flex08 right">{{itemType.total_box_number}}</span>
                    <span class="tcolumn flex08 right">{{itemType.gross_weight}}</span>
                    <span class="tcolumn flex08 right">{{itemType.total_gross_weight}}</span>
                    <span class="tcolumn flex08 right">{{itemType.net_weight}}</span>
                    <span class="tcolumn flex08 right">{{itemType.total_net_weight}}</span>
                    <span class="tcolumn flex18">{{[itemType.long,itemType.width,itemType.height].join('*')}}</span>
                    <span class="tcolumn flex08 right">{{itemType.vol_number}}</span>
                    <span class="tcolumn flex08 right">{{itemType.total_vol}}</span>
                    <span class="tcolumn flex18">{{itemType.remark}}</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="rowCtn col"
          v-for="(itemType,indexType) in planPackInfo"
          :key="indexType">
          <span class="label">装箱类型{{chinaNum[indexType]}}
            <span class="tbBtn red"
              style="font-size:16px"
              @click="deleteItem(planPackInfo,indexType)">删除</span>
          </span>
          <div class="flexTb">
            <span class="leftBtn el-icon-d-arrow-left"
              v-if="canShow('scroll_row'+ indexType,'scroll_item'+ indexType,'left')"
              @mousedown="scrollX('scroll_row' + indexType,'scroll_item' + indexType,false)"
              @mouseup="timer = false"></span>
            <span class="rightBtn el-icon-d-arrow-right"
              v-if="canShow('scroll_row'+ indexType,'scroll_item'+ indexType,'right')"
              @mousedown="scrollX('scroll_row' + indexType,'scroll_item' + indexType,true)"
              @mouseup="timer = false"></span>
            <div class="thead">
              <span class="trow">
                <span class="tcolumn w120 center">操作</span>
                <span class="scroll_row flex14"
                  :ref="'scroll_row' + indexType">
                  <span class="scroll_item"
                    :ref="'scroll_item' + indexType">
                    <span class="tcolumn flex5 noPad">
                      <span class="trow">
                        <span class="tcolumn flex18">产品</span>
                        <span class="tcolumn flex18">尺码/颜色</span>
                        <span class="tcolumn flex08 right">袋装<br />(件/袋)</span>
                        <span class="tcolumn flex08 right">袋箱数量<br />(袋/箱)</span>
                        <span class="tcolumn flex08 right">总数量<br />(件)</span>
                      </span>
                    </span>
                    <span class="tcolumn center flex08">箱号</span>
                    <span class="tcolumn flex08 right">箱数<br />(箱)</span>
                    <span class="tcolumn flex08 right">每箱毛重<br />(kg)</span>
                    <span class="tcolumn flex08 right">总毛重<br />(kg)</span>
                    <span class="tcolumn flex08 right">每箱净数<br />(kg)</span>
                    <span class="tcolumn flex08 right">总净重<br />(kg)</span>
                    <span class="tcolumn flex18 center">长*宽*高<br />(cm)</span>
                    <span class="tcolumn flex08 right">单箱体积<br />(m³)</span>
                    <span class="tcolumn flex08 right">总体积<br />(m³)</span>
                    <span class="tcolumn flex18">备注</span>
                  </span>
                </span>
              </span>
            </div>
            <div class="tbody">
              <span class="trow">
                <span class="tcolumn w120 center">
                  <span class="blue tbBtn"
                    @click="addItem(itemType.product_info,'product')">新增行</span>
                  <span class="red tbBtn"
                    @click="deleteItem(itemType.product_info)">删除行</span>
                </span>
                <span class="scroll_row flex14"
                  :ref="'scroll_row' + indexType">
                  <span class="scroll_item"
                    :ref="'scroll_item' + indexType">
                    <span class="tcolumn flex5 noPad">
                      <span class="trow"
                        v-for="(itemPro,indexPro) in itemType.product_info"
                        :key="indexPro">
                        <span class="tcolumn flex18">
                          <el-select v-model="itemPro.product_id"
                            class="inputs"
                            placeholder="请选择产品"
                            @change="changeSizeColorArr(itemPro)">
                            <el-option v-for="item in productList"
                              :key="item.product_id"
                              :label="item.product_code + '(' + [item.category_info.category_name, item.category_info.type_name, item.category_info.style_name].join('/') + ')'"
                              :value="item.product_id">
                            </el-option>
                          </el-select>
                        </span>
                        <span class="tcolumn flex18">
                          <el-cascader v-model="itemPro.sizeColor"
                            placeholder="尺码/颜色"
                            class="inputs"
                            :options="itemPro.sizeColorArr"
                            :props="{ expandTrigger: 'hover' }"></el-cascader>
                        </span>
                        <span class="tcolumn flex08 right">
                          <zh-input placeholder='数量'
                            v-model="itemPro.bags_number"
                            class="inputs noborderType right"
                            @input="changeBagsBoxNumber(itemPro,itemType)"
                            type='number'></zh-input>
                        </span>
                        <span class="tcolumn flex08 right">
                          <zh-input placeholder='数量'
                            v-model="itemPro.box_number"
                            class="inputs noborderType right"
                            @input="changeBagsBoxNumber(itemPro,itemType)"
                            type='number'></zh-input>
                        </span>
                        <span class="tcolumn flex08 right">
                          <!-- <zh-input placeholder='数量'
                            v-model="itemPro.total_number"
                            class="inputs noborderType right"
                            @input="changeBagsBoxNumber(itemPro)"
                            type='number'></zh-input> -->
                          {{itemPro.total_number || 0}}
                        </span>
                      </span>
                    </span>
                    <span class="tcolumn center flex08 row">
                      <zh-input placeholder='首箱号'
                        v-model="itemType.first_box"
                        class="inputs noborderType center"
                        @input="changeBoxNumber(itemType)"
                        type='number'></zh-input>
                      <span style="margin:0 8px">~</span>
                      <zh-input placeholder='末箱号'
                        v-model="itemType.last_box"
                        class="inputs noborderType center"
                        @input="changeBoxNumber(itemType)"
                        type='number'></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      <zh-input placeholder='数量'
                        v-model="itemType.total_box_number"
                        @input="changeTotalBoxNumber(itemType)"
                        class="inputs noborderType right"
                        type='number'></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      <zh-input placeholder='数量'
                        v-model="itemType.gross_weight"
                        class="inputs noborderType right"
                        @input="changeGrossWeight(itemType)"
                        type='number'></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      <!-- <zh-input placeholder='数量'
                        v-model="itemType.total_gross_weight"
                        class="inputs noborderType right"
                        type='number'></zh-input> -->
                      {{itemType.total_gross_weight || 0}}
                    </span>
                    <span class="tcolumn flex08 right">
                      <zh-input placeholder='数量'
                        v-model="itemType.net_weight"
                        class="inputs noborderType right"
                        @input="changeNetWeight(itemType)"
                        type='number'></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      <!-- <zh-input placeholder='数量'
                        v-model="itemType.total_net_weight"
                        class="inputs noborderType right"
                        type='number'></zh-input> -->
                      {{itemType.total_net_weight || 0}}
                    </span>
                    <span class="tcolumn flex18 row">
                      <zh-input placeholder='数量'
                        v-model="itemType.long"
                        class="inputs noborderType center"
                        type='number'
                        @input="compVol(itemType)"></zh-input>
                      <span style="margin:0 8px">*</span>
                      <zh-input placeholder='数量'
                        v-model="itemType.width"
                        class="inputs noborderType center"
                        type='number'
                        @input="compVol(itemType)"></zh-input>
                      <span style="margin:0 8px">*</span>
                      <zh-input placeholder='数量'
                        v-model="itemType.height"
                        class="inputs noborderType center"
                        type='number'
                        @input="compVol(itemType)"></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      <zh-input placeholder='体积'
                        v-model="itemType.vol_number"
                        class="inputs noborderType center"
                        type='number'
                        @input="compTotalVol(itemType)"></zh-input>
                    </span>
                    <span class="tcolumn flex08 right">
                      {{itemType.total_vol || 0}}
                    </span>
                    <span class="tcolumn flex18">
                      <zh-input placeholder='备注'
                        v-model="itemType.remark"
                        class="inputs noborderType"></zh-input>
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="rowCtn col">
          <div class="addRows">
            <div class="once"
              @click="addItem(planPackInfo,'type')">+添加装箱类型</div>
          </div>
        </div>
        <div class="rowCtn col">
          <span class="label">其他备注</span>
          <el-input type="textarea"
            :autosize="{ minRows: 5, maxRows: 8}"
            placeholder="请输入内容"
            v-model="remark">
          </el-input>
        </div>
        <div class="rowCtn col">
          <span class="label">包装资料</span>
          <el-upload class="upload"
            multiple
            action="https://upload.qiniup.com/"
            :before-upload="beforeAvatarUpload"
            :data="postData"
            ref="packagUpload"
            :file-list="file_arr"
            list-type="picture">
            <div class="uploadBtn">
              <i class="el-icon-upload"></i>
              <span>上传文件</span>
            </div>
            <div slot="tip"
              class="el-upload__tip">上传的文件不可超过10M</div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showPopup">
      <div class="main"
        style="width:800px">
        <div class="title">
          <span class="text">添加进仓单</span>
          <span class="el-icon-close"
            @click="showPopup = false"></span>
        </div>
        <div class="content"
          style="max-height:600px">
          <div class="row">
            <span class="label">订单编号：</span>
            <span class="info">
              <zh-input v-model="popupData.order_code"
                disabled></zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">出货日期：</span>
            <span class="info">
              <el-date-picker v-model="popupData.out_time"
                value-format="yyyy-MM-dd"
                style="width:100%"
                type="date"
                placeholder="选择出货日期">
              </el-date-picker>
            </span>
          </div>
          <div class="row">
            <span class="label">运输地址：</span>
            <span class="info">
              <el-select v-model="popupData.address_city"
                style="width:180px"
                placeholder="请选择城市">
                <el-option v-for="item in cityArr"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
              <zh-input v-model="popupData.address_sup"
                placeholder="请输入详细地址"
                style="margin-left:16px"></zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">总件数：</span>
            <span class="info">
              <zh-input v-model="popupData.total_number"
                placeholder="总件数(件)"
                style="flex:1">
                <template slot="append">件</template>
              </zh-input>
              <span class="label">总毛重：</span>
              <zh-input v-model="popupData.total_gross_weight"
                placeholder="总毛重(kg)"
                style="flex:1">
                <template slot="append">kg</template>
              </zh-input>
              <span class="label">总体积：</span>
              <zh-input v-model="popupData.total_vol"
                placeholder="总体积(m³)"
                style="flex:1">
                <template slot="append">m³</template>
              </zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">备注信息：</span>
            <span class="info">
              <el-input type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="popupData.remark">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">相关文件：</span>
            <span class="info">
              <el-upload class="upload"
                multiple
                action="https://upload.qiniup.com/"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                ref="popupUpload"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">上传的文件不可超过10M</div>
              </el-upload>
            </span>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="showPopup = false">取消</div>
          <div class="btn btnBlue"
            @click="createWarehouse">提交</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="$openUrl('/packPlanTable/' + $route.params.id + '/' + activePlanId)">打印</div>
          <div class="btn btnBlue"
            @click="savePackPlan">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { order, getToken, packPlan, warehouse } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      timer: true, // 长按按钮判断是否继续滑动
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      chinaNum: chinaNum,
      orderInfo: {},
      productList: [],
      planTb: [],
      activePlanId: '',
      planPackInfo: [
        {
          product_info: [
            {
              product_id: '',
              sizeColorArr: [],
              sizeColor: [],
              bags_number: '',
              box_number: '',
              total_number: ''
            }
          ],
          first_box: '',
          last_box: '',
          total_box_number: '',
          gross_weight: '',
          total_gross_weight: '',
          net_weight: '',
          total_net_weight: '',
          long: '',
          width: '',
          height: '',
          vol_number: '',
          total_vol: '',
          remark: ''
        }
      ],
      remark: '',
      postData: { token: '' },
      file_arr: [],
      // 进仓单弹窗数据
      showPopup: false,
      popupData: {
        order_code: '',
        order_id: '',
        out_time: '',
        address_city: '上海市',
        address_sup: '',
        total_number: '',
        total_gross_weight: '',
        total_vol: '',
        remark: '',
        file_url: []
      },
      cityArr: [
        { value: '上海市' },
        { value: '杭州市' },
        { value: '宁波市' },
        { value: '义乌市' }
      ]
    }
  },
  methods: {
    // 计算单个体积
    compVol (item) {
      let long = item.long / 100
      let width = item.width / 100
      let height = item.height / 100
      item.vol_number = (long * width * height || 0).toFixed(4)
      this.compTotalVol(item)
    },
    // 计算总体积
    compTotalVol (item) {
      item.total_vol = (item.vol_number * item.total_box_number || 0).toFixed(4)
    },
    // 改变总箱数
    changeTotalBoxNumber (item) {
      item.product_info.forEach(itemF => {
        itemF.total_number = (itemF.bags_number || 0) * (itemF.box_number || 0) * (item.total_box_number || 0)
      })
      this.changeNetWeight(item)
      this.changeGrossWeight(item)
      this.compTotalVol(item)
    },
    // 改变净重
    changeNetWeight (item) {
      item.total_net_weight = this.$toFixed((item.net_weight || 0) * (item.total_box_number || 0))
    },
    // 改变毛重
    changeGrossWeight (item) {
      item.total_gross_weight = this.$toFixed((item.gross_weight || 0) * (item.total_box_number || 0))
    },
    // 改变首箱号和末箱号
    changeBoxNumber (item) {
      item.total_box_number = this.$toFixed((item.last_box || 0) - (item.first_box || 0) + 1)
      item.product_info.forEach(itemF => {
        itemF.total_number = (itemF.bags_number || 0) * (itemF.box_number || 0) * (item.total_box_number || 0)
      })
      this.compTotalVol(item)
    },
    // 改变袋装数量与箱装数量时
    changeBagsBoxNumber (item, itemP) {
      item.total_number = (item.bags_number || 0) * (item.box_number || 0) * (itemP.total_box_number || 0)
    },
    // 选择产品后切换尺码颜色数据
    changeSizeColorArr (item) {
      let flag = this.productList.find(itemF => itemF.product_id === item.product_id)
      item.sizeColor = []
      item.sizeColorArr = []
      if (flag) {
        item.sizeColorArr = flag.size.map(itemS => {
          return {
            value: itemS.size_id,
            label: itemS.size_name,
            children: flag.color.map(itemC => {
              return {
                value: itemC.color_id,
                label: itemC.color_name
              }
            })
          }
        })
      }
    },
    // 点击左右滑动按钮
    scrollX (per, son, bool) {
      // let perItem = document.getElementsByClassName(per)
      let perItem = this.$refs[per]
      let perWidth = perItem[0].offsetWidth
      // let sonDom = document.getElementsByClassName(son)
      let sonDom = this.$refs[son]
      let sonWidth = sonDom[0].offsetWidth
      let flag = true
      for (let index = 0; index < sonDom.length; index++) {
        let item = sonDom[index]
        let maxLeft = perWidth - sonWidth
        let left = parseInt(item.style.left) || 0
        let number = bool ? left - 20 : left + 20
        item.style.left = ((number > 0) ? 0 : ((number < maxLeft) ? maxLeft : number)) + 'px'
        if (((number > 0) ? 0 : ((number < maxLeft) ? maxLeft : number)) === 0 || ((number > 0) ? 0 : ((number < maxLeft) ? maxLeft : number)) === maxLeft) {
          flag = false
        }
      }
      if (this.timer && flag) {
        window.requestAnimationFrame(() => {
          this.scrollX(per, son, bool)
        })
      } else {
        this.timer = true
      }
      this.$forceUpdate() // 为了触发左右按钮是否显示函数
    },
    // 判断是否显示左右滑动按钮
    canShow (per, son, dir) {
      // let perDom = document.getElementsByClassName(per)[0]
      // let sonDom = document.getElementsByClassName(son)[0]
      let perDom = this.$refs[per] ? this.$refs[per][0] : undefined
      let sonDom = this.$refs[son] ? this.$refs[son][0] : undefined
      if (!perDom || !sonDom) {
        if (dir === 'right') {
          return true
        } else {
          return false
        }
      }
      let maxLeft = perDom.offsetWidth - sonDom.offsetWidth
      let sonDomLeft = parseInt(sonDom.style.left) || 0
      if (dir === 'left' && sonDomLeft !== 0) {
        return true
      } else if (dir === 'right' && sonDomLeft !== maxLeft) {
        return true
      }
    },
    addItem (item, type) {
      if (type === 'product') {
        item.push({
          product_id: '',
          sizeColorArr: [],
          sizeColor: [],
          bags_number: '',
          box_number: '',
          total_number: ''
        })
      } else if (type === 'type') {
        item.push({
          product_info: [
            {
              product_id: '',
              sizeColorArr: [],
              sizeColor: [],
              bags_number: '',
              box_number: '',
              total_number: ''
            }
          ],
          first_box: '',
          last_box: '',
          total_box_number: '',
          gross_weight: '',
          total_gross_weight: '',
          net_weight: '',
          total_net_weight: '',
          long: '',
          width: '',
          height: '',
          vol_number: '',
          total_vol: '',
          remark: ''
        })
      }
    },
    deleteItem (item, index) {
      if (index === 0 || index) {
        item.splice(index, 1)
      } else {
        item.pop()
      }
    },
    beforeAvatarUpload (file) {
      // let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      // let fileNameLength = file.name.length// 取到文件名长度
      // let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = file.name
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 10MB!')
        return false
      }
    },
    savePackPlan () {
      if (this.$submitLock()) {
        return
      }
      let flag = {
        product_id: true,
        size_id: true,
        color_id: true,
        bags_number: true,
        box_number: true,
        total_number: true,
        first_box: true,
        last_box: true,
        total_box_number: true,
        gross_weight: true,
        total_gross_weight: true,
        net_weight: true,
        total_net_weight: true,
        long: true,
        width: true,
        height: true,
        vol: true
      }
      let packInfo = []
      this.planPackInfo.forEach((itemPlan, indexPlan) => {
        itemPlan.product_info.forEach(itemPro => {
          if (!itemPro.product_id) {
            flag.product_id = false
          }
          if (!itemPro.sizeColor[0]) {
            flag.size_id = false
          }
          if (!itemPro.sizeColor[1]) {
            flag.color_id = false
          }
          if (!itemPro.bags_number) {
            flag.bags_number = false
          }
          if (!itemPro.box_number) {
            flag.box_number = false
          }
          if (!itemPro.total_number) {
            flag.total_number = false
          }
          packInfo.push({
            pack_type: indexPlan,
            product_id: itemPro.product_id,
            size_id: itemPro.sizeColor[0],
            color_id: itemPro.sizeColor[1],
            quantity_bag: itemPro.bags_number,
            quantity_chest: itemPro.box_number,
            quantity_total: itemPro.total_number,
            chest_number: [itemPlan.first_box, itemPlan.last_box].join(','),
            chest_quantity: itemPlan.total_box_number,
            gross_weight_chest: itemPlan.gross_weight,
            gross_weight_total: itemPlan.total_gross_weight,
            net_weight_chest: itemPlan.net_weight,
            net_weight_total: itemPlan.total_net_weight,
            extent_width_height: [itemPlan.long, itemPlan.width, itemPlan.height].join(','),
            bulk: itemPlan.vol_number,
            total_bulk: itemPlan.total_vol,
            desc: itemPlan.remark
          })
        })
        if (!itemPlan.first_box) {
          flag.first_box = false
        }
        if (!itemPlan.last_box) {
          flag.last_box = false
        }
        if (!itemPlan.total_box_number) {
          flag.total_box_number = false
        }
        if (!itemPlan.gross_weight) {
          flag.gross_weight = false
        }
        if (!itemPlan.total_gross_weight) {
          flag.total_gross_weight = false
        }
        if (!itemPlan.net_weight) {
          flag.net_weight = false
        }
        if (!itemPlan.total_net_weight) {
          flag.total_net_weight = false
        }
        if (!itemPlan.long) {
          flag.long = false
        }
        if (!itemPlan.width) {
          flag.width = false
        }
        if (!itemPlan.height) {
          flag.height = false
        }
        if (!itemPlan.vol_number) {
          flag.vol = false
        }
        if (!itemPlan.total_vol) {
          flag.vol = false
        }
      })
      if (!flag.product_id) {
        this.$message({
          type: 'error',
          message: '检测到有未选择的产品的装箱类型'
        })
        return
      }
      if (!flag.size_id) {
        this.$message({
          type: 'error',
          message: '检测到有未选择的产品尺码的装箱类型'
        })
        return
      }
      if (!flag.color_id) {
        this.$message({
          type: 'error',
          message: '检测到有未选择的产品色组的装箱类型'
        })
        return
      }
      if (!flag.bags_number) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的袋装数'
        })
        return
      }
      if (!flag.box_number) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的袋装箱数'
        })
        return
      }
      if (!flag.total_number) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的总件数'
        })
        return
      }
      if (!flag.first_box) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的首箱号'
        })
        return
      }
      if (!flag.last_box) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的末箱号'
        })
        return
      }
      if (!flag.total_box_number) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的总箱数'
        })
        return
      }
      if (!flag.gross_weight) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的每箱毛重'
        })
        return
      }
      if (!flag.total_gross_weight) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的总毛重'
        })
        return
      }
      if (!flag.net_weight) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的每箱净重'
        })
        return
      }
      if (!flag.total_net_weight) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的总净重'
        })
        return
      }
      if (!flag.long || !flag.width || !flag.height) {
        this.$message({
          type: 'error',
          message: '检测到有未填写完整的规格'
        })
        return
      }
      if (!flag.vol) {
        this.$message({
          type: 'error',
          message: '检测到有未填写的体积'
        })
        return
      }
      let fileArr = this.$refs.packagUpload.uploadFiles.map((item) => { return (!item.response ? item.url : ('https://zhihui.tlkrzf.com/' + item.response.key)) })
      packPlan.create({
        id: this.activePlanId === 'null' ? null : this.activePlanId,
        order_id: this.$route.params.id,
        file_url: fileArr,
        desc: this.remark,
        pack_info: packInfo
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('保存成功')
          this.init()
        }
      })
    },
    init () {
      this.loading = true
      Promise.all([
        order.editDetail({
          id: this.$route.params.id
        }),
        getToken(),
        packPlan.detail({
          order_id: this.$route.params.id
        })
      ]).then(res => {
        // 初始化产品信息 订单信息
        this.orderInfo = res[0].data.data
        let productList = []
        this.orderInfo.order_batch.forEach(itemBatch => {
          itemBatch.product_info.forEach(itemPro => {
            productList.push({
              product_id: itemPro.product_id,
              size: itemPro.all_size,
              color: itemPro.all_color,
              image: itemPro.image,
              product_code: itemPro.product_code,
              category_info: itemPro.category_info
            })
          })
        })
        this.productList = this.$unique(productList, 'product_id').map(itemPro => {
          let sizeColor = itemPro.size.map(itemSize => {
            return {
              label: itemSize.size_name,
              value: itemSize.size_id,
              children: itemPro.color.map(itemColor => {
                return {
                  label: itemColor.color_name,
                  value: itemColor.color_id
                }
              })
            }
          })
          return {
            ...itemPro,
            sizeColor: sizeColor
          }
        })
        // 初始化token
        this.postData.token = res[1].data.data
        // 初始化计划数据
        this.planTb = res[2].data.data.map(itemM => {
          return {
            id: itemM.id,
            remark: itemM.desc,
            create_at: itemM.created_at,
            file_url: itemM.file_url,
            packPlanInfo: this.$mergeData(itemM.pack_info, { mainRule: 'pack_type', otherRule: [{ name: 'chest_number' }, { name: 'chest_quantity' }, { name: 'gross_weight_chest' }, { name: 'gross_weight_total' }, { name: 'net_weight_chest' }, { name: 'net_weight_total' }, { name: 'extent_width_height' }, { name: 'bulk' }, { name: 'total_bulk' }, { name: 'desc' }], childrenName: 'product_info' }).map(itemType => {
              return {
                product_info: itemType.product_info.map(itemPro => {
                  let flag = this.productList.find(itemF => +itemF.product_id === +itemPro.product_id)
                  return {
                    product_id: itemPro.product_id,
                    sizeColorArr: flag ? flag.sizeColor : [],
                    sizeColor: [itemPro.size_id, itemPro.color_id],
                    bags_number: itemPro.quantity_bag,
                    box_number: itemPro.quantity_chest,
                    total_number: itemPro.quantity_total
                  }
                }),
                first_box: itemType.chest_number.split(',')[0],
                last_box: itemType.chest_number.split(',')[1],
                total_box_number: itemType.chest_quantity,
                gross_weight: itemType.gross_weight_chest,
                total_gross_weight: itemType.gross_weight_total,
                net_weight: itemType.net_weight_chest,
                total_net_weight: itemType.net_weight_total,
                long: itemType.extent_width_height ? itemType.extent_width_height.split(',')[0] : '',
                width: itemType.extent_width_height ? itemType.extent_width_height.split(',')[1] : '',
                height: itemType.extent_width_height ? itemType.extent_width_height.split(',')[2] : '',
                remark: itemType.desc,
                vol_number: itemType.bulk,
                total_vol: itemType.total_bulk,
                isCommit: true
              }
            })
          }
        })
        if (this.planTb.length === 0) {
          this.addNewPlan()
        }
        this.catTb(0)
        this.loading = false
        this.$forceUpdate()
      })
    },
    catTb (index) {
      let item = this.planTb[index]
      this.remark = item.remark
      this.activePlanId = item.id.toString()
      this.file_arr = item.file_url.map(itemM => {
        return {
          name: itemM.replace('https://zhihui.tlkrzf.com/', ''),
          url: itemM
        }
      })
      this.planPackInfo = item.packPlanInfo
    },
    addNewPlan () {
      if (this.planTb.find(itemF => itemF.id === 'null')) {
        this.$message.warning('检测到已有一张在添加的计划单，请先提交')
        return
      }
      this.planTb.push({
        id: 'null',
        remark: '',
        file_url: [],
        packPlanInfo: []
      })
      this.catTb(this.planTb.length - 1)
    },
    tabClick (tab, event) {
      this.catTb(tab.index)
    },
    checkedAll (e) {
      this.totalPlanPackInfo.forEach(item => {
        if (item.isCommit) {
          item.checked = e
        }
      })
      this.$forceUpdate()
    },
    checkedItem (itemType) {
      if (!itemType.isCommit) {
        this.$message.warning('请先提交修改在勾选')
        itemType.checked = false
      }
      this.$forceUpdate()
    },
    createPopupData () {
      let checkedData = this.totalPlanPackInfo.filter(itemF => itemF.checked).map(itemM => {
        return {
          number: itemM.total_box_number,
          gross_weight: (+itemM.total_gross_weight || 0),
          vol_number: (+itemM.total_vol || 0)
        }
      })
      // if (checkedData.length === 0) {
      //   this.$message.warning('请先勾选最少一项')
      //   return
      // }
      this.popupData = {
        order_code: this.orderInfo.order_code,
        order_id: this.orderInfo.id,
        out_time: '',
        address_city: '上海市',
        address_sup: '',
        total_number: this.$toFixed(checkedData.map(itemM => (+itemM.number || 0)).reduce((a, b) => {
          return a + b
        }, 0)),
        total_gross_weight: this.$toFixed(checkedData.map(itemM => (+itemM.gross_weight || 0)).reduce((a, b) => {
          return a + b
        }, 0)),
        total_vol: this.$toFixed(checkedData.map(itemM => (+itemM.vol_number || 0)).reduce((a, b) => {
          return a + b
        }, 0)),
        remark: '',
        file_url: []
      }
      this.showPopup = true
    },
    createWarehouse () {
      if (this.$submitLock()) {
        return
      }
      if (!this.popupData.out_time) {
        this.$message.error('请选择出货时间')
        return
      }
      if (!this.popupData.address_city) {
        this.$message.error('请选择运输城市')
        return
      }
      if (!this.popupData.total_number) {
        this.$message.error('请输入总件数')
        return
      }
      if (!this.popupData.total_gross_weight) {
        this.$message.error('请输入总毛重')
        return
      }
      if (!this.popupData.total_vol) {
        this.$message.error('请输入总体积')
        return
      }
      let fileUrl = this.$refs.popupUpload.uploadFiles.map((item) => { return (!item.response ? item.url : ('https://zhihui.tlkrzf.com/' + item.response.key)) })
      warehouse.create({
        order_id: this.popupData.order_id,
        complete_time: this.popupData.out_time,
        address: JSON.stringify([this.popupData.address_city, this.popupData.address_sup]),
        total_number: this.popupData.total_number,
        total_gross_weight: this.popupData.total_gross_weight,
        cubic_number: this.popupData.total_vol,
        desc: this.popupData.reamrk || '',
        file_url: fileUrl
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.showPopup = false
        }
      })
    }
  },
  created () {
    this.init()
  },
  computed: {
    totalPlanPackInfo () {
      return this.planPackInfo.map(itemType => {
        return {
          ...itemType,
          product_info: itemType.product_info.map(itemPro => {
            let flag = this.productList.find(itemF => itemF.product_id === itemPro.product_id)
            let flagSize = itemPro.sizeColorArr.find(itemF => itemF.value === itemPro.sizeColor[0])
            let flagColor = flagSize ? flagSize.children.find(itemF => itemF.value === itemPro.sizeColor[1]) : null
            return {
              ...itemPro,
              product_code: flag ? flag.product_code : '',
              type: flag ? [flag.category_info.category_name, flag.category_info.type_name, flag.category_info.style_name].join('/') : '',
              sizeColorName: flagSize && flagColor ? [flagSize.label, flagColor.label] : []
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/packPlan/packPlanDetailNew.less";
</style>
<style lang="less">
#packPlanDetailNew {
  .el-input__inner {
    height: 32px !important;
  }
  .greenInput {
    .el-tag {
      display: inline !important;
      padding: 0;
      border: 0px;
      background: transparent;
      &:nth-last-child(n + 2)::after {
        content: ",";
        color: #01b48c;
      }
      .el-select__tags-text {
        color: #01b48c;
      }
    }
  }
  .inputs {
    height: 32px !important;
    line-height: 32px !important;
    &.right {
      .zhInput {
        text-align: right;
      }
    }
    &.center {
      .zhInput {
        text-align: center;
      }
    }
    &.noborderType {
      height: 100% !important;
      .zhInputBox {
        height: 100% !important;
        .zhInput {
          height: inherit !important;
          border: none;
          padding: 0;
        }
      }
    }
  }
}
</style>
