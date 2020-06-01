<template>
  <div id="craftDetail"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn"
        style="display: flex;justify-content: space-between;align-items: center;">
        <span class="title hasBorder">{{$route.params.type==='1'?'产':'样'}}品信息</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
            <span class="text">{{productInfo.product_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品名称：</span>
            <span class="text"
              :class="{'blue':productInfo.title}">{{productInfo.title?productInfo.title:'无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品品类：</span>
            <span class="text">{{productInfo.category_info.product_category}}/{{productInfo.type_name}}/{{productInfo.style_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">工艺编号：</span>
            <span class="text">{{productInfo.craft_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品成分：</span>
            <span class="text">{{productInfo.materials|filterMaterials}}</span>
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
        <div class="swichCtn"
          v-if="$route.params.type==='2' && data.length>1">
          <div class="swich"
            v-for="index in data.length"
            :key="index"
            :class="{'active':craftIndex===index-1}"
            @click="init(data[index - 1],index-1)">工艺单{{index}}</div>
          <div class="btn btnBlue"
            @click="setDefault">设为默认</div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">原料经向</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">配色方案：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in warpInfo.color_data"
                :key="index">
                <span class="circle">{{index+1}}</span>
                <span>{{item.product_color}}：</span>
                <div class="colorBox"
                  v-for="(itemColor,indexColor) in item.color_scheme"
                  :key="indexColor">
                  <span class="colorText"
                    :style="{'background':itemColor.value}">{{filterMethods(indexColor)}}</span>
                  <span class="name">{{itemColor.name}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">主要原料：</span>
            <div class="text">
              <span>{{yarn.yarnWarp.material_name}}</span>
              <div class="colorBox"
                v-for="(item,index) in yarn.yarnWarp.apply"
                :key="index">
                <span class="colorText">{{filterMethods(item)}}</span>
                <span class="name">{{colorWeight.warp[item]==='NaN'?'0g':colorWeight.warp[item] + 'g'}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="yarn.yarnOtherWarp.length>0">
          <div class="colCtn">
            <span class="label">次要原料：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in yarn.yarnOtherWarp"
                :key="index">
                <span>{{item.material_name}}</span>
                <div class="colorBox"
                  v-for="(item,index) in item.apply"
                  :key="index">
                  <span class="colorText">{{filterMethods(item)}}</span>
                  <span class="name">{{colorWeight.warp[item]==='NaN'?'0g':colorWeight.warp[item] + 'g'}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="material.materialWarp.length>0">
          <div class="colCtn">
            <span class="label">辅助原料：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in material.materialWarp"
                :key="index">
                <span>{{item.material_name}}</span>
                <span style="margin-left:16px">数量({{item.number}})</span>
                <div class="colorBox"
                  v-for="(item,index) in item.apply"
                  :key="index">
                  <el-tooltip class="item"
                    effect="dark"
                    :content="item.weight.toFixed(1)+'g'"
                    placement="top">
                    <span class="colorText">{{filterMethods(item.number)}}</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">经向排列：</span>
            <div class="tableCtns">
              <hot-table :settings="tableData.warp"
                ref="warp">
              </hot-table>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="warpInfo.back_status===1">
          <div class="colCtn">
            <span class="label">经向反面：</span>
            <div class="tableCtns">
              <hot-table :settings="tableData.warpBack"
                ref="warpBack">
              </hot-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">整经工艺</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">整经头纹：</span>
            <div class="text">{{warpInfo.weft}}根</div>
          </div>
          <div class="colCtn flex3">
            <span class="label">边型：</span>
            <div class="text">{{warpInfo.side_name?warpInfo.side_name:'无'}}</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">整经门幅：</span>
            <div class="text">{{warpInfo.width?warpInfo.width + 'cm':'无'}}</div>
          </div>
          <div class="colCtn flex3">
            <span class="label">机型：</span>
            <div class="text">{{warpInfo.machine_name?warpInfo.machine_name:'无'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">穿综筘工艺</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">筘号：</div>
            <div class="text">{{warpInfo.reed?warpInfo.reed+'筘':'无'}}</div>
          </div>
          <div class="colCtn flex3">
            <div class="label">穿筘法：</div>
            <div class="text">{{warpInfo.reed_method?warpInfo.reed_method+'根/筘':'无'}}</div>
          </div>
          <div class="colCtn flex3">
            <div class="label">综页：</div>
            <div class="text">{{warpInfo.sum_up?warpInfo.sum_up + '页':'无'}}</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <div class="label">筘幅：</div>
            <div class="text">{{warpInfo.reed_width+'cm'}}</div>
          </div>
          <div class="colCtn flex3">
            <div class="label">筘幅说明：</div>
            <div class="text">{{warpInfo.reed_width_data?warpInfo.reed_width_data:'无'}}</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="display:block">
            <div class="label">纹版图：</div>
            <div class="GLCtn"
              v-for="(item1,index1) in GL"
              :key="index1"
              style="overflow:hidden">
              <div class="mark"
                style="position:relative">{{alphabet[index1]}}：
                <span style="position:absolute;color:#1a95ff;font-size:12px;bottom:-1.3em;left:0em;cursor:pointer"
                  @click="showGL(item1)">预览</span>
              </div>
              <div v-for="(item2,index2) in item1"
                :key="index2"
                class="deltaCtn">
                <div class="leftCtn">
                  <span>{{index2+1}}</span>
                </div>
                <div class="rightCtn">
                  <el-input placeholder="数字间用逗号分隔"
                    v-model="item2[0]"
                    disabled></el-input>
                  <el-input placeholder="数字间用逗号分隔"
                    v-model="item2[1]"
                    disabled></el-input>
                  <el-input placeholder=""
                    v-model="item2[2]"
                    disabled></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">穿综循环：</div>
            <div class="treeCtn">
              <div class="node"
                v-for="(item1,index1) in PM"
                :key="index1">
                <div class="numbers">{{romanNum[index1]}}</div>
                <div class="lineCol"
                  v-show="PMFlag === 'complex'"></div>
                <div class="nodeBox">
                  <div class="box box1">
                    <el-input v-if="PMFlag === 'normal'"
                      placeholder="根数"
                      disabled
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
                          v-model="item1.value"
                          disabled>
                        </el-input>
                      </div>
                      <div class="line2">
                        <em class="unit left">×</em>
                        <el-input style="padding-left:5px;box-sizing:border-box;"
                          placeholder="遍数"
                          v-model="item1.repeat"
                          disabled>
                        </el-input>
                        <em class="unit right">遍</em>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="nodeChild"
                  v-show="PMFlag === 'complex'"
                  v-for="(item2,index2) in item1.children"
                  :key="index2">
                  <div class="nodeBox">
                    <div class="lineRow"></div>
                    <div class="box box1">
                      <el-input placeholder="根数"
                        disabled
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
                            disabled
                            v-model="item3.value">
                          </el-input>
                        </div>
                        <div class="line2">
                          <em class="unit left">×</em>
                          <el-input style="padding-left:5px;box-sizing:border-box;"
                            placeholder="遍数"
                            disabled
                            v-model="item3.repeat">
                          </el-input>
                          <em class="unit right">遍</em>
                        </div>
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
            <div class="label">穿综备注：</div>
            <div class="text"> {{remarkPM?remarkPM:'无'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">织造工艺</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">组织法：</div>
            <div class="text">{{weftInfo.organization_name?weftInfo.organization_name:''}}</div>
          </div>
          <div class="colCtn">
            <div class="label">机上坯幅：</div>
            <div class="text">{{weftInfo.peifu?weftInfo.peifu + 'cm':'无'}}</div>
          </div>
          <div class="colCtn">
            <div class="label">坯幅说明：</div>
            <div class="text">{{weftInfo.peifu_data?weftInfo.peifu_data:'无'}}</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">上齿牙：</div>
            <div class="text">{{weftInfo.shangchiya?weftInfo.shangchiya+'牙':'无'}}</div>
          </div>
          <div class="colCtn">
            <div class="label">下齿牙：</div>
            <div class="text">{{weftInfo.xiachiya?weftInfo.xiachiya+'牙':'无'}}</div>
          </div>
          <div class="colCtn">
            <div class="label">纬密：</div>
            <div class="text">{{((weftInfo.total / (weftInfo.neichang))).toFixed(2)}}梭/cm</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">内长：</div>
            <div class="text">{{weftInfo.neichang+'cm'}}</div>
          </div>
          <div class="colCtn">
            <div class="label">让位：</div>
            <div class="text">{{weftInfo.rangwei+'cm'}}</div>
          </div>
          <div class="colCtn">
            <div class="label">总计：</div>
            <div class="text">{{weftInfo.total+'根'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">原料纬向</span>
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">配色方案：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in weftInfo.color_data"
                :key="index">
                <span class="circle">{{index+1}}</span>
                <span>{{item.product_color}}：</span>
                <div class="colorBox"
                  v-for="(itemColor,indexColor) in item.color_scheme"
                  :key="indexColor">
                  <span class="colorText"
                    :style="{'background':itemColor.value}">{{filterMethods(indexColor)}}</span>
                  <span class="name">{{itemColor.name}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">主要原料：</span>
            <div class="text">
              <span>{{yarn.yarnWeft.material_name}}</span>
              <div class="colorBox"
                v-for="(item,index) in yarn.yarnWeft.apply"
                :key="index">
                <span class="colorText">{{filterMethods(item)}}</span>
                <span class="name">{{colorWeight.weft[item]==='NaN'?'0g':colorWeight.weft[item] + 'g'}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="yarn.yarnOtherWeft.length>0">
          <div class="colCtn">
            <span class="label">次要原料：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in yarn.yarnOtherWeft"
                :key="index">
                <span>{{item.material_name}}</span>
                <div class="colorBox"
                  v-for="(item,index) in item.apply"
                  :key="index">
                  <span class="colorText">{{filterMethods(item)}}</span>
                  <span class="name">{{colorWeight.weft[item]==='NaN'?'0g':colorWeight.weft[item] + 'g'}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="material.materialWeft.length>0">
          <div class="colCtn">
            <span class="label">辅助原料：</span>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in material.materialWeft"
                :key="index">
                <span>{{item.material_name}}</span>
                <span style="margin-left:16px">数量({{item.number}})</span>
                <div class="colorBox"
                  v-for="(item,index) in item.apply"
                  :key="index">
                  <el-tooltip class="item"
                    effect="dark"
                    :content="item.weight.toFixed(1)+'g'"
                    placement="top">
                    <span class="colorText">{{filterMethods(item.number)}}</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">纬向排列：</span>
            <div class="tableCtns">
              <hot-table :settings="tableData.weft"
                ref="weft">
              </hot-table>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="weftInfo.back_status===1">
          <div class="colCtn">
            <span class="label">纬向反面：</span>
            <div class="tableCtns">
              <hot-table :settings="tableData.weftBack"
                ref="weftBack">
              </hot-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">其他信息</span>
        <!-- <span style="float:right;cursor:pointer;color:#1a95ff"
          @click="drawThree">查看3d效果</span> -->
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">名称：</div>
            <div class="text">{{ZDYMC}}</div>
          </div>
          <div class="colCtn">
            <div class="label">大身规格：</div>
            <div class="text">{{DSGG}}cm</div>
          </div>
          <div class="colCtn">
            <div class="label">大身克重：</div>
            <div class="text">{{DSKZ}}g</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">物料系数：</div>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in coefficient"
                :key="index">{{item.name}}：{{item.value}}g
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">产品净重：</div>
            <div class="text blue">{{weight}}g</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">备注信息：</div>
            <div class="text"
              :class="{'blue':desc}">{{desc?desc:'无'}}</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">仿真图像：</div>
            <div class="btnList">
              <div class="button"
                v-for="(item,index) in warpInfo.color_data"
                :key="index"
                :class="{'active':index===selectColour}"
                @click="getColour(index)">{{item.product_color}}</div>
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="selectColour!==-1">
          <div class="ColCtn"
            style="width:100%">
            <div class="canvasCtn">
              <div class="mark"
                v-show="warpInfo.back_status===1||weftInfo.back_status===1">
                <span>正面</span>
              </div>
              <canvas ref="myCanvas"
                style="display:none"
                width="2400"
                :height="canvasHeight"></canvas>
              <img ref="img"
                @mousedown.prevent="showMagnifier=true"
                @mousemove="enlargeImg($event)"
                @mouseup="showMagnifier=false"
                :style="{'height':canvasHeight/4 + 'px'}"
                :class="{'cursorMagnifier':showMagnifier}"
                src="" />
              <canvas class="floatRightTop"
                ref="magnifier"
                width="200"
                height="200" />
            </div>
          </div>
        </div>
        <div class="rowCtn"
          v-show="selectColour!==-1&&(warpInfo.back_status===1||weftInfo.back_status===1)">
          <div class="ColCtn"
            style="width:100%">
            <div class="canvasCtn">
              <div class="mark">
                <span>反面</span>
              </div>
              <canvas ref="myCanvasBack"
                style="display:none"
                width="2400"
                :height="canvasHeight">
              </canvas>
              <!-- canvas转图像的容器 -->
              <img ref="imgBack"
                @mousedown.prevent="showMagnifierBack=true"
                @mousemove="enlargeImg($event,'back')"
                @mouseup="showMagnifierBack=false"
                :style="{'height':canvasHeight/4 + 'px'}"
                :class="{'cursorMagnifier':showMagnifierBack}"
                src="" />
              <!-- 利用canvas实现放大镜的容器 -->
              <canvas class="floatRightTop"
                ref="magnifierBack"
                width="200"
                height="200" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showGLFlag">
      <div class="main">
        <div class="title">
          <div class="text">预览纹版图</div>
          <i class="el-icon-close"
            @click="showGLFlag=false"></i>
        </div>
        <div class="content">
          <div class="GLCtns">
            <div class="rowLine"
              v-for="(item,index) in GLYulan"
              :key="index">
              <div class="col"
                v-for="(itemChild,indexChild) in item"
                :key="indexChild"
                :class="{'black':itemChild===1,'white':itemChild===0}"></div>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="showGLFlag = false">取消</div>
          <a href="#order"
            class="btn btnBlue"
            @click="showGLFlag = false">确定</a>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnOrange"
            @click="$router.push('/craft/craftUpdate/' + craftId + '/' + $route.params.type)">修改</div>
          <div class="btn btnBlue"
            @click="$router.push('/productPlan/productPlanCreate/'+$route.params.id+'/' + $route.params.type)">转为配料单</div>
          <div class="btn btnBlue"
            @click="$openUrl('/craftTable/' + $route.params.id + '/' + $route.params.type + '/' + craftId)">打印</div>
          <div class="btn btnBlue"
            @click="goPDF">转为PDF</div>
          <div class="btn btnRed"
            @click="deleteCraft">删除</div>
        </div>
      </div>
    </div>
    <!-- <div v-show="show3D"
      id="threeCtn"
      style="position:fixed;left:0;right:50%;top:0;bottom:50%;background:rgba(0,0,0,0.8);z-index:999;"></div> -->
  </div>
</template>

<script>
import * as THREE from 'three'
import { craft } from '@/assets/js/api.js'
import { HotTable } from '@handsontable/vue'
import enCH from '@/assets/js/language.js'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
Handsontable.languages.registerLanguageDictionary(enCH) // 注册中文字典
export default {
  components: {
    HotTable
  },
  data () {
    return {
      showGLFlag: false,
      GLYulan: [], // 预览纹版图
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      show3D: true,
      weftCmp: '1',
      loading: true,
      data: [], // 有多张工艺单的时候保存原始数据
      craftIndex: 0, // 样单有多张工艺单
      craftId: '', // 记录一下工艺单id用于删除接口
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
        materials: [],
        create_time: '',
        user_name: '',
        size: []
      },
      warpInfo: {
        color_data: '',
        weft: null, // 总头纹
        side_id: null, // 边形
        width: null, // 整经门幅
        machine_id: null, // 机型
        reed: null, // 筘号
        reed_method: null, // 穿筘法
        reed_width: null, // 筘幅
        reed_width_data: null, // 筘幅说明
        sum_up: null, // 综页
        drafting_method: null // 穿综法
        // additional_data: null// 穿综法备注
      },
      weftInfo: {
        color_data: '',
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
      yarn: {
        yarnWarp: {
          material_name: '',
          apply: []
        },
        yarnWeft: {
          material_name: '',
          apply: []
        },
        yarnOtherWarp: [],
        yarnOtherWeft: []
      },
      material: {
        materialWarp: [],
        materialWeft: []
      },
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
            let headerArr = ['序号', '主/夹', '根数', '合并项', '合并项', '纹版图']
            return `<div style="height:38px;line-height:38px;color:#666;display:table-row">${headerArr[index]}</div>`
          },
          rowHeaderWidth: 80,
          minCols: 1,
          autoColumnSize: true, // 自适应宽度
          cells: (row, col, prop) => {
            var cellProperties = {}
            cellProperties.readOnly = true
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
              // 清空节点并重新渲染
              Handsontable.dom.empty(td)
              let node = document.createElement('DIV')
              let CSS = td.style
              node.innerText = value
              td.appendChild(node)
              // 设置样式
              CSS.color = '#666'
              CSS.width = '38px'
              CSS.height = '38px'
              CSS.lineHeight = '38px'
              CSS.textAlign = 'center'
              if (row === 0) {
                CSS.background = '#F0F0F0'
              }
              return td
            }
            return cellProperties
          },
          contextMenu: false,
          className: 'handsontable',
          licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
          width: '100%',
          height: 250,
          mergeCells: []
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
            let headerArr = ['序号', '主/夹', '根数', '合并项', '合并项', '纹版图']
            return `<div style="height:38px;line-height:38px;color:#666;display:table-row">${headerArr[index]}</div>`
          },
          rowHeaderWidth: 80,
          minCols: 1,
          autoColumnSize: true, // 自适应宽度
          cells: (row, col, prop) => {
            var cellProperties = {}
            cellProperties.readOnly = true
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
              // 清空节点并重新渲染
              Handsontable.dom.empty(td)
              let node = document.createElement('DIV')
              let CSS = td.style
              node.innerText = value
              td.appendChild(node)
              // 设置样式
              CSS.color = '#666'
              CSS.width = '38px'
              CSS.height = '38px'
              CSS.lineHeight = '38px'
              CSS.textAlign = 'center'
              if (row === 0) {
                CSS.background = '#F0F0F0'
              }
              return td
            }
            return cellProperties
          },
          contextMenu: false,
          className: 'handsontable',
          licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
          width: '100%',
          height: 250,
          mergeCells: []
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
            return `<div style="height:38px;line-height:38px;color:#666;display:table-row">${headerArr[index]}</div>`
          },
          rowHeaderWidth: 80,
          minCols: 1,
          autoColumnSize: true, // 自适应宽度
          cells: (row, col, prop) => {
            var cellProperties = {}
            cellProperties.readOnly = true
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
              // 清空节点并重新渲染
              Handsontable.dom.empty(td)
              let node = document.createElement('DIV')
              let CSS = td.style
              node.innerText = value
              td.appendChild(node)
              // 设置样式
              CSS.color = '#666'
              CSS.width = '38px'
              CSS.height = '38px'
              CSS.lineHeight = '38px'
              CSS.textAlign = 'center'
              if (row === 0) {
                CSS.background = '#F0F0F0'
              }
              return td
            }
            return cellProperties
          },
          contextMenu: false,
          className: 'handsontable',
          licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
          width: '100%',
          height: 250,
          mergeCells: []
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
            return `<div style="height:38px;line-height:38px;color:#666;display:table-row">${headerArr[index]}</div>`
          },
          rowHeaderWidth: 80,
          minCols: 1,
          autoColumnSize: true, // 自适应宽度
          cells: (row, col, prop) => {
            var cellProperties = {}
            cellProperties.readOnly = true
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
              // 清空节点并重新渲染
              Handsontable.dom.empty(td)
              let node = document.createElement('DIV')
              let CSS = td.style
              node.innerText = value
              td.appendChild(node)
              // 设置样式
              CSS.color = '#666'
              CSS.width = '38px'
              CSS.height = '38px'
              CSS.lineHeight = '38px'
              CSS.textAlign = 'center'
              if (row === 0) {
                CSS.background = '#F0F0F0'
              }
              return td
            }
            return cellProperties
          },
          contextMenu: false,
          className: 'handsontable',
          licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
          width: '100%',
          height: 250,
          mergeCells: []
        }
      },
      PMFlag: 'normal',
      PM: [{
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
      // GL:graphic layout 纹版图缩写
      GL: [[['', '', '']]],
      GLFlag: 'normal',
      alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      romanNum: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'],
      canvasHeight: 0, // 图像高度
      showMagnifier: false,
      showMagnifierBack: false,
      warpCanvas: [], // 经纬向绘图数据
      weftCanvas: [],
      warpCanvasBack: [], // 反面
      weftCanvasBack: [],
      selectColour: -1, // 选择配色方案
      colorNumber: {
        warp: [],
        weft: []
      }, // 根数信息
      colorWeight: {
        warp: [],
        weft: []
      },
      weight: 0,
      coefficient: [],
      desc: '',
      ZDYMC: '',
      DSGG: '',
      DSKZ: ''
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
    // 预览纹版图
    showGL (GL) {
      let GLArr = []
      GL.forEach((item) => {
        item.forEach((itemChild) => {
          if (itemChild) {
            GLArr.push(itemChild.split(','))
          }
        })
      })
      let max = 0
      GLArr.forEach((item) => {
        item.forEach((itemChild) => {
          if (Number(itemChild) > max) {
            max = Number(itemChild)
          }
        })
      })
      GLArr = GLArr.map((item) => {
        return (new Array(max - 2)).fill(0).map((itemChild, indexChild) => {
          if (item.find((itemFind) => Number(itemFind) === (indexChild + 3))) {
            itemChild = 1
          }
          return itemChild
        })
      })
      // 把黑白格在经向和纬向上重复四遍
      GLArr = GLArr.map((item) => {
        return item.concat(item).concat(item)
      })
      this.GLYulan = []
      for (let i = 0; i < 3; i++) {
        GLArr.forEach((item) => {
          this.GLYulan.push(item)
        })
      }
      this.showGLFlag = true
    },
    goPDF () {
      if (this.warpInfo.color_data.length === 1) {
        this.$openUrl('/craftTableToPDF/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.craftId + '/' + 0)
      } else {
        if (this.selectColour === -1) {
          this.$message.error('请选择仿真图像的配色方案再预览PDF')
          return
        }
        this.$openUrl('/craftTableToPDF/' + this.$route.params.id + '/' + this.$route.params.type + '/' + this.craftId + '/' + this.selectColour)
      }
    },
    threeInit () {
      let container = document.getElementById('threeCtn')
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap
      container.appendChild(this.renderer.domElement)
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
      this.camera.position.set(0, 0, 75)
      this.scene.background = new THREE.Color(0xffffff)
      var light = new THREE.AmbientLight(0xffffff) // soft white light
      this.scene.add(light)
    },
    getMaterial (color) {
      return new THREE.MeshBasicMaterial({
        // alphaMap: new THREE.TextureLoader().load('https://zhihui.tlkrzf.com/1589175992000.png', function (texture) {
        //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        //   texture.repeat.y = 2
        //   texture.repeat.x = 8
        // }),
        // map: new THREE.TextureLoader().load('https://zhihui.tlkrzf.com/1589333949000.jpg', function (texture) {
        //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        //   texture.repeat.y = 1
        //   texture.repeat.x = 8
        // }),
        // metalness:0,
        // roughness: 0.5,
        // transparent:true,
        // alphaTest:0.2,
        color: color
        // emissive:0xc2682,
      })
    },
    drawRow () {
      let totalY = -1
      this.matrix3Drow.forEach((arr) => {
        let point = []
        let totalX = -1
        arr.forEach((boolValue) => {
          point.push(new THREE.Vector3(totalX, totalY, 0.04 * boolValue))
          totalX += 0.04
        })
        let curve = new THREE.CatmullRomCurve3(point)
        var curveGeometry = new THREE.TubeGeometry(curve, 4, 0.02, 4, false)
        let material = this.getMaterial(0x1A95FF)
        var mesh = new THREE.Mesh(curveGeometry, material)
        mesh.castShadow = true
        this.scene.add(mesh)
        totalY += 0.04
      })
    },
    drawCol () {
      let totalX = -1
      this.matrix3Dcol.forEach((arr) => {
        let point = []
        let totalY = -1
        arr.forEach((boolValue) => {
          point.push(new THREE.Vector3(totalX, totalY, 0.04 * boolValue))
          totalY += 0.04
        })
        let curve = new THREE.CatmullRomCurve3(point)
        var curveGeometry = new THREE.TubeGeometry(curve, 4, 0.02, 4, false)
        let material = this.getMaterial(0xff0000)
        var mesh = new THREE.Mesh(curveGeometry, material)
        mesh.castShadow = true
        this.scene.add(mesh)
        totalX += 0.04
      })
    },
    drawThree () {
      this.show3D = true
      this.$nextTick(() => {
        this.threeInit()
        this.drawRow()
        this.drawCol()
        this.animate()
      })
    },
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
    // 获取three数据
    getThreeData () {
      let warpData = this.warpCanvas
      let weftData = [...this.weftCanvas].reverse()
      this.matrix3Drow = [] // 横向
      this.matrix3Dcol = [] // 纵向
      warpData.forEach((itemWarp) => {
        this.matrix3Drow.push(
          weftData.map((itemWeft) => {
            return itemWeft.GL.replace(/，/g, ',').split(',').find((item) => item === itemWarp.PM) ? 1 : -1
          })
        )
      })
      weftData.forEach((itemWeft) => {
        this.matrix3Dcol.push(
          warpData.map((itemWarp) => {
            return itemWeft.GL.replace(/，/g, ',').split(',').find((item) => item === itemWarp.PM) ? -1 : 1
          })
        )
      })
    },
    openWin (cmd) {
      if (cmd === '修改') {
        this.$router.push('/index/designFormUpdate/' + this.$route.params.id)
      }
      if (cmd === '打印') {
        this.$router.push('/designFormTable/' + this.$route.params.id)
      }
      if (cmd === '删除') {
        this.$confirm('是否删除该工艺单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          craft.delelte({
            id: this.craftId
          }).then((res) => {
            if (res.data.status) {
              this.$message.success({
                message: '删除成功'
              })
              this.$router.push('/index/designFormList')
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
      }
      if (cmd === '添加配料单') {
        this.$router.push('/index/productPlanCreate/' + this.productInfo.product_id)
      }
    },
    // 设为默认
    setDefault () {
      craft.setDefault({
        id: this.craftId
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('设置成功')
        }
      })
    },
    // 展平合并信息
    getFlatTable (table, type, merge) {
      let tableArr = JSON.parse(table)
      let mergeTable = JSON.parse(this[type][merge])
      // 获取完整的合并项信息
      let firstMerge = this.getMergeInfo(mergeTable, 3, tableArr[0].length)
      let secondMerge = this.getMergeInfo(mergeTable, 4, tableArr[0].length)
      // 第一步，处理纹版图的合并信息
      let GLMerge = mergeTable.filter(item => item.row === 5)
      GLMerge.forEach((item) => {
        for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
          tableArr[item.row][i] = tableArr[item.row][item.col]
        }
      })
      // 第二步，处理合并项的合并信息
      let firstArr = []
      firstMerge.forEach((item) => {
        let temporaryStorage = [] // 临时存储合并项
        for (let i = item.col; i < (item.col + item.colspan); i++) {
          temporaryStorage.push({
            order: tableArr[0][i],
            color: tableArr[1][i],
            number: tableArr[2][i],
            GLorPM: tableArr[5][i]
          })
        }
        for (let i = 0; i < (tableArr[item.row][item.col] || 1); i++) {
          firstArr.push(temporaryStorage)
        }
      })
      let secondArr = []
      secondMerge.forEach((item) => {
        let temporaryStorage = firstArr.filter((itemFilter) => {
          return itemFilter[0].order > item.col && itemFilter[0].order <= (item.col + item.colspan)
        })
        for (let i = 0; i < (tableArr[item.row][item.col] || 1); i++) {
          secondArr.push(temporaryStorage)
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
    // 匹配主/夹名称
    filterMethods (index) {
      if (index === 0) {
        return '主'
      } else {
        return '夹' + index
      }
    },
    // 放大镜效果实现
    enlargeImg (point, ifBack) {
      // 放大镜效果实现
      if (this.showMagnifier && !ifBack) {
        const drawWidth = 50
        const drawHeight = 50
        let dom = this.$refs.magnifier
        let ctx = dom.getContext('2d')
        let img = this.$refs.img
        ctx.clearRect(0, 0, 200, 200)
        ctx.beginPath()
        ctx.drawImage(img, point.offsetX * 4 - drawWidth / 2, point.offsetY * 4 - drawHeight / 2, drawWidth, drawHeight, 0, 0, drawWidth * 4, drawHeight * 4)
      }
      if (this.showMagnifierBack && ifBack === 'back') {
        const drawWidth = 50
        const drawHeight = 50
        let dom = this.$refs.magnifierBack
        let ctx = dom.getContext('2d')
        let img = this.$refs.imgBack
        ctx.clearRect(0, 0, 200, 200)
        ctx.beginPath()
        ctx.drawImage(img, point.offsetX * 4 - drawWidth / 2, point.offsetY * 4 - drawHeight / 2, drawWidth, drawHeight, 0, 0, drawWidth * 4, drawHeight * 4)
      }
    },
    // 换颜色
    getColour (index) {
      this.loading = true
      this.selectColour = index
      window.scrollTo(0, 9999)
      setTimeout(() => {
        let warpColor = this.warpInfo.color_data[index].color_scheme
        let weftColor = this.weftInfo.color_data[index].color_scheme
        let canvasMatrix = []
        let canvasMatrixBack = []
        let warpWidth = 600 / this.warpCanvas.length * 4
        let weftWidth = this.canvasHeight / this.weftCanvas.length
        this.warpCanvas.reduce((totalWarp, itemWarp) => {
          let reverseWeft = [...this.weftCanvas].reverse() // 纬向要反着画,我也不知道为啥,注意reverse会改变原数组,所以修改下指向
          reverseWeft.reduce((totalWeft, itemWeft) => {
            canvasMatrix.push({
              x: totalWarp,
              y: totalWeft,
              width: warpWidth,
              height: weftWidth,
              color: itemWeft.GL.replace(/，/g, ',').split(',').find((item) => item === itemWarp.PM) ? warpColor[itemWarp.color].value : weftColor[itemWeft.color].value
            })
            return totalWeft + weftWidth
          }, 0)
          return totalWarp + warpWidth
        }, 0)
        this.warpCanvasBack.reduce((totalWarp, itemWarp) => {
          let reverseWeftBack = [...this.weftCanvasBack].reverse() // 纬向要反着画,我也不知道为啥,注意reverse会改变原数组,所以修改下指向
          reverseWeftBack.reverse().reduce((totalWeft, itemWeft) => {
            canvasMatrixBack.push({
              x: totalWarp,
              y: totalWeft,
              width: warpWidth,
              height: weftWidth,
              color: itemWeft.GL.replace(/，/g, ',').split(',').find((item) => item === itemWarp.PM) ? warpColor[itemWarp.color].value : weftColor[itemWeft.color].value
            })
            return totalWeft + weftWidth
          }, 0)
          return totalWarp + warpWidth
        }, 0)
        this.getThreeData()
        let dom = this.$refs.myCanvas
        let ctx = dom.getContext('2d')
        ctx.beginPath()
        ctx.clearRect(0, 0, 2400, this.canvasHeight)
        canvasMatrix.forEach((item) => {
          ctx.fillStyle = item.color
          ctx.fillRect(item.x, item.y, item.width, item.height)
        })
        let domBack = this.$refs.myCanvasBack
        let ctxBack = domBack.getContext('2d')
        ctxBack.beginPath()
        ctxBack.clearRect(0, 0, 2400, this.canvasHeight)
        canvasMatrixBack.forEach((item) => {
          ctxBack.fillStyle = item.color
          ctxBack.fillRect(item.x, item.y, item.width, item.height)
        })
        let img = this.$refs.img
        img.src = dom.toDataURL() // canvas转图片
        let imgBack = this.$refs.imgBack
        imgBack.src = domBack.toDataURL()
        this.loading = false
      }, 100)
    },
    init (data, index) {
      this.craftIndex = index
      this.selectColour = -1
      this.weight = 0
      this.craftId = data.id
      this.ZDYMC = data.title
      this.DSGG = data.size
      this.DSKZ = data.weight
      this.productInfo = data.product_info
      this.productInfo.craft_code = data.craft_code
      this.colorWeight = {
        warp: [],
        weft: []
      }
      this.colorNumber = {
        warp: [],
        weft: []
      }
      this.warpInfo = data.warp_data
      this.weftInfo = data.weft_data
      this.weftCmp = this.warpInfo.weight_calculate_formula
      this.yarn.yarnWarp = this.warpInfo.material_data.find((item) => item.type_material === 1)
      this.yarn.yarnWeft = this.weftInfo.material_data.find((item) => item.type_material === 1)
      this.yarn.yarnOtherWarp = this.warpInfo.material_data.filter((item) => item.type_material === 2)
      this.yarn.yarnOtherWeft = this.weftInfo.material_data.filter((item) => item.type_material === 2)
      this.material.materialWarp = this.warpInfo.assist_material
      this.material.materialWeft = this.weftInfo.assist_material
      this.coefficient = data.yarn_coefficient
      this.desc = data.desc
      this.tableData.warp.data = JSON.parse(this.warpInfo.warp_rank).map((item, index) => {
        return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
      })
      this.tableData.weft.data = JSON.parse(this.weftInfo.weft_rank).map((item, index) => {
        return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
      })
      this.tableData.warpBack.data = JSON.parse(this.warpInfo.warp_rank_back).map((item, index) => {
        return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
      })
      this.tableData.weftBack.data = JSON.parse(this.weftInfo.weft_rank_back).map((item, index) => {
        return index !== 1 ? item : item.map((itemJia) => { return this.filterMethods(itemJia) })
      })
      this.tableData.warp.mergeCells = JSON.parse(this.warpInfo.merge_data)
      this.tableData.weft.mergeCells = JSON.parse(this.weftInfo.merge_data)
      this.tableData.warpBack.mergeCells = JSON.parse(this.warpInfo.merge_data_back)
      this.tableData.weftBack.mergeCells = JSON.parse(this.weftInfo.merge_data_back)
      this.GL = data.draft_method.GL
      this.GLFlag = data.draft_method.GLFlag
      this.PM = data.draft_method.PM
      this.PMFlag = data.draft_method.PMFlag
      this.remarkPM = data.draft_method.desc
      // 计算克重信息
      let arrWarp = JSON.parse(this.warpInfo.warp_rank).slice(1, 5)
      this.tableData.warp.mergeCells.forEach((item) => {
        if (item.row === 3 || item.row === 4) {
          for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
            arrWarp[item.row - 1][i] = arrWarp[item.row - 1][item.col]
          }
        }
      })
      let arrWeft = JSON.parse(this.weftInfo.weft_rank).slice(1, 5)
      this.tableData.weft.mergeCells.forEach((item) => {
        if (item.row === 3 || item.row === 4) {
          for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
            arrWeft[item.row - 1][i] = arrWeft[item.row - 1][item.col]
          }
        }
      })
      let arrWarpBack = JSON.parse(this.warpInfo.warp_rank_back).slice(1, 5)
      this.tableData.warpBack.mergeCells.forEach((item) => {
        if (item.row === 3 || item.row === 4) {
          for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
            arrWarpBack[item.row - 1][i] = arrWarpBack[item.row - 1][item.col]
          }
        }
      })
      let arrWeftBack = JSON.parse(this.weftInfo.weft_rank_back).slice(1, 5)
      this.tableData.weftBack.mergeCells.forEach((item) => {
        if (item.row === 3 || item.row === 4) {
          for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
            arrWeftBack[item.row - 1][i] = arrWeftBack[item.row - 1][item.col]
          }
        }
      })
      for (let i = 0; i < arrWarp[0].length; i++) {
        const x = arrWarp[1][i] ? arrWarp[1][i] : 1
        const y = arrWarp[2][i] ? arrWarp[2][i] : 1
        const z = arrWarp[3][i] ? arrWarp[3][i] : 1
        this.colorNumber.warp[arrWarp[0][i]] = this.colorNumber.warp[arrWarp[0][i]] ? this.colorNumber.warp[arrWarp[0][i]] : 0
        this.colorNumber.warp[arrWarp[0][i]] += x * y * z
      }
      for (let i = 0; i < arrWeft[0].length; i++) {
        const x = arrWeft[1][i] ? arrWeft[1][i] : 1
        const y = arrWeft[2][i] ? arrWeft[2][i] : 1
        const z = arrWeft[3][i] ? arrWeft[3][i] : 1
        this.colorNumber.weft[arrWeft[0][i]] = this.colorNumber.weft[arrWeft[0][i]] ? this.colorNumber.weft[arrWeft[0][i]] : 0
        this.colorNumber.weft[arrWeft[0][i]] += x * y * z
      }
      for (let i = 0; i < arrWarpBack[0].length; i++) {
        const x = arrWarpBack[1][i] ? arrWarpBack[1][i] : 1
        const y = arrWarpBack[2][i] ? arrWarpBack[2][i] : 1
        const z = arrWarpBack[3][i] ? arrWarpBack[3][i] : 1
        this.colorNumber.warp[arrWarpBack[0][i]] = this.colorNumber.warp[arrWarpBack[0][i]] ? this.colorNumber.warp[arrWarpBack[0][i]] : 0
        this.colorNumber.warp[arrWarpBack[0][i]] += x * y * z
      }
      for (let i = 0; i < arrWeftBack[0].length; i++) {
        const x = arrWeftBack[1][i] ? arrWeftBack[1][i] : 1
        const y = arrWeftBack[2][i] ? arrWeftBack[2][i] : 1
        const z = arrWeftBack[3][i] ? arrWeftBack[3][i] : 1
        this.colorNumber.weft[arrWeftBack[0][i]] = this.colorNumber.weft[arrWeftBack[0][i]] ? this.colorNumber.weft[arrWeftBack[0][i]] : 0
        this.colorNumber.weft[arrWeftBack[0][i]] += x * y * z
      }
      this.warpInfo.material_data.forEach((item) => {
        item.apply.forEach((itemChild) => {
          this.colorWeight.warp[itemChild] = (this.colorNumber.warp[itemChild] * (this.weftInfo.neichang + this.weftInfo.rangwei) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1)
        })
      })
      this.weftInfo.material_data.forEach((item) => {
        item.apply.forEach((itemChild) => {
          this.colorWeight.weft[itemChild] = (this.colorNumber.weft[itemChild] * (Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1)
        })
      })
      this.material.materialWarp.forEach((item) => {
        item.apply = item.apply.map((index) => {
          return {
            number: index,
            weight: item.number * (this.colorNumber.warp[index] * (this.weftInfo.neichang + this.weftInfo.rangwei) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1)
          }
        })
      })
      this.material.materialWeft.forEach((item) => {
        item.apply = item.apply.map((index) => {
          return {
            number: index,
            weight: item.number * (this.colorNumber.weft[index] * (Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100).toFixed(1)
          }
        })
      })
      this.colorWeight.warp.forEach((item) => {
        this.weight += item === 'NaN' ? 0 : Number(item)
      })
      this.colorWeight.weft.forEach((item) => {
        this.weight += item === 'NaN' ? 0 : Number(item)
      })
      this.material.materialWarp.forEach((item) => {
        item.apply.forEach((itemApply) => {
          this.weight += (Number(itemApply.weight) === 'NaN' ? 0 : Number(itemApply.weight))
        })
      })
      this.material.materialWeft.forEach((item) => {
        item.apply.forEach((itemApply) => {
          this.weight += (Number(itemApply.weight) === 'NaN' ? 0 : Number(itemApply.weight))
        })
      })
      this.weight = this.weight.toFixed(1)

      this.canvasHeight = (this.weftInfo.neichang + this.weftInfo.rangwei) / (Number(this.weftCmp) === 1 ? this.warpInfo.reed_width : this.weftInfo.peifu) * 600 * 4
      // 展平合并信息
      let warpTable = this.getFlatTable(this.warpInfo.warp_rank, 'warpInfo', 'merge_data').map((item) => {
        if (!item.GLorPM) {
          item.GLorPM = 'Ⅰ'
        }
        return item
      })
      let weftTable = this.getFlatTable(this.weftInfo.weft_rank, 'weftInfo', 'merge_data').map((item) => {
        if (!item.GLorPM) {
          item.GLorPM = 'A'
        }
        return item
      })
      let warpTableBack = this.getFlatTable(this.warpInfo.warp_rank_back, 'warpInfo', 'merge_data_back').map((item) => {
        if (!item.GLorPM) {
          item.GLorPM = 'Ⅰ'
        }
        return item
      })
      let weftTableBack = this.getFlatTable(this.weftInfo.weft_rank_back, 'weftInfo', 'merge_data_back').map((item) => {
        if (!item.GLorPM) {
          item.GLorPM = 'A'
        }
        return item
      })
      // 将展开的合并信息结合穿综和纹版信息
      let warpGetPMNum = []
      let weftGetGLNum = []
      let warpGetPMNumBack = []
      let weftGetGLNumBack = []
      warpTable.forEach((item) => {
        let len = warpGetPMNum.length
        if (len > 0) {
          if (warpGetPMNum[len - 1].PM === item.GLorPM) {
            warpGetPMNum[len - 1].number += parseInt(item.number)
          } else {
            warpGetPMNum.push({
              PM: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          warpGetPMNum.push({
            PM: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      weftTable.forEach((item) => {
        let len = weftGetGLNum.length
        if (len > 0) {
          if (weftGetGLNum[len - 1].GL === item.GLorPM) {
            weftGetGLNum[len - 1].number += parseInt(item.number)
          } else {
            weftGetGLNum.push({
              GL: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          weftGetGLNum.push({
            GL: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      warpTableBack.forEach((item) => {
        let len = warpGetPMNumBack.length
        if (len > 0) {
          if (warpGetPMNumBack[len - 1].PM === item.GLorPM) {
            warpGetPMNumBack[len - 1].number += parseInt(item.number)
          } else {
            warpGetPMNumBack.push({
              PM: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          warpGetPMNumBack.push({
            PM: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      weftTableBack.forEach((item) => {
        let len = weftGetGLNumBack.length
        if (len > 0) {
          if (weftGetGLNumBack[len - 1].GL === item.GLorPM) {
            weftGetGLNumBack[len - 1].number += parseInt(item.number)
          } else {
            weftGetGLNumBack.push({
              GL: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          weftGetGLNumBack.push({
            GL: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      let warpGetPM = []
      let weftGetGL = []
      let warpGetPMBack = []
      let weftGetGLBack = []
      warpGetPMNum.forEach((item) => {
        // 高级穿综
        if (this.PMFlag === 'complex') {
          let PM = this.PM[this.romanNum.indexOf(item.PM)]
          let PMFlatArr = []
          PM.children.forEach((itemPM) => {
            let PMVal = []
            itemPM.children.forEach((itemChildren) => {
              for (let i = 0; i < parseInt(itemChildren.repeat); i++) {
                PMVal = PMVal.concat(itemChildren.value.split(','))
              }
            })
            let times = parseInt(itemPM.number / PMVal.length) // 循环次数
            let remainder = itemPM.number % PMVal.length // 取余数
            for (let i = 0; i < times; i++) {
              PMFlatArr = PMFlatArr.concat(PMVal)
            }
            PMFlatArr = PMFlatArr.concat(PMVal.filter((item, index) => index < remainder))
          })
          let times = parseInt(item.number / PMFlatArr.length)
          let remainder = item.number % PMFlatArr.length
          for (let i = 0; i < times; i++) {
            warpGetPM = warpGetPM.concat(PMFlatArr)
          }
          warpGetPM = warpGetPM.concat(PMFlatArr.filter((item, index) => index < remainder))
        } else {
          // 穿综法普通逻辑
          // let PM = this.PM[this.romanNum.indexOf(item.PM)]
          // let PMArr = PM.value.split(',')
          // let times = parseInt(item.number / PMArr.length)
          // let remainder = PM.number % PMArr.length
          // for (let i = 0; i < times; i++) {
          //   warpGetPM = warpGetPM.concat(PMArr)
          // }
          // warpGetPM = warpGetPM.concat(PMArr.filter((item, index) => index < remainder))
        }
      })
      // 穿综法普通逻辑独立
      if (this.PMFlag === 'normal') {
        this.PM.forEach((item) => {
          let PMArr = item.value.split(',')
          let times = parseInt(item.number / PMArr.length)
          let remainder = item.number % PMArr.length
          for (let i = 0; i < times; i++) {
            warpGetPM = warpGetPM.concat(PMArr)
          }
          warpGetPM = warpGetPM.concat(PMArr.filter((item, index) => index < remainder))
        })
      }
      weftGetGLNum.forEach((item) => {
        let GL = this.mergeArray(this.GL[this.alphabet.indexOf(item.GL)]).filter((item) => item) // 剔除null
        let times = parseInt(item.number / GL.length)
        let remainder = item.number % GL.length
        for (let i = 0; i < times; i++) {
          weftGetGL = weftGetGL.concat(GL)
        }
        weftGetGL = weftGetGL.concat(GL.filter((item, index) => index < remainder))
      })
      warpGetPMNumBack.forEach((item) => {
        // 高级穿综
        if (this.PMFlag === 'complex') {
          let PM = this.PM[this.romanNum.indexOf(item.PM)]
          let PMFlatArr = []
          PM.children.forEach((itemPM) => {
            let PMVal = []
            itemPM.children.forEach((itemChildren) => {
              for (let i = 0; i < parseInt(itemChildren.repeat); i++) {
                PMVal = PMVal.concat(itemChildren.value.split(','))
              }
            })
            let times = parseInt(itemPM.number / PMVal.length) // 循环次数
            let remainder = itemPM.number % PMVal.length // 取余数
            for (let i = 0; i < times; i++) {
              PMFlatArr = PMFlatArr.concat(PMVal)
            }
            PMFlatArr = PMFlatArr.concat(PMVal.filter((item, index) => index < remainder))
          })
          let times = parseInt(item.number / PMFlatArr.length)
          let remainder = item.number % PMFlatArr.length
          for (let i = 0; i < times; i++) {
            warpGetPMBack = warpGetPMBack.concat(PMFlatArr)
          }
          warpGetPMBack = warpGetPMBack.concat(PMFlatArr.filter((item, index) => index < remainder))
        } else {
          // let PM = this.PM[this.romanNum.indexOf(item.PM)]
          // let PMArr = PM.value.split(',')
          // let times = parseInt(PM.number / PMArr.length)
          // let remainder = item.number % PMArr.length
          // for (let i = 0; i < times; i++) {
          //   warpGetPMBack = warpGetPMBack.concat(PMArr)
          // }
          // warpGetPMBack = warpGetPMBack.concat(PMArr.filter((item, index) => index < remainder))
        }
      })
      // 穿综法普通逻辑独立 -背面
      if (this.PMFlag === 'normal') {
        this.PM.forEach((item) => {
          let PMArr = item.value.split(',')
          let times = parseInt(item.number / PMArr.length)
          let remainder = item.number % PMArr.length
          for (let i = 0; i < times; i++) {
            warpGetPMBack = warpGetPMBack.concat(PMArr)
          }
          warpGetPMBack = warpGetPMBack.concat(PMArr.filter((item, index) => index < remainder))
        })
      }
      weftGetGLNumBack.forEach((item) => {
        let GL = this.mergeArray(this.GL[this.alphabet.indexOf(item.GL)]).filter((item) => item) // 剔除null
        let times = parseInt(item.number / GL.length)
        let remainder = item.number % GL.length
        for (let i = 0; i < times; i++) {
          weftGetGLBack = weftGetGLBack.concat(GL)
        }
        weftGetGLBack = weftGetGLBack.concat(GL.filter((item, index) => index < remainder))
      })
      // 获取画图数据
      let warpCanvas = []
      let weftCanvas = []
      let warpCanvasBack = []
      let weftCanvasBack = []
      warpTable.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          warpCanvas.push({
            color: item.color,
            PM: warpGetPM[warpCanvas.length]
          })
        }
      })
      weftTable.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          weftCanvas.push({
            color: item.color,
            GL: weftGetGL[weftCanvas.length]
          })
        }
      })
      warpTableBack.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          warpCanvasBack.push({
            color: item.color,
            PM: warpGetPMBack[warpCanvasBack.length]
          })
        }
      })
      weftTableBack.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          weftCanvasBack.push({
            color: item.color,
            GL: weftGetGLBack[weftCanvasBack.length]
          })
        }
      })
      // 保存下画图数据，方便在切换配色的时候使用
      this.warpCanvas = warpCanvas
      this.weftCanvas = weftCanvas
      if (this.warpInfo.back_status === 1 && this.weftInfo.back_status === 1) {
        this.warpCanvasBack = warpCanvasBack
        this.weftCanvasBack = weftCanvasBack
      } else if (this.warpInfo.back_status === 1 && this.weftInfo.back_status === 0) {
        this.warpCanvasBack = warpCanvasBack
        this.weftCanvasBack = weftCanvas
      } else if (this.warpInfo.back_status === 0 && this.weftInfo.back_status === 1) {
        this.warpCanvasBack = warpCanvas
        this.weftCanvasBack = weftCanvasBack
      }
    },
    deleteCraft () {
      this.$confirm('此操作将永久删除该工艺单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        craft.delete({
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
  created () {
    craft.getByProduct({
      product_id: this.$route.params.id,
      product_type: this.$route.params.type
    }).then((res) => {
      if (res.data.status) {
        if (this.$route.params.type === '1') {
          this.init(res.data.data, 0)
        } else {
          this.data = res.data.data
          this.data.forEach((item, index) => {
            if (item.is_default === 1) {
              this.craftIndex = index
            }
          })
          this.init(this.data[this.craftIndex], this.craftIndex)
        }
        this.loading = false
      }
    })
  },
  mounted () {
    function OrbitConstraint (object) {
      this.object = object

      // "target" sets the location of focus, where the object orbits around
      // and where it pans with respect to.
      this.target = new THREE.Vector3()

      // Limits to how far you can dolly in and out ( PerspectiveCamera only )
      this.minDistance = 0
      this.maxDistance = Infinity

      // Limits to how far you can zoom in and out ( OrthographicCamera only )
      this.minZoom = 0
      this.maxZoom = Infinity

      // How far you can orbit vertically, upper and lower limits.
      // Range is 0 to Math.PI radians.
      this.minPolarAngle = 0 // radians
      this.maxPolarAngle = Math.PI // radians

      // How far you can orbit horizontally, upper and lower limits.
      // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
      this.minAzimuthAngle = -Infinity // radians
      this.maxAzimuthAngle = Infinity // radians

      // Set to true to enable damping (inertia)
      // If damping is enabled, you must call controls.update() in your animation loop
      this.enableDamping = false
      this.dampingFactor = 0.25

      /// /////////
      // internals

      var scope = this

      var EPS = 0.000001

      // Current position in spherical coordinate system.
      var theta
      var phi

      // Pending changes
      var phiDelta = 0
      var thetaDelta = 0
      var scale = 1
      var panOffset = new THREE.Vector3()
      var zoomChanged = false

      // API

      this.getPolarAngle = function () {
        return phi
      }

      this.getAzimuthalAngle = function () {
        return theta
      }

      this.rotateLeft = function (angle) {
        thetaDelta -= angle
      }

      this.rotateUp = function (angle) {
        phiDelta -= angle
      }

      // pass in distance in world space to move left
      this.panLeft = (function () {
        var v = new THREE.Vector3()

        return function panLeft (distance) {
          var te = this.object.matrix.elements

          // get X column of matrix
          v.set(te[0], te[1], te[2])
          v.multiplyScalar(-distance)

          panOffset.add(v)
        }
      }())

      // pass in distance in world space to move up
      this.panUp = (function () {
        var v = new THREE.Vector3()

        return function panUp (distance) {
          var te = this.object.matrix.elements

          // get Y column of matrix
          v.set(te[4], te[5], te[6])
          v.multiplyScalar(distance)

          panOffset.add(v)
        }
      }())

      // pass in x,y of change desired in pixel space,
      // right and down are positive
      this.pan = function (deltaX, deltaY, screenWidth, screenHeight) {
        if (scope.object instanceof THREE.PerspectiveCamera) {
          // perspective
          var position = scope.object.position
          var offset = position.clone().sub(scope.target)
          var targetDistance = offset.length()

          // half of the fov is center to top of screen
          targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0)

          // we actually don't use screenWidth, since perspective camera is fixed to screen height
          scope.panLeft(2 * deltaX * targetDistance / screenHeight)
          scope.panUp(2 * deltaY * targetDistance / screenHeight)
        } else if (scope.object instanceof THREE.OrthographicCamera) {
          // orthographic
          scope.panLeft(deltaX * (scope.object.right - scope.object.left) / screenWidth)
          scope.panUp(deltaY * (scope.object.top - scope.object.bottom) / screenHeight)
        } else {
          // camera neither orthographic or perspective
          console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.')
        }
      }

      this.dollyIn = function (dollyScale) {
        if (scope.object instanceof THREE.PerspectiveCamera) {
          scale /= dollyScale
        } else if (scope.object instanceof THREE.OrthographicCamera) {
          scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * dollyScale))
          scope.object.updateProjectionMatrix()
          zoomChanged = true
        } else {
          console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.')
        }
      }

      this.dollyOut = function (dollyScale) {
        if (scope.object instanceof THREE.PerspectiveCamera) {
          scale *= dollyScale
        } else if (scope.object instanceof THREE.OrthographicCamera) {
          scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / dollyScale))
          scope.object.updateProjectionMatrix()
          zoomChanged = true
        } else {
          console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.')
        }
      }

      this.update = (function () {
        var offset = new THREE.Vector3()

        // so camera.up is the orbit axis
        var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0))
        var quatInverse = quat.clone().inverse()

        var lastPosition = new THREE.Vector3()
        var lastQuaternion = new THREE.Quaternion()

        return function () {
          var position = this.object.position

          offset.copy(position).sub(this.target)

          // rotate offset to "y-axis-is-up" space
          offset.applyQuaternion(quat)

          // angle from z-axis around y-axis

          theta = Math.atan2(offset.x, offset.z)

          // angle from y-axis

          phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y)

          theta += thetaDelta
          phi += phiDelta

          // restrict theta to be between desired limits
          theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, theta))

          // restrict phi to be between desired limits
          phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi))

          // restrict phi to be betwee EPS and PI-EPS
          phi = Math.max(EPS, Math.min(Math.PI - EPS, phi))

          var radius = offset.length() * scale

          // restrict radius to be between desired limits
          radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius))

          // move target to panned location
          this.target.add(panOffset)

          offset.x = radius * Math.sin(phi) * Math.sin(theta)
          offset.y = radius * Math.cos(phi)
          offset.z = radius * Math.sin(phi) * Math.cos(theta)

          // rotate offset back to "camera-up-vector-is-up" space
          offset.applyQuaternion(quatInverse)

          position.copy(this.target).add(offset)

          this.object.lookAt(this.target)

          if (this.enableDamping === true) {
            thetaDelta *= (1 - this.dampingFactor)
            phiDelta *= (1 - this.dampingFactor)
          } else {
            thetaDelta = 0
            phiDelta = 0
          }

          scale = 1
          panOffset.set(0, 0, 0)

          // update condition is:
          // min(camera displacement, camera rotation in radians)^2 > EPS
          // using small-angle approximation cos(x/2) = 1 - x^2 / 8

          if (zoomChanged ||
            lastPosition.distanceToSquared(this.object.position) > EPS ||
            8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS) {
            lastPosition.copy(this.object.position)
            lastQuaternion.copy(this.object.quaternion)
            zoomChanged = false

            return true
          }

          return false
        }
      }())
    };
    THREE.OrbitControls = function (object, domElement) {
      var constraint = new OrbitConstraint(object)

      this.domElement = (domElement !== undefined) ? domElement : document

      // API

      Object.defineProperty(this, 'constraint', {

        get: function () {
          return constraint
        }

      })

      this.getPolarAngle = function () {
        return constraint.getPolarAngle()
      }

      this.getAzimuthalAngle = function () {
        return constraint.getAzimuthalAngle()
      }

      // Set to false to disable this control
      this.enabled = true

      // center is old, deprecated; use "target" instead
      this.center = this.target

      // This option actually enables dollying in and out; left as "zoom" for
      // backwards compatibility.
      // Set to false to disable zooming
      this.enableZoom = true
      this.zoomSpeed = 1.0

      // Set to false to disable rotating
      this.enableRotate = true
      this.rotateSpeed = 1.0

      // Set to false to disable panning
      this.enablePan = true
      // eslint-disable-next-line no-tabs
      this.keyPanSpeed = 7.0	// pixels moved per arrow key push

      // Set to true to automatically rotate around the target
      // If auto-rotate is enabled, you must call controls.update() in your animation loop
      this.autoRotate = false
      this.autoRotateSpeed = 2.0 // 30 seconds per round when fps is 60

      // Set to false to disable use of the keys
      this.enableKeys = true

      // The four arrow keys
      this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }

      // Mouse buttons
      this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT }

      /// /////////
      // internals

      var scope = this

      var rotateStart = new THREE.Vector2()
      var rotateEnd = new THREE.Vector2()
      var rotateDelta = new THREE.Vector2()

      var panStart = new THREE.Vector2()
      var panEnd = new THREE.Vector2()
      var panDelta = new THREE.Vector2()

      var dollyStart = new THREE.Vector2()
      var dollyEnd = new THREE.Vector2()
      var dollyDelta = new THREE.Vector2()

      var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 }

      var state = STATE.NONE

      // for reset

      this.target0 = this.target.clone()
      this.position0 = this.object.position.clone()
      this.zoom0 = this.object.zoom

      // events

      var changeEvent = { type: 'change' }
      var startEvent = { type: 'start' }
      var endEvent = { type: 'end' }

      // pass in x,y of change desired in pixel space,
      // right and down are positive
      function pan (deltaX, deltaY) {
        var element = scope.domElement === document ? scope.domElement.body : scope.domElement

        constraint.pan(deltaX, deltaY, element.clientWidth, element.clientHeight)
      }

      this.update = function () {
        if (this.autoRotate && state === STATE.NONE) {
          constraint.rotateLeft(getAutoRotationAngle())
        }

        if (constraint.update() === true) {
          this.dispatchEvent(changeEvent)
        }
      }

      this.reset = function () {
        state = STATE.NONE

        this.target.copy(this.target0)
        this.object.position.copy(this.position0)
        this.object.zoom = this.zoom0

        this.object.updateProjectionMatrix()
        this.dispatchEvent(changeEvent)

        this.update()
      }

      function getAutoRotationAngle () {
        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed
      }

      function getZoomScale () {
        return Math.pow(0.95, scope.zoomSpeed)
      }

      function onMouseDown (event) {
        if (scope.enabled === false) return

        event.preventDefault()

        if (event.button === scope.mouseButtons.ORBIT) {
          if (scope.enableRotate === false) return

          state = STATE.ROTATE

          rotateStart.set(event.clientX, event.clientY)
        } else if (event.button === scope.mouseButtons.ZOOM) {
          if (scope.enableZoom === false) return

          state = STATE.DOLLY

          dollyStart.set(event.clientX, event.clientY)
        } else if (event.button === scope.mouseButtons.PAN) {
          if (scope.enablePan === false) return

          state = STATE.PAN

          panStart.set(event.clientX, event.clientY)
        }

        if (state !== STATE.NONE) {
          document.addEventListener('mousemove', onMouseMove, false)
          document.addEventListener('mouseup', onMouseUp, false)
          scope.dispatchEvent(startEvent)
        }
      }

      function onMouseMove (event) {
        if (scope.enabled === false) return

        event.preventDefault()

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement

        if (state === STATE.ROTATE) {
          if (scope.enableRotate === false) return

          rotateEnd.set(event.clientX, event.clientY)
          rotateDelta.subVectors(rotateEnd, rotateStart)

          // rotating across whole screen goes 360 degrees around
          constraint.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed)

          // rotating up and down along whole screen attempts to go 360, but limited to 180
          constraint.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed)

          rotateStart.copy(rotateEnd)
        } else if (state === STATE.DOLLY) {
          if (scope.enableZoom === false) return

          dollyEnd.set(event.clientX, event.clientY)
          dollyDelta.subVectors(dollyEnd, dollyStart)

          if (dollyDelta.y > 0) {
            constraint.dollyIn(getZoomScale())
          } else if (dollyDelta.y < 0) {
            constraint.dollyOut(getZoomScale())
          }

          dollyStart.copy(dollyEnd)
        } else if (state === STATE.PAN) {
          if (scope.enablePan === false) return

          panEnd.set(event.clientX, event.clientY)
          panDelta.subVectors(panEnd, panStart)

          pan(panDelta.x, panDelta.y)

          panStart.copy(panEnd)
        }

        if (state !== STATE.NONE) scope.update()
      }

      function onMouseUp (/* event */) {
        if (scope.enabled === false) return

        document.removeEventListener('mousemove', onMouseMove, false)
        document.removeEventListener('mouseup', onMouseUp, false)
        scope.dispatchEvent(endEvent)
        state = STATE.NONE
      }

      function onMouseWheel (event) {
        if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE) return

        event.preventDefault()
        event.stopPropagation()

        var delta = 0

        if (event.wheelDelta !== undefined) {
          // WebKit / Opera / Explorer 9

          delta = event.wheelDelta
        } else if (event.detail !== undefined) {
          // Firefox

          delta = -event.detail
        }

        if (delta > 0) {
          constraint.dollyOut(getZoomScale())
        } else if (delta < 0) {
          constraint.dollyIn(getZoomScale())
        }

        scope.update()
        scope.dispatchEvent(startEvent)
        scope.dispatchEvent(endEvent)
      }

      function onKeyDown (event) {
        if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) return

        switch (event.keyCode) {
          case scope.keys.UP:
            pan(0, scope.keyPanSpeed)
            scope.update()
            break

          case scope.keys.BOTTOM:
            pan(0, -scope.keyPanSpeed)
            scope.update()
            break

          case scope.keys.LEFT:
            pan(scope.keyPanSpeed, 0)
            scope.update()
            break

          case scope.keys.RIGHT:
            pan(-scope.keyPanSpeed, 0)
            scope.update()
            break
        }
      }

      function touchstart (event) {
        if (scope.enabled === false) return

        switch (event.touches.length) {
          case 1:

            if (scope.enableRotate === false) return

            state = STATE.TOUCH_ROTATE

            rotateStart.set(event.touches[0].pageX, event.touches[0].pageY)
            break

          case 2:

            if (scope.enableZoom === false) return

            state = STATE.TOUCH_DOLLY

            var dx = event.touches[0].pageX - event.touches[1].pageX
            var dy = event.touches[0].pageY - event.touches[1].pageY
            var distance = Math.sqrt(dx * dx + dy * dy)
            dollyStart.set(0, distance)
            break

          case 3: // three-fingered touch: pan

            if (scope.enablePan === false) return

            state = STATE.TOUCH_PAN

            panStart.set(event.touches[0].pageX, event.touches[0].pageY)
            break

          default:

            state = STATE.NONE
        }

        if (state !== STATE.NONE) scope.dispatchEvent(startEvent)
      }

      function touchmove (event) {
        if (scope.enabled === false) return

        event.preventDefault()
        event.stopPropagation()

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement

        switch (event.touches.length) {
          case 1: // one-fingered touch: rotate

            if (scope.enableRotate === false) return
            if (state !== STATE.TOUCH_ROTATE) return

            rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY)
            rotateDelta.subVectors(rotateEnd, rotateStart)

            // rotating across whole screen goes 360 degrees around
            constraint.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed)
            // rotating up and down along whole screen attempts to go 360, but limited to 180
            constraint.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed)

            rotateStart.copy(rotateEnd)

            scope.update()
            break

          case 2: // two-fingered touch: dolly

            if (scope.enableZoom === false) return
            if (state !== STATE.TOUCH_DOLLY) return

            var dx = event.touches[0].pageX - event.touches[1].pageX
            var dy = event.touches[0].pageY - event.touches[1].pageY
            var distance = Math.sqrt(dx * dx + dy * dy)

            dollyEnd.set(0, distance)
            dollyDelta.subVectors(dollyEnd, dollyStart)

            if (dollyDelta.y > 0) {
              constraint.dollyOut(getZoomScale())
            } else if (dollyDelta.y < 0) {
              constraint.dollyIn(getZoomScale())
            }

            dollyStart.copy(dollyEnd)

            scope.update()
            break

          case 3: // three-fingered touch: pan

            if (scope.enablePan === false) return
            if (state !== STATE.TOUCH_PAN) return

            panEnd.set(event.touches[0].pageX, event.touches[0].pageY)
            panDelta.subVectors(panEnd, panStart)

            pan(panDelta.x, panDelta.y)

            panStart.copy(panEnd)

            scope.update()
            break

          default:

            state = STATE.NONE
        }
      }

      function touchend (/* event */) {
        if (scope.enabled === false) return

        scope.dispatchEvent(endEvent)
        state = STATE.NONE
      }

      function contextmenu (event) {
        event.preventDefault()
      }

      this.dispose = function () {
        this.domElement.removeEventListener('contextmenu', contextmenu, false)
        this.domElement.removeEventListener('mousedown', onMouseDown, false)
        this.domElement.removeEventListener('mousewheel', onMouseWheel, false)
        this.domElement.removeEventListener('MozMousePixelScroll', onMouseWheel, false) // firefox

        this.domElement.removeEventListener('touchstart', touchstart, false)
        this.domElement.removeEventListener('touchend', touchend, false)
        this.domElement.removeEventListener('touchmove', touchmove, false)

        document.removeEventListener('mousemove', onMouseMove, false)
        document.removeEventListener('mouseup', onMouseUp, false)

        window.removeEventListener('keydown', onKeyDown, false)
      }

      this.domElement.addEventListener('contextmenu', contextmenu, false)

      this.domElement.addEventListener('mousedown', onMouseDown, false)
      this.domElement.addEventListener('mousewheel', onMouseWheel, false)
      this.domElement.addEventListener('MozMousePixelScroll', onMouseWheel, false) // firefox

      this.domElement.addEventListener('touchstart', touchstart, false)
      this.domElement.addEventListener('touchend', touchend, false)
      this.domElement.addEventListener('touchmove', touchmove, false)

      window.addEventListener('keydown', onKeyDown, false)

      // force an update at start
      this.update()
    }
    THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype)
    THREE.OrbitControls.prototype.constructor = THREE.OrbitControls
    Object.defineProperties(THREE.OrbitControls.prototype, {

      object: {

        get: function () {
          return this.constraint.object
        }

      },

      target: {

        get: function () {
          return this.constraint.target
        },

        set: function (value) {
          console.warn('THREE.OrbitControls: target is now immutable. Use target.set() instead.')
          this.constraint.target.copy(value)
        }

      },

      minDistance: {

        get: function () {
          return this.constraint.minDistance
        },

        set: function (value) {
          this.constraint.minDistance = value
        }

      },

      maxDistance: {

        get: function () {
          return this.constraint.maxDistance
        },

        set: function (value) {
          this.constraint.maxDistance = value
        }

      },

      minZoom: {

        get: function () {
          return this.constraint.minZoom
        },

        set: function (value) {
          this.constraint.minZoom = value
        }

      },

      maxZoom: {

        get: function () {
          return this.constraint.maxZoom
        },

        set: function (value) {
          this.constraint.maxZoom = value
        }

      },

      minPolarAngle: {

        get: function () {
          return this.constraint.minPolarAngle
        },

        set: function (value) {
          this.constraint.minPolarAngle = value
        }

      },

      maxPolarAngle: {

        get: function () {
          return this.constraint.maxPolarAngle
        },

        set: function (value) {
          this.constraint.maxPolarAngle = value
        }

      },

      minAzimuthAngle: {

        get: function () {
          return this.constraint.minAzimuthAngle
        },

        set: function (value) {
          this.constraint.minAzimuthAngle = value
        }

      },

      maxAzimuthAngle: {

        get: function () {
          return this.constraint.maxAzimuthAngle
        },

        set: function (value) {
          this.constraint.maxAzimuthAngle = value
        }

      },

      enableDamping: {

        get: function () {
          return this.constraint.enableDamping
        },

        set: function (value) {
          this.constraint.enableDamping = value
        }

      },

      dampingFactor: {

        get: function () {
          return this.constraint.dampingFactor
        },

        set: function (value) {
          this.constraint.dampingFactor = value
        }

      },

      // backward compatibility

      noZoom: {

        get: function () {
          console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.')
          return !this.enableZoom
        },

        set: function (value) {
          console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.')
          this.enableZoom = !value
        }

      },

      noRotate: {

        get: function () {
          console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.')
          return !this.enableRotate
        },

        set: function (value) {
          console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.')
          this.enableRotate = !value
        }

      },

      noPan: {

        get: function () {
          console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.')
          return !this.enablePan
        },

        set: function (value) {
          console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.')
          this.enablePan = !value
        }

      },

      noKeys: {

        get: function () {
          console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.')
          return !this.enableKeys
        },

        set: function (value) {
          console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.')
          this.enableKeys = !value
        }

      },

      staticMoving: {

        get: function () {
          console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.')
          return !this.constraint.enableDamping
        },

        set: function (value) {
          console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.')
          this.constraint.enableDamping = !value
        }

      },

      dynamicDampingFactor: {

        get: function () {
          console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.')
          return this.constraint.dampingFactor
        },

        set: function (value) {
          console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.')
          this.constraint.dampingFactor = value
        }

      }

    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/craft/craftDetail.less";
</style>
<style lang="less">
#craftDetail {
  .GLCtn {
    .el-input.is-disabled .el-input__inner {
      height: 32px !important;
      margin-bottom: 15px;
    }
  }
  .el-input.is-disabled .el-input__inner {
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    cursor: default;
  }
  .treeCtn {
    .el-input__inner {
      border: 0 !important;
    }
  }
}
</style>
