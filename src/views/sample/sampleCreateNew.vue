<template>
  <div class="indexMain"
    id="sampleCreate"
    v-loading="loading">
    <div class="module">
      <!-- <div class="titleCtn">
        <span class="title">基本信息</span>
        <span class="sampleCode">{{sampleCode}}</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
      </div> -->
      <div class="titleCtn"
        style="display:flex;align-items:center;justify-content: space-between;">
        <span class="title">
          基本信息
          <span class="sampleCode">{{sampleCode}}</span>
          <zh-message :msgSwitch="msgSwitch"
            :url="msgUrl"
            :content="msgContent"></zh-message>
        </span>
        <el-autocomplete v-model="importKeyword"
          style="width:200px;height:32px"
          :fetch-suggestions="querySearchSample"
          placeholder="输入样品编号导入样品"
          :trigger-on-focus="false"
          @select="importSample"></el-autocomplete>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">样品名称</span>
            </div>
            <div class="content">
              <zh-input placeholder="请输入样品名称"
                v-model="name">
              </zh-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">样品品类</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-cascader v-model="type"
                placeholder="请选择样品品类"
                :options="typeArr">
              </el-cascader>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">样品花型</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select placeholder="请选择样品花型"
                v-model="flower">
                <el-option v-for="(item,index) in flowerArr"
                  :key="index"
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
              <span class="text">针型名称</span>
            </div>
            <div class="content">
              <zh-input errorMsg="针型名称不能超过5个字"
                placeholder="请输入针型名称"
                maxLength="5"
                v-model="needleType">
              </zh-input>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in ingredient"
          :key="'ingredient' + index">
          <div class="colCtn flex3">
            <div class="label"
              v-show="index===0">
              <span class="text">样品成分</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="item.ingredient_name"
                :fetch-suggestions="searchIngredient"
                placeholder="请输入成分信息">
              </el-autocomplete>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label"
              v-show="index===0">
            </div>
            <div class="content">
              <zh-input type="number"
                placeholder="请输入比例"
                v-model="item.ingredient_value">
                <template slot="append">%</template>
              </zh-input>
            </div>
            <div class="editBtn"
              :class="{'addBtn':index===0,'deleteBtn':index>0}"
              @click="index===0?addIngredient():deleteIngredient(index)">{{index===0?'添加':'删除'}}</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">样品规格</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-select style="width:360px"
                placeholder="可选择常用衣服类型"
                filterable
                v-model="part"
                @change="getPart">
                <el-option v-for="(item,index) in partArr"
                  :key="index"
                  :label="item.name"
                  :value="item.part_info">
                </el-option>
              </el-select>
            </div>
            <div class="content"
              style="height:auto">
              <div class="tableCtn">
                <div class="line">
                  <div class="once">
                    <div class="biaotou rightTop">规格</div>
                    <div class="xiexian"></div>
                    <div class="biaotou leftBottom">部位</div>
                  </div>
                  <div class="once"
                    v-for="(item,index) in size"
                    :key="index">
                    <el-select v-model="item.size"
                      placeholder="选规格">
                      <el-option v-for="(item,index) in sizeArr"
                        :key="index"
                        :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </div>
                  <div class="once">
                    <span style="color:#1a95ff;cursor:pointer"
                      @click="addSize">新增</span>
                    <span style="margin:0 5px;color:#e9e9e9;vertical-align: 1px;">|</span>
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteSize">删除</span>
                  </div>
                </div>
                <div class="line"
                  v-for="(item,index) in sizePartArr"
                  :key="index">
                  <div class="once">
                    <el-input v-model="item.part"
                      placeholder="部位名称"></el-input>
                  </div>
                  <div class="once"
                    v-for="(itemNum,indexNum) in item.size"
                    :key="indexNum">
                    <el-input placeholder="部位信息"
                      v-model="itemNum.number"></el-input>
                  </div>
                  <div class="once"></div>
                </div>
                <div class="line">
                  <div class="once">
                    <span style="color:#1a95ff;cursor:pointer"
                      @click="addPart">新增</span>
                    <span style="margin:0 5px;color:#e9e9e9;vertical-align: 1px;">|</span>
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deletePart">删除</span>
                  </div>
                  <div class="once"
                    v-for="(item,index) in size"
                    :key="index"></div>
                  <div class="once"></div>
                </div>
                <div class="line">
                  <div class="once">
                    总克重
                  </div>
                  <div class="once"
                    v-for="(item,index) in size"
                    :key="index">
                    <el-input v-model="item.total"
                      placeholder="输入克重"></el-input>
                  </div>
                  <div class="once"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in colour"
          :key="'colour'+index">
          <div class="colCtn flex3">
            <div class="label"
              v-show="index===0">
              <span class="text">样品配色</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="item.colour"
                :fetch-suggestions="searchColour"
                placeholder="请输入配色信息">
              </el-autocomplete>
            </div>
            <div class="editBtn"
              :class="{'addBtn':index===0,'deleteBtn':index>0}"
              @click="index===0?addColour():deleteColour(index)">{{index===0?'添加':'删除'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">配件信息</span>
        <el-switch class="atTitle"
          style="margin-bottom:3px"
          v-model="hasFitting"
          active-color="#1A95FF"
          inactive-color="#dcdfe6">
        </el-switch>
      </div>
      <div v-show="hasFitting"
        class="editCtn hasBorderTop"
        v-for="(item,index) in fittingInfo"
        :key="index">
        <div class="titleNum">配件{{chinaNum[index]}}</div>
        <div class="deleteIcon el-icon-close"
          @click="deleteFitting(index)"></div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">配件名称</span>
              <span class="explanation">(必填)</span>
            </span>
            <span class="content">
              <el-autocomplete class="inline-input"
                v-model="item.fitting_name"
                @select="getUnit($event,item)"
                :fetch-suggestions="searchMaterial"
                placeholder="请输入配件名称">
              </el-autocomplete>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">
              <span class="text">单位名称</span>
              <span class="explanation">(必填，默认为个)</span>
            </span>
            <span class="content">
              <el-input class="inline-input"
                v-model="item.unit"
                placeholder="请输入单位"></el-input>
            </span>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(itemIngredient,indexIngredient) in item.ingredient"
          :key="'ingredient' + indexIngredient">
          <div class="colCtn flex3">
            <div class="label"
              v-show="indexIngredient===0">
              <span class="text">样品成分</span>
              <span class="explanation">(必填,成分比例相加为100%)</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="itemIngredient.ingredient_name"
                :fetch-suggestions="searchIngredient"
                placeholder="请输入成分信息">
              </el-autocomplete>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label"
              v-show="indexIngredient===0">
            </div>
            <div class="content">
              <zh-input type="number"
                placeholder="请输入比例"
                v-model="itemIngredient.ingredient_value">
                <template slot="append">%</template>
              </zh-input>
            </div>
            <div class="editBtn"
              :class="{'addBtn':indexIngredient===0,'deleteBtn':indexIngredient>0}"
              @click="indexIngredient===0?addFittingIngredient(index):deleteFittingIngredient(index,indexIngredient)">{{indexIngredient===0?'添加':'删除'}}</div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(itemSize,indexSize) in item.size"
          :key="'size'+indexSize">
          <div class="colCtn">
            <span class="label"
              v-show="indexSize === 0">
              <span class="text">配件规格</span>
              <span class="explanation">(配件个数必填,不填默认为1个)</span>
            </span>
            <span class="content">
              <el-select v-model="itemSize.size"
                disabled
                placeholder="请选择样品规格">
                <el-option v-for="item in sizeArr"
                  :key="item.value"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="colCtn">
            <span class="label"
              v-show="indexSize === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input v-model="itemSize.weight"
                type="number"
                placeholder="请输入克重">
                <template slot="append">g</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn">
            <span class="label"
              v-show="indexSize === 0">
              <span class="text"></span>
            </span>
            <span class="content">
              <zh-input v-model="itemSize.desc"
                placeholder="请输入尺寸信息">
                <template slot="append">cm</template>
              </zh-input>
            </span>
          </div>
          <div class="colCtn">
            <div class="label"
              v-show="indexSize === 0">
              <span class="text"></span>
            </div>
            <div class="content">
              <zh-input v-model="itemSize.number"
                placeholder="请输入个数信息">
                <template slot="append">
                  <span>{{item.unit}}</span>
                </template>
              </zh-input>
            </div>
          </div>
        </div>
      </div>
      <div v-show="hasFitting"
        class="btn btnWhiteBlue add_fitting_btn"
        @click="addFitting">添加配件</div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">其他信息</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">样品图片</span>
            </div>
            <div class="content autoHeight">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :file-list="fileArr"
                :data="postData"
                ref="uploada"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="content autoHeight">
              <el-input type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="desc"
                placeholder="请输入备注信息"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="showSampleOrderCreatePopup">
      <div class="main">
        <div class="title">
          <span class="text">快速添加样单</span>
          <span class="el-icon-close"
            @click="$router.push('/sample/sampleDetail/' + orderInfo.product_info[0].product_id)"></span>
        </div>
        <div class="content">
          <div class="row">
            <span class="label">样单标题：</span>
            <span class="info">
              <zh-input v-model="orderInfo.title"
                placeholder="请输入样单标题"></zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">订单公司：</span>
            <span class="info">
              <el-select v-model="orderInfo.client_id"
                filterable
                placeholder="请选择订单公司"
                @change="changeContacts">
                <el-option v-for="item in clientList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">联系人：</span>
            <span class="info">
              <el-select v-model="orderInfo.contacts_id"
                placeholder="请选择联系人">
                <el-option v-for="item in contacts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="row">
            <span class="label">打样类型：</span>
            <span class="info">
              <el-select v-model="orderInfo.type"
                filterable
                placeholder="请选择打样类型">
                <el-option v-for="item in sampleTypeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <template v-for="(item,index) in orderInfo.product_info">
            <template v-for='(itemSize,indexSize) in item.size_info'>
              <div class="row"
                :key="index + 'size_color' + indexSize">
                <span class="label">尺码颜色{{indexSize + 1}}：</span>
                <span class="info info_page">
                  <el-select v-model="itemSize.size"
                    placeholder="请选择尺码"
                    class="elInput"
                    disabled>
                    <el-option v-for="item in sizeInfo"
                      :key="item.id"
                      :label="item.size_name"
                      :value="item.size_id">
                    </el-option>
                  </el-select>
                  <el-select v-model="itemSize.color"
                    class="elInput"
                    placeholder="请选择颜色"
                    disabled>
                    <el-option v-for="item in colorInfo"
                      :key="item.id"
                      :label="item.color_name"
                      :value="item.color_id">
                    </el-option>
                  </el-select>
                </span>
              </div>
              <div class="row"
                :key="index + 'number' + indexSize">
                <span class="label">打样数量{{indexSize + 1}}：</span>
                <span class="info">
                  <zh-input v-model="itemSize.numbers"
                    type='number'
                    placeholder="请输入打样数量"></zh-input>
                </span>
              </div>

            </template>
          </template>
          <div class="row">
            <span class="label">完成日期：</span>
            <span class="info">
              <el-date-picker v-model="orderInfo.deliver_time"
                style="width:100%"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择完成日期">
              </el-date-picker>
            </span>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="$router.push('/sample/sampleDetail/' + orderInfo.product_info[0].product_id)">取消</div>
          <div class="btn btnBlue"
            @click="createSampleOrder">确定</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="submit">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { letterArr, chinaNum } from '@/assets/js/dictionary.js'
import { productType, flower, ingredient, colour, getToken, material, sample, deleteFile, client, auth, sampleOrder, productPart } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      sample_code: ['Y', '00', 'X', 'X', 'X', '00'],
      chinaNum: chinaNum,
      name: '',
      type: [],
      typeArr: [],
      needleType: '',
      flower: '',
      flowerArr: [],
      ingredientArr: [],
      ingredient: [{
        ingredient_name: '',
        ingredient_value: 100
      }],
      size: [{ size: '' }],
      sizeArr: [],
      colour: [{ colour: '' }],
      colourArr: [],
      desc: '',
      postData: { token: '' },
      fileArr: [],
      hasFitting: false,
      fittingInfo: [{
        fitting_name: '',
        type: [],
        fitting_number: '',
        ingredient: [{
          ingredient_name: '',
          ingredient_value: ''
        }],
        size: [{ size: '', weight: '', desc: '', number: '1' }],
        unit: '个'
      }],
      // 配件类型从辅料里面选
      materialArr: [],
      // 快速添加样单窗口数据
      showSampleOrderCreatePopup: false,
      orderInfo: {
        client_id: '',
        type: '',
        title: '',
        order_time: this.$getTime(),
        group_id: '',
        contacts_id: '',
        deliver_time: '',
        desc: '',
        product_info: []
      },
      activeId: '',
      contacts: [],
      clientList: [],
      colorInfo: [],
      sizeInfo: [],
      sampleTypeArr: [// 继续打样信息
        {
          id: 0,
          name: '开发样'
        }, {
          id: 1,
          name: '修改样'
        }, {
          id: 2,
          name: '销售样'
        }, {
          id: 3,
          name: '确认样'
        }, {
          id: 4,
          name: '产前样'
        }, {
          id: 5,
          name: '大货样'
        }
      ],
      importKeyword: '',
      sizePartArr: [{
        type: '',
        size: [{ number: '' }]
      }],
      partArr: [],
      part: ''
    }
  },
  methods: {
    getUnit (ev, item) {
      item.unit = ev.unit
    },
    addFitting () {
      this.fittingInfo.push({
        fitting_name: '',
        type: [],
        ingredient: [{
          ingredient_name: '',
          ingredient_value: ''
        }],
        unit: '个',
        size: this.size.map((itemPro) => {
          return {
            size: itemPro.size,
            weight: '',
            desc: '',
            number: '1'
          }
        })
      })
    },
    deleteFitting (index) {
      if (this.fittingInfo.length === 1) {
        this.$message.error('配件数量不能小于1,如不需要配件可以直接关闭配件选项')
        return
      }
      this.$confirm('此操作将删除该配件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fittingInfo.splice(index)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    addFittingIngredient (index) {
      this.fittingInfo[index].ingredient.push({ ingredient_name: '', ingredient_value: '' })
    },
    deleteFittingIngredient (index, indexIngredient) {
      this.fittingInfo[index].ingredient.splice(indexIngredient, 1)
    },
    addIngredient () {
      this.ingredient.push({ ingredient_name: '', ingredient_value: '' })
    },
    deleteIngredient (index) {
      this.ingredient.splice(index, 1)
    },
    addSize () {
      this.size.push({ size: '', total: '' })
      this.sizePartArr.forEach((item) => {
        item.size.push({
          number: ''
        })
      })
    },
    deleteSize () {
      if (this.size.length === 1) {
        this.$message.error('至少有一种规格')
        return
      }
      this.size.pop()
      this.sizePartArr.forEach((item) => {
        item.size.pop()
      })
    },
    addPart () {
      this.sizePartArr.push({
        part: '',
        size: this.size.map((item) => {
          return {
            number: ''
          }
        })
      })
    },
    deletePart (index) {
      if (this.sizePartArr.length === 1) {
        this.$message.error('至少有一个部位')
        return
      }
      this.sizePartArr.pop()
    },
    addColour () {
      this.colour.push({ colour: '' })
    },
    deleteColour (index) {
      this.colour.splice(index, 1)
    },
    searchIngredient (queryString, cb) {
      let result = queryString ? this.ingredientArr.filter((item) => item.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.ingredientArr
      cb(result)
    },
    searchColour (queryString, cb) {
      let result = queryString ? this.colourArr.filter((item) => item.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.colourArr
      cb(result)
    },
    searchMaterial (queryString, cb) {
      let result = queryString ? this.materialArr.filter((item) => item.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.materialArr
      cb(result)
    },
    beforeAvatarUpload (file) {
      let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length// 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = Date.parse(new Date()) + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 6MB!')
        return false
      }
    },
    beforeRemove (file, fileList) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFile({
          id: file.id ? file.id : null,
          file_name: file.response ? file.response.key : file.url.split('https://zhihui.tlkrzf.com/')[1]
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let deleteIndex = 0
            fileList.forEach((item, index) => {
              if (file.response) {
                if (item.response && (item.response.key === file.response.key)) {
                  deleteIndex = index
                }
              } else {
                if (item.url === file.url) {
                  deleteIndex = index
                }
              }
            })
            fileList.splice(deleteIndex, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // return false 禁用自带的删除功能
      return false
    },
    submit () {
      let error = false
      if (this.type.length <= 0) {
        this.$message.error('请选择样品品类')
        return
      }
      if (!this.flower) {
        this.$message.error('请选择样品花型')
        return
      }
      error = this.size.some((item) => {
        return !item.size
      })
      if (error) {
        this.$message.error('请将样品规格信息填写完整')
        return
      }
      this.size.forEach((item, index) => {
        this.size.forEach((itemFind, indexFind) => {
          if (indexFind !== index && item.size === itemFind.size) {
            error = true
          }
        })
      })
      if (error) {
        this.$message.error('请不要选择重复的尺码信息')
        return
      }
      error = this.colour.some((item) => !item.colour)
      if (error) {
        this.$message.error('请将样品配色信息填写完整')
      }
      error = this.colour.some((item) => item.colour.search('/') !== -1)
      if (error) {
        this.$message.error('配色信息里面不得包含斜杠字符')
        return
      }
      error = this.colour.some((item) => item.colour.length > 8)
      if (error) {
        this.$message.error('配色信息长度不得超过8个字符')
        return
      }
      if (this.hasFitting) {
        error = this.fittingInfo.some((item) => !item.fitting_name)
      }
      if (error) {
        this.$message.error('请输入配件名称')
        return
      }
      let partData = this.fittingInfo.map((item) => {
        return {
          unit: item.unit,
          name: item.fitting_name,
          data_size: item.size.map((itemSize) => {
            return {
              weight: itemSize.weight,
              size_name: itemSize.size,
              size_info: itemSize.desc,
              number: itemSize.number
            }
          }),
          data_component: item.ingredient.map(item => { return { component_name: item.ingredient_name, number: item.ingredient_value } })
        }
      })
      let imgArr = this.$refs.uploada.uploadFiles.map((item) => { return (item.response ? 'https://zhihui.tlkrzf.com/' + item.response.key : item.url) })
      let formData = {
        sample_product_code: this.sample_code.join(''),
        name: this.name,
        category_id: this.type[0],
        type_id: this.type[1],
        style_id: this.type[2],
        flower_id: this.flower,
        needle_type: this.needleType,
        description: this.desc,
        data_image: imgArr,
        data_color: this.colour.map((item) => { return { color_name: item.colour } }),
        data_component: this.ingredient.map(item => { return { component_name: item.ingredient_name, number: item.ingredient_value } }),
        data_size: this.size.map((item, index) => {
          return {
            weight: item.total,
            size_name: item.size,
            size_info: item.desc,
            part_info: JSON.stringify(this.sizePartArr.map((item) => {
              return {
                part: item.part,
                size: item.size[index].number
              }
            }))
          }
        }),
        part_data: this.hasFitting ? partData : []
      }
      sample.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('保存成功')
          this.$confirm('是否快速添加样单?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.initCreateOrder(res.data.data)
          }).catch(() => {
            if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
              this.msgUrl = '/sample/sampleDetail/' + res.data.data.id
              this.msgContent = '<span style="color:#1A95FF">添加</span>了一个新样品<span style="color:#1A95FF">' + res.data.data.sample_product_code + '</span>(' + res.data.data.category_name + '/' + res.data.data.type_name + '/' + res.data.data.style_name + '/' + res.data.data.flower_name + ')'
              this.msgSwitch = true
            } else {
              this.$router.push('/sample/sampleDetail/' + res.data.data.id)
            }
          })
        }
      })
    },
    initCreateOrder (info) {
      this.showSampleOrderCreatePopup = true
      this.loading = true
      let sizeInfo = []
      info.size.forEach(itemSize => {
        info.color.forEach(itemColor => {
          sizeInfo.push({
            size: itemSize.size_id,
            color: itemColor.color_id,
            numbers: ''
          })
        })
      })
      this.orderInfo.product_info = [
        {
          product_id: info.id,
          size_info: sizeInfo
        }
      ]
      this.orderInfo.title = info.name
      this.sizeInfo = info.size
      this.colorInfo = info.color
      this.activeId = info.id
      Promise.all([
        client.list(),
        auth.list()
      ]).then(res => {
        this.clientList = res[0].data.data.filter(item => item.type.indexOf(1) !== -1)
        let flag = res[1].data.data.find(item => item.name === window.sessionStorage.getItem('user_name'))
        if (flag) {
          this.orderInfo.group_id = flag.group_id
        }
        this.loading = false
      })
    },
    createSampleOrder () {
      let orderInfo = this.$clone(this.orderInfo)
      if (!orderInfo.client_id) {
        this.$message.error('请选择订单公司')
        return
      }
      // if (!orderInfo.contacts_id) {
      //   this.$message.error('请选择联系人')
      //   return
      // }
      if (!orderInfo.type && orderInfo.type !== 0) {
        this.$message.error('请选择打样类型')
        return
      }
      let flag = this.$flatten(orderInfo.product_info.map(item => {
        return item.size_info.map(itemSize => itemSize.numbers)
      }))
      if (flag.filter(item => item).length === 0) {
        this.$message.error('检测到未填写打样数量，如无需打样某款尺码颜色，可不填，但至少填写一个打样数量')
        return
      }
      if (!orderInfo.deliver_time) {
        this.$message.error('请选择样单完成日期')
        return
      }
      orderInfo.product_info = orderInfo.product_info.map(item => {
        return {
          product_id: item.product_id,
          size_info: item.size_info.filter(itemSize => itemSize.numbers)
        }
      })
      sampleOrder.create(orderInfo).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加样单成功')
          this.$router.push('/sample/sampleDetail/' + this.activeId)
        }
      })
    },
    changeContacts ($event) {
      let flag = this.clientList.find(item => item.id === $event)
      if (flag) {
        this.contacts = flag.contacts
      }
    },
    querySearchSample (queryString, cb) {
      sample.list({
        limit: 9999,
        page: 1,
        product_code: queryString
      }).then(res => {
        if (res.data.status !== false) {
          cb(res.data.data.map(item => {
            return {
              value: item.sample_product_code,
              id: item.id
            }
          }))
        }
      })
    },
    importSample (eve) {
      this.sizePartArr = []
      this.loading = true
      sample.editDetail({
        id: eve.id
      }).then(res => {
        if (res.data.status !== false) {
          let productInfo = res.data.data
          this.sample_product_code = productInfo.product_code
          this.sampleName = productInfo.name
          this.fileArr = productInfo.image.map(item => {
            return {
              url: item.image_url
            }
          })
          this.size = productInfo.size.map(item => {
            return {
              size: item.size_name,
              total: item.weight
            }
          })
          productInfo.size.forEach((itemSize, indexSize) => {
            JSON.parse(itemSize.part_info).forEach((itemPart, indexPart) => {
              if (!this.sizePartArr[indexPart]) {
                this.sizePartArr[indexPart] = {
                  part: '',
                  size: []
                }
              }
              this.sizePartArr[indexPart].part = itemPart.part
              this.sizePartArr[indexPart].size.push({ number: itemPart.size })
            })
          })
          this.colour = productInfo.color.map(item => {
            return {
              colour: item.color_name
            }
          })
          this.name = productInfo.name
          this.type = [productInfo.category_id.toString(), productInfo.type_id.toString(), productInfo.style_id.toString()]
          this.sizeArr = this.typeArr.find(item => item.value === this.type[0]).child_size
          this.flower = productInfo.flower_id
          this.ingredient = productInfo.component.map((item) => {
            return {
              ingredient_name: item.component_name,
              ingredient_value: item.number
            }
          })
          this.hasFitting = productInfo.part_data.length > 0
          this.fittingInfo = productInfo.part_data.map((item) => {
            return {
              fitting_name: item.name,
              ingredient: item.component.map((item) => {
                return {
                  ingredient_name: item.component_name,
                  ingredient_value: item.number
                }
              }),
              size: item.size.map((itemSize) => {
                return {
                  size: itemSize.size_name,
                  weight: itemSize.weight,
                  desc: itemSize.size_info,
                  number: itemSize.number
                }
              })
            }
          })
          this.needleType = productInfo.needle_type
          this.loading = false
        }
      })
    },
    getPart (part) {
      if (this.sizePartArr.length > 1) {
        this.$confirm('此操作将重置已填写的信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sizePartArr = []
          JSON.parse(part).forEach((item) => {
            this.sizePartArr.push({
              part: item.value,
              size: this.size.map((item) => {
                return {
                  number: ''
                }
              })
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.sizePartArr = []
        JSON.parse(part).forEach((item) => {
          this.sizePartArr.push({
            part: item.value,
            size: this.size.map((item) => {
              return {
                number: ''
              }
            })
          })
        })
      }
    }
  },
  watch: {
    size: {
      deep: true,
      handler (newVal) {
        this.fittingInfo.forEach((item) => {
          let size = this.size.map((itemPro, indexPro) => {
            return {
              size: itemPro.size,
              weight: item.size[indexPro] ? item.size[indexPro].weight : '',
              desc: item.size[indexPro] ? item.size[indexPro].desc : '',
              number: item.size[indexPro] ? item.size[indexPro].number : '1'
            }
          })
          item.size = size
        })
      }
    },
    type (newVal) {
      this.sample_code[2] = 'X'
      this.sample_code[3] = 'X'
      this.sample_code[4] = 'X'
      if (newVal.length !== 0) {
        const obj = this.typeArr.find((item) => item.value === newVal[0])
        this.sizeArr = obj.child_size
        this.child_size = obj.sizeArr
      }
      this.typeArr.forEach((item, index) => {
        if (item.value === newVal[0]) {
          this.$set(this.sample_code, 2, letterArr[index])
        }
        if (item.children) {
          item.children.forEach((item2, index2) => {
            if (item2.value === newVal[1]) {
              this.$set(this.sample_code, 3, letterArr[index2])
            }
            if (item2.children) {
              item2.children.forEach((item3, index3) => {
                if (item3.value === newVal[2]) {
                  this.$set(this.sample_code, 4, letterArr[index3])
                }
              })
            }
          })
        }
      })
    },
    flower (newVal) {
      this.flowerArr.forEach((item, index) => {
        if (item.id === newVal) {
          let code = index + 1
          if (code < 10) {
            code = '0' + code
          }
          this.$set(this.sample_code, 5, code)
        }
      })
    }
  },
  computed: {
    sampleCode () {
      return this.sample_code.join('')
    }
  },
  mounted () {
    this.sample_code[1] = new Date().getFullYear().toString().substring(2, 4)
    Promise.all([
      productType.list(),
      flower.list(),
      ingredient.list(),
      colour.list(),
      getToken(),
      material.list(),
      productPart.list(),
      sampleOrder.typeList()
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
      this.ingredientArr = res[2].data.data
      this.ingredientArr.forEach((item) => {
        item.value = item.name
      })
      this.colourArr = res[3].data.data
      this.colourArr.forEach((item) => {
        item.value = item.name
      })
      this.postData.token = res[4].data.data
      this.materialArr = res[5].data.data
      this.materialArr.forEach((item) => {
        item.value = item.name
      })
      this.partArr = res[6].data.data
      this.sampleTypeArr = res[7].data.data
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/sample/sampleCreate.less";
</style>
