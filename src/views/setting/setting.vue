<template>
  <div id="setting"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <div class="title">系统设置</div>
      </div>
      <div class="settingCtn">
        <div class="navFather">
          <div class="list"
            :class="{'active':pName===key}"
            v-for="(item,key,index) in nav"
            :key="index"
            @click="pName=key">{{key}}</div>
        </div>
        <div class="navSon">
          <div class="list"
            :class="{'active':cName===item}"
            v-for="(item,index) in nav[pName]"
            :key="index"
            @click="cName=item">{{item}}</div>
        </div>
        <div class="mainCtn"
          v-loading="loading">
          <template v-if="pName==='产品设置'&&cName==='产品分类'">
            <div class="treeCtn">
              <div class="treeMain">
                <el-tree ref="tree"
                  :key="tree_key"
                  :data="productTypeArr"
                  node-key="id"
                  :render-content="renderContent"
                  :expand-on-click-node="false"
                  :default-expand-all="false"
                  :default-expanded-keys="defaultExpand">
                </el-tree>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productType } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      nav: { '产品设置': ['产品分类', '产品花型', '产品成分', '产品尺码', '产品配色'],
        '工艺单设置': [],
        '物料设置': [],
        '员工帐号管理': [],
        '加工工序设置': [],
        '工厂信息设置': []
      },
      pName: '',
      cName: '',
      productTypeArr: [],
      tree_key: 0,
      defaultExpand: []
    }
  },
  watch: {
    cName (val) {
      if (val === '产品分类') {
        this.getProductType()
      }
    }
  },
  methods: {
    getProductType () {
      productType.list().then((res) => {
        this.productTypeArr = res.data.data.map((item) => {
          return {
            pid: item.pid,
            id: item.id,
            label: item.name,
            level: 1,
            children: item.child.map((item) => {
              return {
                pid: item.pid,
                id: item.id,
                label: item.name,
                level: 2,
                children: item.child.map((item) => {
                  return {
                    pid: item.pid,
                    id: item.id,
                    label: item.name,
                    children: item.child,
                    isEdit: false,
                    level: 3
                  }
                }),
                isEdit: false
              }
            }),
            isEdit: false
          }
        })
        this.loading = false
      })
    },
    // 产品类型添加
    renderContent (h, { node, data, store }) {
      if (data.level < 3) {
        return (
          <span class="tree_node_Ctn">
            <span>
              {this.showOrEdit(data, node)}
            </span>
            <div class="tree_node_op">
              <i class="el-icon-plus" on-click={(ev) => this.nodeAppend(ev, data)}></i>
              <i class="el-icon-edit" on-click={(ev) => this.nodeEdit(ev, store, data)}></i>
              <i class="el-icon-delete" on-click={() => this.nodeDelete(node, data)}></i>
            </div>
          </span>)
      } else {
        return (
          <span class="tree_node_Ctn">
            <span>
              {this.showOrEdit(data, node)}
            </span>
            <div class="tree_node_op">
              <i class="el-icon-edit" on-click={(ev) => this.nodeEdit(ev, store, data)}></i>
              <i class="el-icon-delete" on-click={() => this.nodeDelete(node, data)}></i>
            </div>
          </span>)
      }
    },
    // 编辑节点
    nodeEdit (ev, store, data) {
      data.isEdit = true
      this.$nextTick(() => {
        let $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')
        if (!$input) {
          $input = ''
        } else {
          $input = $input.focus()
        }
      })
    },
    // 节点删除
    nodeDelete (node, data) {
      this.$confirm('是否要删除该产品，这可能会影响包含该产品的订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productType.delete({
          id: data.id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '删除成功'
            })
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          } else {
            this.$message.error({
              message: res.data.message
            })
            this.loading = false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增节点
    nodeAppend (ev, data) {
      const newChild = { id: this.id--, label: '新增产品', isEdit: true, pid: data.id }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      // 新增节点后展开当前节点
      this.$refs.tree.store.nodesMap[data.id].expanded = true
      // 新增节点focus
      this.$nextTick(() => {
        let $input = ev.target.offsetParent.querySelector('input')
        if (!$input) {
          $input = ''
        } else {
          $input = $input.focus()
        }
      })
    },
    // 是否展示操作框
    showOrEdit (data, node) {
      if (data.isEdit) {
        return <input class="tree_edit_input" type="text" value={data.label} on-blur={ev => this.edit_sure(ev, data, node)} />
      } else {
        return <span className="node_labe">{data.label}</span>
      }
    },
    // 完成编辑
    edit_sure (ev, data, node) {
      this.loading = true
      let realId = null
      // <0说明是添加操作,>0则是编辑操作
      if (data.id > 0) {
        realId = data.id
      }
      const $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')
      if (!$input) {
        return false
      } else {
        data.label = $input.value
        data.isEdit = false
        productType.create({
          company_id: window.sessionStorage.getItem('company_id'),
          id: realId,
          pid: data.pid,
          name: $input.value
        }).then((res) => {
          if (res.data.status) {
            this.getType().then((res) => {
              this.loading = false
            })
          }
        })
      }
    }
  },
  created () {
    this.pName = '产品设置'
    this.cName = '产品分类'
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/setting/setting.less";
</style>
