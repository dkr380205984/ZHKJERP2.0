<template>
  <div class="indexMain"
    id="staffCreate">
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
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">工种</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select v-model="staffInfo.type"
                @change="changeType"
                placeholder="请选择工种">
                <el-option label="合同工"
                  value="1"></el-option>
                <el-option label="临时工"
                  value="2"></el-option>
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
          <div class="colCtn flex3">
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
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">其他信息</span>
      </div>
      <div class="editCtn hasBorderTop">
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
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">员工年龄</span>
            </div>
            <div class="content">
              <zh-input v-model="staffInfo.age"
                type="positiveNumber"
                placeholder="请输入员工年龄"></zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">员工性别</span>
            </div>
            <div class="content">
              <el-select v-model="staffInfo.sex"
                placeholder="请选择性别">
                <el-option label="男"
                  value="1"></el-option>
                <el-option label="女"
                  value="2"></el-option>
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
            @click="submit">添加</div>
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
        station: [],
        IDcard: '',
        bankName: '',
        bankCard: '',
        health: '',
        emergentPerson: '',
        emergentPhone: '',
        start_time: '',
        end_time: '',
        type: '2',
        desc: '',
        mingzu: '',
        dizhi: '',
        xueli: '',
        tag: ''
      },
      departmentArr: [],
      stationArr: [],
      staffTagList: [],
      processList: [] // 工序数组，给员工绑定工序
    }
  },
  methods: {
    submit () {
      if (this.$submitLock()) return
      if (!this.staffInfo.name) {
        this.$message.error('请填写姓名')
        return
      }
      if (!this.staffInfo.telephone) {
        this.$message.error('请填写手机号')
        return
      }
      if (!this.staffInfo.department) {
        this.$message.error('请选择部门')
        return
      }
      if (!this.staffInfo.type) {
        this.$message.error('请选择工种')
        return
      }
      // 紧急联系人没有上传到接口
      staff.create({
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
        start_time: this.staffInfo.start_time,
        work_time: this.staffInfo.end_time,
        nation: this.staffInfo.mingzu,
        address: this.staffInfo.dizhi,
        academic: this.staffInfo.xueli,
        desc: this.staffInfo.desc,
        tag_data: this.staffInfo.tag
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.$confirm('是否继续添加？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.staffInfo = {
              name: '',
              department: '',
              age: '',
              sex: '',
              telephone: '',
              station: [],
              IDcard: '',
              bankName: '',
              bankCard: '',
              health: '',
              emergentPerson: '',
              emergentPhone: '',
              start_time: '',
              end_time: '',
              type: '2',
              desc: '',
              mingzu: '',
              dizhi: '',
              xueli: '',
              tag: ''
            }
            this.changeType('2')
          }).catch(() => {
            this.$router.push('/staff/staffList/page=1&&keyword=&&date=&&department=&&type=&&state=')
          })
        }
      })
    },
    changeType (e) {
      if (e === '2') {
        let nowDate = new Date().getTime()
        this.staffInfo.start_time = this.$getTime(nowDate)
        this.staffInfo.end_time = this.$getTime(nowDate + 30 * 24 * 60 * 60 * 1000)
      } else {
        this.staffInfo.end_time = this.$getTime(new Date(this.staffInfo.start_time).getTime() + 366 * 24 * 60 * 60 * 1000)
      }
    }
  },
  created () {
    this.changeType('2')
    Promise.all([
      station.list({
        type: 2
      }),
      staffTag.list(),
      course.list({
        type: 3
      })
    ]).then((res) => {
      this.departmentArr = res[0].data.data
      this.staffTagList = res[1].data.data
      this.processList = res[2].data.data
      console.log(this.processList)
    })
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/staff/staffCreate.less";
</style>
<style lang="less">
#staffCreate {
  .el-date-editor .el-range__icon {
    line-height: 25px;
  }
  .el-date-editor .el-range-separator {
    line-height: 25px;
  }
}
</style>
