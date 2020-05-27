<template>
  <div id="productPlanList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              @change="changeRouter(1)"
              placeholder="输入编号按回车键查询">
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
          <div class="rightCtn">
            <el-switch v-model="isProductType"
              active-text="产品"
              inactive-text="样品">
            </el-switch>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col flex12">
              <span class="text">编号</span>
            </div>
            <div class="col flex15">
              <span class="text">
                <span class="text"
                  v-show="!searchTypeFlag">品类
                  <i class="el-icon-search iconBtn"
                    @click="searchTypeFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchTypeFlag"
                    class="filterBox">
                    <el-cascader class="filter"
                      v-model="type"
                      placeholder="筛选品类"
                      :options="typeArr"
                      @change="getType"
                      clearable
                      filterable>
                    </el-cascader>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchFlowerFlag">花型
                  <i class="el-icon-search iconBtn"
                    @click="searchFlowerFlag=true"></i>
                </span>
                <transition name="el-zoom-in-top">
                  <div v-show="searchFlowerFlag"
                    class="filterBox">
                    <el-select v-model="flower"
                      @change="changeRouter(1)"
                      clearable
                      placeholder="筛选花型">
                      <el-option v-for="(item,index) in flowerArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col"><span class="text">名称或款号</span></div>
            <div class="col flex15"><span class="text middle">图片</span></div>
            <div class="col">指派人</div>
            <div class="col">
              <span class="text">指派时间
              </span>
            </div>
            <div class="col">
              <span class="text">
                <span class="text"
                  v-show="!searchStateFlag">状态
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
                        状态筛选<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          配料单：
                          <el-radio-group v-model="has_plan"
                            @change="changeRouter(1)">
                            <el-radio label=''>全部</el-radio>
                            <el-radio label="1">有</el-radio>
                            <el-radio label="0">无</el-radio>
                          </el-radio-group>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col"><span class="text">操作</span></div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col flex12">{{item.product_code}}</div>
            <div class="col flex15">{{item.category_name + ' / ' + item.type_name + ' / ' + item.style_name}}</div>
            <div class="col">{{item.flower_name}}</div>
            <div class="col">{{item.name ? item.name : '无'}}</div>
            <div class="col flex15 middle">
              <zh-img-list :list="item.image"></zh-img-list>
            </div>
            <div class="col"
              :class="!item.create_material_user ? 'gray' : ''">{{item.create_material_user || '未指派'}}</div>
            <div class="col"
              :class="!item.create_material_user_time ? 'gray' : ''">{{item.create_material_user_time || '未指派'}}</div>
            <div class="col">
              <div class="stateCtn rowFlex"
                :class="item.has_plan===1 ? 'green' : 'orange'">
                <div class="state"></div>
                <span class="name">{{item.has_plan === 1 ? '已添加' : '未添加'}}</span>
              </div>
            </div>
            <div class="col">
              <span class="opr orange" v-if="(isProductType && !item.has_plan) || !isProductType"
                @click="$router.push('/productPlan/productPlanCreate/'+ item.id + '/' + 1)">添加</span>
              <span class="opr"
                v-if="item.has_plan"
                @click="$router.push('/productPlan/productPlanDetail/' + item.id + '/' + 1)">详情</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { product, productType, flower, auth, sample } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      searchTypeFlag: false,
      searchFlowerFlag: false,
      searchStateFlag: false,
      searchUserName: false,
      user_id: '',
      userArr: [],
      typeArr: [],
      type: [],
      category_id: '',
      type_id: '',
      style_id: '',
      flowerArr: [],
      flower: '',
      has_plan: '',
      loading: true,
      list: [],
      keyword: '',
      date: '',
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
      total: 1,
      page: 1,
      isProductType: true
    }
  },
  watch: {
    page (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    },
    isProductType (newVal) {
      this.total = 1
      this.page = 1
      this.getList()
    }
  },
  methods: {
    getList () {
      this.loading = true
      if (this.isProductType) {
        product.list({
          product_code: this.keyword,
          limit: 10,
          page: this.page,
          category_id: this.category_id,
          type_id: this.type_id,
          style_id: this.style_id,
          flower_id: this.flower,
          has_plan: this.has_plan,
          user_name: this.user_id,
          type: 1,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
        }).then((res) => {
          this.list = res.data.data.map(item => {
            return {
              id: item.id,
              product_code: item.product_code,
              name: item.name,
              category_name: item.category_info.product_category,
              style_name: item.style_name,
              type_name: item.type_name,
              flower_name: item.flower_id,
              size: item.size,
              color: item.color,
              create_time: this.$getTime(item.create_time),
              has_plan: item.has_plan,
              image: item.image,
              unit: item.category_info.unit,
              user_name: item.user_name,
              create_material_user: item.create_material_user,
              create_material_user_time: item.create_material_user_time
            }
          })
          this.total = res.data.meta.total
          this.loading = false
        })
      } else {
        sample.list({
          product_code: this.keyword,
          limit: 10,
          page: this.page,
          category_id: this.category_id,
          type_id: this.type_id,
          style_id: this.style_id,
          flower_id: this.flower,
          has_plan: this.has_plan,
          user_name: this.user_id,
          // type: 1,
          start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
          end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
        }).then(res => {
          this.list = res.data.data.map(item => {
            return {
              id: item.id,
              product_code: item.sample_product_code,
              name: item.name,
              category_name: item.category_name,
              style_name: item.style_name,
              type_name: item.type_name,
              flower_name: item.flower_name,
              size: item.size,
              color: item.color,
              create_time: this.$getTime(item.create_time),
              has_plan: item.has_plan,
              image: item.image,
              unit: item.unit,
              user_name: item.user_name,
              create_material_user: item.create_material_user,
              create_material_user_time: item.create_material_user_time
            }
          })
          this.total = res.data.meta.total
          this.loading = false
        })
      }
    },
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
      this.category_id = params.category_id ? params.category_id : ''
      this.type_id = params.type_id ? params.type_id : ''
      this.style_id = params.style_id ? params.style_id : ''
      if (this.category_id) {
        this.type = [this.category_id, this.type_id, this.style_id]
        this.searchTypeFlag = true
      }
      this.flower = params.flower_id ? Number(params.flower_id) : ''
      if (this.flower) {
        this.searchFlowerFlag = true
      }
      this.has_plan = params.has_plan ? params.has_plan : ''
      if (this.has_plan === '0' || this.has_plan === '1') {
        this.searchStateFlag = true
      }
      this.user_id = params.user_id ? params.user_id : ''
      if (this.user_id) {
        this.searchUserName = true
      }
    },
    getType (type) {
      if (type.length === 3) {
        this.category_id = type[0]
        this.type_id = type[1]
        this.style_id = type[2]
      } else {
        this.category_id = ''
        this.type_id = ''
        this.style_id = ''
      }
      this.changeRouter()
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/product/productPlanList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&category_id=' + this.category_id + '&&type_id=' + this.type_id + '&&style_id=' + this.style_id + '&&flower_id=' + this.flower + '&&user_id=' + this.user_id + '&&has_plan=' + this.has_plan)
    },
    reset () {
      this.$router.push('/product/productPlanList/page=1&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&user_id=&&has_plan=')
    },
    // 删除产品
    deletePro (id) {
      product.delete({
        id: id
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    }
  },
  created () {
    this.getFilters()
    this.getList()
    Promise.all([
      productType.list(),
      flower.list(),
      auth.list()
    ]).then((res) => {
      this.typeArr = res[0].data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
          sizeArr: item.sizeArr,
          child_size: item.child_size,
          children: item.child.length === 0 ? null : item.child.map((item) => {
            return {
              value: item.id,
              label: item.name,
              children: item.child.length === 0 ? null : item.child.map((item) => {
                return {
                  value: item.id,
                  label: item.name
                }
              })
            }
          })
        }
      })
      this.flowerArr = res[1].data.data
      this.userArr = res[2].data.data
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/productPlan/productPlanList.less";
</style>
