<template>
  <div id='staffPay'
    class='indexMain'>
    <div class="module">
      <div class="titleCtn">
        <span class="title">结算单信息</span>
      </div>
      <div class="detailCtn">
        <div class="excelTable">
          <div class="title">
            <div class="block">
              <div class="selectCtn">
                <el-select v-model="department"
                  placeholder="请选择部门">
                  <el-option v-for="(item,index) in departmentArr"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="block">合计</div>
          </div>
          <div class="tabelBodyCtn">
            <div class="tabelBodyMain hasBorder">
              <div class="box">
                <div class="label">员工姓名</div>
              </div>
              <div class="box">
                <div class="label">员工编号</div>
              </div>
              <div class="box">
                <div class="label">更新日期</div>
              </div>
              <div class="box">
                <div class="label">合计</div>
              </div>
              <div class="box">
                <div class="label">操作</div>
              </div>
            </div>
          </div>
          <div class="tabelBodyCtn">
            <div class="tabelBodyMain hasBorder">
              <div class="box">
                <div class="label">员工姓名</div>
              </div>
              <div class="box">
                <div class="label">员工编号</div>
              </div>
              <div class="box">
                <div class="label">更新日期</div>
              </div>
              <div class="box">
                <div class="label">合计</div>
              </div>
              <div class="box">
                <div class="label">操作</div>
              </div>
            </div>
            <div class="tableBodyList">
              <div class="relativeCtn">
                <div class="titleList">
                  <div class="once">日期</div>
                  <div class="once">工序</div>
                  <div class="once">结算方式</div>
                  <div class="once">单价</div>
                  <div class="once">数量</div>
                  <div class="once">合计金额</div>
                  <div class="once">结算人</div>
                  <div class="once">结算时间</div>
                  <!-- 这一行仅用于占位 -->
                  <div class="once"></div>
                </div>
                <div class="addList">
                  <div class="once">日期</div>
                  <div class="once">工序</div>
                  <div class="once">结算方式</div>
                  <div class="once">单价</div>
                  <div class="once">数量</div>
                  <div class="once">合计金额</div>
                  <div class="once">结算人</div>
                  <div class="once">结算时间</div>
                  <div class="once"></div>
                </div>
                <div class="normalList">
                  <div class="once">日期</div>
                  <div class="once">工序</div>
                  <div class="once">结算方式</div>
                  <div class="once">单价</div>
                  <div class="once">数量</div>
                  <div class="once">合计金额</div>
                  <div class="once">结算人</div>
                  <div class="once">结算时间</div>
                  <div class="once"></div>
                </div>
                <div class="normalList">
                  <div class="once">日期</div>
                  <div class="once">工序</div>
                  <div class="once">结算方式</div>
                  <div class="once">单价</div>
                  <div class="once">数量</div>
                  <div class="once">合计金额</div>
                  <div class="once">结算人</div>
                  <div class="once">结算时间</div>
                  <div class="once"></div>
                </div>
                <div class="normalList">
                  <div class="once">日期</div>
                  <div class="once">工序</div>
                  <div class="once">结算方式</div>
                  <div class="once">单价</div>
                  <div class="once">数量</div>
                  <div class="once">合计金额</div>
                  <div class="once">结算人</div>
                  <div class="once">结算时间</div>
                  <div class="once"></div>
                </div>
                <div class="normalList">
                  <div class="once">日期</div>
                  <div class="once">工序</div>
                  <div class="once">结算方式</div>
                  <div class="once">单价</div>
                  <div class="once">数量</div>
                  <div class="once">合计金额</div>
                  <div class="once">结算人</div>
                  <div class="once">结算时间</div>
                  <div class="once"></div>
                </div>
              </div>
              <div class="absoluteList">
                <div class="once">操作</div>
                <div class="once">操作</div>
                <div class="once">操作</div>
                <div class="once">操作</div>
                <div class="once">操作</div>
                <div class="once">操作</div>
              </div>
            </div>
          </div>
          <div class="tabelBodyCtn">
            <div class="tabelBodyMain">
              <div class="box">
                <div class="label">员工姓名</div>
              </div>
              <div class="box">
                <div class="label">员工编号</div>
              </div>
              <div class="box">
                <div class="label">更新日期</div>
              </div>
              <div class="box">
                <div class="label">合计</div>
              </div>
              <div class="box">
                <div class="label">操作</div>
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
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { staff } from '@/assets/js/api.js'
export default {
  data () {
    return {
      department: '',
      departmentArr: []
    }
  },
  mounted () {
    staff.payList({
      page: 1,
      limit: 10
    }).then((res) => {
      console.log(res)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/staff/staffPay.less";
</style>
