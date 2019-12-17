<template>
  <div id="processingDetail"
    class="indexMain"
    v-loading="loading">
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
        <span class="title">半成品加工信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">产品编号</div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcolumn">尺码配色</div>
                      <div class="tcolumn">计划数量</div>
                      <div class="tcolumn">分配数量</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in process_info"
                  :key="index">
                  <div class="tcolumn">
                    <span>{{item.product_code}}</span>
                    <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.size}}/{{itemChild.color}}</div>
                      <div class="tcolumn">{{itemChild.numbers}}</div>
                      <div class="tcolumn">0</div>
                      <div class="tcolumn">
                        <span class="btn noBorder"
                          style="padding:0;margin:0">半成品加工分配</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in process_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteProcess(index)">
                  <i class="el-icon-close"></i>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">加工单位</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.company_id"
                        filterable
                        placeholder="请选择加工单位">
                        <el-option v-for="item in companyArr"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">选择产品</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.product_id"
                        filterable
                        placeholder="请选择加工单位"
                        @change="selectProduct($event,index)">
                        <el-option v-for="item in process_info"
                          :key="item.product_id"
                          :value="item.product_id"
                          :label="item.product_code+'('+item.category_name + '/' + item.type_name + '/' + item.style_name + ')'"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">选择加工工序</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.process"
                        filterable
                        multiple
                        placeholder="请选择加工工序">
                        <el-option v-for="item in processArr"
                          :key="item.name"
                          :value="item.name"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="rowCtn"
                  v-for="(itemChild,indexChild) in item.product_info"
                  :key="indexChild">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">尺码颜色</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="itemChild.colorSize"
                        placeholder="请选择尺码颜色">
                        <el-option v-for="(items,indexs) in item.colorSizeArr"
                          :key="indexs"
                          :value="item.name"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">单价</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input placeholder="请输入单价"
                        v-model="itemChild.price"
                        type="number">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input placeholder="请输入单价"
                        v-model="itemChild.number"
                        type="number">
                      </zh-input>
                    </div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">产品总价</span>
                      <span class="explanation">(自动计算)</span>
                    </div>
                    <div class="content">
                      <div class="input">
                        <span class="span">0</span>
                        <span class="append">元</span>
                      </div>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">选择辅料</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.part_id"
                        multiple
                        placeholder="请选择辅料">
                        <el-option v-for="items in item.partDataArr"
                          :key="items.id"
                          :label="items.name"
                          :value="items.id"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">截止日期</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-date-picker v-model="item.complete_time"
                        style="width:100%"
                        type="date"
                        placeholder="选择截止日期">
                      </el-date-picker>
                    </div>
                  </div>
                </div>
                <div class="rowCtn">
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
                  v-if="!process_flag"
                  @click="normalProcess()">普通分配</span>
                <span class="once"
                  v-if="!process_flag"
                  @click="easyProcess">一键分配</span>
                <span class="once cancle"
                  v-if="process_flag"
                  @click="cancleProcess">取消分配</span>
                <span class="once normal"
                  v-if="process_flag"
                  @click="addProcess">添加织造单位</span>
                <span class="once ok"
                  v-if="process_flag"
                  @click="saveProcess">确认分配
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
import { order, materialPlan, client, process } from '@/assets/js/api.js'
export default {
  data () {
    return {
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
      processArr: [],
      process_data: [],
      process_info: [],
      process_flag: false
    }
  },
  methods: {
    normalProcess () {
      this.process_flag = true
      this.process_data.push({
        product_id: '',
        company_id: '',
        process_type: [],
        colorSizeArr: [],
        partDataArr: [],
        product_info: [{
          colorSize: '',
          price: '',
          number: ''
        }],
        part_id: [],
        complete_time: '',
        desc: ''
      })
    },
    easyProcess () {

    },
    addProcess () {
      this.process_data.push({
        product_id: '',
        company_id: '',
        process_type: [],
        colorSizeArr: [],
        product_info: [{
          colorSize: '',
          price: '',
          number: ''
        }],
        part_id: [],
        complete_time: '',
        desc: ''
      })
    },
    deleteProcess (index) {
      this.process_data.splice(index, 1)
      if (this.process_data.length === 0) {
        this.process_flag = false
      }
    },
    cancleProcess () {
      this.process_data = []
      this.process_flag = false
    },
    saveProcess () {

    },
    selectProduct (id, index) {
      let finded = this.process_info.find((item) => item.product_id === id)
      this.process_data[index].partDataArr = finded.childrenMergeInfo[0].part_data
    }
  },
  mounted () {
    Promise.all([order.detail({
      id: this.$route.params.id
    }), materialPlan.init({
      order_id: this.$route.params.id,
      order_type: 1
    }), client.list(), process.list()]).then((res) => {
      this.orderInfo = res[0].data.data
      this.process_info = this.$mergeData(res[1].data.data.product_info, { mainRule: 'product_code/product_code', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }, { name: 'product_id' }] })
      console.log(this.process_info)
      this.companyArr = res[2].data.data.filter((item) => {
        return item.type.indexOf(5) !== -1
      })
      this.processArr = res[3].data.data
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/weavingProcessing/processingDetail.less";
</style>
