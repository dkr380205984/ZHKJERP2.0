<template>
  <div id="sampleList"
    class="indexMain"
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item"
        @click="$router.push('/sample/sampleOrderList/page=1&&keyword=&&date=&&has_material=&&has_materialPlan=&&has_materialStock=&&has_weave=&&group_id=&&company_id=&&state=&&searchOrderOrProduct=')">
        <span class="icon order"> </span>
        <span class="name">样单列表</span>
      </div>
      <div class="cut_item active">
        <span class="icon product"> </span>
        <span class="name">样品列表</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入编号按回车键查询">
              </el-input>
              <el-cascader class="filter_item"
                v-model="type"
                placeholder="筛选品类"
                :options="typeArr"
                @change="getType"
                clearable
                filterable>
              </el-cascader>
              <el-select v-model="flower"
                class="filter_item"
                clearable
                @change="changeRouter(1)"
                placeholder="筛选花型">
                <el-option v-for="(item,index) in flowerArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-date-picker v-model="date"
                style="width:290px"
                class="filter_item"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeRouter(1)">
              </el-date-picker>
              <div class="resetBtn"
                @click="reset">重置</div>
            </div>
            <div class="filter_line"
              :class="!openHiddleFilter ? 'hiddle' : false">
              <el-select v-model="user_id"
                class="filter_item"
                @change="changeRouter(1)"
                filterable
                clearable
                placeholder="筛选创建人">
                <el-option v-for="(item,index) in userArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-dropdown :hide-on-click="false"
                class="filter_item"
                trigger="click"
                style="cursor:pointer">
                <span class="el-dropdown-link">
                  状态筛选<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    工艺单：
                    <el-radio-group v-model="has_craft"
                      @change="changeRouter(1)">
                      <el-radio label=''>全部</el-radio>
                      <el-radio label="1">有</el-radio>
                      <el-radio label="0">无</el-radio>
                    </el-radio-group>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    配料单：
                    <el-radio-group v-model="has_plan"
                      @change="changeRouter(1)"
                      divided>
                      <el-radio label=''>全部</el-radio>
                      <el-radio label="1">有</el-radio>
                      <el-radio label="0">无</el-radio>
                    </el-radio-group>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    报价单：
                    <el-radio-group v-model="has_quotation"
                      @change="changeRouter(1)"
                      divided>
                      <el-radio label=''>全部</el-radio>
                      <el-radio label="1">有</el-radio>
                      <el-radio label="0">无</el-radio>
                    </el-radio-group>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="rightCtn"
            @click="openHiddleFilter = !openHiddleFilter">
            {{openHiddleFilter ? '收起' : '展开'}}
            <span class="el-icon-arrow-down openIcon"
              :class="openHiddleFilter ? 'active' : false"></span>
          </div>
        </div>
        <div class="addCtn">
          <div class="btn btnBlue"
            @click="$router.push('/sample/sampleCreate')">新建样品</div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <div class="col"><span class="text">样品编号</span></div>
            </div>
            <div class="col">
              <span class="text">样品名称</span>
            </div>
            <div class="col"
              style="flex:1.5">
              <span class="text">品类</span>
            </div>
            <div class="col">
              <span class="text">花型</span>
            </div>
            <div class="col">
              <span class="text">客户款号</span>
            </div>
            <div class="col">
              <span class="text middle">图片</span>
            </div>
            <div class="col">
              <span class="text">创建人</span>
            </div>
            <div class="col">
              <span class="text">创建时间</span>
            </div>
            <div class="col">
              <span class="text">状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.sample_product_code}}</div>
            <div class="col">{{item.name || '无'}}</div>
            <div class="col"
              style="flex:1.5">{{item.category_name + ' / ' + item.type_name + ' / ' + item.style_name}}</div>
            <div class="col">{{item.flower_name}}</div>
            <div class="col">{{item.style_code?item.style_code:'无'}}</div>
            <div class="col">
              <zh-img-list :list="item.image"></zh-img-list>
            </div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.create_time.slice(0,10)}}</div>
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
                :class="{'green':item.has_quotation>0}">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
            </div>
            <div class="col">
              <span class="opr"
                @click="$router.push('/sample/sampleDetail/' + item.id)">详情</span>
              <span class="opr">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="$router.push('/sample/sampleUpdate/'+ item.id)">
                      <span class="updated">修改样品</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="deleteSample(item.id)">
                      <span class="delete">删除样品</span>
                    </el-dropdown-item>
                    <!-- <el-dropdown-item v-if="item.size.length===1"
                      @click.native="$router.push('/craft/craftCreate/'+ item.id + '/' + 2)">
                      <span class="create">添加工艺单</span>
                    </el-dropdown-item> -->
                    <el-dropdown-item v-if="item.has_craft"
                      @click.native="$router.push('/craft/craftDetail/'+ item.id + '/' + 2)">
                      <span class="detail">工艺单详情</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="$router.push('/productPlan/productPlanCreate/'+ item.id + '/' + 2)">
                      <span class="create">添加配料单</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item.has_plan"
                      @click.native="$router.push('/productPlan/productPlanDetail/'+ item.id + '/' + 2)">
                      <span class="detail">配料单详情</span>
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
import { sample, productType, flower, auth } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      openHiddleFilter: false,
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
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    getList () {
      this.loading = true
      sample.list({
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
        user_name: this.user_id,
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
      this.keyword = this.$changeSpecialWord(this.keyword, false)
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
      } else {
        this.type = ''
      }
      this.flower = params.flower_id ? Number(params.flower_id) : ''
      this.has_plan = params.has_plan ? params.has_plan : ''
      this.has_craft = params.has_craft ? params.has_craft : ''
      this.has_quotation = params.has_quotation ? params.has_quotation : ''
      this.user_id = params.user_id || ''
    },
    // 这里不直接监听date是防止监听事件触发两次
    getDate () {
      this.changeRouter()
    },
    getType (type) {
      console.log(type)
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
      this.$router.push('/sample/sampleList/page=' + pages + '&&keyword=' + this.$changeSpecialWord(this.keyword, true) + '&&date=' + this.date + '&&category_id=' + this.category_id + '&&type_id=' + this.type_id + '&&style_id=' + this.style_id + '&&flower_id=' + this.flower + '&&user_id=' + this.user_id + '&&has_plan=' + this.has_plan + '&&has_craft=' + this.has_craft + '&&has_quotation=' + this.has_quotation)
    },
    reset () {
      this.$router.push('/sample/sampleList/page=&&keyword=&&date=&&category_id=&&type_id=&&style_id=&&flower_id=&&user_id=&&has_plan=&&has_craft=&&has_quotation=')
    },
    deleteSample (id) {
      sample.delete({
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
@import "~@/assets/less/sample/sampleList.less";
</style>
