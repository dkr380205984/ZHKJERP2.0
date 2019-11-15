<template>
  <div id="productList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="keyword"
              placeholder="请输入编号查询"></el-input>
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
              @change="getDate">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0"
              @click="reset">重置</div>
          </div>
          <div class="rightCtn">
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <div class="col"><span class="text">编号</span></div>
            </div>
            <div class="col"
              style="flex:1.5">
              <transition v-show="!searchTypeFlag"
                name="el-zoom-in-bottom">
                <span class="text">品类
                  <i class="el-icon-search iconBtn"
                    @click="searchTypeFlag=true"></i>
                </span>
              </transition>
              <transition name="el-zoom-in-top">
                <div v-show="searchTypeFlag"
                  class="filterBox">
                  <el-cascader class="filter"
                    placeholder="筛选品类"
                    :options="typeArr"
                    @change="getType"
                    clearable
                    filterable>
                  </el-cascader>
                </div>
              </transition>
            </div>
            <div class="col">
              <span class="text">
                <transition v-show="!searchFlowerFlag"
                  name="el-zoom-in-bottom">
                  <span class="text">花型
                    <i class="el-icon-search iconBtn"
                      @click="searchFlowerFlag=true"></i>
                  </span>
                </transition>
                <transition name="el-zoom-in-top">
                  <div v-show="searchFlowerFlag"
                    class="filterBox">
                    <el-select v-model="flower"
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
            <div class="col"><span class="text">名称</span></div>
            <div class="col"><span class="text middle">图片</span></div>
            <div class="col"><span class="text">创建人</span></div>
            <div class="col">
              <span class="text">创建时间
                <span class="iconCtn">
                  <i class="el-icon-caret-top green"></i>
                  <i class="el-icon-caret-bottom"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">
                <transition v-show="!searchStateFlag"
                  name="el-zoom-in-bottom">
                  <span class="text">状态
                    <i class="el-icon-search iconBtn"
                      @click="searchStateFlag=true"></i>
                  </span>
                </transition>
                <transition name="el-zoom-in-top">
                  <div v-show="searchStateFlag"
                    class="filterBox">
                    <el-select v-model="state"
                      clearable
                      style="height:32px"
                      multiple
                      @change="getState"
                      placeholder="筛选状态">
                      <el-option v-for="(item,index) in stateArr"
                        :key="index"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </transition>
              </span>
            </div>
            <div class="col"><span class="text">操作</span></div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.product_code}}</div>
            <div class="col"
              style="flex:1.5">{{item.category_info.product_category + ' / ' + item.type_name + ' / ' + item.style_name}}</div>
            <div class="col">{{item.flower_id}}</div>
            <div class="col">{{item.sample_title?item.sample_title:'无'}}</div>
            <div class="col">
              <zh-img-list :list="item.img"></zh-img-list>
            </div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.create_time}}</div>
            <div class="col">
              <div class="stateCtn"
                :class="{'green':item.has_craft===1}">
                <div class="state"></div>
                <span class="name">工</span>
              </div>
              <div class="stateCtn"
                :class="{'green':item.has_plan===1}">
                <div class="state"></div>
                <span class="name">配</span>
              </div>
              <div class="stateCtn"
                :class="{'green':item.quotation_id>0}">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/product/productDetail/' + item.id)">详情</span>
              <span class="opr">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="$router.push('/product/productUpdate/'+ item.id)">
                      <span class="updated">修改产品</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <span class="delete">删除产品</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!item.has_craft">
                      <span class="create">添加工艺单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_craft">
                      <span class="detail">工艺单详情</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_craft">
                      <span class="updated">修改工艺单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_craft">
                      <span class="delete">删除工艺单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!item.has_plan">
                      <span class="create">添加配料单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_plan">
                      <span class="detail">配料单详情</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_plan">
                      <span class="updated">修改配料单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_plan">
                      <span class="delete">删除配料单</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
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
import { product, productType, flower } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      searchTypeFlag: false,
      searchFlowerFlag: false,
      searchStateFlag: false,
      typeArr: [],
      type: [],
      category_id: '',
      type_id: '',
      style_id: '',
      flowerArr: [],
      flower: '',
      stateArr: [{
        name: '有工艺单',
        value: 'has_craft'
      }, {
        name: '有配料单',
        value: 'has_plan'
      }, {
        name: '有报价单',
        value: 'has_quotation'
      }],
      state: [],
      has_plan: '',
      has_craft: '',
      has_quotation: '',
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
      page: 1
    }
  },
  watch: {
    page (newVal) {
      this.changeRouter(newVal)
    },
    keyword (newVal) {
      this.changeRouter()
    },
    flower (newVal) {
      this.changeRouter()
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    getList () {
      this.loading = true
      product.list({
        product_code: this.keyword,
        limit: 10,
        page: this.page,
        category_id: this.category_id,
        type_id: this.type_id,
        style_id: this.style_id,
        flower_id: this.flower,
        has_plan: this.has_plan,
        has_craft: this.has_craft,
        has_quotation: this.has_quotation,
        type: 1,
        start_time: (this.date && this.date.length > 0) ? this.date[0] : '',
        end_time: (this.date && this.date.length > 0) ? this.date[1] : ''
      }).then((res) => {
        this.list = res.data.data
        this.total = res.data.meta.total
        this.loading = false
      })
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
      this.flower = params.flower_id ? Number(params.flower_id) : ''
      this.has_plan = params.has_plan ? params.has_plan : ''
      this.has_craft = params.has_craft ? params.has_craft : ''
      this.has_quotation = params.has_quotation ? params.has_quotation : ''
    },
    // 这里不直接监听date是防止监听事件触发两次
    getDate () {
      this.changeRouter()
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
    getState (state) {
      this.has_plan = state.find((item) => item === 'has_plan') ? 1 : ''
      this.has_craft = state.find((item) => item === 'has_craft') ? 1 : ''
      this.has_quotation = state.find((item) => item === 'has_quotation') ? 1 : ''
      this.changeRouter()
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/product/productList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&category_id=' + this.category_id + '&&type_id=' + this.type_id + '&&style_id=' + this.style_id + '&&flower_id=' + this.flower + '&&has_plan=' + this.has_plan + '&&has_craft=' + this.has_craft + '&&has_quotation=' + this.has_quotation)
    },
    reset () {
      this.$router.push('/product/productList/page=&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&has_plan=&&has_craft=&&has_quotation=')
    }
  },
  created () {
    this.getFilters()
    this.getList()
    Promise.all([
      productType.list(),
      flower.list()
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
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/product/productList.less";
</style>
