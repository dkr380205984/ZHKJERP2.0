<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">员工信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">员工姓名</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-input v-model="staffInfo.name"
                placeholder="请输入员工姓名"></el-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">员工年龄</span>
            </div>
            <div class="content">
              <zh-input v-model="staffInfo.age"
                type="positiveNumber"
                placeholder="请输入员工年龄"></zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">员工性别</span>
            </div>
            <div class="content">
              <el-select v-model="staffInfo.sex"
                placeholder="请选择性别">
                <el-option label="男"
                  value="男"></el-option>
                <el-option label="女"
                  value="女"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">手机号</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-input v-model="staffInfo.telephone"
                placeholder="请输入员工姓名"></el-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">所属部门</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select v-model="staffInfo.department"
                placeholder="请选择部门">
                <el-option v-for="(item,index) in departmentArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">岗位</span>
            </div>
            <div class="content">
              <el-select v-model="staffInfo.station"
                placeholder="请选择岗位">
                <el-option v-for="(item,index) in stationArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">身份证号码</span>
            </div>
            <div class="content">
              <zh-input v-model="staffInfo.IDcard"
                type="IDcard"
                placeholder="请输入身份证号码"></zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">工资卡银行</span>
            </div>
            <div class="content">
              <el-input v-model="staffInfo.bankName"
                placeholder="请输入工资卡银行"></el-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">银行卡卡号</span>
            </div>
            <div class="content">
              <el-input v-model="staffInfo.bankCard"
                placeholder="请输入银行卡卡号"></el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">健康状况</span>
            </div>
            <div class="content">
              <zh-input v-model="staffInfo.health"
                placeholder="请输入健康状况"></zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">紧急联系人</span>
            </div>
            <div class="content">
              <el-input v-model="staffInfo.emergentPerson"
                placeholder="请输入紧急联系人"></el-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">联系人电话</span>
            </div>
            <div class="content">
              <el-input v-model="staffInfo.emergentPhone"
                placeholder="请输入联系人电话"></el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">工种</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select v-model="staffInfo.type"
                placeholder="请选择工种">
                <el-option label="合同工"
                  value="合同工"></el-option>
                <el-option label="临时工"
                  value="临时工"></el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">在职时间</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-date-picker style="width:100%"
                v-model="staffInfo.date"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择在职时间">
              </el-date-picker>
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
                v-model="staffInfo.desc"
                placeholder="请输入备注信息"></el-input>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray">返回</div>
          <div class="btn btnBlue">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      staffInfo: {
        name: '',
        department: '',
        age: '',
        sex: '',
        telephone: '',
        station: '',
        IDcard: '',
        bankName: '',
        bankCard: '',
        health: '',
        emergentPerson: '',
        emergentPhone: '',
        date: '',
        type: '',
        desc: ''
      },
      departmentArr: [],
      stationArr: []
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/staff/staffCreate.less";
</style>
