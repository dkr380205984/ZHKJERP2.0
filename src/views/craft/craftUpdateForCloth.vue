<template>
  <div id="craftCreateForCloth"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{$route.params.type==='1'?'产':'样'}}品信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
        <!-- <div class="selectCtn"
          style="width:460px;margin:10px 0">
          <el-select v-model="selectSearchWhich"
            style="width:170px;float:left">
            <el-option label="搜产品编号"
              value="搜产品编号"></el-option>
            <el-option label="搜样品编号"
              value="搜样品编号"></el-option>
            <el-option label="搜工艺单编号"
              value="搜工艺单编号"></el-option>
          </el-select>
          <el-select filterable
            style="width:270px;float:right"
            remote
            reserve-keyword
            v-model="gyd"
            :remote-method="remoteMethod"
            :loading="loadingS"
            @change="getCraft"
            placeholder="输入编号导入工艺单">
            <el-option v-for="item in gydArr"
              :key="item.id"
              :label="selectSearchWhich!=='搜工艺单编号'?item.product_code:item.craft_code"
              :value="item.id">
              <span v-if="selectSearchWhich!=='搜工艺单编号'">{{ item.product_code }}</span>
              <span v-if="selectSearchWhich==='搜工艺单编号'">{{ item.craft_code }}</span>
              <span style="margin-left:10px;color: #8492a6; font-size: 13px">({{item.category_info.product_category}}/{{item.type_name}}/{{item.style_name}}/{{item.flower_id}})</span>
            </el-option>
          </el-select>
        </div> -->
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
        <span class="title">修改工艺</span>
      </div>
      <div class="editCtn hasBorderTop">
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
              <el-input class="inputs"
                v-model="item.value"
                placeholder="输入机号">
              </el-input>
            </div>
          </div>
          <div class="line">
            <div class="once flex2 bgGray middle">
              <div>工序耗时</div>
              <div style="color:#1595ff;cursor:pointer;"
                @click="addPart(craftInfo.machine_time)">添加工序</div>
              <div style="position:absolute;color:#F5222D;cursor:pointer;right:8px;padding:6px;line-height:38px;font-size:12px"
                v-for="(item,index) in craftInfo.machine_time"
                :key="index"
                :style="{'top':index*51+'px'}"
                @click="deletePart(craftInfo.machine_time,index)">删除
                <i class="el-icon-right"></i>
              </div>
            </div>
            <div class="lineChildCtn">
              <div class="lineChild"
                v-for="(item,index) in craftInfo.machine_time"
                :key="index">
                <div class="once">
                  <el-autocomplete class="inline-input inputs"
                    v-model="item.name"
                    :fetch-suggestions="searchGX"
                    placeholder="输入工序"></el-autocomplete>
                </div>
                <div class="once"
                  v-for="(itemSize,indexSize) in item.size"
                  :key="indexSize">
                  <el-input class="inputs"
                    v-model="itemSize.value"
                    placeholder="输入时间">
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="line">
            <div class="once flex2 bgGray middle">
              <div>组织结构</div>
              <div style="color:#1595ff;cursor:pointer;"
                @click="addPart(craftInfo.organization)">添加部位</div>
              <div style="position:absolute;color:#F5222D;cursor:pointer;right:8px;padding:6px;line-height:38px;font-size:12px"
                v-for="(item,index) in craftInfo.organization"
                :key="index"
                :style="{'top':index*51+'px'}"
                @click="deletePart(craftInfo.organization,index)">删除
                <i class="el-icon-right"></i>
              </div>
            </div>
            <div class="lineChildCtn">
              <div class="lineChild"
                v-for="(item,index) in craftInfo.organization"
                :key="index">
                <div class="once">
                  <el-input class="inputs"
                    v-model="item.name"
                    placeholder="输入部位">
                  </el-input>
                </div>
                <div class="once"
                  v-for="(itemSize,indexSize) in item.size"
                  :key="indexSize">
                  <el-input class="inputs"
                    v-model="itemSize.value"
                    placeholder="组织结构">
                  </el-input>

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
                  <div style="color:#1595ff;cursor:pointer;;font-size:12px"
                    @click="addPart(craftInfo.density.crosswise_density)">添加部位</div>
                  <div style="position:absolute;color:#F5222D;cursor:pointer;right:8px;padding:6px;line-height:38px;font-size:12px"
                    v-for="(item,index) in craftInfo.density.crosswise_density"
                    :key="index"
                    :style="{'top':index*51+'px'}"
                    @click="deletePart(craftInfo.density.crosswise_density,index)">删除
                    <i class="el-icon-right"></i>
                  </div>
                </div>
                <div class="lineChildCtn">
                  <div class="lineChild"
                    v-for="(item,index) in craftInfo.density.crosswise_density"
                    :key="index">
                    <div class="once">
                      <el-input class="inputs"
                        v-model="item.name"
                        placeholder="输入部位">
                      </el-input>
                    </div>
                    <div class="once"
                      v-for="(itemSize,indexSize) in item.size"
                      :key="indexSize">
                      <el-input class="inputs"
                        v-model="itemSize.value"
                        placeholder="输入横密">
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="lineChild">
                <div class="once bgGray middle">
                  <div>纵密</div>
                  <div style="color:#1595ff;cursor:pointer;;font-size:12px"
                    @click="addPart(craftInfo.density.lengthwise_density)">添加部位</div>
                  <div style="position:absolute;color:#F5222D;cursor:pointer;right:8px;padding:6px;line-height:38px;font-size:12px"
                    v-for="(item,index) in craftInfo.density.lengthwise_density"
                    :key="index"
                    :style="{'top':index*51+'px'}"
                    @click="deletePart(craftInfo.density.lengthwise_density,index)">删除
                    <i class="el-icon-right"></i>
                  </div>
                </div>
                <div class="lineChildCtn">
                  <div class="lineChild"
                    v-for="(item,index) in craftInfo.density.lengthwise_density"
                    :key="index">
                    <div class="once">
                      <el-input class="inputs"
                        v-model="item.name"
                        placeholder="输入部位">
                      </el-input>
                    </div>
                    <div class="once"
                      v-for="(itemSize,indexSize) in item.size"
                      :key="indexSize">
                      <el-input class="inputs"
                        v-model="itemSize.value"
                        placeholder="输入纵密">
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="line">
            <div class="once flex3 bgGray middle">
              <div>克重</div>
            </div>
            <div class="once"
              v-for="(item,index) in craftInfo.weight"
              :key="index">
              <el-input class="inputs"
                v-model="item.value"
                placeholder="输入克重">
              </el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">特殊织法</span>
            </div>
            <div class="content">
              <el-input v-model="craftInfo.special_way"
                placeholder="请输入特殊织法"></el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">成衣所含工序</span>
            </div>
            <div class="content">
              <el-select v-model="craftInfo.process"
                multiple
                placeholder="请选择成衣所含工序">
                <el-option v-for="item in processArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
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
          <div class="btn btnBlue"
            @click="submit">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { craft, process } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      productInfo: {
        product_code: '',
        type_name: '',
        flower_id: '',
        style_name: '',
        category_info: {
          product_category: '',
          name: ''
        },
        color: [],
        component: [],
        create_time: '',
        user_name: '',
        size_measurement: [],
        name: '',
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
      processArr: []
    }
  },
  filters: {
    filterMaterials (arr) {
      let str = ''
      if (arr[0] && arr[0].component_name) {
        arr.forEach((item) => {
          str += item.component_name + ' / '
        })
        return str.substring(0, str.length - 2)
      } else {
        return '无'
      }
    }
  },
  methods: {
    addPart (obj) {
      obj.push({
        name: '',
        size: this.size.map((item) => {
          return {
            size: item.size_name,
            size_id: item.id,
            value: ''
          }
        })
      })
    },
    searchGX (queryString, cb) {
      var results = queryString ? this.processArr.filter((item) => item.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.processArr
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    deletePart (obj, index) {
      if (obj.length === 1) {
        this.$message.error('至少有一个部位')
      } else {
        obj.splice(index, 1)
      }
    },
    submit () {
      craft.createCloth({
        id: this.craftId,
        product_id: this.$route.params.id,
        product_type: this.$route.params.type,
        complete_data: JSON.stringify(this.craftInfo)
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/craft/craftDetail/' + this.$route.params.id + '/' + this.$route.params.type
            this.msgContent = '<span style="color:#E6A23C">修改</span>了一张工艺单<span style="color:#1A95FF">' + res.data.data.product_info.product_code + '</span>(' + res.data.data.product_info.category_name + '/' + res.data.data.product_info.type_name + '/' + res.data.data.product_info.style_name + '/' + res.data.data.product_info.flower_id + ')'
            this.msgSwitch = true
          } else {
            this.$router.push('/craft/craftDetail/' + this.$route.params.id + '/' + this.$route.params.type)
          }
        }
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
          id: item.size_id
        }
      })
      this.craftInfo = JSON.parse(res.data.data.complete_data)
      this.user_name = res.data.data.user_name
      this.create_time = res.data.data.create_time
      this.craftId = res.data.data.id
      this.loading = false
    })
    process.list().then((res) => {
      this.processArr = res.data.data
      this.processArr.forEach((item) => {
        item.value = item.name
      })
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/craft/craftCreateForCloth.less";
</style>
