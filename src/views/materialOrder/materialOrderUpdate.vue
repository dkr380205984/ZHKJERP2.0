<template>
  <div id="materialOrderUpdate"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">原料订购</span>
        <el-switch class="atTitle"
          style="margin-bottom:3px"
          v-model="state"
          active-color="#1A95FF"
          inactive-color="#dcdfe6"
          :active-text="state?'合计模式开启':'合计模式关闭'">
        </el-switch>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="normalTb"
          style="margin-right:104px">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">原料信息</div>
              <div class="tcolumn">原料颜色</div>
              <div class="tcolumn">预定购单价</div>
              <div class="tcolumn">预定数量</div>
              <div class="tcolumn flexCenter">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in material_info"
              :key="index">
              <div class="tcolumn">
                <span class="inputs">
                  <el-autocomplete v-model="item.material_name"
                    :fetch-suggestions="searchMaterial"
                    placeholder="请输入原料名称">
                  </el-autocomplete>
                </span>
              </div>
              <div class="tcolumn">
                <span class="inputs">
                  <el-autocomplete v-model="item.color_code"
                    :fetch-suggestions="searchColor"
                    placeholder="请输入原料颜色">
                  </el-autocomplete>
                </span>
              </div>
              <div class="tcolumn">
                <zh-input type="positiveNumber"
                  placeholder="请输入单价"
                  v-model="item.price">
                  <template slot="append">元/kg</template>
                </zh-input>
              </div>
              <div class="tcolumn">
                <zh-input v-if="!state"
                  type="positiveNumber"
                  placeholder="请输入数量"
                  :errorShow="false"
                  v-model="item.weight"
                  @change="cmpWeight">
                  <template slot="append">kg</template>
                </zh-input>
                <span v-if="state">--</span>
              </div>
              <div class="tcolumn">
                <div class="tcolumn flexCenter">
                  <span class="opr"
                    @click="copyMaterial(index)">复制</span>
                  <span class="opr"
                    @click="deleteMaterial(index)">删除</span>
                </div>
              </div>
            </div>
            <div class="addRow"
              @click="addMaterial">+ 新增原料</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">订购单位</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select placeholder="请选择订购单位"
                filterable
                v-model="company">
                <el-option v-for="(item,index) in companyArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">预付款</span>
              <span class="explanation">(必填，不填则为0元)</span>
            </div>
            <div class="content">
              <zh-input type="positiveNumber"
                placeholder="请输入数字"
                v-model="total_price"
                errorMessage="请填写正确数字">
                <template slot="append">元</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">订购日期</span>
              <span class="explanation">(必填，默认为今天)</span>
            </div>
            <div class="content">
              <el-date-picker v-model="order_time"
                value-format="yyyy-MM-dd"
                style="width:100%"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">订购总量</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-input placeholder="请输入数字"
                :disabled="!state"
                v-model="total_weight">
                <template slot="append">kg</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">
              <span class="text">备注</span>
            </span>
            <span class="content autoHeight">
              <el-input type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="remark"
                placeholder="请输入备注信息"></el-input>
            </span>
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
            @click="submit">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { client, yarn, yarnColor, materialOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      state: false,
      material_info: [{
        material_name: '',
        color_code: '',
        price: '',
        weight: '',
        desc: ''
      }],
      colorArr: [],
      materialArr: [],
      companyArr: [],
      company: '',
      remark: '',
      total_weight: '',
      total_price: '',
      order_time: this.$getTime()
    }
  },
  methods: {
    searchMaterial (queryString, cb) {
      let result = queryString ? this.materialArr.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.materialArr
      cb(result)
    },
    searchColor (queryString, cb) {
      let result = queryString ? this.colorArr.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.colorArr
      cb(result)
    },
    addMaterial () {
      this.material_info.push({
        material_name: '',
        color_code: '',
        price: '',
        weight: '',
        desc: ''
      })
    },
    deleteMaterial (index) {
      if (this.material_info.length > 1) {
        this.material_info.splice(index, 1)
        this.cmpWeight()
      } else {
        this.$message.error('至少订购一种原料')
      }
    },
    copyMaterial (index) {
      this.material_info.splice(index, 0, JSON.parse(JSON.stringify(this.material_info[index])))
      this.cmpWeight()
    },
    // 计算总量
    cmpWeight () {
      if (!this.state) {
        this.total_weight = this.material_info.reduce((total, current) => {
          if (Number(current.weight)) {
            return total + Number(current.weight)
          } else {
            return total + 0
          }
        }, 0)
      }
    },
    submit () {
      let errorMsg = ''
      this.material_info.forEach((item) => {
        if (!item.material_name) {
          errorMsg = '请输入原料名称'
        } else if (!item.material_name) {
          errorMsg = '请输入原料颜色'
        } else if (!item.price) {
          errorMsg = '请输入预定购单价'
        } else if (!this.state && !item.weight) {
          errorMsg = '请输入原料数量'
        }
      })
      if (!this.company) {
        errorMsg = '请选择订购单位'
      }
      if (!this.total_price) {
        this.total_price = 0
      }
      if (!this.order_time) {
        errorMsg = '请选择订购日期'
      }
      if (errorMsg) {
        this.$message.error(errorMsg)
        return
      }
      let formData = {
        id: this.$route.params.id,
        type: this.state ? 2 : 1,
        client_id: this.company,
        total_weight: this.total_weight,
        order_time: this.order_time,
        desc: this.remark,
        total_price: this.total_price,
        material_info: this.material_info
      }
      materialOrder.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/materialOrder/materialOrderDetail/' + this.$route.params.id
            this.msgContent = '<span style="color:#E6A23C">修改</span>了一个物料预订购'
            this.msgSwitch = true
          } else {
            this.$router.push('/materialOrder/materialOrderDetail/' + this.$route.params.id)
          }
        }
      })
    }
  },
  mounted () {
    Promise.all([client.list({
      type: 2
    }), yarn.list(), yarnColor.list(), materialOrder.detail({
      id: this.$route.params.id
    })]).then((res) => {
      this.companyArr = res[0].data.data
      this.materialArr = res[1].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      this.colorArr = res[2].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      let data = res[3].data.data
      this.order_time = data.order_time
      this.state = data.type === 2
      this.company = data.client_id.toString()
      this.total_price = data.total_price
      this.total_weight = data.total_weight
      this.remark = data.desc
      this.material_info = data.material_info.map((item) => {
        return { material_name: item.material_name,
          color_code: item.color_code,
          price: item.price,
          weight: item.weight,
          desc: ''
        }
      })
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/materialOrder/materialOrderUpdate.less";
</style>
