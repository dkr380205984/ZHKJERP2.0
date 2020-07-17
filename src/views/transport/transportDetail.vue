<template>
  <div id="transportDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">运货编号：</span>
            <span class="text">{{detail.code}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">运输单位：</span>
            <span class="text">{{detail.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">运输单价：</span>
            <span class="text">{{detail.price}}m³/元</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">运输总价：</span>
            <span class="text">{{detail.total_price}}元</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">总件数：</span>
            <span class="text">{{detail.total_number}}件</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">总毛重：</span>
            <span class="text">{{detail.total_gross_weight}}kg</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">总体积：</span>
            <span class="text">{{detail.cubic_number}}m³</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{detail.desc}}</span>
          </div>
        </div>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="tableCtn">
            <div class="head">包含进仓单</div>
            <div class="body">
              <div class="body_item"
                v-for="(item,index) in detail.stock_card_info"
                :key="index">
                <div class="row_item">
                  <span class="col_item flex3">
                    <span class="label">进仓单{{chinaNum[index]}}：</span>
                    <span class="text blueLink"
                      @click="$router.push('/warehouse/warehouseDetail/' + item.id + '?DC=1')">{{item.code}}</span>
                  </span>
                </div>
                <div class="row_item">
                  <span class="col_item flex3">
                    <span class="label">总件数：</span>
                    <span class="text">{{item.total_number}}件</span>
                  </span>
                  <span class="col_item flex3">
                    <span class="label">总重量：</span>
                    <span class="text">{{item.total_gross_weight}}kg</span>
                  </span>
                  <span class="col_item flex3">
                    <span class="label">总体积：</span>
                    <span class="text">{{item.cubic_number}}m³</span>
                  </span>
                </div>
                <div class="row_item">
                  <span class="col_item">
                    <span class="label">运输地址：</span>
                    <span class="text">{{item.address ? JSON.parse(item.address).join(',') : ''}}</span>
                  </span>
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
          <div class="btn btnRed"
            @click="deleteTransport">删除</div>
          <div class="btn btnBlue">打印</div>
          <div class="btn btnOrange"
            @click="changeShowPopup">修改</div>
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
              <el-select v-model="popupData.client_id"
                filterable
                placeholder="请选择运输单位">
                <el-option v-for="item in clientList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
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
              <zh-input v-model="popupData.cubic_number"
                placeholder="总体积(m³)"
                style="flex:1"
                @input="popupData.total_price = $toFixed(popupData.cubic_number * popupData.price || 0)">
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
                @input="popupData.total_price = $toFixed(popupData.cubic_number * popupData.price || 0)">
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
                v-model="popupData.desc">
              </el-input>
            </span>
          </div>
        </div>
        <div class="content"
          style="max-height:200px">
          <template v-for="(item,index) in popupData.stock_card_info">
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
import { chinaNum } from '@/assets/js/dictionary.js'
import { transport, client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      chinaNum: chinaNum,
      detail: {
        stock_card_info: []
      },
      showPopup: false,
      popupData: {},
      clientList: [],
      cityArr: [
        { value: '上海市' },
        { value: '杭州市' },
        { value: '宁波市' },
        { value: '义乌市' }
      ]
    }
  },
  methods: {
    getDetail () {
      this.loading = true
      transport.detail({
        id: this.$route.params.id
      }).then(res => {
        if (res.data.status !== false) {
          this.detail = res.data.data
        }
        this.loading = false
      })
    },
    deleteTransport () {
      this.$confirm(`此操作将永久删除编号为“${this.detail.code}”的运输货款单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        transport.delete({
          id: this.$route.params.id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$router.push('/transport/transportList/page=1&&keyword=&&date=&&clientId=')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changeShowPopup () {
      if (this.clientList.length === 0) {
        this.loading = true
        client.list().then(res => {
          if (res.data.status !== false) {
            this.clientList = res.data.data.filter(itemF => itemF.type.indexOf(8) !== -1)
            this.popupData = this.$clone(this.detail)
            this.popupData.client_id = this.popupData.client_id.toString()
            this.popupData.stock_card_info.forEach(itemF => {
              itemF.address_city = itemF.address ? JSON.parse(itemF.address)[0] : ''
              itemF.address_sup = itemF.address ? JSON.parse(itemF.address)[1] : ''
            })
            this.showPopup = true
            this.loading = false
          }
        })
      } else {
        this.popupData = this.$clone(this.detail)
        this.popupData.client_id = this.popupData.client_id.toString()
        this.popupData.stock_card_info.forEach(itemF => {
          itemF.address_city = itemF.address ? JSON.parse(itemF.address)[0] : ''
          itemF.address_sup = itemF.address ? JSON.parse(itemF.address)[1] : ''
        })
        this.showPopup = true
      }
    },
    closePopup () {
      this.popupData = {}
      this.showPopup = false
    },
    saveTransport () {
      if (!this.popupData.client_id) {
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
      if (!this.popupData.cubic_number) {
        this.$message.error('请输入总体积')
        return
      }
      // if (!this.popupData.price) {
      //   this.$message.error('请输入运输单价')
      //   return
      // }
      if (!this.popupData.total_price) {
        this.$message.error('请输入总价')
        return
      }
      let data = {
        id: this.$route.params.id,
        client_id: this.popupData.client_id,
        total_number: this.popupData.total_number,
        total_gross_weight: this.popupData.total_gross_weight,
        price: this.popupData.price || null,
        total_price: this.popupData.total_price,
        cubic_number: this.popupData.cubic_number,
        desc: this.popupData.desc,
        stock_card_id: this.popupData.stock_card_info.map(itemM => itemM.id)
      }
      transport.create(data).then(res => {
        if (res.data.status !== false) {
          this.$message.success('修改成功')
          this.closePopup()
          this.getDetail()
        }
      })
    }
  },
  mounted () {
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/transport/transportDetail.less";
</style>
