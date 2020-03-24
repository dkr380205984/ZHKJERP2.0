<template>
  <div class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">基本用法(hasBorder表示有绿线)</span>
      </div>
      <div class="detailCtn">
        <div class="floatRight">
          <div class="btnCtn">
            <div class="btn btnBlue"
              @click="test">右侧悬浮框按钮</div>
          </div>
          <div class="otherInfo">
            <div class="block">
              <span class="label">订单金额</span>
              <span class="text">￥568.903</span>
            </div>
            <div class="block">
              <span class="label">状态</span>
              <span class="text blue">进行中</span>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">样单编号：</span>
            <span class="text">19YABB041</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">样品名称：</span>
            <span class="text">2019新款披肩</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">张春霞</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建时间：</span>
            <span class="text">2018-09-09</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">样品图片：</span>
            <div class="imgCtn">
              <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573130321838&di=2d6a137902474c73459a7832e3d7b5e1&imgtype=0&src=http%3A%2F%2Fwx4.sinaimg.cn%2Fbmiddle%2Fa6d0124fly1fawg8nu0o2j20k00ez0tx0.jpg" />
              <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573130341226&di=449a9010a3ec49e9a8e2c4e41966acaa&imgtype=0&src=http%3A%2F%2Fwww.itmop.com%2Fupload%2F2017-9%2F15046867122689390.jpeg" />
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">关联单据：</span>
            <div class="rectCtn">
              <div class="rect">
                <div class="main">
                  <div class="icon yellow">
                    <img src="../../assets/image/sample/craft_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">工艺单</div>
                    <div class="text">隔壁老王</div>
                    <div class="text">2019-08-23</div>
                  </div>
                </div>
                <div class="menu">
                  <span class="opration">预览</span>
                  <span class="opration">打印</span>
                  <span class="opration">详情</span>
                  <span class="opration">...</span>
                </div>
              </div>
              <div class="rect">
                <div class="main">
                  <div class="icon blue">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">配料单</div>
                    <div class="text">隔壁老王</div>
                    <div class="text">2019-08-23</div>
                  </div>
                </div>
                <div class="menu">
                  <span class="opration">预览</span>
                  <span class="opration">打印</span>
                  <span class="opration">详情</span>
                  <span class="opration">...</span>
                </div>
              </div>
              <div class="rect">
                <div class="main">
                  <div class="icon green">
                    <img src="../../assets/image/sample/price_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">报价单</div>
                    <div class="text">隔壁老王</div>
                    <div class="text">2019-08-23</div>
                  </div>
                </div>
                <div class="menu">
                  <span class="opration">预览</span>
                  <span class="opration">打印</span>
                  <span class="opration">详情</span>
                  <span class="opration">...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">多行情况：</span>
            <div class="lineCtn">
              <div class="line">1. 均码 10*20*30</div>
              <div class="line">1. 均码 10*20*30</div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">样品描述：</span>
            <span class="text">此处为样品描述字数超过长度时选择此处为样品描述字数超过长度时选择此处为样品描述字数超过长度时选择换行此处为样品描述字数超过长度时选择此处为样品描述字数超过长度时选择此处为样品描述字数超过长度时选择换行</span>
          </div>
        </div>
        <div class="swichCtn">
          <div class="swich active">工艺单1</div>
          <div class="swich">工艺单2</div>
          <div class="swich">工艺单3</div>
          <div class="swich">工艺单4</div>
          <div class="swich">工艺单5</div>
          <div class="btn btnBlue">设为默认</div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">简单表格样式</span>
      </div>
      <div class="detailCtn">
        <zh-transition markId="1"
          :list="[{
          name:'啊啊啊啊',
          id:1
          },{
          name:'顶顶顶顶顶顶顶',
          id:2
          },{
          name:'反反复复烦烦烦',
          id:3
          },{
          name:'水水水水水水水事实上',
          id:4
          },{
          name:'她她她她她她',
          id:5
          }]"></zh-transition>
        <zh-transition markId="2"
          :list="[{
          name:'啊啊啊啊',
          id:1
          },{
          name:'顶顶顶顶顶顶顶',
          id:2
          },{
          name:'反反复复烦烦烦',
          id:3
          },{
          name:'水水水水水水水事实上',
          id:4
          },{
          name:'她她她她她她',
          id:5
          },{
          name:'啊啊啊啊',
          id:1
          },{
          name:'顶顶顶顶顶顶顶',
          id:2
          },{
          name:'反反复复烦烦烦',
          id:3
          },{
          name:'水水水水水水水事实上',
          id:4
          },{
          name:'她她她她她她',
          id:5
          }]"></zh-transition>
        <div class="normalTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow">
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
            </div>
            <div class="trow">
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
            </div>
            <div class="trow">
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
              <div class="tcolumn">简单表格</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">复杂表格样式(待定)</span>
      </div>
      <div class="detailCtn">
        <div class="flexTb">
          <div class="thead">
            <div class="trow">
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow">
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn">复杂表格</div>
              <div class="tcolumn"
                style="flex:3">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1">复杂表格</div>
                  <div class="tcolumn"
                    style="flex:2">
                    <div class="trow">
                      <div class="tcolumn">复杂表格</div>
                      <div class="tcolumn">复杂表格</div>
                    </div>
                    <div class="trow">
                      <div class="tcolumn">复杂表格</div>
                      <div class="tcolumn">复杂表格</div>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:1">复杂表格</div>
                  <div class="tcolumn"
                    style="flex:2">
                    <div class="trow">
                      <div class="tcolumn">复杂表格</div>
                      <div class="tcolumn">复杂表格</div>
                    </div>
                    <div class="trow">
                      <div class="tcolumn">复杂表格</div>
                      <div class="tcolumn">复杂表格</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tcolumn">复杂表格</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">组件测试</span>
      </div>
      <div class="detailCtn">
        <div style="padding:0 40px">
          <zh-time-process :processData="testData"
            v-model="arr"></zh-time-process>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      arr: [],
      testData: [{
        name: '物料计划',
        percent: 0.2
      }, {
        name: '物料入库',
        percent: 0.3
      }, {
        name: '半成品入库',
        percent: 0.4
      }, {
        name: '成品装箱',
        percent: 0.1
      }],
      translate: 0,
      translateFlag: false
    }
  },
  methods: {
    test () {
      console.log(this.arr)
    }
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/common.less";
</style>
