<template>
  <div id='DE'
    class='document edit'
    v-loading='loading'>
    <div class="tableCtn">
      <div class="headerCtn">
        <div class="top">
          <div class="title">{{companyName}}</div>
          <div class="title2">{{company_name}}</div>
          <div class="title2">{{company_address}}</div>
          <div class="title2">
            <span>电话：{{company_tel}}</span><span style="margin-left:120px">传真：{{company_fax}}</span>
          </div>
          <div class="title bigLetter">申报要素</div>
        </div>
      </div>
      <div class="bodyCtn noBorder">
        <div class="rowCtn">
          <div class="rowItem left">
            <document-input v-model="saveInfo.to"
              label='TO:'
              rowModle></document-input>
          </div>
        </div>
      </div>
      <div class="bodyCtn marginTop noBorder bgGray editBtnCtn"
        v-for="(item,index) in saveInfo.element_orders"
        :key="index"
        style="overflow:visible;padding:8px">
        <div class="addBtn"
          v-if="index === 0">
          <div @click="addItem(saveInfo.element_orders)">添加一组</div>
          <div @click="addItem(saveInfo.element_orders,item)">复制该组</div>
        </div>
        <div class="addBtn"
          v-else>
          <div class="red"
            @click="deleteItem(saveInfo.element_orders,index)">删除该组</div>
          <div @click="addItem(saveInfo.element_orders,item)">复制该组</div>
        </div>
        <div class="rowCtn">
          <div class="rowItem left w180 grayLabel">HS编码： </div>
          <div class="rowItem w500">
            <document-select v-model="item.hs_code"
              @select="selectHSCodeChange($event,item)"
              rowModle
              type='autocomplete'
              :optionData='HSList'
              optionLabel='hs_code'
              optionValue='hs_code'
              noLabel></document-select>
          </div>
        </div>
        <div class="rowCtn"
          v-for="(itemOther,indexOther) in item.other_info || []"
          :key="indexOther">
          <div class="rowItem left w180 grayLabel">{{itemOther[0]}}： </div>
          <div class="rowItem w500 editBtnCtn">
            <div class="deleteBtn"
              @click="deleteItem(item.other_info,indexOther)">删除</div>
            <document-input v-model="itemOther[1]"
              rowModle
              noLabel></document-input>
          </div>
        </div>
      </div>
      <div class="bodyCtn noBorder marginTop">
        <div class="rowCtn"
          style="height:200px">
          <div class="rowItem left">
            <document-input v-model="saveInfo.remarks"
              label='其它备注:'
              rowModle></document-input>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btn btnGray"
          @click="$router.go(-1)">返回</div>
        <div class="btn btnBlue"
          @click="saveAll">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
import documentInput from '@/components/documents/input/index.vue'
import documentSelect from '@/components/documents/select/index.vue'
import { documentSetting, documentsTable, documents } from '@/assets/js/api'
import { craftTypeList } from '@/assets/js/documentsCommon.js'
export default {
  data () {
    return {
      loading: false,
      companyName: window.sessionStorage.getItem('full_name'),
      company_name: '',
      company_address: '',
      company_tel: '',
      company_fax: '',
      typeList: [],
      craftTypeList,
      HSList: [],
      saveInfo: {
        to: '报关组工作人员', // 人员信息
        remarks: '', // 备注信息
        element_orders: [// 编码信息
          {
            hs_code: '', // 编码号
            other_info: []
          }
        ]
      }
    }
  },
  methods: {
    selectHSCodeChange ({ valueObj }, item) {
      const keyArr = valueObj.declaration_elements.split('$').map(itemM => itemM.split(':')[1]).filter(itemF => itemF).map(itemM => {
        const arr = itemM.split('[')
        return [arr[0], ((arr[1] && arr[1].split(']')[0]) || '')]
      })
      item.other_info = keyArr
    },
    saveAll () {
      if (this.$submitLock()) return
      documentsTable.DESave({
        document_id: this.$route.params.id,
        ...this.saveInfo,
        element_orders: this.saveInfo.element_orders.map(itemM => {
          return {
            hs_code: itemM.hs_code,
            other_info: (itemM.other_info && JSON.stringify(itemM.other_info)) || []
          }
        })
      }).then(res => {
        if (res.data.status !== false) {
          this.$message.success('编辑成功')
          this.$router.push(`/document/index/detail/${this.$route.params.id}?type=4`)
        }
      })
    },
    addItem (data, item) {
      if (item) {
        data.push(this.$clone(item))
        return
      }
      data.push({
        hs_code: '', // 编码号
        other_info: []
      })
    },
    deleteItem (data, index) {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        data.splice(index, 1)
        this.$forceUpdate()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  },
  created () {
    this.loading = true
    Promise.all([
      documentSetting.companyDetail(),
      documentSetting.typeList(),
      documentSetting.HSList(),
      documents.detail({
        id: this.$route.params.id
      })
    ]).then(res => {
      this.company_name = res[0].data.data.name
      this.company_address = res[0].data.data.address
      this.company_tel = res[0].data.data.tel
      this.company_fax = res[0].data.data.fax
      this.typeList = res[1].data.data.map(itemM => {
        return {
          value: `${itemM.name}(${itemM.english})`,
          label: `${itemM.name}(${itemM.english})`
        }
      })
      this.HSList = res[2].data.data
      if (res[3].data.data.status_declare_elements !== 2) {
        documentsTable.DEDetail({
          document_id: this.$route.params.id
        }).then(res => {
          if (res.data.status !== false) {
            this.saveInfo = {
              ...res.data.data,
              element_orders: res.data.data.element_orders.length > 0 ? res.data.data.element_orders.map(itemM => {
                return {
                  hs_code: itemM.hs_code,
                  other_info: itemM.other_info && JSON.parse(itemM.other_info)
                }
              }) : [{ hs_code: '', other_info: [] }]
            }
            this.loading = false
          }
        })
      } else {
        this.loading = false
      }
    })
  },
  components: {
    documentInput,
    documentSelect
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/documents/DE.less";
</style>
