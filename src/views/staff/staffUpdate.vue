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
              <span class="text">手机号</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <zh-input v-model="staffInfo.telephone"
                type="telephone"
                placeholder="请输入手机号"></zh-input>
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
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">民族</span>
            </div>
            <div class="content">
              <zh-input v-model="staffInfo.mingzu"
                placeholder="请输入民族"></zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">学历</span>
            </div>
            <div class="content">
              <el-input v-model="staffInfo.xueli"
                placeholder="请输入学历"></el-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">健康状况</span>
            </div>
            <div class="content">
              <zh-input v-model="staffInfo.health"
                placeholder="请输入健康状况"></zh-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
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
                  :value="1"></el-option>
                <el-option label="女"
                  :value="2"></el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">负责工序</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select v-model="staffInfo.station"
                multiple
                placeholder="请选择负责工序">
                <el-option v-for="(item,index) in processList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"></el-option>
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
          <div class="colCtn">
            <div class="label">
              <span class="text">员工标签</span>
            </div>
            <div class="content">
              <el-select v-model="staffInfo.tag"
                filterable
                multiple
                collapse-tags
                placeholder="请选择员工标签">
                <el-option v-for="item in staffTagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
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
                  :value="1"></el-option>
                <el-option label="临时工"
                  :value="2"></el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">入职时间</span>
            </div>
            <div class="content"
              style="height:32px">
              <el-date-picker style="width:100%;height:100%;line-height:30px"
                v-model="staffInfo.start_time"
                value-format="yyyy-MM-dd"
                placeholder="入职时间">
              </el-date-picker>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">离职时间</span>
            </div>
            <div class="content"
              style="height:32px">
              <el-date-picker style="width:100%;height:100%;line-height:30px"
                v-model="staffInfo.end_time"
                value-format="yyyy-MM-dd"
                placeholder="离职时间">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">地址</span>
            </div>
            <div class="content">
              <el-input v-model="staffInfo.dizhi"
                placeholder="请输入地址"></el-input>
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
import { staff, station, staffTag, course } from '@/assets/js/api.js'
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
        start_time: '',
        type: '',
        desc: '',
        mingzu: '',
        dizhi: '',
        xueli: '',
        tag: ''
      },
      departmentArr: [],
      stationArr: [],
      staffTagList: [],
      processList: []
    }
  },
  methods: {
    submit () {
      if (!this.staffInfo.name) {
        this.$message.warning('请填写姓名')
        return
      }
      if (!this.staffInfo.telephone) {
        this.$message.warning('请填写手机号')
        return
      }
      if (!this.staffInfo.department) {
        this.$message.warning('请选择部门')
        return
      }
      if (!this.staffInfo.type) {
        this.$message.warning('请选择工种')
        return
      }
      // 紧急联系人没有上传到接口
      staff.create({
        id: this.$route.params.id,
        name: this.staffInfo.name,
        department_id: this.staffInfo.department,
        phone: this.staffInfo.telephone,
        age: this.staffInfo.age,
        id_card: this.staffInfo.IDcard,
        sex: this.staffInfo.sex,
        bank_card_name: this.staffInfo.bankName,
        bank_card_code: this.staffInfo.bankCard,
        station_id: this.staffInfo.station,
        healthy_info: this.staffInfo.health,
        urgent_phone: this.staffInfo.emergentPhone,
        type: this.staffInfo.type,
        work_time: this.staffInfo.start_time,
        nation: this.staffInfo.mingzu,
        address: this.staffInfo.dizhi,
        academic: this.staffInfo.xueli,
        desc: this.staffInfo.desc,
        tag_data: this.staffInfo.tag
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.$router.push('/staff/staffList/page=1&&keyword=&&date=&&department=&&type=&&state=')
        }
      })
    }
  },
  mounted () {
    Promise.all([
      staff.detail({
        id: this.$route.params.id
      }),
      station.list({
        type: 2
      }),
      staffTag.list(),
      course.list({
        type: 3
      })
    ]).then((res) => {
      let data = res[0].data.data
      this.staffInfo.name = data.name
      this.staffInfo.telephone = data.phone
      this.staffInfo.sex = data.sex
      this.staffInfo.department = data.department_id
      this.staffInfo.age = data.age
      this.staffInfo.IDcard = data.id_card
      this.staffInfo.bankName = data.bank_card_name
      this.staffInfo.bankCard = data.bank_card_code
      this.staffInfo.station = data.station_id.map((item) => item.id)
      this.staffInfo.health = data.healthy_info
      this.staffInfo.emergentPhone = data.urgent_phone
      this.staffInfo.type = data.type
      this.staffInfo.start_time = data.work_time
      this.staffInfo.desc = data.desc
      this.staffInfo.dizhi = data.address
      this.staffInfo.xueli = data.academic
      this.staffInfo.mingzu = data.nation
      this.processList = res[3].data.data
      this.staffInfo.tag = data.staff_tag.map(item => {
        let flag = res[2].data.data.find(itemTag => itemTag.name === item)
        if (flag) {
          return flag.id
        }
      })
      this.departmentArr = res[1].data.data
      this.staffTagList = res[2].data.data
    })
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/staff/staffCreate.less";
</style>
