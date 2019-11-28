<template>
  <div class="zhNavCtn">
    <el-menu mode="horizontal"
      style="height:100%;border-bottom:0"
      text-color="#fff"
      active-text-color="#1A94FF"
      background-color="#2E394F"
      router
      @select="hanldeSelect">
      <!-- <template v-for="(item,index) in renderData">
        <el-submenu v-if="!item.url"
          :key="index"
          :index="item.url?item.url:index.toString()">
          <template slot="title">
            <img v-if="item.icon"
              :src="item.icon"
              class="img">
            <span style="font-size:16px;vertical-align: 0px;">{{item.name}}</span>
          </template>
          <template v-if="item.name==='...'&&!item.url">
            <el-submenu v-for="(itemChild,indexChild) in item.children"
              :key="indexChild"
              :index="index + '-' + indexChild">
              <template slot="title">
                <div>
                  <img :src="itemChild.icon"
                    style="width:21px;height: 21px;vertical-align: -5px;margin-right:5px;">
                  {{itemChild.name}}
                </div>
              </template>
              <el-menu-item v-for="(itemGrandSon,indexGrandSon) in itemChild.children"
                :key="indexGrandSon"
                :index="itemGrandSon.url">
                <template slot="title">{{itemGrandSon.name}}</template>
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-if="item.name!=='...'">
            <el-menu-item v-for="(itemChild,indexChild) in item.children"
              :key="indexChild"
              :index="itemChild.url">
              <template slot="title">{{itemChild.name}}</template>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item v-else
          :key="index">
          <template slot="title">
            <img v-if="item.icon"
              :src="item.icon"
              class="img">
            <span style="font-size:16px;vertical-align: 0px;">{{item.name}}</span>
          </template>
        </el-menu-item>
      </template> -->
      <template v-for="(item,index) in renderData">
        <template v-if="item.children&&item.children.length>0">
          <el-submenu :key="index"
            :index="index.toString() + 'item'">
            <template slot="title">
              <img v-if="item.icon"
                :src="item.icon"
                class="img" />
              <span style="font-size:16px;vertical-align: 0px;">{{item.name}}</span>
            </template>
            <template v-for="(itemChild,indexChild) in item.children">
              <template v-if="itemChild.children&&itemChild.children.length>0">
                <el-submenu :key="indexChild"
                  :index="indexChild.toString() + 'itemChild'">
                  <template slot="title">
                    <img v-if="itemChild.icon"
                      :src="itemChild.icon"
                      style="width:21px;height: 21px;vertical-align: -5px;margin-right:5px;" />
                    <span style="font-size:14px;vertical-align: 0px;">{{itemChild.name}}</span>
                  </template>
                  <el-menu-item v-for="(itemGrand,indexGrand) in itemChild.children"
                    :key="indexGrand"
                    :index="itemGrand.url">
                    <template slot="title">
                      <span>{{itemGrand.name}}</span>
                    </template>
                  </el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :key="indexChild"
                  :index="itemChild.url">
                  <template slot="title">
                    <img v-if="itemChild.icon"
                      :src="itemChild.icon"
                      style="width:21px;height: 21px;vertical-align: -5px;margin-right:5px;" />
                    <span style="font-size:14px;vertical-align: 0px;">{{itemChild.name}}</span>
                  </template>
                </el-menu-item>
              </template>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :key="index"
            :index="item.url">
            <template slot="title">
              <img v-if="item.icon"
                :src="item.icon"
                class="img" />
              <span style="font-size:16px;vertical-align: 0px;">{{item.name}}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <!-- 使用elment-ui组件 -->
    <!-- <div class="zhNav"
      @mouseenter="mouseEnter(index)"
      @mouseleave="mouseLeave(index)"
      @click="handleClick(index)"
      v-for="(item,index) in renderData"
      :key="index">
      <div class="navTitle">
        <span class="name">
          <img :src="item.icon"
            v-if="item.icon"
            class="img">
          {{item.name}}
        </span>
        <i class="el-icon-arrow-down iconTop"
          v-if="item.name!=='...' && item.children && item.children.length>0"></i>
      </div>
      <div class="navChildren"
        :ref="item.name + index"
        v-if="item.children && item.children.length>0">
        <div class="navList"
          v-for="(itemChildren,indexChildren) in item.children"
          :key="indexChildren">
          <span class="name">
            <img :src="itemChildren.icon"
              v-if="itemChildren.icon"
              class="img">
            {{itemChildren.name}}
          </span>
          <i class="el-icon-arrow-right iconRight"
            v-if="itemChildren.children && itemChildren.children.length>0"></i>
          <div class="navGrandSon"
            v-if="itemChildren.children && itemChildren.children.length>0">
            <span class="navList"
              v-for="(itemGrandSon,indexGrandSon) in itemChildren.children"
              :key="indexGrandSon">
              <span class="name">{{itemGrandSon.name}}</span>
            </span>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import './zhNav.less'
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    maxLength: {
      type: [Number, String],
      default: 99,
      validator: function (value) {
        return /^[1-9]\d*$/.test(Number(value))
      }
    }
  },
  computed: {
    renderData () {
      if (this.data.length < this.maxLength) {
        return this.data
      } else {
        return [...this.data.slice(0, this.maxLength), {
          name: '...',
          children: this.data.slice(this.maxLength, this.data.length)
        }]
      }
    }
  },
  methods: {
    hanldeSelect (val) {

    }
  }
}
</script>
