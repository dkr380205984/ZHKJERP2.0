<template>
  <div id='sampleOrderList'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入标题按回车键查询">
            </el-input>
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
              @change="changeRouter(1)">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0"
              @click="reset">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">样单标题</span>
            </div>
            <div class="col flex12">
              <span class="text">
                <span class="text"
                  v-show="!searchCompanyFlag">样单公司
                  <i class="el-icon-search iconBtn"
                    @click="searchCompanyFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchCompanyFlag"
                    class="filterBox">
                    <el-select v-model="company_id"
                      @change="changeRouter(1)"
                      clearable
                      filterable
                      placeholder="筛选公司">
                      <el-option v-for="(item,index) in companyArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col middle">
              <span class="text">样品图片</span>
            </div>
            <div class="col">
              <span class="text">样单数量(件)</span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchGroupFlag">负责小组
                  <i class="el-icon-search iconBtn"
                    @click="searchGroupFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchGroupFlag"
                    class="filterBox">
                    <el-select v-model="group_id"
                      @change="changeRouter(1)"
                      clearable
                      placeholder="筛选小组">
                      <el-option v-for="(item,index) in groupArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchStateFlag">流程进度
                  <i class="el-icon-search iconBtn"
                    @click="searchStateFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchStateFlag"
                    class="filterBox">
                    <el-dropdown :hide-on-click="false"
                      trigger="click"
                      style="cursor:pointer">
                      <span class="el-dropdown-link">
                        筛选流程<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          物料计划：
                          <el-radio-group v-model="has_materialPlan"
                            @change="changeRouter(1)">
                            <el-radio label=''>全部</el-radio>
                            <el-radio label="1">有</el-radio>
                            <el-radio label="2">无</el-radio>
                          </el-radio-group>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          物料订购：
                          <el-radio-group v-model="has_material"
                            @change="changeRouter(1)"
                            divided>
                            <el-radio label=''>全部</el-radio>
                            <el-radio label="1">有</el-radio>
                            <el-radio label="2">无</el-radio>
                          </el-radio-group>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          物料入库：
                          <el-radio-group v-model="has_materialStock"
                            @change="changeRouter(1)"
                            divided>
                            <el-radio label=''>全部</el-radio>
                            <el-radio label="1">有</el-radio>
                            <el-radio label="0">无</el-radio>
                          </el-radio-group>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          织造分配：
                          <el-radio-group v-model="has_weave"
                            @change="changeRouter(1)"
                            divided>
                            <el-radio label=''>全部</el-radio>
                            <el-radio label="1">有</el-radio>
                            <el-radio label="2">无</el-radio>
                          </el-radio-group>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchState2Flag">样单状态
                  <i class="el-icon-search iconBtn"
                    @click="searchState2Flag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchState2Flag"
                    class="filterBox">
                    <el-select v-model="state"
                      @change="changeRouter(1)"
                      clearable
                      placeholder="筛选状态">
                      <el-option v-for="(item,index) in stateArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">交货时间</span>
            </div>
            <div class="col middle">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(itemOrder,indexOrder) in list"
            :key="indexOrder">
            <div class="col">{{itemOrder.order_code}}</div>
            <div class="col flex12">{{itemOrder.client_name}}</div>
            <div class="col middle">
              <zh-img-list :list="itemOrder.image"
                type='open'
                order_type='sample'></zh-img-list>
            </div>
            <div class="col">{{itemOrder.number}}</div>
            <div class="col">{{itemOrder.group_name}}</div>
            <div class="col">
              <div :class="{'stateCtn':true, 'green':itemOrder.has_plan > 0}">
                <div class="state"></div>
                <span class="name">计</span>
              </div>
              <div :class="{'stateCtn':true,'orange':itemOrder.material_order_progress.y_percent>0 ,'green':itemOrder.material_order_progress.y_percent>=100}">
                <div class="state"></div>
                <span class="name">订</span>
              </div>
              <div :class="{'stateCtn':true,'orange':itemOrder.material_push_progress.r_push>0 ,'green':itemOrder.material_push_progress.r_push>=100}">
                <div class="state"></div>
                <span class="name">库</span>
              </div>
              <div :class="{'stateCtn':true,'orange':itemOrder.product_weave_progress.product>0 ,'green':itemOrder.product_weave_progress.product>=100}">
                <div class="state"></div>
                <span class="name">织</span>
              </div>
            </div>
            <div class="col">
              <div :class="{'stateCtn':true, 'rowFlex':true, 'red':itemOrder.status === 3003,'green':itemOrder.status === 3004,'blue':itemOrder.status === 3002,'orange':itemOrder.status === 3001}">
                <div class="state"></div>
                <span class="name">{{itemOrder.status === 3001 ? '已创建' :itemOrder.status=== 3002 ? '进行中': itemOrder.status === 3004 ? '已完成' : '已取消'}}</span>
              </div>
            </div>
            <div class="col">
              {{itemOrder.deliver_time}}
            </div>
            <div class="col middle">
              <span class="opr"
                @click="$router.push('/sample/sampleOrderDetail/' + (itemOrder.pid || itemOrder.id))">详情</span>
              <!-- <span class="opr">
                <el-dropdown @command="handleCommand($event,itemOrder.id)">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command='change'>
                      <span class="updated">修改</span>
                    </el-dropdown-item>
                    <el-dropdown-item command='delete'>
                      <span class="delete">删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span> -->
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getOrderList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sampleOrder, group, client } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      loading: true,
      list: [],
      keyword: '',
      date: '',
      pages: 1,
      total: 0,
      has_materialPlan: '',
      has_material: '',
      has_materialStock: '',
      has_weave: '',
      state: '',
      group_id: '',
      groupArr: [],
      company_id: '',
      companyArr: [],
      searchCompanyFlag: false,
      searchGroupFlag: false,
      searchStateFlag: false,
      searchState2Flag: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      stateArr: [{
        name: '已创建',
        id: '3001'
      }, {
        name: '进行中',
        id: '3002'
      }, {
        name: '已完成',
        id: '3004'
      }, {
        name: '已取消',
        id: '3003'
      }]
    }
  },
  watch: {
    page (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getOrderList()
    }
  },
  methods: {
    // 更新筛选条件
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.keyword = params.keyword
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.has_material = params.has_material
      this.has_materialStock = params.has_materialStock
      this.has_weave = params.has_weave
      this.has_materialPlan = params.has_materialPlan
      this.group_id = params.group_id ? Number(params.group_id) : ''
      if (this.group_id) {
        this.searchGroupFlag = true
      }
      this.company_id = params.company_id
      if (this.company_id) {
        this.searchCompanyFlag = true
      }
      this.state = params.state
      if (this.state) {
        this.searchState2Flag = true
      }
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/sample/sampleOrderList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&has_materialPlan=' + this.has_materialPlan + '&&has_material=' + this.has_material + '&&has_materialStock=' + this.has_materialStock + '&&has_weave=' + this.has_weave + '&&group_id=' + this.group_id + '&&company_id=' + this.company_id + '&&state=' + this.state)
    },
    reset () {
      this.$router.push('/sample/sampleOrderList/page=1&&keyword=&&date=&&has_material=&&has_materialPlan=&&has_materialStock=&&has_weave=&&group_id=&&company_id=&&state=')
    },
    getOrderList () {
      this.loading = true
      sampleOrder.list({
        limit: 10,
        page: this.pages,
        keyword: this.keyword,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : '',
        client_id: this.company_id,
        group_id: this.group_id,
        status: this.state,
        status_material_plan: this.has_materialPlan,
        status_material_order: this.has_material,
        status_weave: this.has_weave,
        status_material_push: this.has_materialStock
      }).then(res => {
        this.list = res.data.data.map(item => {
          let proArr = this.$mergeData(item.total_number, { mainRule: 'product_id' })
          let img = item.images || []
          img = img.map(itemImg => {
            return {
              thumb: itemImg.thumb,
              image_url: itemImg.file_url,
              product_id: itemImg.sample_product_id
            }
          })
          proArr.forEach(itemPro => {
            if (!img.find(itemImg => itemImg.product_id === itemPro.product_id)) {
              img.push({
                thumb: '',
                image_url: '',
                product_id: itemPro.product_id
              })
            }
          })
          return {
            id: item.id,
            pid: item.pid,
            order_code: item.title,
            client_name: item.client_name,
            image: img,
            number: item.total_number.map(item => Number(item.numbers)).reduce((total, item) => {
              return total + item
            }),
            status: item.status,
            group_name: item.group_name,
            deliver_time: item.deliver_time,
            has_plan: item.has_plan,
            material_order_progress: item.material_order_progress,
            product_weave_progress: item.product_weave_progress,
            material_push_progress: item.material_push_progress
          }
        })
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    handleCommand (type, id) {
      if (type === 'change') {
        this.$router.push('/sample/sampleOrderUpdate/' + id)
      } else if (type === 'delete') {
        this.$confirm('此操作将永久删除该样单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sampleOrder.delete({
            id: id
          }).then(res => {
            this.$message.success('删除成功')
            this.getOrderList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message.warning('未知命令')
      }
    }
  },
  created () {
    this.getFilters()
    this.getOrderList()
    Promise.all([group.list(), client.list()]).then((res) => {
      this.groupArr = res[0].data.data
      this.companyArr = res[1].data.data.filter((item) => {
        return item.type.indexOf(1) !== -1
      })
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/sample/sampleOrderList.less";
</style>
