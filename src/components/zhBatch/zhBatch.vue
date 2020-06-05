<template>
  <div class="zhBatch">
    <span class="zhText">共{{batch_data.length}}批
      <span class="blue"
        @click="showPopup=true">(点击查看详情)</span>
    </span>
    <div class="zhPopup"
      v-show="showPopup">
      <div class="main"
        style='width:1000px'>
        <div class="title">
          <div class="text">批次信息列表</div>
          <i class="el-icon-close"
            @click="showPopup=false"></i>
        </div>
        <div class="content">
          <div class="zh_batch_item"
            v-for="(itemBatch,indexBatch) in batch_data"
            :key="indexBatch">
            <div class="line blue">第{{itemBatch.id}}批</div>
            <div class="line">
              <span class="line_item">交货时间：{{itemBatch.time}}</span>
              <span class="line_item">批次名称：{{itemBatch.title || '无'}}</span>
              <span class="line_item">批次类型：{{itemBatch.type || '无'}}</span>
            </div>
            <div class="line">
              <span class="line_item">备注信息：{{itemBatch.remark || '暂无备注信息'}}</span>
            </div>
            <div class="line">
              <div class="batchTable"
                v-for="(itemPro,indexPro) in itemBatch.productInfo"
                :key="indexPro">
                <div class="thead">
                  <span class="trow">
                    <span class="tcolumn w180">产品</span>
                    <span class="tcolumn noPad"
                      :style="'flex-grow:' + (itemPro.sizeArr.length)">
                      <span class="trow">
                        <span class="tcolumn twoTitleItem">
                          <span class="leftBottom">颜色</span>
                          <span class="obliqueLine"></span>
                          <span class="rightTop">尺码</span>
                        </span>
                        <span class="tcolumn"
                          v-for="(itemSize,indexSize) in itemPro.sizeArr"
                          :key="indexSize">{{itemSize.size_name}}</span>
                        <span class="tcolumn">合计</span>
                      </span>
                    </span>
                  </span>
                </div>
                <div class="tbody">
                  <span class="trow">
                    <span class="tcolumn w180">
                      <span class="blue">{{itemPro.product_code}}</span>
                      <span>{{itemPro.category_info|filterType}}</span>
                      <span>单价：{{itemPro.price}}元/{{itemPro.category_info.unit}}</span>
                    </span>
                    <span class="tcolumn noPad"
                      :style="'flex-grow:' + (itemPro.sizeArr.length)">
                      <span class="trow"
                        v-for="(itemColor,indexColor) in itemPro.colorArr"
                        :key="indexColor">
                        <span class="tcolumn">{{itemColor.color_name}}</span>
                        <span class="tcolumn"
                          v-for="(itemSize,indexSize) in itemPro.sizeArr"
                          :key="indexSize">{{itemColor[itemSize.size_name]}}</span>
                        <span class="tcolumn">{{itemColor.number}}</span>
                      </span>
                      <span class="trow">
                        <span class="tcolumn">合计</span>
                        <span class="tcolumn"
                          v-for="(itemSize,indexSize) in itemPro.sizeArr"
                          :key="indexSize">{{itemSize.number}}</span>
                        <span class="tcolumn">{{itemPro.totalNum}}</span>
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './zhBatch.less'
export default {
  props: ['data'],
  data () {
    return {
      batch_data: [],
      showPopup: false
    }
  },
  watch: {
    data: {
      deep: true,
      handler (newVal) {
        let batchData = newVal.map(itemBatch => {
          let proInfo = itemBatch.product_info.map(itemPro => {
            return {
              category_info: itemPro.category_info,
              color_id: itemPro.color_id,
              color_name: itemPro.color_name,
              image: itemPro.image,
              number: itemPro.numbers,
              product_id: itemPro.product_info.product_id,
              product_code: itemPro.product_code,
              size_id: itemPro.size_id,
              size_name: itemPro.size_name,
              price: itemPro.unit_price
            }
          })
          let productInfo = this.$mergeData(proInfo, { mainRule: 'product_id', otherRule: [{ name: 'product_code' }, { name: 'category_info' }, { name: 'image' }, { name: 'price' }], childrenName: 'other_info' }).map(itemPro => {
            let sizeArr = []
            let colorArr = []
            itemPro.other_info.forEach(itemOther => {
              let sizeFlag = sizeArr.find(itemF => itemF.size_id === itemOther.size_id)
              if (!sizeFlag) {
                sizeArr.push({
                  size_name: itemOther.size_name,
                  size_id: itemOther.size_id,
                  number: itemOther.number
                })
              } else {
                sizeFlag.number = (Number(sizeFlag.number) || 0) + (Number(itemOther.number) || 0)
              }
              let colorFlag = colorArr.find(itemF => itemF.color_id === itemOther.color_id)
              if (!colorFlag) {
                colorArr.push({
                  color_name: itemOther.color_name,
                  color_id: itemOther.color_id,
                  number: itemOther.number,
                  [itemOther.size_name]: itemOther.number
                })
              } else {
                colorFlag.number = (Number(colorFlag.number) || 0) + (Number(itemOther.number) || 0)
                if (colorFlag[itemOther.size_name]) {
                  colorFlag[itemOther.size_name] = (Number(colorFlag[itemOther.size_name]) || 0) + (Number(itemOther.number) || 0)
                } else {
                  colorFlag[itemOther.size_name] = itemOther.number
                }
              }
            })
            return {
              product_id: itemPro.product_id,
              product_code: itemPro.product_code,
              category_info: itemPro.category_info,
              image: itemPro.image,
              price: itemPro.price,
              sizeArr: sizeArr,
              colorArr: colorArr,
              totalNum: sizeArr.map(itemM => +itemM.number || 0).reduce((a, b) => {
                return a + b
              }, 0)
            }
          })
          return {
            id: itemBatch.batch_id,
            title: itemBatch.batch_title,
            time: itemBatch.delivery_time,
            remark: itemBatch.desc,
            type: itemBatch.order_type,
            productInfo: productInfo
          }
        })
        this.batch_data = batchData
        console.log(this.batch_data)
      }
    }
  },
  filters: {
    filterType (item) {
      return [item.category_name, item.type_name, item.style_name].join('/')
    }
  }
}
</script>
