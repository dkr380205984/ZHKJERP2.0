<template>
  <div id="craftUpdate"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">{{$route.params.type==='1'?'产':'样'}}品信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
      </div>
      <div class="detailCtn"
        v-if="productInfo.category_info">
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
            <!-- <span class="text">{{$route.params.type==='1'?productInfo.category_info.product_category+'/'+productInfo.type_name+'/'+productInfo.style_name:productInfo.category_name+'/'+productInfo.type_name+'/'+productInfo.style_name}}</span> -->
            <span class="text">{{productInfo.category_info.product_category+'/'+productInfo.type_name+'/'+productInfo.style_name}}</span>
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
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in productInfo.size"
                :key="index">{{item.size_name+ ' ' + item.size_info + 'cm ' + item.weight + 'g'}}</div>
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
      <div class="detailCtn"
        v-if="!productInfo.category_info">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">配件名称：</span>
            <span class="text">{{productInfo.title}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">原料经向</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn"
          v-for="(item,index) in colour"
          :key="'colour'+index">
          <div class="colCtn">
            <div class="label"
              v-if="index===0">
              <span class="text">配色方案</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content"
              style="height:auto">
              <div style="height:32px;display:inline-block">
                <el-select v-model="item.value"
                  class="element"
                  style="margin-bottom:16px">
                  <el-option v-for="item in colourArr"
                    :key="item.id"
                    :label="item.color_name"
                    :value="item.color_id"></el-option>
                </el-select>
              </div>
              <div class="editBtn"
                style="margin-bottom:16px;margin-right:16px"
                :class="{'addBtn':index===0,'deleteBtn':index>0}"
                @click="index===0?addColour():deleteColour(index)">
                {{index===0?'添加配色':'删除配色'}}
              </div>
              <div v-if="index===0"
                class="editBtn deleteBtn"
                style="margin-bottom:16px;margin-right:16p;margin-left:0"
                @click="deleteColour(index)">删除配色</div>
              <color-picker style="margin-bottom:16px"
                v-for="(itemColor,indexColor) in item.colorWarp"
                :key="'color' + indexColor"
                v-model="item.colorWarp[indexColor]"
                :content="filterMethods(indexColor)"
                :colorArr="colorArr">
              </color-picker>
              <div class="specialBtn"
                style="margin-bottom:16px"
                @click="addColor('colorWarp')"><i class="el-icon-plus"></i></div>
              <div class="specialBtn"
                style="margin-bottom:16px"
                @click="deleteColor('colorWarp')"><i class="el-icon-minus"></i></div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">主要原料</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="yarn.yarnWarp"
                :fetch-suggestions="searchYarn"
                placeholder="请输入主要原料">
              </el-autocomplete>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in yarn.yarnOtherWarp"
          :key="'yarn'+index">
          <div class="colCtn">
            <div class="label"
              v-if="index===0">
              <span class="text">次要原料</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input element"
                clearable
                v-model="yarn.yarnOtherWarp[index].value"
                :fetch-suggestions="searchYarn"
                placeholder="请输入次要原料">
              </el-autocomplete>
              <div class="editBtn"
                :class="{'addBtn':index===0,'deleteBtn':index>0}"
                @click="index===0?addYarn('Warp'):deleteYarn('Warp',index)">
                {{index===0?'添加原料':'删除原料'}}
              </div>
              <el-select class="specialSelect"
                v-for="(itemJia,indexJia) in item.array"
                :key="indexJia"
                placeholder="夹"
                v-model="item.array[indexJia]">
                <el-option v-for="item in warpJia"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="specialBtn"
                @click="addYarnArr('Warp',index)"><i class="el-icon-plus"></i></div>
              <div class="specialBtn"
                @click="deleteYarnArr('Warp',index)"><i class="el-icon-minus"></i></div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in material.materialWarp"
          :key="'material'+index">
          <div class="colCtn">
            <div class="label"
              v-if="index===0">
              <span class="text">辅助原料</span>
            </div>
            <div class="content">
              <el-input class="element"
                clearable
                style="width:172px"
                v-model="material.materialWarp[index].value"
                placeholder="请输入辅助原料"></el-input>
              <el-input class="element"
                style="width:172px;margin-left:16px"
                v-model="material.materialWarp[index].number"
                placeholder="请输入数量"></el-input>
              <div class="editBtn"
                :class="{'addBtn':index===0,'deleteBtn':index>0}"
                @click="index===0?addMaterial('Warp'):deleteMaterial('Warp',index)">
                {{index===0?'添加原料':'删除原料'}}
              </div>
              <el-select class="specialSelect"
                v-for="(itemJia,indexJia) in item.array"
                :key="indexJia"
                placeholder="夹"
                v-model="item.array[indexJia]">
                <el-option v-for="item in warpJia"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="specialBtn"
                @click="addMaterialArr('Warp',index)"><i class="el-icon-plus"></i></div>
              <div class="specialBtn"
                @click="deleteMaterialArr('Warp',index)"><i class="el-icon-minus"></i></div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label"
              style="margin-bottom:16px">
              <span class="text">经向排列</span>
              <i class="sliderCtn">
                <span class="text"
                  @click="ifDouble.warp=false"
                  :class="{'active':!ifDouble.warp}">单</span>
                <span class="text"
                  @click="ifDouble.warp=true"
                  :class="{'active':ifDouble.warp}">双</span>
              </i>
              <zh-input v-model="insertNumber.warp"
                type="number"
                class="element"
                placeholder="请输入插入列数">
                <template slot="append">列</template>
              </zh-input>
              <div class="btn btnBlue"
                @click="addCol('warp')">插入</div>
              <zh-input v-model="invertedOrder.warp[0]"
                type="number"
                class="element"
                placeholder="列数">
                <template slot="append">列</template>
              </zh-input>
              <span style="color:#E9E9E9;margin:0 6px">~</span>
              <zh-input v-model="invertedOrder.warp[1]"
                type="number"
                class="element"
                style="margin-left:0"
                placeholder="列数">
                <template slot="append">列</template>
              </zh-input>
              <div class="btn btnBlue"
                @click="invertedCol('warp')">倒序一遍</div>
              <div class="btn btnGray"
                @click="clearTable('warp')">重置</div>
            </div>
            <div class="hotTable">
              <!-- <hot-table :settings="tableData.warp"
                ref="warp"></hot-table> -->
              <div ref="warp"></div>
            </div>
            <div style="color:rgba(0,0,0,0.45)">提示：乘以[ ]遍，最后一遍去掉[ ]列到[ ]列。例如：乘以[4]遍，最后一遍去掉[17]列到[19]列</div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="ifDouble.warp">
          <div class="colCtn">
            <div class="label"
              style="margin-bottom:16px">
              <span class="text">经向反面</span>
              <i class="sliderCtn">
                <span class="text"
                  @click="ifDouble.warp=false"
                  :class="{'active':!ifDouble.warp}">单</span>
                <span class="text"
                  @click="ifDouble.warp=true"
                  :class="{'active':ifDouble.warp}">双</span>
              </i>
              <zh-input v-model="insertNumber.warpBack"
                type="number"
                class="element"
                placeholder="请输入插入列数">
                <template slot="append">列</template>
              </zh-input>
              <div class="btn btnBlue"
                @click="addCol('warpBack')">插入</div>
              <zh-input v-model="invertedOrder.warpBack[0]"
                type="number"
                class="element"
                placeholder="列数">
                <template slot="append">列</template>
              </zh-input>
              <span style="color:#E9E9E9;margin:0 6px">~</span>
              <zh-input v-model="invertedOrder.warpBack[1]"
                type="number"
                class="element"
                style="margin-left:0"
                placeholder="列数">
                <template slot="append">列</template>
              </zh-input>
              <div class="btn btnBlue"
                @click="invertedCol('warpBack')">倒序一遍</div>
              <div class="btn btnGray"
                @click="clearTable('warpBack')">重置</div>
            </div>
            <div class="hotTable">
              <!-- <hot-table :settings="tableData.warpBack"
                ref="warpBack"></hot-table> -->
              <div ref="warpBack"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">整经工艺</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">整经头纹</span>
              <span class="explanation">(根据经向排列自动计算)</span>
            </div>
            <div class="content">
              <el-input placeholder="请输入整经头纹"
                v-model="warpInfo.weft"
                disabled>
                <template slot="append">根</template>
              </el-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">边形</span>
            </div>
            <div class="content">
              <el-select v-model="warpInfo.side_id"
                placeholder="请选择边型">
                <el-option v-for="item in sideArr"
                  :key="item.id"
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
              <span class="text">整经门幅</span>
            </div>
            <div class="content">
              <zh-input placeholder="请输入整经门幅"
                type="number"
                v-model="warpInfo.width">
                <template slot="append">cm</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">机型</span>
            </div>
            <div class="content">
              <el-select v-model="warpInfo.machine_id"
                placeholder="请选择机型">
                <el-option v-for="item in modeleArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">穿综筘工艺</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">筘号</span>
            </div>
            <div class="content">
              <zh-input placeholder="请输入筘号"
                type="number"
                v-model="warpInfo.reed">
                <template slot="append">筘</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">穿筘法</span>
            </div>
            <div class="content">
              <zh-input placeholder="请输入穿筘法"
                type="number"
                v-model="warpInfo.reed_method">
                <template slot="append">根/筘</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">综页</span>
            </div>
            <div class="content">
              <zh-input placeholder="请输入综页"
                type="number"
                v-model="warpInfo.sum_up">
                <template slot="append">页</template>
              </zh-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">筘幅</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-input placeholder="由筘幅说明计算得到"
                disabled
                v-model="warpInfo.reed_width">
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
          <div class="colCtn flex1">
            <div class="label">
              <span class="text">筘幅说明</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content"
              style="display:flex">
              <zh-input style="flex:0.5;margin-right:15px"
                placeholder="左边"
                v-model="warpInfo.reed_width_data[0]"
                @input="cmpReedWidth">
                <template slot="append">cm</template>
              </zh-input>
              <zh-input style="flex:1;margin-right:15px"
                placeholder="中间"
                v-model="warpInfo.reed_width_data[1]"
                @input="cmpReedWidth">
                <template slot="append">cm</template>
              </zh-input>
              <zh-input style="flex:0.5;"
                placeholder="右边"
                v-model="warpInfo.reed_width_data[2]"
                @input="cmpReedWidth">
                <template slot="append">cm</template>
              </zh-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">穿综法</span>
              <span class="explanation">(点击小图标可以将本次穿综法保存为常用)</span>
            </div>
            <div class="content">
              <el-select v-model="commonPM"
                @change="getPM"
                placeholder="请选择常用穿综法">
                <el-option v-for="item in commonPMArr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
                  <div style="display: flex;justify-content: space-between;width: 100%;">
                    <span>{{ item.name }}</span>
                    <span @click.stop="deleteCommonPM(item.id)"
                      class="select_del">x</span>
                  </div>
                </el-option>
              </el-select>
              <el-tooltip class="item"
                effect="dark"
                content="保存本次穿综法到常用"
                placement="top">
                <div @click="savePM"
                  class="tips">
                  <i class="el-icon-upload"></i>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">纹版图</span>
              <i class="sliderCtn">
                <span class="text"
                  :class="{'active':GLFlag==='normal'}"
                  @click="GLFlag = 'normal'">普通</span>
                <span class="text"
                  :class="{'active':GLFlag==='complex'}"
                  @click="GLFlag = 'complex'">高级</span>
              </i>
              <div class="btn btnBlue"
                v-show="GLFlag === 'complex'"
                style="margin-left:16px"
                @click="addGL">添加纹版</div>
            </div>
            <div class="GLCtn"
              v-for="(item1,index1) in GL"
              :key="index1">
              <div class="mark">{{alphabet[index1]}}：</div>
              <div v-for="(item2,index2) in item1"
                :key="index2"
                class="deltaCtn">
                <div class="leftCtn">
                  <span>{{index2+1}}</span>
                </div>
                <div class="rightCtn">
                  <el-input placeholder="数字间用逗号分隔"
                    v-model="item2[0]"></el-input>
                  <el-input placeholder="数字间用逗号分隔"
                    v-model="item2[1]"></el-input>
                  <el-input placeholder="非必填项"
                    v-model="item2[2]"></el-input>
                </div>
              </div>
              <div class="specialBtn position"
                @click="addGLChildren(index1)">
                <i class="el-icon-plus"></i>
              </div>
              <div class="specialBtn position"
                @click="deleteGLChildren(index1)"
                v-show="item1.length>1">
                <i class="el-icon-minus"></i>
              </div>
              <div v-show="GLFlag==='complex'"
                class="specialBtn position"
                @click="deleteGL(index1)"
                style="border:0">
                <i class="el-icon-delete"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">纹版图循环</span>
              <span class="explanation">(序号填写请以纹版图的序号为准))</span>
            </div>
            <div style="position:relative"
              v-for="(item,index) in GLRepeat"
              :key="index">
              <div style="position:absolute;line-height:32px;color:rgba(0,0,0,0.65)">{{alphabet[index]}}：</div>
              <div style="display:block;padding-left:32px;margin:12px 0"
                v-for="(itemChild,indexChild) in item"
                :key="indexChild">
                <zh-input style="width:70px;text-align:center"
                  placeholder="序号"
                  type="number"
                  v-model="itemChild.start">
                </zh-input>
                <span style="margin:0 20px;color:#666">到</span>
                <zh-input style="width:70px;text-align:center"
                  placeholder="序号"
                  type="number"
                  v-model="itemChild.end">
                </zh-input>
                <span style="margin:0 20px;color:#666">✖</span>
                <zh-input style="width:100px;text-align:center"
                  placeholder="遍数"
                  type="number"
                  v-model="itemChild.repeat">
                  <template slot="append">遍</template>
                </zh-input>
                <div class="specialBtn position"
                  @click="addGLrepeat(index)">
                  <i class="el-icon-plus"></i>
                </div>
                <div class="specialBtn position"
                  @click="deleteGLrepeat(index,indexChild)">
                  <i class="el-icon-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">穿综循环</span>
              <i class="sliderCtn">
                <span class="text"
                  :class="{'active':PMFlag==='normal'}"
                  @click="PMFlag = 'normal'">普通</span>
                <span class="text"
                  :class="{'active':PMFlag==='complex'}"
                  @click="PMFlag = 'complex'">高级</span>
              </i>
              <div class="btn btnBlue"
                style="margin-left:16px"
                @click="addPM">添加循环</div>
            </div>
            <div class="treeCtn">
              <div class="node"
                v-for="(item1,index1) in repeatPM"
                :key="index1">
                <div class="numbers">{{romanNum[index1]}}</div>
                <div class="lineCol"
                  v-show="PMFlag === 'complex'"></div>
                <div class="deleteBtn"
                  @click="deletePM(index1)">删除</div>
                <div class="nodeBox">
                  <div class="box box1">
                    <el-input v-if="PMFlag === 'normal'"
                      placeholder="根数"
                      v-model="item1.number">
                    </el-input>
                    <el-input v-if="PMFlag === 'complex'"
                      placeholder="总数"
                      v-model="item1.total"
                      disabled>
                    </el-input>
                    <em class="unit right">根</em>
                  </div>
                  <div class="box box2">
                    <div class="lines">
                      <div class="line1">
                        <el-input v-if="PMFlag === 'normal'"
                          placeholder="穿综循环"
                          v-model="item1.value">
                        </el-input>
                      </div>
                      <div class="line2">
                        <em class="unit left">×</em>
                        <el-input style="padding-left:5px;box-sizing:border-box;"
                          placeholder="遍数"
                          v-model="item1.repeat">
                        </el-input>
                        <em class="unit right">遍</em>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="nodeBtn"
                  v-show="PMFlag === 'complex'"
                  @click="addPMChild(index1)"
                  style="border:0;background:#1A95FF;color:#fff;height:26px;margin-top:4px;;line-height:26px;width:26px">
                  <i class="el-icon-plus"></i>
                </div>
                <div class="nodeChild"
                  v-show="PMFlag === 'complex'"
                  v-for="(item2,index2) in item1.children"
                  :key="index2">
                  <div class="nodeBox">
                    <div class="lineRow"></div>
                    <div class="nodeBtn deleteBtn"
                      @click="deletePMChild(index1,index2)">
                      <i class="el-icon-minus"></i>
                    </div>
                    <div class="box box1">
                      <el-input placeholder="根数"
                        v-model="item2.number">
                      </el-input>
                      <em class="unit right">根</em>
                    </div>
                    <div class="box box2">
                      <div class="lines"
                        v-for="(item3,index3) in item2.children"
                        :key="index3">
                        <div class="line1">
                          <el-input placeholder="穿综循环"
                            v-model="item3.value">
                          </el-input>
                        </div>
                        <div class="line2">
                          <em class="unit left">×</em>
                          <el-input style="padding-left:5px;box-sizing:border-box;"
                            placeholder="遍数"
                            v-model="item3.repeat">
                          </el-input>
                          <em class="unit right">遍</em>
                        </div>
                        <div class="oprText"
                          :class="{'add':index3===0,'delete':index3>0}"
                          @click="index3>0?deletePMLine(index1,index2,index3):addPMLine(index1,index2)">{{index3>0?'删除行':'新增行'}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">穿综备注</span>
            </div>
            <div class="content">
              <el-input v-model="remarkPM"
                placeholder="请输入备注信息"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">织造工艺</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">组织法</span>
            </div>
            <div class="content">
              <el-select v-model="weftInfo.organization_id"
                placeholder="请选择组织法">
                <el-option v-for="item in methodArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">机上坯幅</span>
            </div>
            <div class="content">
              <zh-input type="number"
                v-model="weftInfo.peifu"
                placeholder="请输入机上坯幅">
                <template slot="append">cm</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">坯幅说明</span>
            </div>
            <div class="content">
              <zh-input v-model="weftInfo.peifu_data"
                placeholder="请输入坯幅说明">
              </zh-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">上齿牙</span>
            </div>
            <div class="content">
              <zh-input v-model="weftInfo.shangchiya"
                placeholder="请输入上齿牙">
                <template slot="append">牙</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">下齿牙</span>
            </div>
            <div class="content">
              <zh-input v-model="weftInfo.xiachiya"
                placeholder="请输入上齿牙">
                <template slot="append">牙</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">纬密</span>
              <span class="explanation">(根据纬向排列自动计算)</span>
            </div>
            <div class="content">
              <el-input v-model="weimi"
                disabled
                placeholder="请输入纬密">
                <template slot="append">梭/cm</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">让位说明</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <zh-input type="number"
                v-model="weftInfo.neichang"
                placeholder="请输入内长">
                <template slot="prepend">内长</template>
                <template slot="append">cm</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
            </div>
            <div class="content">
              <zh-input type="number"
                v-model="weftInfo.rangwei"
                placeholder="请输入让位">
                <template slot="prepend">让位</template>
                <template slot="append">cm</template>
              </zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <div class="label">
            </div>
            <div class="content">
              <el-input v-model="weftInfo.total"
                disabled
                placeholder="待计算">
                <template slot="prepend">总计</template>
                <template slot="append">梭</template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">原料纬向</span>
        <span class="opr"
          @click="synchro">同步经向配色和原料</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="rowCtn"
          v-for="(item,index) in colour"
          :key="index">
          <div class="colCtn">
            <div class="label"
              v-if="index===0">
              <span class="text">配色方案</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content"
              style="height:auto">
              <div style="height:32px;display:inline-block">
                <el-select v-model="item.value"
                  class="element"
                  style="margin-bottom:16px">
                  <el-option v-for="item in colourArr"
                    :key="item.id"
                    :label="item.color_name"
                    :value="item.color_id"></el-option>
                </el-select>
              </div>
              <div class="editBtn"
                style="margin-bottom:16px;margin-right:16px"
                :class="{'addBtn':index===0,'deleteBtn':index>0}"
                @click="index===0?addColour():deleteColour(index)">
                {{index===0?'添加配色':'删除配色'}}
              </div>
              <div v-if="index===0"
                class="editBtn deleteBtn"
                style="margin-bottom:16px;margin-right:16p;margin-left:0"
                @click="deleteColour(index)">删除配色</div>
              <color-picker style="margin-bottom:16px"
                v-for="(itemColor,indexColor) in item.colorWeft"
                :key="indexColor + (itemColor.color?itemColor.color:0)"
                v-model="item.colorWeft[indexColor]"
                :content="filterMethods(indexColor)"
                :colorArr="colorArr">
              </color-picker>
              <div class="specialBtn"
                style="margin-bottom:16px"
                @click="addColor('colorWeft')"><i class="el-icon-plus"></i></div>
              <div class="specialBtn"
                style="margin-bottom:16px"
                @click="deleteColor('colorWeft')"><i class="el-icon-minus"></i></div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">
              <span class="text">主要原料</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input"
                v-model="yarn.yarnWeft"
                :fetch-suggestions="searchYarn"
                placeholder="请输入主要原料">
              </el-autocomplete>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in yarn.yarnOtherWeft"
          :key="'yarn'+index">
          <div class="colCtn">
            <div class="label"
              v-if="index===0">
              <span class="text">次要原料</span>
            </div>
            <div class="content">
              <el-autocomplete class="inline-input element"
                clearable
                v-model="yarn.yarnOtherWeft[index].value"
                :fetch-suggestions="searchYarn"
                placeholder="请输入次要原料">
              </el-autocomplete>
              <div class="editBtn"
                :class="{'addBtn':index===0,'deleteBtn':index>0}"
                @click="index===0?addYarn('Weft'):deleteYarn('Weft',index)">
                {{index===0?'添加原料':'删除原料'}}
              </div>
              <el-select class="specialSelect"
                v-for="(itemJia,indexJia) in item.array"
                :key="indexJia"
                placeholder="夹"
                v-model="item.array[indexJia]">
                <el-option v-for="item in weftJia"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="specialBtn"
                @click="addYarnArr('Weft',index)"><i class="el-icon-plus"></i></div>
              <div class="specialBtn"
                @click="deleteYarnArr('Weft',index)"><i class="el-icon-minus"></i></div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in material.materialWeft"
          :key="'material'+index">
          <div class="colCtn">
            <div class="label"
              v-if="index===0">
              <span class="text">辅助原料</span>
            </div>
            <div class="content">
              <el-input class="element"
                clearable
                style="width:172px"
                v-model="material.materialWeft[index].value"
                placeholder="请输入辅助原料"></el-input>
              <el-input class="element"
                style="width:172px;margin-left:16px"
                v-model="material.materialWeft[index].number"
                placeholder="请输入数量"></el-input>
              <div class="editBtn"
                :class="{'addBtn':index===0,'deleteBtn':index>0}"
                @click="index===0?addMaterial('Weft'):deleteMaterial('Weft',index)">
                {{index===0?'添加原料':'删除原料'}}
              </div>
              <el-select class="specialSelect"
                v-for="(itemJia,indexJia) in item.array"
                :key="indexJia"
                placeholder="夹"
                v-model="item.array[indexJia]">
                <el-option v-for="item in weftJia"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="specialBtn"
                @click="addMaterialArr('Weft',index)"><i class="el-icon-plus"></i></div>
              <div class="specialBtn"
                @click="deleteMaterialArr('Weft',index)"><i class="el-icon-minus"></i></div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label"
              style="margin-bottom:16px">
              <span class="text">纬向排列</span>
              <i class="sliderCtn">
                <span class="text"
                  @click="ifDouble.weft=false"
                  :class="{'active':!ifDouble.weft}">单</span>
                <span class="text"
                  @click="ifDouble.weft=true"
                  :class="{'active':ifDouble.weft}">双</span>
              </i>
              <zh-input v-model="insertNumber.weft"
                type="number"
                class="element"
                placeholder="请输入插入列数">
                <template slot="append">列</template>
              </zh-input>
              <div class="btn btnBlue"
                @click="addCol('weft')">插入</div>
              <zh-input v-model="invertedOrder.weft[0]"
                type="number"
                class="element"
                placeholder="列数">
                <template slot="append">列</template>
              </zh-input>
              <span style="color:#E9E9E9;margin:0 6px">~</span>
              <zh-input v-model="invertedOrder.weft[1]"
                type="number"
                class="element"
                style="margin-left:0"
                placeholder="列数">
                <template slot="append">列</template>
              </zh-input>
              <div class="btn btnBlue"
                @click="invertedCol('weft')">倒序一遍</div>
              <div class="btn btnGray"
                @click="clearTable('weft')">重置</div>
            </div>
            <div class="hotTable">
              <!-- <hot-table :settings="tableData.weft"
                ref="weft"></hot-table> -->
              <div ref="weft"></div>
            </div>
            <div style="color:rgba(0,0,0,0.45)">提示：乘以[ ]遍，最后一遍去掉[ ]列到[ ]列。例如：乘以[4]遍，最后一遍去掉[17]列到[19]列</div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="ifDouble.weft">
          <div class="colCtn">
            <div class="label"
              style="margin-bottom:16px">
              <span class="text">经向反面</span>
              <i class="sliderCtn">
                <span class="text"
                  @click="ifDouble.weft=false"
                  :class="{'active':!ifDouble.weft}">单</span>
                <span class="text"
                  @click="ifDouble.weft=true"
                  :class="{'active':ifDouble.weft}">双</span>
              </i>
              <zh-input v-model="insertNumber.weftBack"
                type="number"
                class="element"
                placeholder="请输入插入列数">
                <template slot="append">列</template>
              </zh-input>
              <div class="btn btnBlue"
                @click="addCol('weftBack')">插入</div>
              <zh-input v-model="invertedOrder.weftBack[0]"
                type="number"
                class="element"
                placeholder="列数">
                <template slot="append">列</template>
              </zh-input>
              <span style="color:#E9E9E9;margin:0 6px">~</span>
              <zh-input v-model="invertedOrder.weftBack[1]"
                type="number"
                class="element"
                style="margin-left:0"
                placeholder="列数">
                <template slot="append">列</template>
              </zh-input>
              <div class="btn btnBlue"
                @click="invertedCol('weftBack')">倒序一遍</div>
              <div class="btn btnGray"
                @click="clearTable('weftBack')">重置</div>
            </div>
            <div class="hotTable">
              <!-- <hot-table :settings="tableData.weftBack"
                ref="weftBack"></hot-table> -->
              <div ref="weftBack"></div>
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
              <span class="text">选择纬向克重机算公式</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="content"
              style="line-height:32px">
              <el-radio v-model="weftCmp"
                label="1">根数*筘幅</el-radio>
              <el-radio v-model="weftCmp"
                label="2">根数*机上坯幅</el-radio>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">工艺单名称</span>
            </div>
            <div class="content">
              <el-input v-model="ZDYMC"
                placeholder="请输入工艺单名称"></el-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">大身规格</span>
            </div>
            <div class="content">
              <el-input v-model="DSGG"
                placeholder="请输入大身规格">
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
          <div class="colCtn">
            <div class="label">
              <span class="text">大身克重</span>
            </div>
            <div class="content">
              <el-input v-model="DSKZ"
                placeholder="请输入大身克重">
                <template slot="append">g</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(item,index) in allMaterial"
          :key="index">
          <div class="colCtn">
            <div class="label"
              v-if="index===0">
              <span class="text">物料系数/穿筘法</span>
            </div>
            <div class="content"
              style="display:flex">
              <zh-input style="flex:1.2;margin-right:12px"
                v-model="coefficient[index]"
                type="number"
                placeholder="请输入物料系数">
                <template slot="prepend">{{item.name}}</template>
                <template slot="append">g/m</template>
              </zh-input>
              <el-input style="flex:1"
                v-model="chuankouDetail[index]"
                :disabled="!item.hasCK"
                placeholder="请输入穿筘法,默认为经向穿筘法">
                <template slot="append">根/筘</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="content">
              <el-input v-model="desc"
                placeholder="请输入备注信息"></el-input>
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
          <div class="btn btnOrange"
            @click="submit('草稿')">保存为草稿</div>
          <div class="btn btnBlue"
            @click="submit">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/handsontable@7.3.0/dist/handsontable.full.min.js"></script>
<script>
import { yarn, yarnColor, material, craftConfig, penetrationMethod, craft } from '@/assets/js/api.js'
import enCH from '@/assets/js/language.js'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
Handsontable.languages.registerLanguageDictionary(enCH) // 注册中文字典
export default {
  data () {
    return {
      weftCmp: '1',
      loading: true,
      ZDYMC: '',
      DSGG: '',
      DSKZ: '',
      loadingS: false,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      craftId: '', // 修改工艺单的时候用
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
        size: [],
        name: ''
      },
      colourArr: [],
      methodArr: [],
      method: '',
      sideArr: [],
      side: '',
      modeleArr: [],
      model: '',
      material: {
        materialArr: [{
          name: '金丝'
        }, {
          name: '银丝'
        }],
        materialWarp: [{
          value: '',
          number: '',
          array: ['']
        }],
        materialWeft: [{
          value: '',
          number: '',
          array: ['']
        }]
      },
      yarn: {
        yarnArr: [],
        yarnWarp: '',
        yarnWeft: '',
        yarnOtherWarp: [{
          value: '',
          array: ['']
        }],
        yarnOtherWeft: [{
          value: '',
          array: ['']
        }]
      },
      colorArr: [],
      colour: [{
        value: '',
        colorWeft: [],
        colorWarp: []
      }],
      tableData: {
        warp: {
          data: [
            [1],
            [null],
            [null],
            [null],
            [null],
            [null]
          ],
          rowHeaders: (index) => {
            let headerArr = ['序号', '主/夹', '根数', '合并项', '合并项', '穿综法']
            return `<div style="height:38px;line-height:38px;color:rgba(0,0,0,0.65);display:table-row">${headerArr[index]}</div>`
          },
          rowHeaderWidth: 80,
          minCols: 1,
          autoColumnSize: true, // 自适应宽度
          cells: (row, col, prop) => {
            var cellProperties = {}
            if (row === 0) {
              cellProperties.readOnly = true
            }
            if (row === 1) {
              cellProperties.type = 'dropdown'
              cellProperties.source = this.warpJia.map(item => item.label)
            }
            if (row === 5) {
              cellProperties.type = 'dropdown'
              cellProperties.source = this.PMArr
            }
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
              // 清空节点并重新渲染
              Handsontable.dom.empty(td)
              let node = document.createElement('DIV')
              let CSS = td.style
              node.innerText = value
              td.appendChild(node)
              // 设置样式
              CSS.color = 'rgba(0,0,0,0.65)'
              CSS.width = '38px'
              CSS.height = '38px'
              CSS.lineHeight = '38px'
              CSS.textAlign = 'center'
              if (row === 0) {
                CSS.background = '#E9E9E9'
              }
              return td
            }
            return cellProperties
          },
          contextMenu: [
            'mergeCells', // 合并单元格菜单
            'col_right',
            'col_left',
            'copy',
            '粘贴(Ctrl + V)',
            'undo',
            'redo',
            'remove_col'
          ],
          className: 'handsontable',
          number: 1,
          afterCreateCol: (index, amount) => {
            this.tableData.warp.number++
            for (let i = 0; i < this.tableData.warp.number; i++) {
              this.tableData.warp.data[0][i] = i + 1
            }
          },
          afterRemoveCol: (index, amount) => {
            this.tableData.warp.number--
            for (let i = 0; i < this.tableData.warp.number; i++) {
              this.tableData.warp.data[0][i] = i + 1
            }
          },
          afterChange: (changes, opt) => {
            // 计算整经头文
            if (opt === 'edit') {
              let warpTable = this.getFlatTable(this.tableData.warp.data.map((item, index) => {
                if (index === 1) {
                  return item.map((itemJia) => {
                    return this.warpJia.find((itemFind) => itemFind.label === itemJia) ? this.warpJia.find((itemFind) => itemFind.label === itemJia).value : ''
                  })
                } else {
                  if (item.length === this.tableData.warp.number) {
                    return item
                  } else {
                    for (let i = 0; i < this.tableData.warp.number; i++) {
                      item[i] = item[i] || null
                    }
                    return item
                  }
                }
              }), 'warp')
              let warpTableBack = this.getFlatTable(this.tableData.warpBack.data.map((item, index) => {
                if (index === 1) {
                  return item.map((itemJia) => {
                    return this.warpJia.find((itemFind) => itemFind.label === itemJia) ? this.warpJia.find((itemFind) => itemFind.label === itemJia).value : ''
                  })
                } else {
                  if (item.length === this.tableData.warpBack.number) {
                    return item
                  } else {
                    for (let i = 0; i < this.tableData.warpBack.number; i++) {
                      item[i] = item[i] || null
                    }
                    return item
                  }
                }
              }), 'warpBack')
              let sum = 0
              warpTable.forEach((item, index) => {
                sum += Number(item.number)
              })
              warpTableBack.forEach((item, index) => {
                sum += Number(item.number)
              })
              this.warpInfo.weft = sum
            }
          },
          licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
          mergeCells: true,
          width: '100%',
          height: 250
        },
        warpBack: {
          data: [
            [1],
            [null],
            [null],
            [null],
            [null],
            [null]
          ],
          rowHeaders: (index) => {
            let headerArr = ['序号', '主/夹', '根数', '合并项', '合并项', '穿综法']
            return `<div style="height:38px;line-height:38px;color:rgba(0,0,0,0.65);display:table-row">${headerArr[index]}</div>`
          },
          rowHeaderWidth: 80,
          minCols: 1,
          autoColumnSize: true, // 自适应宽度
          cells: (row, col, prop) => {
            var cellProperties = {}
            if (row === 0) {
              cellProperties.readOnly = true
            }
            if (row === 1) {
              cellProperties.type = 'dropdown'
              cellProperties.source = this.warpJia.map(item => item.label)
            }
            if (row === 5) {
              cellProperties.type = 'dropdown'
              cellProperties.source = this.PMArr
            }
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
              // 清空节点并重新渲染
              Handsontable.dom.empty(td)
              let node = document.createElement('DIV')
              let CSS = td.style
              node.innerText = value
              td.appendChild(node)
              // 设置样式
              CSS.color = 'rgba(0,0,0,0.65)'
              CSS.width = '38px'
              CSS.height = '38px'
              CSS.lineHeight = '38px'
              CSS.textAlign = 'center'
              if (row === 0) {
                CSS.background = '#E9E9E9'
              }
              return td
            }
            return cellProperties
          },
          contextMenu: [
            'mergeCells', // 合并单元格菜单
            'col_right',
            'col_left',
            'copy',
            '粘贴(Ctrl + V)',
            'undo',
            'redo',
            'remove_col'
          ],
          className: 'handsontable',
          number: 1,
          afterCreateCol: (index, amount) => {
            this.tableData.warpBack.number++
            for (let i = 0; i < this.tableData.warpBack.number; i++) {
              this.tableData.warpBack.data[0][i] = i + 1
            }
          },
          afterRemoveCol: (index, amount) => {
            this.tableData.warpBack.number--
            for (let i = 0; i < this.tableData.warpBack.number; i++) {
              this.tableData.warpBack.data[0][i] = i + 1
            }
          },
          afterChange: (changes, opt) => {
            // 计算整经头文
            if (opt === 'edit') {
              let warpTable = this.getFlatTable(this.tableData.warp.data.map((item, index) => {
                if (index === 1) {
                  return item.map((itemJia) => {
                    return this.warpJia.find((itemFind) => itemFind.label === itemJia) ? this.warpJia.find((itemFind) => itemFind.label === itemJia).value : ''
                  })
                } else {
                  if (item.length === this.tableData.warp.number) {
                    return item
                  } else {
                    for (let i = 0; i < this.tableData.warp.number; i++) {
                      item[i] = item[i] || null
                    }
                    return item
                  }
                }
              }), 'warp')
              let warpTableBack = this.getFlatTable(this.tableData.warpBack.data.map((item, index) => {
                if (index === 1) {
                  return item.map((itemJia) => {
                    return this.warpJia.find((itemFind) => itemFind.label === itemJia) ? this.warpJia.find((itemFind) => itemFind.label === itemJia).value : ''
                  })
                } else {
                  if (item.length === this.tableData.warpBack.number) {
                    return item
                  } else {
                    for (let i = 0; i < this.tableData.warpBack.number; i++) {
                      item[i] = item[i] || null
                    }
                    return item
                  }
                }
              }), 'warpBack')
              let sum = 0
              warpTable.forEach((item, index) => {
                sum += Number(item.number)
              })
              warpTableBack.forEach((item, index) => {
                sum += Number(item.number)
              })
              this.warpInfo.weft = sum
            }

          },
          licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
          mergeCells: true,
          width: '100%',
          height: 250
        },
        weft: {
          data: [
            [1],
            [null],
            [null],
            [null],
            [null],
            [null]
          ],
          rowHeaders: (index) => {
            let headerArr = ['序号', '主/夹', '根数', '合并项', '合并项', '纹版图']
            return `<div style="height:38px;line-height:38px;color:rgba(0,0,0,0.65);display:table-row">${headerArr[index]}</div>`
          },
          rowHeaderWidth: 80,
          minCols: 1,
          autoColumnSize: true, // 自适应宽度
          cells: (row, col, prop) => {
            var cellProperties = {}
            if (row === 0) {
              cellProperties.readOnly = true
            }
            if (row === 1) {
              cellProperties.type = 'dropdown'
              cellProperties.source = this.weftJia.map(item => item.label)
            }
            if (row === 5) {
              cellProperties.type = 'dropdown'
              cellProperties.source = this.GLArr
            }
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
              // 清空节点并重新渲染
              Handsontable.dom.empty(td)
              let node = document.createElement('DIV')
              let CSS = td.style
              node.innerText = value
              td.appendChild(node)
              // 设置样式
              CSS.color = 'rgba(0,0,0,0.65)'
              CSS.width = '38px'
              CSS.height = '38px'
              CSS.lineHeight = '38px'
              CSS.textAlign = 'center'
              if (row === 0) {
                CSS.background = '#E9E9E9'
              }
              return td
            }
            return cellProperties
          },
          contextMenu: [
            'mergeCells', // 合并单元格菜单
            'col_right',
            'col_left',
            'copy',
            '粘贴(Ctrl + V)',
            'undo',
            'redo',
            'remove_col'
          ],
          className: 'handsontable',
          number: 1,
          afterCreateCol: (index, amount) => {
            this.tableData.weft.number++
            for (let i = 0; i < this.tableData.weft.number; i++) {
              this.tableData.weft.data[0][i] = i + 1
            }
          },
          afterRemoveCol: (index, amount) => {
            this.tableData.weft.number--
            for (let i = 0; i < this.tableData.weft.number; i++) {
              this.tableData.weft.data[0][i] = i + 1
            }
          },
          afterChange: (changes, opt) => {
            // 计算纬向总计
            if (opt === 'edit') {
              let weftTable = this.getFlatTable(this.tableData.weft.data.map((item, index) => {
                if (index === 1) {
                  return item.map((itemJia) => {
                    return this.weftJia.find((itemFind) => itemFind.label === itemJia) ? this.weftJia.find((itemFind) => itemFind.label === itemJia).value : ''
                  })
                } else {
                  if (item.length === this.tableData.weft.number) {
                    return item
                  } else {
                    for (let i = 0; i < this.tableData.weft.number; i++) {
                      item[i] = item[i] || null
                    }
                    return item
                  }
                }
              }), 'weft')
              let weftBackTable = this.getFlatTable(this.tableData.weftBack.data.map((item, index) => {
                if (index === 1) {
                  return item.map((itemJia) => {
                    return this.weftJia.find((itemFind) => itemFind.label === itemJia) ? this.weftJia.find((itemFind) => itemFind.label === itemJia).value : ''
                  })
                } else {
                  if (item.length === this.tableData.weftBack.number) {
                    return item
                  } else {
                    for (let i = 0; i < this.tableData.weftBack.number; i++) {
                      item[i] = item[i] || null
                    }
                    return item
                  }
                }
              }), 'weftBack')
              let sum = 0
              weftTable.forEach((item, index) => {
                sum += Number(item.number)
              })
              weftBackTable.forEach((item, index) => {
                sum += Number(item.number)
              })
              this.weftInfo.total = sum
            }
          },
          licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
          mergeCells: true,
          width: '100%',
          height: 250
        },
        weftBack: {
          data: [
            [1],
            [null],
            [null],
            [null],
            [null],
            [null]
          ],
          rowHeaders: (index) => {
            let headerArr = ['序号', '主/夹', '根数', '合并项', '合并项', '纹版图']
            return `<div style="height:38px;line-height:38px;color:rgba(0,0,0,0.65);display:table-row">${headerArr[index]}</div>`
          },
          rowHeaderWidth: 80,
          minCols: 1,
          autoColumnSize: true, // 自适应宽度
          cells: (row, col, prop) => {
            var cellProperties = {}
            if (row === 0) {
              cellProperties.readOnly = true
            }
            if (row === 1) {
              cellProperties.type = 'dropdown'
              cellProperties.source = this.weftJia.map(item => item.label)
            }
            if (row === 5) {
              cellProperties.type = 'dropdown'
              cellProperties.source = this.GLArr
            }
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
              // 清空节点并重新渲染
              Handsontable.dom.empty(td)
              let node = document.createElement('DIV')
              let CSS = td.style
              node.innerText = value
              td.appendChild(node)
              // 设置样式
              CSS.color = 'rgba(0,0,0,0.65)'
              CSS.width = '38px'
              CSS.height = '38px'
              CSS.lineHeight = '38px'
              CSS.textAlign = 'center'
              if (row === 0) {
                CSS.background = '#E9E9E9'
              }
              return td
            }
            return cellProperties
          },
          contextMenu: [
            'mergeCells', // 合并单元格菜单
            'col_right',
            'col_left',
            'copy',
            '粘贴(Ctrl + V)',
            'undo',
            'redo',
            'remove_col'
          ],
          className: 'handsontable',
          number: 1,
          afterCreateCol: (index, amount) => {
            this.tableData.weftBack.number++
            for (let i = 0; i < this.tableData.weftBack.number; i++) {
              this.tableData.weftBack.data[0][i] = i + 1
            }
          },
          afterRemoveCol: (index, amount) => {
            this.tableData.weftBack.number--
            for (let i = 0; i < this.tableData.weftBack.number; i++) {
              this.tableData.weftBack.data[0][i] = i + 1
            }
          },
          afterChange: (changes, opt) => {
            // 计算纬向总计
            if (opt === 'edit') {
              let weftTable = this.getFlatTable(this.tableData.weft.data.map((item, index) => {
                if (index === 1) {
                  return item.map((itemJia) => {
                    return this.weftJia.find((itemFind) => itemFind.label === itemJia) ? this.weftJia.find((itemFind) => itemFind.label === itemJia).value : ''
                  })
                } else {
                  if (item.length === this.tableData.weft.number) {
                    return item
                  } else {
                    for (let i = 0; i < this.tableData.weft.number; i++) {
                      item[i] = item[i] || null
                    }
                    return item
                  }
                }
              }), 'weft')
              let weftBackTable = this.getFlatTable(this.tableData.weftBack.data.map((item, index) => {
                if (index === 1) {
                  return item.map((itemJia) => {
                    return this.weftJia.find((itemFind) => itemFind.label === itemJia) ? this.weftJia.find((itemFind) => itemFind.label === itemJia).value : ''
                  })
                } else {
                  if (item.length === this.tableData.weftBack.number) {
                    return item
                  } else {
                    for (let i = 0; i < this.tableData.weftBack.number; i++) {
                      item[i] = item[i] || null
                    }
                    return item
                  }
                }
              }), 'weftBack')
              let sum = 0
              weftTable.forEach((item, index) => {
                sum += Number(item.number)
              })
              weftBackTable.forEach((item, index) => {
                sum += Number(item.number)
              })
              this.weftInfo.total = sum
            }
          },
          licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
          mergeCells: true,
          width: '100%',
          height: 250
        }
      },
      tableHot: {
        warp: '',
        warpBack: '',
        weft: '',
        weftBack: '',
      },
      warpInfo: {
        weft: null, // 总头纹
        side_id: null, // 边形
        width: null, // 整经门幅
        machine_id: null, // 机型
        reed: null, // 筘号
        reed_method: null, // 穿筘法
        reed_width: null, // 筘幅
        reed_width_data: ['', '', ''], // 筘幅说明
        sum_up: null, // 综页
        drafting_method: null // 穿综法
        // additional_data: null// 穿综法备注
      },
      weftInfo: {
        organization_id: null, // 组织法
        peifu: null, // 胚服
        peifu_data: null, // 胚幅说明
        weimi: null, // 纬密
        shangchiya: null, // 上齿牙
        xiachiya: null, // 下齿牙
        neichang: null, // 内长
        rangwei: null, // 让位
        total: null // 总计
      },
      // PM:penetration method 穿综法缩写
      commonPMArr: [],
      commonPM: '',
      PMFlag: 'normal',
      repeatPM: [{
        value: '', // 循环的值，用逗号分割
        repeat: '', // 循环次数
        number: '', // 纱线根数
        GL: '', // 高级穿综法选纹版图
        total: 0, // 高级穿综法统计值
        children: [{
          number: '',
          children: [{
            value: '',
            repeat: ''
          }]
        }]
      }],
      remarkPM: '',
      GLRepeat: [[{
        start: '',
        end: '',
        repeat: ''
      }]],
      // GL:graphic layout 纹版图缩写
      GL: [[['', '', '']]],
      GLFlag: 'normal',
      alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      romanNum: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'],
      // 是否为双面巾
      ifDouble: {
        warp: false,
        weft: false
      },
      // 插入列数
      insertNumber: {
        warp: '',
        weft: '',
        warpBack: '',
        weftBack: ''
      },
      // 倒序
      invertedOrder: {
        warp: ['', ''],
        weft: ['', ''],
        warpBack: ['', ''],
        weftBack: ['', '']
      },
      weight: '',
      coefficient: [],
      desc: '',
      // 导入工艺单数据
      gyd: '',
      gydArr: [],
      colorNumber: {
        warp: [],
        weft: []
      },
      colorWeight: {
        warp: [],
        weft: []
      },
      chuankouDetail: []
    }
  },
  watch: {
    // "warpInfo.reed_method": function (newVal) {
    //   this.allMaterial.forEach((item, index) => {
    //     this.chuankouDetail[index] = newVal
    //   })
    // },
    GLFlag (newVal) {
      if (newVal === 'normal') {
        this.GL.length = 1
      }
    },
    repeatPM: {
      handler: function (newVal) {
        if (this.PMFlag === 'complex') {
          newVal.forEach((item) => {
            item.total = item.children.reduce((sum, current) => {
              return sum + Number(current.number)
            }, 0)
          })
        }
      },
      deep: true
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
  computed: {
    warpJia () {
      let maxLen = this.colour[0].colorWarp.length
      let arr = []
      for (let i = 0; i < maxLen; i++) {
        arr.push({
          value: i,
          label: i !== 0 ? '夹' + i : '主'
        })
      }
      return arr
    },
    weftJia () {
      let maxLen = this.colour[0].colorWeft.length
      let arr = []
      for (let i = 0; i < maxLen; i++) {
        arr.push({
          value: i,
          label: i !== 0 ? '夹' + i : '主'
        })
      }
      return arr
    },
    // 统计不重复的物料信息
    allMaterial () {
      let arr = []
      arr.push(this.yarn.yarnWarp)
      arr.push(this.yarn.yarnWeft)
      arr = arr.concat(this.yarn.yarnOtherWarp.map(item => item.value)).concat(this.yarn.yarnOtherWeft.map(item => item.value))
      arr = arr.concat(this.material.materialWarp.map((item) => item.value)).concat(this.material.materialWeft.map(item => item.value))
      return Array.from(new Set(arr)).filter(item => !!item).length > 0 ? Array.from(new Set(arr)).filter(item => !!item).map((item) => {
        return {
          name: item,
          hasCK: !(this.material.materialWarp.find((itemFind) => itemFind.value === item) || this.material.materialWeft.find((itemFind) => itemFind.value === item))
        }
      }) : [{ name: '未选择', hasCK: false }]
    },
    // 纹版图下拉框选项
    GLArr () {
      return new Array(this.GL.length).fill('').map((item, index) => this.alphabet[index])
    },
    // 表格里的纹版图下拉框
    PMArr () {
      return new Array(this.repeatPM.length).fill('').map((item, index) => this.romanNum[index])
    },
    weimi () {
      if (this.weftInfo.neichang) {
        return (this.weftInfo.total / this.weftInfo.neichang).toFixed(2)
      } else {
        return 0
      }
    }
  },
  methods: {
    // 计算下筘幅
    cmpReedWidth () {
      this.warpInfo.reed_width = this.warpInfo.reed_width_data.reduce((total, cur) => {
        return total + (Number(cur) || 0)
      }, 0)
    },
    afterSave (data) {
      this.msgFlag = data.msgFlag
    },
    // 匹配主/夹名称
    filterMethods (index) {
      if (index === 0) {
        return '主'
      } else if (index === null) {
        return ''
      } else {
        return '夹' + index
      }
    },
    addColour () {
      let warpLen = this.colour[0].colorWarp.length
      let weftLen = this.colour[0].colorWeft.length
      let warpArray = new Array(warpLen).fill('')
      let weftArray = new Array(weftLen).fill('')
      this.colour.push({
        value: '',
        colorWeft: JSON.parse(JSON.stringify(weftArray)),
        colorWarp: JSON.parse(JSON.stringify(warpArray))
      })
    },
    deleteColour (index) {
      if (this.colour.length > 1) {
        this.colour.splice(index, 1)
      } else {
        this.$message.error({
          message: '至少有一种配色方案'
        })
      }
    },
    addColor (which) {
      this.colour.forEach((item) => {
        item[which].push('')
      })
    },
    deleteColor (which) {
      if (this.colour[0][which].length > 1) {
        this.colour.forEach((item) => {
          item[which].pop()
        })
      } else {
        this.$message.error({
          message: '至少有一种颜色'
        })
      }
    },
    searchYarn (queryString, cb) {
      let result = queryString ? this.yarn.yarnArr.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.yarn.yarnArr
      cb(result)
    },
    addYarn (type) {
      this.yarn['yarnOther' + type].push({
        value: '',
        array: ['']
      })
    },
    deleteYarn (type, index) {
      this.yarn['yarnOther' + type].splice(index, 1)
    },
    addYarnArr (type, index) {
      this.yarn['yarnOther' + type][index].array.push('')
    },
    deleteYarnArr (type, index) {
      if (this.yarn['yarnOther' + type][index].array.length > 1) {
        this.yarn['yarnOther' + type][index].array.pop()
      } else {
        this.$message.error({
          message: '至少有一个'
        })
      }
    },
    addMaterial (type) {
      this.material['material' + type].push({
        value: '',
        number: '',
        array: ['']
      })
    },
    deleteMaterial (type, index) {
      this.material['material' + type].splice(index, 1)
    },
    addMaterialArr (type, index) {
      this.material['material' + type][index].array.push('')
    },
    deleteMaterialArr (type, index) {
      if (this.material['material' + type][index].array.length > 1) {
        this.material['material' + type][index].array.pop()
      } else {
        this.$message.error({
          message: '至少有一个'
        })
      }
    },
    addGL () {
      this.GL.push([['', '', '']])
      this.GLRepeat.push([{
        start: '',
        end: '',
        repeat: ''
      }])
    },
    deleteGL (index) {
      if (this.GL.length > 1) {
        this.GL.splice(index, 1)
        this.GLRepeat.splice(index, 1)
      } else {
        this.$message.error({
          message: '至少有一个纹版'
        })
      }
    },
    addGLChildren (index) {
      this.GL[index].push(['', '', ''])
    },
    deleteGLChildren (index) {
      if (this.GL[index].length > 1) {
        this.GL[index].pop()
      } else {
        this.$message.error({
          message: '至少有一个纹版'
        })
      }
    },
    addPM () {
      this.repeatPM.push({
        value: '',
        repeat: '',
        number: '',
        total: 0,
        GL: '',
        children: [{
          number: '',
          children: [{
            value: '',
            repeat: ''
          }]
        }]
      })
    },
    deletePM (index) {
      if (this.repeatPM.length > 1) {
        this.repeatPM.splice(index, 1)
      } else {
        this.$message.error({
          message: '至少有一种穿综循环'
        })
      }
    },
    addPMChild (index) {
      this.repeatPM[index].children.push({
        number: '',
        children: [{
          value: '',
          repeat: ''
        }]
      })
    },
    deletePMChild (index, indexChild) {
      if (this.repeatPM[index].children.length > 1) {
        this.repeatPM[index].children.splice(indexChild, 1)
      } else {
        this.$message.error({
          message: '至少有一种穿综循环'
        })
      }
    },
    addPMLine (index, indexChild) {
      this.repeatPM[index].children[indexChild].children.push({
        value: '',
        repeat: ''
      })
    },
    deletePMLine (index, indexChild, indexLine) {
      if (this.repeatPM[index].children[indexChild].children.length > 1) {
        this.repeatPM[index].children[indexChild].children.splice(indexLine, 1)
      } else {
        this.$message.error({
          message: '至少有一行'
        })
      }
    },
    addGLrepeat (index) {
      this.GLRepeat[index].push({
        start: '',
        end: '',
        repeat: ''
      })
    },
    deleteGLrepeat (index, indexChild) {
      this.GLRepeat[index].splice(indexChild, 1)
    },
    // 插入列操作
    addCol (type) {
      if (type === 'warpTable') {
        for (let i = 0; i < this.designData.warp.insertNumber; i++) {
          this.designData.warp.table.data.forEach((item, index) => {
            if (index === 0) {
              item.push(item.length + 1)
            } else {
              item.push('')
            }
          })
          this.designData.warp.table.number++
        }
        this.tableHot.designWarp.loadData(this.designData.warp.table.data)
        return
      }
      if (type === 'warpTableBack') {
        for (let i = 0; i < this.designData.warp.insertNumberBack; i++) {
          this.designData.warp.tableBack.data.forEach((item, index) => {
            if (index === 0) {
              item.push(item.length + 1)
            } else {
              item.push('')
            }
          })
          this.designData.warp.tableBack.number++
        }
        this.tableHot.designWarpBack.loadData(this.designData.warp.tableBack.data)
        return
      }
      if (type === 'weftTable') {
        for (let i = 0; i < this.designData.weft.insertNumber; i++) {
          this.designData.weft.table.data.forEach((item, index) => {
            if (index === 0) {
              item.push(item.length + 1)
            } else {
              item.push('')
            }
          })
          this.designData.weft.table.number++
        }
        this.tableHot.designWeft.loadData(this.designData.weft.table.data)
        return
      }
      if (type === 'weftTableBack') {
        for (let i = 0; i < this.designData.weft.insertNumberBack; i++) {
          this.designData.weft.tableBack.data.forEach((item, index) => {
            if (index === 0) {
              item.push(item.length + 1)
            } else {
              item.push('')
            }
          })
          this.designData.weft.tableBack.number++
        }
        this.tableHot.designWeftBack.loadData(this.designData.weft.tableBack.data)
        return
      }
      if (Number(this.insertNumber[type]) && Number(this.insertNumber[type]) > 0) {
        for (let i = 0; i < Number(this.insertNumber[type]); i++) {
          this.tableData[type].data.forEach((item, index) => {
            if (index === 0) {
              item.push(item.length + 1)
            } else {
              item.push('')
            }
          })
          this.tableData[type].number++
        }
        this.tableHot[type].loadData(this.tableData[type].data)
        // this.$refs[type].hotInstance.loadData(this.tableData[type].data)
      } else {
        this.$message.error({
          message: '请输入正确的正整数'
        })
      }
    },
    // 倒序操作
    invertedCol (type) {
      if (type === 'warpTable') {
        let reverseArr = this.designData.warp.table.data.map((item) => {
          let copy = JSON.parse(JSON.stringify(item))
          return copy.slice(Number(this.designData.warp.invertedOrder1) - 1, Number(this.designData.warp.invertedOrder2)).reverse()
        })
        reverseArr.forEach((item, index) => {
          if (index === 0) {
            for (let i = 0; i < item.length; i++) {
              this.designData.warp.table.number++
              this.designData.warp.table.data[index].push(this.designData.warp.table.number)
            }
          } else {
            this.designData.warp.table.data[index] = this.designData.warp.table.data[index].concat(item)
          }
        })
        // 触发一下表格更新，重新获取数据
        this.tableHot.designWarp.loadData(this.designData.warp.table.data)
        // this.$refs.warpTable.hotInstance.loadData(this.designData.warp.table.data)
        return
      }
      if (type === 'warpTableBack') {
        let reverseArr = this.designData.warp.tableBack.data.map((item) => {
          let copy = JSON.parse(JSON.stringify(item))
          return copy.slice(Number(this.designData.warp.invertedOrderBack1) - 1, Number(this.designData.warp.invertedOrderBack2)).reverse()
        })
        reverseArr.forEach((item, index) => {
          if (index === 0) {
            for (let i = 0; i < item.length; i++) {
              this.designData.warp.tableBack.number++
              this.designData.warp.tableBack.data[index].push(this.designData.warp.tableBack.number)
            }
          } else {
            this.designData.warp.tableBack.data[index] = this.designData.warp.tableBack.data[index].concat(item)
          }
        })
        // 触发一下表格更新，重新获取数据
        this.tableHot.designWeftBack.loadData(this.designData.warp.tableBack.data)
        // this.$refs.warpTableBack.hotInstance.loadData(this.designData.warp.tableBack.data)
        return
      }
      if (type === 'weftTable') {
        let reverseArr = this.designData.weft.table.data.map((item) => {
          let copy = JSON.parse(JSON.stringify(item))
          return copy.slice(Number(this.designData.weft.invertedOrder1) - 1, Number(this.designData.weft.invertedOrder2)).reverse()
        })
        reverseArr.forEach((item, index) => {
          if (index === 0) {
            for (let i = 0; i < item.length; i++) {
              this.designData.weft.table.number++
              this.designData.weft.table.data[index].push(this.designData.weft.table.number)
            }
          } else {
            this.designData.weft.table.data[index] = this.designData.weft.table.data[index].concat(item)
          }
        })
        // 触发一下表格更新，重新获取数据
        this.tableHot.designWeft.loadData(this.designData.weft.table.data)
        // this.$refs.weftTable.hotInstance.loadData(this.designData.weft.table.data)
        return
      }
      if (type === 'weftTableBack') {
        let reverseArr = this.designData.weft.tableBack.data.map((item) => {
          let copy = JSON.parse(JSON.stringify(item))
          return copy.slice(Number(this.designData.weft.invertedOrderBack1) - 1, Number(this.designData.weft.invertedOrderBack2)).reverse()
        })
        reverseArr.forEach((item, index) => {
          if (index === 0) {
            for (let i = 0; i < item.length; i++) {
              this.designData.weft.tableBack.number++
              this.designData.weft.tableBack.data[index].push(this.designData.weft.tableBack.number)
            }
          } else {
            this.designData.weft.tableBack.data[index] = this.designData.weft.tableBack.data[index].concat(item)
          }
        })
        // 触发一下表格更新，重新获取数据
        this.tableHot.designWeftBack.loadData(this.designData.weft.tableBack.data)
        // this.$refs.weftTableBack.hotInstance.loadData(this.designData.weft.tableBack.data)
        return
      }
      if (Number(this.invertedOrder[type][0]) && Number(this.invertedOrder[type][1]) && Number(this.invertedOrder[type][0]) > 0 && Number(this.invertedOrder[type][1]) > 0) {
        let reverseArr = this.tableData[type].data.map((item) => {
          let copy = JSON.parse(JSON.stringify(item))
          return copy.slice(Number(this.invertedOrder[type][0] - 1), Number(this.invertedOrder[type][1])).reverse()
        })
        reverseArr.forEach((item, index) => {
          if (index === 0) {
            for (let i = 0; i < item.length; i++) {
              this.tableData[type].number++
              this.tableData[type].data[index].push(this.tableData[type].number)
            }
          } else {
            this.tableData[type].data[index] = this.tableData[type].data[index].concat(item)
          }
        })
        // 触发一下表格更新，重新获取数据
        this.tableHot[type].loadData(this.tableData[type].data)
        // this.$refs[type].hotInstance.loadData(this.tableData[type].data)
      } else {
        this.$message.error({
          message: '请输入正确的正整数'
        })
      }
    },
    // 重置操作
    clearTable (type) {
      this.$confirm('此操作将清空表格数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'warpTable') {
          this.designData.warp.table.number = 1
          this.designData.warp.table.data = [[1], [null], [null], [null], [null], [null]]
          this.tableHot.designWarp.loadData(this.designData.warp.table.data)
        } else if (type === 'warpTableBack') {
          this.designData.warp.tableBack.number = 1
          this.designData.warp.tableBack.data = [[1], [null], [null], [null], [null], [null]]
          this.tableHot.designWarpBack.loadData(this.designData.warp.tableBack.data)
        } else if (type === 'weftTable') {
          this.designData.weft.table.number = 1
          this.designData.weft.table.data = [[1], [null], [null], [null], [null], [null]]
          this.tableHot.designWeft.loadData(this.designData.weft.table.data)
        } else if (type === 'weftTableBack') {
          this.designData.weft.tableBack.number = 1
          this.designData.weft.tableBack.data = [[1], [null], [null], [null], [null], [null]]
          this.tableHot.designWeftBack.loadData(this.designData.weft.tableBack.data)
        } else {
          this.tableData[type].number = 1
          this.tableData[type].data = [[1], [null], [null], [null], [null], [null]]
          this.tableHot[type].loadData(this.tableData[type].data)
          // this.$refs[type].hotInstance.loadData(this.tableData[type].data)
        }
        this.$message({
          type: 'success',
          message: '重置成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 同步经向配色和原料
    synchro () {
      this.yarn.yarnWeft = this.yarn.yarnWarp
      this.yarn.yarnOtherWeft = JSON.parse(JSON.stringify(this.yarn.yarnOtherWarp))
      this.colour.forEach((item) => {
        item.colorWeft = JSON.parse(JSON.stringify(item.colorWarp))
      })
    },
    // 保存穿综法
    savePM () {
      this.$prompt('<div style="font-size:16px">本次操作将以<strong style="color:#1A95FF">穿综法</strong>中实际填写的信息为准，请为该常用穿综法<strong style="color:#1A95FF">命名</strong>，在确认信息无误后点击保存：</div>', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '保存',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        penetrationMethod.create({
          name: value,
          pattern_loop: {
            PM: this.repeatPM.map((item) => {
              item.number = 0
              return item
            }),
            GL: this.GL
          },
          data: {
            PMFlag: this.PMFlag,
            GLFlag: this.GLFlag
          }
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 获取穿综法
    getPM (id) {
      let value = this.commonPMArr.find((item) => item.id === id)
      const flag = JSON.parse(value.data)
      const data = JSON.parse(value.pattern_loop)
      this.GL = data.GL
      this.repeatPM = data.PM
      this.GLFlag = flag.GLFlag
      this.PMFlag = flag.PMFlag
    },
    // 删除穿综法
    deleteCommonPM (id) {
      this.$confirm('此操作将删除该常用穿综, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        penetrationMethod.delete({ id: id }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '删除成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 从详情页把计算克重的代码抄过来,算出后端计算配料单所需要的数据
    computeYarn () {
      let yarn_color_weight = {}
      let peise_yarn_weight = {}
      let warpTable = this.getFlatTable(this.tableData.warp.data.map((item, index) => {
        if (index === 1) {
          return item.map((itemJia) => {
            return this.warpJia.find((itemFind) => itemFind.label === itemJia) ? this.warpJia.find((itemFind) => itemFind.label === itemJia).value : ''
          })
        } else {
          if (item.length === this.tableData.warp.number) {
            return item
          } else {
            for (let i = 0; i < this.tableData.warp.number; i++) {
              item[i] = item[i] || null
            }
            return item
          }
        }
      }), 'warp')
      let weftTable = this.getFlatTable(this.tableData.weft.data.map((item, index) => {
        if (index === 1) {
          return item.map((itemJia) => {
            return this.weftJia.find((itemFind) => itemFind.label === itemJia) ? this.weftJia.find((itemFind) => itemFind.label === itemJia).value : ''
          })
        } else {
          if (item.length === this.tableData.weft.number) {
            return item
          } else {
            for (let i = 0; i < this.tableData.weft.number; i++) {
              item[i] = item[i] || null
            }
            return item
          }
        }
      }), 'weft')
      let warpTableBack = this.getFlatTable(this.tableData.warpBack.data.map((item, index) => {
        if (index === 1) {
          return item.map((itemJia) => {
            return this.warpJia.find((itemFind) => itemFind.label === itemJia) ? this.warpJia.find((itemFind) => itemFind.label === itemJia).value : ''
          })
        } else {
          if (item.length === this.tableData.warpBack.number) {
            return item
          } else {
            for (let i = 0; i < this.tableData.warpBack.number; i++) {
              item[i] = item[i] || null
            }
            return item
          }
        }
      }), 'warpBack')
      let weftBackTable = this.getFlatTable(this.tableData.weftBack.data.map((item, index) => {
        if (index === 1) {
          return item.map((itemJia) => {
            return this.weftJia.find((itemFind) => itemFind.label === itemJia) ? this.weftJia.find((itemFind) => itemFind.label === itemJia).value : ''
          })
        } else {
          if (item.length === this.tableData.weftBack.number) {
            return item
          } else {
            for (let i = 0; i < this.tableData.weftBack.number; i++) {
              item[i] = item[i] || null
            }
            return item
          }
        }
      }), 'weftBack')
      warpTable.forEach((item) => {
        this.colorNumber.warp[item.color] = this.colorNumber.warp[item.color] ? this.colorNumber.warp[item.color] : 0
        this.colorNumber.warp[item.color] += Number(item.number)
      })
      if (this.ifDouble.warp) {
        warpTableBack.forEach((item) => {
          this.colorNumber.warp[item.color] = this.colorNumber.warp[item.color] ? this.colorNumber.warp[item.color] : 0
          this.colorNumber.warp[item.color] += Number(item.number)
        })
      }
      weftTable.forEach((item) => {
        this.colorNumber.weft[item.color] = this.colorNumber.weft[item.color] ? this.colorNumber.weft[item.color] : 0
        this.colorNumber.weft[item.color] += Number(item.number)
      })
      if (this.ifDouble.weft) {
        weftBackTable.forEach((item) => {
          this.colorNumber.weft[item.color] = this.colorNumber.weft[item.color] ? this.colorNumber.weft[item.color] : 0
          this.colorNumber.weft[item.color] += Number(item.number)
        })
      }
      this.warpInfo.material_data = [{
        material_name: this.yarn.yarnWarp,
        type_material: 1,
        apply: this.warpJia.filter((item) => {
          return !(this.yarn.yarnOtherWarp.find((itemFind) => {
            return itemFind.array.find((itemArr) => {
              return itemArr === item.value
            })
          }))
        }).map(item => item.value)
      }].concat(this.yarn.yarnOtherWarp.filter((item) => {
        return item.value !== ''
      }).map((item) => {
        return {
          material_name: item.value,
          apply: item.array,
          type_material: 2
        }
      }))
      this.weftInfo.material_data = [{
        material_name: this.yarn.yarnWeft,
        type_material: 1,
        apply: this.weftJia.filter((item) => {
          return !(this.yarn.yarnOtherWeft.find((itemFind) => {
            return itemFind.array.find((itemArr) => {
              return itemArr === item.value
            })
          }))
        }).map(item => item.value)
      }].concat(this.yarn.yarnOtherWeft.filter((item) => {
        return item.value !== ''
      }).map((item) => {
        return {
          material_name: item.value,
          apply: item.array,
          type_material: 2
        }
      }))
      this.warpInfo.material_data.forEach((item) => {
        item.apply.forEach((itemChild) => {
          this.colorWeight.warp[itemChild] = ((this.colorNumber.warp[itemChild] || 0) * (this.weftInfo.neichang + this.weftInfo.rangwei) * this.allMaterial.map((item, index) => {
            return {
              name: item.name,
              value: this.coefficient[index]
            }
          }).find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1)
        })
      })
      this.weftInfo.material_data.forEach((item) => {
        item.apply.forEach((itemChild) => {
          this.colorWeight.weft[itemChild] = ((this.colorNumber.weft[itemChild] || 0) * (Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu) * this.allMaterial.map((item, index) => {
            return {
              name: item.name,
              value: this.coefficient[index]
            }
          }).find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1)
        })
      })
      this.material.materialWarp.forEach((item) => {
        item.apply = item.array.map((index) => {
          return {
            number: index,
            weight: item.number * (this.colorNumber.warp[index] * (this.weftInfo.neichang + this.weftInfo.rangwei) * this.allMaterial.map((item, index) => {
              return {
                name: item.name,
                value: this.coefficient[index]
              }
            }).find((itemFind) => itemFind.name === item.value).value / 100).toFixed(1)
          }
        })
      })
      this.material.materialWeft.forEach((item) => {
        item.apply = item.array.map((index) => {
          return {
            number: index,
            weight: item.number * (this.colorNumber.weft[index] * (Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu) * this.allMaterial.map((item, index) => {
              return {
                name: item.name,
                value: this.coefficient[index]
              }
            }).find((itemFind) => itemFind.name === item.value).value / 100).toFixed(1) || 0
          }
        })
      })
      this.colour.forEach((itemColour) => {
        let colour_name = this.colourArr.find((itemFind) => itemFind.color_id === itemColour.value).color_name
        peise_yarn_weight[colour_name] = {}
        itemColour.colorWarp.forEach((itemColor, indexColor) => {
          peise_yarn_weight[colour_name][itemColor.name] = peise_yarn_weight[colour_name][itemColor.name] || {}
          peise_yarn_weight[colour_name][itemColor.name][this.warpInfo.material_data.find((itemFind) => itemFind.apply.indexOf(indexColor) !== -1).material_name] = Number(this.colorWeight.warp[indexColor])
        })
        itemColour.colorWeft.forEach((itemColor, indexColor) => {
          peise_yarn_weight[colour_name][itemColor.name] = peise_yarn_weight[colour_name][itemColor.name] || {}
          peise_yarn_weight[colour_name][itemColor.name][this.weftInfo.material_data.find((itemFind) => itemFind.apply.indexOf(indexColor) !== -1).material_name] ?
            peise_yarn_weight[colour_name][itemColor.name][this.weftInfo.material_data.find((itemFind) => itemFind.apply.indexOf(indexColor) !== -1).material_name] += Number(this.colorWeight.weft[indexColor]) :
            peise_yarn_weight[colour_name][itemColor.name][this.weftInfo.material_data.find((itemFind) => itemFind.apply.indexOf(indexColor) !== -1).material_name] = Number(this.colorWeight.weft[indexColor])
          peise_yarn_weight[colour_name][itemColor.name][this.weftInfo.material_data.find((itemFind) => itemFind.apply.indexOf(indexColor) !== -1).material_name] = parseFloat(Number(peise_yarn_weight[colour_name][itemColor.name][this.weftInfo.material_data.find((itemFind) => itemFind.apply.indexOf(indexColor) !== -1).material_name]).toFixed(2))
        })
        this.material.materialWarp.forEach((item) => {
          item.apply.forEach((itemChild) => {
            peise_yarn_weight[colour_name][itemColour.colorWarp[itemChild.number].name][item.value] = Number(itemChild.weight)
          })
        })
        this.material.materialWeft.forEach((item) => {
          item.apply.forEach((itemChild) => {
            peise_yarn_weight[colour_name][itemColour.colorWarp[itemChild.number].name][item.value] = peise_yarn_weight[colour_name][itemColour.colorWarp[itemChild.number].name][item.value] || 0
            peise_yarn_weight[colour_name][itemColour.colorWarp[itemChild.number].name][item.value] += Number(itemChild.weight)
          })
        })

      })
      return {
        yarn_color_weight: yarn_color_weight,
        peise_yarn_weight: peise_yarn_weight,
      }
    },
    // 获取特殊数据,用于处理 乘以[n]遍，最后一遍去掉[x]列到[y]列
    getSpecial (info) {
      if (Number(info)) {
        return {
          number: Number(info)
        }
      }
      // 只解析上列字符串，别的不管
      let arr = info.split(']')
      return {
        number: arr[0].split('[')[1],
        start: arr[1].split('[')[1],
        end: arr[2].split('[')[1]
      }
    },
    // 展平合并信息
    getFlatTable (table, type) {
      let tableArr = table
      let mergeTable = this.tableHot[type].getPlugin('MergeCells').mergedCellsCollection.mergedCells
      // 获取完整的合并项信息
      let firstMerge = this.getMergeInfo(mergeTable, 3, tableArr[0].length)
      let secondMerge = this.getMergeInfo(mergeTable, 4, tableArr[0].length)
      // 处理合并项的合并信息
      let firstArr = []
      firstMerge.forEach((item) => {
        let temporaryStorage = [] // 临时存储合并项
        for (let i = item.col; i < (item.col + item.colspan); i++) {
          temporaryStorage.push({
            order: tableArr[0][i],
            color: tableArr[1][i],
            number: tableArr[2][i],
            // GLorPM: tableArr[5][i]
          })
        }
        let forNum = this.getSpecial(tableArr[item.row][item.col] || 1)
        for (let i = 0; i < forNum.number; i++) {
          let realStorage = temporaryStorage
          if (forNum.start && i === (forNum.number - 1)) {
            realStorage = temporaryStorage.filter((item) => {
              return item.order < forNum.start || item.order > forNum.end
            })
          }
          firstArr.push(realStorage)
        }
      })
      let secondArr = []
      secondMerge.forEach((item) => {
        let temporaryStorage = firstArr.filter((itemFilter) => {
          return itemFilter[0].order > item.col && itemFilter[0].order <= (item.col + item.colspan)
        })
        let forNum = this.getSpecial(tableArr[item.row][item.col] || 1)
        for (let i = 0; i < forNum.number; i++) {
          let realStorage = temporaryStorage
          if (forNum.start && i === (forNum.number - 1)) {
            realStorage = temporaryStorage.filter((item) => {
              let flag = true
              item.forEach((itemChild) => {
                if (itemChild.order >= forNum.start && itemChild.order <= forNum.end) {
                  flag = false
                }
              })
              return flag
            })
          }
          secondArr.push(realStorage)
        }
      })
      // 多维数组展平
      let flattenArr = this.mergeArray(secondArr)
      return flattenArr
    },
    // 合并项信息处理
    getMergeInfo (mergeTable, row, length) {
      let mergeArr = mergeTable.filter(item => item.row === row).sort((a, b) => { return a.col - b.col })
      let saveMerge = []
      let col = 0
      let mergeIndex = 0
      while (col < length) {
        if (mergeArr[mergeIndex]) {
          if (col < mergeArr[mergeIndex].col) {
            for (let i = 0; i < mergeArr[mergeIndex].col - col; i++) {
              saveMerge.push({
                col: i + col,
                colspan: 1,
                row: row
              })
            }
            col = mergeArr[mergeIndex].col
          } else {
            saveMerge.push({
              col: mergeArr[mergeIndex].col,
              colspan: mergeArr[mergeIndex].colspan,
              row: row
            })
            col = mergeArr[mergeIndex].col + mergeArr[mergeIndex].colspan
            mergeIndex++
          }
        } else {
          for (let i = col; i < length; i++) {
            saveMerge.push({
              col: i,
              colspan: 1,
              row: row
            })
          }
          col = length
        }
      }
      return saveMerge
    },
    // 合并数组
    mergeArray (arr, saveArr) {
      let array = saveArr || []
      arr.forEach((item) => {
        if (Array.isArray(item)) {
          this.mergeArray(item, array)
        } else {
          array.push(item)
        }
      })
      return array
    },
    submit (ifCaogao) {
      // 获取合并单元格信息
      let errorInput = false
      if (ifCaogao !== '草稿') {
        errorInput = this.colour.some((itemColour) => {
          if (!itemColour.value) {
            return true
          }
          return itemColour.colorWarp.some((itemColor) => {
            if (!itemColor.name) {
              return true
            }
          }) || itemColour.colorWeft.some((itemColor) => {
            if (!itemColor.name) {
              return true
            }
          })
        })
        if (errorInput) {
          this.$message.error({
            message: '检测到配色方案信息不完整'
          })
          return
        }
        errorInput = !this.yarn.yarnWarp || !this.yarn.yarnWeft
        if (errorInput) {
          this.$message.error({
            message: '检测到主要原料信息不完整'
          })
          return
        }
        errorInput = this.yarn.yarnOtherWarp.some((item) => {
          return item.value && item.array.some((apply) => {
            return apply === ''
          })
        })
        if (errorInput) {
          this.$message.error({
            message: '检测到经向次要原料信息不完整'
          })
          return
        }
        errorInput = this.yarn.yarnOtherWeft.some((item) => {
          return item.value && item.array.some((apply) => {
            return apply === ''
          })
        })
        if (errorInput) {
          this.$message.error({
            message: '检测到纬向次要原料信息不完整'
          })
          return
        }
        errorInput = this.material.materialWarp.some((item) => {
          return item.value ? !item.number || item.array.some((apply) => {
            return apply === ''
          }) : item.number ? !item.value || item.array.some((apply) => {
            return apply === ''
          }) : false
        })
        if (errorInput) {
          this.$message.error({
            message: '检测到经向辅助原料信息不完整'
          })
          return
        }
        errorInput = this.material.materialWeft.some((item) => {
          return item.value ? !item.number || item.array.some((apply) => {
            return apply === ''
          }) : item.number ? !item.value || item.array.some((apply) => {
            return apply === ''
          }) : false
        })
        if (errorInput) {
          this.$message.error({
            message: '检测到纬向辅助原料信息不完整'
          })
          return
        }
        errorInput = this.tableData.warp.data.some((item, index) => {
          if (index === 2 || index === 1) {
            return item.some((value) => {
              return !value
            })
          } else {
            return false
          }
        })
        if (errorInput) {
          this.$message.error({
            message: '检测到经向排列信息不完整'
          })
          return
        }
        if (this.ifDouble.warp) {
          errorInput = this.tableData.warpBack.data.some((item, index) => {
            if (index === 2 || index === 1) {
              return item.some((value) => {
                return !value
              })
            } else {
              return false
            }
          })
        }
        if (errorInput) {
          this.$message.error({
            message: '检测到经向反面排列信息不完整'
          })
          return
        }
        errorInput = this.tableData.weft.data.some((item, index) => {
          if (index === 2 || index === 1) {
            return item.some((value) => {
              return !value
            })
          } else {
            return false
          }
        })
        if (errorInput) {
          this.$message.error({
            message: '检测到纬向排列信息不完整'
          })
          return
        }
        if (this.ifDouble.weft) {
          errorInput = this.tableData.weftBack.data.some((item, index) => {
            if (index === 2 || index === 1) {
              return item.some((value) => {
                return !value
              })
            } else {
              return false
            }
          })
        }
        if (errorInput) {
          this.$message.error({
            message: '检测到纬向反面排列信息不完整'
          })
          return
        }
        if (!this.warpInfo.reed_width) {
          this.$message.error({
            message: '请输入筘幅'
          })
          return
        }
        if (!this.weftInfo.neichang) {
          this.$message.error({
            message: '请输入内长'
          })
          return
        }
        if (!this.weftInfo.rangwei) {
          this.$message.error({
            message: '请输入让位'
          })
          return
        }
        errorInput = this.coefficient.some((item) => {
          return item === ''
        })
        if (errorInput) {
          this.$message.error({
            message: '请输入物料系数'
          })
          return
        }
        if (this.PMFlag === 'normal') {
          errorInput = this.repeatPM.some((item) => {
            return item.number === '' || Number(item.number) === 0 || !item.value
          })
        } else {
          this.repeatPM.forEach((item) => {
            item.children.forEach((itemChild) => {
              itemChild.children.forEach((itemSon) => {
                if (!itemChild.number || !itemSon.value || !itemSon.repeat) {
                  errorInput = true
                }
              })
            })
          })
        }
        if (errorInput) {
          this.$message.error({
            message: '请检查穿综循环是否漏填'
          })
          return
        }
        this.GL.forEach((item1) => {
          item1.forEach((item2) => {
            if (!item2[0] || !item2[1]) {
              errorInput = true
            }
          })
        })
        if (errorInput) {
          this.$message.error({
            message: '请填写纹版图'
          })
          return
        }
      }
      if (errorInput) {
        return
      }
      let cmpYarn = {
        yarn_color_weight: {},
        peise_yarn_weight: {}
      }
      if (ifCaogao !== '草稿') {
        cmpYarn = this.computeYarn()
      }
      let formData = {
        id: this.craftId,
        is_draft: ifCaogao === '草稿' ? 2 : 1, //设计单字段，现改为是否为草稿
        title: this.ZDYMC,
        product_type: this.$route.params.type,
        company_id: window.sessionStorage.getItem('company_id'),
        product_id: null,
        size: this.DSGG,
        weight: this.DSKZ,
        desc: this.desc,
        yarn_coefficient: this.allMaterial.map((item, index) => {
          return {
            name: item.name,
            value: this.coefficient[index],
            chuankou: this.chuankouDetail[index]
          }
        }),
        yarn_color_weight: cmpYarn.yarn_color_weight,
        peise_yarn_weight: cmpYarn.peise_yarn_weight,
        warp_data: {
          weight_calculate_formula: this.weftCmp,
          color_data: this.colour.map((item) => {
            return {
              color_id: item.value,
              color_scheme: item.colorWarp.map((itemColor) => {
                if (itemColor.name !== '空梭') {
                  return {
                    name: itemColor.name,
                    value: itemColor.color
                  }
                } else {
                  return {
                    name: null,
                    value: null
                  }
                }
              })
            }
          }),
          material_data: [{
            material_name: this.yarn.yarnWarp,
            type_material: 1,
            apply: this.warpJia.filter((item) => {
              return !(this.yarn.yarnOtherWarp.find((itemFind) => {
                return itemFind.array.find((itemArr) => {
                  return itemArr === item.value
                })
              }))
            }).map(item => item.value)
          }].concat(this.yarn.yarnOtherWarp.filter((item) => {
            return item.value !== ''
          }).map((item) => {
            return {
              material_name: item.value,
              apply: item.array,
              type_material: 2
            }
          })),
          assist_material: this.material.materialWarp.filter((item) => {
            return item.value !== ''
          }).map((item) => {
            return {
              material_name: item.value,
              number: item.number,
              apply: item.array
            }
          }),
          warp_rank: this.tableData.warp.data.map((item, index) => {
            if (index === 1) {
              return item.map((itemJia) => {
                return this.warpJia.find((itemFind) => itemFind.label === itemJia) ? this.warpJia.find((itemFind) => itemFind.label === itemJia).value : ''
              })
            } else {
              if (item.length === this.tableData.warp.number) {
                return item
              } else {
                for (let i = 0; i < this.tableData.warp.number; i++) {
                  item[i] = item[i] || null
                }
                return item
              }
            }
          }),
          merge_data: this.tableHot.warp.getPlugin('MergeCells').mergedCellsCollection.mergedCells,
          back_status: this.ifDouble.warp,
          warp_rank_back: this.tableData.warpBack.data.map((item, index) => {
            if (index === 1) {
              return item.map((itemJia) => {
                return this.warpJia.find((itemFind) => itemFind.label === itemJia) ? this.warpJia.find((itemFind) => itemFind.label === itemJia).value : ''
              })
            } else {
              if (item.length === this.tableData.warpBack.number) {
                return item
              } else {
                for (let i = 0; i < this.tableData.warpBack.number; i++) {
                  item[i] = item[i] || null
                }
                return item
              }
            }
          }),
          merge_data_back: this.tableHot.warpBack.getPlugin('MergeCells').mergedCellsCollection.mergedCells,
          weft: this.warpInfo.weft,
          side_id: this.warpInfo.side_id,
          machine_id: this.warpInfo.machine_id,
          width: this.warpInfo.width,
          reed_width_data: JSON.stringify(this.warpInfo.reed_width_data),
          reed: this.warpInfo.reed,
          reed_method: this.warpInfo.reed_method,
          reed_width: this.warpInfo.reed_width,
          sum_up: this.warpInfo.sum_up,
          contract_ratio: 100, // 缩率工艺单用不到，默认100
          additional_data: '' // 废弃字段
        },
        weft_data: {
          color_data: this.colour.map((item) => {
            return {
              color_id: item.value,
              color_scheme: item.colorWeft.map((itemColor) => {
                if (itemColor.name !== '空梭') {
                  return {
                    name: itemColor.name,
                    value: itemColor.color
                  }
                } else {
                  return {
                    name: null,
                    value: null
                  }
                }
              })
            }
          }),
          material_data: [{
            material_name: this.yarn.yarnWeft,
            type_material: 1,
            apply: this.weftJia.filter((item) => {
              return !(this.yarn.yarnOtherWeft.find((itemFind) => {
                return itemFind.array.find((itemArr) => {
                  return itemArr === item.value
                })
              }))
            }).map(item => item.value)
          }].concat(this.yarn.yarnOtherWeft.filter((item) => {
            return item.value !== ''
          }).map((item) => {
            return {
              material_name: item.value,
              apply: item.array,
              type_material: 2
            }
          })),
          assist_material: this.material.materialWeft.filter((item) => {
            return item.value !== ''
          }).map((item) => {
            return {
              material_name: item.value,
              number: item.number,
              apply: item.array
            }
          }),
          weft_rank: this.tableData.weft.data.map((item, index) => {
            if (index === 1) {
              return item.map((itemJia) => {
                return this.weftJia.find((itemFind) => itemFind.label === itemJia) ? this.weftJia.find((itemFind) => itemFind.label === itemJia).value : ''
              })
            } else {
              if (item.length === this.tableData.weft.number) {
                return item
              } else {
                for (let i = 0; i < this.tableData.weft.number; i++) {
                  item[i] = item[i] || null
                }
                return item
              }
            }
          }),
          merge_data: this.tableHot.weft.getPlugin('MergeCells').mergedCellsCollection.mergedCells,
          back_status: this.ifDouble.weft,
          weft_rank_back: this.tableData.weftBack.data.map((item, index) => {
            if (index === 1) {
              return item.map((itemJia) => {
                return this.weftJia.find((itemFind) => itemFind.label === itemJia) ? this.weftJia.find((itemFind) => itemFind.label === itemJia).value : ''
              })
            } else {
              if (item.length === this.tableData.weftBack.number) {
                return item
              } else {
                for (let i = 0; i < this.tableData.weftBack.number; i++) {
                  item[i] = item[i] || null
                }
                return item
              }
            }
          }),
          merge_data_back: this.tableHot.weftBack.getPlugin('MergeCells').mergedCellsCollection.mergedCells,
          organization_id: this.weftInfo.organization_id,
          peifu: this.weftInfo.peifu,
          peifu_data: this.weftInfo.peifu_data,
          weimi: this.weimi,
          shangchiya: this.weftInfo.shangchiya,
          xiachiya: this.weftInfo.xiachiya,
          neichang: this.weftInfo.neichang,
          rangwei: this.weftInfo.rangwei,
          total: this.weftInfo.total,
          contract_ratio: 100 // 缩率工艺单用不到，默认100
        },
        draft_method: {
          PM: this.repeatPM.map((item, index) => {
            if (this.PMFlag === 'normal') {
              item.value = item.value ? item.value.replace(/，/g, ',') : ''
              item.repeat = Number(item.repeat) > 0 ? Number(item.repeat) : 1
            } else {
              item.children = item.children.map((item2) => {
                item2.children = item2.children.map((item3) => {
                  item3.value = item3.value.replace(/，/g, ',')
                  item3.repeat = Number(item3.repeat) > 0 ? Number(item3.repeat) : 1
                  return item3
                })
                return item2
              })
            }
            return item
          }),
          PMFlag: this.PMFlag,
          GL: this.GL.map((item) => {
            return item.map((item2) => {
              return item2.map((item3) => {
                if (item3) {
                  return item3.replace(/，/g, ',')
                } else {
                  return item3
                }
              })
            })
          }),
          GLFlag: this.GLFlag,
          desc: this.remarkPM,
          GLRepeat: this.GLRepeat
        }
      }
      this.loading = true
      craft.update(formData).then((res) => {
        if (res.data.code === 200) {
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/craft/craftDetail/' + res.data.data.product_info.product_id + '/' + this.$route.params.type
            this.msgContent = '<span style="color:#E6A23C">修改</span>了一张工艺单<span style="color:#1A95FF">' + res.data.data.product_info.product_code + '</span>(' + res.data.data.product_info.category_info.product_category + '/' + res.data.data.product_info.type_name + '/' + res.data.data.product_info.style_name + '/' + res.data.data.product_info.flower_id + ')'
            this.msgSwitch = true
          } else {
            this.$router.push('/craft/craftDetail/' + res.data.data.product_info.product_id + '/' + this.$route.params.type)
          }
        }
      })
    }
  },
  mounted () {
    Promise.all([
      yarn.list(),
      craftConfig.getAll(),
      yarnColor.list(),
      material.list(),
      penetrationMethod.list(),
      craft.detail({
        id: this.$route.params.id
      })
    ]).then((res) => {
      this.yarn.yarnArr = res[0].data.data.map((item) => {
        return {
          value: item.name
        }
      })
      this.sideArr = res[1].data.data.side
      this.modeleArr = res[1].data.data.type
      this.methodArr = res[1].data.data.method
      this.colorArr = res[2].data.data
      this.commonPMArr = res[4].data.data
      let data = res[5].data.data
      this.ZDYMC = data.title
      this.DSGG = data.size
      this.DSKZ = data.weight
      this.productInfo = data.product_info
      this.colourArr = this.productInfo.color
      this.craftId = data.id
      this.warpInfo = data.warp_data
      this.weftInfo = data.weft_data

      this.warpInfo.reed_width_data = JSON.parse(this.warpInfo.reed_width_data) || ['', '', '']
      this.colour = this.warpInfo.color_data.map((item, index) => {
        return {
          value: item.color_id,
          colorWarp: item.color_scheme.map((item) => {
            return {
              name: item.name,
              color: item.value
            }
          }),
          colorWeft: this.weftInfo.color_data[index].color_scheme.map((item) => {
            return {
              name: item.name,
              color: item.value
            }
          })
        }
      })
      this.weftCmp = data.warp_data.weight_calculate_formula.toString()
      this.yarn.yarnWarp = this.warpInfo.material_data.find((item) => item.type_material === 1).material_name
      this.yarn.yarnWeft = this.weftInfo.material_data.find((item) => item.type_material === 1).material_name
      this.yarn.yarnOtherWarp = this.warpInfo.material_data.filter((item) => item.type_material === 2).map((item) => {
        return {
          type: item.type,
          array: item.apply,
          value: item.material_name,
          type_material: item.type_material
        }
      })
      if (this.yarn.yarnOtherWarp.length === 0) {
        this.yarn.yarnOtherWarp = [{
          value: '',
          array: []
        }]
      }
      this.yarn.yarnOtherWeft = this.weftInfo.material_data.filter((item) => item.type_material === 2).map((item) => {
        return {
          type: item.type,
          array: item.apply,
          value: item.material_name,
          type_material: item.type_material
        }
      })
      if (this.yarn.yarnOtherWeft.length === 0) {
        this.yarn.yarnOtherWeft = [{
          value: '',
          array: []
        }]
      }
      this.material.materialWarp = this.warpInfo.assist_material.map((item) => {
        return {
          value: item.material_name,
          number: item.number,
          array: item.apply
        }
      })
      if (this.material.materialWarp.length === 0) {
        this.material.materialWarp = [{
          value: '',
          array: [],
          number: ''
        }]
      }
      this.material.materialWeft = this.weftInfo.assist_material.map((item) => {
        return {
          value: item.material_name,
          number: item.number,
          array: item.apply
        }
      })
      if (this.material.materialWeft.length === 0) {
        this.material.materialWeft = [{
          value: '',
          array: [],
          number: ''
        }]
      }
      this.ifDouble.warp = data.warp_data.back_status
      this.ifDouble.weft = data.weft_data.back_status
      this.$nextTick(() => {
        this.tableData.warp.mergeCells = JSON.parse(this.warpInfo.merge_data)
        this.tableData.weft.mergeCells = JSON.parse(this.weftInfo.merge_data)
        this.tableData.warp.data = JSON.parse(this.warpInfo.warp_rank).map((item, index) => {
          return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
        })
        this.tableData.weft.data = JSON.parse(this.weftInfo.weft_rank).map((item, index) => {
          return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
        })
        if (data.warp_data.back_status === 1) {
          this.tableData.warpBack.mergeCells = JSON.parse(this.warpInfo.merge_data_back)
          this.tableData.warpBack.data = JSON.parse(this.warpInfo.warp_rank_back).map((item, index) => {
            return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
          })
        }
        if (data.weft_data.back_status === 1) {
          this.tableData.weftBack.mergeCells = JSON.parse(this.weftInfo.merge_data_back)
          this.tableData.weftBack.data = JSON.parse(this.weftInfo.weft_rank_back).map((item, index) => {
            return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
          })
        }
        this.tableData.warp.number = JSON.parse(this.warpInfo.warp_rank)[0].length
        this.tableData.warpBack.number = JSON.parse(this.warpInfo.warp_rank_back)[0].length
        this.tableData.weft.number = JSON.parse(this.weftInfo.weft_rank)[0].length
        this.tableData.weftBack.number = JSON.parse(this.weftInfo.weft_rank_back)[0].length

        this.tableHot.warp = new Handsontable(this.$refs.warp, this.tableData.warp)
        this.tableHot.weft = new Handsontable(this.$refs.weft, this.tableData.weft)
        this.tableHot.warpBack = new Handsontable(this.$refs.warpBack, this.tableData.warpBack)
        this.tableHot.weftBack = new Handsontable(this.$refs.weftBack, this.tableData.weftBack)
      })

      this.GL = data.draft_method.GL
      this.GLFlag = data.draft_method.GLFlag
      this.repeatPM = data.draft_method.PM
      this.PMFlag = data.draft_method.PMFlag
      this.GLRepeat = data.draft_method.GLRepeat || [[{
        start: '',
        end: '',
        repeat: ''
      }]]
      this.remarkPM = data.draft_method.desc
      this.desc = data.desc
      this.weight = data.weight
      this.coefficient = data.yarn_coefficient.map((item) => item.value)
      this.chuankouDetail = data.yarn_coefficient.map((item) => item.chuankou || 0)
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/craft/craftUpdate.less";
</style>
<style lang="less">
#craftUpdate {
  .treeCtn {
    .el-input__inner {
      border: 0 !important;
    }
  }
  .GLCtn {
    .el-input__inner {
      height: 32px !important;
      margin-top: 3px;
    }
  }
}
</style>
