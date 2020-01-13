<template>
  <div id='sampleOrderDetail'
    class='indexMain'
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="btnCtn">
            <el-menu mode="horizontal">
              <el-menu class="editMenu"
                mode="horizontal"
                @select="handleSelect">
                <el-submenu index="1"
                  popper-class='handleMenuSample'>
                  <template slot="title">操作</template>
                  <el-menu-item index="waitConfirm"
                    class="elMenuItem">待客户确认</el-menu-item>
                  <el-submenu index="1-2"
                    class="elMenuItem">
                    <template slot="title">已确认</template>
                    <el-menu-item index="change"
                      class="elMenuItem">继续打样</el-menu-item>
                    <el-menu-item index="ok"
                      class="elMenuItem">不继续打样</el-menu-item>
                    <el-menu-item index="addOrder"
                      class="elMenuItem">大货生产</el-menu-item>
                  </el-submenu>
                  <el-menu-item index="showCanclePopup"
                    class="elMenuItem">取消样单</el-menu-item>
                </el-submenu>
              </el-menu>
            </el-menu>
          </div>
          <div class="otherInfo">
            <div class="block">
              <span class="label">状态</span>
              <span class="text blue">进行中</span>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">标题：</span>
            <span class="text">{{sampleOrderInfo.title}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">系统编号：</span>
            <span class="text">666</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">样单公司：</span>
            <span class="text">{{sampleOrderInfo.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">联系人：</span>
            <span class="text">{{sampleOrderInfo.contacts}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">负责小组：</span>
            <span class="text">{{sampleOrderInfo.group_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建时间：</span>
            <span class="text">{{sampleOrderInfo.order_time}}</span>
          </div>
        </div>
        <div class="swichCtn">
          <div :class="{'swich':true,'active':activeId === cloneData.id}"
            @click="cutSampleOrder(cloneData.id)">一次打样</div>
          <div :class="{'swich':true,'active':activeId === item.id}"
            v-for="(item,index) in cloneData.child_data"
            :key="item.id"
            @click="cutSampleOrder(item.id)">{{chinaNum[index+1]}}次打样</div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">打样信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">客户确认：</span>
            <span class="text">待确认</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">样单类型：</span>
            <span class="text">{{sampleOrderInfo.type}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期：</span>
            <span class="text">{{sampleOrderInfo.deliver_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息</span>
            <span class="text">{{sampleOrderInfo.desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">打样信息</span>
      </div>
      <div class="detailCtn">
        <div class="flexTb">
          <div class="thead">
            <span class="trow">
              <span class="tcolumn">样品编号</span>
              <span class="tcolumn">产品图片</span>
              <span class="tcolumn">尺码/颜色</span>
              <span class="tcolumn">打样数量</span>
              <span class="tcolumn flex12">相关信息</span>
            </span>
          </div>
          <div class="tbody">
            <span class="trow"
              v-for="(itemPro,indexPro) in sampleOrderInfo.product_info"
              :key="indexPro">
              <span class="tcolumn">
                <div class="twoLineText">
                  <span>{{itemPro.product_info.product_code}}</span>
                  <span>{{itemPro.product_info|filterType}}</span>
                </div>
              </span>
              <span class="tcolumn middle">
                <span class="trow">
                  <zh-img-list :list="itemPro.product_info.images"></zh-img-list>
                </span>
              </span>
              <span class="tcolumn flex32">
                <span class="trow"
                  v-for="(itemSize,indexSize) in itemPro.size_info"
                  :key="indexSize">
                  <span class="tcolumn">{{itemSize.size + ' / ' + itemSize.color}}</span>
                  <span class="tcolumn">{{itemSize.numbers + itemPro.product_info.unit}}</span>
                  <span class="tcolumn flex12">
                    <span class="trow">
                      <span class="btn noBorder lineH54">工艺单</span>
                      <span class="btn noBorder lineH54">配料单</span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">流程进度</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="progress_box">
            <div class="progress_contact"
              :style="{width:timeProgressInfo.find(itemTime=>itemTime.name === '今天') ? timeProgressInfo.find(itemTime=>itemTime.name === '今天').prog + '%' : 0}"></div>
            <div class="timeCtn"
              v-for="(itemTime,indexTime) in timeProgressInfo"
              :key="indexTime"
              :style="{left:itemTime.prog + '%'}">
              <div class="time">{{itemTime.time}}</div>
              <div class="line"></div>
              <div class="time_name">{{itemTime.name}}</div>
            </div>
          </div>
        </div>
        <div class="swichCtn">
          <div class="swich active">制版工艺</div>
          <div class="swich">物料概述</div>
          <div class="swich">生产概述</div>
          <div class="swich">财务概述</div>
        </div>
      </div>
      <div class="detailCtn"
        style="padding-top:40px">
        <div class="rowCtn">
          <div class="tableCtnLv2 hasBorderBottom">
            <div class="tb_btn top_right">
              <div class="btn btnBlue"
                @click="popup_craft_flag = true">工艺确认</div>
            </div>
            <div class="tb_header">
              <span class="tb_row">样品编号</span>
              <span class="tb_row">工艺/制版类型</span>
              <span class="tb_row">操作人</span>
              <span class="tb_row">工艺/制版状态</span>
              <span class="tb_row">确认时间</span>
              <span class="tb_row middle">样品状态</span>
            </div>
            <div class="tb_content"
              v-for="(itemPro,indexPro) in sampleOrderInfo.product_info"
              :key="indexPro">
              <span class="tb_row">
                <div class="twoLineText">
                  <span>{{itemPro.product_info.product_code}}</span>
                  <span>{{itemPro.product_info|filterType}}</span>
                </div>
              </span>
              <span class="tb_row flex40">
                <span class="tb_col">
                  <span class="tb_col_item">
                    <span class="tb_row">工艺</span>
                    <span class="tb_row">暂无</span>
                    <span class="tb_row">
                      <span class="status_item orange">未完成</span>
                    </span>
                    <span class="tb_row">暂无</span>
                  </span>
                  <span class="tb_col_item">
                    <span class="tb_row">制版</span>
                    <span class="tb_row">test_yhw</span>
                    <span class="tb_row">
                      <span class="status_item green">已确认</span>
                    </span>
                    <span class="tb_row ">2019-08-23</span>
                  </span>
                </span>
              </span>
              <span class="tb_row middle">
                <span class="status_item orange">未完成</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 工艺制版弹窗 -->
    <div class="popup"
      v-show="popup_craft_flag">
      <div class="main">
        <div class="title">
          <span class="text">工艺制版确认</span>
          <span class="el-icon-close"
            @click="closeWindow('craft')"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">777：</span>
            <span class="info flexColCenter">
              <el-checkbox label="工艺"></el-checkbox>
              <el-checkbox label="制版"></el-checkbox>
            </span>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="closeWindow('craft')">取消</div>
            <div class="btn btnBlue">确认</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改样品弹窗 -->
    <div class="popup"
      v-show="popup_sample_change_flag">
      <div class="main">
        <div class="title">
          <span class="text">请选择需要修改的样品</span>
          <span class="el-icon-close"
            @click="closeWindow('sample_change')"></span>
        </div>
        <div class="content">
          <div class="row">
            <el-radio-group v-model="changeSampleId"
              class="flexColumn">
              <el-radio v-for="(itemPro,indexPro) in sampleOrderInfo.product_info"
                :key="indexPro"
                class="flexColumn_item"
                :label="itemPro.product_info.product_id">{{itemPro.product_info.product_code}}({{itemPro.product_info|filterType}})</el-radio>
            </el-radio-group>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="closeWindow('sample_change')">取消</div>
            <div class="btn btnBlue"
              @click="goChangeSample(changeSampleId)">去修改</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 继续打样时弹窗 -->
    <div class="popup"
      v-show="popup_sample_order_change_flag">
      <div class="main"
        style="width:600px">
        <div class="title">
          <span class="text">继续打样</span>
          <span class="el-icon-close"
            @click="closeWindow('sample_order_change')"></span>
        </div>
        <div class="content">
          <template v-if="popup_pages === 0">
            <div class="row">
              <span class="label">样单类型：</span>
              <span class="info">
                <el-select v-model="changeSampleOrderInfo.type"
                  class="popup_input"
                  placeholder="请选择样单类型">
                  <el-option v-for="item in sampleTypeArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </span>
            </div>
            <template v-for="(itemPro,indexPro) in changeSampleOrderInfo.product_info">
              <div class="row"
                :key="indexPro + 'product'">
                <span class="label">打样样品：</span>
                <span class="info">
                  <el-select v-model="itemPro.product_id"
                    class="popup_input"
                    disabled
                    placeholder="请选择打样样品">
                    <el-option v-for="item in sampleOrderInfo.product_info"
                      :key="item.product_info.product_id"
                      :label="item.product_info.product_code + '(' + item.product_info.category_name + '/' + item.product_info.style_name + '/' + item.product_info.type_name + ')'"
                      :value="item.product_info.product_id">
                    </el-option>
                  </el-select>
                </span>
                <span class="editBtn red"
                  @click="deleteItem(changeSampleOrderInfo.product_info,indexPro)">删除</span>
              </div>
              <div class="row"
                v-for="(itemSize,indexSize) in itemPro.sizeInfo"
                :key="indexSize + '' + itemPro.product_id">
                <span class="label"></span>
                <span class="info flexColCenter">
                  <el-cascader v-model="itemSize.size_color"
                    class="popup_input_small"
                    :options="itemPro.sizeColorArr"
                    @change="changeFlag(itemPro.sizeInfo,$event,itemSize)"></el-cascader>
                  <zh-input v-model="itemSize.number"
                    class="popup_input_small"
                    type='number'>
                    <span slot="append">{{itemPro.unit}}</span>
                  </zh-input>
                </span>
                <span class="editBtn blue"
                  v-if="indexSize === 0"
                  @click="addItem(itemPro.sizeInfo,'sampleOrderInfoChange')">添加</span>
                <span class="editBtn red"
                  v-else
                  @click="deleteItem(itemPro.sizeInfo,indexSize,true)">删除</span>
              </div>
            </template>
            <div class="row">
              <span class="label">完成时间：</span>
              <span class="info">
                <el-date-picker v-model="changeSampleOrderInfo.compiled_time"
                  class="popup_input"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择完成日期">
                </el-date-picker>
              </span>
            </div>
          </template>
          <template v-if="popup_pages === 1">
            <div class="row">
              <span class="label">客户付费：</span>
              <span class="info flexColCenter">
                <el-switch v-model="changeSampleOrderInfo.is_customer_pay"
                  active-text="是"
                  inactive-text="否"></el-switch>
              </span>
            </div>
            <template v-if="changeSampleOrderInfo.is_customer_pay">
              <template v-for="(itemProSizeColor,indexProSizeColor) in customer_pay_info">
                <div class="row"
                  :key="indexProSizeColor">
                  <span class="label"></span>
                  <span class="info">
                    <el-select v-model="itemProSizeColor.id_size_color"
                      disabled
                      class="popup_input"
                      placeholder="请选择打样样品">
                      <el-option v-for="(itemInner,indexInner) in customer_pay_info"
                        :key="indexInner"
                        :label="itemInner.code_type_size_color"
                        :value="itemInner.id_size_color">
                      </el-option>
                    </el-select>
                  </span>
                </div>
                <div class="row"
                  :key="indexProSizeColor + 'size'">
                  <span class="label"></span>
                  <span class="info flexColCenter">
                    <zh-input v-model="itemProSizeColor.price"
                      placeholder="单价"
                      class="popup_input_small"
                      type='number'
                      @input="computedPrice(itemProSizeColor)">
                      <span slot="append">{{'元/' + itemProSizeColor.unit}}</span>
                    </zh-input>
                    <zh-input v-model="itemProSizeColor.price_number"
                      placeholder="数量"
                      class="popup_input_small"
                      type='number'
                      @input="computedPrice(itemProSizeColor)">
                      <span slot="append">{{itemProSizeColor.unit}}</span>
                    </zh-input>
                  </span>
                </div>
                <div class="row"
                  :key="indexProSizeColor + 'price'">
                  <span class="label"></span>
                  <span class="info">
                    <zh-input v-model="itemProSizeColor.total_price"
                      placeholder="请输入总价"
                      class="popup_input"
                      type='number'>
                      <span slot="append">元</span>
                    </zh-input>
                  </span>
                </div>
              </template>
            </template>
          </template>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            v-show="popup_pages === 0"
            @click="closeWindow('sample_order_change')">取消</div>
          <div class="btn btnGray"
            v-show="popup_pages === 1"
            @click="popup_pages = 0">上一步</div>
          <div class="btn btnBlue"
            v-show="popup_pages === 0"
            @click="popup_pages = 1">下一步</div>
          <div class="btn btnBlue"
            v-show="popup_pages === 1"
            @click="changeSampleOrder">确定</div>
        </div>
      </div>
    </div>
    <!-- 取消样单 -->
    <div class="popup"
      v-show="showCanclePopup">
      <div class="main">
        <div class="title">
          <span class="text">取消订单{{showCanclePopup|filterTitle}}</span>
          <span class="el-icon-close"
            @click="closePopup"></span>
        </div>
        <div class="content steps">
          <el-steps :active="showCanclePopup-1"
            finish-status="success"
            align-center>
            <el-step title="原料结余入库"></el-step>
            <el-step title="辅料结余入库"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </div>
        <div class="content"
          v-if="showCanclePopup === 1">
          <div class="row">
            <span class="label">入库仓库：</span>
            <span class="info">
              <el-select v-model="yarnStockId"
                placeholder="请选择入库仓库">
                <el-option v-for="item in stockList.filter(item=>item.type.indexOf(1) !== -1)"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <template v-for="(itemMa,indexMa) in cancleYarn">
            <div class="row"
              :key="indexMa + 'info'">
              <span class="label">原料信息{{indexMa + 1}}：</span>
              <span class="info popup_info_page">
                <!-- <zh-input v-model="itemMa.material_name"
                  placeholder="请填写原料"
                  class="elInput" /> -->
                <el-autocomplete v-model="itemMa.material_name"
                  :fetch-suggestions="querySearchYarn"
                  placeholder="请填写原料"></el-autocomplete>
              </span>
              <span class="editBtn blue"
                v-if="indexMa === 0"
                @click="addItem(cancleYarn,'yarn')">添加</span>
              <span class="editBtn red"
                v-if="indexMa !== 0"
                @click="deleteItem(cancleYarn,indexMa)">删除</span>
            </div>
            <div class="row"
              :key="indexMa + 'number'">
              <span class="label">属性/数量：</span>
              <span class="info popup_info_page">
                <zh-input v-model="itemMa.color"
                  placeholder="属性"
                  class="elInput" />
                <zh-input v-model="itemMa.weight"
                  placeholder="数量"
                  type='number'
                  class="elInput">
                  <template slot="append">kg</template>
                </zh-input>
              </span>
            </div>
          </template>
        </div>
        <div class="content"
          v-if="showCanclePopup === 2">
          <div class="row">
            <span class="label">入库仓库：</span>
            <span class="info">
              <el-select v-model="materialStockId"
                placeholder="请选择入库仓库">
                <el-option v-for="item in stockList.filter(item=>item.type.indexOf(2) !== -1)"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <template v-for="(itemMa,indexMa) in cancleMaterial">
            <div class="row"
              :key="indexMa + 'info'">
              <span class="label">辅料信息{{indexMa + 1}}：</span>
              <span class="info popup_info_page">
                <el-autocomplete v-model="itemMa.material_name"
                  :fetch-suggestions="querySearchMaterial"
                  placeholder="请填写原料"></el-autocomplete>
              </span>
              <span class="editBtn blue"
                v-if="indexMa === 0"
                @click="addItem(cancleMaterial,'material')">添加</span>
              <span class="editBtn red"
                v-if="indexMa !== 0"
                @click="deleteItem(cancleMaterial,indexMa)">删除</span>
            </div>
            <div class="row"
              :key="indexMa + 'number'">
              <span class="label">属性/数量：</span>
              <span class="info popup_info_page">
                <zh-input v-model="itemMa.color"
                  placeholder="属性"
                  class="elInput" />
                <zh-input v-model="itemMa.weight"
                  placeholder="数量"
                  type='number'
                  class="elInput">
                  <template slot="append">{{(itemMa.unit || '件')}}</template>
                </zh-input>
              </span>
            </div>
          </template>
        </div>
        <div class="content center"
          v-if="showCanclePopup === 3 || showCanclePopup === 4">
          <!-- <div class="row"> -->
          <span class="el-icon-warning-outline orange"
            v-if="isCommit === 'before'">确认提交后将修改该订单状态为取消，是否继续?</span>
          <span class="blue"
            v-if="isCommit === 'commit'">提交中<em class="el-icon-loading"></em></span>
          <span class="green"
            v-if="isCommit === 'compiled'">提交完成<em class="el-icon-check"></em></span>
          <span class="red"
            v-if="isCommit === 'error'">提交失败，请尝试重新提交或刷新页面！<em class="el-icon-close"></em></span>
          <!-- </div> -->
        </div>
        <div class="opr">
          <div class="btn btnGray"
            v-if="showCanclePopup === 1 && isCommit"
            @click="closePopup">取消</div>
          <div class="btn btnGray"
            v-if="showCanclePopup > 1 && (isCommit === 'before' || isCommit === 'error')"
            @click="showCanclePopup--">上一步</div>
          <div class="btn btnBlue"
            v-if="showCanclePopup < 3"
            @click="showCanclePopup++">下一步</div>
          <div class="btn btnBlue"
            v-if="showCanclePopup === 3 && isCommit === 'before'"
            @click="handleSelect('cancle')">确定</div>
          <div class="btn btnBlue"
            v-if="showCanclePopup === 3 && isCommit === 'error'"
            @click="handleSelect('cancle')">重试<em class="el-icon-refresh-left"></em></div>
          <div class="btn btnBlue"
            v-if="showCanclePopup === 3  && isCommit === 'commit'">提交中<em class="el-icon-loading"></em></div>
          <div class="btn btnBlue"
            v-if="showCanclePopup === 4 && isCommit === 'compiled'"
            @click="closePopup">完成</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>

          <div class="btn btnGray"
            @click="$router.push('/sample/sampleOrderList/page=&&keyword=&&date=&&client_id=&&group_id=')">返回列表</div>
          <!-- <div class="btn btnBlue"
            @click="submit"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaNum } from '@/assets/js/dictionary.js'
import { sampleOrder, materialManage, yarn, material, stock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      lock: true,
      chinaNum: chinaNum,
      activeId: '', // 当前打样的id
      cloneData: [], // 保留的原始数据
      sampleOrderInfo: {},
      sampleOrderInfoSave: {},
      sampleTypeArr: [
        {
          id: 0,
          name: '开发样'
        }, {
          id: 1,
          name: '修改样'
        }, {
          id: 2,
          name: '销售样'
        }, {
          id: 3,
          name: '确认样'
        }, {
          id: 4,
          name: '产前样'
        }, {
          id: 5,
          name: '大货样'
        }
      ],
      customer_pay_info: [], // 客户付费数据
      popup_craft_flag: false,
      popup_sample_change_flag: false,
      changeSampleId: '',
      popup_sample_order_change_flag: false,
      popup_pages: 0,
      changeSampleOrderInfo: {
        type: '',
        product_info: [],
        is_customer_pay: false,
        compiled_time: ''
      },
      timeProgressInfo: [],
      showCanclePopup: false,
      cancleYarn: [],
      cancleMaterial: [],
      yarnList: [],
      materialList: [],
      stockList: [],
      yarnStockId: '',
      materialStockId: '',
      isCommit: 'before'
    }
  },
  methods: {
    init () {
      sampleOrder.detail({
        id: this.$route.params.id
      }).then(res => {
        if (res.data.status) {
          this.cloneData = this.$clone(res.data.data)
          this.activeId = this.cloneData.id
          this.getSampleOrderInfo(res.data.data)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleSelect (event) {
      console.log(event)
      if (event === 'change') { // 继续打样
        this.$confirm('是否需要修改样品信息?', '提示', {
          confirmButtonText: '修改',
          cancelButtonText: '不需要',
          type: 'warning'
        }).then(() => {
          this.popup_sample_change_flag = true
        }).catch(() => {
          this.changeSampleOrderInfo.product_info = this.sampleOrderInfo.product_info.map(itemPro => {
            return {
              product_id: itemPro.product_info.product_id,
              sizeInfo: itemPro.size_info.map(itemSize => {
                return {
                  size_color: [itemSize.size, itemSize.color],
                  number: ''
                }
              }),
              product_info: itemPro.product_info,
              sizeColorArr: itemPro.product_info.size_measurement.map(itemSize => {
                return {
                  value: itemSize.size_name,
                  label: itemSize.size_name,
                  children: itemPro.product_info.color.map(itemColor => {
                    return {
                      value: itemColor.color_name,
                      label: itemColor.color_name
                    }
                  })
                }
              }),
              unit: itemPro.product_info.unit
            }
          })
          this.popup_sample_order_change_flag = true
        })
      } else if (event === 'cancle') {
        let flag = {
          name: true,
          color: true,
          size: true,
          number: true,
          stock: true
        }
        let yarnData = this.cancleYarn.filter(item => item.material_name || item.color || item.weight).map(item => {
          if (!item.material_name) {
            flag.name = false
          }
          if (!item.color) {
            flag.color = false
          }
          if (!this.yarnStockId) {
            flag.stock = false
          }
          if (!item.number) {
            flag.weight = false
          }
          return {
            material_name: item.material_name,
            color_code: item.color,
            stock_id: this.yarnStockId,
            type: 1,
            vat_code: '',
            attribute: '',
            weight: item.weight,
            company_id: window.sessionStorage.getItem('company_id'),
            desc: '订单结余入库'
          }
        })
        if (!flag.stock) {
          this.$message.error('请选择您需要入库的原料仓库')
          return
        }
        if (!flag.name) {
          this.$message.error('请填写您需要入库的原料')
          return
        }
        if (!flag.color) {
          this.$message.error('请填写您需要入库的原料属性')
          return
        }
        if (!flag.number) {
          this.$message.error('请填写您需要入库的原料数量')
          return
        }
        let materialData = this.cancleMaterial.filter(item => item.material_name || item.color || item.weight).map(item => {
          if (!item.material_name) {
            flag.name = false
          }
          if (!item.color) {
            flag.color = false
          }
          if (!this.materialStockId) {
            flag.stock = false
          }
          if (!item.number) {
            flag.weight = false
          }
          return {
            material_name: item.material_name,
            color_code: item.color,
            stock_id: this.materialStockId,
            type: 2,
            vat_code: '',
            attribute: '',
            weight: item.weight,
            company_id: window.sessionStorage.getItem('company_id'),
            desc: '订单结余入库'
          }
        })
        if (!flag.stock) {
          this.$message.error('请选择您需要入库的辅料仓库')
          return
        }
        if (!flag.name) {
          this.$message.error('请填写您需要入库的辅料')
          return
        }
        if (!flag.color) {
          this.$message.error('请填写您需要入库的辅料属性')
          return
        }
        if (!flag.number) {
          this.$message.error('请填写您需要入库的辅料数量')
          return
        }
        this.isCommit = 'commit'
        sampleOrder.changeStatus({
          order_id: this.$route.params.id,
          type: 3,
          material_data: yarnData.concat(materialData)
        }).then(res => {
          if (res.data.status !== false) {
            this.isCommit = 'compiled'
            this.showCanclePopup++
            this.init()
          } else {
            this.isCommit = 'error'
          }
        })
      } else if (event === 'showCanclePopup') {
        this.getMaterialOrderAndProduct()
      }
    },
    // 取消时初始化原料、辅料、包装和产品信息
    getMaterialOrderAndProduct () {
      this.loading = true
      Promise.all([
        materialManage.detail({
          order_id: this.$route.params.id,
          order_type: 2
        }),
        yarn.list(),
        material.list(),
        stock.list()
      ]).then(res => {
        // 获取订购原料/辅料信息
        let materialInfo = this.$mergeData(res[0].data.data, { mainRule: ['material_name', 'type', 'color_code/color'], otherRule: [{ name: 'weight', type: 'add' }, { name: 'unit' }] }).map(item => {
          return {
            material_name: item.material_name,
            type: item.type,
            color: item.color,
            weight: item.weight,
            unit: item.unit
          }
        })
        this.cancleYarn = materialInfo.filter(item => item.type === 1)
        this.cancleMaterial = materialInfo.filter(item => item.type === 2)
        if (this.cancleYarn.length === 0) {
          this.cancleYarn.push({
            material_name: '',
            type: 1,
            color: '',
            weight: '',
            unit: ''
          })
        }
        if (this.cancleMaterial.length === 0) {
          this.cancleMaterial.push({
            material_name: '',
            type: 2,
            color: '',
            weight: '',
            unit: ''
          })
        }
        if (this.yarnList.length === 0) {
          this.yarnList = res[1].data.data.map(item => {
            return {
              value: item.name
            }
          })
        }
        if (this.materialList.length === 0) {
          this.materialList = res[2].data.data.map(item => {
            return {
              value: item.name
            }
          })
        }
        if (this.stockList.length === 0) {
          this.stockList = res[3].data.data.data
        }
        this.loading = false
      })
      this.showCanclePopup = 1
    },
    closePopup () {
      this.cancleYarn = []
      this.cancleMaterial = []
      this.isCommit = 'before'
      this.yarnStockId = ''
      this.materialStockId = ''
      this.showCanclePopup = false
    },
    goChangeSample (id) {
      if (!id) {
        this.$message.warning('请选择需要修改的样品')
      } else {
        this.$router.push('/sample/sampleUpdate/' + id)
      }
    },
    changeSampleOrder () {
      if (!this.lock) {
        this.$message.warning('请勿频繁点击')
        return
      }
      if (!this.changeSampleOrderInfo.type && this.changeSampleOrderInfo.type !== 0) {
        this.$message.error('请选择样单类型')
        return
      }
      let flag = true
      let sizeFlag = true
      this.changeSampleOrderInfo.product_info.forEach(itemPro => {
        itemPro.sizeInfo.forEach(itemSize => {
          if (!itemSize.number && itemSize.number.toString() !== '0') {
            flag = false
          }
          if (itemSize.size_color.length !== 2) {
            sizeFlag = false
          }
        })
      })
      if (!sizeFlag) {
        this.$message.error('检测到有未填写的尺码颜色')
        return
      }
      if (!flag) {
        this.$message.error('检测到打样数量未填写')
        return
      }
      if (!this.changeSampleOrderInfo.compiled_time) {
        this.$message.error('请选择完成时间')
        return
      }
      if (this.changeSampleOrderInfo.is_customer_pay) { // 客户付费判断

      } else {
        this.lock = false
        sampleOrder.create({
          type: this.changeSampleOrderInfo.type,
          title: this.sampleOrderInfoSave.title,
          pid: this.$route.params.id,
          order_time: this.$getTime(),
          group_id: this.sampleOrderInfoSave.group_id,
          client_id: this.sampleOrderInfoSave.client_id,
          contacts_id: this.sampleOrderInfoSave.contacts_id,
          deliver_time: this.changeSampleOrderInfo.compiled_time,
          desc: null,
          product_info: this.changeSampleOrderInfo.product_info.map(itemPro => {
            return {
              product_id: itemPro.product_id,
              size_info: itemPro.sizeInfo.map(itemSize => {
                return {
                  size: itemSize.size_color[0],
                  color: itemSize.size_color[1],
                  numbers: itemSize.number
                }
              })
            }
          })
        }).then(res => {
          if (res.data.status) {
            this.$message.success('打样成功')
            window.location.reload()
          } else {
            this.$message.error(res.data.message)
          }
          this.lock = true
        })
      }
    },
    computedPrice (item) {
      if (item.price && item.price_number) {
        item.total_price = (item.price * item.price_number).toFixed(1)
      }
    },
    closeWindow (type) {
      if (type === 'craft') {
        this.popup_craft_flag = false
      } else if (type === 'sample_change') {
        this.popup_sample_change_flag = false
      } else if (type === 'sample_order_change') {
        this.popup_sample_order_change_flag = false
        this.popup_pages = 0
        this.changeSampleOrderInfo.is_customer_pay = false
        this.customer_pay_info.forEach(item => {
          item.price = ''
          item.price_number = ''
          item.total_price = ''
        })
      }
    },
    cutSampleOrder (event) {
      this.loading = true
      this.activeId = event
      if (this.cloneData.id === event) {
        this.getSampleOrderInfo(this.cloneData)
      } else {
        let flag = this.cloneData.child_data.find(itemOrder => itemOrder.id === event)
        if (flag) {
          this.getSampleOrderInfo(flag)
        } else {
          this.$message.error('未找到该次打样信息，请联系管理员')
        }
      }
    },
    getSampleOrderInfo (item) {
      this.timeProgressInfo = []
      sampleOrder.editDetail({
        id: item.id
      }).then(res => {
        this.sampleOrderInfoSave = this.$clone(res.data.data)
      })
      this.sampleOrderInfo = this.$clone(item)
      this.sampleOrderInfo.type = this.sampleTypeArr.find(itemType => itemType.id === this.sampleOrderInfo.type).name
      this.timeProgressInfo.push({
        name: '下单日期',
        time: this.sampleOrderInfo.order_time,
        prog: 0
      })
      this.timeProgressInfo.push({
        name: '交货日期',
        time: this.sampleOrderInfo.deliver_time,
        prog: 100
      })
      let nowDate = this.$getTime()
      let totalTime = new Date(this.sampleOrderInfo.deliver_time).getTime() - new Date(this.sampleOrderInfo.order_time).getTime()
      let prog = (new Date(nowDate).getTime() - new Date(this.sampleOrderInfo.order_time).getTime()) / totalTime * 100 > 100 ? 100 : (new Date(nowDate).getTime() - new Date(this.sampleOrderInfo.order_time).getTime()) / totalTime * 100
      this.timeProgressInfo.push({
        name: '今天',
        time: nowDate,
        prog: prog
      })
      // 初始化客户付费信息数据
      let customerPayInfo = []
      this.sampleOrderInfo.product_info.forEach(itemPro => {
        itemPro.size_info.forEach(itemSize => {
          customerPayInfo.push({
            id_size_color: itemPro.product_info.product_id + '&&' + itemSize.size + itemSize.color,
            code_type_size_color: itemPro.product_info.product_code + '(' + itemPro.product_info.category_name + '/' + itemPro.product_info.style_name + '/' + itemPro.product_info.type_name + ')' + '(' + itemSize.size + '/' + itemSize.color + ')',
            unit: itemPro.product_info.unit,
            price: '',
            total_price: '',
            price_number: ''
          })
        })
      })
      this.customer_pay_info = customerPayInfo
      this.loading = false
    },
    deleteItem (item, index) {
      item.splice(index, 1)
    },
    addItem (item, type) {
      if (type === 'sampleOrderInfoChange') {
        item.push({
          number: '',
          size_color: ''
        })
      } else if (type === 'yarn') {
        item.push({
          material_name: '',
          color: '',
          type: 1,
          unit: null,
          weight: ''
        })
      } else if (type === 'material') {
        item.push({
          material_name: '',
          color: '',
          type: 2,
          unit: '件',
          weight: ''
        })
      } else {
        this.$message.error('未知操作')
      }
    },
    changeFlag (item, $event, value) {
      if (item.filter(itemSize => itemSize.size_color[0] === $event[0] && itemSize.size_color[1] === $event[1]).length >= 2) {
        this.$message.warning('检测到该打样产品中已有该尺码颜色')
        value.size_color = ''
      }
    },
    querySearchYarn (queryString, cb) {
      var restaurants = this.yarnList
      var results = queryString ? restaurants.filter(item => item.value.indexOf(queryString) !== -1) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    querySearchMaterial (queryString, cb) {
      var restaurants = this.materialList
      var results = queryString ? restaurants.filter(item => item.value.indexOf(queryString) !== -1) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    }
  },
  created () {
    this.init()
  },
  filters: {
    filterType (item) {
      return [item.category_name, item.style_name, item.type_name].join(' / ')
    },
    filterTitle (value) {
      if (value === 1) {
        return '-原料结余入库'
      } else if (value === 2) {
        return '-辅料结余入库'
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/sample/sampleOrderDetail.less";
</style>
<style lang="less">
#sampleOrderDetail {
  .el-menu,
  .el-submenu,
  .el-submenu__title {
    background-color: #1a95ff;
    border-radius: 4px;
    color: #fff;
    i {
      color: #fff;
    }
  }
  .steps {
    padding: 8px;
    border-bottom: none;
    .el-step__title {
      font-size: 14px !important;
    }
  }
}
//操作按钮重写
.elMenuItem {
  color: #999 !important;
  min-width: auto !important;
  &.is-active {
    color: #999 !important;
    .el-submenu__title {
      color: #999 !important;
    }
  }
  &:hover {
    background: #1a95ff !important;
    color: #fff !important;
    .el-submenu__title:hover {
      background: transparent !important;
      color: #fff !important;
      i {
        color: #fff;
      }
    }
  }
}
.handleMenuSample {
  .el-menu--popup {
    min-width: auto !important;
  }
}
</style>
