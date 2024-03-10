<template>
  <div id="setting"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <div class="title">系统设置</div>
      </div>
      <div class="settingCtn">
        <div class="navFather">
          <div class="list"
            :class="{'active':pName===key}"
            v-for="(item,key,index) in nav"
            :key="index"
            @click="pName=key">{{key}}</div>
        </div>
        <div class="navSon">
          <div class="list"
            :class="{'active':cName===item}"
            v-for="(item,index) in nav[pName]"
            :key="index"
            @click="cName=item">{{item}}</div>
        </div>
        <div class="mainCtn">
          <!-- <template v-if="cName==='产品分类'">
            <div class="productTypeCtn">
              <div class="treeMain">
                <el-tree ref="tree"
                  :key="tree_key"
                  :data="productTypeArr"
                  node-key="id"
                  :render-content="renderContent"
                  :expand-on-click-node="false"
                  :default-expand-all="false"
                  :default-expanded-keys="defaultExpand">
                </el-tree>
              </div>
            </div>
          </template> -->
          <template v-if="cName==='产品花型'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('flower')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('flower')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true">添加花型</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">花型</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in flowerArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteFlower(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="flowerTotal"
                  :current-page.sync="flowerPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='产品成分'">
            <div class="ingredientCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('ingredient')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('ingredient')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true">添加成分</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">成分</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in ingredientArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteIngredient(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="ingredientTotal"
                  :current-page.sync="ingredientPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='产品配色'">
            <div class="ingredientCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('colour')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('colour')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true">添加配色</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">配色名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in colourArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteColour(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="colourTotal"
                  :current-page.sync="colourPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='产品尺码'">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn padding40">大类名称</div>
                  <div class="tcolumn padding40"
                    style="flex:3">尺码信息</div>
                  <div class="tcolumn right padding40">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in sizeArr"
                  :key="index">
                  <div class="tcolumn padding40">{{item.name}}</div>
                  <div class="tcolumn padding40 flexRow"
                    style="flex:3">
                    <span v-for="(itemSize,indexSize) in item.child_size"
                      :key="indexSize">{{indexSize>0?'/' + itemSize.name:itemSize.name}}</span>
                  </div>
                  <div class="tcolumn right padding40 flexRow"
                    style="justify-content:flex-end">
                    <span class="blue"
                      @click="addSize(item.id)">新增</span>
                    <span class="border"></span>
                    <span class="red"
                      @click="delSize(item.child_size)">删除</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pageCtn">
              <el-pagination background
                :page-size="5"
                layout="prev, pager, next"
                :total="sizeTotal"
                :current-page.sync="sizePage">
              </el-pagination>
            </div>
          </template>
          <template v-if="cName==='样单类型'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加类型</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">样单类型名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in sampleOrderTypeArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteSampleOrderType(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="sampleOrderTypeTotal"
                  :current-page.sync="sampleOrderTypePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='订单类型'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加类型</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">订单类型名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in orderTypeArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteOrderType(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="orderTypeTotal"
                  :current-page.sync="orderTypePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <!-- <template v-if="cName==='产品规格'">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn padding40">大类名称</div>
                  <div class="tcolumn padding40"
                    style="flex:3">规格信息</div>
                  <div class="tcolumn right padding40">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in measurementArr"
                  :key="index">
                  <div class="tcolumn padding40">{{item.name}}</div>
                  <div class="tcolumn padding40 flexRow"
                    style="flex:3">
                    <span v-for="(itemMeasurement,indexMeasurement) in item.child_measurement"
                      :key="indexMeasurement">{{indexMeasurement>0?'/' + itemMeasurement.name:itemMeasurement.name}}</span>
                  </div>
                  <div class="tcolumn right padding40 flexRow"
                    style="justify-content:flex-end">
                    <span class="blue"
                      @click="addMeasurement(item.id)">新增</span>
                    <span class="border"></span>
                    <span class="red"
                      @click="delMeasurement(item.child_measurement)">删除</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pageCtn">
              <el-pagination background
                :page-size="5"
                layout="prev, pager, next"
                :total="colourTotal"
                :current-page.sync="colourPage">
              </el-pagination>
            </div>
          </template> -->
          <template v-if="cName==='边型'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('side')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('side')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true">添加边型</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">边型</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in sideArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteSide(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="sideTotal"
                  :current-page.sync="sidePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='机型'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('machine')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('machine')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true">添加机型</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">机型</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in machineArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteMachine(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="machineTotal"
                  :current-page.sync="machinePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='组织法'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('methods')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('methods')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true"
                  style="width:6em">添加组织法</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">组织法</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in methodsArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteMethods(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="methodsTotal"
                  :current-page.sync="methodsPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='纱线原料'">
            <div class="flowerCtn">
              <div class="filterCtn"
                style="justify-content: space-between;margin-bottom:8px">
                <el-autocomplete v-model="filterYarnKeyword"
                  clearable
                  :trigger-on-focus="false"
                  style="width:200px;height:32px"
                  :fetch-suggestions="querySearchYarn"
                  placeholder="搜索纱线"></el-autocomplete>
                <div style="display:flex;align-items:center">
                  <div class="btn"
                    :class="!updatedBatchFlag ? 'btnOrange' : 'btnGray'"
                    @click="openUpdatedBatchModel">{{updatedBatchFlag ? '取消' : '批量修改价格'}}</div>
                  <div class="btn btnGreen"
                    v-if="updatedBatchFlag"
                    @click="updatedBatchSubmit">提交修改</div>
                  <template v-if="!updatedBatchFlag">
                    <div class="btn btnBlue"
                      @click="downLoadTemplete('yarn')">下载模板</div>
                    <div class="btn btnBlue"
                      @click="importExcelData('yarn')">导入数据</div>
                    <div class="btn btnBlue"
                      @click="updataYarns">批量添加纱线</div>
                  </template>
                </div>
                <!-- <div class="addBtn"
                  @click="updataYarn('add')"
                  style="width:6em">添加纱线</div> -->
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header">
                  <div class="tb_row">纱线名称</div>
                  <div class="tb_row tb_col"
                    style="flex:2;">
                    <div class="tb_col_item">
                      <div class="tb_row">报价公司</div>
                      <div class="tb_row right">最新报价</div>
                    </div>
                  </div>
                  <div class="tb_row middle">操作</div>
                </div>
                <div class="tb_content"
                  v-for="(item,index) in yarnNameArr"
                  :key="index">
                  <div class="tb_row">{{item.name}}</div>
                  <div class="tb_row tb_col"
                    style="flex:2">
                    <div class="tb_col_item"
                      v-for="(itemPrice,indexPrice) in item.price"
                      :key="indexPrice">
                      <div class="tb_row">{{itemPrice.client_name}}</div>
                      <div class="tb_row right">
                        <template v-if="!updatedBatchFlag">{{`${itemPrice.price ? itemPrice.price + '元/kg' : ''}`}}</template>
                        <template v-else>
                          <zh-input type='number'
                            v-model="itemPrice.price"
                            placeholder='价格'>
                            <template slot='append'>元/kg</template>
                          </zh-input>
                        </template>
                      </div>
                    </div>
                    <div class="tb_col_item"
                      v-if="item.price.length === 0">
                      <span class="tb_row">/</span>
                      <span class="tb_row right">/</span>
                    </div>
                  </div>
                  <div class="tb_row middle">
                    <span class="tb_handle_btn blue"
                      @click="updataYarn('updata',item)">更新</span>
                    <span class="tb_handle_btn red"
                      @click="deleteYarnName(item.id)">删除</span>
                  </div>
                  <!-- <div class="tb_row">{{comPrice(item)}}{{(item.price && item.price.length > 0) ? '元/kg' : ''}}</div>
                  <div class="tb_row middle">
                  </div> -->
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="yarnNameTotal"
                  :current-page.sync="yarnNamePage"
                  @current-change="updatedBatchFlag = false">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='纱线颜色'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('yarnColor')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('yarnColor')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true"
                  style="width:7em">添加纱线颜色</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">纱线颜色</div>
                    <div class="tcolumn padding40">色块</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in yarnColorArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn padding40">
                      <div class="rect"
                        :style="{'background':item.color_code}"></div>
                    </div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteYarnColor(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="yarnColorTotal"
                  :current-page.sync="yarnColorPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='装饰辅料'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('material')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('material')">导入数据</div>
                <div class="addBtn"
                  @click="updataMaterial('add')"
                  style="width:6em">添加辅料</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">辅料名称</div>
                    <div class="tcolumn padding40">计量单位</div>
                    <div class="tcolumn padding40">是否需要织造</div>
                    <div class="tcolumn padding40">最新报价</div>
                    <div class="tcolumn middle padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in materialNameArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn padding40">{{item.unit}}</div>
                    <div class="tcolumn padding40"
                      :style="{'color':item.need_weave?'#1a95ff':'#ccc'}">{{item.need_weave?'需要':'不需要'}}</div>
                    <div class="tcolumn padding40">{{comPrice(item)}}{{(item.price && item.price.length > 0 && item.unit) ? '元/' + item.unit : ''}}</div>
                    <div class="tcolumn padding40">
                      <span class="trow middle handleBtnCtn">
                        <span class="blue"
                          @click="updataMaterial('updata',item)">更新</span>
                        <span class="red"
                          @click="deleteMaterialName(item.id)">删除</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="materialNameTotal"
                  :current-page.sync="materialNamePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='包装辅料'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('pack')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('pack')">导入数据</div>
                <div class="addBtn"
                  @click="updataPack('add')"
                  style="width:6em">添加包装</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">包装名称</div>
                    <div class="tcolumn padding40">计量单位</div>
                    <div class="tcolumn padding40">最新报价</div>
                    <div class="tcolumn middle padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in packMaterialNameArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn padding40">{{item.unit}}</div>
                    <div class="tcolumn padding40">{{comPrice(item)}}{{(item.price && item.price.length > 0) ? (item.type === 1 ? '元/㎡' : (item.unit ? '元/' + item.unit : '')):''}}</div>
                    <div class="tcolumn padding40">
                      <span class="trow middle handleBtnCtn">
                        <span class="blue"
                          @click="updataPack('updata',item)">更新</span>
                        <span class="red"
                          @click="deletePackName(item.id)">删除</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="packMaterialNameTotal"
                  :current-page.sync="packMaterialNamePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='原料工序'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('yarnProcess')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('yarnProcess')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true">添加工序</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">工序名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in materialProcessArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteMaterialProcess(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="materialProcessTotal"
                  :current-page.sync="materialProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='半成品加工'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('semiProcess')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('semiProcess')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true">添加工序</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">工序名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in halfProcessArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteHalfProcess(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="halfProcessTotal"
                  :current-page.sync="halfProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='结算工序'">
            <div class="flowerCtn">
              <div class="btnCtn">
                <div class="addBtn"
                  @click="downLoadTemplete('staffProcess')">下载模板</div>
                <div class="addBtn"
                  @click="importExcelData('staffProcess')">导入数据</div>
                <div class="addBtn"
                  @click="showPopup=true">添加工序</div>
              </div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">工序名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in staffProcessArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteMaterialProcess(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="staffProcessTotal"
                  :current-page.sync="staffProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='系统账户管理'">
            <div class="flowerCtn">
              <div class=" btn addBtn btnBlue"
                @click="resetAuth">添加系统账号</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">姓名</div>
                    <div class="tcolumn">登录账号</div>
                    <div class="tcolumn">手机号</div>
                    <div class="tcolumn">分组</div>
                    <div class="tcolumn">岗位</div>
                    <div class="tcolumn">状态</div>
                    <div class="tcolumn">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="item in authList"
                    :key="item.id">
                    <div class="tcolumn">{{item.name}}</div>
                    <div class="tcolumn">{{item.user_name}}</div>
                    <div class="tcolumn">{{item.telephone}}</div>
                    <div class="tcolumn">{{item.group}}</div>
                    <div class="tcolumn">{{item.station_name}}</div>
                    <div class="tcolumn"
                      :class="{'green':item.status===1,'red':item.status!==1}">{{item.status===1?'已启用':'已禁用'}}</div>
                    <div class="tcolumn flexRow">
                      <span class="blue"
                        @click="changeAuth(item)">修改</span>
                      <span class="border"></span>
                      <span @click="banAuth(item)"
                        :class="{'red':item.status===1,'green':item.status!==1}">{{item.status===1?'禁用':'启用'}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="authTotal"
                  :current-page.sync="authPage"
                  @current-change="getAuth">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='员工标签管理'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup = true">添加标签</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">标签名</div>
                    <div class="tcolumn">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="item in authTagList[authTagPage-1]"
                    :key="item.id">
                    <div class="tcolumn">{{item.name}}</div>
                    <div class="tcolumn flexRow">
                      <span class="blue"
                        @click="changeAuthTag(item)">修改</span>
                      <span class="border"></span>
                      <span @click="deleteAuthTag(item.id)"
                        class="red">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="1"
                  layout="prev, pager, next"
                  :total="authTagTotal"
                  :current-page.sync="authTagPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='工厂小组管理'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加小组</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">小组名称</div>
                    <div class="tcolumn padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in groupArr"
                    :key="index">
                    <div class="tcolumn padding40">
                      <span v-if="!item.updateFlag">{{item.name}}</span>
                      <el-input v-model="item.name"
                        placeholder="请输入名称"
                        v-if="item.updateFlag"
                        style="height:32px"></el-input>
                    </div>
                    <div class="tcolumn padding40">
                      <span class="trow middle handleBtnCtn">
                        <span class="blue"
                          @click="updateGroup(item)"
                          v-if="item.updateFlag">确认修改</span>
                        <span class="blue"
                          @click="item.updateFlag = true;$forceUpdate()"
                          v-if="!item.updateFlag">修改</span>
                        <span class="red"
                          @click="deleteGroup(item.id)">删除</span>
                        <span :class="item.status === 1 ? 'orange' : 'green'"
                          @click="banGroup(item)">{{item.status === 1 ? '禁用' : '启用'}}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="groupTotal"
                  :current-page.sync="groupPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='工厂部门管理'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加部门</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">部门名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in stationArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteStation(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="stationTotal"
                  :current-page.sync="stationPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='工厂信息设置'">
            <div class="companySetting">
              <div class="row">
                <div class="label">企业LOGO：</div>
                <div class="imgCtn">
                  <el-upload class="avatar-uploader"
                    drag
                    action="https://upload.qiniup.com/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeUpload"
                    :data="postData"
                    :file-list="companyInfo.file_logo"
                    ref="uploada_logo">
                    <img v-if="companyInfo.logoUrl"
                      :src="companyInfo.logoUrl"
                      class="logo-img">
                    <i v-else
                      class="el-icon-plus logo-icon"></i>
                  </el-upload>
                  <div class="prompt">点击或拖拽图片至上传框,只能上传jpg/png文件，且不超过6MB</div>
                </div>
              </div>
              <div class="row">
                <div class="label">公司名称：</div>
                <div class="content">
                  <el-input placeholder="请输入公司名称"
                    class="input-item"
                    v-model="companyInfo.client_name"
                    disabled
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="row">
                <div class="label">公司简称：</div>
                <div class="content">
                  <el-input placeholder="请输入公司简称"
                    class="input-item"
                    v-model="companyInfo.alias"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司简介:</span>
                <div class="content">
                  <el-input class="input-item"
                    style="width:600px;"
                    type="textarea"
                    placeholder="公司简介在200字以内..."
                    v-model="companyInfo.client_about"
                    :rows="7">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司图片：</span>
                <div class="content clientImg">
                  <el-upload action="https://upload.qiniup.com/"
                    drag
                    :before-upload="beforeUpload"
                    :data="postData"
                    :file-list="companyInfo.file_image"
                    list-type="picture-card"
                    ref="uploada_image">
                    <i slot="default"
                      class="el-icon-plus"
                      style="font-size:30px;"></i>
                  </el-upload>
                  <!-- <el-dialog :visible.sync="dialogVisible">
                    <img width="100%"
                      alt="">
                  </el-dialog> -->
                  <div class="prompt">点击或拖拽至上传框,只能上传jpg/png文件，且不超过6MB</div>
                </div>
              </div>
              <div class="row">
                <span class="label">公司电话:</span>
                <div class="content">
                  <el-input placeholder="请输入公司电话"
                    class="input-item"
                    v-model="companyInfo.client_tel">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司邮箱：</span>
                <div class="content">
                  <el-input placeholder="请输入公司邮箱"
                    class="input-item"
                    v-model="companyInfo.client_email">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司地址：</span>
                <div class="content">
                  <el-input placeholder="请输入公司地址"
                    class="input-item"
                    v-model="companyInfo.client_address">
                  </el-input>
                </div>
              </div>
              <div class="btnCtn">
                <div class="btn btnGray">取消</div>
                <div class="btn btnBlue"
                  @click="saveCompany">完成</div>
              </div>
            </div>
          </template>
          <template v-if="cName==='打印设置'">
            <div class="flowerCtn">
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">打印页面</div>
                    <div class="tcolumn padding40">页面标题</div>
                    <div class="tcolumn padding40 middle">订单公司</div>
                    <div class="tcolumn middle padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in $clone(printEditArr).splice((printEditPages-1)*5,5)"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn padding40">{{item.title}}</div>
                    <div class="tcolumn padding40 middle"
                      :class="item.isHideClient ? 'red' : 'green'">{{item.isHideClient ? '隐藏' : '显示'}}</div>
                    <div class="tcolumn padding40">
                      <span class="trow middle handleBtnCtn">
                        <span class="blue"
                          @click="updatePrint(item)">修改</span>
                        <!-- <span class="blue"
                          @click="deletePackName(item.id)">查看</span> -->
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="printEditTotal"
                  :current-page.sync="printEditPages">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='报价预加载'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup = true">添加预加载</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">预加载名称</div>
                    <div class="tcolumn middle padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in priceInfo"
                    :key="index">
                    <div class="tcolumn padding40">{{item.title}}</div>
                    <div class="tcolumn padding40"
                      style="flex-direction: row;align-items:center;">
                      <span class="blue"
                        @click="changePriceInfo(item)">修改</span>
                      <span class="red"
                        style="margin-left:16px"
                        @click="deletePriceInfo(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="priceTotal"
                  :current-page.sync="pricePages">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='报价说明'">
            <div class="flowerCtn">
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">说明类型</div>
                    <div class="tcolumn middle padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in $clone(priceRemark).splice((priceRemarkPages-1)*5,5)"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn padding40">
                      <span class="trow middle handleBtnCtn">
                        <span class="blue"
                          @click="updatedPriceRemark(item)">修改</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="priceRemarkTotal"
                  :current-page.sync="priceRemarkPages">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='订单预警'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup = true">添加预警</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">类型名称</div>
                    <div class="tcolumn middle padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in orderWarnList[orderWarnPages - 1]"
                    :key="index">
                    <div class="tcolumn padding40">{{item.title}}</div>
                    <div class="tcolumn padding40"
                      style="flex-direction: row;align-items:center;">
                      <span class="blue"
                        @click="changeOrderWarn(item)">修改</span>
                      <span class="red"
                        style="margin-left:16px"
                        @click="deleteOrderSampleWarn(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="orderWarnList.length"
                  :current-page.sync="orderWarnPages">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='样单预警'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup = true">添加预警</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">类型名称</div>
                    <div class="tcolumn middle padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in sampleWarnList[sampleWarnPages - 1]"
                    :key="index">
                    <div class="tcolumn padding40">{{item.title}}</div>
                    <div class="tcolumn padding40"
                      style="flex-direction: row;align-items:center;">
                      <span class="blue"
                        @click="changeSampleWarn(item)">修改</span>
                      <span class="red"
                        style="margin-left:16px"
                        @click="deleteOrderSampleWarn(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="priceTotal"
                  :current-page.sync="pricePages">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='英文工厂信息'">
            <div class="documentSetting"
              v-loading='documentCompanyInfo.loading'>
              <div class="row">
                <div class="label">公司英文名称(Company Name)：</div>
                <div class="content">
                  <el-input placeholder="请输入公司英文名称(Company Name)"
                    class="input-item"
                    v-model="documentCompanyInfo.name"
                    :disabled='!documentCompanyInfo.is_updated'>
                  </el-input>
                </div>
              </div>
              <div class="row">
                <div class="label">公司统一社会信用代码(Company Social Credit Code)：</div>
                <div class="content">
                  <el-input placeholder="请输入公司统一社会信用代码(Company Social Credit Code)"
                    :disabled='!documentCompanyInfo.is_updated'
                    class="input-item"
                    v-model="documentCompanyInfo.code">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司英文地址(Company Address)：</span>
                <div class="content">
                  <el-input class="input-item"
                    :disabled='!documentCompanyInfo.is_updated'
                    placeholder="请输入公司英文地址(Company Address)"
                    v-model="documentCompanyInfo.address">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司电话(Telephone)：</span>
                <div class="content">
                  <el-input class="input-item"
                    :disabled='!documentCompanyInfo.is_updated'
                    placeholder="请输入公司电话(Telephone)"
                    v-model="documentCompanyInfo.tel">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司传真(Fax)：</span>
                <div class="content">
                  <el-input class="input-item"
                    :disabled='!documentCompanyInfo.is_updated'
                    placeholder="请输入公司传真(Fax)"
                    v-model="documentCompanyInfo.fax">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司签章(Company Signature)：</span>
                <div class="content">
                  <!-- <el-upload :before-upload="beforeUpload"
                    :disabled='!documentCompanyInfo.is_updated'
                    :data="postData"
                    :file-list="documentCompanyInfo.signature_img"
                    drag
                    action="https://upload.qiniup.com/"
                    ref="companySignatureUpload">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处，或
                      <em>点击上传</em>
                      <br />
                      只能上传jpg/png文件，且不超过6MB
                    </div>
                  </el-upload> -->
                  <el-upload :before-upload="beforeUpload"
                    :disabled='!documentCompanyInfo.is_updated'
                    class="companySignatureUpload"
                    ref="companySignatureUpload"
                    action="https://upload.qiniup.com/"
                    drag
                    :data="postData"
                    :file-list="documentCompanyInfo.signature ? [{url:documentCompanyInfo.signature}] : []"
                    :show-file-list="false"
                    :on-success="uploadSignatureSuccess">
                    <el-image class="showImg"
                      v-if="documentCompanyInfo.signature"
                      :src="documentCompanyInfo.signature"
                      fit="fill"></el-image>
                    <i v-else
                      class="el-icon-plus addIcon"></i>
                  </el-upload>
                  <div class="prompt">点击或拖拽至上传框,只能上传jpg/png文件，且不超过6MB</div>
                </div>
              </div>
              <div class="row">
                <span class="label">报关专用章：</span>
                <div class="content">
                  <el-upload :before-upload="beforeUpload"
                    :disabled='!documentCompanyInfo.is_updated'
                    class="companySignatureUpload"
                    ref="companyCustomsUpload"
                    action="https://upload.qiniup.com/"
                    drag
                    :data="postData"
                    :file-list="documentCompanyInfo.special_seal ? [{url:documentCompanyInfo.special_seal}] : []"
                    :show-file-list="false"
                    :on-success="uploadCustomsSuccess">
                    <el-image class="showImg"
                      v-if="documentCompanyInfo.special_seal"
                      :src="documentCompanyInfo.special_seal"
                      fit="fill"></el-image>
                    <i v-else
                      class="el-icon-plus addIcon"></i>
                  </el-upload>
                  <div class="prompt">点击或拖拽至上传框,只能上传jpg/png文件，且不超过6MB</div>
                </div>
              </div>
              <div class="btnCtn">
                <div class="btn btnOrange"
                  v-if="!documentCompanyInfo.is_updated"
                  @click="documentCompanyInfo.is_updated = true">修改</div>
                <template v-else>
                  <div class="btn btnGray"
                    @click="documentCompanyInfo.is_updated = false">取消</div>
                  <div class="btn btnBlue"
                    @click="saveDocumentCompanyInfo">提交</div>
                </template>
              </div>
            </div>
          </template>
          <template v-if="cName==='英文银行信息'">
            <div class="documentSetting"
              v-loading='documentBankInfo.loading'>
              <div class="row">
                <div class="label">开户银行(Bank Name)：</div>
                <div class="content">
                  <el-input placeholder="请输入开户银行(Bank Name)"
                    class="input-item"
                    v-model="documentBankInfo.name"
                    :disabled='!documentBankInfo.is_updated'>
                  </el-input>
                </div>
              </div>
              <div class="row">
                <div class="label">开户地址(Bank Address)：</div>
                <div class="content">
                  <el-input placeholder="请输入开户地址(Bank Address)"
                    :disabled='!documentBankInfo.is_updated'
                    class="input-item"
                    v-model="documentBankInfo.address"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">银行SWIFT码(SWIFT Code)：</span>
                <div class="content">
                  <el-input class="input-item"
                    :disabled='!documentBankInfo.is_updated'
                    placeholder="请输入银行SWIFT码(SWIFT Code)"
                    v-model="documentBankInfo.code">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">收款人(Beneficiary)：</span>
                <div class="content">
                  <el-input class="input-item"
                    :disabled='!documentBankInfo.is_updated'
                    placeholder="请输入收款人(Beneficiary)"
                    v-model="documentBankInfo.beneficiary">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">开户账号(Account No)：</span>
                <div class="content">
                  <el-input class="input-item"
                    :disabled='!documentBankInfo.is_updated'
                    placeholder="请输入开户账号(Account No)"
                    v-model="documentBankInfo.account_no">
                  </el-input>
                </div>
              </div>
              <div class="btnCtn">
                <div class="btn btnOrange"
                  v-if="!documentBankInfo.is_updated"
                  @click="documentBankInfo.is_updated = true">修改</div>
                <template v-else>
                  <div class="btn btnGray"
                    @click="documentBankInfo.is_updated = false">取消</div>
                  <div class="btn btnBlue"
                    @click="saveDocumentBankInfo">提交</div>
                </template>
              </div>
            </div>
          </template>
          <template v-if="cName==='HS编码设置'">
            <div class="flowerCtn">
              <div class="filterCtn"
                style="justify-content: space-between;margin-bottom:8px">
                <div style="display:flex;align-items:center">
                  <span>筛选条件：</span>
                  <el-input v-model="HSCode"
                    clearable
                    style="width:200px;height:32px"
                    placeholder="搜索HS编码"
                    @change="getDocumentHSCodeInfo(1)"></el-input>
                  <div class="btn btnGray"
                    @click="HSCode = '';getDocumentHSCodeInfo(1)">重置</div>
                </div>
                <!-- <div class="addBtn"
                  @click="addDocument()"
                  style="width:6em">添加HS编码</div> -->
              </div>
              <div class="tableCtnLv2 minHeight5"
                v-loading='documentHSCodeInfo.loading'>
                <el-table :data="documentHSCodeList"
                  style="width: 100%"
                  max-height='400'>
                  <el-table-column fixed
                    prop="hs_code"
                    label="HS编码"
                    width="100">
                  </el-table-column>
                  <el-table-column fixed
                    prop="product_name"
                    label="商品名称"
                    width="200">
                  </el-table-column>
                  <el-table-column prop="export"
                    width="50"
                    label="出口税率">
                  </el-table-column>
                  <el-table-column prop="export_rebate"
                    width="50"
                    label="出口退税税率">
                  </el-table-column>
                  <el-table-column prop="temporary_export"
                    width="50"
                    label="出口暂定税率">
                  </el-table-column>
                  <el-table-column prop="vat_rate"
                    width="50"
                    label="增值税率">
                  </el-table-column>
                  <el-table-column prop="most_favored_nation"
                    width="50"
                    label="最惠国进口税率">
                  </el-table-column>
                  <el-table-column prop="provisional_import_tariff"
                    width="50"
                    label="进口暂定税率">
                  </el-table-column>
                  <el-table-column prop="import_general_duty"
                    width="50"
                    label="进口普通税率">
                  </el-table-column>
                  <el-table-column prop="consumption"
                    width="50"
                    label="消费税率">
                  </el-table-column>
                  <el-table-column prop="first_legal_unit"
                    width="50"
                    label="第一法定单位">
                  </el-table-column>
                  <el-table-column prop="second_statutory_unit"
                    width="50"
                    label="第二法定单位">
                  </el-table-column>
                  <el-table-column prop="first_legal_unit_code"
                    width="50"
                    label="第一法定单位代码">
                  </el-table-column>
                  <el-table-column prop="second_legal_unit_code"
                    width="50"
                    label="第二法定单位代码">
                  </el-table-column>
                  <el-table-column prop="regulatory_condition_info"
                    width="200"
                    label="监管条件详细信息">
                  </el-table-column>
                  <el-table-column prop="quarantine_category_code"
                    width="80"
                    label="检验检疫类别代码缩写">
                  </el-table-column>
                  <el-table-column prop="quarantine_category_details"
                    width="80"
                    label="检验检疫类别详细信息">
                  </el-table-column>
                  <el-table-column prop="declaration_elements"
                    width="300"
                    label="申报要素">
                  </el-table-column>
                </el-table>
                <!-- <div class="tb_header">
                  <div class="tb_row">HS编码</div>
                  <div class="tb_row">商品名称</div>
                  <div class="tb_row">进口优惠税</div>
                  <div class="tb_row">出口税率</div>
                  <div class="tb_row middle">操作</div>
                </div>
                <div class="tb_content"
                  v-for="(item,index) in documentHSCodeList"
                  :key="index">
                  <div class="tb_row">{{item.hs_code}}</div>
                  <div class="tb_row">{{item.product_name}}</div>
                  <div class="tb_row">{{'进口优惠税'}}</div>
                  <div class="tb_row">出口税率</div>
                  <div class="tb_row middle">
                    <span class="tb_handle_btn red"
                      @click="deleteDocumentHSCode(item.id)">删除</span>
                  </div>
                </div> -->
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="documentHSCodeTotal"
                  :current-page.sync="documentHSCodePages"
                  @current-change="getDocumentHSCodeInfo">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='常用公司设置'">
            <div class="flowerCtn">
              <div class="filterCtn"
                style="justify-content: space-between;margin-bottom:8px">
                <div style="display:flex;align-items:center">
                  <span>筛选条件：</span>
                  <el-input v-model="clientName"
                    clearable
                    style="width:200px;height:32px"
                    placeholder="搜索公司名称"
                    @change="getDocumentClientInfo(1)"></el-input>
                  <div class="btn btnGray"
                    @click="clientName = '';getDocumentClientInfo(1)">重置</div>
                </div>
                <div class="addBtn"
                  @click="addDocument()"
                  style="width:6em">添加公司</div>
              </div>
              <div class="tableCtnLv2 minHeight5"
                v-loading='documentClientInfo.loading'>
                <div class="tb_header">
                  <div class="tb_row">公司名称</div>
                  <div class="tb_row">公司地址</div>
                  <div class="tb_row">添加日期</div>
                  <div class="tb_row middle">操作</div>
                </div>
                <div class="tb_content"
                  v-for="(item,index) in documentClientList"
                  :key="index">
                  <div class="tb_row">{{item.name}}</div>
                  <div class="tb_row">{{item.address}}</div>
                  <div class="tb_row">{{$getTime(item.created_at)}}</div>
                  <div class="tb_row middle">
                    <span class="tb_handle_btn orange"
                      @click="addDocument(item)">修改</span>
                    <span class="tb_handle_btn red"
                      @click="deleteDocumentClient(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="documentClientTotal"
                  :current-page.sync="documentClientPages"
                  @current-change="getDocumentClientInfo">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='常用城市设置'">
            <div class="flowerCtn">
              <div class="filterCtn"
                style="justify-content: space-between;margin-bottom:8px">
                <div style="display:flex;align-items:center">
                  <span>筛选条件：</span>
                  <el-input v-model="portName"
                    clearable
                    style="width:200px;height:32px"
                    placeholder="搜索城市名称"
                    @change="getDocumentPortInfo(1)"></el-input>
                  <div class="btn btnGray"
                    @click="portName = '';getDocumentPortInfo(1)">重置</div>
                </div>
                <div class="addBtn"
                  @click="addDocument()"
                  style="width:6em">添加城市</div>
              </div>
              <div class="tableCtnLv2 minHeight5"
                v-loading='documentPortInfo.loading'>
                <div class="tb_header">
                  <div class="tb_row">常用国家(Country)</div>
                  <div class="tb_row">常用城市 (City Name)</div>
                  <div class="tb_row">添加日期</div>
                  <div class="tb_row middle">操作</div>
                </div>
                <div class="tb_content"
                  v-for="(item,index) in documentPortList"
                  :key="index">
                  <div class="tb_row">{{item.country}}</div>
                  <div class="tb_row">{{item.port_name}}</div>
                  <div class="tb_row">{{$getTime(item.created_at)}}</div>
                  <div class="tb_row middle">
                    <span class="tb_handle_btn orange"
                      @click="addDocument(item)">修改</span>
                    <span class="tb_handle_btn red"
                      @click="deleteDocumentPort(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="documentPortTotal"
                  :current-page.sync="documentPortPages"
                  @current-change="getDocumentPortInfo">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='常用品名设置'">
            <div class="flowerCtn">
              <div class="filterCtn"
                style="justify-content: space-between;margin-bottom:8px">
                <div style="display:flex;align-items:center">
                  <span>筛选条件：</span>
                  <el-input v-model="documentType"
                    clearable
                    style="width:200px;height:32px"
                    placeholder="搜索品名名称"
                    @change="getDocumentTypeInfo(1)"></el-input>
                  <div class="btn btnGray"
                    @click="documentType = '';getDocumentTypeInfo(1)">重置</div>
                </div>
                <div class="addBtn"
                  @click="addDocument()"
                  style="width:6em">添加品名</div>
              </div>
              <div class="tableCtnLv2 minHeight5"
                v-loading='documentTypeInfo.loading'>
                <div class="tb_header">
                  <div class="tb_row">中文品类</div>
                  <div class="tb_row">英文品名</div>
                  <div class="tb_row">单位</div>
                  <div class="tb_row">添加日期</div>
                  <div class="tb_row middle">操作</div>
                </div>
                <div class="tb_content"
                  v-for="(item,index) in documentTypeList"
                  :key="index">
                  <div class="tb_row">{{item.name}}</div>
                  <div class="tb_row">{{item.english}}</div>
                  <div class="tb_row">{{item.unit || '-'}}</div>
                  <div class="tb_row">{{$getTime(item.created_at)}}</div>
                  <div class="tb_row middle">
                    <!-- <span class="tb_handle_btn orange"
                      @click="addDocument(item)">修改</span> -->
                    <span class="tb_handle_btn red"
                      @click="deleteDocumentType(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="documentTypeTotal"
                  :current-page.sync="documentTypePages"
                  @current-change="getDocumentTypeInfo">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='常用付款方式'">
            <div class="flowerCtn">
              <div class="filterCtn"
                style="justify-content: space-between;margin-bottom:8px">
                <div style="display:flex;align-items:center">
                  <span>筛选条件：</span>
                  <el-input v-model="documentPayType"
                    clearable
                    style="width:200px;height:32px"
                    placeholder="搜索付款方式名称"
                    @change="getDocumentPayTypeInfo(1)"></el-input>
                  <div class="btn btnGray"
                    @click="documentPayType = '';getDocumentPayTypeInfo(1)">重置</div>
                </div>
                <div class="addBtn"
                  @click="addDocument()"
                  style="width:6em">添加付款方式</div>
              </div>
              <div class="tableCtnLv2 minHeight5"
                v-loading='documentPayTypeInfo.loading'>
                <div class="tb_header">
                  <div class="tb_row">中文名称</div>
                  <div class="tb_row">英文代号</div>
                  <div class="tb_row">添加日期</div>
                  <div class="tb_row middle">操作</div>
                </div>
                <div class="tb_content"
                  v-for="(item,index) in documentPayTypeList"
                  :key="index">
                  <div class="tb_row">{{item.name}}</div>
                  <div class="tb_row">{{item.english}}</div>
                  <div class="tb_row">{{$getTime(item.created_at)}}</div>
                  <div class="tb_row middle">
                    <!-- <span class="tb_handle_btn orange"
                      @click="addDocument(item)">修改</span> -->
                    <span class="tb_handle_btn red"
                      @click="deleteDocumentPayType(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="documentPayTypeTotal"
                  :current-page.sync="documentPayTypePages"
                  @current-change="getDocumentPayTypeInfo">
                </el-pagination>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPopup">
      <template v-if="cName==='产品花型'">
        <div class="main">
          <div class="title">
            <div class="text">新增花型</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">花型名称：</div>
              <div class="info">
                <el-input placeholder="请输入花型名称"
                  v-model="flower"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveFlower">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='产品成分'">
        <div class="main">
          <div class="title">
            <div class="text">新增成分</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">成分名称：</div>
              <div class="info">
                <el-input placeholder="请输入成分名称"
                  v-model="ingredient"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveIngredient">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='产品配色'">
        <div class="main">
          <div class="title">
            <div class="text">新增配色</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">配色名称：</div>
              <div class="info">
                <el-input placeholder="请输入配色名称"
                  v-model="colour"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveColour">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='产品尺码'">
        <div class="main">
          <div class="title">
            <div class="text">新增尺码</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">尺码名称：</div>
              <div class="info">
                <el-input placeholder="请输入尺码名称"
                  v-model="size"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveSize">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='样单类型'">
        <div class="main">
          <div class="title">
            <div class="text">样单类型</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">样单类型：</div>
              <div class="info">
                <el-input placeholder="请输入样单类型"
                  v-model="sampleOrderType"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveSampleOrderType">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='订单类型'">
        <div class="main">
          <div class="title">
            <div class="text">订单类型</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">订单类型：</div>
              <div class="info">
                <el-input placeholder="请输入订单类型"
                  v-model="orderType"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveOrderType">确定</div>
          </div>
        </div>
      </template>
      <!-- <template v-if="cName==='产品规格'">
        <div class="main">
          <div class="title">
            <div class="text">新增规格</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">规格名称：</div>
              <div class="info">
                <el-input placeholder="请输入规格名称"
                  v-model="measurement"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveMeasurement">确定</div>
          </div>
        </div>
      </template> -->
      <template v-if="cName==='边型'">
        <div class="main">
          <div class="title">
            <div class="text">新增边型</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">边型名称：</div>
              <div class="info">
                <el-input placeholder="请输入边型名称"
                  v-model="side"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveSide">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='机型'">
        <div class="main">
          <div class="title">
            <div class="text">新增机型</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">机型名称：</div>
              <div class="info">
                <el-input placeholder="请输入机型名称"
                  v-model="machine"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveMachine">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='组织法'">
        <div class="main">
          <div class="title">
            <div class="text">新增组织法</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">组织法名称：</div>
              <div class="info">
                <el-input placeholder="请输入组织法名称"
                  v-model="methods"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveMethods">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='纱线原料'">
        <div class="main"
          style="width:800px">
          <div class="title">
            <div class="text">{{yarn_handle_type === 'add' ? '添加纱线原料' : '更新纱线信息'}}</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label isMust">纱线名称：</div>
              <div class="info">
                <el-input placeholder="请输入纱线名称"
                  v-model="changeYarnInfo.yarnName"></el-input>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in changeYarnInfo.yarnPriceArr"
              :key="index">
              <div class="label">报价信息：</div>
              <div class="info flex">
                <el-select v-model="item.company"
                  style="margin-right:16px"
                  filterable
                  placeholder="请选择公司">
                  <el-option v-for="item in clientList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <zh-input v-model="item.price"
                  type='number'
                  style="margin-right:16px"
                  placeholder="请输入报价">
                  <template slot="append">元/kg</template>
                </zh-input>
                <zh-input v-model="item.desc"
                  placeholder="备注信息">
                </zh-input>
              </div>
              <div class="editBtn blue"
                @click="addClient(changeYarnInfo.yarnPriceArr)"
                v-if="index===0">添加</div>
              <div class="editBtn red"
                @click="deleteClient(changeYarnInfo.yarnPriceArr,index)"
                v-if="index>0">删除</div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveYarnName">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='纱线颜色'">
        <div class="main">
          <div class="title">
            <div class="text">添加纱线颜色</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">颜色名称：</div>
              <div class="info">
                <el-input placeholder="请输入颜色名称"
                  v-model="yarnColor"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">选择色块：</div>
              <div class="info">
                <el-color-picker v-model="yarnColorCode"></el-color-picker>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveYarnColor">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='装饰辅料'">
        <div class="main">
          <div class="title">
            <div class="text">{{yarn_handle_type === 'add' ? '添加辅料信息' : '更新辅料信息'}}</div>
            <i class="el-icon-close"
              @click="closeAndResetInfo('material')"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">辅料名称：</div>
              <div class="info">
                <zh-input placeholder="请输入装饰辅料名称"
                  v-model="changeMaterialInfo.materialName"></zh-input>
              </div>
            </div>
            <div class="row">
              <div class="label">需要织造：</div>
              <div class="info">
                <el-switch v-model="changeMaterialInfo.need_weave"
                  @change="$forceUpdate()"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="需要"
                  inactive-text="不需要">
                </el-switch>
              </div>
            </div>
            <div class="row">
              <div class="label">计量单位：</div>
              <div class="info">
                <zh-input placeholder="请输入计量单位"
                  v-model="changeMaterialInfo.unit"></zh-input>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in changeMaterialInfo.materialPriceArr"
              :key="index">
              <div class="label">报价信息：</div>
              <div class="info flex">
                <el-select v-model="item.company"
                  style="margin-right:16px"
                  filterable
                  placeholder="请选择公司">
                  <el-option v-for="item in clientList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <zh-input v-model="item.price"
                  type='number'
                  placeholder="请输入报价">
                  <template slot="append">元/{{changeMaterialInfo.unit ? changeMaterialInfo.unit : '个'}}</template>
                </zh-input>
              </div>
              <div class="editBtn blue"
                @click="addClient(changeMaterialInfo.materialPriceArr)"
                v-if="index===0">添加</div>
              <div class="editBtn red"
                @click="deleteClient(changeMaterialInfo.materialPriceArr,index)"
                v-if="index>0">删除</div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="closeAndResetInfo('material')">取消</div>
            <div class="btn btnBlue"
              @click="saveMaterial">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='包装辅料'">
        <div class="main">
          <div class="title">
            <div class="text">{{yarn_handle_type === 'add' ? '添加包装信息' : '更新包装信息'}}</div>
            <i class="el-icon-close"
              @click="closeAndResetInfo('pack')"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">包装名称：</div>
              <div class="info">
                <zh-input placeholder="请输入包装名称"
                  v-model="changePackMaterialInfo.packName"></zh-input>
              </div>
            </div>
            <div class="row">
              <div class="label">计量单位：</div>
              <div class="info">
                <zh-input placeholder="请输入计量单位"
                  v-model="changePackMaterialInfo.unit"></zh-input>
              </div>
            </div>
            <div class="row">
              <div class="label">辅料价格：</div>
              <div class="info"
                style="line-height:32px">
                <el-radio-group v-model="changePackMaterialInfo.type">
                  <el-radio label="area">面积</el-radio>
                  <el-radio label="other">其他</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in changePackMaterialInfo.packMaterialPriceArr"
              :key="index">
              <div class="label">报价信息：</div>
              <div class="info flex">
                <el-select v-model="item.company"
                  style="margin-right:16px"
                  filterable
                  placeholder="请选择公司"
                  @change='$forceUpdate()'>
                  <el-option v-for="item in clientList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <zh-input v-model="item.price"
                  type='number'
                  placeholder="请输入报价">
                  <template slot="append">元/{{changePackMaterialInfo.type === 'area' ? '㎡' : changePackMaterialInfo.unit ? changePackMaterialInfo.unit : '个'}}
                  </template>
                </zh-input>
              </div>
              <div class="editBtn blue"
                @click="addClient(changePackMaterialInfo.packMaterialPriceArr)"
                v-if="index===0">添加
              </div>
              <div class="editBtn red"
                @click="deleteClient(changePackMaterialInfo.packMaterialPriceArr,index)"
                v-if="index>0">删除</div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="closeAndResetInfo('pack')">取消</div>
            <div class="btn btnBlue"
              @click="savePack">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='原料工序'">
        <div class="main">
          <div class="title">
            <div class="text">添加工序</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">工序名称：</div>
              <div class="info">
                <el-input placeholder="请输入工序名称"
                  v-model="materialProcess"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveMaterialProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='半成品加工'">
        <div class="main">
          <div class="title">
            <div class="text">添加工序</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">工序名称：</div>
              <div class="info">
                <el-input placeholder="请输入工序名称"
                  v-model="halfProcess"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveHalfProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='结算工序'">
        <div class="main">
          <div class="title">
            <div class="text">添加工序</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">工序名称：</div>
              <div class="info">
                <el-input placeholder="请输入工序名称"
                  v-model="staffProcess"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveStaffProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='工厂小组管理'">
        <div class="main">
          <div class="title">
            <div class="text">添加小组</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">小组名称：</div>
              <div class="info">
                <el-input placeholder="请输入小组名称"
                  v-model="group"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveGroup">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='工厂部门管理'">
        <div class="main">
          <div class="title">
            <div class="text">添加部门</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">部门名称：</div>
              <div class="info">
                <el-input placeholder="请输入部门名称"
                  v-model="station"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveStation">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='系统账户管理'">
        <div class="main">
          <div class="title">
            <div class="text">添加系统账号</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">员工姓名：</div>
              <div class="info">
                <el-input placeholder="请输入员工姓名"
                  v-model="authInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">联系方式：</div>
              <div class="info">
                <zh-input placeholder="请输入手机号"
                  type="mobile"
                  v-model="authInfo.telephone"></zh-input>
              </div>
            </div>
            <div class="row">
              <div class="label">登录帐号：</div>
              <div class="info">
                <zh-input placeholder="请输入自定义帐号"
                  :disabled="authInfo.id ? true : false"
                  v-model="authInfo.user_name"></zh-input>
              </div>
            </div>
            <div class="row">
              <div class="label">隶属小组：</div>
              <div class="info">
                <el-select v-model="authInfo.group_id"
                  placeholder="请选择小组">
                  <el-option v-for="(item,index) in groupList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">岗位名称：</div>
              <div class="info">
                <el-input placeholder="请输入岗位名称"
                  v-model="authInfo.station_name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">管理权限：</div>
              <div class="info">
                <el-radio v-model="authInfo.is_admin"
                  :label="1">超级管理员</el-radio>
                <el-radio v-model="authInfo.is_admin"
                  :label="0">普通权限</el-radio>
              </div>
            </div>
            <div class="row">
              <div class="label">审核权限：</div>
              <div class="info">
                <el-radio v-model="authInfo.has_check"
                  :label="1">有审核权限</el-radio>
                <el-radio v-model="authInfo.has_check"
                  :label="0">没有审核权限</el-radio>
              </div>
            </div>
            <div class="row">
              <div class="label">管理模块：</div>
              <div class="info">
                <el-checkbox-group v-model="authInfo.module_id">
                  <el-checkbox v-for="item in permissions"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id">
                    {{item.module}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="row"
              v-if="permissionsDetailArr.length > 0">
              <div class="label">模块细分：</div>
              <div class="info">
                <el-checkbox-group v-model="authInfo.module_id_detail">
                  <el-checkbox v-for="item in permissionsDetailArr"
                    :key="item.id"
                    :label='item.id'
                    :value='item.id'>
                    {{item.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveAuth">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='员工标签管理'">
        <div class="main">
          <div class="title">
            <div class="text">{{authTagInfo.id ? '修改' :'添加'}}员工标签</div>
            <i class="el-icon-close"
              @click="resetAuthTag"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">标签名：</div>
              <div class="info">
                <el-input placeholder="请输入标签名"
                  v-model="authTagInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="resetAuthTag">取消</div>
            <div class="btn btnBlue"
              @click="saveAuthTag">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='打印设置'">
        <div class="main"
          style="width:600px;">
          <div class="title">
            <div class="text">打印标题/备注修改-{{printEditInfo.name}}</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content"
            style="min-height:430px">
            <div class="row">
              <div class="label">打印单标题：</div>
              <div class="info">
                <el-input placeholder="请输入打印页面标题"
                  v-model="printEditInfo.title"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">订单公司：</div>
              <div class="info">
                <el-switch v-model="printEditInfo.isHideClient"
                  active-text="隐藏"
                  inactive-text="展示" />
              </div>
            </div>
            <div class="row">
              <div class="label">备注内容：</div>
              <div class="info">
                <div ref="editorPrint"></div>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="savePrint">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='报价预加载'">
        <div class="main"
          style="width:600px;">
          <div class="title">
            <div class="text">添加报价单预加载</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">预加载标题：</div>
              <div class="info">
                <el-input placeholder="请输入预加载标题"
                  v-model="priceEditInfo.title"></el-input>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in priceEditInfo.weave"
              :key="index + 'weave'">
              <div class="label">{{index === 0 ? '织造明细：' : ''}}</div>
              <div class="info"
                style="display:flex;align-items:center">
                <el-select v-model="item.name"
                  clearable
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择织造明细">
                  <el-option v-for="item in weave_list"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
                <zh-input type='number'
                  style="width:300px;margin-left:24px"
                  v-model="item.price"
                  placeholder='请输入单价'>
                  <template slot="append">元</template>
                </zh-input>
              </div>
              <div class="editBtn blue"
                v-if="index === 0"
                @click="addItem(priceEditInfo.weave,'weave')">添加</div>
              <div class="editBtn red"
                @click="deleteItem(priceEditInfo.weave,index)"
                v-else>删除</div>
            </div>
            <div class="row"
              v-for="(item,index) in priceEditInfo.semi"
              :key="index + 'semi'">
              <div class="label">{{index === 0 ? '半成品工序：' : ''}}</div>
              <div class="info"
                style="display:flex;align-items:center">
                <el-select v-model="item.name"
                  clearable
                  filterable
                  multiple
                  allow-create
                  default-first-option
                  placeholder="请选择半成品加工工序">
                  <el-option v-for="item in semi_list"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
                <zh-input type='number'
                  style="width:300px;margin-left:24px"
                  v-model="item.price"
                  placeholder='请输入单价'>
                  <template slot="append">元</template>
                </zh-input>
              </div>
              <div class="editBtn blue"
                v-if="index === 0"
                @click="addItem(priceEditInfo.semi,'semi')">添加</div>
              <div class="editBtn red"
                @click="deleteItem(priceEditInfo.semi,index)"
                v-else>删除</div>
            </div>
            <div class="row"
              v-for="(item,index) in priceEditInfo.finished"
              :key="index + 'finished'">
              <div class="label">{{index === 0 ? '成品工序：' : ''}}</div>
              <div class="info"
                style="display:flex;align-items:center">
                <el-select v-model="item.name"
                  clearable
                  filterable
                  multiple
                  allow-create
                  default-first-option
                  placeholder="请选择织造明细">
                  <el-option v-for="item in finished_list"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
                <zh-input type='number'
                  style="width:300px;margin-left:24px"
                  v-model="item.price"
                  placeholder='请输入单价'>
                  <template slot="append">元</template>
                </zh-input>
              </div>
              <div class="editBtn blue"
                v-if="index === 0"
                @click="addItem(priceEditInfo.finished,'finished')">添加</div>
              <div class="editBtn red"
                @click="deleteItem(priceEditInfo.finished,index)"
                v-else>删除</div>
            </div>
            <div class="row"
              v-for="(item,index) in priceEditInfo.pack"
              :key="index + 'pack'">
              <div class="label">{{index === 0 ? '包装辅料：' : ''}}</div>
              <div class="info"
                style="display:flex;align-items:center">
                <el-select v-model="item.name"
                  clearable
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择织造明细">
                  <el-option v-for="item in packag_list"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
                <zh-input type='number'
                  style="width:300px;margin-left:24px"
                  v-model="item.price"
                  placeholder='请输入单价'>
                  <template slot="append">元</template>
                </zh-input>
              </div>
              <div class="editBtn blue"
                v-if="index === 0"
                @click="addItem(priceEditInfo.pack,'pack')">添加</div>
              <div class="editBtn red"
                @click="deleteItem(priceEditInfo.pack,index)"
                v-else>删除</div>
            </div>
            <div class="row"
              v-for="(item,index) in priceEditInfo.other"
              :key="index + 'other'">
              <div class="label">{{index === 0 ? '其他费用：' : ''}}</div>
              <div class="info"
                style="display:flex;align-items:center">
                <el-input v-model="item.name"
                  placeholder="请输入其他费用"></el-input>
                <zh-input type='number'
                  style="width:300px;margin-left:24px"
                  v-model="item.price"
                  placeholder='请输入单价'>
                  <template slot="append">元</template>
                </zh-input>
              </div>
              <div class="editBtn blue"
                v-if="index === 0"
                @click="addItem(priceEditInfo.other,'other')">添加</div>
              <div class="editBtn red"
                @click="deleteItem(priceEditInfo.other,index)"
                v-else>删除</div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="savePriceLoading">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='报价说明'">
        <div class="main"
          style="width:600px;">
          <div class="title">
            <div class="text">报价说明-{{priceRemarkEditInfo.name}}</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content"
            style="min-height:430px">
            <div class="row">
              <div class="label">备注内容：</div>
              <div class="info">
                <div ref="editorPriceRemark"></div>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="savePriceRemark">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='订单预警'">
        <div class="main"
          style="min-width:600px">
          <div class="title">
            <div class="text">添加订单预警设置</div>
            <i class="el-icon-close"
              @click="closePopup"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">类型名称：</div>
              <div class="info">
                <el-input placeholder="请输入预警名称"
                  v-model="orderWarningEditInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label"
                style='width:11em;'>订单下单-物料计划：</div>
              <div class="info"
                style="display: flex;
                  flex-direction: row;
                  justify-content: space-between;">
                <zh-input type='number'
                  style="width:200px"
                  v-model="orderWarningEditInfo.materialPlan"
                  placeholder='时间比例'>
                  <template slot="append">%</template>
                </zh-input>
                <el-select style="margin-left:8px"
                  v-model="orderWarningEditInfo.materialPlan_user"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择负责人">
                  <el-option v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label"
                style='width:11em;'>物料计划-物料入库：</div>
              <div class="info"
                style="display: flex;
                  flex-direction: row;
                  justify-content: space-between;">
                <zh-input type='number'
                  style="width:200px"
                  v-model="orderWarningEditInfo.materialStock"
                  placeholder='时间比例'>
                  <template slot="append">%</template>
                </zh-input>
                <el-select style="margin-left:8px"
                  v-model="orderWarningEditInfo.materialStock_user"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择负责人">
                  <el-option v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label"
                style='width:11em;'>生产织造-半成品加工：</div>
              <div class="info"
                style="display: flex;
                  flex-direction: row;
                  justify-content: space-between;">
                <zh-input type='number'
                  style="width:200px"
                  v-model="orderWarningEditInfo.process"
                  placeholder='时间比例'>
                  <template slot="append">%</template>
                </zh-input>
                <el-select style="margin-left:8px"
                  v-model="orderWarningEditInfo.process_user"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择负责人">
                  <el-option v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label"
                style='width:11em;'>半成品加工-成品入库：</div>
              <div class="info"
                style="display: flex;
                  flex-direction: row;
                  justify-content: space-between;">
                <zh-input type='number'
                  style="width:200px"
                  v-model="orderWarningEditInfo.productStock"
                  placeholder='时间比例'>
                  <template slot="append">%</template>
                </zh-input>
                <el-select style="margin-left:8px"
                  v-model="orderWarningEditInfo.productStock_user"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择负责人">
                  <el-option v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label"
                style='width:11em;'>成品检验-成品装箱：</div>
              <div class="info"
                style="display: flex;
                  flex-direction: row;
                  justify-content: space-between;">
                <zh-input type='number'
                  style="width:200px"
                  v-model="orderWarningEditInfo.pack"
                  placeholder='时间比例'>
                  <template slot="append">%</template>
                </zh-input>
                <el-select style="margin-left:8px"
                  v-model="orderWarningEditInfo.pack_user"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择负责人">
                  <el-option v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="closePopup">取消</div>
            <div class="btn btnBlue"
              @click="saveOrderWarn">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='样单预警'">
        <div class="main"
          style="min-width:600px">
          <div class="title">
            <div class="text">添加样单预警设置</div>
            <i class="el-icon-close"
              @click="closePopup"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">类型名称：</div>
              <div class="info">
                <el-input placeholder="请输入预警名称"
                  v-model="sampleWarningEditInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label"
                style='width:11em;'>订单下单-物料计划：</div>
              <div class="info"
                style="display: flex;
                  flex-direction: row;
                  justify-content: space-between;">
                <zh-input type='number'
                  style="width:200px"
                  v-model="sampleWarningEditInfo.materialPlan"
                  placeholder='时间比例'>
                  <template slot="append">%</template>
                </zh-input>
                <el-select style="margin-left:8px"
                  v-model="sampleWarningEditInfo.materialPlan_user"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择负责人">
                  <el-option v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label"
                style='width:11em;'>物料计划-物料入库：</div>
              <div class="info"
                style="display: flex;
                  flex-direction: row;
                  justify-content: space-between;">
                <zh-input type='number'
                  style="width:200px"
                  v-model="sampleWarningEditInfo.materialStock"
                  placeholder='时间比例'>
                  <template slot="append">%</template>
                </zh-input>
                <el-select style="margin-left:8px"
                  v-model="sampleWarningEditInfo.materialStock_user"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择负责人">
                  <el-option v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label"
                style='width:11em;'>生产织造-半成品加工：</div>
              <div class="info"
                style="display: flex;
                  flex-direction: row;
                  justify-content: space-between;">
                <zh-input type='number'
                  style="width:200px"
                  v-model="sampleWarningEditInfo.process"
                  placeholder='时间比例'>
                  <template slot="append">%</template>
                </zh-input>
                <el-select style="margin-left:8px"
                  v-model="sampleWarningEditInfo.process_user"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择负责人">
                  <el-option v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label"
                style='width:11em;'>半成品加工-成品入库：</div>
              <div class="info"
                style="display: flex;
                  flex-direction: row;
                  justify-content: space-between;">
                <zh-input type='number'
                  style="width:200px"
                  v-model="sampleWarningEditInfo.productStock"
                  placeholder='时间比例'>
                  <template slot="append">%</template>
                </zh-input>
                <el-select style="margin-left:8px"
                  v-model="sampleWarningEditInfo.productStock_user"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择负责人">
                  <el-option v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="closePopup">取消</div>
            <div class="btn btnBlue"
              @click="saveSampleWarn">确定</div>
          </div>
        </div>
      </template>
      <!-- <template v-if="cName==='HS编码设置'">
        <div class="main">
          <div class="title">
            <div class="text">添加HS编码</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">HS编码：</div>
              <div class="info">
                <el-input placeholder="请输入HS编码"
                  v-model="documentHSCodeInfo.HSCode"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">商品名称：</div>
              <div class="info">
                <el-input placeholder="请输入商品名称"
                  v-model="documentHSCodeInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">进口优惠税：</div>
              <div class="info">
                <el-input placeholder="请输入进口优惠税"
                  v-model="documentHSCodeInfo.importTax">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">出口税率：</div>
              <div class="info">
                <el-input placeholder="请输入出口税率"
                  v-model="documentHSCodeInfo.exportTax">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveDocumentHSCodeInfo">确定</div>
          </div>
        </div>
      </template> -->
      <template v-if="cName==='常用公司设置'">
        <div class="main">
          <div class="title">
            <div class="text">{{documentClientInfo.id ? '修改' : '添加'}}常用公司</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">公司名称：</div>
              <div class="info">
                <el-input placeholder="请输入公司名称"
                  v-model="documentClientInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">公司地址：</div>
              <div class="info">
                <el-input placeholder="请输入公司地址"
                  v-model="documentClientInfo.address"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveDocumentClientInfo">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='常用城市设置'">
        <div class="main">
          <div class="title">
            <div class="text">{{documentPortInfo.id ? '修改' : '添加'}}常用城市</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">常用国家：</div>
              <div class="info">
                <el-input placeholder="请输入常用国家 (Country)"
                  v-model="documentPortInfo.country"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">常用城市：</div>
              <div class="info">
                <el-input placeholder="请输入常用城市 (City Name)"
                  v-model="documentPortInfo.port"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveDocumentPortInfo">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='常用品名设置'">
        <div class="main">
          <div class="title">
            <div class="text">{{documentTypeInfo.id ? '修改' : '添加'}}常用品名</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">中文品类：</div>
              <div class="info">
                <el-input placeholder="请输入中文品类"
                  v-model="documentTypeInfo.CNName"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">英文品名：</div>
              <div class="info">
                <el-input placeholder="请输入英文品名"
                  v-model="documentTypeInfo.USName"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">单位名称：</div>
              <div class="info">
                <el-input placeholder="请输入单位名称"
                  v-model="documentTypeInfo.unit"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveDocumentTypeInfo">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='常用付款方式'">
        <div class="main">
          <div class="title">
            <div class="text">{{documentPayTypeInfo.id ? '修改' : '添加'}}付款方式</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">中文名称：</div>
              <div class="info">
                <el-input placeholder="请输入中文名称"
                  v-model="documentPayTypeInfo.CNName"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">英文代号：</div>
              <div class="info">
                <el-input placeholder="请输入英文代号"
                  v-model="documentPayTypeInfo.USName"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveDocumentPayTypeInfo">确定</div>
          </div>
        </div>
      </template>
    </div>
    <!-- 删除尺码 -->
    <div class="popup"
      v-show="sizeFLag">
      <div class="main">
        <div class="title">
          <div class="text">删除尺码</div>
          <i class="el-icon-close"
            @click="sizeFLag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">选择尺码：</div>
            <div class="info">
              <el-select v-model="deleteSizeId"
                placeholder="请选择删除尺码">
                <el-option v-for="item in sizeIdArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="sizeFLag=false">取消</div>
          <div class="btn btnBlue"
            @click="deleteSize">确定</div>
        </div>
      </div>
    </div>
    <!-- 批量添加纱线 -->
    <div class="popup"
      v-if="updataYarnsFlag">
      <div class="main"
        :style="{width:!yarnAddType ? '1100px' : '800px'}">
        <div class="title">
          <span class="text">添加纱线原料</span>
          <i class="el-icon-close"
            @click="updataYarnsFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <span class="label isMust">添加方式：</span>
            <div class="info"
              style="display:flex;align-items:center">
              <el-radio-group v-model="yarnAddType">
                <el-radio :label="true">名称添加</el-radio>
                <el-radio :label="false">格式添加</el-radio>
              </el-radio-group>
            </div>
          </div>
          <template v-if="yarnAddType">
            <div class="row"
              v-for="(itemYarn,indexYarn) in editYarnInfo"
              :key="indexYarn + 'yarn'">
              <span class="label isMust">{{indexYarn === 0 ? '名称添加：' : ''}}</span>
              <div class="info">
                <!-- <el-input placeholder="请输入纱线名称"
                  v-model="itemYarn.name"></el-input> -->
                <el-autocomplete v-model="itemYarn.name"
                  :fetch-suggestions="querySearchYarn"
                  :trigger-on-focus="false"
                  placeholder="请输入纱线名称"
                  @select="handleSelectYarn"></el-autocomplete>
              </div>
              <div class="editBtn blue"
                v-if="indexYarn === 0"
                @click="addItem(editYarnInfo,'yarn')">添加</div>
              <div class="editBtn red"
                v-else
                @click="deleteItem(editYarnInfo,indexYarn)">删除</div>
            </div>
          </template>
          <template v-else>
            <div class="row">
              <span class="label isMust">格式添加：</span>
              <div class="info">
                <el-input placeholder="取值阈值"
                  v-model="layoutData.thresholdValues"
                  class="elInput w100 hasMarginRight"
                  @change="buildYarnList"></el-input>
                <el-input placeholder="取值"
                  v-model="layoutData.firstValue"
                  class="elInput w80"
                  @change="buildYarnList"></el-input>
                -
                <el-input placeholder="取值"
                  v-model="layoutData.lastValue"
                  class="elInput w80 hasMarginRight"
                  @change="buildYarnList"></el-input>
                <el-select v-model="layoutData.unit"
                  class="elInput w100 hasMarginRight"
                  placeholder="支/cm/S/公分"
                  @change="buildYarnList">
                  <el-option v-for="item in layoutData.unitArr"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-input placeholder="纱线名称"
                  v-model="layoutData.yarnName"
                  class="elInput w150 hasMarginRight"
                  @change="buildYarnList"></el-input>
                <el-input placeholder="#"
                  v-model="layoutData.colorCodeUnit"
                  class="elInput w50 hasMarginRight"
                  @change="buildYarnList"></el-input>
                <el-input placeholder="色号"
                  v-model="layoutData.firstColorCode"
                  class="elInput w80"
                  @change="buildYarnList"></el-input>
                -
                <el-input placeholder="色号"
                  v-model="layoutData.lastColorCode"
                  class="elInput w80 hasMarginRight"
                  @change="buildYarnList"></el-input>
              </div>
            </div>
            <div class="row">
              <span class="label isMust">名称预览：</span>
              <div class="info tagCtn">
                <span class="yarnNameTag"
                  v-for="(itemYarn,indexYarn) in layoutData.yarnNameList"
                  :key="indexYarn">
                  <span class="name">{{itemYarn}}</span>
                  <span class="el-icon-close icon"
                    @click="deleteItem(layoutData.yarnNameList,indexYarn)"></span>
                </span>
              </div>
            </div>
          </template>
          <div class="row"
            v-for="(item,index) in layoutData.yarnPriceArr"
            :key="index + 'price'">
            <div class="label">报价信息：</div>
            <div class="info flex">
              <el-select v-model="item.company"
                style="margin-right:16px"
                filterable
                placeholder="请选择公司">
                <el-option v-for="item in clientList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
              <zh-input v-model="item.price"
                style="margin-right:16px"
                type='number'
                placeholder="请输入报价">
                <template slot="append">元/kg</template>
              </zh-input>
              <zh-input v-model="item.desc"
                placeholder="备注">
              </zh-input>
            </div>
            <div class="editBtn blue"
              @click="addClient(layoutData.yarnPriceArr)"
              v-if="index===0">添加</div>
            <div class="editBtn red"
              @click="deleteClient(layoutData.yarnPriceArr,index)"
              v-if="index>0">删除</div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="updataYarnsFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="saveYarns">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { permissions } from '@/assets/js/dictionary.js'
import E from 'wangeditor'
import { orderType, warnSetting, priceLoading, productType, flower, ingredient, colour, productSize, craftSetting, yarn, yarnColor, process, group, station, company, auth, client, getToken, material, packag, print, course, staffTag } from '@/assets/js/api.js'
export default {
  data () {
    return {
      showPopup: false,
      yarn_handle_type: '',
      nav: {
        '产品设置': ['产品花型', '产品成分', '产品配色', '产品尺码', '样单类型', '订单类型'],
        '工艺单设置': ['边型', '机型', '组织法', '纱线颜色'],
        '物料设置': ['纱线原料', '装饰辅料', '包装辅料'],
        '工序设置': ['原料工序', '半成品加工', '结算工序'],
        '工厂信息设置': ['工厂信息设置', '工厂小组管理', '工厂部门管理', '员工标签管理'],
        '系统账户管理': ['系统账户管理'],
        '打印设置': ['打印设置'],
        '报价单设置': ['报价预加载', '报价说明'],
        '预警设置': ['订单预警', '样单预警'],
        '单证设置': ['英文工厂信息', '英文银行信息', 'HS编码设置', '常用公司设置', '常用城市设置', '常用品名设置', '常用付款方式']
      },
      pName: '',
      cName: '',
      productTypeArr: [],
      tree_key: 0,
      productTypeId: 0,
      defaultExpand: [],
      flowerList: [],
      flowerTotal: 1,
      flowerPage: 1,
      flower: '',
      ingredientList: [],
      ingredientTotal: 1,
      ingredientPage: 1,
      ingredient: '',
      colourList: [],
      colourTotal: 1,
      colourPage: 1,
      colour: '',
      sizeList: [],
      sizeTotal: 1,
      sizePage: 1,
      size: '',
      sizeId: '',
      sizeIdArr: [],
      deleteSizeId: '',
      sizeFLag: false, // 删除尺码
      measurementList: [],
      measurementTotal: 1,
      measurementPage: 1,
      measurement: '',
      measurementId: '',
      measurementIdArr: [],
      measurementFlag: false,
      deleteMeasurementId: '',
      sideList: [],
      side: '',
      sideTotal: 1,
      sidePage: 1,
      machineList: [],
      machine: '',
      machineTotal: 1,
      machinePage: 1,
      methodsList: [],
      methods: '',
      methodsTotal: 1,
      methodsPage: 1,
      // 纱线名称
      yarnNameList: [],
      changeYarnInfo: {
        id: '',
        yarnName: '',
        yarnPriceArr: [{
          price: '',
          company: ''
        }]
      },
      yarnNameTotal: 1,
      yarnNamePage: 1,
      clientList: [],
      filterYarnKeyword: '',
      // 纱线颜色
      yarnColorList: [],
      yarnColor: '',
      yarnColorCode: '',
      yarnColorTotal: 1,
      yarnColorPage: 1,
      // 装饰辅料
      materialNameList: [],
      materialNameTotal: 1,
      materialNamePage: 1,
      changeMaterialInfo: {
        id: '',
        materialName: '',
        materialUnit: '',
        need_weave: false,
        materialPriceArr: [{
          company: '',
          price: ''
        }]
      },
      // 包装辅料
      packMaterialNameList: [],
      packMaterialNameTotal: 1,
      packMaterialNamePage: 1,
      changePackMaterialInfo: {
        id: '',
        packMaterialName: '',
        packMaterialUnit: '',
        type: 'area',
        packMaterialPriceArr: [{
          company: '',
          price: ''
        }]
      },
      showDetailPopup: false,
      detailType: 'yarn',
      detailInfo: {
        name: '',
        unit: '',
        price: [],
        log: []
      },
      // 工序设置
      materialProcessList: [],
      materialProcess: '',
      materialProcessTotal: 1,
      materialProcessPage: 1,
      halfProcessList: [],
      halfProcess: '',
      halfProcessTotal: 1,
      halfProcessPage: 1,
      staffProcessList: [],
      staffProcess: '',
      staffProcessTotal: 1,
      staffProcessPage: 1,
      groupList: [],
      group: '',
      groupTotal: 1,
      groupPage: 1,
      stationList: [],
      station: '',
      stationTotal: 1,
      stationPage: 1,
      companyInfo: {
        alias: '',
        logoUrl: '',
        client_name: '',
        client_about: '',
        client_tel: '',
        client_email: '',
        client_address: '',
        file_logo: [],
        file_image: []
      },
      postData: { token: '' },
      // 员工账号
      authList: [],
      authInfo: {
        id: null,
        user_name: '',
        is_admin: 0,
        status: 1,
        telephone: '',
        group_id: '',
        station_name: '',
        name: '',
        mobile: '',
        has_check: 0,
        module_id: [], // 权限字段
        module_id_detail: []
      },
      permissions: permissions,
      authPage: 1,
      authTotal: 1,
      // 员工标签
      authTagList: [],
      authTagInfo: {
        name: '',
        id: ''
      },
      authTagPage: 1,
      authTagTotal: 1,
      // 打印设置
      printEditArr: [
        {
          type: 11,
          name: '原料计划',
          title: window.sessionStorage.getItem('full_name') + '原料计划单',
          isHideClient: false,
          remark: ''
        }, {
          type: 12,
          name: '辅料计划',
          title: window.sessionStorage.getItem('full_name') + '辅料计划单',
          isHideClient: false,
          remark: ''
        }, {
          type: 1,
          name: '织造分配',
          title: window.sessionStorage.getItem('full_name') + '织造分配',
          isHideClient: false,
          remark: ''
        }, {
          type: 2,
          name: '加工分配',
          title: window.sessionStorage.getItem('full_name') + '加工分配',
          isHideClient: false,
          remark: ''
        }, {
          type: 3,
          name: '原料调拨',
          title: window.sessionStorage.getItem('full_name') + '原料调拨',
          isHideClient: false,
          remark: ''
        }, {
          type: 4,
          name: '辅料调拨',
          title: window.sessionStorage.getItem('full_name') + '辅料调拨',
          isHideClient: false,
          remark: ''
        }, {
          type: 5,
          name: '原料订购',
          title: window.sessionStorage.getItem('full_name') + '原料订购',
          isHideClient: false,
          remark: ''
        }, {
          type: 6,
          name: '辅料订购',
          title: window.sessionStorage.getItem('full_name') + '辅料订购',
          isHideClient: false,
          remark: ''
        }, {
          type: 7,
          name: '原料加工',
          title: window.sessionStorage.getItem('full_name') + '原料加工',
          isHideClient: false,
          remark: ''
        }, {
          type: 8,
          name: '辅料加工',
          title: window.sessionStorage.getItem('full_name') + '辅料加工',
          isHideClient: false,
          remark: ''
        }, {
          type: 9,
          name: '包装辅料订购',
          title: window.sessionStorage.getItem('full_name') + '包装辅料订购',
          isHideClient: false,
          remark: ''
        }, {
          type: 10,
          name: '运输分配',
          title: window.sessionStorage.getItem('full_name') + '运输分配',
          isHideClient: false,
          remark: ''
        }
      ],
      printEditPages: 1,
      printEditTotal: 12,
      printEditInfo: {},
      printEditor: '',
      // 报价单设置
      priceInfo: [],
      priceTotal: 1,
      pricePages: 1,
      priceEditInfo: {
        title: '',
        weave: [
          {
            name: '',
            price: ''
          }
        ],
        semi: [
          {
            name: '',
            price: ''
          }
        ],
        finished: [
          {
            name: '',
            price: ''
          }
        ],
        pack: [
          {
            name: '',
            price: ''
          }
        ],
        other: [
          {
            name: '',
            price: ''
          }
        ]
      },
      weave_list: [
        { value: '针织织造' },
        { value: '梭织织造' },
        { value: '制版费' }
      ],
      semi_list: [],
      finished_list: [
        { value: '车标' },
        { value: '包装' },
        { value: '人工' },
        { value: '检验' },
        { value: '水洗' }
      ],
      packag_list: [
        { value: '纸箱' },
        { value: '包装袋' },
        { value: '礼盒' },
        { value: '干燥剂' },
        { value: '衣架' },
        { value: '警报器' },
        { value: '洗标' }
      ],
      // 批量添加纱线
      updataYarnsFlag: false,
      yarnAddType: true,
      layoutData: {
        thresholdValues: '',
        firstValue: '',
        lastValue: '',
        unit: '',
        unitArr: [{ name: '支' }, { name: 'cm' }, { name: 'S' }, { name: '公分' }],
        yarnName: '',
        colorCodeUnit: '',
        firstColorCode: '',
        lastColorCode: '',
        yarnNameList: [],
        yarnPriceArr: [
          { company: '', price: '', desc: '' }
        ]
      },
      editYarnInfo: [{ name: '' }],
      // 预警设置
      orderWarnList: [],
      userList: [],
      orderWarnPages: 1,
      orderWarningEditInfo: {
        id: '',
        name: '',
        materialPlan: '',
        materialPlan_user: '',
        materialStock: '',
        materialStock_user: '',
        process: '',
        process_user: '',
        productStock: '',
        productStock_user: '',
        pack: '',
        pack_user: ''
      },
      sampleWarnList: [],
      sampleWarnPages: 1,
      sampleWarningEditInfo: {
        id: '',
        name: '',
        materialPlan: '',
        materialPlan_user: '',
        materialStock: '',
        materialStock_user: '',
        process: '',
        process_user: '',
        productStock: '',
        productStock_user: ''
      },
      sampleOrderType: '',
      sampleOrderTypeList: [],
      sampleOrderTypePage: 1,
      sampleOrderTypeTotal: 1,
      orderType: '',
      orderTypeList: [],
      orderTypePage: 1,
      orderTypeTotal: 1,
      updatedBatchFlag: false,
      // 报价说明
      priceRemark: [
        {
          name: '产品原料',
          id: 1,
          remark: ''
        },
        {
          name: '产品辅料',
          id: 2,
          remark: ''
        },
        {
          name: '织造明细',
          id: 3,
          remark: ''
        },
        {
          name: '半成品加工',
          id: 4,
          remark: ''
        },
        {
          name: '成品加工',
          id: 5,
          remark: ''
        },
        {
          name: '包装辅料',
          id: 6,
          remark: ''
        },
        {
          name: '其它费用',
          id: 7,
          remark: ''
        },
        {
          name: '非生产费用',
          id: 8,
          remark: ''
        },
        {
          name: '运输费用',
          id: 9,
          remark: ''
        }
      ],
      priceRemarkPages: 1,
      priceRemarkTotal: 9,
      priceRemarkEditInfo: {
        name: '',
        id: '',
        remark: ''
      },
      priceRemarkEditor: null,
      // 单证设置
      documentLoading: false,
      documentCompanyInfo: {
        is_updated: false,
        loading: true,
        name: '',
        code: '',
        address: '',
        signature: '',
        special_seal: '',
        tel: '',
        fax: ''
      },
      documentBankInfo: {
        is_updated: false,
        loading: true,
        name: '',
        address: '',
        code: '',
        beneficiary: '',
        account_no: ''
      },
      HSCode: '',
      documentHSCodeList: [],
      documentHSCodeInfo: {
        loading: true,
        id: null,
        HSCode: '',
        name: '',
        importTax: '',
        exportTax: ''
      },
      documentHSCodePages: 1,
      documentHSCodeTotal: 1,
      clientName: '',
      documentClientList: [],
      documentClientInfo: {
        loading: true,
        id: null,
        name: '',
        address: ''
      },
      documentClientPages: 1,
      documentClientTotal: 1,
      portName: '',
      documentPortList: [],
      documentPortInfo: {
        loading: true,
        id: null,
        country: '',
        port: ''
      },
      documentPortPages: 1,
      documentPortTotal: 1,
      documentType: '',
      documentTypeList: [],
      documentTypeInfo: {
        loading: true,
        id: null,
        CNName: '',
        USName: ''
      },
      documentTypePages: 1,
      documentTypeTotal: 1,
      documentPayType: '',
      documentPayTypeList: [],
      documentPayTypeInfo: {
        loading: true,
        id: null,
        CNName: '',
        USName: ''
      },
      documentPayTypePages: 1,
      documentPayTypeTotal: 1
    }
  },
  watch: {
    cName (val) {
      if (val === '产品分类') {
        this.getProductType()
      } else if (val === '产品花型') {
        this.getFlower()
      } else if (val === '样单类型') {
        this.getSampleOrderType()
      } else if (val === '订单类型') {
        this.getOrderType()
      } else if (val === '产品成分') {
        this.getIngredient()
      } else if (val === '产品配色') {
        this.getColour()
      } else if (val === '产品尺码') {
        this.getSize()
        // } else if (val === '产品规格') {
        //   this.getMeasurement()
      } else if (val === '边型') {
        this.getSide()
      } else if (val === '机型') {
        this.getMachine()
      } else if (val === '组织法') {
        this.getMethods()
      } else if (val === '纱线原料') {
        this.getYarnName()
      } else if (val === '纱线颜色') {
        this.getYarnColor()
      } else if (val === '装饰辅料') {
        this.getMaterialName()
      } else if (val === '包装辅料') {
        this.getPackName()
      } else if (val === '原料工序') {
        this.getMaterialProcess()
      } else if (val === '半成品加工') {
        this.getHalfProcess()
      } else if (val === '结算工序') {
        this.getStaffProcess()
      } else if (val === '工厂小组管理') {
        this.getGroup()
      } else if (val === '工厂部门管理') {
        this.getStation()
      } else if (val === '工厂信息设置') {
        this.getCompany()
      } else if (val === '系统账户管理') {
        this.getAuth()
      } else if (val === '员工标签管理') {
        this.getAuthTagList()
      } else if (val === '打印设置') {
        this.getPrintList()
      } else if (val === '报价预加载') {
        this.getPriceLoading()
      } else if (val === '报价说明') {
        this.getPriceRemarkList()
      } else if (val === '订单预警') {
        this.getOrderSampleWarn()
      } else if (val === '样单预警') {
        this.getOrderSampleWarn()
      } else if (val === '英文工厂信息') {
        this.getDocumentCompanyInfo()
      } else if (val === '英文银行信息') {
        this.getDocumentBankInfo()
      } else if (val === 'HS编码设置') {
        this.getDocumentHSCodeInfo()
      } else if (val === '常用公司设置') {
        this.getDocumentClientInfo()
      } else if (val === '常用城市设置') {
        this.getDocumentPortInfo()
      } else if (val === '常用品名设置') {
        this.getDocumentTypeInfo()
      } else if (val === '常用付款方式') {
        this.getDocumentPayTypeInfo()
      }
    },
    filterYarnKeyword (val) {
      if (val) {
        this.yarnNameTotal = this.yarnNameList.filter(item => item.name.indexOf(this.filterYarnKeyword) !== -1).length || 1
      } else {
        this.yarnNameTotal = this.yarnNameList.length
      }
    }
  },
  computed: {
    flowerArr () {
      return this.flowerList.slice((this.flowerPage - 1) * 5, this.flowerPage * 5)
    },
    sampleOrderTypeArr () {
      return this.sampleOrderTypeList.slice((this.sampleOrderTypePage - 1) * 5, this.sampleOrderTypePage * 5)
    },
    orderTypeArr () {
      return this.orderTypeList.slice((this.orderTypePage - 1) * 5, this.orderTypePage * 5)
    },
    ingredientArr () {
      return this.ingredientList.slice((this.ingredientPage - 1) * 5, this.ingredientPage * 5)
    },
    colourArr () {
      return this.colourList.slice((this.colourPage - 1) * 5, this.colourPage * 5)
    },
    sizeArr () {
      return this.sizeList.slice((this.sizePage - 1) * 5, this.sizePage * 5)
    },
    measurementArr () {
      return this.measurementList.slice((this.measurementPage - 1) * 5, this.measurementPage * 5)
    },
    sideArr () {
      return this.sideList.slice((this.sidePage - 1) * 5, this.sidePage * 5)
    },
    machineArr () {
      return this.machineList.slice((this.machinePage - 1) * 5, this.machinePage * 5)
    },
    methodsArr () {
      return this.methodsList.slice((this.methodsPage - 1) * 5, this.methodsPage * 5)
    },
    yarnNameArr () {
      let returnArr = this.filterYarnKeyword ? this.yarnNameList.filter(item => item.name.indexOf(this.filterYarnKeyword) !== -1) : this.yarnNameList
      return returnArr.slice((this.yarnNamePage - 1) * 5, this.yarnNamePage * 5)
    },
    yarnColorArr () {
      return this.yarnColorList.slice((this.yarnColorPage - 1) * 5, this.yarnColorPage * 5)
    },
    materialNameArr () {
      return this.materialNameList.slice((this.materialNamePage - 1) * 5, this.materialNamePage * 5)
    },
    packMaterialNameArr () {
      return this.packMaterialNameList.slice((this.packMaterialNamePage - 1) * 5, this.packMaterialNamePage * 5)
    },
    materialProcessArr () {
      return this.materialProcessList.slice((this.materialProcessPage - 1) * 5, this.materialProcessPage * 5)
    },
    staffProcessArr () {
      return this.staffProcessList.slice((this.staffProcessPage - 1) * 5, this.staffProcessPage * 5)
    },
    halfProcessArr () {
      return this.halfProcessList.slice((this.halfProcessPage - 1) * 5, this.halfProcessPage * 5)
    },
    groupArr () {
      return this.groupList.slice((this.groupPage - 1) * 5, this.groupPage * 5)
    },
    stationArr () {
      return this.stationList.slice((this.stationPage - 1) * 5, this.stationPage * 5)
    },
    permissionsDetailArr () {
      let arr = this.permissions.filter(itemF => this.authInfo.module_id.includes(itemF.id))
      return this.$flatten(arr.map(itemM => itemM.detail || []))
    }
  },
  methods: {
    // 单证模块
    uploadSignatureSuccess () {
      const fileArr = this.$refs.companySignatureUpload.uploadFiles.map((item) => { return (item.response ? 'https://file.zwyknit.com/' + item.response.key : item.url) })
      this.documentCompanyInfo.signature = fileArr[1] || fileArr[0]
    },
    uploadCustomsSuccess () {
      const fileArr = this.$refs.companyCustomsUpload.uploadFiles.map((item) => { return (item.response ? 'https://file.zwyknit.com/' + item.response.key : item.url) })
      this.documentCompanyInfo.special_seal = fileArr[1] || fileArr[0]
    },
    getDocumentCompanyInfo () { // 获取英文工厂信息
      this.documentCompanyInfo.loading = true
      if (!this.postData.token) {
        getToken().then(res => {
          if (res.data.status !== false) {
            this.postData.token = res.data.data
          }
        })
      }
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.companyDetail().then(res => {
        if (res.data.status !== false) {
          this.documentCompanyInfo = {
            is_updated: false,
            ...res.data.data
          }
        }
        this.documentCompanyInfo.loading = false
      })
    },
    saveDocumentCompanyInfo () {
      if (!this.documentCompanyInfo.is_updated) return
      if (this.$submitLock()) return
      const { documentSetting } = require('@/assets/js/api.js')
      if (!this.documentCompanyInfo.name) {
        this.$message.warning('请输入公司英文名称(Company Name)')
        return
      }
      if (!this.documentCompanyInfo.code) {
        this.$message.warning('请输入公司统一社会信用代码(Company Social Credit Code)')
        return
      }
      if (!this.documentCompanyInfo.address) {
        this.$message.warning('请输入公司英文地址(Company Address)')
        return
      }
      if (!this.documentCompanyInfo.tel) {
        this.$message.warning('请输入电话号(Tel)')
        return
      }
      if (!this.documentCompanyInfo.fax) {
        this.$message.warning('请输入传真号(Fax)')
        return
      }
      if (!this.documentCompanyInfo.signature) {
        this.$message.warning('检测到未上传公司签章，请先上传')
        return
      }
      const data = {
        name: this.documentCompanyInfo.name,
        code: this.documentCompanyInfo.code,
        address: this.documentCompanyInfo.address,
        signature: this.documentCompanyInfo.signature,
        tel: this.documentCompanyInfo.tel,
        fax: this.documentCompanyInfo.fax,
        special_seal: this.documentCompanyInfo.special_seal
      }
      documentSetting.companySave(data).then(res => {
        if (res.data.status !== false) {
          this.$message.success('提交成功')
          this.getDocumentCompanyInfo()
        }
      })
    },
    getDocumentBankInfo () { // 获取英文银行信息
      this.documentBankInfo.loading = true
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.bankDetail().then(res => {
        if (res.data.status !== false) {
          this.documentBankInfo = {
            is_updated: false,
            ...res.data.data
          }
        }
        this.documentBankInfo.loading = false
      })
    },
    saveDocumentBankInfo () {
      if (this.$submitLock()) return
      if (!this.documentBankInfo.name) {
        this.$message.warning('请输入开户银行(Bank Name)')
        return
      }
      if (!this.documentBankInfo.address) {
        this.$message.warning('请输入开户地址(Bank Address)')
        return
      }
      if (!this.documentBankInfo.code) {
        this.$message.warning('请输入银行SWIFT码(SWIFT Code)')
        return
      }
      if (!this.documentBankInfo.beneficiary) {
        this.$message.warning('请输入收款人(Beneficiary)')
        return
      }
      if (!this.documentBankInfo.account_no) {
        this.$message.warning('请输入开户账号(Account No)')
        return
      }

      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.bankSave({
        name: this.documentBankInfo.name,
        address: this.documentBankInfo.address,
        code: this.documentBankInfo.code,
        beneficiary: this.documentBankInfo.beneficiary,
        account_no: this.documentBankInfo.account_no
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('提交成功')
          this.getDocumentBankInfo()
        }
      })
    },
    getDocumentHSCodeInfo (pages = 1, limit = 5) {
      this.documentHSCodeInfo.loading = true
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.HSList({
        page: pages,
        limit: limit,
        hs_code: this.HSCode || ''
      }).then(res => {
        if (res.data.status !== false) {
          this.documentHSCodeList = res.data.data
          this.documentHSCodeTotal = res.data.total
          if (this.documentHSCodePages !== pages) { // 更新页码
            this.documentHSCodePages = pages
          }
        }
        this.documentHSCodeInfo.loading = false
      })
    },
    deleteDocumentHSCode (id) {
      // if (!id) {
      //   this.$message.error(`删除失败，ID：${id}未知`)
      //   return
      // }
      // this.$confirm('此操作将永久删除该HS编码, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    },
    saveDocumentHSCodeInfo () {
      // this.$message.success('添加成功')
      // this.getDocumentHSCodeInfo(1)
      // this.showPopup = false
    },
    getDocumentClientInfo (pages = 1, limit = 5) {
      this.documentClientInfo.loading = true
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.clientList({
        page: pages,
        limit: limit,
        name: this.clientName || ''
      }).then(res => {
        if (res.data.status !== false) {
          this.documentClientList = res.data.data
          this.documentClientTotal = res.data.total
          if (this.documentClientPages !== pages) { // 更新页码
            this.documentClientPages = pages
          }
        }
        this.documentClientInfo.loading = false
      })
    },
    deleteDocumentClient (id) {
      if (!id) {
        this.$message.error(`删除失败，ID：${id}未知`)
        return
      }
      this.$confirm('此操作将永久删除该公司, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { documentSetting } = require('@/assets/js/api.js')
        documentSetting.clientDelete({
          id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDocumentClientInfo()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveDocumentClientInfo () {
      if (!this.documentClientInfo.name) {
        this.$message.warning('请输入公司名称')
        return
      }
      if (!this.documentClientInfo.address) {
        this.$message.warning('请输入公司地址')
        return
      }
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.clientSave({
        id: this.documentClientInfo.id || null,
        name: this.documentClientInfo.name,
        address: this.documentClientInfo.address
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.showPopup = false
          this.getDocumentClientInfo(1)
        }
      })
    },
    getDocumentPortInfo (pages = 1, limit = 5) {
      this.documentPortInfo.loading = true
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.portList({
        page: pages,
        limit: limit,
        country: this.portName || ''
      }).then(res => {
        if (res.data.status !== false) {
          this.documentPortList = res.data.data
          this.documentPortTotal = res.data.total
          if (this.documentPortPages !== pages) { // 更新页码
            this.documentPortPages = pages
          }
        }
        this.documentPortInfo.loading = false
      })
    },
    deleteDocumentPort (id) {
      if (!id) {
        this.$message.error(`删除失败，ID：${id}未知`)
        return
      }
      this.$confirm('此操作将永久删除该城市, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { documentSetting } = require('@/assets/js/api.js')
        documentSetting.portDelete({
          id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDocumentPortInfo()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveDocumentPortInfo () {
      if (!this.documentPortInfo.country) {
        this.$message.warning('请输入常用国家名称')
        return
      }
      if (!this.documentPortInfo.port) {
        this.$message.warning('请输入常用城市名称')
        return
      }
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.portSave({
        id: this.documentPortInfo.id || null,
        country: this.documentPortInfo.country,
        port_name: this.documentPortInfo.port
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.showPopup = false
          this.getDocumentPortInfo(1)
        }
      })
    },
    getDocumentTypeInfo (pages = 1, limit = 5) {
      this.documentTypeInfo.loading = true
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.typeList({
        page: pages,
        limit: limit,
        name: this.documentType || ''
      }).then(res => {
        if (res.data.status !== false) {
          this.documentTypeList = res.data.data
          this.documentTypeTotal = res.data.total
          if (this.documentTypePages !== pages) { // 更新页码
            this.documentTypePages = pages
          }
        }
        this.documentTypeInfo.loading = false
      })
    },
    deleteDocumentType (id) {
      if (!id) {
        this.$message.error(`删除失败，ID：${id}未知`)
        return
      }
      this.$confirm('此操作将永久删除该品名, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { documentSetting } = require('@/assets/js/api.js')
        documentSetting.typeDelete({
          id
        }).then(res => {
          if (res.data.statu !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDocumentTypeInfo()
            this.showPopup = false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveDocumentTypeInfo () {
      if (this.$submitLock()) return
      if (!this.documentTypeInfo.CNName) {
        this.$messag.warning('请输入中文品类')
        return
      }
      if (!this.documentTypeInfo.USName) {
        this.$messag.warning('请输入英文品名')
        return
      }
      if (!this.documentTypeInfo.unit) {
        this.$messag.warning('请输入单位名称')
        return
      }
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.typeSave({
        id: this.documentTypeInfo.id || null,
        name: this.documentTypeInfo.CNName,
        english: this.documentTypeInfo.USName,
        unit: this.documentTypeInfo.unit
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.getDocumentTypeInfo(1)
          this.showPopup = false
        }
      })
    },
    getDocumentPayTypeInfo (pages = 1, limit = 5) {
      this.documentPayTypeInfo.loading = true
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.payTypeList({
        page: pages,
        limit,
        name: this.documentPayType || ''
      }).then(res => {
        if (res.data.statu !== false) {
          this.documentPayTypeList = res.data.data
          this.documentPayTypeTotal = res.data.total
          if (this.documentPayTypePages !== pages) { // 更新页码
            this.documentPayTypePages = pages
          }
        }
        this.documentPayTypeInfo.loading = false
      })
    },
    deleteDocumentPayType (id) {
      if (!id) {
        this.$message.error(`删除失败，ID：${id}未知`)
        return
      }
      this.$confirm('此操作将永久删除该付款方式, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { documentSetting } = require('@/assets/js/api.js')
        documentSetting.payTypeDelete({
          id
        }).then(res => {
          if (res.data.statu !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDocumentPayTypeInfo()
            this.showPopup = false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveDocumentPayTypeInfo () {
      if (this.$submitLock()) return
      if (!this.documentPayTypeInfo.CNName) {
        this.$messag.warning('请输入中文名称')
        return
      }
      if (!this.documentPayTypeInfo.USName) {
        this.$messag.warning('请输入英文代号')
        return
      }
      const { documentSetting } = require('@/assets/js/api.js')
      documentSetting.payTypeSave({
        id: this.documentPayTypeInfo.id || null,
        name: this.documentPayTypeInfo.CNName,
        english: this.documentPayTypeInfo.USName
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.getDocumentPayTypeInfo(1)
          this.showPopup = false
        }
      })
    },
    addDocument (item) {
      switch (this.cName) {
        case 'HS编码设置':
          this.documentHSCodeInfo = {
            id: (item && item.id) || null,
            HSCode: (item && item.HSCode) || '',
            name: (item && item.name) || '',
            importTax: (item && item.importTax) || '',
            exportTax: (item && item.exportTax) || ''
          }
          break
        case '常用公司设置':
          this.documentClientInfo = {
            id: (item && item.id) || null,
            name: (item && item.name) || '',
            address: (item && item.address) || ''
          }
          break
        case '常用城市设置':
          this.documentPortInfo = {
            id: (item && item.id) || null,
            country: (item && item.country) || '',
            port: (item && item.port_name) || ''
          }
          break
        case '常用品名设置':
          this.documentTypeInfo = {
            id: (item && item.id) || null,
            CNName: (item && item.CNName) || '',
            USName: (item && item.USName) || '',
            unit: (item && item.unit) || ''
          }
          break
        case '常用付款方式':
          this.documentPayTypeInfo = {
            id: (item && item.id) || null,
            CNName: (item && item.CNName) || '',
            USName: (item && item.USName) || ''
          }
          break
        default:
          break
      }
      this.showPopup = true
    },
    // 单证模块结束
    downLoadTemplete (type) {
      const { downloadExcel } = require('@/assets/js/common.js')
      switch (type) {
        case 'flower':
          downloadExcel([], [
            { title: '花型名称', key: 'name' }
          ], null, '产品花型模板')
          break
        case 'ingredient':
          downloadExcel([], [
            { title: '成分名称', key: 'name' }
          ], null, '产品成分模板')
          break
        case 'colour':
          downloadExcel([], [
            { title: '配色名称', key: 'name' }
          ], null, '产品配色模板')
          break
        case 'side':
          downloadExcel([], [
            { title: '边型名称', key: 'name' }
          ], null, '边型模板')
          break
        case 'machine':
          downloadExcel([], [
            { title: '机型名称', key: 'name' }
          ], null, '机型模板')
          break
        case 'methods':
          downloadExcel([], [
            { title: '组织法名称', key: 'name' }
          ], null, '组织法模板')
          break
        case 'yarn':
          downloadExcel([], [
            { title: '纱线原料名称', key: 'name' }
          ], null, '纱线原料模板')
          break
        case 'yarnColor':
          downloadExcel([], [
            { title: '纱线颜色名称', key: 'name' },
            { title: '色块', key: 'color_code' }
          ], null, '纱线颜色模板')
          break
        case 'material':
          downloadExcel([], [
            { title: '装饰辅料名称', key: 'name' },
            { title: '计量单位', key: 'unit' },
            { title: `是否需要织造(注:'是'填'1','否'填'0',默认为'0')`, key: 'need_weave' }
          ], null, '装饰辅料模板')
          break
        case 'pack':
          downloadExcel([], [
            { title: '包装辅料名称', key: 'name' },
            { title: '计量单位', key: 'unit' },
            { title: `计价方式(注:'面积'填'1','其它'填'2',默认为'2')`, key: 'type' }
          ], null, '包装辅料模板')
          break
        case 'yarnProcess':
          downloadExcel([], [
            { title: '原料工序名称', key: 'name' }
          ], null, '原料工序模板')
          break
        case 'semiProcess':
          downloadExcel([], [
            { title: '半成品加工工序名称', key: 'name' }
          ], null, '半成品加工工序模板')
          break
        case 'staffProcess':
          downloadExcel([], [
            { title: '结算工序名称', key: 'name' }
          ], null, '结算工序模板')
          break
        default:
          this.$message.error('未知模板类型，下载失败！！！')
          break
      }
    },
    importExcelData (type) {
      const inputFile = document.createElement('input')
      inputFile.type = 'file'
      inputFile.accept = '.xlsx,.xls'
      inputFile.addEventListener('change', (e) => {
        this.getExcelData(e, this.saveImportData, type)
      })
      let click = document.createEvent('MouseEvents')
      click.initEvent('click', true, true)
      inputFile.dispatchEvent(click)
    },
    getExcelData (file, callBack, type) {
      const XLSX = require('xlsx')
      const files = file.target.files
      const fileReader = new FileReader()
      fileReader.onload = function (e) {
        try {
          const data = e.target.result
          const bytes = new Uint8Array(data) // 无符号整型数组
          const len = bytes.byteLength
          const binarys = new Array(len) // 创建定长数组，存储文本
          for (let i = 0; i < len; i++) { binarys[i] = String.fromCharCode(bytes[i]) }
          const workbook = XLSX.read(binarys.join(''), { type: 'binary' })
          if (!workbook) { return null }
          const r = {}
          workbook.SheetNames.forEach(name => { // 遍历每张纸数据
            r[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name])
          })
          callBack && callBack(r, type)
        } catch (e) {
          console.log('文件类型不正确')
        }
      }
      fileReader.readAsArrayBuffer(files[0])
    },
    saveImportData (data, type) {
      console.log(data, type)
      let typeObj = null
      let api = null
      switch (type) {
        case 'flower':
          typeObj = {
            id: [false, null],
            name: ['花型名称']
          }
          api = flower.create
          break
        case 'ingredient':
          typeObj = {
            id: [false, null],
            name: ['成分名称']
          }
          api = ingredient.create
          break
        case 'colour':
          typeObj = {
            id: [false, null],
            name: ['配色名称'],
            color_code: [false, null]
          }
          api = colour.create
          break
        case 'side':
          typeObj = {
            id: [false, null],
            name: ['边型名称']
          }
          api = craftSetting.createSide
          break
        case 'machine':
          typeObj = {
            id: [false, null],
            name: ['机型名称']
          }
          api = craftSetting.createMachine
          break
        case 'methods':
          typeObj = {
            id: [false, null],
            name: ['组织法名称']
          }
          api = craftSetting.createMethods
          break
        case 'yarn':
          typeObj = {
            id: [false, null],
            name: ['纱线原料名称'],
            price_data: [false, []]
          }
          api = yarn.create
          break
        case 'yarnColor':
          typeObj = {
            id: [false, null],
            name: ['纱线颜色名称'],
            color_code: ['色块', null]
          }
          api = yarnColor.create
          break
        case 'material':
          typeObj = {
            id: [false, null],
            name: ['装饰辅料名称'],
            unit: ['计量单位'],
            need_weave: [`是否需要织造(注:'是'填'1','否'填'0',默认为'0')`, 0],
            price_data: [false, []]
          }
          api = material.create
          break
        case 'pack':
          typeObj = {
            id: [false, null],
            name: ['包装辅料名称'],
            unit: ['计量单位'],
            type: [`计价方式(注:'面积'填'1','其它'填'2',默认为'2')`, 2],
            price_data: [false, []]
          }
          api = packag.create
          break
        case 'yarnProcess':
          typeObj = {
            id: [false, null],
            name: ['原料工序名称'],
            type: [false, 1]
          }
          api = process.create
          break
        case 'semiProcess':
          typeObj = {
            id: [false, null],
            name: ['半成品加工工序名称'],
            type: [false, 2]
          }
          api = process.create
          break
        case 'staffProcess':
          typeObj = {
            id: [false, null],
            name: ['结算工序名称'],
            type: [false, 3]
          }
          api = process.create
          break
        default:
          this.$message.error('未知模板类型，导入失败！！！')
          return
      }
      let submitData = []
      for (const prop in data) {
        for (const key in data[prop]) {
          let obj = {}
          for (const indexType in typeObj) {
            if (typeObj[indexType][0]) {
              obj[indexType] = data[prop][key][typeObj[indexType][0]] || data[prop][key][typeObj[indexType][1]]
              if (obj[indexType] === undefined) {
                this.$message.error('解析失败，请使用标准模板或检测必填数据是否存在空的情况！！！')
                return
              }
            } else {
              obj[indexType] = typeObj[indexType][1]
            }
          }
          submitData.push(obj)
        }
      }
      if (submitData.length === 0) {
        this.$message.warning('未读取到可用参数')
        return
      }
      api({
        data: submitData
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('导入成功,即将刷新数据')
          setTimeout(() => {
            this.$winReload()
          }, 1000)
        }
      })
    },
    // 批量修改
    updatedBatchSubmit () {
      if (this.updatedBatchFlag) {
        const data = this.yarnNameArr.map(itemM => {
          return {
            id: itemM.id,
            name: itemM.name,
            price_data: itemM.price.map(itemPrice => {
              return {
                client_id: itemPrice.client_id,
                price: itemPrice.price || 0,
                desc: itemPrice.desc || ''
              }
            })
          }
        })
        yarn.create({
          data: data
        }).then((res) => {
          if (res.data.status !== false) {
            this.$message.success('修改成功')
            this.getYarnName()
            this.updatedBatchFlag = false
          }
        })
      } else {
        this.updatedBatchFlag = true
      }
    },
    openUpdatedBatchModel () {
      if (this.updatedBatchFlag) {
        this.getYarnName()
      }
      this.updatedBatchFlag = !this.updatedBatchFlag
    },
    // 保存结算工序
    saveStaffProcess () {
      if (this.staffProcess.indexOf('/') !== -1) {
        this.$message.warning('工序名称内不允许存在“/”字符,请调整')
        return
      }
      if (this.staffProcess) {
        process.create({
          data: [{
            id: null,
            type: 3,
            name: this.staffProcess
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.staffProcess = ''
            this.getStaffProcess()
          }
        })
      } else {
        this.$message.error('请输入工序名称')
      }
    },
    getStaffProcess () {
      process.list({
        type: 3
      }).then((res) => {
        this.staffProcessList = res.data.data
        this.staffProcessTotal = this.staffProcessList.length
      })
    },
    // 批量添加
    updataYarns () {
      this.updataYarnsFlag = true
    },
    buildYarnList () {
      this.layoutData.yarnNameList = []
      let thresholdValues = Number(this.layoutData.thresholdValues)
      let fixedNum = thresholdValues.toString().split('.')[1] ? thresholdValues.toString().split('.')[1].length : 0
      let firstValue = Number(this.layoutData.firstValue)
      let lastValue = Number(this.layoutData.lastValue)
      let unit = this.layoutData.unit
      let yarnName = this.layoutData.yarnName
      let colorCodeUnit = this.layoutData.colorCodeUnit
      let firstColorCode = Number(this.layoutData.firstColorCode)
      let lastColorCode = Number(this.layoutData.lastColorCode)
      if (thresholdValues && (firstValue || firstValue === 0) && lastValue && unit && yarnName) {
        for (let i = firstValue; lastValue >= i;) {
          if (colorCodeUnit && (firstColorCode || firstColorCode === 0) && lastColorCode) {
            for (let j = firstColorCode; lastColorCode >= j; j++) {
              this.layoutData.yarnNameList.push([i.toFixed(fixedNum), unit, yarnName, colorCodeUnit, j].join(''))
            }
          } else {
            this.layoutData.yarnNameList.push([i.toFixed(fixedNum), unit, yarnName].join(''))
          }
          i += thresholdValues
        }
      }
    },
    getSampleOrderType () {
      orderType.typeList({
        order_type: 2
      }).then((res) => {
        this.sampleOrderTypeList = res.data.data
        this.sampleOrderTypeTotal = this.sampleOrderTypeList.length
      })
    },
    saveSampleOrderType () {
      if (this.sampleOrderType) {
        orderType.saveType({
          name: this.sampleOrderType,
          order_type: 2
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加样单类型成功'
            })
            this.sampleOrderType = ''
            this.getSampleOrderType()
          }
        })
      } else {
        this.$message.error({
          message: '样单类型名称不能为空'
        })
      }
    },
    deleteSampleOrderType (id) {
      this.$confirm('是否删除该样单类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderType.deleteType({
          id: id
        }).then((res) => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getSampleOrderType()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getOrderType () {
      orderType.typeList({
        order_type: 1
      }).then((res) => {
        this.orderTypeList = res.data.data
        this.orderTypeTotal = this.orderTypeList.length
      })
    },
    saveOrderType () {
      if (this.orderType) {
        orderType.saveType({
          name: this.orderType,
          order_type: 1
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加订单类型成功'
            })
            this.orderType = ''
            this.getOrderType()
          }
        })
      } else {
        this.$message.error({
          message: '订单类型名称不能为空'
        })
      }
    },
    deleteOrderType (id) {
      this.$confirm('是否删除该订单类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderType.deleteType({
          id: id
        }).then((res) => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getorderType()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveYarns () {
      let data = []
      // let flag = true
      if (this.yarnAddType) {
        this.editYarnInfo.filter(item => item.name).forEach(item => {
          // if (item.name.indexOf('/') !== -1 || item.name.indexOf('%') !== -1) {
          //   flag = false
          // }
          data.push({
            name: item.name,
            price_data: this.layoutData.yarnPriceArr.filter(itemPrice => itemPrice.company).map(itemInner => {
              return {
                client_id: itemInner.company,
                price: itemInner.price || 0,
                desc: itemInner.desc
              }
            })
          })
        })
      } else {
        this.layoutData.yarnNameList.forEach(item => {
          // if (item.indexOf('/') !== -1 || item.indexOf('%') !== -1) {
          //   flag = false
          // }
          data.push({
            name: item,
            price_data: this.layoutData.yarnPriceArr.filter(itemPrice => itemPrice.company).map(itemInner => {
              return {
                client_id: itemInner.company,
                price: itemInner.price || 0,
                desc: itemInner.desc
              }
            })
          })
        })
      }
      // if (!flag) {
      //   this.$message.error('纱线名称不能包含特殊字符斜杠，请重新添加')
      //   return
      // }
      if (data.length !== 0) {
        yarn.create({ data: data }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.getYarnName()
            this.closeAndResetInfo('yarn')
          }
        })
      } else {
        this.$message.warning('无可提交的数据')
      }
    },
    querySearchYarn (queryString, cb) {
      var restaurants = this.yarnNameArr.map(item => {
        return {
          value: item.name
        }
      })
      var results = queryString ? restaurants.filter(item => item.value.indexOf(queryString) !== -1) : []
      cb(results)
    },
    handleSelectYarn (item) {
      this.$message.warning('物料"' + item.value + '"已存在,无需再次添加')
    },
    // 报价单预加载
    savePriceLoading () {
      if (!this.priceEditInfo.title) {
        this.$message.error('请输入预加载标题')
        return
      }
      priceLoading.create({
        id: this.priceEditInfo.id || null,
        title: this.priceEditInfo.title,
        weave_info: JSON.stringify(this.priceEditInfo.weave.filter(item => item.name)),
        semi_product_info: JSON.stringify(this.priceEditInfo.semi.filter(item => item.name)),
        product_info: JSON.stringify(this.priceEditInfo.finished.filter(item => item.name)),
        pack_material_info: JSON.stringify(this.priceEditInfo.pack.filter(item => item.name)),
        others_info: JSON.stringify(this.priceEditInfo.other.filter(item => item.name))
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.showPopup = false
          this.getPriceLoading()
        }
      })
    },
    getPriceLoading () {
      if (this.semi_list.length === 0) {
        this.getSemiList()
      }
      priceLoading.list({
        keyword: ''
      }).then(res => {
        if (res.data.status !== false) {
          this.priceInfo = res.data.data.data
          this.priceTotal = res.data.data.total
        }
      })
    },
    changePriceInfo (item) {
      this.priceEditInfo.id = item.id
      this.priceEditInfo.title = item.title
      this.priceEditInfo.weave = JSON.parse(item.weave_info)
      if (!this.priceEditInfo.weave || this.priceEditInfo.weave.length === 0) {
        this.priceEditInfo.weave = [{ name: '', price: '' }]
      }
      this.priceEditInfo.semi = JSON.parse(item.semi_product_info)
      if (!this.priceEditInfo.semi || this.priceEditInfo.semi.length === 0) {
        this.priceEditInfo.semi = [{ name: '', price: '' }]
      }
      this.priceEditInfo.finished = JSON.parse(item.product_info)
      if (!this.priceEditInfo.finished || this.priceEditInfo.finished.length === 0) {
        this.priceEditInfo.finished = [{ name: '', price: '' }]
      }
      this.priceEditInfo.pack = JSON.parse(item.pack_material_info)
      if (!this.priceEditInfo.pack || this.priceEditInfo.pack.length === 0) {
        this.priceEditInfo.pack = [{ name: '', price: '' }]
      }
      this.priceEditInfo.other = JSON.parse(item.others_info)
      if (!this.priceEditInfo.other || this.priceEditInfo.other.length === 0) {
        this.priceEditInfo.other = [{ name: '', price: '' }]
      }
      this.showPopup = true
    },
    deletePriceInfo (id) {
      this.$confirm('此操作将永久删除该报价设置项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        priceLoading.delete({
          id: id
        }).then(res => {
          if (res.data.status !== false) {
            this.getPriceLoading()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 报价说明
    getPriceRemarkList () {
      const { priceRemark } = require('@/assets/js/api.js')
      priceRemark.list().then(res => {
        if (res.data.status !== false) {
          res.data.data.forEach(itemF => {
            let finded = this.priceRemark.find(itemFind => +itemFind.id === +itemF.title)
            if (finded) {
              finded.remark = itemF.content
              finded.changeId = itemF.id
            }
          })
        }
      })
    },
    savePriceRemark () {
      const { priceRemark } = require('@/assets/js/api.js')
      let remark = this.priceRemarkEditor.txt.html()
      priceRemark.create({
        title: this.priceRemarkEditInfo.id,
        id: this.priceRemarkEditInfo.changeId,
        content: remark
      }).then(res => {
        if (res.data.status !== false) {
          this.showPopup = false
          this.getPriceRemarkList()
          this.$message.success('修改成功')
        }
      })
    },
    updatedPriceRemark (item) {
      if (this.cName === '报价说明' && !this.priceRemarkEditor) {
        this.priceRemarkEditor = new E(this.$refs.editorPriceRemark)
        this.priceRemarkEditor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'list', // 列表
          'justify', // 对齐方式
          'fullscreen' // 全屏
        ]
        this.priceRemarkEditor.customConfig.onchange = (html) => {
          this.content = html // 绑定当前逐渐地值
        }
        this.priceRemarkEditor.create()
      }
      this.priceRemarkEditInfo = this.$clone(item)
      this.priceRemarkEditor.txt.html(this.priceRemarkEditInfo.remark)
      this.showPopup = true
    },
    // 修改打印设置
    updatePrint (item) {
      if (this.cName === '打印设置' && !this.printEditor) {
        this.printEditor = new E(this.$refs.editorPrint)
        this.printEditor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'list', // 列表
          'justify', // 对齐方式
          'fullscreen' // 全屏
        ]
        this.printEditor.customConfig.onchange = (html) => {
          this.content = html // 绑定当前逐渐地值
        }
        this.printEditor.create()
      }
      this.printEditInfo = this.$clone(item)
      this.printEditor.txt.html(this.printEditInfo.remark)
      this.showPopup = true
    },
    savePrint () {
      // console.log(this.printEditor.txt.html())
      let remark = this.printEditor.txt.html()
      print.create({
        id: this.printEditInfo.id,
        type: this.printEditInfo.type,
        title: this.printEditInfo.title,
        hide_order_client: this.printEditInfo.isHideClient ? 1 : 0, // 1隐藏0显示
        desc: remark
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('设置成功')
          this.getPrintList()
          this.showPopup = false
        }
      })
    },
    getPrintList () {
      print.list().then(res => {
        if (res.data.status !== false) {
          let data = res.data.data
          data.forEach(item => {
            let flag = this.printEditArr.find(val => Number(val.type) === Number(item.type))
            if (flag) {
              flag.title = item.title
              flag.remark = item.desc.replace(/<br\/>/g, '\n')
              flag.isHideClient = item.hide_order_client === 1
              flag.id = item.id
            }
          })
        }
      })
    },
    // 修改用户账号信息
    changeAuth (item) {
      this.showPopup = true
      let authInfo = this.$clone(item)
      delete authInfo.company_id
      delete authInfo.create_time
      delete authInfo.group
      this.authInfo = authInfo
      if (typeof (this.authInfo.module_id) !== 'object' || this.authInfo.module_id === null) {
        this.authInfo.module_id = []
      }
      if (typeof (this.authInfo.module_id_detail) !== 'object' || this.authInfo.module_id_detail === null) {
        this.authInfo.module_id_detail = []
      }
    },
    banAuth (item) {
      let msg = ''
      if (item.status === 1) {
        msg = '禁用该员工后该帐号将不能登录系统，请确认'
      } else {
        msg = '是否启用该员工'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auth.ban({
          id: item.id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            item.status = (item.status === 1 ? 0 : 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 员工标签
    resetAuthTag () {
      this.showPopup = false
      this.authTagInfo = {
        name: '',
        id: ''
      }
    },
    saveAuthTag () {
      if (!this.authTagInfo.name) {
        this.$message.error('请输入标签名')
        return
      }
      staffTag.create({
        id: this.authTagInfo.id,
        name: this.authTagInfo.name
      }).then(res => {
        if (res.data.status !== false) {
          if (this.authTagInfo.id) {
            this.$message.success('修改成功')
            this.resetAuthTag()
            this.getAuthTagList()
          } else {
            this.$message.success('添加成功')
            this.resetAuthTag()
            this.getAuthTagList()
          }
        }
      })
    },
    changeAuthTag (item) {
      this.authTagInfo.name = item.name
      this.authTagInfo.id = item.id
      this.showPopup = true
    },
    deleteAuthTag (id) {
      this.$confirm('此操作将永久该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        staffTag.delete({
          id: id
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success('删除成功')
            this.getAuthTagList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getAuthTagList () {
      staffTag.list().then(res => {
        if (res.data.status !== false) {
          this.authTagList = this.$newSplice(res.data.data, 5)
          this.authTagTotal = this.authTagList.length
        }
      })
    },
    getProductType () {
      productType.list().then((res) => {
        this.productTypeArr = res.data.data.map((item) => {
          return {
            pid: item.pid,
            id: item.id,
            label: item.name,
            level: 1,
            children: item.child.map((item) => {
              return {
                pid: item.pid,
                id: item.id,
                label: item.name,
                level: 2,
                children: item.child.map((item) => {
                  return {
                    pid: item.pid,
                    id: item.id,
                    label: item.name,
                    children: item.child,
                    isEdit: false,
                    level: 3
                  }
                }),
                isEdit: false
              }
            }),
            isEdit: false
          }
        })
      })
    },
    // 产品类型添加
    renderContent (h, { node, data, store }) {
      if (data.level < 3) {
        return (
          <span class="tree_node_Ctn">
            <span>
              {this.showOrEdit(data, node)}
            </span>
            <div class="tree_node_op">
              <i class="el-icon-plus" on-click={(ev) => this.nodeAppend(ev, data)}></i>
              <i class="el-icon-edit" on-click={(ev) => this.nodeEdit(ev, store, data)}></i>
              <i class="el-icon-delete" on-click={() => this.nodeDelete(node, data)}></i>
            </div>
          </span>)
      } else {
        return (
          <span class="tree_node_Ctn">
            <span>
              {this.showOrEdit(data, node)}
            </span>
            <div class="tree_node_op">
              <i class="el-icon-edit" on-click={(ev) => this.nodeEdit(ev, store, data)}></i>
              <i class="el-icon-delete" on-click={() => this.nodeDelete(node, data)}></i>
            </div>
          </span>)
      }
    },
    // 编辑节点
    nodeEdit (ev, store, data) {
      data.isEdit = true
      this.$nextTick(() => {
        let $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')
        if (!$input) {
          $input = ''
        } else {
          $input = $input.focus()
        }
      })
    },
    // 节点删除
    nodeDelete (node, data) {
      this.$confirm('是否要删除该产品，这可能会影响包含该产品的订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productType.delete({
          id: data.id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '删除成功'
            })
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          } else {
            this.$message.error({
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增节点
    nodeAppend (ev, data) {
      const newChild = { id: this.productTypeId--, label: '新增产品', isEdit: true, pid: data.id }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      // 新增节点后展开当前节点
      this.$refs.tree.store.nodesMap[data.id].expanded = true
      // 新增节点focus
      this.$nextTick(() => {
        let $input = ev.target.offsetParent.querySelector('input')
        if (!$input) {
          $input = ''
        } else {
          $input = $input.focus()
        }
      })
    },
    // 是否展示操作框
    showOrEdit (data, node) {
      if (data.isEdit) {
        return <input class="tree_edit_input" type="text" value={data.label} on-blur={ev => this.edit_sure(ev, data, node)} />
      } else {
        return <span className="node_labe">{data.label}</span>
      }
    },
    // 完成编辑
    edit_sure (ev, data, node) {
      let realId = null
      // <0说明是添加操作,>0则是编辑操作
      if (data.id > 0) {
        realId = data.id
      }
      const $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')
      if (!$input) {
        return false
      } else {
        data.label = $input.value
        data.isEdit = false
        productType.create({
          company_id: window.sessionStorage.getItem('company_id'),
          id: realId,
          pid: data.pid,
          name: $input.value
        }).then((res) => {
          if (res.data.status) {
            productType.list().then((res) => {
            })
          }
        })
      }
    },
    getFlower () {
      flower.list().then((res) => {
        this.flowerList = res.data.data
        this.flowerTotal = this.flowerList.length
      })
    },
    saveFlower () {
      if (this.flower) {
        flower.create({
          data: [{
            id: null,
            name: this.flower
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加花型成功'
            })
            this.flower = ''
            this.getFlower()
          }
        })
      } else {
        this.$message.error({
          message: '花型名称不能为空'
        })
      }
    },
    deleteFlower (id) {
      this.$confirm('是否删除该花型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        flower.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getFlower()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getIngredient () {
      ingredient.list().then((res) => {
        if (res.data.status) {
          this.ingredientList = res.data.data
          this.ingredientTotal = this.ingredientList.length
        }
      })
    },
    saveIngredient () {
      if (this.ingredient) {
        ingredient.create({
          data: [{
            id: null,
            name: this.ingredient
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加成分成功'
            })
            this.ingredient = ''
            this.getIngredient()
          }
        })
      } else {
        this.$message.error({
          message: '花型名称不能为空'
        })
      }
    },
    deleteIngredient (id) {
      this.$confirm('是否删除该成分?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ingredient.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getIngredient()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getColour () {
      colour.list().then((res) => {
        if (res.data.status) {
          this.colourList = res.data.data
          this.colourTotal = this.colourList.length
        }
      })
    },
    saveColour () {
      if (this.colour && this.colour.indexOf('/') === -1) {
        colour.create({
          data: [{
            id: null,
            name: this.colour,
            color_code: ''
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加配色成功'
            })
            this.colour = ''
            this.getColour()
          }
        })
      } else {
        this.$message.error('配色名称未填写或名称里包含斜杠，请重新填写')
      }
    },
    deleteColour (id) {
      this.$confirm('是否删除该配色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        colour.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getColour()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getSize () {
      productType.list().then((res) => {
        this.sizeList = res.data.data
        this.sizeTotal = this.sizeList.length
      })
    },
    addSize (id) {
      this.sizeId = id
      this.showPopup = true
    },
    delSize (item) {
      this.sizeIdArr = item
      this.sizeFLag = true
    },
    saveSize () {
      if (this.size && this.size.indexOf('/') === -1) {
        productSize.create({
          name: this.size,
          category_id: this.sizeId
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加尺码成功'
            })
            this.size = ''
            this.getSize()
          }
        })
      } else {
        this.$message.error('尺码名称未填写或包含斜杠，请重新填写')
      }
    },
    deleteSize () {
      productSize.delete({
        id: this.deleteSizeId
      }).then((res) => {
        if (res.data.status) {
          this.$message.success({
            message: '删除成功'
          })
          this.deleteSizeId = ''
          this.getSize()
        }
      })
    },
    // getMeasurement () {
    //   productType.list().then((res) => {
    //     this.measurementList = res.data.data
    //     this.measurementTotal = this.measurementList.length
    //   })
    // },
    // addMeasurement (id) {
    //   this.measurementId = id
    //   this.showPopup = true
    // },
    // delMeasurement (item) {
    //   this.measurementIdArr = item
    //   this.measurementFlag = true
    // },
    // saveMeasurement () {
    //   if (this.measurement) {
    //     measurement.create({
    //       name: this.measurement,
    //       category_id: this.measurementId
    //     }).then((res) => {
    //       if (res.data.status) {
    //         this.$message.success({
    //           message: '添加规格成功'
    //         })
    //         this.measurement = ''
    //         this.getMeasurement()
    //       }
    //     })
    //   } else {
    //     this.$message.error('请填写规格名称')
    //   }
    // },
    // deleteMeasurement () {
    //   measurement.delete({
    //     id: this.deleteMeasurementId
    //   }).then((res) => {
    //     if (res.data.status) {
    //       this.$message.success({
    //         message: '删除成功'
    //       })
    //       this.deleteMeasurementId = ''
    //       this.getMeasurement()
    //     }
    //   })
    // },
    getSide () {
      craftSetting.list().then((res) => {
        this.sideList = res.data.data.side
        this.sideTotal = this.sideList.length
      })
    },
    saveSide () {
      if (this.side) {
        craftSetting.createSide({
          data: [{
            id: null,
            name: this.side
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.side = ''
            this.getSide()
          }
        })
      } else {
        this.$message.error('请输入边型')
      }
    },
    deleteSide (id) {
      this.$confirm('是否删除该边型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        craftSetting.deleteSide({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getSide()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getMachine () {
      craftSetting.list().then((res) => {
        this.machineList = res.data.data.type
        this.machineTotal = this.machineList.length
      })
    },
    saveMachine () {
      if (this.machine) {
        craftSetting.createMachine({
          data: [{
            id: null,
            name: this.machine
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.machine = ''
            this.getMachine()
          }
        })
      } else {
        this.$message.error('请输入机型')
      }
    },
    deleteMachine (id) {
      this.$confirm('是否删除该机型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        craftSetting.deleteMachine({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getMachine()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getMethods () {
      craftSetting.list().then((res) => {
        this.methodsList = res.data.data.method
        this.methodsTotal = this.methodsList.length
      })
    },
    saveMethods () {
      if (this.methods) {
        craftSetting.createMethods({
          data: [{
            id: null,
            name: this.methods
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.methods = ''
            this.getMethods()
          }
        })
      } else {
        this.$message.error('请输入组织法')
      }
    },
    deleteMethods (id) {
      this.$confirm('是否删除该组织法?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        craftSetting.deleteMethods({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getMethods()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getYarnName () {
      client.list().then((res) => {
        this.clientList = res.data.data.filter(item => (item.type.includes(3) || item.type.includes(4)))
      })
      yarn.list().then((res) => {
        this.yarnNameList = res.data.data
        this.yarnNameTotal = this.yarnNameList.length
      })
    },
    saveYarnName () {
      if (this.changeYarnInfo.yarnName) {
        yarn.create({
          data: [
            {
              id: this.changeYarnInfo.id,
              name: this.changeYarnInfo.yarnName,
              price_data: this.changeYarnInfo.yarnPriceArr.filter(itemPrice => itemPrice.company).map(itemPrice => {
                return {
                  client_id: itemPrice.company,
                  price: itemPrice.price || 0,
                  desc: itemPrice.desc || ''
                }
              })
            }
          ]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.getYarnName()
            this.closeAndResetInfo('yarn')
          }
        })
      } else {
        this.$message.error('请输入纱线名称')
      }
    },
    deleteYarnName (id) {
      this.$confirm('是否删除该纱线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        yarn.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getYarnName()
            this.showPopup = false
            this.changeYarnInfo = {
              id: '',
              yarnName: '',
              yarnPriceArr: [{
                price: '',
                company: ''
              }]
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updataYarn (type, item) {
      this.yarn_handle_type = type
      if (type === 'add') {
        this.changeYarnInfo = {
          id: '',
          yarnName: '',
          yarnPriceArr: [{
            price: '',
            company: '',
            desc: ''
          }]
        }
      }
      this.showPopup = true
      if (item) {
        this.changeYarnInfo.yarnName = item.name
        this.changeYarnInfo.id = item.id
        this.changeYarnInfo.yarnPriceArr = item.price.map(itemPrice => {
          return {
            company: itemPrice.client_id.toString(),
            price: itemPrice.price,
            desc: itemPrice.desc
          }
        })
        if (this.changeYarnInfo.yarnPriceArr.length === 0) {
          this.changeYarnInfo.yarnPriceArr = [{
            company: '',
            price: '',
            desc: ''
          }]
        }
      }
    },
    addClient (item) {
      item.push({
        price: '',
        company: '',
        desc: ''
      })
    },
    deleteClient (item, index) {
      item.splice(index, 1)
    },
    getYarnColor () {
      yarnColor.list().then((res) => {
        this.yarnColorList = res.data.data
        this.yarnColorTotal = this.yarnColorList.length
      })
    },
    saveYarnColor () {
      if (this.yarnColor && this.yarnColorCode) {
        yarnColor.create({
          data: [{
            id: null,
            name: this.yarnColor,
            color_code: this.yarnColorCode
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.yarnColor = ''
            this.yarnColorCode = ''
            this.getYarnColor()
          }
        })
      } else {
        this.$message.error('请检查纱线颜色和色块是否填写完整')
      }
    },
    deleteYarnColor (id) {
      this.$confirm('是否删除该纱线颜色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        yarnColor.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getYarnColor()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getMaterialName () {
      client.list().then((res) => {
        this.clientList = res.data.data.filter(item => (item.type.includes(5) || item.type.includes(6)))
      })
      material.list().then(res => {
        if (res.data.status !== false) {
          this.materialNameList = res.data.data
          this.materialNameTotal = this.materialNameList.length
        }
      })
    },
    updataMaterial (type, item) {
      this.yarn_handle_type = type
      this.showPopup = true
      if (item) {
        this.changeMaterialInfo.need_weave = item.need_weave
        this.changeMaterialInfo.materialName = item.name
        this.changeMaterialInfo.id = item.id
        this.changeMaterialInfo.unit = item.unit
        this.changeMaterialInfo.materialPriceArr = item.price.map(itemPrice => {
          return {
            company: itemPrice.client_id.toString(),
            price: itemPrice.price
          }
        })
        if (this.changeMaterialInfo.materialPriceArr.length === 0) {
          this.changeMaterialInfo.materialPriceArr = [{
            company: '',
            price: ''
          }]
        }
      }
    },
    saveMaterial () {
      if (this.changeMaterialInfo.materialName && this.changeMaterialInfo.unit) {
        material.create({
          data: [{
            id: this.changeMaterialInfo.id,
            unit: this.changeMaterialInfo.unit,
            name: this.changeMaterialInfo.materialName,
            need_weave: this.changeMaterialInfo.need_weave,
            price_data: this.changeMaterialInfo.materialPriceArr.filter(itemPrice => itemPrice.company).map(itemPrice => {
              return {
                client_id: itemPrice.company,
                price: itemPrice.price
              }
            })
          }]
        }).then(res => {
          if (res.data.status !== false) {
            this.$message.success(this.changeMaterialInfo.id ? '修改成功' : '添加成功')
            this.closeAndResetInfo('material')
            this.getMaterialName()
          }
        })
      } else {
        this.$message.error('检测到辅料名称或计量单位未填写，请填写')
      }
    },
    deleteMaterialName (id) {
      this.$confirm('此操作将永久删除该包装辅料, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        material.delete({
          id: id
        }).then(res => {
          if (res.data.status === false) {
            this.$message.error('删除失败')
          } else {
            this.$message.success('删除成功')
            this.getMaterialName()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getPackName () {
      client.list().then((res) => {
        this.clientList = res.data.data.filter(item => (item.type.includes(7) || item.type.includes(8)))
      })
      packag.list().then(res => {
        if (res.data.status !== false) {
          this.packMaterialNameList = res.data.data
          this.packMaterialNameTotal = this.packMaterialNameList.length
        }
      })
    },
    updataPack (type, item) {
      this.yarn_handle_type = type
      this.showPopup = true
      if (item) {
        this.changePackMaterialInfo.packName = item.name
        this.changePackMaterialInfo.id = item.id
        this.changePackMaterialInfo.unit = item.unit
        this.changePackMaterialInfo.type = item.type === 1 ? 'area' : 'other'
        this.changePackMaterialInfo.packMaterialPriceArr = item.price.map(itemPrice => {
          return {
            company: itemPrice.client_id.toString(),
            price: itemPrice.price
          }
        })
        if (this.changePackMaterialInfo.packMaterialPriceArr.length === 0) {
          this.changePackMaterialInfo.packMaterialPriceArr = [{
            company: '',
            price: ''
          }]
        }
      }
    },
    closeAndResetInfo (type) {
      this.showPopup = false
      if (type === 'yarn') {
        this.changeYarnInfo = {
          id: '',
          yarnName: '',
          yarnPriceArr: [{
            price: '',
            company: ''
          }]
        }
      } else if (type === 'material') {
        this.changeMaterialInfo = {
          id: '',
          materialName: '',
          materialUnit: '',
          materialPriceArr: [{
            company: '',
            price: ''
          }]
        }
      } else if (type === 'pack') {
        this.changePackMaterialInfo = {
          id: '',
          packMaterialName: '',
          packMaterialUnit: '',
          type: 'area',
          packMaterialPriceArr: [{
            company: '',
            price: ''
          }]
        }
      }
    },
    savePack () {
      if (this.changePackMaterialInfo.packName && this.changePackMaterialInfo.unit) {
        packag.create({
          data: [{
            id: this.changePackMaterialInfo.id,
            unit: this.changePackMaterialInfo.unit,
            name: this.changePackMaterialInfo.packName,
            type: this.changePackMaterialInfo.type === 'area' ? 1 : 2,
            price_data: this.changePackMaterialInfo.packMaterialPriceArr.filter(itemPrice => itemPrice.company).map(itemPrice => {
              return {
                client_id: itemPrice.company,
                price: itemPrice.price,
                unit: this.changePackMaterialInfo.type === 'area' ? '元/㎡' : '元/' + this.changePackMaterialInfo.unit
              }
            })
          }]
        }).then(res => {
          if (res.data.status === false) {
            this.$message.error('添加失败，' + res.data.message)
          } else {
            this.$message.success('添加成功')
            this.closeAndResetInfo('pack')
            this.getPackName()
          }
        })
      } else {
        this.$message.error('检测到包装名称或计量单位未填写，请填写')
      }
    },
    deletePackName (id) {
      this.$confirm('此操作将永久删除该包装辅料, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        packag.delete({
          id: id
        }).then(res => {
          if (res.data.status === false) {
            this.$message.error('删除失败')
          } else {
            this.$message.success('删除成功')
            this.getPackName()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getMaterialProcess () {
      process.list({
        type: 1
      }).then((res) => {
        this.materialProcessList = res.data.data
        this.materialProcessTotal = this.materialProcessList.length
      })
    },
    saveMaterialProcess () {
      if (this.materialProcess) {
        process.create({
          data: [{
            id: null,
            type: 1,
            name: this.materialProcess
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.materialProcess = ''
            this.getMaterialProcess()
          }
        })
      } else {
        this.$message.error('请输入工序名称')
      }
    },
    deleteMaterialProcess (id) {
      this.$confirm('是否删除该工序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        process.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getMaterialProcess()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getHalfProcess () {
      process.list({
        type: 2
      }).then((res) => {
        this.halfProcessList = res.data.data
        this.halfProcessTotal = this.halfProcessList.length
      })
    },
    saveHalfProcess () {
      if (this.halfProcess) {
        process.create({
          data: [{
            id: null,
            type: 2,
            name: this.halfProcess
          }]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.halfProcess = ''
            this.getHalfProcess()
          }
        })
      } else {
        this.$message.error('请输入工序名称')
      }
    },
    deleteHalfProcess (id) {
      this.$confirm('是否删除该工序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        process.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getHalfProcess()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getGroup () {
      group.list({
        is_check: 0
      }).then((res) => {
        this.groupList = res.data.data
        this.groupTotal = this.groupList.length
      })
    },
    saveGroup () {
      if (this.group) {
        group.create({
          type: 1,
          name: this.group
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.group = ''
            this.getGroup()
          }
        })
      } else {
        this.$message.error('请输入小组名称')
      }
    },
    updateGroup (item) {
      group.create({
        type: 1,
        name: item.name,
        id: item.id
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          item.updateFlag = false
          this.$forceUpdate()
        }
      })
    },
    deleteGroup (id) {
      this.$confirm('是否删除该小组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        group.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getGroup()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    banGroup (item) {
      let msg = ''
      if (item.status === 1) {
        msg = '是否禁用该小组，请确认'
      } else {
        msg = '是否启用该小组'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        group.ban({
          id: item.id
        }).then((res) => {
          if (res.data.status !== false) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getGroup()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getStation () {
      station.list({
        type: 2
      }).then((res) => {
        this.stationList = res.data.data
        this.stationTotal = this.stationList.length
      })
    },
    saveStation () {
      if (this.station) {
        station.create({
          name: this.station,
          type: 2
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.station = ''
            this.getStation()
          }
        })
      } else {
        this.$message.error('请输入部门名称')
      }
    },
    deleteStation (id) {
      this.$confirm('是否删除该部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        station.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getStation()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getCompany () {
      getToken().then(res => {
        if (res.data.status) {
          this.postData.token = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
      company.detail().then((res) => {
        let companyInfo = res.data.data
        this.companyInfo.logoUrl = companyInfo.logo
        this.companyInfo.client_name = companyInfo.company_name
        this.companyInfo.client_about = companyInfo.introduce
        this.companyInfo.client_tel = companyInfo.phone
        this.companyInfo.alias = companyInfo.alias
        this.companyInfo.client_email = companyInfo.email
        this.companyInfo.client_address = companyInfo.address
        this.companyInfo.file_logo = [{ url: companyInfo.logo }]
        this.companyInfo.file_image = companyInfo.image.map(itemImg => {
          return {
            url: itemImg
          }
        })
      })
    },
    handleAvatarSuccess (res, file) {
      this.companyInfo.logoUrl = URL.createObjectURL(file.raw)
    },
    beforeUpload: function (file) {
      let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length// 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = Date.parse(new Date()) + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 6
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 6MB!')
        return false
      }
    },
    saveCompany () {
      const logoUrl = this.$refs.uploada_logo.uploadFiles.map((items) => { return (items.response ? ('https://file.zwyknit.com/' + items.response.key) : items.url) })
      const imageUrl = this.$refs.uploada_image.uploadFiles.map((items) => { return (items.response ? ('https://file.zwyknit.com/' + items.response.key) : items.url) })
      if (logoUrl.length === 0 || !logoUrl) {
        this.$message.error('请上传公司LOGO')
        return
      }
      if (!this.companyInfo.client_name) {
        this.$message.error('请填写公司名称')
        return
      }
      // if (!this.companyInfo.client_about) {
      //   this.$message.error('请填写公司简介')
      //   return
      // }
      // if (imageUrl.length === 0 || !imageUrl) {
      //   this.$message.error('请上传公司图片')
      //   return
      // }
      // if (!this.companyInfo.client_tel) {
      //   this.$message.error('请填写公司电话')
      //   return
      // }
      // if (!this.companyInfo.client_email) {
      //   this.$message.error('请填写公司邮箱')
      //   return
      // }
      // if (!this.companyInfo.client_address) {
      //   this.$message.error('请填写公司地址')
      //   return
      // }
      company.create({
        address: this.companyInfo.client_address,
        phone: this.companyInfo.client_tel,
        logo: logoUrl.reverse()[0],
        alias: this.companyInfo.alias,
        contacts: '1',
        introduce: this.companyInfo.client_about,
        email: this.companyInfo.client_email,
        images: imageUrl,
        id: window.sessionStorage.getItem('company_id')
      }).then(res => {
        if (res.data.status) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    resetAuth () {
      this.authInfo = {
        id: null,
        user_name: '',
        is_admin: 0,
        status: 1,
        telephone: '',
        group_id: '',
        station_name: '',
        name: '',
        mobile: '',
        has_check: 0,
        module_id: [],
        module_id_detail: []
      }
      this.showPopup = true
    },
    getAuth () {
      if (this.groupList.length === 0) {
        this.getGroup()
      }
      auth.list({
        page: this.authPage,
        limit: 5,
        is_check: 0
      }).then((res) => {
        this.authList = res.data.data
        this.authTotal = res.data.meta.total
      })
    },
    saveAuth () {
      if (this.authInfo.telephone === '') {
        this.$message({
          type: 'error',
          message: '手机号码不能为空'
        })
      } else if (this.authInfo.user_name === '') {
        this.$message({
          type: 'error',
          message: '登录帐号不能为空'
        })
      } else if (this.authInfo.name === '') {
        this.$message({
          type: 'error',
          message: '姓名不能为空'
        })
      } else if (this.authInfo.group_id === '') {
        this.$message({
          type: 'error',
          message: '小组不能为空'
        })
      } else if (this.authInfo.module_id.length === 0 && this.authInfo.is_admin === 0) {
        this.$message({
          type: 'error',
          message: '管理模块不能为空'
        })
      } else {
        if (this.authInfo.is_admin === 1) {
          this.authInfo.module_id = this.permissions.map((item) => item.id)
          this.authInfo.module_id_detail = ['02-01', '02-02', '02-03', '02-04', '02-05', '02-06', '05-01']
        }
        auth.create(this.authInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.authInfo = {
              id: null,
              is_admin: 0,
              user_name: '',
              status: 1,
              telephone: '',
              group_id: '',
              station_name: '',
              name: '',
              mobile: '',
              has_check: 0,
              module_id: [],
              module_id_detail: []
            }
          }
        })
      }
    },
    comPrice (item) {
      if (!item.price) {
        return ''
      }
      if (item.price.length === 0) {
        return '-'
      } else if (item.price.length === 1) {
        return item.price[0].price
      } else if (item.price.length > 1) {
        let priceData = this.$clone(item.price).sort((a, b) => {
          return a.price - b.price
        })
        return priceData[0].price + '~' + priceData[priceData.length - 1].price
      } else {
        return ''
      }
    },
    getSemiList () {
      course.list({
        company_id: this.companyId,
        type: 2
      }).then(res => {
        this.semi_list = res.data.data.map(item => { return { value: item.name } })
      })
    },
    addItem (data, type) {
      if (type === 'weave' || type === 'semi' || type === 'finished' || type === 'pack' || type === 'other') {
        data.push({
          name: '',
          price: ''
        })
      } else if (type === 'yarn') {
        data.push({ name: '' })
      }
    },
    deleteItem (data, index) {
      data.splice(index, 1)
    },
    getOrderSampleWarn () { // 订单样单预警都是这个函数
      if (this.userList.length === 0) { // 预警通知人员数据
        auth.list().then(res => {
          if (res.data.status === false) return
          this.userList = res.data.data
        })
      }
      warnSetting.list().then(res => {
        if (res.data.status !== false) {
          this.orderWarnList = this.$newSplice(res.data.data.filter(item => item.order_type === 1), 5)
          this.sampleWarnList = this.$newSplice(res.data.data.filter(item => item.order_type === 2), 5)
        }
      })
    },
    changeOrderWarn (item) {
      const materialPlan = JSON.parse(item.material_plan)
      const materialStock = JSON.parse(item.material_push)
      const process = JSON.parse(item.semi_product_push)
      const productStock = JSON.parse(item.product_push)
      const pack = JSON.parse(item.product_pack)
      this.orderWarningEditInfo = {
        id: item.id,
        materialPlan: materialPlan.ratio || materialPlan,
        materialPlan_user: materialPlan.users || '',
        materialStock: materialStock.ratio || materialStock,
        materialStock_user: materialStock.users || '',
        process: process.ratio || process,
        process_user: process.users || '',
        productStock: productStock.ratio || productStock,
        productStock_user: productStock.users || '',
        pack: pack.ratio || pack,
        pack_user: pack.users || '',
        name: item.title
      }
      this.showPopup = true
    },
    saveOrderWarn () {
      if (!this.orderWarningEditInfo.materialPlan || !this.orderWarningEditInfo.name || !this.orderWarningEditInfo.materialStock || !this.orderWarningEditInfo.process || !this.orderWarningEditInfo.productStock || !this.orderWarningEditInfo.pack) {
        this.$message.error('检测到有未填项，请检查信息是否填写完整')
        return
      }
      if ((this.orderWarningEditInfo.materialPlan + this.orderWarningEditInfo.materialStock + this.orderWarningEditInfo.process + this.orderWarningEditInfo.productStock + this.orderWarningEditInfo.pack) !== 100) {
        this.$message.warning('合计比例不等于100')
        return
      }
      warnSetting.create({
        id: this.orderWarningEditInfo.id,
        order_type: 1,
        material_plan: JSON.stringify({
          ratio: this.orderWarningEditInfo.materialPlan,
          users: this.orderWarningEditInfo.materialPlan_user
        }),
        material_push: JSON.stringify({
          ratio: this.orderWarningEditInfo.materialStock,
          users: this.orderWarningEditInfo.materialStock_user
        }),
        semi_product_push: JSON.stringify({
          ratio: this.orderWarningEditInfo.process,
          users: this.orderWarningEditInfo.process_user
        }),
        product_push: JSON.stringify({
          ratio: this.orderWarningEditInfo.productStock,
          users: this.orderWarningEditInfo.productStock_user
        }),
        product_pack: JSON.stringify({
          ratio: this.orderWarningEditInfo.pack,
          users: this.orderWarningEditInfo.pack_user
        }),
        title: this.orderWarningEditInfo.name
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.closePopup()
          this.getOrderSampleWarn()
        }
      })
    },
    deleteOrderSampleWarn (id) {
      warnSetting.delete({
        id: id
      }).then(res => {

      })
    },
    changeSampleWarn (item) {
      const materialPlan = JSON.parse(item.material_plan)
      const materialStock = JSON.parse(item.material_push)
      const process = JSON.parse(item.semi_product_push)
      const productStock = JSON.parse(item.product_push)
      this.sampleWarningEditInfo = {
        id: item.id,
        materialPlan: materialPlan.ratio || materialPlan,
        materialPlan_user: materialPlan.users || '',
        materialStock: materialStock.ratio || materialStock,
        materialStock_user: materialStock.users || '',
        process: process.ratio || process,
        process_user: process.users || '',
        productStock: productStock.ratio || productStock,
        productStock_user: productStock.users || '',
        name: item.title
      }
      this.showPopup = true
    },
    saveSampleWarn () {
      if (!this.sampleWarningEditInfo.name || !this.sampleWarningEditInfo.materialPlan || !this.sampleWarningEditInfo.materialStock || !this.sampleWarningEditInfo.process || !this.sampleWarningEditInfo.productStock) {
        this.$message.error('检测到有未填项，请检查信息是否填写完整')
        return
      }
      if ((this.sampleWarningEditInfo.materialPlan + this.sampleWarningEditInfo.materialStock + this.sampleWarningEditInfo.process + this.sampleWarningEditInfo.productStock) !== 100) {
        this.$message.warning('合计比例不等于100')
        return
      }
      warnSetting.create({
        id: this.sampleWarningEditInfo.id,
        order_type: 2,
        material_plan: JSON.stringify({
          ratio: this.sampleWarningEditInfo.materialPlan,
          users: this.sampleWarningEditInfo.materialPlan_user
        }),
        material_push: JSON.stringify({
          ratio: this.sampleWarningEditInfo.materialStock,
          users: this.sampleWarningEditInfo.materialStock_user
        }),
        semi_product_push: JSON.stringify({
          ratio: this.sampleWarningEditInfo.process,
          users: this.sampleWarningEditInfo.process_user
        }),
        product_push: JSON.stringify({
          ratio: this.sampleWarningEditInfo.productStock,
          users: this.sampleWarningEditInfo.productStock_user
        }),
        title: this.sampleWarningEditInfo.name
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.closePopup()
          this.getOrderSampleWarn()
        }
      })
    },
    closePopup () {
      this.orderWarningEditInfo = {
        id: '',
        name: '',
        materialPlan: '',
        materialStock: '',
        process: '',
        productStock: '',
        pack: ''
      }
      this.sampleWarningEditInfo = {
        id: '',
        name: '',
        materialPlan: '',
        materialStock: '',
        process: '',
        productStock: ''
      }
      this.showPopup = false
    }
  },
  created () {
    this.pName = '产品设置'
    this.cName = '产品花型'
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/setting/setting.less";
.tableCtnLv2 {
  .tb_col {
    border-left: 1px solid #efefef;
    border-right: 1px solid #efefef;
    .tb_col_item {
      .tb_row {
        padding: 0 22px;
        box-sizing: border-box;
        border-right: 1px solid #efefef;
        &:last-of-type {
          border: none;
        }
      }
    }
  }
}
</style>
<style lang="less">
.tree_node_Ctn {
  display: flex;
  width: 300px;
  justify-content: space-between;
  align-items: center;
  &:hover {
    .tree_node_op {
      display: block;
    }
  }
  .tree_edit_input {
    color: #666;
    font-size: 12px;
  }
  .tree_node_op {
    display: none;
    margin-left: 30px;
    color: #666;
    i {
      margin: 0 5px;
      &:hover {
        color: #1a95ff;
      }
    }
  }
}
.imgCtn {
  .el-upload-dragger {
    width: 100px !important;
    height: 100px !important;
    img {
      width: 100px !important;
      height: 100px !important;
    }
  }
  .el-upload {
    line-height: 100px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.65);
  }
}
#setting {
  .el-checkbox {
    margin-right: 12px;
  }
  .clientImg {
    width: 600px;
    height: auto;
    .el-upload-list {
      width: 100% !important;
    }
    .el-upload-dragger {
      width: 100% !important;
      height: 100% !important;
      border: none;
    }
  }
  .green {
    color: #01b48c;
  }
  .red {
    color: #f5222d;
  }
}
</style>
