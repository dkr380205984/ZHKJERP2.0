<template>
  <div id="productList"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn2"
          style="justify-content:space-between">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <div class="filter_line">
              <el-select class="filter_item"
                v-model="type"
                @change="getList(1)"
                placeholder="请选择搜索方式">
                <el-option label="按产品编号搜索"
                  value="product_code"></el-option>
                <el-option label="按样品编号搜索"
                  value="sample_code"></el-option>
                <el-option label="按工艺单名称搜索"
                  value="title"></el-option>
                <el-option label="按物料名称搜索"
                  value="material_name"></el-option>
              </el-select>
              <el-input class="filter_item"
                v-model="keyword"
                @change="changeRouter(1)"
                placeholder="输入查询信息按回车搜索">
              </el-input>
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
              <el-date-picker v-model="date"
                style="width:250px"
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
            <!-- <div class="filter_line"
              :class="openHiddleFilter ? false : 'hiddle'">
            </div> -->
          </div>
          <div class="leftCtn"
            style="padding-left:0;flex:0.2;width:200px">
            <div class="addCtn">
              <div class="btn btnBlue"
                @click="$router.push('/craft/craftCreate/noProId/noType')">新增工艺单</div>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <!-- <div class="col"
              style="flex:1.2">
              <span class="text">工艺单编号</span>
            </div> -->
            <div class="col"
              style="flex:1.2">
              <span class="text">工艺单名称</span>
            </div>
            <div class="col"
              style="flex:1.2">
              <span class="text">产品信息</span>
            </div>
            <div class="col">
              <span class="text middle">产品图片</span>
            </div>
            <div class="col">
              <span class="text">使用物料</span>
            </div>
            <div class="col">
              <span class="text">规格</span>
            </div>
            <div class="col">
              <span class="text">克重</span>
            </div>
            <div class="col">
              <span class="text">状态</span>
            </div>
            <div class="col">
              <span class="text">创建人</span>
            </div>
            <div class="col">
              <span class="text">创建时间</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <!-- <div class="col"
              style="flex:1.2">
              <span class="text">{{item.craft_code}}</span>
            </div> -->
            <div class="col"
              style="flex:1.2">
              <span class="text">{{item.title}}</span>
            </div>
            <div class="col"
              style="flex-direction:column;flex:1.2;align-items: baseline;">
              <span class="text">{{item.product_info&&item.product_info.category_name?item.product_info.product_code:''}}</span>
              <span class="text">({{item.product_info&&item.product_info.category_name?item.product_info.category_name + '/' + item.product_info.type_name + '/' + item.product_info.style_name:'配件/'+(item.product_info?item.product_info.product_title:'异常')}})</span>
            </div>
            <div class="col middle">
              <zh-img-list :list="item.product_info?item.product_info.image:[]"></zh-img-list>
            </div>
            <div class="col">
              <span class="text one_line">
                <span class="one_line">{{item.material_info && item.material_info.join(',')}}</span>
                <el-popover placement="top-start"
                  v-if="item.material_info && item.material_info.join(',').length>8"
                  width="200"
                  trigger="hover"
                  :content="item.material_info.join(',')">
                  <div class="more"
                    slot="reference">更多</div>
                </el-popover>
              </span>
            </div>
            <div class="col">
              <span class="text">{{item.size ? `${item.size}cm` : '/'}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.weight ? `${item.weight}g` : '/'}}</span>
            </div>
            <div class="col">
              <div class="stateCtn rowFlex"
                :class="{'green':item.is_draft===1,'orange':item.is_draft===2}">
                <div class="state"></div>
                <span class="name">{{item.is_draft===1?'完整':'草稿'}}</span>
              </div>
            </div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.create_time.slice(0,10)}}</div>
            <div class="col">
              <span class="opr orange"
                @click="$router.push('/craft/craftUpdate/' + item.id + '/' + item.product_type)">修改</span>
              <span class="opr"
                @click="$router.push('/craft/craftDetail/' + item.product_info.product_id + '/' + item.product_type)">详情</span>
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
import { craft, productType, flower, auth } from '@/assets/js/api.js'
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      openHiddleFilter: false,
      user_id: '',
      userArr: [],
      loading: true,
      list: [],
      keyword: '',
      type: 'product_code',
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
      craft.list({
        user_id: this.user_id || '',
        product_code: this.type === 'product_code' ? this.keyword : '',
        sample_code: this.type === 'sample_code' ? this.keyword : '',
        material_name: this.type === 'material_name' ? this.keyword : '',
        title: this.type === 'title' ? this.keyword : '',
        limit: 10,
        page: this.page
      }).then((res) => {
        this.list = res.data.data
        console.log(this.list)
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    // 更新筛选条件
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page) || 1
      this.keyword = params.keyword || ''
      this.material_name = params.material_name || ''
      if (params.date !== 'null' && params.date !== '') {
        this.date = params.date.split(',')
      } else {
        this.date = ''
      }
      this.user_id = params.user_id || ''
      this.product_code = params.product_code || ''
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/craft/craftList/page=' + pages + '&&keyword=' + this.keyword + '&&date=' + this.date + '&&user_id=' + this.user_id + '&&material_name=' + this.material_name + '&&product_code=' + this.product_code)
    },
    reset () {
      this.$router.push('/craft/craftList/page=1&&keyword=&&date=&&user_id=&&material_name=&&product_code=')
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
      this.userArr = res[2].data.data.filter(itemF => (itemF.module_id && itemF.module_id.includes(3)))
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/product/productList.less";
.col {
  overflow: hidden;
  .text {
    &.one_line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .one_line {
        flex: 1;
      }
      .more {
        width: auto;
      }
    }
  }
  .one_line {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    // -webkit-line-clamp: 2;
    // -webkit-box-orient: vertical;
    position: relative;
    word-break: break-all;
    background-color: inherit;
  }
  .more {
    // position: absolute;
    top: 0;
    right: 0;
    color: @blue;
    cursor: pointer;
    background: linear-gradient(
      to right,
      transparent 0%,
      inherit 20%,
      inherit 100%
    );
  }
}
</style>
