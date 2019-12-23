<template>
  <div id="semiFinishedDetail"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">订单信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">编号：</span>
            <span class="text">{{orderInfo.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单公司：</span>
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
            <span class="text">{{orderInfo.user_name}}</span>
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
    <div class="module">
      <div class="titleCtn">
        <span class="title">半成品检验</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">织造单位</div>
                  <div class="tcolumn noPad"
                    style="flex:6">
                    <div class="trow">
                      <div class="tcolumn">产品信息</div>
                      <div class="tcolumn">尺码颜色</div>
                      <div class="tcolumn">织造数量</div>
                      <div class="tcolumn">检验数量</div>
                      <div class="tcolumn">截止日期</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weave_detail"
                  :key="index">
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">
                        <span>{{itemChild.product_info.code}}</span>
                        <span>{{itemChild.category_info.category_name?itemChild.category_info.category_name+'/'+ itemChild.category_info.type_name+'/'+ itemChild.category_info.style_name:itemChild.product_info.name}}</span>
                      </div>
                      <div class="tcolumn">{{itemChild.size}}/{{itemChild.color}}</div>
                      <div class="tcolumn">{{itemChild.number}}</div>
                      <div class="tcolumn">0</div>
                      <div class="tcolumn">{{itemChild.complete_time.slice(0,10)}}</div>
                      <div class="tcolumn">
                        <span class="btn noBorder"
                          style="padding:0;margin:0"
                          @click="normalInspection(item.client_id,itemChild.product_id,itemChild.size + '/' + itemChild.color,itemChild.number)">检验</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in inspection_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteInspection(index)">
                  <i class="el-icon-close"></i>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">选择产品</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.product_id"
                        placeholder="请选择检验产品"
                        @change="selectProduct($event,index,'process_data')">
                        <el-option v-for="item in inspection_product"
                          :key="item.product_id"
                          :value="item.product_id"
                          :label="item.product_info.code + '('+(item.category_info.category_name?item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name:item.product_info.name) +')'"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">织造单位</span>
                      <span class="explanation">(选填，没有选项时可以在备注栏填写)</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-select v-model="item.client_id"
                          placeholder="请选择织造单位"
                          filterable>
                          <el-option v-for="item in companyArr"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemChild,indexChild) in item.product_info"
                  :key="indexChild">
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">尺码颜色</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select placeholder="请选择尺码颜色"
                        no-data-text="请先选择产品"
                        v-model="itemChild.colorSize">
                        <el-option v-for="(item,index) in item.colorSizeArr"
                          :key="index"
                          :value="item.name"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">检验数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        placeholder="请输入检验数量"
                        v-model="itemChild.number">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">件数</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        placeholder="请输入检验件数"
                        v-model="itemChild.count">
                        <template slot="append">件</template>
                      </zh-input>
                    </div>
                    <div class="editBtn addBtn"
                      v-if="indexChild===0"
                      @click="addProduct(index)">添加产品</div>
                    <div class="editBtn deleteBtn"
                      v-if="indexChild>0"
                      @click="deleteProduct(index,indexChild)">删除产品</div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">检验日期</span>
                      <span class="explanation">(默认今天)</span>
                    </div>
                    <div class="content">
                      <div class="content">
                        <el-date-picker v-model="item.date"
                          style="width:100%"
                          type="date"
                          placeholder='选择检验日期'>
                        </el-date-picker>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">备注信息</span>
                    </div>
                    <div class="content">
                      <el-input placeholder="请输入备注信息"
                        v-model="item.desc"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="addRows">
                <span class="once"
                  v-if="!inspection_flag"
                  @click="normalInspection()">普通检验</span>
                <span class="once"
                  v-if="!inspection_flag"
                  @click="easyInspection">一键检验</span>
                <span class="once cancle"
                  v-if="inspection_flag"
                  @click="cancleInspection">取消检验</span>
                <span class="once normal"
                  v-if="inspection_flag"
                  @click="addInspection">添加织造单位</span>
                <span class="once ok"
                  v-if="inspection_flag"
                  @click="saveInspection">确认检验
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { order, weave } from '@/assets/js/api.js'
export default {
  data () {
    return {
      // 次品原因
      defectiveType: ['跳线', '污迹', '经纬断线', '严重破损', '边型问题', '流苏问题', '颜色问题', '花型问题', '款型问题', '克重问题', '长度问题', '工序问题', '质量问题', '加工问题', '其他问题'],
      loading: true,
      orderInfo: {
        order_code: '',
        client_name: '',
        user_name: '',
        group_name: '',
        order_time: '',
        order_batch: [],
        desc: ''
      },
      companyArr: [],
      weave_detail: [],
      inspection_detail: [],
      inspection_product: [],
      inspection_data: [],
      inspection_log: [],
      inspection_flag: false
    }
  },
  methods: {
    normalInspection () {
      this.inspection_flag = true
      this.inspection_data.push({
        product_id: '',
        colorSizeArr: [],
        product_info: [{
          colorSize: '',
          number: '',
          count: '',
          substandard: [{
            number: '',
            reason: [],
            reasonDesc: '' // 次品备注
          }]
        }],
        client_id: '',
        date: this.$getTime(new Date())
      })
    },
    easyInspection () {

    },
    addInspection () {

    },
    deleteInspection () {

    },
    cancleInspection () {

    },
    saveInspection () {

    },
    addProduct () {

    },
    deleteProduct () {

    }
  },
  mounted () {
    Promise.all([order.detail({
      id: this.$route.params.id
    }), weave.detail({
      order_id: this.$route.params.id,
      order_type: 1
    })]).then((res) => {
      this.orderInfo = res[0].data.data
      this.weave_detail = this.$mergeData(res[1].data.data, { mainRule: 'client_name', otherRule: [{ name: 'client_id' }] })
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/inspection/semiFinishedDetail.less";
</style>
