<template>
  <div id="craftDetailForCloth"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{$route.params.type==='1'?'产':'样'}}品信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
            <span class="text">{{$route.params.type==='1'?productInfo.product_code:productInfo.sample_product_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品名称：</span>
            <span class="text"
              :class="{'blue':productInfo.name}">{{productInfo.name?productInfo.name:'无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品品类：</span>
            <span class="text">{{$route.params.type==='1'?productInfo.category_name+'/'+productInfo.type_name+'/'+productInfo.style_name:productInfo.category_name+'/'+productInfo.type_name+'/'+productInfo.style_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品成分：</span>
            <span class="text">{{productInfo.component|filterMaterials}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品配色：</span>
            <span class="text">
              <span v-for="(item,index) in productInfo.color"
                :key="index">{{(index+1) + '. ' +item.color_name + ' '}}
              </span>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品规格：</span>
            <div class="tableCtn">
              <div class="line">
                <div class="once">
                  <div class="biaotou rightTop">规格</div>
                  <div class="xiexian"></div>
                  <div class="biaotou leftBottom">部位</div>
                </div>
                <div class="once"
                  v-for="(item,index) in productInfo.size_measurement"
                  :key="index">
                  {{item.size_name}}
                </div>
              </div>
              <div class="line"
                v-for="(item,index) in productInfo.sizePart"
                :key="index">
                <div class="once">
                  {{item.part}}
                </div>
                <div class="once"
                  v-for="(itemNum,indexNum) in item.size"
                  :key="indexNum">
                  {{itemNum}}
                </div>
              </div>
              <div class="line">
                <div class="once">
                  克重
                </div>
                <div class="once"
                  v-for="(item,index) in productInfo.size_measurement"
                  :key="index">
                  {{item.weight}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':productInfo.description}">{{productInfo.description?productInfo.description:'无'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">工艺详情</span>
      </div>
      <div class="detailCtn hasBorderTop">
        <div class="addTableCtn">
          <div class="line">
            <div class="once flex3 bgGray">规格</div>
            <div class="once bgGray"
              v-for="item in size"
              :key="item.id">{{item.size_name}}</div>
          </div>
          <div class="line">
            <div class="once flex3 bgGray">机号</div>
            <div class="once"
              v-for="(item,index) in craftInfo.machine_code"
              :key="index">
              {{item.value}}
            </div>
          </div>
          <div class="line">
            <div class="once flex2 bgGray middle">工序耗时</div>
            <div class="lineChildCtn">
              <div class="lineChild"
                v-for="(item,index) in craftInfo.machine_time"
                :key="index">
                <div class="once">
                  {{item.name}}
                </div>
                <div class="once"
                  v-for="(itemSize,indexSize) in item.size"
                  :key="indexSize">
                  {{itemSize.value}}
                </div>
              </div>
            </div>
          </div>
          <div class="line">
            <div class="once flex2 bgGray middle">
              <div>组织结构</div>
            </div>
            <div class="lineChildCtn">
              <div class="lineChild"
                v-for="(item,index) in craftInfo.organization"
                :key="index">
                <div class="once">
                  {{item.name}}
                </div>
                <div class="once"
                  v-for="(itemSize,indexSize) in item.size"
                  :key="indexSize">
                  {{itemSize.value}}
                </div>
              </div>
            </div>
          </div>
          <div class="line">
            <div class="once bgGray middle">成品密度</div>
            <div class="lineChildCtn">
              <div class="lineChild">
                <div class="once bgGray middle">
                  <div>横密</div>
                </div>
                <div class="lineChildCtn">
                  <div class="lineChild"
                    v-for="(item,index) in craftInfo.density.crosswise_density"
                    :key="index">
                    <div class="once">
                      {{item.name}}
                    </div>
                    <div class="once"
                      v-for="(itemSize,indexSize) in item.size"
                      :key="indexSize">
                      {{itemSize.value}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="lineChild">
                <div class="once bgGray middle">
                  <div>纵密</div>
                </div>
                <div class="lineChildCtn">
                  <div class="lineChild"
                    v-for="(item,index) in craftInfo.density.lengthwise_density"
                    :key="index">
                    <div class="once">
                      {{item.name}}
                    </div>
                    <div class="once"
                      v-for="(itemSize,indexSize) in item.size"
                      :key="indexSize">
                      {{itemSize.value}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">特殊织法：</span>
            <span class="text">{{craftInfo.special_way}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">成衣工序：</span>
            <span class="text">{{craftInfo.process.join(',')}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">操作人：</span>
            <span class="text">{{user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建时间：</span>
            <span class="text">{{create_time}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange"
            @click="$router.push('/craft/craftUpdate/' + $route.params.id + '/' + $route.params.type)">修改</div>
          <div class="btn btnRed"
            @click="deleteCraft">删除</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { craft } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      productInfo: {
        category_info: {
          product_category: '',
          name: ''
        },
        style_name: '',
        type_name: '',
        flower_id: '',
        color: [],
        has_craft: 0,
        craft_info: null,
        has_plan: 0,
        product_plan_info: null,
        quotation_info: [],
        order_info: [],
        images: [],
        component: [],
        product_code: '',
        sample_title: '',
        size_measurement: [],
        description: '',
        needle_type: '',
        sizePart: []
      },
      size: [],
      craftInfo: {
        machine_code: [],
        machine_time: [],
        organization: [],
        density: {
          crosswise_density: [],
          lengthwise_density: []
        },
        special_way: '',
        process: []
      },
      user_name: '',
      create_time: ''
    }
  },
  filters: {
    filterMaterials (arr) {
      let str = ''
      if (arr[0] && arr[0].component_name) {
        arr.forEach((item) => {
          str += item.component_name + item.number + '%' + ' / '
        })
        return str.substring(0, str.length - 2)
      } else {
        return '无'
      }
    }
  },
  methods: {
    deleteCraft () {
      this.$confirm('此操作将永久删除该工艺单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        craft.deleteCloth({
          id: this.craftId
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.$router.go(-1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted () {
    craft.detailCloth({
      product_id: this.$route.params.id,
      product_type: this.$route.params.type
    }).then((res) => {
      this.productInfo = res.data.data.product_info
      this.productInfo.sizePart = []
      this.productInfo.size_measurement.forEach((itemSize, indexSize) => {
        JSON.parse(itemSize.part_info).forEach((itemPart, indexPart) => {
          if (!this.productInfo.sizePart[indexPart]) {
            this.productInfo.sizePart[indexPart] = {
              part: '',
              size: []
            }
          }
          this.productInfo.sizePart[indexPart].part = itemPart.part
          this.productInfo.sizePart[indexPart].size.push(itemPart.size)
        })
      })
      this.size = this.productInfo.size_measurement.map((item) => {
        return {
          size_name: item.size_name,
          id: item.id
        }
      })
      this.craftInfo = JSON.parse(res.data.data.complete_data)
      this.user_name = res.data.data.user_name
      this.create_time = res.data.data.create_time
      this.craftId = res.data.data.id
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/craft/craftDetailForCloth.less";
</style>
