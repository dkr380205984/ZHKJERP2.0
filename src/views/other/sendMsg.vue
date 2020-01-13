<template>
  <div id="sendMsg"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">公司消息通知</span>
      </div>
      <div class="body">
        <div class="appendInfo">
          <div class="row">
            <div class="box box1">
              <div class="label">通知类型：</div>
              <div class="content">
                <div class="btnCtn">
                  <span class="btn blue"
                    :class="{'active':type==='普通'}"
                    @click="type='普通'">普通</span>
                </div>
                <div class="btnCtn">
                  <span class="btn yellow"
                    :class="{'active':type==='重要'}"
                    @click="type='重要'">重要</span>
                </div>
                <div class="btnCtn">
                  <span class="btn red"
                    :class="{'active':type==='紧急'}"
                    @click="type='紧急'">紧急</span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="box box1">
              <div class="label">通知标题：</div>
              <div class="content"
                style="height: 32px;">
                <el-input placeholder="请输入通知标题"
                  v-model="title"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="box box1">
              <div class="label">通知内容：</div>
              <div class="content">
                <!-- <el-input placeholder="请输入通知内容"
                  type="textarea"
                  :rows="5"
                  v-model="content"></el-input> -->
                <div ref='editor'></div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="box box1">
              <div class="label">通知人员：</div>
              <div class="content">
                <div class="btnCtn"
                  v-for="(item,index) in groupSelf"
                  :key="index">
                  <span class="btn normal"
                    @click="getUsers(index)"
                    :class="{'active':item.check}">{{item.name}}</span>
                </div>
              </div>
              <div class="content">
                <el-checkbox v-for="(item,index) in userListSelf"
                  :key="index"
                  v-model="item.check">{{item.name}}
                </el-checkbox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="box box1">
              <div class="label">已选人员：</div>
              <div class="content">
                <el-tag size="mini"
                  v-if="checkList.length===0"
                  type="warning">无</el-tag>
                <el-tag v-for="(item,index) in checkList"
                  :key="index"
                  size="mini"
                  @close="handleClose(item.id)"
                  closable>{{item.name}}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="sendMsg">发布</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import E from 'wangeditor'
import { group, auth, notify } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      title: '',
      content: '',
      type: '普通',
      editor: '',
      pages: 1,
      groupSelf: JSON.parse(JSON.stringify(this.$store.state.group)),
      userListSelf: JSON.parse(JSON.stringify(this.$store.state.userList)),
      defaultGroup: []
    }
  },
  computed: {
    group () {
      return this.$store.state.group
    },
    userList () {
      return this.$store.state.userList
    },
    checkList () {
      return this.userListSelf.filter((item) => {
        return item.check
      })
    },
    showCheck () {
      return this.checkRouter.find((item) => item === this.$route.name)
    }
  },
  watch: {
    group (val) {
      this.groupSelf = JSON.parse(JSON.stringify(val))
    },
    userList (val) {
      this.userListSelf = JSON.parse(JSON.stringify(val))
      this.getDefaultGroup()
    },
    msgSwitch (val) {
      if (val) {
        this.sendMsg()
      }
    },
    tag (val) {
      if (val === '审核') {
        this.userListSelf = this.userListSelf.filter((item) => item.has_check === 1)
      } else {
        this.userListSelf = this.userList
      }
    }
  },
  methods: {
    init () {
      // 分组信息获取一次,保存在vuex里
      if (this.group.length === 0) {
        group.list().then((res) => {
          this.$store.commit('getGroup', [{ name: '所有人', check: false }].concat(res.data.data.map(item => {
            return {
              name: item.name,
              check: false
            }
          })))
        })
      }
      if (this.userList.length === 0) {
        auth.list().then((res) => {
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).tag === '审核') {
            this.$store.commit('getUserList', res.data.data.map((item) => {
              return {
                station: item.station,
                group: item.group,
                id: item.id,
                name: item.name,
                has_check: item.has_check,
                check: false
              }
            }).filter((item) => item.has_check === 1))
          } else {
            this.$store.commit('getUserList', res.data.data.map((item) => {
              return {
                station: item.station,
                group: item.group,
                id: item.id,
                name: item.name,
                has_check: item.has_check,
                check: false
              }
            }))
          }
        })
      }
      if (window.localStorage.getItem(this.$route.name)) {
        let data = JSON.parse(window.localStorage.getItem(this.$route.name))
        this.msgFlag = data.msgFlag
        this.title = data.title
        this.type = data.type
        this.tag = data.tag
        this.defaultGroup = data.receive_user
      }
      this.loading = false
    },
    getDefaultGroup () {
      if (this.defaultGroup.length && this.defaultGroup.length > 0) {
        this.userListSelf.forEach((item) => {
          if (this.defaultGroup.find((itemFind) => itemFind === item.id)) {
            item.check = true
          }
        })
      }
    },
    getUsers (index) {
      let group = this.groupSelf[index]
      this.groupSelf[index].check = !group.check
      this.userListSelf.forEach((item) => {
        if (index === 0) {
          item.check = group.check
        } else if (index !== 0 && (item.station === group.name || item.group === group.name)) {
          item.check = group.check
        }
      })
    },
    handleClose (id) {
      this.userListSelf.find((item) => item.id === id).check = false
    },
    sendMsg () {
      let formData = {
        msgFlag: this.msgFlag,
        title: this.title,
        content: this.content,
        type: this.type,
        tag: '公司',
        router_url: '/other/msgList',
        receive_user: this.checkList.map(item => item.id)
      }
      notify.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('发布成功')
          this.title = ''
          this.content = ''
        }
      })
    }
  },
  mounted () {
    this.init()
    this.editor = new E(this.$refs.editor)
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      // 'image', // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
      'fullscreen' // 全屏
    ]
    this.editor.customConfig.onchange = (html) => {
      this.content = html // 绑定当前逐渐地值
    }
    this.editor.create()
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/other/sendMsg.less";
</style>
<style lang="less">
#sendMsg {
  .el-input__inner {
    height: 32px;
  }
}
</style>
