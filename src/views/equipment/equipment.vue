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
              <span class="label">产品：</span>
              <span class="content">{{item.product.code}}</span>
            </div>
            <div class="line">
              <span class="label">产量：</span>
              <span class="content">
                <span class="big">{{item.product.production_number}}</span>
                <span class="unit">条</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title hasBorder">设备详情
          <span class="titleBtn blue">添加设备</span>
          <span class="titleBtn orange">修改信息</span>
          <span class="titleBtn red">删除设备</span>
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
            <span class="label">设备编号：</span>
            <span class="text">{{machine[active].code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">设备名称：</span>
            <span class="text">{{machine[active].name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">管理员：</span>
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
        <!-- <div class="rowCtn">
          <div class="colCtn">
            <span class="label">关联订单：</span>
            <div class="rectCtn">
              <div class="rect">
                <div class="main">
                  <div class="icon yellow">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">ABC001</div>
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
            <div class="rectCtn">
              <div class="rect">
                <div class="main">
                  <div class="icon yellow">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">ABC002</div>
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
            <div class="rectCtn">
              <div class="rect">
                <div class="main">
                  <div class="icon yellow">
                    <img src="../../assets/image/sample/plan_icon.png" />
                  </div>
                  <div class="content">
                    <div class="text title">ABC003</div>
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
        </div> -->
        <div class="boxBlock">
          <div class="block">
            <span class="label">运行状态</span>
            <span class="text"
              :class="{'green':machine[active].state===1,'gray':machine[active].state===0}">{{machine[active].state===1?'运行中':'已关闭'}}</span>
          </div>
          <div class="block">
            <span class="label">生产总量</span>
            <span class="text green">{{machine[active].production}}条</span>
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
          <span class="titleBtn orange">修改数量</span>
          <span class="titleBtn red">取消生产</span>
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
            <span class="text green">{{machine[active].product.plan_number}}条</span>
          </div>
          <div class="block">
            <span class="label">已生产</span>
            <span class="text green">{{machine[active].product.production_number}}条</span>
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
        name: '电脑横机-001',
        code: 'S19A001',
        state: 1,
        production: 213294,
        allTime: 1284.6,
        user_name: '章宏',
        create_time: '2019-11-05',
        typeImg: require('../../assets/image/equipment/设备图1.png'),
        imgs: [require('../../assets/image/equipment/电脑横机.jpg')],
        product: {
          name: '蝴蝶结弹力纱帽子',
          code: '19ABD022319',
          user_name: '钟向成',
          create_time: '2019-12-20',
          plan_number: 3750,
          production_number: 1124,
          time: 56.2,
          imgs: ['https://zhihui.tlkrzf.com/1577843475000.png'],
          url: 'https://www.zwyknit.com/index/sampleDetail/2399',
          order_data: [{
            code: 'KR2019-10',
            client: '嵊州力欧进出口有限公司',
            number: 3750,
            user_name: '张春霞',
            time: '2019-11-20',
            url: 'https://www.zwyknit.com/index/orderDetailNew/1034'
          }]
        }
      }, {
        name: '电脑横机-002',
        code: 'S19C002',
        state: 0,
        production: 120000,
        allTime: 100.2,
        typeImg: require('../../assets/image/equipment/设备图1.png'),
        imgs: [require('../../assets/image/equipment/电脑横机.jpg')],
        user_name: '章宏',
        create_time: '2019-11-05',
        product: {
          name: '无',
          code: '无',
          user_name: '无',
          create_time: '无',
          plan_number: 0,
          production_number: 0,
          time: 0,
          imgs: [require('../../assets/image/index/noPic.jpg')],
          url: '',
          order_data: [{
            code: '无',
            client: '无',
            number: 0,
            time: '无',
            user_name: '无',
            url: ''
          }]
        }
      }, {
        name: '电脑横机-003',
        code: 'S19C003',
        state: 1,
        production: 1900,
        allTime: 12.6,
        typeImg: require('../../assets/image/equipment/设备图1.png'),
        imgs: [require('../../assets/image/equipment/电脑横机.jpg')],
        user_name: '章宏',
        create_time: '2019-11-05',
        product: {
          name: '弹力马海毛翻边帽',
          code: '19YCAA012396',
          user_name: '王忠伟',
          create_time: '2019-10-22',
          plan_number: 29500,
          production_number: 1900,
          time: 12.6,
          imgs: ['https://zhihui.tlkrzf.com/1577775853000.png', 'https://zhihui.tlkrzf.com/1577775532000.png'],
          url: 'https://www.zwyknit.com/index/sampleDetail/2397',
          order_data: [{
            code: '23663-WPRE',
            client: '杭州杭诺服饰有限公司',
            number: 23000,
            time: '2019-10-21',
            user_name: '谢卫平',
            url: ''
          }, {
            code: '24902-WPRE',
            client: '杭州杭诺服饰有限公司',
            number: 7000,
            time: '2019-10-25',
            user_name: '谢卫平',
            url: ''
          }, {
            code: '27278-WPRE',
            client: '杭州杭诺服饰有限公司',
            number: 4500,
            time: '2019-10-29',
            user_name: '谢卫平',
            url: ''
          }]
        }
      }, {
        name: '电脑横机-004',
        code: 'S19C004',
        state: 1,
        production: 11896,
        allTime: 204.4,
        typeImg: require('../../assets/image/equipment/设备图1.png'),
        imgs: [require('../../assets/image/equipment/电脑横机.jpg')],
        user_name: '章宏',
        create_time: '2019-11-05',
        product: {
          name: '阿尔泰卷毛连帽围巾',
          code: '19YACC012372',
          user_name: '王忠伟',
          create_time: '2019-11-28',
          plan_number: 1800,
          production_number: 813,
          time: 14.3,
          imgs: ['https://zhihui.tlkrzf.com/1577432446000.jpg'],
          url: 'https://www.zwyknit.com/index/sampleDetail/2372',
          order_data: [{
            code: 'NC0022712',
            client: '杭州新世纪进出口有限公司',
            number: 1200,
            time: '2019-12-06',
            user_name: '杜亚梅',
            url: 'https://www.zwyknit.com/index/orderDetailNew/756'
          }]
        }
      }, {
        name: '智能围巾剪裁机-001',
        code: 'S19C001',
        state: 1,
        production: 10202,
        allTime: 186.6,
        typeImg: require('../../assets/image/equipment/设备图2.png'),
        imgs: [require('../../assets/image/equipment/智能围巾剪裁机.jpg')],
        user_name: '殷金美',
        create_time: '2019-11-28',
        product: {
          name: '腈纶格子围巾',
          code: '19ABD021680',
          user_name: '陈春燕',
          create_time: '2019-12-20',
          plan_number: 1924,
          production_number: 1223,
          time: 16.6,
          imgs: ['https://zhihui.tlkrzf.com/1573268066000.jpg'],
          url: 'https://www.zwyknit.com/index/productDetail/1680',
          order_data: [{
            code: 'KR2019-10',
            client: '杭州飞泰服饰有限公司',
            number: 1924,
            time: '2019-12-20',
            user_name: '张春霞',
            url: 'https://www.zwyknit.com/index/orderDetailNew/757'
          }]
        }
      }, {
        name: '智能围巾面料开剪机-001',
        code: 'S19B001',
        state: 1,
        production: 168798,
        allTime: 202.6,
        typeImg: require('../../assets/image/equipment/设备图2.png'),
        imgs: [require('../../assets/image/equipment/智能围巾面料开剪机.jpg')],
        user_name: '殷金美',
        create_time: '2019-11-16',
        product: {
          name: '力欧2019-10',
          code: '19ABD022318',
          user_name: '江仙红',
          create_time: '2019-12-20',
          plan_number: 3750,
          production_number: 204,
          time: 18.6,
          imgs: ['https://zhihui.tlkrzf.com/1576815993000.png', 'https://zhihui.tlkrzf.com/1576816000000.png', 'https://zhihui.tlkrzf.com/1576816006000.png'],
          url: 'https://www.zwyknit.com/index/productDetail/2318',
          order_data: [{
            code: 'KR2019-10',
            client: '嵊州力欧进出口有限公司',
            number: 3750,
            time: '2019-12-20',
            user_name: '张春霞',
            url: 'https://www.zwyknit.com/index/orderDetailNew/1034'
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
    }, 6000)
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/equipment/equipment.less";
</style>
