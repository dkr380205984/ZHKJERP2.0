<template>
  <div id="weavingDetail"
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
        <span class="title">织造信息</span>
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
                    style="flex:5">
                    <div class="trow">
                      <div class="tcolumn">尺码配色</div>
                      <div class="tcolumn noPad"
                        style="flex:4">
                        <div class="trow">
                          <div class="tcolumn">产品部件</div>
                          <div class="tcolumn">计划数量</div>
                          <div class="tcolumn">分配数量</div>
                          <div class="tcolumn">操作</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weaving_info"
                  :key="index">
                  <div class="tcolumn">
                    <span>{{item.product_code}}</span>
                    <span>{{item.category_name}}/{{item.type_name}}/{{item.style_name}}</span>
                  </div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemSize,indexSize) in item.childrenMergeInfo"
                      :key="indexSize">
                      <div class="tcolumn">{{itemSize.size}}/{{itemSize.color}}</div>
                      <div class="tcolumn noPad"
                        style="flex:4">
                        <div class="trow"
                          v-for="(itemChild,indexChild) in itemSize.part_data"
                          :key="indexChild">
                          <div class="tcolumn">{{itemChild.name}}</div>
                          <div class="tcolumn">{{itemChild.number}}</div>
                          <div class="tcolumn">{{itemChild.weavingNum}}</div>
                          <div class="tcolumn">
                            <span class="btn noBorder"
                              style="padding:0;margin:0"
                              @click="normalWeaving(item.product_code,itemSize.size,itemSize.color,itemChild.id,itemChild.number - itemChild.weavingNum)">织造分配</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="createModule"
                v-for="(item,index) in weaving_data"
                :key="index">
                <div class="deleteIconBtn"
                  @click="deleteWeaving(index)">
                  <i class="el-icon-close"></i>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">织造单位</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.company_id"
                        filterable
                        placeholder="请选择织造单位">
                        <el-option v-for="item in companyArr"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">产品尺码颜色</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.product_name"
                        filterable
                        placeholder="请选择需要织造的产品/配件"
                        @change="selectPart(index,$event)">
                        <el-option v-for="item in productArr"
                          :key="item.name"
                          :value="item.name"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">产品信息</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <el-select v-model="item.part_id"
                        filterable
                        placeholder="请选择需要织造的产品/配件">
                        <el-option v-for="item in item.part_data"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">分配数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        v-model="item.number"
                        placeholder="请输入分配数量">
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">单价</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="content">
                      <zh-input type="number"
                        v-model="item.price"
                        placeholder="请输入单价">
                        <template slot="append">元</template>
                      </zh-input>
                    </div>
                  </div>
                  <div class="colCtn flex3">
                    <div class="label">
                      <span class="text">总价</span>
                      <span class="explanation">(自动计算)</span>
                    </div>
                    <div class="content">
                      <div class="input">
                        <span class="span">{{Number(item.price*item.number)}}</span>
                        <span class="append">元</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="rowCtn">
                  <div class="colCtn flex3"
                    style="max-width:319.3px">
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
                  v-if="!weaving_flag"
                  @click="normalWeaving()">普通分配</span>
                <span class="once"
                  v-if="!weaving_flag"
                  @click="easyWeaving">一键分配</span>
                <span class="once cancle"
                  v-if="weaving_flag"
                  @click="cancleWeaving">取消分配</span>
                <span class="once normal"
                  v-if="weaving_flag"
                  @click="addWeaving">添加织造单位</span>
                <span class="once ok"
                  v-if="weaving_flag"
                  @click="saveWeaving">确认分配
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">织造分配详情</span>
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
                      <div class="tcolumn">单价(元)</div>
                      <div class="tcolumn">数量(元)</div>
                      <div class="tcolumn">总价</div>
                      <div class="tcolumn">完成时间</div>
                    </div>
                  </div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weaving_detail"
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
                      <div class="tcolumn">{{itemChild.price}}</div>
                      <div class="tcolumn">{{itemChild.number}}</div>
                      <div class="tcolumn">{{itemChild.price*itemChild.number}}</div>
                      <div class="tcolumn">{{itemChild.complete_time.slice(0,10)}}</div>
                    </div>
                  </div>
                  <div class="tcolumn">
                    <span class="btn noBorder"
                      style="padding:0;margin:0">打印</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module log">
      <div class="titleCtn">
        <span class="title">织造分配日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1.2">完成日期</div>
                  <div class="tcolumn"
                    style="flex:1.5">织造单位</div>
                  <div class="tcolumn"
                    style="flex:1.5">产品名称</div>
                  <div class="tcolumn"
                    style="flex:1.2">尺码颜色</div>
                  <div class="tcolumn">单价(元)</div>
                  <div class="tcolumn">数量</div>
                  <div class="tcolumn">总价(元)</div>
                  <div class="tcolumn">备注</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weaving_log"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:1.2">{{item.complete_time.slice(0,10)}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">{{item.client_name}}</div>
                  <div class="tcolumn"
                    style="flex:1.5">
                    <span>{{item.product_info.code}}</span>
                    <span>{{item.category_info.category_name?item.category_info.category_name+'/'+ item.category_info.type_name+'/'+ item.category_info.style_name:item.product_info.name}}</span>
                  </div>
                  <div class="tcolumn"
                    style="flex:1.2">
                    <span>{{item.size}}</span>
                    <span>{{item.color}}</span>
                  </div>
                  <div class="tcolumn">{{item.price}}</div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn">{{item.price*item.number}}</div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn">{{item.user_name}}</div>
                  <div class="tcolumn">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteLog(item.id,index)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">原料分配信息</span>
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
                      <div class="tcolumn">分配数量</div>
                      <div class="tcolumn noPad"
                        style="flex:3">
                        <div class="trow">
                          <div class="tcolumn">原料名称</div>
                          <div class="tcolumn">原料颜色</div>
                          <div class="tcolumn">原料数量</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in weaving_detail"
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
                      <div class="tcolumn noPad"
                        style="flex:3">
                        <div class="trow"
                          v-for="(itemMat,indexMat) in itemChild.material_assign"
                          :key="indexMat">
                          <div class="tcolumn">{{itemMat.material_name}}</div>
                          <div class="tcolumn">{{itemMat.material_attribute}}</div>
                          <div class="tcolumn">{{parseInt(itemMat.material_weight/1000)}}kg</div>
                        </div>
                        <div class="trow"
                          v-if="itemChild.material_assign.length===0">
                          <div class="tcolumn"
                            style="text-align: center;flex-direction: row;align-items: center;">
                            无法统计原料分配信息，这可能是因为物料计划单未
                            <span class="blue">填写</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tcolumn">
                    <span class="btn noBorder"
                      style="padding:0;margin:0"
                      @click="replenishFn(item)">补纱</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module log"
      v-if="replenish_log.length>0">
      <div class="titleCtn">
        <span class="title">补纱日志</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">补纱日期</div>
                  <div class="tcolumn">纱线名称</div>
                  <div class="tcolumn">纱线颜色</div>
                  <div class="tcolumn">承担比例</div>
                  <div class="tcolumn">备注信息</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in replenish_log"
                  :key="index">
                  <div class="tcolumn">{{item.created_at.slice(0,10)}}</div>
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.material_color}}</div>
                  <div class="tcolumn">
                    <span v-for="(itemChild,indexChild) in item.client_info"
                      :key="indexChild">{{itemChild.client_name}}({{itemChild.percent}}%)</span>
                  </div>
                  <div class="tcolumn">{{item.desc}}</div>
                  <div class="tcolumn">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteReplenishLog(item.id,index)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="easyWeaving_flag">
      <div class="main">
        <div class="title">
          <div class="text">快捷填写</div>
          <i class="el-icon-close"
            @click="easyWeaving_flag=false"></i>
        </div>
        <div class="content">
          <div class="tips">
            提示信息：一键分配操作只能为产品大身分配数量，如果需要为产品配件分配织造工序，可以手动添加，本步骤可以统一选择织造单位,织造单价和截止日期，如不需要可以选择直接跳过该步骤。
          </div>
          <div class="row">
            <div class="label">织造单位：</div>
            <div class="info">
              <el-select v-model="commonCompany"
                filterable
                placeholder="请选择织造单位">
                <el-option v-for="item in companyArr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">单价：</div>
            <div class="info">
              <zh-input v-model="commonPrice"
                placeholder="请输入单价">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label">截止日期：</div>
            <div class="info">
              <el-date-picker v-model="commonDate"
                style="width:100%"
                type="date"
                placeholder="选择截止日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="easyWeaving_flag = false">直接跳过</div>
          <div class="btn btnBlue"
            @click="commonFn">确定</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="replenish_flag">
      <div class="main">
        <div class="title">
          <div class="text">补纱</div>
          <i class="el-icon-close"
            @click="replenish_flag=false"></i>
        </div>
        <div class="content">
          <div class="tips">
            提示信息：请按实际情况填写金额承担比例。
          </div>
          <div class="row"
            v-for="(item,index) in replenish_data.yarn_info"
            :key="index">
            <div class="label"
              :style="{'visibility':index>0?'hidden':'inhert'}">补纱信息：</div>
            <div class="info"
              style="display:flex">
              <el-select v-model="item.yarn"
                filterable
                placeholder="请选择纱线">
                <el-option v-for="item in replenish_yarn"
                  :key="item.name"
                  :value="item.name"
                  :label="item.name"></el-option>
              </el-select>
              <el-input style="margin-left:5px"
                v-model="item.weight"
                placeholder="请输入重量">
                <template slot="append">kg</template>
              </el-input>
            </div>
            <div class="editBtn blue"
              v-if="index===0"
              @click="addReplenish">添加</div>
            <div class="editBtn red"
              v-if="index>0"
              @click="deleteReplenish(index)">删除</div>
          </div>
          <div class="row">
            <div class="label">承担比例：</div>
            <div class="info">
              <zh-input v-model="replenish_data.client_info.partyA.percent"
                placeholder="请输入比例">
                <template slot="append">%</template>
                <template slot="prepend">{{replenish_data.client_info.partyA.name}}</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label"
              style="visibility: hidden;">承担比例：</div>
            <div class="info">
              <zh-input v-model="replenish_data.client_info.partyB.percent"
                placeholder="请输入比例">
                <template slot="append">%</template>
                <template slot="prepend">{{replenish_data.client_info.partyB.name}}</template>
              </zh-input>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input v-model="replenish_data.desc"
                placeholder="请输入备注信息"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="replenish_flag=false">取消</div>
          <div class="btn btnBlue"
            @click="saveReplenish">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { order, materialPlan, client, weave, replenish } from '@/assets/js/api.js'
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
      weaving_info: [],
      productArr: [],
      companyArr: [],
      weaving_data: [],
      weaving_detail: [],
      weaving_log: [],
      weaving_flag: false,
      easyWeaving_flag: false,
      commonCompany: '',
      commonPrice: '',
      commonDate: '',
      replenish_flag: false,
      replenish_yarn: [],
      replenish_data: {
        yarn_info: [],
        client_info: {
          partyA: {
            name: '',
            id: '',
            percent: ''
          },
          partyB: {
            name: '',
            id: '',
            percent: ''
          }
        },
        desc: '补纱'
      },
      replenish_log: []
    }
  },
  methods: {
    normalWeaving (code, size, color, id, number) {
      if (number !== 'undefined' && number <= 0) {
        this.$message.warning('该部件已分配完毕')
        return
      }
      this.weaving_flag = true
      this.weaving_data.push({
        company_id: '',
        product_name: code ? code + '(' + size + '/' + color + ')' : '',
        part_id: id || '',
        price: '',
        part_data: [],
        number: number || '',
        complete_time: '',
        desc: ''
      })
      if (code) {
        this.selectPart(this.weaving_data.length - 1, code + '(' + size + '/' + color + ')')
      }
    },
    easyWeaving () {
      this.weaving_data = []
      this.weaving_info.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          if (itemChild.part_data[0].number - itemChild.part_data[0].weavingNum > 0) {
            this.weaving_data.push({
              company_id: '',
              product_name: item.product_code + '(' + itemChild.size + '/' + itemChild.color + ')',
              part_id: itemChild.part_data[0].id, // 大身数据都在part_data第一个
              price: '',
              number: itemChild.part_data[0].number - itemChild.part_data[0].weavingNum,
              complete_time: '',
              desc: '',
              part_data: this.productArr.find((itemFind) => itemFind.name === (item.product_code + '(' + itemChild.size + '/' + itemChild.color + ')')).part_data
            })
          }
        })
      })
      if (this.weaving_data.length === 0) {
        this.$message.warning('所有大身信息已分配完毕，如需分配其他部件，请手动分配')
      } else {
        this.weaving_flag = true
        this.easyWeaving_flag = true
      }
    },
    addWeaving () {
      this.weaving_data.push({
        company_id: '',
        product_name: '',
        part_id: '',
        price: '',
        number: '',
        complete_time: '',
        part_data: [],
        desc: ''
      })
    },
    deleteWeaving (index) {
      if (this.weaving_data.length === 1) {
        this.weaving_flag = false
      }
      this.weaving_data.splice(index, 1)
    },
    cancleWeaving () {
      this.weaving_data = []
      this.weaving_flag = false
    },
    saveWeaving () {
      let errorFlag = false
      let errMsg = ''
      this.weaving_data.forEach((item) => {
        if (!item.company_id) {
          errorFlag = true
          errMsg = '请选择织造单位'
        } else if (!item.product_name) {
          errorFlag = true
          errMsg = '请选择产品尺码颜色'
        } else if (!item.part_id) {
          errorFlag = true
          errMsg = '请选择产品信息'
        } else if (!item.number) {
          errorFlag = true
          errMsg = '请输入分配数量'
        } else if (!item.price) {
          errorFlag = true
          errMsg = '请输入单价信息'
        } else if (!item.complete_time) {
          errorFlag = true
          errMsg = '请选择截至日期'
        }
      })
      if (errorFlag) {
        this.$message.error(errMsg)
        return
      }
      let formData = this.weaving_data.map((item) => {
        let finded = this.partDataArr = this.productArr.find((itemFind) => itemFind.name === item.product_name)
        return {
          order_id: this.$route.params.id,
          order_type: 1,
          product_id: item.part_id, // 配件id
          client_id: item.company_id,
          complete_time: this.$getTime(item.complete_time),
          desc: item.desc,
          price: item.price,
          number: item.number,
          size: finded.size,
          color: finded.color
        }
      })
      weave.create({
        data: formData
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('分配成功，请刷新页面后查看织造分配数量')
        }
      })
    },
    selectPart (index, name) {
      this.weaving_data[index].part_data = this.productArr.find((item) => item.name === name).part_data
    },
    // 填写公共信息
    commonFn () {
      this.weaving_data.forEach((item) => {
        item.company_id = this.commonCompany
        item.price = this.commonPrice
        item.complete_time = this.commonDate
        this.easyWeaving_flag = false
      })
    },
    deleteLog (id, index) {
      this.$confirm('请确认该分配信息还未出库物料', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        weave.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!请刷新页面后查看分配信息变化'
            })
            this.weaving_log.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    replenishFn (data) {
      data.childrenMergeInfo.forEach((item) => {
        item.material_assign.forEach((itemMat) => {
          let name = itemMat.material_name + '/' + itemMat.material_attribute
          if (!this.replenish_yarn.find((itemFind) => itemFind.name === name)) {
            this.replenish_yarn.push({
              name: name
            })
          }
        })
      })
      this.replenish_data.yarn_info.push({
        yarn: '',
        weight: ''
      })
      this.replenish_data.client_info = {
        partyA: {
          name: data.client_name,
          id: data.client_id,
          percent: ''
        },
        partyB: {
          name: '本厂',
          id: null,
          percent: ''
        }
      }
      this.replenish_flag = true
    },
    addReplenish () {
      this.replenish_data.yarn_info.push({
        yarn: '',
        weight: ''
      })
    },
    deleteReplenish (index) {
      this.replenish_data.yarn_info.splice(index, 1)
    },
    saveReplenish () {
      let errorFlag = false
      let errMsg = ''
      if (Number(this.replenish_data.client_info.partyA.percent) + Number(this.replenish_data.client_info.partyB.percent) !== 100) {
        errorFlag = true
        errMsg = '请保证承担比例相加等于100%'
      }
      this.replenish_data.yarn_info.forEach((item) => {
        if (!item.yarn) {
          errorFlag = true
          errMsg = '你有未选择的纱线原料'
        } else if (!item.weight) {
          errorFlag = true
          errMsg = '你有未填写的补纱重量'
        }
      })
      if (errorFlag) {
        this.$message.error(errMsg)
        return
      }
      let formData = {
        type: 1,
        id: null,
        order_id: this.$route.params.id,
        yarn_info: this.replenish_data.yarn_info.map((item) => {
          return {
            weight: item.weight,
            name: item.yarn.split('/')[0],
            color: item.yarn.split('/')[1]
          }
        }),
        client_info: [{
          percent: this.replenish_data.client_info.partyA.percent,
          client_name: this.replenish_data.client_info.partyA.name,
          client_id: this.replenish_data.client_info.partyA.id
        }, {
          percent: this.replenish_data.client_info.partyB.percent,
          client_name: this.replenish_data.client_info.partyB.name,
          client_id: this.replenish_data.client_info.partyB.id
        }],
        desc: this.replenish_data.desc,
        replenish_client: this.replenish_data.client_info.partyA.id
      }
      replenish.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('补纱成功,请通知物料管理员订购/调取所需物料')
          this.replenish_flag = false
        }
      })
    },
    deleteReplenishLog (id, index) {
      this.$confirm('请确认是否删除该日志', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        replenish.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!请刷新页面后查看补纱信息变化'
            })
            this.replenish_log.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted () {
    Promise.all([order.detail({
      id: this.$route.params.id
    }), materialPlan.init({
      order_id: this.$route.params.id,
      order_type: 1
    }), client.list(), weave.detail({
      order_id: this.$route.params.id,
      order_type: 1
    }), replenish.list({
      order_id: this.$route.params.id,
      order_type: 1
    })]).then((res) => {
      this.orderInfo = res[0].data.data
      let productInfo = res[1].data.data.product_info
      productInfo.forEach((item) => {
        item.part_data.forEach((itemChild) => {
          itemChild.number = itemChild.size_info.find((itemFind) => itemFind.measurement === item.size).number * item.numbers
          itemChild.color = item.color
          itemChild.size = item.size
        })
        item.part_data.unshift({
          name: '大身',
          number: item.numbers,
          id: item.product_id,
          color: item.color,
          size: item.size
        })
      })
      this.weaving_info = this.$mergeData(productInfo, { mainRule: 'product_code/product_code', otherRule: [{ name: 'category_name' }, { name: 'type_name' }, { name: 'style_name' }] })
      this.weaving_info.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          this.productArr.push({
            name: item.product_code + '(' + itemChild.size + '/' + itemChild.color + ')',
            code: item.product_code,
            color: itemChild.color,
            size: itemChild.size,
            part_data: itemChild.part_data
          })
        })
      })
      this.companyArr = res[2].data.data.filter((item) => {
        return item.type.indexOf(4) !== -1
      })
      this.weaving_log = res[3].data.data
      this.weaving_detail = this.$mergeData(this.weaving_log, { mainRule: 'client_name', otherRule: [{ name: 'client_id' }] })
      // 根据织造日志统计一下分配数量
      this.weaving_info.forEach((item) => {
        item.childrenMergeInfo.forEach((itemChild) => {
          itemChild.part_data.forEach((itemPart) => {
            itemPart.weavingNum = this.weaving_log.filter((item) => {
              return item.product_id === itemPart.id && item.size === itemPart.size && item.color === itemPart.color
            }).reduce((total, current) => {
              return total + current.number
            }, 0)
          })
        })
      })
      this.replenish_log = res[4].data.data
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/weavingProcessing/weavingDetail.less";
</style>
