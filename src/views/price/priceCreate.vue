<template>
  <div id="priceCreate"
    class="indexMain"
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">基本信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">外贸公司</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="client_id"
                placeholder="请选择外贸公司">
                <el-option v-for="item in clientArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">联系人</span>
            </span>
            <span class="content">
              <el-select v-model="contact_id"
                placeholder="请选择联系人">
                <el-option v-for="item in contactsArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">结算单位</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="unit"
                placeholder="请选择结算单位">
                <el-option v-for="item in unitArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">汇率</span>
              <span class="explanation">(必填,例：100人民币=600美元)</span>
            </span>
            <span class="content">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="请输入汇率"
                v-model="exchangeRate">
              </zh-input>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">产品筛选</span>
      </div>
      <div class="listCtn hasBorderTop"
        style="padding-bottom:0">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              placeholder="请输入编号查询"
              v-model="searchCode"></el-input>
            <el-date-picker class="inputs"
              v-model="date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">编号</span>
            </div>
            <div class="col">
              <transition v-show="!searchTypeFlag"
                name="el-zoom-in-bottom">
                <span class="text">品类
                  <i class="el-icon-search iconBtn"
                    @click="searchTypeFlag=true"></i>
                </span>
              </transition>
              <transition name="el-zoom-in-top">
                <div v-show="searchTypeFlag"
                  class="filterBox">
                  <el-cascader class="filter"
                    placeholder="筛选品类"
                    :options="treeData"
                    clearable
                    filterable></el-cascader>
                </div>
              </transition>
            </div>
            <div class="col">
              <span class="text">花型</span>
            </div>
            <div class="col">
              <span class="text">名称</span>
            </div>
            <div class="col">
              <span class="text">图片</span>
            </div>
            <div class="col">
              <span class="text">创建人</span>
            </div>
            <div class="col">
              <span class="text">创建时间
                <span class="iconCtn">
                  <i class="el-icon-caret-top active"></i>
                  <i class="el-icon-caret-bottom"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in productList"
            :key="index">
            <div class="col">{{item.product_code}}</div>
            <div class="col">{{item|filterType}}</div>
            <div class="col">{{item.flower_id}}</div>
            <div class="col">{{item.sample_title}}</div>
            <div class="col">
              <zh-img-list :list="item.img"></zh-img-list>
            </div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.create_time}}</div>
            <div class="col">
              <div :class="{'stateCtn':true, 'green':item.has_craft === 1}">
                <div class="state"></div>
                <span class="name">工</span>
              </div>
              <div :class="{'stateCtn':true, 'green':item.has_plan === 1}">
                <div class="state"></div>
                <span class="name">配</span>
              </div>
              <div :class="{'stateCtn':true, 'green':item.quotation_id === 1}">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
              <div :class="{'stateCtn':true, 'green':false}">
                <div class="state"></div>
                <span class="name">样</span>
              </div>
            </div>
            <div class="col">
              <el-checkbox v-model="item.checked"
                @change="checkedPro($event,item)"></el-checkbox>
            </div>
          </div>
        </div>
      </div>
      <div class="editCtn"
        style="padding-top:0">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">
              <span class="text">已选产品</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content"
              v-if="checkedProList.length === 0">暂无已选产品</span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="item in checkedProList"
          :key="item.id">
          <div class="colCtn flex3">
            <span class="content">
              <el-select v-model="item.id"
                disabled
                placeholder="请选择产品">
                <el-option v-for="item in checkedProList"
                  :key="item.id"
                  :label="item.product_code"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">产品报价</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn"
          v-for="(item,index) in priceInfo.raw_material"
          :key="index + 'raw_material'">
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text">产品原料</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="item.name"
                placeholder="请选择原料">
                <el-option v-for="item in clientArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text"></span>
            </span>
            <span class="content samllInput">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="克重"
                v-model="item.weight">
                <template slot="append">g</template>
              </zh-input>
              <zh-input type="number"
                class="hasMarginLeft"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="单价"
                v-model="item.price">
                <template slot="append">元/kg</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text"></span>
            </span>
            <span class="content samllInput">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="损耗"
                v-model="item.prop">
                <template slot="append">%</template>
              </zh-input>
              <zh-input type="number"
                class="hasMarginLeft"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="总价"
                v-model="item.total_price">
                <template slot="append">元</template>
              </zh-input>
              <div class="editBtn addBtn"
                v-if="index === 0"
                @click="addInfo(priceInfo.raw_material,'material')">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteInfo(priceInfo.raw_material,index)">删除</div>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in priceInfo.other_material"
          :key="index + 'other_material'">
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text">产品辅料</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="item.name"
                placeholder="请选择辅料">
                <el-option v-for="item in clientArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text"></span>
            </span>
            <span class="content samllInput">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="克重"
                v-model="item.weight">
                <template slot="append">g</template>
              </zh-input>
              <zh-input type="number"
                class="hasMarginLeft"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="单价"
                v-model="item.price">
                <template slot="append">元/kg</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text"></span>
            </span>
            <span class="content samllInput">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="损耗"
                v-model="item.prop">
                <template slot="append">%</template>
              </zh-input>
              <zh-input type="number"
                class="hasMarginLeft"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="总价"
                v-model="item.total_price">
                <template slot="append">元</template>
              </zh-input>
              <div class="editBtn addBtn"
                v-if="index === 0"
                @click="addInfo(priceInfo.other_material,'material')">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteInfo(priceInfo.other_material,index)">删除</div>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in priceInfo.weave"
          :key="index + 'weave'">
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text">织造明细</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="item.name"
                placeholder="请选择织造明细">
                <el-option v-for="item in clientArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text"></span>
            </span>
            <span class="content samllInput">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="明细"
                v-model="item.number">
                <template slot="append">针</template>
              </zh-input>
              <zh-input type="number"
                class="hasMarginLeft"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="总价"
                v-model="item.total_price">
                <template slot="append">元</template>
              </zh-input>
              <div class="editBtn addBtn"
                v-if="index === 0"
                @click="addInfo(priceInfo.weave,'weave')">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteInfo(priceInfo.weave,index)">删除</div>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in priceInfo.semi_process"
          :key="index + 'semi_process'">
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text">半成品加工</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="item.name"
                placeholder="请选择半成品加工工序">
                <el-option v-for="item in clientArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="请输入金额"
                v-model="item.total_price">
                <template slot="append">元</template>
              </zh-input>
              <div class="editBtn addBtn"
                v-if="index === 0"
                @click="addInfo(priceInfo.semi_process,'other')">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteInfo(priceInfo.semi_process,index)">删除</div>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in priceInfo.finished_process"
          :key="index + 'finished_process'">
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text">成品加工</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="item.name"
                placeholder="请选择成品加工工序">
                <el-option v-for="item in clientArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="请输入金额"
                v-model="item.total_price">
                <template slot="append">元</template>
              </zh-input>
              <div class="editBtn addBtn"
                v-if="index === 0"
                @click="addInfo(priceInfo.finished_process,'other')">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteInfo(priceInfo.finished_process,index)">删除</div>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in priceInfo.packag"
          :key="index + 'packag'">
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text">包装辅料</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-select v-model="item.name"
                placeholder="请选择包装辅料">
                <el-option v-for="item in clientArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="请输入金额"
                v-model="item.total_price">
                <template slot="append">元</template>
              </zh-input>
              <div class="editBtn addBtn"
                v-if="index === 0"
                @click="addInfo(priceInfo.packag,'other')">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteInfo(priceInfo.packag,index)">删除</div>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in priceInfo.other_fee"
          :key="index + 'other_fee'">
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text">其他费用</span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入其他费用说明"
                v-model="item.name">
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label"
              v-if="index === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="请输入金额"
                v-model="item.total_price">
                <template slot="append">元</template>
              </zh-input>
              <div class="editBtn addBtn"
                v-if="index === 0"
                @click="addInfo(priceInfo.other_fee,'other')">添加</div>
              <div class="editBtn deleteBtn"
                v-else
                @click="deleteInfo(priceInfo.other_fee,index)">删除</div>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">非生产费用</span>
            </span>
            <span class="content">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="请输入金额"
                v-model="exchangeRate">
                <template slot="append">元</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">运输费用</span>
            </span>
            <span class="content">
              <zh-input type="number"
                errorPosition="bottom"
                errorMsg="请输入数字"
                placeholder="请输入金额"
                v-model="exchangeRate">
                <template slot="append">元</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">产品成本价</span>
            </span>
            <span class="content">
              <zh-input type="number"
                disabled
                placeholder="请输入金额"
                v-model="exchangeRate">
                <template slot="append">元</template>
              </zh-input>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">订单费用</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">基本佣金</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入费用比例"
                v-model="priceInfo.basic_fee.prop">
                <template slot="append">%</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入金额"
                disabled
                v-model="priceInfo.basic_fee.price">
                <template slot="append">元</template>
              </zh-input>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">基本税费</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入费用比例"
                v-model="priceInfo.basic_tax.prop">
                <template slot="append">%</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入金额"
                disabled
                v-model="priceInfo.basic_tax.price">
                <template slot="append">元</template>
              </zh-input>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">基本利润</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入费用比例"
                v-model="priceInfo.basic_profits.prop">
                <template slot="append">%</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input placeholder="请输入金额"
                disabled
                v-model="priceInfo.basic_profits.price">
                <template slot="append">元</template>
              </zh-input>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sample } from '@/assets/js/api'
export default {
  data () {
    return {
      loading: true,
      client_id: '',
      clientArr: [],
      contact_id: '',
      contactsArr: [],
      unit: '',
      unitArr: [],
      exchangeRate: '',
      priceInfo: {
        raw_material: [
          {
            name: '',
            weight: '',
            price: '',
            prop: '',
            total_price: ''
          }
        ],
        other_material: [
          {
            name: '',
            weight: '',
            price: '',
            prop: '',
            total_price: ''
          }
        ],
        weave: [
          {
            name: '',
            number: '',
            total_price: ''
          }
        ],
        semi_process: [
          {
            name: '',
            total_price: ''
          }
        ],
        finished_process: [
          {
            name: '',
            total_price: ''
          }
        ],
        packag: [
          {
            name: '',
            total_price: ''
          }
        ],
        other_fee: [
          {
            name: '',
            total_price: ''
          }
        ],
        no_production_fee: {
          total_price: ''
        },
        transport: {
          total_price: ''
        },
        basic_fee: {
          price: '',
          prop: ''
        },
        basic_tax: {
          price: '',
          prop: ''
        },
        basic_profits: {
          price: '',
          prop: ''
        }
      },
      productList: [],
      searchTypeFlag: false,
      searchCode: '',
      date: '',
      treeData: [],
      total: 0,
      pages: 1,
      checkedProList: []
    }
  },
  methods: {
    addInfo (item, type) {
      if (type === 'material') {
        item.push({
          name: '',
          weight: '',
          price: '',
          prop: '',
          total_price: ''
        })
      } else if (type === 'weave') {
        item.push({
          name: '',
          number: '',
          total_price: ''
        })
      } else if (type === 'other') {
        item.push({
          name: '',
          total_price: ''
        })
      }
    },
    deleteInfo (item, index) {
      item.splice(index, 1)
    },
    getList () {
      this.loading = true
      sample.list({
        limit: 10,
        page: this.pages
      }).then(res => {
        if (res.data.status === false) {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        } else {
          this.productList = res.data.data
          this.total = res.data.meta.total
          this.productList.forEach(item => {
            item.img = item.img.map(val => val.image_url)
          })
        }
        this.loading = false
      })
    },
    checkedPro (flag, item) {
      if (flag) {
        this.checkedProList.push(item)
      } else {
        let canclePro = this.checkedProList.find(val => val.id === item.id)
        if (canclePro) {
          canclePro.checked = false
          this.checkedProList = this.checkedProList.filter(val => val.checked)
        }
      }
    }
  },
  created () {
    this.getList()
  },
  filters: {
    filterType (item) {
      return [item.category_info.product_category, item.type_name, item.style_name].join('/')
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/less/price/priceCreate.less";
</style>
