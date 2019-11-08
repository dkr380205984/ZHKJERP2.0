<template>
  <div id="sampleList"
    class="indexMain">
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
            <div class="btn btnGray">新建样单</div>
            <div class="btn btnBlue">新建样品</div>
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
              <span class="text">花型</span>
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
                  <i class="el-icon-caret-top active"></i>
                  <i class="el-icon-caret-bottom"></i>
                </span>
              </span>
            </div>
            <div class="col">
              <span class="text">状态</span>
            </div>
            <div class="col">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">
              <zh-img-list :list="list"></zh-img-list>
            </div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">
              <div class="stateCtn active">
                <div class="state"></div>
                <span class="name">工</span>
              </div>
              <div class="stateCtn">
                <div class="state"></div>
                <span class="name">配</span>
              </div>
              <div class="stateCtn active">
                <div class="state"></div>
                <span class="name">报</span>
              </div>
              <div class="stateCtn">
                <div class="state"></div>
                <span class="name">样</span>
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
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">图片</div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">图片</div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">图片</div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">图片</div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">图片</div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">图片</div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">图片</div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">图片</div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">19ABA012345</div>
            <div class="col">围巾/针织/长巾</div>
            <div class="col">花纹</div>
            <div class="col">非常非常非常非常非常长的名字</div>
            <div class="col">图片</div>
            <div class="col">陈春燕</div>
            <div class="col">2018-03-05</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
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
@import "~@/assets/less/sample/sampleList.less";
</style>
