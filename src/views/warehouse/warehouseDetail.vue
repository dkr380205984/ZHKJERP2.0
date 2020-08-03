<template>
  <div id="warehouseDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">基本信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">进仓编号：</span>
            <span class="text">{{detail.code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订单编号：</span>
            <span class="text blueLink"
              @click="$router.push('/order/orderDetail/' + detail.order_id)">{{detail.order_code}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">出货日期：</span>
            <span class="text">{{detail.complete_time}}</span>
          </div>
          <div class="colCtn">
            <span class="label">运输地址：</span>
            <span class="text">{{detail.address.join(',')}}</span>
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
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">文件信息：</span>
            <span class="text text-warp">
              <span v-for="(item,index) in detail.file_url"
                :key="index"
                class="linkBox">
                <i class="el-icon-view el-icon--right"></i>
                <a :href="item.url"
                  target="view_window"
                  :download="item.url">{{item.name}}</a>
              </span>
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
          <div class="btn btnRed"
            @click="deleteWarehouse"
            v-if="!$route.query.DC">删除</div>
          <div class="btn btnBlue">打印</div>
          <div class="btn btnOrange"
            @click="changeWarehouse"
            v-if="!$route.query.DC">修改</div>
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
                :file-list="popupData.file_url"
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
            @click="submit">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { warehouse, getToken } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      detail: {
        address: [],
        file_url: []
      },
      // 修改弹窗数据
      showPopup: false,
      postData: { token: '' },
      cityArr: [
        { value: '上海市' },
        { value: '杭州市' },
        { value: '宁波市' },
        { value: '义乌市' }
      ],
      popupData: {
        order_code: '',
        order_id: '',
        out_time: '',
        address_city: '',
        address_sup: '',
        total_number: '',
        total_gross_weight: '',
        total_vol: '',
        remark: '',
        file_url: []
      }
    }
  },
  methods: {
    deleteWarehouse () {
      this.$confirm(`此操作将永久删除编号为“${this.detail.code}”的进仓单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        warehouse.delete({
          id: this.$route.params.id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$router.push('/warehouse/warehouseList/page=1&&keyword=&&date=&&address=')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    init () {
      this.loading = true
      warehouse.detail({
        id: this.$route.params.id
      }).then(res => {
        if (res.data.status !== false) {
          this.detail = res.data.data
          this.detail.address = this.detail.address ? JSON.parse(this.detail.address) : []
          this.detail.file_url = JSON.parse(this.detail.file_url).map(itemM => {
            return {
              name: itemM.replace('https://zhihui.tlkrzf.com/', ''),
              url: itemM
            }
          })
          this.loading = false
        }
      })
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
    changeWarehouse () {
      getToken().then(res => {
        if (res.data.status !== false) {
          this.postData.token = res.data.data
          this.popupData = {
            order_code: this.detail.order_code,
            order_id: this.detail.order_id,
            out_time: this.detail.complete_time,
            address_city: this.detail.address[0],
            address_sup: this.detail.address[1],
            total_number: this.detail.total_number,
            total_gross_weight: this.detail.total_gross_weight,
            total_vol: this.detail.cubic_number,
            remark: this.detail.desc,
            file_url: this.$clone(this.detail.file_url)
          }
          this.showPopup = true
        }
      })
    },
    submit () {
      if (this.$submitLock()) return
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
        id: this.$route.params.id,
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
          this.$message.success('修改成功')
          this.showPopup = false
          this.init()
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/warehouse/warehouseDetail.less";
</style>
