<template>
  <div id="materialOrderCreate"
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
        <div style="float:right;display:flex">
          <span style="float:left">
            <a class="btn noBorder"
              style="text-decoration:none; "
              href="https://zhihui.tlkrzf.com/1582167733000.xlsx"
              download>下载标准模板</a>
          </span>
          <el-upload :auto-upload="false"
            :on-change="elInFile"
            :show-file-list="false"
            action="noAction"
            ref="upload"
            class="upload-demo"
            accept=".xlsx, .xls">
            <div slot="trigger"
              class="btn btnBlue"
              style="height: 32px;line-height: 32px;"
              plain>导入excel</div>
          </el-upload>
        </div>
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
            @click="submit">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { client, yarn, yarnColor, materialOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      files: null,
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
        id: null,
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
          this.$message.success('预定购成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/materialOrder/materialOrderDetail/' + res.data.data.id
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一个物料预订购'
            this.msgSwitch = true
          } else {
            this.$router.push('/materialOrder/materialOrderDetail/' + res.data.data.id)
          }
        }
      })
    },
    // 导入excel百度版
    inFile (e) {
      this.files = (e.target || e.srcElement).files // 获取"input-file"的FileList对象
      if (!this.files || !this.files.length) { return }
      for (let i = 0, len = this.files.length; i < len; i++) { this.read(this.files[i]) }
    },
    elInFile (f, fs) {
      this.read(f.raw)
    },
    read (f) {
      let rd = new FileReader()
      rd.onload = e => { // this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
        let sheets = rd.read2JS()
        for (let name in sheets) {
          sheets[name].forEach((item) => {
            this.material_info.push({
              material_name: item['原料名称'],
              color_code: item['原料颜色'],
              price: item['单价'],
              weight: item['数量']
            })
          })
        }
        this.$message.success('导入成功，订购总量不显示的情况下只要删除第一项即可')
      }
      rd.readAsBinaryString(f)
    }
  },
  beforeCreate () {
    FileReader.prototype.read2workbook = function () {
      let redABS = false // 是否将文件读取为二进制字符串
      let bytes = new Uint8Array(this.result) // 无符号整型数组
      let wb
      if (redABS) {
        // let fix = new TextDecoder(encode || 'UTF-8').decode(bytes);
        let fix = fixdata(bytes)
        let b2a = btoa(fix) // js原生方法：将字符转为base64编码。对应的atob(base64)方法，将base64转字符
        wb = XLSX.read(b2a, {
          type: 'base64'
        })
      } else {
        let len = bytes.byteLength
        let binarys = new Array(len) // 创建定长数组，存储文本
        for (let i = 0; i < len; i++) { binarys[i] = String.fromCharCode(bytes[i]) }
        let binary = binarys.join('')
        wb = XLSX.read(binary, {
          type: 'binary'
        })
      }
      return wb // workbook
    }
    FileReader.prototype.read2 = function (format = 'json') {
      let wb = this.read2workbook()
      if (!wb) { return null }

      let r = {}
      let formats = ['json', 'formulae', 'html', 'txt', 'csv', 'dif', 'slk', 'eth'] // 可被解析的格式
      format = formats.indexOf(format) === -1 ? 'json' : format
      wb.SheetNames.forEach(name => { // 遍历每张纸数据
        r[name] = XLSX.utils['sheet_to_' + format](wb.Sheets[name])
      })
      return r
    }
    /**
   * 解析为JSON
   * @description: 此解析方式，XLSX将使用表格首行的每列名称，当作sheet数组对象的Key。
   * 故Excel每个工作表格的第一行必须有表头，且名称不可重复。
   */
    FileReader.prototype.read2JS = function () {
      return this.read2()
    }
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function (f) {
      if (!this.onload) { // 如果this未重写onload函数，则创建一个公共处理方式
        this.onload = e => { // 在this.onload函数中，完成公共处理
          let rs = this.read2workbook()
          console.log(rs)
        }
      }
      this.readAsArrayBuffer(f) // 内部会回调this.onload方法
    }

    /**
   * char值转String
   * @param data {@link Array}：char值；
   * @return {@link String}
   */
    function fixdata (data) {
      let w = 1024 << 10 // 每次读取1M字节
      let len = Math.floor(data.byteLength / w)
      let o = new Array(len)
      for (var i = 0; i < len; i++) { o[i] = String.fromCharCode.apply(null, new Uint8Array(data.slice(i * w, (i + 1) * w))) }
      o[i] = String.fromCharCode.apply(null, new Uint8Array(data.slice(i * w)))
      return o.join('')
    }
  },
  mounted () {
    Promise.all([client.list({
      type: 2
    }), yarn.list(), yarnColor.list()]).then((res) => {
      this.companyArr = res[0].data.data
      this.materialArr = res[1].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      this.colorArr = [{ value: '白胚' }].concat(res[2].data.data.map((item) => {
        return {
          value: item.name
        }
      }))
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/materialOrder/materialOrderCreate.less";
</style>
