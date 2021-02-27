<template>
  <div id="equipment"
    class="indexMain">
    <div class="cardCtn">
      <div class="cardTranslate"
        :style="{'transform':'translate(-' + translate*352  +'px)'}">
        <div class="card"
          :class="{'active':active===index}"
          v-for="(item,index) in machine"
          :key="index">
          <div class="cardMain front"
            @click="active=index">
            <div class="topCtn">
              <div class="imgCtn"><img :src="item.typeImg" /></div>
              <div class="span1">{{item.name}}</div>
              <div class="span2"
                :class="{'green':item.state===1,'gray':item.state===0}">
                <i class="circle"></i>
                <span>{{item.state===1?'运行中':'已关闭'}}</span>
              </div>
            </div>
            <div class="line">
              <span class="label">当前产品：</span>
              <span class="content">{{item.product.code}}</span>
            </div>
            <div class="line">
              <span class="label">产品产量：</span>
              <span class="content">
                <span class="big">{{item.product.production_number}}</span>
                <span class="unit">{{item.unit||'条'}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">设备详情
          <!-- <span class="titleBtn blue">添加设备</span>
          <span class="titleBtn orange">修改信息</span>
          <span class="titleBtn red">删除设备</span> -->
        </span>
      </div>
      <div class="detailCtn">
        <div class="floatRight"
          style="padding-right:141px">
          <div class="codeImg">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577273171703&di=946d92d27198ccaaa376c130d1202056&imgtype=0&src=http%3A%2F%2Fupload.taihainet.com%2Fqrcode%2F2019%2F1121%2F593227%2Fzldzdsgqm3nh-7.png" />
          </div>
          <div class="beizhu">保存图片分享机器二维码</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">设备类型：</span>
            <span class="text">{{machine[active].code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">设备名称：</span>
            <span class="text">{{machine[active].name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">所属车间：</span>
            <span class="text">{{machine[active].user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">注册时间：</span>
            <span class="text">{{machine[active].create_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">设备图片：</span>
            <div class="imgCtn">
              <img v-for="(item,index) in machine[active].imgs"
                :key="index"
                :src="item" />
            </div>
          </div>
        </div>
        <div class="boxBlock">
          <div class="block">
            <span class="label">运行状态</span>
            <span class="text"
              :class="{'green':machine[active].state===1,'gray':machine[active].state===0}">{{machine[active].state===1?'运行中':'已关闭'}}</span>
          </div>
          <div class="block">
            <span class="label">生产总量</span>
            <span class="text green">{{machine[active].production}}{{machine[active].unit||'条'}}</span>
          </div>
          <div class="block">
            <span class="label">运行总时长</span>
            <span class="text blue">{{machine[active].allTime}}h</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">当前生产
          <span class="titleBtn blue"
            @click="changePro">更换产品</span>
          <!-- <span class="titleBtn orange">修改数量</span>
          <span class="titleBtn red">取消生产</span> -->
        </span>
      </div>
      <div class="detailCtn">
        <div class="floatRight"
          v-if="machine[active].product.url!==''"
          style="padding-right:141px">
          <div class="codeImg">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577273171703&di=946d92d27198ccaaa376c130d1202056&imgtype=0&src=http%3A%2F%2Fupload.taihainet.com%2Fqrcode%2F2019%2F1121%2F593227%2Fzldzdsgqm3nh-7.png" />
          </div>
          <div class="beizhu">保存图片分享产品二维码</div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">产品编号：</span>
            <span class="text">{{machine[active].product.code}}
              <span class="blue"
                style="color:#1a95ff;cursor:pointer"
                @click="openUrl(machine[active].product.url)">(详情)</span>
            </span>
          </div>
          <div class="colCtn flex3">
            <span class="label">产品名称：</span>
            <span class="text">{{machine[active].product.name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">创建人：</span>
            <span class="text">{{machine[active].product.user_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">创建时间：</span>
            <span class="text">{{machine[active].product.create_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">产品图片：</span>
            <div class="imgCtn">
              <img v-for="(item,index) in machine[active].product.imgs"
                :key="index"
                :src="item" />
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">关联订单：</span>
            <div class="rectCtn"
              v-for="(item,index) in machine[active].product.order_data"
              :key="index">
              <div class="rect">
                <div class="main">
                  <div class="icon yellow">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">{{item.code}}</div>
                    <div class="text">{{item.user_name}}</div>
                    <div class="text">{{item.time}}</div>
                  </div>
                </div>
                <div class="menu">
                  <span class="opration">查看详情</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="boxBlock">
          <div class="block">
            <span class="label">计划生产</span>
            <span class="text green">{{machine[active].product.plan_number}}{{machine[active].unit||'条'}}</span>
          </div>
          <div class="block">
            <span class="label">已生产</span>
            <span class="text green">{{machine[active].product.production_number}}{{machine[active].unit||'条'}}</span>
          </div>
          <div class="block">
            <span class="label">生产时长</span>
            <span class="text blue">{{machine[active].product.time}}h</span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="changeProFlag">
      <div class="main">
        <div class="title">
          <div class="text">更换产品</div>
          <i class="el-icon-close"
            @click="changeProFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">请选择产品：</div>
            <div class="info">
              <el-select v-model="proIndex"
                filterable
                placeholder="请选择要生产的产品">
                <el-option v-for="(item,index) in proArr"
                  :key="index"
                  :value="index"
                  :label="item.code+'('+ item.name+')'"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">生产数量：</div>
            <div class="info">
              <el-input placeholder="请输入计划生产数量"
                v-model="proNum"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="changeProFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="replacePro">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      translate: 0,
      style: 'front',
      machine: [{
        name: '智能围巾连续整理机',
        code: '加工设备/整理',
        state: 0,
        production: 183244,
        allTime: 923,
        user_name: '后道车间',
        create_time: '2020-09-12',
        typeImg: require('../../assets/image/equipment/设备图1.png'),
        imgs: ['https://file.zwyknit.com/1610505453000.png'],
        product: {
          name: '人棉夹圈圈纱梭织围脖',
          code: 'HS21-1-5',
          user_name: '吴中权',
          create_time: '2019-12-20',
          plan_number: 10,
          production_number: 10,
          time: 5.2,
          imgs: ['https://file.zwyknit.com/1609892148000.jpg'],
          url: 'https://www.zwyknit.com/sample/sampleDetail/4034',
          order_data: [{
            code: 'FA-FAS-213-040',
            client: '上海逸韵服饰有限公司',
            number: 10,
            user_name: '吴中权',
            time: '2021-01-06',
            url: 'https://www.zwyknit.com/sample/sampleOrderDetail/2453#2453'
          }]
        }
      }, {
        name: '智能围巾压光机',
        code: '加工设备/压光',
        state: 0,
        production: 121500,
        allTime: 624,
        typeImg: require('../../assets/image/equipment/设备图1.png'),
        imgs: ['https://file.zwyknit.com/1610505456000.jpg'],
        user_name: '后道车间',
        create_time: '2020-09-12',
        product: {
          name: '条纹围巾',
          code: 'HS20-7-490',
          user_name: '吴中权',
          create_time: '2020-12-15',
          plan_number: 1020,
          production_number: 1020,
          time: 60.2,
          imgs: [require('../../assets/image/index/noPic.jpg')],
          url: '',
          order_data: [{
            code: 'EY20-214',
            client: '上海逸韵服饰有限公司',
            number: 1020,
            time: '2020-12-15',
            user_name: '小张',
            url: 'https://www.zwyknit.com/order/orderDetail/1936'
          }]
        }
      }, {
        name: '智能围巾针刺机',
        code: '加工设备/刺毛',
        state: 0,
        production: 19008,
        allTime: 1021,
        typeImg: require('../../assets/image/equipment/设备图1.png'),
        imgs: ['https://file.zwyknit.com/1610505459000.png', 'https://file.zwyknit.com/1610505462000.png'],
        user_name: '后道车间',
        create_time: '2020-09-13',
        product: {
          name: '腈纶格子斗篷',
          code: 'HS20-11-667/668/669',
          user_name: '王珊',
          create_time: '2020-11-06',
          plan_number: 1050,
          production_number: 280,
          time: 12.6,
          imgs: ['https://file.zwyknit.com/1604622922000.jpg'],
          url: 'https://www.zwyknit.com/product/productDetail/3520',
          order_data: [{
            code: '222-CESM136',
            client: '星朋商贸（上海）有限公司',
            number: 1050,
            time: '2019-10-25',
            user_name: '张愉',
            url: 'https://www.zwyknit.com/order/orderDetail/1880'
          }]
        }
      }, {
        name: '智能围巾超声波分切机',
        code: '面料加工设备/切割',
        state: 0,
        production: 53200,
        allTime: 429,
        typeImg: require('../../assets/image/equipment/设备图2.png'),
        imgs: ['https://file.zwyknit.com/1610505439000.png', 'https://file.zwyknit.com/1610505451000.png'],
        user_name: '后道车间',
        create_time: '2020-10-12',
        unit: '米',
        product: {
          name: '无',
          code: 'HS20-9-596',
          user_name: '郑春',
          create_time: '2019-12-20',
          plan_number: 1924,
          production_number: 1223,
          time: 16.6,
          imgs: ['https://file.zwyknit.com/1603161372000.jpg', 'https://file.zwyknit.com/1603161378000.jpg'],
          url: 'https://www.zwyknit.com/product/productDetail/3484',
          order_data: [{
            code: '200298',
            client: '美季',
            number: 3900,
            time: '2020-10-20',
            user_name: '吴迎星',
            url: 'https://www.zwyknit.com/order/orderDetail/1852'
          }]
        }
      }],
      proArr: [{
        name: '2019最新款围巾',
        code: '19ABA02589',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '瑞人721519翻单',
        code: '19ABA12589',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '瑞人721502款翻单',
        code: '19ABA02339',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '格挡针织球球帽',
        code: '19ABC02762',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '精编花式披肩',
        code: '19ACA12745',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '小兔毛翻边帽',
        code: '19ACA13697',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '女士腈纶针织围巾',
        code: '19ABA07899',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 866,
        time: 13.2,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '混色帽子',
        code: '19ABA56872',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '混色六色帽子',
        code: '19ABA36988',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '内销格子长巾圈圈',
        code: '19ABA23458',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }, {
        name: '绣花耳朵帽',
        code: '19ABA88956',
        user_name: '陈春燕',
        create_time: '2019-10-18',
        plan_number: 1200,
        production_number: 0,
        time: 0,
        imgs: ['http://zhihui.tlkrzf.com/1571362798000.png'],
        url: 'https://www.zwyknit.com/index/productDetail/1350',
        order_data: [{
          code: 'NC0022712',
          client: '杭州新世纪进出口有限公司',
          number: 1200,
          time: '2019-12-01',
          user_name: '杜亚梅',
          url: 'https://www.zwyknit.com/index/orderDetailNew/756'
        }]
      }],
      proIndex: '',
      proNum: '',
      changeProFlag: false,
      changeProIndex: '',
      direction: 'leftToRight'
    }
  },
  watch: {
    active (newVal, oldVal) {
      // 判断了从左往右和从右往左滚的动画
      if (newVal > oldVal) {
        this.translate = this.machine.length - newVal > 4 ? newVal : (this.machine.length - 4)
      } else {
        this.translate = this.translate - (oldVal - newVal) > 0 ? this.translate - (oldVal - newVal) : 0
      }
    }
  },
  methods: {
    openUrl (url) {
      window.open(url)
    },
    changePro () {
      this.changeProIndex = this.active
      this.changeProFlag = true
    },
    replacePro () {
      this.machine[this.changeProIndex].state = 1
      this.machine[this.changeProIndex].product = this.proArr[this.proIndex]
      this.machine[this.changeProIndex].product.plan_number = this.proNum
      this.changeProFlag = false
      this.active = this.changeProIndex
      this.$message.success('替换成功')
    }
  },
  mounted () {
    // 循环播放定时器
    setInterval(() => {
      if (this.direction === 'leftToRight') {
        this.active++
        if (this.active === this.machine.length) {
          this.direction = 'rightToleft'
        }
      }
      if (this.direction === 'rightToleft') {
        this.active--
        if (this.active === 0) {
          this.direction = 'leftToRight'
        }
      }
    }, 600000)
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/equipment/equipment.less";
</style>
