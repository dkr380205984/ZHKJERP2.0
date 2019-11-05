<template>
  <div id="app">
    <!-- keep-alive是Vue提供的一个抽象组件，用来对组件进行缓存  -->
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<style>
</style>
