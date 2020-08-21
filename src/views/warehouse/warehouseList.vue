<template>
  <div id='warehouseList'
    class='indexMain'
    v-loading='loading'>
    <div class="listCutCtn">
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-jincangdan"></use>
        </svg>
        <span class="name">进仓单列表</span>
      </div>
      <div class="cut_item"
        @click="$router.push('/transport/transportList/page=1&&keyword=&&date=&&clientId=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yunshuhuokuan"></use>
        </svg>
        <span class="name">运输货款列表</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                :placeholder="'输入订单号按回车键查询'">
              </el-input>
              <el-select v-model="address"
                clearable
                class="filter_item"
                placeholder="请选择城市"
                @change="changeRouter(1)">
                <el-option v-for="item in cityArr"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker v-model="date"
                style="width:290px"
                class="filter_item"
                type="daterange"
                align="right"
                unlink-panels
                clearable
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)">
              </el-date-picker>
              <div class="resetBtn"
                @click="reset">重置</div>
            </div>
          </div>
        </div>
        <div class="addCtn">
          <div class="btn btnWhiteBlue"
            @click="addTransportTable">+ 添加运输货款</div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col flex04 middle">
              <span class="text"></span>
            </div>
            <div class="col middle">
              <span class="text">出货日期</span>
            </div>
            <div class="col">
              <span class="text">进仓单编号</span>
            </div>
            <div class="col">
              <span class="text">订单号</span>
            </div>
            <div class="col middle">
              <span class="text">图片</span>
            </div>
            <div class="col flex12">
              <span class="text">运输地址</span>
            </div>
            <div class="col flex08">
              <span class="text">总件数(件)</span>
            </div>
            <div class="col flex08">
              <span class="text">总毛重(kg)</span>
            </div>
            <div class="col flex08">
              <span class="text">总体积(m³)</span>
            </div>
            <div class="col">
              <span class="text">创建人</span>
            </div>
            <div class="col middle flex12">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col flex04 middle">
              <el-checkbox v-model="itemOrder.checked"
                @change="checkedChange(itemOrder,$event)"></el-checkbox>
            </div>
            <div class="col middle">{{itemOrder.complete_time}}</div>
            <div class="col">{{itemOrder.code}}</div>
            <div class="col">{{itemOrder.order_code}}</div>
            <div class="col middle">
              <zh-img-list :list='itemOrder.image'></zh-img-list>
            </div>
            <div class="col flex12">{{itemOrder.address ? JSON.parse(itemOrder.address).join(',') : ''}}</div>
            <div class="col flex08">{{itemOrder.total_number}}</div>
            <div class="col flex08">{{itemOrder.total_gross_weight}}</div>
            <div class="col flex08">{{itemOrder.cubic_number}}</div>
            <div class="col">{{itemOrder.user_name}}</div>
            <div class="col middle flex12">
              <span class="opr blue"
                @click="$router.push('/warehouse/warehouseDetail/' + itemOrder.id)">详情</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showPopup">
      <div class="main"
        style="width:800px">
        <div class="title">
          <span class="text">添加运输货款</span>
          <span class="el-icon-close"
            @click="closePopup"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">运输单位：</span>
            <span class="info">
              <el-cascader v-model="popupData.client_id"
                :show-all-levels='false'
                placeholder="请选择运输单位"
                :options="clientList"
                :filter-method='searchClient'
                clearable
                :props="{ expandTrigger: 'hover' }"
                filterable></el-cascader>
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
                style="flex:1"
                @input="popupData.total_price = $toFixed(popupData.total_vol * popupData.price || 0)">
                <template slot="append">m³</template>
              </zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">运输单价：</span>
            <span class="info">
              <zh-input v-model="popupData.price"
                style="flex:1"
                placeholder='运输单价'
                type='number'
                @input="popupData.total_price = $toFixed(popupData.total_vol * popupData.price || 0)">
                <template slot="append">元/m³</template>
              </zh-input>
              <span class="label">总价：</span>
              <zh-input v-model="popupData.total_price"
                style="flex:1"
                placeholder='运输总价'
                type='number'>
                <template slot="append">元</template>
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
        </div>
        <div class="content"
          style="max-height:200px">
          <template v-for="(item,index) in checkedList">
            <div class="row"
              :key="'code-' + index">
              <span class="label">进仓单{{chinaNum[index]}}:</span>
              <span class="info">{{item.code}}</span>
            </div>
            <div class="row"
              :key='"address-" + index'>
              <span class="label">运输地址：</span>
              <span class="info">
                <el-select v-model="item.address_city"
                  style="width:180px"
                  disabled
                  placeholder="请选择城市">
                  <el-option v-for="item in cityArr"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
                <zh-input v-model="item.address_sup"
                  disabled
                  placeholder="请输入详细地址"
                  style="margin-left:16px"></zh-input>
              </span>
            </div>
            <div class="row"
              :key="'number-' + index">
              <span class="label">总件数：</span>
              <span class="info">
                <zh-input v-model="item.total_number"
                  disabled
                  placeholder="总件数(件)"
                  style="flex:1">
                  <template slot="append">件</template>
                </zh-input>
                <span class="label">总毛重：</span>
                <zh-input v-model="item.total_gross_weight"
                  disabled
                  placeholder="总毛重(kg)"
                  style="flex:1">
                  <template slot="append">kg</template>
                </zh-input>
                <span class="label">总体积：</span>
                <zh-input v-model="item.cubic_number"
                  disabled
                  placeholder="总体积(m³)"
                  style="flex:1">
                  <template slot="append">m³</template>
                </zh-input>
              </span>
            </div>

          </template>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="closePopup">取消</div>
          <div class="btn btnBlue"
            @click="saveTransport">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { warehouse, client, transport } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
import { chinaNum, companyType } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: false,
      chinaNum: chinaNum,
      list: [],
      keyword: '',
      address: '',
      date: '',
      pages: 1,
      total: 0,
      clientList: [],
      // 勾选数据
      checkedList: [],
      // 弹窗数据
      showPopup: false,
      popupData: {
        client_id: '',
        total_number: '',
        total_gross_weight: '',
        total_vol: '',
        price: '',
        total_price: '',
        remark: ''
      },
      cityArr: [
        { value: '上海市' },
        { value: '杭州市' },
        { value: '宁波市' },
        { value: '义乌市' }
      ]
    }
  },
  watch: {
    pages (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    searchClient (node, query) {
      let flag = true
      if (query) {
        if (new RegExp('[\u4E00-\u9FA5]+').test(query.substr(0, 1))) {
          flag = node.data.label.includes(query)
        } else {
          const queryArr = query.split('')
          for (const item of queryArr) {
            if (!node.data.name_pinyin.includes(item)) {
              flag = false
              break
            }
          }
        }
      }
      return flag
    },
    saveTransport () {
      if (!this.popupData.client_id || !this.popupData.client_id[1]) {
        this.$message.error('请选择运输单位')
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
      if (!this.popupData.total_price) {
        this.$message.error('请输入总价')
        return
      }
      let data = {
        id: null,
        client_id: this.popupData.client_id && this.popupData.client_id[1],
        total_number: this.popupData.total_number,
        total_gross_weight: this.popupData.total_gross_weight,
        price: this.popupData.price || null,
        total_price: this.popupData.total_price,
        cubic_number: this.popupData.total_vol,
        desc: this.popupData.remark,
        stock_card_id: this.checkedList.map(itemM => itemM.id)
      }
      transport.create(data).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.getList()
          this.closePopup()
        }
      })
    },
    addTransportTable () {
      if (this.clientList.length === 0) {
        client.list().then(res => {
          this.clientList = this.$getClientOptions(res.data.data, companyType, { type: [35, 36] })
        })
      }
      if (this.checkedList.length > 0) {
        this.popupData.total_number = this.checkedList.map(itemM => (+itemM.total_number || 0)).reduce((a, b) => {
          return a + b
        }, 0)
        this.popupData.total_gross_weight = this.checkedList.map(itemM => (+itemM.total_gross_weight || 0)).reduce((a, b) => {
          return a + b
        }, 0)
        this.popupData.total_vol = this.checkedList.map(itemM => (+itemM.cubic_number || 0)).reduce((a, b) => {
          return a + b
        }, 0)
      }
      this.showPopup = true
    },
    closePopup () {
      this.popupData = {
        client_id: '',
        total_number: '',
        total_gross_weight: '',
        total_vol: '',
        price: '',
        total_price: '',
        remark: ''
      }
      this.showPopup = false
    },
    deleteWarehouse (id) {
      this.$confirm(`此操作将永久删除id为${id}进仓单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    checkedChange (item, event) {
      if (event) {
        this.checkedList.push(item)
      } else {
        let index = this.checkedList.findIndex(itemF => +itemF.id === +item.id)
        if (index || index === 0) {
          this.checkedList.splice(index, 1)
        }
      }
    },
    cancelChecked () {
      this.list.forEach(item => {
        item.checked = false
      })
      this.checkedList = []
    },
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.pages = Number(params.page)
      this.keyword = params.keyword
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.address = params.address
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/warehouse/warehouseList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&address=' + this.address)
    },
    reset () {
      this.$router.push('/warehouse/warehouseList/page=1&&keyword=&&date==&&address=')
    },
    getList (pages) {
      pages = pages || 1
      this.loading = true
      warehouse.list({
        page: pages,
        limit: 10,
        order_code: this.keyword,
        city: this.address,
        start_time: this.date ? this.date[0] : '',
        end_time: this.date ? this.date[1] : ''
      }).then(res => {
        if (res.data.status !== false) {
          this.list = res.data.data.map(item => {
            return {
              ...item,
              address_city: item.address ? JSON.parse(item.address)[0] : '',
              address_sup: item.address ? JSON.parse(item.address)[1] : ''
            }
          })
          this.total = res.data.meta.total
        }
        this.loading = false
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/warehouse/warehouseList.less";
</style>
