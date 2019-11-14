const plugin = {
  openUrl: (str) => {
    window.open(str)
  }
}
export default {
  install (Vue) {
    Vue.prototype.$openUrl = plugin.openUrl
  }
}
