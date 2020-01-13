<template>
  <div id='stockDetail'
    class='indexMain'
    v-loading='loading'>
    <div class="module">
      <div class="titleCtn">
        <div class="title">仓库信息</div>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="btnCtn">
            <div class="btn btnBlue">打印标签</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">仓库名称：</span>
            <span class="text">{{stockInfo.name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">仓库类型：</span>
            <span class="text">{{stockInfo.type[0]|filterType}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">管理员：</span>
            <span class="text">{{''}}</span>
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
    <template v-if="stockInfo.type.indexOf(1) !== -1">
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
                  <el-select v-model="itemYarn.yarnName"
                    filterable
                    default-first-option
                    clearable
                    placeholder="请选择需要操作的原料">
                    <el-option v-for="item in yarnNameList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
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
                </div>
                <div class="content">
                  <zh-input placeholder="请输入备注"
                    v-model="itemYarn.remark"></zh-input>
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
              <el-select v-model="yarnAction"
                class="inputs"
                filterable
                placeholder="请选择需要筛选的类型"
                @change="getYarnLog(1)">
                <el-option v-for="(item,index) in actionArr"
                  :key="index"
                  :label="item.name"
                  :value="item.action">
                </el-option>
              </el-select>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterYarnLog')">重置</div>
            </div>
          </div>
          <div class="btnCtn_page"
            id='yarn'>
            <div class="btn noBorder noMargin"
              @click="deleteLog(yarnLog,'yarnLog')">批量删除</div>
            <div class="btn noBorder noMargin">批量打印</div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row flex04"></span>
              <span class="tb_row">操作时间</span>
              <span class="tb_row">原料名称</span>
              <span class="tb_row flex08">原料属性</span>
              <span class="tb_row">操作类型</span>
              <span class="tb_row flex08">数量（kg）</span>
              <span class="tb_row flex08">操作人</span>
              <span class="tb_row middle flex08">备注信息</span>
            </div>
            <div class="tb_content"
              v-for="(itemLog,indexLog) in yarnLog"
              :key="indexLog">
              <span class="tb_row flex04">
                <el-checkbox v-model="itemLog.checked"></el-checkbox>
              </span>
              <span class="tb_row">{{itemLog.create_time}}</span>
              <span class="tb_row">{{itemLog.material_name}}</span>
              <span class="tb_row flex08">{{itemLog.color_code}}</span>
              <span class="tb_row">{{itemLog.action|filterAction}}</span>
              <span class="tb_row flex08">{{itemLog.weight}}</span>
              <span class="tb_row flex08">{{itemLog.user_name}}</span>
              <span class="tb_row middle flex08">
                <template v-if="itemLog.desc">
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="itemLog.desc">
                    <span class="btn noBorder"
                      style="margin:0"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
                <template v-else>无</template>
              </span>
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
    <template v-else-if="stockInfo.type.indexOf(2) !== -1">
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
                  <el-select v-model="itemMa.materialName"
                    filterable
                    default-first-option
                    clearable
                    placeholder="请选择需要操作的辅料">
                    <el-option v-for="item in materialNameList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
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
                  <zh-input placeholder="请输入备注"
                    v-model="itemMa.remark"></zh-input>
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
              <el-select v-model="materialAction"
                class="inputs"
                filterable
                placeholder="请选择需要筛选的类型"
                @change="getMaterialLog">
                <el-option v-for="(item,index) in actionArr"
                  :key="index"
                  :label="item.name"
                  :value="item.action">
                </el-option>
              </el-select>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterMaterialLog')">重置</div>
            </div>
          </div>
          <div class="btnCtn_page"
            id='material'>
            <div class="btn noBorder noMargin"
              @click="deleteLog(materialLog,'materialLog')">批量删除</div>
            <div class="btn noBorder noMargin">批量打印</div>
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
              <span class="tb_row middle flex08">备注信息</span>
            </div>
            <div class="tb_content"
              v-for="(itemLog,indexLog) in materialLog"
              :key="indexLog">
              <span class="tb_row flex04">
                <el-checkbox v-model="itemLog.checked"></el-checkbox>
              </span>
              <span class="tb_row">{{itemLog.create_time}}</span>
              <span class="tb_row">{{itemLog.material_name}}</span>
              <span class="tb_row flex08">{{itemLog.color_code}}</span>
              <span class="tb_row">{{itemLog.action|filterAction}}</span>
              <span class="tb_row flex08">{{itemLog.weight}}</span>
              <span class="tb_row flex08">{{itemLog.user_name}}</span>
              <span class="tb_row middle flex08">
                <template v-if="itemLog.desc">
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="itemLog.desc">
                    <span class="btn noBorder"
                      style="margin:0"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
                <template v-else>无</template>
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
    <template v-else-if="stockInfo.type.indexOf(3) !== -1">
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
                  <el-select v-model="itemMa.packName"
                    filterable
                    default-first-option
                    clearable
                    placeholder="请选择需要操作的包装辅料">
                    <el-option v-for="item in packNameList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
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
                  <zh-input placeholder="请输入备注"
                    v-model="itemMa.remark"></zh-input>
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
                @change="getPackLog">
              </el-input>
              <!-- <el-select v-model="packAction"
                class="inputs"
                filterable
                placeholder="请选择需要筛选的类型"
                @change="getPackLog">
                <el-option v-for="(item,index) in actionArr"
                  :key="index"
                  :label="item.name"
                  :value="item.action">
                </el-option>
              </el-select> -->
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterPackLog')">重置</div>
            </div>
          </div>
          <div class="btnCtn_page"
            id='pack'>
            <div class="btn noBorder noMargin"
              @click="deleteLog(packLog,'packLog')">批量删除</div>
            <div class="btn noBorder noMargin">批量打印</div>
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
              <span class="tb_row middle flex08">备注信息</span>
            </div>
            <div class="tb_content"
              v-for="(itemLog,indexLog) in packLog"
              :key="indexLog">
              <span class="tb_row flex04">
                <el-checkbox v-model="itemLog.checked"></el-checkbox>
              </span>
              <span class="tb_row">{{itemLog.created_at}}</span>
              <span class="tb_row">{{itemLog.material_name}}</span>
              <span class="tb_row">{{itemLog.size}}</span>
              <span class="tb_row flex08">{{itemLog.attribute}}</span>
              <span class="tb_row">{{actionTypeArr[itemLog.action_type]}}</span>
              <span class="tb_row flex08">{{itemLog.number}}</span>
              <span class="tb_row flex08">{{itemLog.user_name}}</span>
              <span class="tb_row middle flex08">
                <template v-if="itemLog.desc">
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="itemLog.desc">
                    <span class="btn noBorder"
                      style="margin:0"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
                <template v-else>无</template>
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
    <template v-else-if="stockInfo.type.indexOf(4) !== -1">
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
                <zh-img-list :list="itemMa.category_info.images"></zh-img-list>
              </span>
              <span class="tb_row">{{itemMa.size + '/' + itemMa.color}}</span>
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
              :current-page.sync="productPages">
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
                    default-first-option
                    clearable
                    placeholder="请选择需要操作的辅料"
                    @change="getProductSizeColorInfo($event,itemMa)">
                    <el-option v-for="item in productNameList"
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
            <div class="rowCtn">
              <div class="colCtn flex3">
                <div class="label">
                  <span class="text">尺码颜色</span>
                  <span class="explanation">（必填）</span>
                </div>
                <div class="content">
                  <el-cascader v-model="itemMa.size_color"
                    :key="itemMa.productName"
                    :options="itemMa.sizeColor"></el-cascader>
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
                  <zh-input placeholder="请输入备注"
                    v-model="itemMa.remark"></zh-input>
                </div>
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
                @change="getProductLog">
              </el-input>
              <!-- <el-select v-model="ProductAction"
                class="inputs"
                filterable
                placeholder="请选择需要筛选的类型"
                @change="getMaterialLog">
                <el-option v-for="(item,index) in actionArr"
                  :key="index"
                  :label="item.name"
                  :value="item.action">
                </el-option>
              </el-select> -->
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterProductLog')">重置</div>
            </div>
          </div>
          <div class="btnCtn_page"
            id='product'>
            <div class="btn noBorder noMargin"
              @click="deleteLog(productLog,'productLog')">批量删除</div>
            <div class="btn noBorder noMargin">批量打印</div>
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
              <span class="tb_row middle flex08">备注信息</span>
              <span class="tb_row middle flex08">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemLog,indexLog) in productLog"
              :key="indexLog">
              <span class="tb_row flex04">
                <el-checkbox v-model="itemLog.checked"></el-checkbox>
              </span>
              <span class="tb_row">{{itemLog.create_time}}</span>
              <span class="tb_row">{{itemLog.product_code}}</span>
              <span class="tb_row">{{itemLog.size + '/' + itemLog.color}}</span>
              <span class="tb_row">{{itemLog.order_code}}</span>
              <span class="tb_row flex08 two_line">{{actionTypeArr[itemLog.type]}}<br />{{itemLog.stock_number}}</span>
              <span class="tb_row flex08">{{itemLog.user_name}}</span>
              <span class="tb_row middle flex08">
                <template v-if="itemLog.remark">
                  <el-popover placement="top"
                    width="200"
                    trigger="click"
                    :content="itemLog.remark">
                    <span class="btn noBorder"
                      style="margin:0"
                      slot="reference">查看</span>
                  </el-popover>
                </template>
                <template v-else>无</template>
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
  </div>
</template>

<script>
import { stock, yarnStock, yarn, yarnColor, material, packStock, packag, productStock, product } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      stockInfo: {
        type: []
      },
      nowTime: this.$getTime(),
      yarnList: [],
      yarnTotal: 1,
      yarnPages: 1,
      yarnLog: [],
      yarnLogTotal: 1,
      yarnLogPages: 1,
      yarnColorList: [],
      yarnNameList: [],
      searchYarn: '',
      searchYarnLog: '',
      yarnAction: '',
      yarnEditInfo: [],
      actionTypeArr: ['', '入库', '出库'],
      actionArr: [
        {
          name: '预定购入库',
          action: 1
        },
        {
          name: '加工出库',
          action: 2
        },
        {
          name: '加工入库',
          action: 3
        },
        {
          name: '生产出库',
          action: 4
        },
        {
          name: '订购入库',
          action: 5
        },
        {
          name: '结余入库',
          action: 6
        },
        {
          name: '结余出库',
          action: 7
        },
        {
          name: '订单取消入库',
          action: 8
        },
        {
          name: '仓库入库',
          action: 10
        },
        {
          name: '仓库出库',
          action: 13
        }
      ],
      materialList: [],
      materialTotal: 1,
      materialPages: 1,
      materialLog: [],
      materialLogTotal: 1,
      materialLogPages: 1,
      materialEditInfo: [],
      materialNameList: [],
      searchMaterial: '',
      searchMaterialLog: '',
      materialAction: '',
      packList: [],
      packTotal: 1,
      packPages: 1,
      packLog: [],
      packLogTotal: 1,
      packLogPages: 1,
      packEditInfo: [],
      packNameList: [],
      searchPack: '',
      searchPackLog: '',
      // packAction: '',
      productList: [],
      productTotal: 1,
      productPages: 1,
      productLog: [],
      productLogTotal: 1,
      productLogPages: 1,
      searchProduct: '',
      searchProductLog: '',
      productNameList: [],
      productEditInfo: []
    }
  },
  methods: {
    getListAndLog (type) {
      if (type.indexOf(1) !== -1) {
        this.getYarnList(1)
        this.getYarnLog(1)
        if (this.yarnColorList.length === 0) {
          yarnColor.list().then(res => {
            if (res.data.status) {
              this.yarnColorList = res.data.data.map(itemColor => {
                return { value: itemColor.name }
              })
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
      } else if (type.indexOf(2) !== -1) {
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
      } else if (type.indexOf(3) !== -1) {
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
      } else if (type.indexOf(4) !== -1) {
        this.getProductList(1)
        this.getProductLog(1)
        if (this.productNameList.length === 0) {
          product.list().then(res => {
            if (res.data.status === false) {
              this.$message.error('获取产品列表失败，' + res.data.message)
            } else {
              this.productNameList = res.data.data
            }
          })
        }
      }
    },
    getYarnList (page) {
      this.loading = true
      yarnStock.list({
        limit: 5,
        stock_id: this.$route.params.id,
        type: 1,
        material_name: this.searchYarn,
        page: page || this.yarnPages
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
      yarnStock.log({
        stock_id: this.$route.params.id,
        type: 1,
        material_name: this.searchYarnLog,
        action: this.yarnAction,
        page: page || this.yarnLogPages,
        limit: 5
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取原料日志失败，' + res.data.message)
        } else {
          this.yarnLog = []
          this.yarnLog = res.data.data.map(item => {
            item.checked = false
            return item
          })
          this.yarnLogTotal = res.data.meta.total
        }
        this.loading = false
      })
    },
    getMaterialList (page) {
      this.loading = true
      yarnStock.list({
        limit: 5,
        page: page || this.materialPages,
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
      yarnStock.log({
        stock_id: this.$route.params.id,
        type: 2,
        material_name: this.searchMaterialLog,
        action: this.materialAction,
        page: page || this.materialLogPages,
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
    getPackList (page) {
      this.loading = true
      packStock.list({
        limit: 5,
        page: page || this.packPages,
        stock_id: this.$route.params.id,
        material_name: this.searchPack
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取包装库存列表失败，' + res.data.message)
        } else {
          this.packList = res.data.data.data
          this.packTotal = res.data.data.total
        }
        this.loading = false
      })
    },
    getPackLog (page) {
      this.loading = true
      packStock.log({
        stock_id: this.$route.params.id,
        material_name: this.searchPackLog,
        limit: 5,
        page: page || this.packLogPages
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
    getProductList (page) {
      this.loading = true
      productStock.list({
        stock_id: this.$route.params.id,
        limit: 5,
        page: page || this.productPages,
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
      productStock.log({
        stock_id: this.$route.params.id,
        type: 1,
        product_code: this.searchProductLog,
        page: page || this.productLogPages,
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
    getProductSizeColorInfo (event, itemPro) {
      itemPro.size_color = ''
      let flag = this.productNameList.find(item => item.id === event)
      if (flag) {
        itemPro.sizeColor = flag.size.map(itemSize => {
          return {
            value: itemSize.measurement,
            label: itemSize.measurement,
            children: flag.color.map(itemColor => {
              return {
                value: itemColor.color_name,
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
          size_color: '',
          editType: 'go',
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
          // this.packAction = ''
          this.getPackLog()
        } else if (type === 'product') {
          this.productEditInfo = [
            {
              productName: '',
              editType: 'go',
              size_color: '',
              number: '',
              remark: ''
            }
          ]
        } else if (type === 'filterProductList') {
          this.searchProduct = ''
          this.getProductList(1)
        } else if (type === 'filterProductLog') {
          this.searchProductLog = ''
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
      let flag = {
        name: true,
        attr: true,
        number: true,
        type: true
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
      let flag = {
        name: true,
        attr: true,
        number: true,
        type: true
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
      let flag = {
        name: true,
        attr: true,
        number: true,
        type: true,
        size: true
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
      console.log(data)
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
      let flag = {
        name: true,
        size: true,
        color: true,
        number: true,
        type: true
      }
      this.productEditInfo.forEach(itemMa => {
        if (!itemMa.productName) {
          flag.name = false
        }
        if (!itemMa.editType) {
          flag.type = false
        }
        if (!itemMa.size_color[0]) {
          flag.size = false
        }
        if (!itemMa.size_color[1]) {
          flag.color = false
        }
        if (!itemMa.number) {
          flag.number = false
        }
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
      let data = this.productEditInfo.map(item => {
        return {
          remark: item.remark,
          stock_number: (item.editType === 'go' ? Number(item.number) : -Number(item.number)),
          color: item.size_color[1],
          size: item.size_color[0],
          product_id: item.productName,
          stock_id: this.$route.params.id
          // company_id: window.sessionStorage.getItem('company_id')
        }
      })
      console.log(data)
      stock.productStock({
        data: data
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('保存失败，' + res.data.message)
        } else {
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
        this.productEditInfo.push({
          productName: item.product_id.toString(),
          size_color: [item.size, item.color],
          number: '',
          editType: editType,
          remark: '',
          sizeColor: item.category_info.size_measurement.map(itemSize => {
            return {
              value: itemSize.size_name,
              label: itemSize.size_name,
              children: item.category_info.color.map(itemColor => {
                return {
                  value: itemColor.color_name,
                  label: itemColor.color_name
                }
              })
            }
          })
        })
      }
    },
    deleteLog (item, type) {
      if (type === 'yarnLog') {
        let data = this.$flatten(item).filter(itemLog => itemLog.checked)
        if (data.length === 0) {
          this.$message.warning('检测到未选中日志')
        } else {
          this.$confirm('此操作将永久删除该日志，请谨慎操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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
        }
      } else if (type === 'materialLog') {
        let data = this.$flatten(item).filter(itemLog => itemLog.checked)
        if (data.length === 0) {
          this.$message.warning('检测到未选中日志')
        } else {
          this.$confirm('此操作将永久删除该日志，请谨慎操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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
        }
      } else if (type === 'packLog') {
        let data = this.$flatten(item).filter(itemLog => itemLog.checked)
        if (data.length === 0) {
          this.$message.warning('检测到未选中日志')
        } else {
          this.$confirm('此操作将永久删除该日志，请谨慎操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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
        }
      } else if (type === 'productLog') {
        let data = this.$flatten(item).filter(itemLog => itemLog.checked)
        if (data.length === 0) {
          this.$message.warning('检测到未选中日志')
        } else {
          this.$confirm('此操作将永久删除该日志，请谨慎操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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
        }
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
          name: '加工出库',
          action: 2
        },
        {
          name: '加工入库',
          action: 3
        },
        {
          name: '生产出库',
          action: 4
        },
        {
          name: '订购入库',
          action: 5
        },
        {
          name: '结余入库',
          action: 6
        },
        {
          name: '结余出库',
          action: 7
        },
        {
          name: '订单取消入库',
          action: 8
        },
        {
          name: '仓库入库',
          action: 10
        },
        {
          name: '仓库出库',
          action: 13
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
