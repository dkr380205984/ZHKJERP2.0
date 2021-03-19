<template>
  <div id='ET'
    class='document'>
    <div class="tableCtn">
      <div class="headerCtn">
        <div class="top">
          <div class="title">{{'桐庐凯瑞针纺'}}货运委托书</div>
        </div>
      </div>
      <div class="bodyCtn">
        <div class="rowCtn">
          <div class="rowItem col noBorder flex15">
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  label='委托书单号：'
                  placeholder='委托书单号'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  label='添加日期：'
                  placeholder='添加日期'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  label='打印日期：'
                  placeholder='打印日期'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem left">
                <document-input rowModle
                  label='打印人：'
                  placeholder='打印人'></document-input>
              </div>
            </div>
          </div>
          <div class="rowItem col">
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input rowModle
                  label='联系人:'
                  placeholder='联系人'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input rowModle
                  label='电话:'
                  placeholder='电话'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input rowModle
                  label="邮箱:"
                  placeholder='邮箱'></document-input>
              </div>
            </div>
            <div class="rowCtn noBorder">
              <div class="rowItem">
                <document-input rowModle
                  label='传真:'
                  placeholder='传真'></document-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bodyCtn marginTop"
        style="overflow:visible">
        <div class="rowCtn">
          <div class="rowItem center">SHIPPER<br />(发货人)</div>
          <div class="rowItem center flex2">
            <document-input rowModle
              noLabel
              placeholder='SHIPPER(发货人)'></document-input>
          </div>
          <div class="rowItem center flex4 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">运输方式</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='运输方式'></document-input>
              </div>
              <div class="rowItem center">价格条款</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='价格条款'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">发票号码</div>
              <div class="rowItem center"
                style="flex:3.03">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='发票号码'></document-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center">CONSIGNEE<br />(收货人)</div>
          <div class="rowItem center flex2">
            <document-input rowModle
              noLabel
              placeholder='SHIPPER(收货人)'></document-input>
          </div>
          <div class="rowItem center flex4 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">合同号码</div>
              <div class="rowItem center"
                style="flex:3.03">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='合同号码'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">开证日期</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='开证日期'></document-input>
              </div>
              <div class="rowItem center">信用证号</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='信用证号'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">金额USD</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='金额USD'></document-input>
              </div>
              <div class="rowItem center">收汇方式</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='收汇方式'></document-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center">NOTIFY<br />PARTY<br />(通知人)</div>
          <div class="rowItem center flex2">
            <document-input rowModle
              noLabel
              placeholder='SHIPPER(收货人)'></document-input>
          </div>
          <div class="rowItem center flex4 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">贸易性质</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='贸易性质'></document-input>
              </div>
              <div class="rowItem center">贸易国别</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='贸易国别'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">出口口岸</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='出口口岸'></document-input>
              </div>
              <div class="rowItem center">信用证号</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='信用证号'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">转运</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='转运'></document-input>
              </div>
              <div class="rowItem center">分批</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='分批'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">装运期限</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='装运期限'></document-input>
              </div>
              <div class="rowItem center">有效期限</div>
              <div class="rowItem center">
                <document-input rowModle
                  noLabel
                  innerAlign='center'
                  placeholder='有效期限'></document-input>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center">标记唛头</div>
          <div class="rowItem center"
            style="flex:0.99">货品规格</div>
          <div class="rowItem center"
            style="flex:0.99">HS CODE</div>
          <div class="rowItem center"
            style="flex:0.99">件数及包装</div>
          <div class="rowItem center"
            style="flex:0.99">毛重(KGS)</div>
          <div class="rowItem center"
            style="flex:0.98">净重(KGS)</div>
          <div class="rowItem center"
            style="flex:0.99">体积(VOL)</div>
        </div>
        <div class="rowCtn"
          style="min-height:56px"
          v-for="(itemPack,indexPack) in 20"
          :key="indexPack">
          <div class="rowItem center">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='标记唛头'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='货品规格'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='HS CODE'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='件数及包装'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='毛重(KGS)'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.98">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='净重(KGS)'></document-input>
          </div>
          <div class="rowItem center"
            style="flex:0.99">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='体积(VOL)'></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem"
            style="flex:3.04;">
            <span style="flex:1;padding-right:36px;text-align:right">TOTAL:</span>
          </div>
          <div class="rowItem">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='自动计算'></document-input>
          </div>
          <div class="rowItem">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='自动计算'></document-input>
          </div>
          <div class="rowItem"
            style="flex:0.99">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='自动计算'></document-input>
          </div>
          <div class="rowItem">
            <document-input rowModle
              innerAlign='center'
              noLabel
              placeholder='自动计算'></document-input>
          </div>
        </div>
        <div class="rowCtn">
          <div class="rowItem center">订仓说明</div>
          <div class="rowItem center flex3">
            <document-input rowModle
              noLabel
              placeholder='订仓说明'></document-input>
          </div>
          <div class="rowItem center flex3 col">
            <div class="rowCtn noBorder">
              <div class="rowItem center">总托盘数(PLTS)</div>
              <div class="rowItem center flex2">
                <document-input rowModle
                  noLabel
                  placeholder='总托盘数(PLTS)'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">船名航次</div>
              <div class="rowItem center flex2">
                <document-input rowModle
                  noLabel
                  placeholder='船名航次'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">提单号</div>
              <div class="rowItem center flex2">
                <document-input rowModle
                  noLabel
                  placeholder='提单号'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">海运费</div>
              <div class="rowItem center flex2">
                <document-input rowModle
                  noLabel
                  placeholder='海运费'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">包干费</div>
              <div class="rowItem center flex2">
                <document-input rowModle
                  noLabel
                  placeholder='包干费'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">运费</div>
              <div class="rowItem center flex2">
                <document-input rowModle
                  noLabel
                  placeholder='运费'></document-input>
              </div>
            </div>
            <div class="rowCtn">
              <div class="rowItem center">其它费用</div>
              <div class="rowItem center flex2">
                <document-input rowModle
                  noLabel
                  placeholder='其它费用'></document-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import documentInput from '@/components/documents/input/index.vue'
// import documentSelect from '@/components/documents/select/index.vue'
// import { documentSetting } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: false,
      packerInfo: [
        {
          sign: '',
          size: '',
          hs_code: '',
          pack_number: '',
          n_w_kgs: '',
          g_w_kgs: '',
          vol: ''
        }
      ]
    }
  },
  components: {
    documentInput
    // documentSelect
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/ET.less";
</style>
