<template>
  <div id='stockDetail'
    class='indexMain'
    v-loading='loading'>
    <!-- 原料仓库信息 -->
    <template v-if="+$route.params.type === 1">
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
              <el-input class="inputs"
                v-model="searchYarnAttr"
                placeholder="输入原料属性按回车键查询"
                @change="getYarnList(1)">
              </el-input>
              <div class="btn btnGray"
                style="margin-left:0"
                @click="resetEditInfo('filterYarnList')">重置</div>
            </div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row">所属仓库</span>
              <span class="tb_row">原料名称</span>
              <span class="tb_row">原料属性</span>
              <span class="tb_row">色号</span>
              <span class="tb_row">批/缸号</span>
              <span class="tb_row">总入库（kg）</span>
              <span class="tb_row">总出库（kg）</span>
              <span class="tb_row">库存数量（kg）</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemMa,indexMa) in yarnList"
              :key="indexMa">
              <span class="tb_row">{{itemMa.stock_name}}</span>
              <span class="tb_row">{{itemMa.material_name}}</span>
              <span class="tb_row">{{itemMa.material_color}}</span>
              <span class="tb_row">{{itemMa.color_number}}</span>
              <span class="tb_row">{{itemMa.vat_code}}</span>
              <span class="tb_row">{{itemMa.total_push || 0}}</span>
              <span class="tb_row">{{itemMa.total_pop || 0}}</span>
              <span class="tb_row">{{itemMa.total_weight}}</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click="goLog(itemMa,'yarn')">日志</span>
              </span>
            </div>
            <div class="tb_content">
              <span class="tb_row">合计</span>
              <span class="tb_row"></span>
              <span class="tb_row"></span>
              <span class="tb_row"></span>
              <span class="tb_row"></span>
              <span class="tb_row"></span>
              <span class="tb_row"></span>
              <span class="tb_row">{{yarnTotalWeight}}</span>
              <span class="tb_row middle"></span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="yarnTotal"
              :current-page.sync="yarnPages"
              @current-change='getYarnList'>
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="module"
        v-if="false">
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
            <div class="btn noBorder noMargin"
              @click="downloadYarn">批量导出excel</div>
          </div>
          <div class="tableCtnLv2 minHeight5">
            <div class="tb_header">
              <span class="tb_row flex04"></span>
              <span class="tb_row">操作时间</span>
              <span class="tb_row">原料名称</span>
              <span class="tb_row flex08">原料属性</span>
              <span class="tb_row flex08">色号</span>
              <span class="tb_row flex08">批/缸号</span>
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
              <span class="tb_row flex08">{{itemLog.color_number}}</span>
              <span class="tb_row flex08">{{itemLog.vat_code}}</span>
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
              <span class="tb_row flex04">{{$toFixed(yarnTotalNumber) || 0}}kg</span>
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
    <template v-else-if="+$route.params.type === 2">
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
              <span class="tb_row">总入库</span>
              <span class="tb_row">总出库</span>
              <span class="tb_row">库存数量</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemMa,indexMa) in materialList"
              :key="indexMa">
              <span class="tb_row">{{itemMa.material_name}}</span>
              <span class="tb_row">{{itemMa.material_color}}</span>
              <span class="tb_row">{{itemMa.total_push || 0}}</span>
              <span class="tb_row">{{itemMa.total_pop || 0}}</span>
              <span class="tb_row">{{itemMa.total_weight}}</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click="goLog(itemMa,'material')">日志</span>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="materialTotal"
              :current-page.sync="materialPages"
              @current-change='getMaterialList'>
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="module"
        v-if="false">
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
    <template v-else-if="+$route.params.type === 3">
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
              <span class="tb_row">总入库</span>
              <span class="tb_row">总出库</span>
              <span class="tb_row">库存数量</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemMa,indexMa) in packList"
              :key="indexMa">
              <span class="tb_row">{{itemMa.material_name}}</span>
              <span class="tb_row">{{itemMa.size}}</span>
              <span class="tb_row">{{itemMa.attribute}}</span>
              <span class="tb_row">{{itemMa.total_push || 0}}</span>
              <span class="tb_row">{{itemMa.total_pop || 0}}</span>
              <span class="tb_row">{{itemMa.total_number}}</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click="goLog(itemMa,'pack')">日志</span>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="packTotal"
              :current-page.sync="packPages"
              @current-change='getPackList'>
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="module"
        v-if="false">
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
    <template v-else-if="+$route.params.type === 4">
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
              <span class="tb_row">已入库</span>
              <span class="tb_row">已出库</span>
              <span class="tb_row">库存数量</span>
              <span class="tb_row">更新时间</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(itemMa,indexMa) in productList"
              :key="indexMa">
              <span class="tb_row two_line"
                style="color:#1a95ff;cursor:pointer"
                @click="openUrl(itemMa.product_id)">{{itemMa.product_code}}<br />{{itemMa.category_info|filterProductType}}</span>
              <span class="tb_row two_line">
                <zh-img-list :list="itemMa.category_info.image"></zh-img-list>
              </span>
              <span class="tb_row">{{itemMa.size_name + '/' + itemMa.color_name}}</span>
              <span class="tb_row">{{(itemMa.total_push || 0) + itemMa.category_info.unit}}</span>
              <span class="tb_row">{{(itemMa.total_pop || 0) + itemMa.category_info.unit}}</span>
              <span class="tb_row">{{itemMa.total_number + itemMa.category_info.unit}}</span>
              <span class="tb_row">{{itemMa.update_time}}</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click="goLog(itemMa,'product')">日志</span>
              </span>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="productTotal"
              :current-page.sync="productPages"
              @current-change='getProductList'>
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="module"
        v-if="false">
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
import { yarnStock, packStock, productStock } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      selectLoading: false,
      stockInfo: {
        type: [],
        attendant: []
      },
      yarnList: [],
      yarnTotalWeight: 0,
      yarnTotal: 1,
      yarnPages: 1,
      yarnLog: [],
      checkYarnLogArr: [],
      yarnLogTotal: 1,
      yarnLogPages: 1,
      yarnTotalNumber: 0,
      searchYarn: '',
      searchYarnAttr: '',
      searchYarnLog: '',
      searchYarnLogCode: '',
      searchYarnLogDate: '',
      yarnAction: '',
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
    openUrl (id) {
      window.open('/product/productDetail/' + id)
    },
    getListAndLog (type) {
      if (+type === 1) {
        this.getYarnList(1)
        // this.getYarnLog(1)
      } else if (+type === 2) {
        this.getMaterialList(1)
        // this.getMaterialLog(1)
      } else if (+type === 3) {
        this.getPackList(1)
        // this.getPackLog(1)
      } else if (+type === 4) {
        this.getProductList(1)
        // this.getProductLog(1)
      }
    },
    getYarnList (page) {
      this.loading = true
      this.yarnPages = page || this.yarnPages
      yarnStock.list({
        limit: 10,
        type: 1,
        material_name: this.searchYarn,
        page: this.yarnPages
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取原料库存列表失败，' + res.data.message)
        } else {
          this.yarnList = res.data.data
          this.yarnTotal = res.data.meta.total
          this.yarnTotalWeight = this.$toFixed(res.data.total_weight)
        }
        this.loading = false
      })
    },
    getYarnLog (page) {
      this.loading = true
      this.yarnLogPages = page || this.yarnLogPages
      Promise.all([
        yarnStock.log({
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
          type: 1,
          start_time: this.searchYarnLogDate ? (this.searchYarnLogDate.length ? this.searchYarnLogDate[0] : '') : '',
          end_time: this.searchYarnLogDate ? (this.searchYarnLogDate.length ? this.searchYarnLogDate[1] : '') : '',
          order_code: this.searchYarnLogCode,
          material_name: this.searchYarnLog,
          action: this.yarnAction
        })
      ]).then(res => {
        this.yarnLog = []
        this.yarnLog = res[0].data.data.map(item => {
          item.checked = false
          return item
        })
        this.yarnLogTotal = res[0].data.meta.total
        this.yarnTotalNumber = res[1].data.data
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
        limit: 10,
        page: this.materialPages,
        type: 2,
        material_name: this.searchMaterial
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取辅料库存列表失败，' + res.data.message)
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
        type: 2,
        material_name: this.searchMaterialLog,
        action: this.materialAction,
        page: this.materialLogPages,
        limit: 5
      }).then(res => {
        if (res.data.status === false) {
          this.$message.error('获取辅料日志失败，' + res.data.message)
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
        limit: 10,
        page: this.packPages,
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
        limit: 10,
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
    // 重置按钮
    resetEditInfo (type) {
      this.$confirm('此操作将重置操作项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'filterYarnList') {
          this.searchYarn = ''
          this.getYarnList(1)
        } else if (type === 'filterYarnLog') {
          this.searchYarnLog = ''
          this.searchYarnLogCode = ''
          this.searchYarnLogDate = ''
          this.yarnAction = ''
          this.getYarnLog()
        } else if (type === 'filterMaterialList') {
          this.searchMaterial = ''
          this.getMaterialList(1)
        } else if (type === 'filterMaterialLog') {
          this.searchMaterialLog = ''
          this.materialAction = ''
          this.searchMaterialLogCode = ''
          this.searchMaterialLogDate = ''
          this.getMaterialLog()
        } else if (type === 'filterPackList') {
          this.searchPack = ''
          this.getPackList(1)
        } else if (type === 'filterPackLog') {
          this.searchPackLog = ''
          this.searchPackLogCode = ''
          this.searchPackLogDate = ''
          this.getPackLog()
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
    goLog (item, type) {
      this.$message.warning('暂未开放日志查询')
      // return
      // if (type === 'yarn') {
      //   this.searchYarnLog = item.material_name
      //   this.getYarnLog(1)
      // } else if (type === 'material') {
      //   this.searchMaterialLog = item.material_name
      //   this.getMaterialLog(1)
      // } else if (type === 'pack') {
      //   this.searchPackLog = item.material_name
      //   this.getPackLog(1)
      // } else if (type === 'product') {
      //   this.searchProductLog = item.product_code
      //   this.getProductLog(1)
      // } else {
      //   this.$message.error('出现未知错误，请尝试刷新页面')
      // }
      // document.getElementById(type).scrollIntoView(true)
    }
  },
  created () {
    this.getListAndLog(this.$route.params.type)
  },
  filters: {
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
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/stock/stockDetail.less";
</style>
