<template>
  <div id='documentCreate'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">选择订单</span>
      </div>
      <div class="listCtn hasBorderTop">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              placeholder="请输入订单号精确查询"
              v-model="order_code"
              @change="getOrderList(1)"></el-input>
            <el-cascader v-model="client_id"
              class="inputs"
              :show-all-levels='false'
              placeholder="筛选公司"
              :options="companyArr"
              :filter-method='searchClient'
              clearable
              :props="{ expandTrigger: 'hover' }"
              @change="getOrderList(1)"
              filterable></el-cascader>
            <el-date-picker v-model="date"
              style="width:290px"
              class="inputs"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getOrderList(1)">
            </el-date-picker>
          </div>
          <div class="rightCtn">
            <div class="btn btnGray"
              style="margin-left:0"
              @click="resetFilter">重置</div>
          </div>
        </div>
        <div class="tableCtnLv2 minHeight5">
          <div class="tb_header">
            <div class="tb_row">订单号</div>
            <div class="tb_row flex12">订单公司</div>
            <div class="tb_row middle">产品图片</div>
            <div class="tb_row flex16 tb_col">
              <div class="tb_col_item">
                <div class="tb_row flex08">产品编号</div>
                <div class="tb_row flex08">下单数量(件)</div>
              </div>
            </div>
            <div class="tb_row flex08">订单数量(件)</div>
            <div class="tb_row middle">下单时间</div>
            <div class="tb_row middle">订单状态</div>
            <div class="tb_row">创建人</div>
            <div class="tb_row middle flex04">选中</div>
          </div>
          <div class="tb_content"
            style="overflow:hidden"
            v-for="(itemOrder,indexOrder) in orderList"
            :key="indexOrder">
            <div class="tb_row">{{itemOrder.order_code}}</div>
            <div class="tb_row flex12">{{itemOrder.client_name}}</div>
            <div class="tb_row middle">
              <zh-img-list :list="itemOrder.images || []"
                type='open'></zh-img-list>
            </div>
            <div class="tb_row flex16 tb_col"
              style="position: relative;">
              <template v-for="(itemPro,indexPro) in itemOrder.product_info">
                <div :class="`tb_col_item showProItem ${itemOrder.nowProIndex === indexPro && (itemOrder.direction && 'activeB' || 'activeT')} ${itemOrder.beforeProIndex === indexPro && (itemOrder.direction && 'outActiveB' || 'outActiveT')}`"
                  :key="indexPro">
                  <div class="tb_row flex08">{{itemPro.product_code}}</div>
                  <div class="tb_row flex08"> {{itemPro.numbers}} </div>
                </div>
              </template>
              <template v-if="itemOrder.product_info.length > 1">
                <span class="el-icon-caret-bottom tb_row_icon tb_row_icon_bottom"
                  @click="changeNowIndex(itemOrder,1)"></span>
                <span class="el-icon-caret-top tb_row_icon tb_row_icon_top"
                  @click="changeNowIndex(itemOrder,-1)"></span>
              </template>
            </div>
            <div class="tb_row flex08"> {{itemOrder.numbers}} </div>
            <div class="tb_row middle"> {{itemOrder.order_time}} </div>
            <div class="tb_row middle"
              :class="{'red':itemOrder.status === 2003 || itemOrder.status === 2005,'green':itemOrder.status === 2004,'blue':itemOrder.status === 2002,'orange':itemOrder.status === 2001}">
              {{itemOrder.status|filterStatus}}
            </div>
            <div class="tb_row"> {{itemOrder.user_name}} </div>
            <div class="tb_row middle flex04">
              <el-checkbox v-model="itemOrder.checked"
                @change="checkedOrder($event,itemOrder)"></el-checkbox>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getOrderList">
          </el-pagination>
        </div>
        <div class="selectOrderCtn"
          v-if="checkedList.length > 0">
          <span class="label">已选订单</span>
          <div class="selectOrderItem"
            v-for="(itemOrder,indexOrder) in checkedList"
            :key="indexOrder">
            <el-input disabled
              :placeholder="itemOrder.order_code" />
            <span class="el-icon-delete deleteBtn"
              title='删除'></span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">进仓单信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">进仓单编号：</span>
            <div class="text">
              <el-input v-model="code"
                placeholder="请输入进仓单编号(未填写则由系统生成)"></el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">出货日期：</span>
            <div class="text">
              <el-date-picker v-model="out_time"
                value-format="yyyy-MM-dd"
                style="width:100%"
                type="date"
                placeholder="选择出货日期">
              </el-date-picker>
            </div>
          </div>
          <div class="colCtn">
            <span class="label">运输地址：</span>
            <div class="text"
              style="display:flex">
              <el-select v-model="address_city"
                style="width:280px"
                placeholder="请选择城市">
                <el-option v-for="item in cityArr"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="address_sup"
                placeholder="请输入详细地址"
                style="margin-left:16px"></el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">总件数：</span>
            <div class="text">
              <el-input v-model="total_number"
                placeholder="总件数(件)">
                <template slot="append">件</template>
              </el-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">总毛重：</span>
            <div class="text">
              <el-input v-model="total_gross_weight"
                placeholder="总毛重(kg)">
                <template slot="append">kg</template>
              </el-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">总体积：</span>
            <div class="text">
              <el-input v-model="total_vol"
                placeholder="总体积(m³)">
                <template slot="append">m³</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <div class="text">
              <el-input type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="remark">
              </el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">相关文件：</span>
            <div class="text">
              <!-- :file-list="file_url" -->
              <el-upload class="upload"
                multiple
                action="https://upload.qiniup.com/"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                ref="fileUpload"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">上传的文件不可超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">取消</div>
          <div class="btn btnBlue"
            @click="saveAll">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyType, cityArr } from '@/assets/js/dictionary.js'
import { getToken, client, order, warehouse } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: false,
      order_code: '',
      client_id: '',
      companyArr: [],
      date: '',
      orderList: [],
      pages: 1,
      limit: 5,
      total: 1,
      checkedList: [],
      code: '',
      out_time: '',
      address_city: '',
      cityArr,
      address_sup: '',
      total_number: '',
      total_gross_weight: '',
      total_vol: '',
      remark: '',
      postData: { token: '' }
    }
  },
  methods: {
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
    saveAll () {
      if (this.$submitLock()) return
      if (this.checkedList.length === 0) {
        this.$message.warning('请勾选订单')
        return
      }
      if (!this.out_time) {
        this.$message.error('请选择出货时间')
        return
      }
      if (!this.address_city) {
        this.$message.error('请选择运输城市')
        return
      }
      if (!this.total_number) {
        this.$message.error('请输入总件数')
        return
      }
      if (!this.total_gross_weight) {
        this.$message.error('请输入总毛重')
        return
      }
      if (!this.total_vol) {
        this.$message.error('请输入总体积')
        return
      }
      let fileUrl = this.$refs.fileUpload.uploadFiles.map((item) => { return (!item.response ? item.url : ('https://file.zwyknit.com/' + item.response.key)) })
      warehouse.create({
        // id: this.$route.params.id,
        order_ids: this.checkedList.map(itemM => itemM.id),
        complete_time: this.out_time,
        code: this.code,
        address: JSON.stringify([this.address_city, this.address_sup]),
        total_number: this.total_number,
        total_gross_weight: this.total_gross_weight,
        cubic_number: this.total_vol,
        desc: this.remark || '',
        file_url: fileUrl
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.$router.replace(`/warehouse/warehouseDetail/${res.data.data}`)
        }
      })
    },
    checkedOrder (type, item) {
      const findIndex = this.checkedList.findIndex(itemF => itemF.id === item.id)
      if (type && findIndex < 0) {
        this.checkedList.push(item)
      } else if (!type && findIndex >= 0) {
        this.checkedList.splice(findIndex, 1)
      }
    },
    changeNowIndex (item, number) {
      item.direction = number > 0
      item.beforeProIndex = item.nowProIndex
      const nextIndex = item.nowProIndex + number
      item.nowProIndex = (nextIndex >= 0) ? (nextIndex % item.product_info.length) : (item.product_info.length - 1)
    },
    getOrderList (pages = 1, limit = this.limit) {
      this.loading = true
      order.list({
        page: pages,
        limit,
        keyword: this.order_code || '',
        client_id: (this.client_id && this.client_id[1]) || '',
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
      }).then(res => {
        if (res.data.data.status === false) return
        this.orderList = res.data.data.map(itemM => {
          return {
            checked: !!this.checkedList.find(itemF => itemF.id === itemM.id),
            id: itemM.id,
            order_code: itemM.order_code,
            client_name: itemM.client_name,
            images: this.$unique(itemM.product_info.map(itemMPI => itemMPI.image).flat(1), 'id'),
            product_info: itemM.product_info,
            nowProIndex: 0,
            beforeProIndex: null,
            numbers: itemM.product_info.map(itemMN => (+itemMN.numbers || 0)).reduce((total, current) => total + current, 0),
            order_time: itemM.order_time,
            status: itemM.status,
            user_name: itemM.user_name
          }
        })
        this.total = res.data.meta.total
        this.loading = false
      })
    },
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
    resetFilter () {
      this.order_code = ''
      this.client_id = ''
      this.date = ''
      this.getOrderList(1)
    }
  },
  mounted () {
    this.getOrderList()
    Promise.all([
      getToken(),
      client.list()
    ]).then(res => {
      this.postData.token = res[0].data.data
      this.companyArr = this.$getClientOptions(res[1].data.data, companyType, { type: [1, 2] })
    })
  },
  filters: {
    filterStatus (status) {
      if (status === 2001) {
        return '已创建'
      } else if (status === 2002) {
        return '进行中'
      } else if (status === 2003) {
        return '已取消'
      } else if (status === 2004) {
        return '已完成'
      } else if (status === 2005) {
        return '已延期'
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/warehouse/warehouseCreate.less";
</style>
