<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="less">
@import "~@/assets/less/element.less";
html,
body {
  margin: 0;
  height: 100%;
  min-width: 1366px;
}
#app {
  height: 100%;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0);
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 4px;
  background-color: transparent;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  height: 4px;
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
