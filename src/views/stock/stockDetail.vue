<template>
  <div id='stockDetail'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <div class="title">仓库信息</div>
      </div>
      <div class="detailCtn">
        <!-- <div class="floatRight">
          <div class="btnCtn">
            <div class="btn btnBlue">打印标签</div>
          </div>
        </div> -->
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">仓库名称：</span>
            <span class="text">{{stockInfo.name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">仓库类型：</span>
            <span class="text">{{stockInfo.type|filterType}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">管理员：</span>
            <span class="text">{{stockInfo.attendant.map(item=>item.user_name).join(',')}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">备注：</span>
            <span class="text">{{stockInfo.desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 原料仓库信息 -->
    <template v-if="stockInfo.type === 1">
      <div class="module">
        <div class="titleCtn">
          <div class="title">原料库存信息</div>
        </div>
        <div class="listCtn hasBorderTop">
          <div class="filterCtn">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <el-input class="inputs"
                v-model="searchYarn"
                placeholder="输入原料按回车键查询"
                @change="getYarnList(1)">
              </el-input>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterYarnList')">重置</div>
            </div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row">原料名称</span>
              <span class="tb_row">原料属性</span>
              <span class="tb_row">库存数量（kg）</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemMa,indexMa) in yarnList"
              :key="indexMa">
              <span class="tb_row">{{itemMa.material_name}}</span>
              <span class="tb_row">{{itemMa.material_color}}</span>
              <span class="tb_row">{{itemMa.total_weight}}</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click="updatedInfo(itemMa,'out','yarn')">出库</span>
                <span class="tb_handle_btn blue"
                  @click="updatedInfo(itemMa,'go','yarn')">入库</span>
                <span class="tb_handle_btn blue"
                  @click="goLog(itemMa,'yarn')">日志</span>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="yarnTotal"
              :current-page.sync="yarnPages"
              @current-change='getYarnList'>
            </el-pagination>
          </div>
          <div class="editCtn bgGary_page"
            v-for="(itemYarn,indexYarn) in yarnEditInfo"
            :key="indexYarn">
            <span class="closeIcon_page el-icon-circle-close"
              @click="deleteItem(yarnEditInfo,indexYarn,true)"></span>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">原料名称</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <!-- <el-select v-model="itemYarn.yarnName"
                    filterable
                    default-first-option
                    clearable
                    allow-create
                    placeholder="请选择需要操作的原料">
                    <el-option v-for="item in yarnNameList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select> -->
                  <el-autocomplete v-model="itemYarn.yarnName"
                    clearable
                    :fetch-suggestions="querySearchYarn"
                    placeholder="请选择需要操作的原料"></el-autocomplete>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">操作类型</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content middle_page col">
                  <el-radio-group v-model="itemYarn.editType">
                    <el-radio label="out">出库</el-radio>
                    <el-radio label="go">入库</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text"></span>
                </div>
                <div class="content"></div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">原料属性</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-autocomplete v-model="itemYarn.attr"
                    :fetch-suggestions="handleSelect"
                    placeholder="请输入原料属性"></el-autocomplete>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">操作数量</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <zh-input placeholder="请输入操作数量"
                    v-model="itemYarn.number"
                    type='number'></zh-input>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">备注</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-autocomplete v-model="itemYarn.remark"
                    :fetch-suggestions="querySearchRemark"
                    placeholder="请输入备注"></el-autocomplete>
                </div>
              </div>
            </div>
          </div>
          <div class="btnCtn_page right marginTop20">
            <div class="btn btnDashed"
              v-show="yarnEditInfo.length > 0"
              @click="resetEditInfo('yarn')">重置</div>
            <div class="btn btnDashed bgBlue_page"
              v-if="yarnEditInfo.length === 0"
              @click="addItem(yarnEditInfo,'yarn')">+添加出入库</div>
            <div class="btn btnDashed"
              v-else
              @click="addItem(yarnEditInfo,'yarn')">
              <div class="btn btnOrange">+添加出入库</div>
            </div>
            <div class="btn btnDashed"
              v-show="yarnEditInfo.length > 0">
              <div class="btn btnBlue"
                @click="saveYarn">保存</div>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <div class="title">原料出入库日志</div>
        </div>
        <div class="listCtn hasBorderTop">
          <div class="filterCtn">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <el-input class="inputs"
                v-model="searchYarnLog"
                placeholder="输入原料按回车键查询"
                @change="getYarnLog(1)">
              </el-input>
              <el-input class="inputs"
                v-model="searchYarnLogCode"
                placeholder="输入关联单号按回车键查询"
                @change="getYarnLog(1)">
              </el-input>
              <el-select v-model="yarnAction"
                class="inputs"
                filterable
                clearable
                placeholder="请选择需要筛选的类型"
                @change="getYarnLog(1)">
                <el-option v-for="(item,index) in actionArr"
                  :key="index"
                  :label="item.name"
                  :value="item.action">
                </el-option>
              </el-select>
              <el-date-picker v-model="searchYarnLogDate"
                style="margin-right:16px"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="getYarnLog(1)">
              </el-date-picker>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterYarnLog')">重置</div>
            </div>
          </div>
          <div class="btnCtn_page"
            id='yarn'>
            <!-- <div class="btn noBorder noMargin"
              @click="deleteLog(yarnLog,'yarnLog')">批量删除</div> -->
            <div class="btn noBorder noMargin"
              @click="downloadYarn">批量导出excel</div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row flex04"></span>
              <span class="tb_row">操作时间</span>
              <span class="tb_row">原料名称</span>
              <span class="tb_row flex08">原料属性</span>
              <span class="tb_row">关联订单号</span>
              <span class="tb_row">操作类型</span>
              <span class="tb_row flex08">数量（kg）</span>
              <span class="tb_row flex08">操作人</span>
              <span class="tb_row flex08">备注信息</span>
            </div>
            <div class="tb_content"
              v-for="(itemLog,indexLog) in yarnLog"
              :key="indexLog">
              <span class="tb_row flex04">
                <el-checkbox v-model="itemLog.checked"
                  @change="checkYarnLogEvent($event,itemLog)"></el-checkbox>
              </span>
              <span class="tb_row">{{itemLog.create_time}}</span>
              <span class="tb_row">{{itemLog.material_name}}</span>
              <span class="tb_row flex08">{{itemLog.color_code}}</span>
              <span class="tb_row">{{itemLog.order_code || '无'}}</span>
              <span class="tb_row">{{itemLog.action|filterAction}}</span>
              <span class="tb_row flex08">{{itemLog.weight}}</span>
              <span class="tb_row flex08">{{itemLog.user_name}}</span>
              <span class="tb_row flex08">
                <template v-if="!itemLog.desc">无</template>
                <template v-else-if="itemLog.desc.length <= 10">{{itemLog.desc}}</template>
                <template v-else-if="itemLog.desc.length > 10">
                  {{itemLog.desc.slice(0,6)}}
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="itemLog.desc">
                    <span style="color:#1A95FF;cursor: pointer;"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
              </span>
            </div>
            <div class="tb_content">
              <span class="tb_row"></span>
              <span class="tb_row"></span>
              <span class="tb_row right">合计：</span>
              <span class="tb_row flex04">{{this.yarnTotalNumber || 0}}kg</span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="yarnLogTotal"
              :current-page.sync="yarnLogPages"
              @current-change='getYarnLog'>
            </el-pagination>
          </div>
        </div>
      </div>
    </template>
    <!-- 辅料仓库信息 -->
    <template v-else-if="stockInfo.type === 2">
      <div class="module">
        <div class="titleCtn">
          <div class="title">辅料库存信息</div>
        </div>
        <div class="listCtn hasBorderTop">
          <div class="filterCtn">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <el-input class="inputs"
                v-model="searchMaterial"
                placeholder="输入辅料按回车键查询"
                @change="getMaterialList(1)">
              </el-input>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterMaterialList')">重置</div>
            </div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row">辅料名称</span>
              <span class="tb_row">辅料属性</span>
              <span class="tb_row">库存数量</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemMa,indexMa) in materialList"
              :key="indexMa">
              <span class="tb_row">{{itemMa.material_name}}</span>
              <span class="tb_row">{{itemMa.material_color}}</span>
              <span class="tb_row">{{itemMa.total_weight}}</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click="updatedInfo(itemMa,'out','material')">出库</span>
                <span class="tb_handle_btn blue"
                  @click="updatedInfo(itemMa,'go','material')">入库</span>
                <span class="tb_handle_btn blue"
                  @click="goLog(itemMa,'material')">日志</span>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="materialTotal"
              :current-page.sync="materialPages"
              @current-change='getMaterialList'>
            </el-pagination>
          </div>
          <div class="editCtn bgGary_page"
            v-for="(itemMa,indexMa) in materialEditInfo"
            :key="indexMa">
            <span class="closeIcon_page el-icon-circle-close"
              @click="deleteItem(materialEditInfo,indexMa,true)"></span>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">辅料名称</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <!-- <el-select v-model="itemMa.materialName"
                    filterable
                    default-first-option
                    clearable
                    placeholder="请选择需要操作的辅料">
                    <el-option v-for="item in materialNameList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select> -->
                  <el-autocomplete v-model="itemMa.materialName"
                    clearable
                    :fetch-suggestions="querySearchMaterial"
                    placeholder="请选择需要操作的辅料"></el-autocomplete>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">操作类型</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content middle_page col">
                  <el-radio-group v-model="itemMa.editType">
                    <el-radio label="out">出库</el-radio>
                    <el-radio label="go">入库</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text"></span>
                </div>
                <div class="content"></div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">辅料属性</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-autocomplete v-model="itemMa.attr"
                    :fetch-suggestions="handleSelect"
                    placeholder="请输入辅料属性"></el-autocomplete>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">操作数量</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <zh-input placeholder="请输入操作数量"
                    v-model="itemMa.number"
                    type='number'></zh-input>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">备注</span>
                </div>
                <div class="content">
                  <el-autocomplete v-model="itemMa.remark"
                    :fetch-suggestions="querySearchRemark"
                    placeholder="请输入备注"></el-autocomplete>
                </div>
              </div>
            </div>
          </div>
          <div class="btnCtn_page marginTop20">
            <div class="btn btnDashed"
              v-show="materialEditInfo.length > 0"
              @click="resetEditInfo('material')">重置</div>
            <div class="btn btnDashed bgBlue_page"
              v-if="materialEditInfo.length === 0"
              @click="addItem(materialEditInfo,'material')">+添加出入库</div>
            <div class="btn btnDashed"
              v-else
              @click="addItem(materialEditInfo,'material')">
              <div class="btn btnOrange">+添加出入库</div>
            </div>
            <div class="btn btnDashed"
              v-show="materialEditInfo.length > 0">
              <div class="btn btnBlue"
                @click="saveMaterial">保存</div>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <div class="title">辅料出入库日志</div>
        </div>
        <div class="listCtn hasBorderTop">
          <div class="filterCtn">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <el-input class="inputs"
                v-model="searchMaterialLog"
                placeholder="输入辅料按回车键查询"
                @change="getMaterialLog">
              </el-input>
              <el-input class="inputs"
                v-model="searchMaterialLogCode"
                placeholder="输入关联单号按回车键查询"
                @change="getMaterialLog(1)">
              </el-input>
              <el-select v-model="materialAction"
                class="inputs"
                filterable
                clearable
                placeholder="请选择需要筛选的类型"
                @change="getMaterialLog">
                <el-option v-for="(item,index) in actionArr"
                  :key="index"
                  :label="item.name"
                  :value="item.action">
                </el-option>
              </el-select>
              <el-date-picker v-model="searchMaterialLogDate"
                style="margin-right:16px"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterMaterialLog')">重置</div>
            </div>
          </div>
          <div class="btnCtn_page"
            id='material'>
            <!-- <div class="btn noBorder noMargin"
              @click="deleteLog(materialLog,'materialLog')">批量删除</div> -->
            <div class="btn noBorder noMargin"
              @click="downloadMaterial">批量导出excel</div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row flex04"></span>
              <span class="tb_row">操作时间</span>
              <span class="tb_row">辅料名称</span>
              <span class="tb_row flex08">辅料属性</span>
              <span class="tb_row">操作类型</span>
              <span class="tb_row flex08">数量</span>
              <span class="tb_row flex08">操作人</span>
              <span class="tb_row flex08">备注信息</span>
            </div>
            <div class="tb_content"
              v-for="(itemLog,indexLog) in materialLog"
              :key="indexLog">
              <span class="tb_row flex04">
                <el-checkbox v-model="itemLog.checked"
                  @change="checkMaterialLogEvent"></el-checkbox>
              </span>
              <span class="tb_row">{{itemLog.create_time}}</span>
              <span class="tb_row">{{itemLog.material_name}}</span>
              <span class="tb_row flex08">{{itemLog.color_code}}</span>
              <span class="tb_row">{{itemLog.action|filterAction}}</span>
              <span class="tb_row flex08">{{itemLog.weight}}</span>
              <span class="tb_row flex08">{{itemLog.user_name}}</span>
              <span class="tb_row flex08">
                <template v-if="!itemLog.desc">无</template>
                <template v-else-if="itemLog.desc.length <= 10">{{itemLog.desc}}</template>
                <template v-if="itemLog.desc.length > 10">
                  {{itemLog.desc.slice(0,6)}}
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="itemLog.desc">
                    <span style="color:#1A95FF;cursor: pointer;"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="materialLogTotal"
              :current-page.sync="materialLogPages"
              @current-change='getMaterialLog'>
            </el-pagination>
          </div>
        </div>
      </div>
    </template>
    <!-- 包装仓库信息 -->
    <template v-else-if="stockInfo.type === 3">
      <div class="module">
        <div class="titleCtn">
          <div class="title">辅料库存信息</div>
        </div>
        <div class="listCtn hasBorderTop">
          <div class="filterCtn">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <el-input class="inputs"
                v-model="searchPack"
                placeholder="输入辅料按回车键查询"
                @change="getPackList(1)">
              </el-input>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterPackList')">重置</div>
            </div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row">包装名称</span>
              <span class="tb_row">包装尺寸</span>
              <span class="tb_row">包装属性</span>
              <span class="tb_row">库存数量</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemMa,indexMa) in packList"
              :key="indexMa">
              <span class="tb_row">{{itemMa.material_name}}</span>
              <span class="tb_row">{{itemMa.size}}</span>
              <span class="tb_row">{{itemMa.attribute}}</span>
              <span class="tb_row">{{itemMa.total_number}}</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click="updatedInfo(itemMa,'out','pack')">出库</span>
                <span class="tb_handle_btn blue"
                  @click="updatedInfo(itemMa,'go','pack')">入库</span>
                <span class="tb_handle_btn blue"
                  @click="goLog(itemMa,'pack')">日志</span>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="packTotal"
              :current-page.sync="packPages"
              @current-change='getPackList'>
            </el-pagination>
          </div>
          <div class="editCtn bgGary_page"
            v-for="(itemMa,indexMa) in packEditInfo"
            :key="indexMa">
            <span class="closeIcon_page el-icon-circle-close"
              @click="deleteItem(packEditInfo,indexMa,true)"></span>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">包装名称</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <!-- <el-select v-model="itemMa.packName"
                    filterable
                    default-first-option
                    clearable
                    placeholder="请选择需要操作的包装辅料">
                    <el-option v-for="item in packNameList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select> -->
                  <el-autocomplete v-model="itemMa.packName"
                    clearable
                    :fetch-suggestions="querySearchPack"
                    placeholder="请选择需要操作的包装辅料"></el-autocomplete>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">操作类型</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content middle_page col">
                  <el-radio-group v-model="itemMa.editType">
                    <el-radio label="out">出库</el-radio>
                    <el-radio label="go">入库</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">包装尺寸</span>
                </div>
                <div class="content">
                  <zh-input placeholder="请输入包装尺寸"
                    v-model="itemMa.size"></zh-input>
                </div>
              </div>
            </div>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">包装属性</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-autocomplete v-model="itemMa.attr"
                    :fetch-suggestions="handleSelect"
                    placeholder="请输入辅料属性"></el-autocomplete>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">操作数量</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <zh-input placeholder="请输入操作数量"
                    v-model="itemMa.number"
                    type='number'></zh-input>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">备注</span>
                </div>
                <div class="content">
                  <el-autocomplete v-model="itemMa.remark"
                    :fetch-suggestions="querySearchRemark"
                    placeholder="请输入备注"></el-autocomplete>
                </div>
              </div>
            </div>
          </div>
          <div class="btnCtn_page right marginTop20">
            <div class="btn btnDashed"
              v-show="packEditInfo.length > 0"
              @click="resetEditInfo('pack')">重置</div>
            <div class="btn btnDashed bgBlue_page"
              v-if="packEditInfo.length === 0"
              @click="addItem(packEditInfo,'pack')">+添加出入库</div>
            <div class="btn btnDashed"
              v-else
              @click="addItem(packEditInfo,'pack')">
              <div class="btn btnOrange">+添加出入库</div>
            </div>
            <div class="btn btnDashed"
              v-show="packEditInfo.length > 0">
              <div class="btn btnBlue"
                @click="savePack">保存</div>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <div class="title">包装出入库日志</div>
        </div>
        <div class="listCtn hasBorderTop">
          <div class="filterCtn">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <el-input class="inputs"
                v-model="searchPackLog"
                placeholder="输入辅料按回车键查询"
                @change="getPackLog(1)">
              </el-input>
              <el-input class="inputs"
                v-model="searchPackLogCode"
                placeholder="输入关联单号按回车键查询"
                @change="getPackLog(1)">
              </el-input>
              <el-date-picker v-model="searchPackLogDate"
                style="margin-right:16px"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterPackLog')">重置</div>
            </div>
          </div>
          <div class="btnCtn_page"
            id='pack'>
            <!-- <div class="btn noBorder noMargin"
              @click="deleteLog(packLog,'packLog')">批量删除</div> -->
            <div class="btn noBorder noMargin"
              @click="downloadPack">批量导出excel</div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row flex04"></span>
              <span class="tb_row">操作时间</span>
              <span class="tb_row">包装名称</span>
              <span class="tb_row">包装尺寸（cm）</span>
              <span class="tb_row flex08">包装属性</span>
              <span class="tb_row">操作类型</span>
              <span class="tb_row flex08">数量</span>
              <span class="tb_row flex08">操作人</span>
              <span class="tb_row flex08">备注信息</span>
            </div>
            <div class="tb_content"
              v-for="(itemLog,indexLog) in packLog"
              :key="indexLog">
              <span class="tb_row flex04">
                <el-checkbox v-model="itemLog.checked"
                  @change="checkPackLogEvent"></el-checkbox>
              </span>
              <span class="tb_row">{{itemLog.created_at}}</span>
              <span class="tb_row">{{itemLog.material_name}}</span>
              <span class="tb_row">{{itemLog.size}}</span>
              <span class="tb_row flex08">{{itemLog.attribute}}</span>
              <span class="tb_row">{{actionTypeArr[itemLog.action_type]}}</span>
              <span class="tb_row flex08">{{itemLog.number}}</span>
              <span class="tb_row flex08">{{itemLog.user_name}}</span>
              <span class="tb_row flex08">
                <template v-if="!itemLog.desc">无</template>
                <template v-else-if="itemLog.desc.length <= 10">{{itemLog.desc}}</template>
                <template v-if="itemLog.desc.length > 10">
                  {{itemLog.desc.slice(0,6)}}
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="itemLog.desc">
                    <span style="color:#1A95FF;cursor: pointer;"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="packLogTotal"
              :current-page.sync="packLogPages"
              @current-change='getPackLog'>
            </el-pagination>
          </div>
        </div>
      </div>
    </template>
    <!-- 产品仓库信息 -->
    <template v-else-if="stockInfo.type === 4">
      <div class="module">
        <div class="titleCtn">
          <div class="title">产品库存信息</div>
        </div>
        <div class="listCtn hasBorderTop">
          <div class="filterCtn">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <el-input class="inputs"
                v-model="searchProduct"
                placeholder="输入编号按回车键查询"
                @change="getProductList(1)">
              </el-input>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterProductList')">重置</div>
            </div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row">产品编号</span>
              <span class="tb_row">产品图片</span>
              <span class="tb_row">尺码颜色</span>
              <span class="tb_row">库存数量</span>
              <span class="tb_row">更新时间</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemMa,indexMa) in productList"
              :key="indexMa">
              <span class="tb_row two_line">{{itemMa.product_code}}<br />{{itemMa.category_info|filterProductType}}</span>
              <span class="tb_row two_line">
                <zh-img-list :list="itemMa.category_info.image"></zh-img-list>
              </span>
              <span class="tb_row">{{itemMa.size_name + '/' + itemMa.color_name}}</span>
              <span class="tb_row">{{itemMa.total_number + itemMa.category_info.unit}}</span>
              <span class="tb_row">{{itemMa.update_time}}</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click="updatedInfo(itemMa,'out','product')">出库</span>
                <span class="tb_handle_btn blue"
                  @click="updatedInfo(itemMa,'go','product')">入库</span>
                <span class="tb_handle_btn blue"
                  @click="goLog(itemMa,'product')">日志</span>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="productTotal"
              :current-page.sync="productPages"
              @current-change='getProductList'>
            </el-pagination>
          </div>
          <div class="editCtn bgGary_page"
            v-for="(itemMa,indexMa) in productEditInfo"
            :key="indexMa">
            <span class="closeIcon_page el-icon-circle-close"
              @click="deleteItem(productEditInfo,indexMa,true)"></span>
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">产品名称</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-select v-model="itemMa.productName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请选择需要操作的产品"
                    :remote-method="getProductListSelect(itemMa)"
                    :loading="selectLoading"
                    @change="getProductSizeColorInfo($event,itemMa)">
                    <el-option v-for="item in itemMa.productNameList"
                      :key="item.id"
                      :label="item.product_code + '(' + item.category_info.product_category + '/' + item.type_name + '/' +item.style_name +')'"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">操作类型</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content middle_page col">
                  <el-radio-group v-model="itemMa.editType">
                    <el-radio label="out">出库</el-radio>
                    <el-radio label="go">入库</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text"></span>
                </div>
                <div class="content"></div>
              </div>
            </div>
            <div class="rowCtn"
              v-for="(itemColor,indexColor) in itemMa.color_info"
              :key="indexColor">
              <div class="colCtn flex3">
                <div class="label"
                  v-if="indexColor === 0">
                  <span class="text">尺码颜色</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-cascader v-model="itemColor.size_color"
                    :key="itemMa.productName + '' + indexColor"
                    :options="itemMa.sizeColor"></el-cascader>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label"
                  v-if="indexColor === 0">
                  <span class="text">操作数量</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <zh-input placeholder="请输入操作数量"
                    v-model="itemColor.number"
                    type='number'></zh-input>
                </div>
              </div>
              <div class="colCtn flex3">
                <div class="label"
                  v-if="indexColor === 0">
                  <span class="text">备注</span>
                </div>
                <div class="content">
                  <el-autocomplete v-model="itemColor.remark"
                    :fetch-suggestions="querySearchRemark"
                    placeholder="请输入备注"></el-autocomplete>
                </div>
                <div class="editBtn addBtn"
                  v-if="indexColor === 0"
                  @click="addItem(itemMa.color_info,'product_color')">添加配色</div>
                <div class="editBtn deleteBtn"
                  v-else
                  @click="deleteItem(itemMa.color_info,indexColor)">删除配色</div>
              </div>
            </div>
          </div>

          <div class="btnCtn_page right marginTop20">
            <div class="btn btnDashed"
              v-show="productEditInfo.length > 0"
              @click="resetEditInfo('product')">重置</div>
            <div class="btn btnDashed bgBlue_page"
              v-if="productEditInfo.length === 0"
              @click="addItem(productEditInfo,'product')">+添加出入库</div>
            <div class="btn btnDashed"
              v-else
              @click="addItem(productEditInfo,'product')">
              <div class="btn btnOrange">+添加出入库</div>
            </div>
            <div class="btn btnDashed"
              v-show="productEditInfo.length > 0">
              <div class="btn btnBlue"
                @click="saveProduct">保存</div>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <div class="title">产品出入库日志</div>
        </div>
        <div class="listCtn hasBorderTop">
          <div class="filterCtn">
            <div class="leftCtn">
              <span class="label">筛选条件：</span>
              <el-input class="inputs"
                v-model="searchProductLog"
                placeholder="输入编号按回车键查询"
                @change="getProductLog(1)">
              </el-input>
              <el-input class="inputs"
                v-model="searchProductLogCode"
                placeholder="输入关联单号按回车键查询"
                @change="getProductLog(1)">
              </el-input>
              <el-date-picker v-model="searchProductLogDate"
                style="margin-right:16px"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterProductLog')">重置</div>
            </div>
          </div>
          <div class="btnCtn_page"
            id='product'>
            <div class="btn noBorder noMargin"
              @change="downloadProduct">批量导出excel</div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row flex04"></span>
              <span class="tb_row">操作时间</span>
              <span class="tb_row">产品编号</span>
              <span class="tb_row">尺码颜色</span>
              <span class="tb_row">关联订单</span>
              <span class="tb_row flex08">收发数量</span>
              <span class="tb_row flex08">操作人</span>
              <span class="tb_row flex08">备注信息</span>
              <span class="tb_row middle flex08">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemLog,indexLog) in productLog"
              :key="indexLog">
              <span class="tb_row flex04">
                <el-checkbox v-model="itemLog.checked"
                  @change="checkProductLogEvent"></el-checkbox>
              </span>
              <span class="tb_row">{{itemLog.create_time}}</span>
              <span class="tb_row">{{itemLog.product_code}}</span>
              <span class="tb_row">{{itemLog.size + '/' + itemLog.color}}</span>
              <span class="tb_row">{{itemLog.order_code}}</span>
              <span :class="{'tb_row':true, 'flex08':true, 'two_line':true,'green':itemLog.type === 1,'orange':itemLog.type === 2}">{{actionTypeArr[itemLog.type]}}<br />{{itemLog.stock_number}}</span>
              <span class="tb_row flex08">{{itemLog.user_name}}</span>
              <span class="tb_row flex08">
                <template v-if="!itemLog.remark">无</template>
                <template v-else-if="itemLog.remark.length <= 10">{{itemLog.remark}}</template>
                <template v-else-if="itemLog.remark.length > 10">
                  {{itemLog.remark.slice(0,6)}}
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="itemLog.remark">
                    <span style="color:#1A95FF;cursor: pointer;"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
              </span>
              <span class="tb_row flex08 middle">
                <span class="tb_handle_btn blue">打印</span>
                <span class="tb_handle_btn red">删除</span>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="productLogTotal"
              :current-page.sync="productLogPages"
              @current-change='getProductLog'>
            </el-pagination>
          </div>
        </div>
      </div>
    </template>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadExcel } from '@/assets/js/common.js'
import { stock, yarnStock, yarn, yarnColor, material, packStock, packag, productStock, product } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      selectLoading: false,
      stockInfo: {
        type: [],
        attendant: []
      },
      nowTime: this.$getTime(),
      yarnList: [],
      yarnTotal: 1,
      yarnPages: 1,
      yarnLog: [],
      checkYarnLogArr: [],
      yarnLogTotal: 1,
      yarnLogPages: 1,
      yarnColorList: [],
      yarnNameList: [],
      searchYarn: '',
      searchYarnLog: '',
      searchYarnLogCode: '',
      searchYarnLogDate: '',
      yarnAction: '',
      yarnEditInfo: [],
      actionTypeArr: ['', '入库', '出库', '调取出库'],
      actionArr: [
        {
          name: '预定购入库',
          action: 1
        },
        {
          name: '调取出库',
          action: 2
        },
        {
          name: '结余入库',
          action: 3
        },
        {
          name: '仓库入库',
          action: 4
        },
        {
          name: '仓库出库',
          action: 5
        }
      ],
      materialList: [],
      materialTotal: 1,
      materialPages: 1,
      materialLog: [],
      checkMaterialLogArr: [],
      materialLogTotal: 1,
      materialLogPages: 1,
      materialEditInfo: [],
      materialNameList: [],
      searchMaterial: '',
      searchMaterialLog: '',
      searchMaterialLogCode: '',
      searchMaterialLogDate: '',
      materialAction: '',
      packList: [],
      packTotal: 1,
      packPages: 1,
      packLog: [],
      checkPackLogArr: [],
      packLogTotal: 1,
      packLogPages: 1,
      packEditInfo: [],
      packNameList: [],
      searchPack: '',
      searchPackLog: '',
      searchPackLogCode: '',
      searchPackLogDate: '',
      // packAction: '',
      productList: [],
      productTotal: 1,
      productPages: 1,
      productLog: [],
      checkProductLogArr: [],
      productLogTotal: 1,
      productLogPages: 1,
      searchProduct: '',
      searchProductLog: '',
      searchProductLogCode: '',
      searchProductLogDate: '',
      productNameList: [],
      productEditInfo: [],
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
      }
    }
  },
  methods: {
    querySearchYarn (queryString, cb) {
      let list = this.yarnNameList.map(item => {
        return {
          value: item.name
        }
      })
      let returnList = queryString ? list.filter(itemF => itemF.value.indexOf(queryString) !== -1) : list
      cb(returnList)
    },
    querySearchMaterial (queryString, cb) {
      let list = this.materialNameList.map(item => {
        return {
          value: item.name
        }
      })
      let returnList = queryString ? list.filter(itemF => itemF.value.indexOf(queryString) !== -1) : list
      cb(returnList)
    },
    querySearchPack (queryString, cb) {
      let list = this.packNameList.map(item => {
        return {
          value: item.name
        }
      })
      let returnList = queryString ? list.filter(itemF => itemF.value.indexOf(queryString) !== -1) : list
      cb(returnList)
    },
    getListAndLog (type) {
      if (type === 1) {
        this.getYarnList(1)
        this.getYarnLog(1)
        if (this.yarnColorList.length === 0) {
          yarnColor.list().then(res => {
            if (res.data.status) {
              this.yarnColorList = [{ value: '白胚' }, ...res.data.data.map(itemColor => {
                return { value: itemColor.name }
              })]
            } else {
              this.$message.error('未获取到原料颜色数据，' + res.data.message)
            }
          })
        }
        if (this.yarnNameList.length === 0) {
          yarn.list().then(res => {
            if (res.data.status) {
              this.yarnNameList = res.data.data
            } else {
              this.$message.error('未获取到原料数据，' + res.data.message)
            }
          })
        }
      } else if (type === 2) {
        this.getMaterialList(1)
        this.getMaterialLog(1)
        if (this.materialNameList.length === 0) {
          material.list().then(res => {
            if (res.data.status) {
              this.materialNameList = res.data.data
            } else {
              this.$message.error('为获取到辅料数据，' + res.data.message)
            }
          })
        }
      } else if (type === 3) {
        this.getPackList(1)
        this.getPackLog(1)
        if (this.packNameList.length === 0) {
          packag.list().then(res => {
            if (res.data.status === false) {
              this.$message.error('获取包装辅料列表失败，' + res.data.message)
            } else {
              this.packNameList = res.data.data
            }
          })
        }
      } else if (type === 4) {
        this.getProductList(1)
        this.getProductLog(1)
      }
    },
    getProductListSelect (item) {
      return (keyword) => {
        if (keyword !== '') {
          this.selectLoading = true
          product.list({
            page: 1,
            limit: 9999,
            product_code: keyword,
            type: 1
          }).then(res => {
            if (res.data.status !== false) {
              this.selectLoading = false
              item.productNameList = res.data.data
            }
          })
        } else {
          item.productNameList = []
        }
      }
    },
    getYarnList (page) {
      this.loading = true
      this.yarnPages = page || this.yarnPages
      yarnStock.list({
        limit: 5,
        stock_id: this.$route.params.id,
        type: 1,
        material_name: this.searchYarn,
        page: this.yarnPages
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取原料库存列表失败，' + res.data.message)
        } else {
          this.yarnList = res.data.data
          this.yarnTotal = res.data.meta.total
        }
        this.loading = false
      })
    },
    getYarnLog (page) {
      this.loading = true
      this.yarnLogPages = page || this.yarnLogPages
      Promise.all([
        yarnStock.log({
          stock_id: this.$route.params.id,
          type: 1,
          material_name: this.searchYarnLog,
          action: this.yarnAction,
          page: this.yarnLogPages,
          limit: 5,
          start_time: this.searchYarnLogDate ? (this.searchYarnLogDate.length ? this.searchYarnLogDate[0] : '') : '',
          end_time: this.searchYarnLogDate ? (this.searchYarnLogDate.length ? this.searchYarnLogDate[1] : '') : '',
          order_code: this.searchYarnLogCode
        }),
        yarnStock.logCount({
          stock_id: this.$route.params.id,
          type: 1,
          start_time: this.searchYarnLogDate ? (this.searchYarnLogDate.length ? this.searchYarnLogDate[0] : '') : '',
          end_time: this.searchYarnLogDate ? (this.searchYarnLogDate.length ? this.searchYarnLogDate[1] : '') : '',
          order_code: this.searchYarnLogCode,
          material_name: this.searchYarnLog,
          action: this.yarnAction
        })
      ]).then(res => {
        // if (res.data.status === false) {
        //   this.$message.error('获取原料日志失败，' + res.data.message)
        // } else {
        this.yarnLog = []
        this.yarnLog = res[0].data.data.map(item => {
          item.checked = false
          return item
        })
        this.yarnLogTotal = res[0].data.meta.total
        this.yarnTotalNumber = res[1].data.data
        // }
        this.loading = false
      })
    },
    // 批量导出excel
    downloadYarn () {
      let data = this.checkYarnLogArr.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        let flag = this.actionArr.find(value => value.action === item.action)
        item.action_name = flag ? flag.name : ''
        return item
      })
      downloadExcel(data, [
        { title: '操作时间', key: 'create_time' },
        { title: '物料名称', key: 'material_name' },
        { title: '物料属性', key: 'color_code' },
        { title: '关联订单号', key: 'order_code' },
        { title: '操作类型', key: 'action_name' },
        { title: '数量', key: 'weight' },
        { title: '备注信息', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ])
    },
    checkYarnLogEvent (event, item) {
      if (event) {
        this.checkYarnLogArr.push(this.$clone(item))
      } else {
        let flag = this.checkYarnLogArr.find(value => value.id === item.id)
        if (flag) {
          flag.checked = false
          this.checkYarnLogArr = this.checkYarnLogArr.filter(value => value.checked)
        }
      }
    },
    getMaterialList (page) {
      this.loading = true
      this.materialPages = page || this.materialPages
      yarnStock.list({
        limit: 5,
        page: this.materialPages,
        stock_id: this.$route.params.id,
        type: 2,
        material_name: this.searchMaterial
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取原料库存列表失败，' + res.data.message)
        } else {
          this.materialList = res.data.data
          this.materialTotal = res.data.meta.total
        }
        this.loading = false
      })
    },
    getMaterialLog (page) {
      this.loading = true
      this.materialLogPages = page || this.materialLogPages
      yarnStock.log({
        stock_id: this.$route.params.id,
        type: 2,
        material_name: this.searchMaterialLog,
        action: this.materialAction,
        page: this.materialLogPages,
        limit: 5
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取原料日志失败，' + res.data.message)
        } else {
          this.materialLog = []
          this.materialLog = res.data.data.map(item => {
            item.checked = false
            return item
          })
          this.materialLogTotal = res.data.meta.total
        }
        this.loading = false
      })
    },
    // 批量导出excel
    downloadMaterial () {
      let data = this.checkMaterialLogArr.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        let flag = this.actionArr.find(value => value.action === item.action)
        item.action_name = flag ? flag.name : ''
        return item
      })
      downloadExcel(data, [
        { title: '操作时间', key: 'create_time' },
        { title: '物料名称', key: 'material_name' },
        { title: '物料属性', key: 'color_code' },
        { title: '操作类型', key: 'action_name' },
        { title: '数量', key: 'weight' },
        { title: '备注信息', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ])
    },
    checkMaterialLogEvent (event, item) {
      if (event) {
        this.checkMaterialLogArr.push(this.$clone(item))
      } else {
        let flag = this.checkMaterialLogArr.find(value => value.id === item.id)
        if (flag) {
          flag.checked = false
          this.checkMaterialLogArr = this.checkMaterialLogArr.filter(value => value.checked)
        }
      }
    },
    getPackList (page) {
      this.loading = true
      this.packPages = page || this.packPages
      packStock.list({
        limit: 5,
        page: this.packPages,
        stock_id: this.$route.params.id,
        material_name: this.searchPack
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取包装库存列表失败，' + res.data.message)
        } else {
          this.packList = res.data.data
          this.packTotal = res.data.meta.total
        }
        this.loading = false
      })
    },
    getPackLog (page) {
      this.loading = true
      this.packLogPages = page || this.packLogPages
      packStock.log({
        stock_id: this.$route.params.id,
        material_name: this.searchPackLog,
        limit: 5,
        page: this.packLogPages
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取包装出入库日志失败，' + res.data.message)
        } else {
          this.packLog = res.data.data.map(item => {
            item.checked = false
            return item
          })
          this.packLogTotal = res.data.meta.total
        }
        this.loading = false
      })
    },
    // 批量导出excel
    downloadPack () {
      let data = this.checkPackLogArr.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.action_name = this.actionTypeArr[item.action_type]
        return item
      })
      downloadExcel(data, [
        { title: '操作时间', key: 'create_time' },
        { title: '包装名称', key: 'material_name' },
        { title: '包装尺寸（cm）', key: 'size' },
        { title: '包装属性', key: 'attribute' },
        { title: '操作类型', key: 'action_name' },
        { title: '数量', key: 'number' },
        { title: '备注信息', key: 'desc' },
        { title: '操作人', key: 'user_name' }
      ])
    },
    checkPackLogEvent (event, item) {
      if (event) {
        this.checkPackLogArr.push(this.$clone(item))
      } else {
        let flag = this.checkPackLogArr.find(value => value.id === item.id)
        if (flag) {
          flag.checked = false
          this.checkPackLogArr = this.checkPackLogArr.filter(value => value.checked)
        }
      }
    },
    getProductList (page) {
      this.loading = true
      this.productPages = page || this.productPages
      productStock.list({
        stock_id: this.$route.params.id,
        limit: 5,
        page: this.productPages,
        product_code: this.searchProduct
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取产品库存失败，' + res.data.message)
        } else {
          this.productList = res.data.data
          this.productTotal = res.data.meta.total
        }
        this.loading = false
      })
    },
    getProductLog (page) {
      this.loading = true
      this.productLogPages = page || this.productLogPages
      productStock.log({
        stock_id: this.$route.params.id,
        type: 1,
        product_code: this.searchProductLog,
        page: this.productLogPages,
        limit: 5
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取产品出入库日志失败，' + res.data.message)
        } else {
          this.productLog = res.data.data.map(item => {
            item.checked = false
            return item
          })
          this.productLogTotal = res.data.meta.total
        }
        this.loading = false
      })
    },
    // 批量导出excel
    downloadProduct () {
      let data = this.checkProductLogArr.filter(item => item.checked)
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      data = data.map(item => {
        item.action_name = this.actionTypeArr[item.type]
        return item
      })
      downloadExcel(data, [
        { title: '操作时间', key: 'create_time' },
        { title: '产品编号', key: 'product_code' },
        { title: '尺码', key: 'size' },
        { title: '颜色', key: 'color' },
        { title: '关联订单号', key: 'order_code' },
        { title: '操作类型', key: 'action_name' },
        { title: '数量', key: 'stock_number' },
        { title: '备注信息', key: 'remark' },
        { title: '操作人', key: 'user_name' }
      ])
    },
    checkProductLogEvent (event, item) {
      if (event) {
        this.checkProductLogArr.push(this.$clone(item))
      } else {
        let flag = this.checkProductLogArr.find(value => value.id === item.id)
        if (flag) {
          flag.checked = false
          this.checkProductLogArr = this.checkProductLogArr.filter(value => value.checked)
        }
      }
    },
    getProductSizeColorInfo (event, itemPro) {
      itemPro.size_color = ''
      let flag = itemPro.productNameList.find(item => item.id === event)
      if (flag) {
        itemPro.sizeColor = flag.size.map(itemSize => {
          return {
            value: itemSize.size_id,
            label: itemSize.size_name,
            children: flag.color.map(itemColor => {
              return {
                value: itemColor.color_id,
                label: itemColor.color_name
              }
            })
          }
        })
      } else {
        this.$message.error('未获取到该产品的尺码颜色信息')
      }
    },
    handleSelect (queryString, cb) {
      let restaurants = this.yarnColorList
      let results = queryString ? restaurants.filter(item => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : restaurants
      cb(results)
    },
    addItem (item, type) {
      if (type === 'yarn') {
        item.push({
          attr: '',
          yarnName: '',
          editType: 'go',
          number: '',
          remark: ''
        })
      } else if (type === 'material') {
        item.push({
          attr: '',
          materialName: '',
          editType: 'go',
          number: '',
          remark: ''
        })
      } else if (type === 'pack') {
        item.push({
          packName: '',
          attr: '',
          number: '',
          size: '',
          editType: 'go',
          remark: ''
        })
      } else if (type === 'product') {
        item.push({
          productName: '',
          editType: 'go',
          color_info: [{
            size_color: '',
            number: '',
            remark: ''
          }]
        })
      } else if (type === 'product_color') {
        item.push({
          size_color: '',
          number: '',
          remark: ''
        })
      } else {
        this.$message.warning('未知操作')
      }
    },
    deleteItem (item, index, flag) {
      if (!flag && (item.length < 2)) {
        this.$message.warning('至少保留一项')
      } else {
        this.$confirm('此操作将删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.splice(index, 1)
          this.$message({
            type: 'success',
            message: '已删除'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 重置按钮
    resetEditInfo (type) {
      this.$confirm('此操作将重置操作项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'yarn') {
          this.yarnEditInfo = [
            {
              attr: '',
              yarnName: '',
              editType: 'go',
              number: '',
              remark: ''
            }
          ]
        } else if (type === 'filterYarnList') {
          this.searchYarn = ''
          this.getYarnList(1)
        } else if (type === 'filterYarnLog') {
          this.searchYarnLog = ''
          this.searchYarnLogCode = ''
          this.searchYarnLogDate = ''
          this.yarnAction = ''
          this.getYarnLog()
        } else if (type === 'material') {
          this.materialEditInfo = [
            {
              attr: '',
              materialName: '',
              editType: 'go',
              number: '',
              remark: ''
            }
          ]
        } else if (type === 'filterMaterialList') {
          this.searchMaterial = ''
          this.getMaterialList(1)
        } else if (type === 'filterMaterialLog') {
          this.searchMaterialLog = ''
          this.materialAction = ''
          this.searchMaterialLogCode = ''
          this.searchMaterialLogDate = ''
          this.getMaterialLog()
        } else if (type === 'pack') {
          this.packEditInfo = [
            {
              attr: '',
              packName: '',
              size: '',
              editType: 'go',
              number: '',
              remark: ''
            }
          ]
        } else if (type === 'filterPackList') {
          this.searchPack = ''
          this.getPackList(1)
        } else if (type === 'filterPackLog') {
          this.searchPackLog = ''
          this.searchPackLogCode = ''
          this.searchPackLogDate = ''
          // this.packAction = ''
          this.getPackLog()
        } else if (type === 'product') {
          this.productEditInfo = [
            {
              productName: '',
              editType: 'go',
              color_info: [
                {
                  size_color: '',
                  number: '',
                  remark: ''
                }
              ]
            }
          ]
        } else if (type === 'filterProductList') {
          this.searchProduct = ''
          this.getProductList(1)
        } else if (type === 'filterProductLog') {
          this.searchProductLog = ''
          this.searchProductLogCode = ''
          this.searchProductLogDate = ''
          this.getProductLog()
        } else {
          this.$message.error('出现未知错误，请重试或刷新页面')
          return
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
    saveYarn () {
      if (this.$submitLock()) {
        return
      }
      let flag = {
        name: true,
        attr: true,
        number: true,
        type: true,
        remark: true
      }
      this.yarnEditInfo.forEach(itemMa => {
        if (!itemMa.yarnName) {
          flag.name = false
        }
        if (!itemMa.editType) {
          flag.type = false
        }
        if (!itemMa.attr) {
          flag.attr = false
        }
        if (!itemMa.number) {
          flag.number = false
        }
        if (!itemMa.remark) {
          flag.remark = false
        }
      })
      if (!flag.name) {
        this.$message.error('检测到有未选择的原料，请选择')
        return
      }
      if (!flag.type) {
        this.$message.error('检测到有未选择的操作类型，请选择')
        return
      }
      if (!flag.attr) {
        this.$message.error('检测到有未填写的原料属性，请填写')
        return
      }
      if (!flag.number) {
        this.$message.error('检测到有未填写的操作数量，请填写')
        return
      }
      if (!flag.remark) {
        this.$message.error('请输入备注')
        return
      }
      let data = this.yarnEditInfo.map(item => {
        return {
          material_name: item.yarnName,
          type: 1,
          color_code: item.attr,
          vat_code: '',
          attribute: '',
          stock_id: this.$route.params.id,
          weight: (item.editType === 'go' ? Number(item.number) : -Number(item.number)),
          desc: item.remark,
          company_id: window.sessionStorage.getItem('company_id'),
          user_id: window.sessionStorage.getItem('user_id')
        }
      })
      stock.yarnStock({
        data: data
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('保存失败，' + res.data.message)
        } else {
          this.$message.success('保存成功')
          this.getYarnList(1)
          this.getYarnLog()
          this.yarnEditInfo = []
        }
      })
    },
    saveMaterial () {
      if (this.$submitLock()) {
        return
      }
      let flag = {
        name: true,
        attr: true,
        number: true,
        type: true,
        remark: true
      }
      this.materialEditInfo.forEach(itemMa => {
        if (!itemMa.materialName) {
          flag.name = false
        }
        if (!itemMa.editType) {
          flag.type = false
        }
        if (!itemMa.attr) {
          flag.attr = false
        }
        if (!itemMa.number) {
          flag.number = false
        }
        if (!itemMa.remark) {
          flag.remark = false
        }
      })
      if (!flag.name) {
        this.$message.error('检测到有未选择的辅料，请选择')
        return
      }
      if (!flag.type) {
        this.$message.error('检测到未选择操作类型，请选择')
        return
      }
      if (!flag.attr) {
        this.$message.error('检测到有未填写的辅料属性，请填写')
        return
      }
      if (!flag.number) {
        this.$message.error('检测到有未填写的操作数量，请填写')
        return
      }
      if (!flag.remark) {
        this.$message.error('请输入备注')
        return
      }
      let data = this.materialEditInfo.map(item => {
        return {
          material_name: item.materialName,
          type: 2,
          color_code: item.attr,
          vat_code: '',
          attribute: '',
          stock_id: this.$route.params.id,
          weight: (item.editType === 'go' ? Number(item.number) : -Number(item.number)),
          desc: item.remark,
          company_id: window.sessionStorage.getItem('company_id'),
          user_id: window.sessionStorage.getItem('user_id')
        }
      })
      stock.materialStock({
        data: data
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('保存失败，' + res.data.message)
        } else {
          this.$message.success('保存成功')
          this.getMaterialList(1)
          this.getMaterialLog()
          this.materialEditInfo = []
        }
      })
    },
    savePack () {
      if (this.$submitLock()) {
        return
      }
      let flag = {
        name: true,
        attr: true,
        number: true,
        type: true,
        size: true,
        remark: true
      }
      this.packEditInfo.forEach(itemMa => {
        if (!itemMa.packName) {
          flag.name = false
        }
        if (!itemMa.editType) {
          flag.type = false
        }
        if (!itemMa.size) {
          flag.size = false
        }
        if (!itemMa.attr) {
          flag.attr = false
        }
        if (!itemMa.number) {
          flag.number = false
        }
        if (!itemMa.remark) {
          flag.remark = false
        }
      })
      if (!flag.name) {
        this.$message.error('检测到有未选择的包装，请选择')
        return
      }
      if (!flag.type) {
        this.$message.error('检测到未选择操作类型，请选择')
        return
      }
      if (!flag.size) {
        this.$message.error('检测到有未填写包装尺寸，请填写')
        return
      }
      if (!flag.attr) {
        this.$message.error('检测到有未填写的包装属性，请填写')
        return
      }
      if (!flag.number) {
        this.$message.error('检测到有未填写的操作数量，请填写')
        return
      }
      if (!flag.remark) {
        this.$message.error('请输入备注')
        return
      }
      let data = this.packEditInfo.map(item => {
        return {
          material_name: item.packName,
          size: item.size,
          attribute: item.attr,
          stock_id: this.$route.params.id,
          number: (item.editType === 'go' ? Number(item.number) : -Number(item.number)),
          action_type: item.editType === 'go' ? 1 : 2,
          desc: item.remark,
          company_id: window.sessionStorage.getItem('company_id'),
          user_id: window.sessionStorage.getItem('user_id')
        }
      })
      stock.packStock({
        data: data
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('保存失败，' + res.data.message)
        } else {
          this.$message.success('保存成功')
          this.getPackList(1)
          this.getPackLog()
          this.packEditInfo = []
        }
      })
    },
    saveProduct () {
      if (this.$submitLock()) {
        return
      }
      let data = []
      let flag = {
        name: true,
        size: true,
        color: true,
        number: true,
        type: true,
        remark: true
      }
      this.productEditInfo.forEach(itemMa => {
        if (!itemMa.productName) {
          flag.name = false
        }
        if (!itemMa.editType) {
          flag.type = false
        }
        itemMa.color_info.forEach(itemColor => {
          if (!itemColor.size_color[0]) {
            flag.size = false
          }
          if (!itemColor.size_color[1]) {
            flag.color = false
          }
          if (!itemColor.number) {
            flag.number = false
          }
          if (!itemColor.remark) {
            flag.remark = false
          }
          data.push({
            remark: itemColor.remark,
            stock_number: (itemMa.editType === 'go' ? Number(itemColor.number) : -Number(itemColor.number)),
            color_id: itemColor.size_color[1],
            size_id: itemColor.size_color[0],
            product_id: itemMa.productName,
            stock_id: this.$route.params.id
            // company_id: window.sessionStorage.getItem('company_id')
          })
        })
      })
      if (!flag.name) {
        this.$message.error('检测到有未选择的产品，请选择')
        return
      }
      if (!flag.type) {
        this.$message.error('检测到未选择操作类型，请选择')
        return
      }
      if (!flag.size) {
        this.$message.error('检测到有未选中尺码颜色，请选择')
        return
      }
      if (!flag.color) {
        this.$message.error('检测到有未选中尺码颜色，请选择')
        return
      }
      if (!flag.number) {
        this.$message.error('检测到有未填写的操作数量，请填写')
        return
      }
      if (!flag.remark) {
        this.$message.error('请输入备注')
        return
      }
      // let data = this.productEditInfo.map(item => {
      //   return {
      //     remark: item.remark,
      //     stock_number: (item.editType === 'go' ? Number(item.number) : -Number(item.number)),
      //     color: item.size_color[1],
      //     size: item.size_color[0],
      //     product_id: item.productName,
      //     stock_id: this.$route.params.id
      //     // company_id: window.sessionStorage.getItem('company_id')
      //   }
      // })
      stock.productStock({
        data: data
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('保存成功')
          this.getProductList(1)
          this.getProductLog()
          this.productEditInfo = []
        }
      })
    },
    updatedInfo (item, editType, type) {
      if (type === 'yarn') {
        this.yarnEditInfo.push({
          attr: item.material_color,
          editType: editType,
          yarnName: item.material_name,
          remark: '',
          number: ''
        })
      } else if (type === 'material') {
        this.materialEditInfo.push({
          attr: item.material_color,
          editType: editType,
          materialName: item.material_name,
          remark: '',
          number: ''
        })
      } else if (type === 'pack') {
        this.packEditInfo.push({
          attr: item.attribute,
          editType: editType,
          packName: item.material_name,
          size: item.size,
          remark: '',
          number: ''
        })
      } else if (type === 'product') {
        let cloneItem = this.$clone(item)
        cloneItem.id = cloneItem.product_id.toString()
        cloneItem.category_info.product_category = cloneItem.category_info.category_name
        cloneItem.type_name = cloneItem.category_info.type_name
        cloneItem.style_name = cloneItem.category_info.style_name
        this.productEditInfo.push({
          productName: item.product_id.toString(),
          editType: editType,
          color_info: [
            {
              size_color: [item.size_id, item.color_id],
              number: '',
              remark: ''
            }
          ],
          sizeColor: item.category_info.size_measurement.map(itemSize => {
            return {
              value: itemSize.size_id,
              label: itemSize.size_name,
              children: item.category_info.color.map(itemColor => {
                return {
                  value: itemColor.color_id,
                  label: itemColor.color_name
                }
              })
            }
          }),
          productNameList: [cloneItem]
        })
      }
    },
    goLog (item, type) {
      if (type === 'yarn') {
        this.searchYarnLog = item.material_name
        this.getYarnLog(1)
      } else if (type === 'material') {
        this.searchMaterialLog = item.material_name
        this.getMaterialLog(1)
      } else if (type === 'pack') {
        this.searchPackLog = item.material_name
        this.getPackLog(1)
      } else if (type === 'product') {
        this.searchProductLog = item.product_code
        this.getProductLog(1)
      } else {
        this.$message.error('出现未知错误，请尝试刷新页面')
        return
      }
      document.getElementById(type).scrollIntoView(true)
    },
    querySearchRemark (queryString, cb) {
      let returnDataArr = [
        {
          value: '手工入库'
        },
        {
          value: '数据填错'
        },
        {
          value: '出售'
        }
      ]
      let returnData = queryString ? returnDataArr.filter(item => item.value.indexOf(queryString) !== -1) : returnDataArr
      cb(returnData)
    }
  },
  created () {
    stock.detail({
      id: this.$route.params.id
    }).then(res => {
      if (res.data.status) {
        this.stockInfo = res.data.data
        this.stockInfo.type = JSON.parse(this.stockInfo.type)
        this.getListAndLog(this.stockInfo.type)
      } else {
        this.$message.error(res.data.message)
        this.loading = false
      }
    })
  },
  filters: {
    filterType (type) {
      if (type) {
        const stockTypeArr = [
          {
            id: 1,
            name: '原料仓库'
          },
          {
            id: 2,
            name: '辅料仓库'
          },
          {
            id: 3,
            name: '包装辅料仓库'
          },
          {
            id: 4,
            name: '产品仓库'
          }
        ]
        let flag = stockTypeArr.find(item => item.id === Number(type))
        if (flag) {
          return flag.name
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    filterAction (action) {
      const actionArr = [
        {
          name: '预定购入库',
          action: 1
        },
        {
          name: '调取出库',
          action: 2
        },
        {
          name: '结余入库',
          action: 3
        },
        {
          name: '仓库入库',
          action: 4
        },
        {
          name: '仓库出库',
          action: 5
        }
      ]
      let flag = actionArr.find(item => item.action === action)
      if (flag) {
        return flag.name
      }
    },
    filterProductType (item) {
      return [item.category_name, item.type_name, item.style_name].join('/')
    }
  },
  watch: {
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/stock/stockDetail.less";
</style>
