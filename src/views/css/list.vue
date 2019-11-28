<template>
  <div class="indexMain">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              placeholder="请输入编号查询"></el-input>
            <el-date-picker class="inputs"
              v-model="value"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0">重置</div>
          </div>
          <div class="leftCtn">
            <div class="btn noBorder">没有边框</div>
            <div class="btn btnWhiteBlue">白底蓝字</div>
            <div class="btn btnWhiteRed">白底红字</div>
            <div class="btn btnGray">灰色按钮</div>
            <div class="btn btnBlue"
              @click="showPopup=true">点击打开弹窗样式</div>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <div class="col">
              <span class="text">编号</span>
            </div>
            <div class="col">
              <transition v-show="!searchTypeFlag"
                name="el-zoom-in-bottom">
                <span class="text">品类
                  <i class="el-icon-search iconBtn"
                    @click="searchTypeFlag=true"></i>
                </span>
              </transition>
              <transition name="el-zoom-in-top">
                <div v-show="searchTypeFlag"
                  class="filterBox">
                  <el-cascader class="filter"
                    placeholder="筛选品类"
                    :options="treeData"
                    clearable
                    filterable></el-cascader>
                </div>
              </transition>
            </div>
            <div class="col">
              <span class="text">名称</span>
            </div>
            <div class="col">
              <span class="text">图片</span>
            </div>
            <div class="col">
              <span class="text">创建人</span>
            </div>
            <div class="col">
              <span class="text">创建时间
                <span class="iconCtn">
                  <i class="el-icon-caret-top green"></i>
                  <i class="el-icon-caret-bottom"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">状态1</span>
            </div>
            <div class="col">
              <span class="text">状态2</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">
              <zh-img-list :list="list"></zh-img-list>
            </div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">
              <div class="stateCtn green">
                <div class="state"></div>
                <span class="name">工</span>
              </div>
              <div class="stateCtn">
                <div class="state"></div>
                <span class="name">配</span>
              </div>
              <div class="stateCtn green">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
              <div class="stateCtn">
                <div class="state"></div>
                <span class="name">样</span>
              </div>
            </div>
            <div class="col">
              <div class="stateCtn row red">
                <div class="state"></div>
                <span class="name">待审核</span>
              </div>
            </div>
            <div class="col">
              <span class="opr">详情</span>
              <span class="opr">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span class="updated">更新</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <span class="delete">删除</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <span class="create">添加</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <span class="detail">查看</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">
              <zh-img-list :list="list"></zh-img-list>
            </div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">
              <div class="stateCtn green">
                <div class="state"></div>
                <span class="name">工</span>
              </div>
              <div class="stateCtn">
                <div class="state"></div>
                <span class="name">配</span>
              </div>
              <div class="stateCtn green">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
              <div class="stateCtn">
                <div class="state"></div>
                <span class="name">样</span>
              </div>
            </div>
            <div class="col">
              <div class="stateCtn row blue">
                <div class="state"></div>
                <span class="name">待审核</span>
              </div>
            </div>
            <div class="col">
              <span class="opr">详情</span>
              <span class="opr">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">
              <zh-img-list :list="list"></zh-img-list>
            </div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">
              <div class="stateCtn green">
                <div class="state"></div>
                <span class="name">工</span>
              </div>
              <div class="stateCtn">
                <div class="state"></div>
                <span class="name">配</span>
              </div>
              <div class="stateCtn green">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
              <div class="stateCtn">
                <div class="state"></div>
                <span class="name">样</span>
              </div>
            </div>
            <div class="col">
              <div class="stateCtn row green">
                <div class="state"></div>
                <span class="name">待审核</span>
              </div>
            </div>
            <div class="col">
              <span class="opr">详情</span>
              <span class="opr">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </div>
        </div>
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
    <div class="popup"
      v-show="showPopup">
      <div class="main">
        <div class="title">
          <div class="text">标题</div>
          <i class="el-icon-close"
            @click="showPopup=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">最多五个字：</div>
            <div class="info">
              <el-input placeholder="请输入"
                v-model="value"></el-input>
            </div>
            <div class="editBtn blue">添加</div>
          </div>
          <div class="row">
            <div class="label">标题四个：</div>
            <div class="info">
              <el-input placeholder="请输入"
                v-model="value"></el-input>
            </div>
            <div class="editBtn red">删除</div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input type="textarea"
                placeholder="请输入"
                v-model="value"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray">取消</div>
          <div class="btn btnBlue">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showPopup: false,
      searchTypeFlag: false,
      value: '',
      total: 100,
      pages: 1,
      treeData: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }],
      list: ['https://zhihui.tlkrzf.com/1572666116000.jpg?imageView2/1/w/100/100', 'https://zhihui.tlkrzf.com/1572225791000.png?imageView2/1/w/100/100', 'https://zhihui.tlkrzf.com/1572225798000.png?imageView2/1/w/100/100']
    }
  },
  methods: {
    getList () {

    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/common.less";
</style>
