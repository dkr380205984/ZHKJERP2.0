<template>
  <div id='stockList'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              placeholder="请输入编号查询"></el-input>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
          <div class="leftCtn">
            <div class="btn btnBlue"
              @click="showPopup=true">添加仓库</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col flex12">
              <span class="text">仓库名称</span>
            </div>
            <div class="col flex12">
              <span class="text">仓库类型</span>
            </div>
            <div class="col">
              <span class="text">仓库管理员</span>
            </div>
            <div class="col middle flex08">
              <span class="text">备注</span>
            </div>
            <div class="col middle">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in stockList"
            :key="index">
            <div class="col flex12">{{item.name}}</div>
            <div class="col flex12">
              <div class='typeCtn active'
                v-show="item.type.indexOf(1) !== -1">原</div>
              <div class='typeCtn active'
                v-show="item.type.indexOf(2) !== -1">辅</div>
              <div class='typeCtn active'
                v-show="item.type.indexOf(3) !== -1">包</div>
              <div class='typeCtn active'
                v-show="item.type.indexOf(4) !== -1">产</div>
              <!-- <div :class="{'typeCtn':true,'active':item.type.indexOf(1) !== -1}">原</div>
              <div :class="{'typeCtn':true,'active':item.type.indexOf(2) !== -1}">辅</div>
              <div :class="{'typeCtn':true,'active':item.type.indexOf(3) !== -1}">包</div>
              <div :class="{'typeCtn':true,'active':item.type.indexOf(4) !== -1}">产</div> -->
            </div>
            <div class="col">{{'仓库管理员'}}</div>
            <div class="col middle flex08">
              <template v-if="item.desc">
                <el-popover placement="top"
                  width="200"
                  trigger="click"
                  :content="item.desc">
                  <span class="btn noBorder">查看</span>
                </el-popover>
              </template>
              <template v-else>暂无</template>
            </div>
            <div class="col middle">
              <span class="opr orange"
                @click="updatedStock(item)">修改</span>
              <span class="opr"
                @click="$router.push('/stock/stockDetail/' + item.id + '/' + item.type[0])">详情</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getStockList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPopup">
      <div class="main">
        <div class="title">
          <span class="text">新增仓库</span>
          <span class="el-icon-close"
            @click="showPopup = false"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">仓库名称：</span>
            <span class="info">
              <zh-input placeholder="请输入仓库名称"
                v-model="popupInfo.stockName"></zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">仓库类型：</span>
            <span class="info">
              <el-select v-model="popupInfo.stockType"
                placeholder="请选择仓库类型">
                <el-option v-for="item in stockTypeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">仓库管理员：</span>
            <span class="info">
              <el-select v-model="popupInfo.admin"
                multiple
                filterable
                placeholder="请选择管理员">
                <el-option v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">仓库备注：</span>
            <span class="info">
              <el-input type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入仓库备注"
                v-model="popupInfo.remark">
              </el-input>
            </span>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="showPopup = false">取消</div>
          <div class="btn btnBlue">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { stock, auth } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      keyword: '',
      showPopup: false,
      stockType: '',
      stockTypeArr: [
        {
          id: 1,
          name: '原料仓库'
        },
        {
          id: 2,
          name: '辅料仓库'
        },
        {
          id: 3,
          name: '包装辅料仓库'
        },
        {
          id: 4,
          name: '产品仓库'
        }
      ],
      stockList: [],
      popupInfo: {
        stockName: '',
        stockType: '',
        admin: [],
        remark: ''
      },
      userList: [],
      pages: 1,
      total: 1
    }
  },
  methods: {
    getStockList () {
      stock.list().then(res => {
        if (res.data.status) {
          this.stockList = res.data.data.data
          this.stockList.forEach(item => {
            item.type = JSON.parse(item.type)
          })
        } else {
          this.$message.error(res.data.message)
        }
        this.loading = false
      })
    },
    updatedStock (item) {
      console.log(item)
    }
  },
  created () {
    this.getStockList()
    auth.list().then(res => {
      if (res.data.status) {
        this.userList = res.data.data
      } else {
        this.$message.error(res.data.message)
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/stock/stockList.less";
</style>
