<template>
  <div id="logStatistics"
    class="indexMain">
    <div class="module">
      <div class="listCtn">
        <el-tabs style="width:100%;font-size:16px"
          v-model="type">
          <el-tab-pane label="物料订购/调取"
            name="物料订购/调取">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">物料名称/属性</span>
                </div>
                <div class="col">
                  <span class="text">类型</span>
                </div>
                <div class="col">
                  <span class="text">公司名称</span>
                </div>
                <div class="col">
                  <span class="text">单价</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">截止日期</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">物料名称/属性</span>
                </div>
                <div class="col">
                  <span class="text">类型</span>
                </div>
                <div class="col">
                  <span class="text">公司名称</span>
                </div>
                <div class="col">
                  <span class="text">单价</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">截止日期</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">123456元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">123456元</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="物料加工"
            name="物料加工">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">物料名称/属性</span>
                </div>
                <div class="col">
                  <span class="text">工序</span>
                </div>
                <div class="col">
                  <span class="text">加工单位</span>
                </div>
                <div class="col">
                  <span class="text">单价</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">截止日期</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">物料名称/属性</span>
                </div>
                <div class="col">
                  <span class="text">工序</span>
                </div>
                <div class="col">
                  <span class="text">加工单位</span>
                </div>
                <div class="col">
                  <span class="text">单价</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">截止日期</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">123456元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">123456元</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="物料出入库"
            name="物料出入库">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">出入库时间</span>
                </div>
                <div class="col">
                  <span class="text">物料名称/属性</span>
                </div>
                <div class="col">
                  <span class="text">操作类型</span>
                </div>
                <div class="col">
                  <span class="text">出入库单位</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">出入库时间</span>
                </div>
                <div class="col">
                  <span class="text">物料名称/属性</span>
                </div>
                <div class="col">
                  <span class="text">操作类型</span>
                </div>
                <div class="col">
                  <span class="text">出入库单位</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="织造分配"
            name="织造分配">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">分配日期</span>
                </div>
                <div class="col">
                  <span class="text">织造单位</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">单价(元)</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成日期</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">分配日期</span>
                </div>
                <div class="col">
                  <span class="text">织造单位</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">单价(元)</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成日期</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">123456元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">123456元</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="补纱日志"
            name="补纱日志">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">补纱日期</span>
                </div>
                <div class="col">
                  <span class="text">补纱单位</span>
                </div>
                <div class="col">
                  <span class="text">原料信息</span>
                </div>
                <div class="col">
                  <span class="text">补纱数量(kg)</span>
                </div>
                <div class="col">
                  <span class="text">承担比例</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">补纱日期</span>
                </div>
                <div class="col">
                  <span class="text">补纱单位</span>
                </div>
                <div class="col">
                  <span class="text">原料信息</span>
                </div>
                <div class="col">
                  <span class="text">补纱数量(kg)</span>
                </div>
                <div class="col">
                  <span class="text">承担比例</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="半成品加工"
            name="半成品加工">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">加工单位</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">所需辅料</span>
                </div>
                <div class="col">
                  <span class="text">单价(元)</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成时间</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">加工单位</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">所需辅料</span>
                </div>
                <div class="col">
                  <span class="text">单价(元)</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成时间</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">123456元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">123456元</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="产品收发"
            name="产品收发">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">单位名称</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">收发类型</span>
                </div>
                <div class="col">
                  <span class="text">捆数</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成时间</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">单位名称</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">收发类型</span>
                </div>
                <div class="col">
                  <span class="text">捆数</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成时间</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="半成品检验"
            name="半成品检验">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">检验日期</span>
                </div>
                <div class="col">
                  <span class="text">织造单位</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">检验数量</span>
                </div>
                <div class="col">
                  <span class="text">次品信息</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">检验日期</span>
                </div>
                <div class="col">
                  <span class="text">织造单位</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">检验数量</span>
                </div>
                <div class="col">
                  <span class="text">次品信息</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
              <div class="oneBox">
                <div class="label">次品数量:</div>
                <div class="content">123456</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="成品检验"
            name="成品检验">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">检验日期</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">检验数量</span>
                </div>
                <div class="col">
                  <span class="text">次品信息</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">检验日期</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">检验数量</span>
                </div>
                <div class="col">
                  <span class="text">次品信息</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
              <div class="oneBox">
                <div class="label">次品数量:</div>
                <div class="content">123456元</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="包装订购"
            name="包装订购">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">订购日期</span>
                </div>
                <div class="col">
                  <span class="text">订购单位</span>
                </div>
                <div class="col">
                  <span class="text">包装辅料</span>
                </div>
                <div class="col">
                  <span class="text">单价(元)</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成日期</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">订购日期</span>
                </div>
                <div class="col">
                  <span class="text">订购单位</span>
                </div>
                <div class="col">
                  <span class="text">包装辅料</span>
                </div>
                <div class="col">
                  <span class="text">单价(元)</span>
                </div>
                <div class="col">
                  <span class="text">数量</span>
                </div>
                <div class="col">
                  <span class="text">总价</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
                <div class="col">
                  <span class="text">完成日期</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">平均价格:</div>
                <div class="content">123456元</div>
              </div>
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
              <div class="oneBox">
                <div class="label">总价:</div>
                <div class="content">123456元</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="实际装箱"
            name="实际装箱">
            <div class="list">
              <div class="title">
                <div class="col">
                  <el-checkbox v-model="checkAll">全选</el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">装箱总数</span>
                </div>
                <div class="col">
                  <span class="text">箱数</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-checkbox v-model="checkAll"></el-checkbox>
                </div>
                <div class="col">
                  <span class="text">创建日期</span>
                </div>
                <div class="col">
                  <span class="text">产品信息</span>
                </div>
                <div class="col">
                  <span class="text">尺码颜色</span>
                </div>
                <div class="col">
                  <span class="text">装箱总数</span>
                </div>
                <div class="col">
                  <span class="text">箱数</span>
                </div>
                <div class="col">
                  <span class="text">备注</span>
                </div>
                <div class="col">
                  <span class="text">创建人</span>
                </div>
              </div>
            </div>
            <div class="statistics">
              <div class="oneBox">
                <div class="label">数量:</div>
                <div class="content">123456</div>
              </div>
              <div class="oneBox">
                <div class="label">箱数:</div>
                <div class="content">123456元</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="pages"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnBlue">导出勾选数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
export default {
  data () {
    return {
      checkAll: false,
      pages: 1,
      total: 0,
      type: '物料订购/调取'
    }
  },
  watch: {
    type (newVal) {
      this.getList()
    },
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
    // 更新筛选条件
    getFilters () {
      let params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.type = params.type
    },
    changeRouter (page) {
      let pages = page || 1
      this.$router.push('/product/productList/page=' + pages + '&&type=' + this.type)
    },
    getList () {

    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/financialStatistics/logStatistics.less";
</style>
<style lang="less">
#logStatistics {
  .el-tabs__item {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.65);
    &:hover {
      color: #1a95ff;
    }
    &.is-active {
      color: #1a95ff;
    }
  }
}
</style>
