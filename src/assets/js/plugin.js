const plugin = {
  openUrl: (str) => {
    window.open(str)
  },
  getTime: (date) => {
    if (date && !new Date(date)) {
      throw new TypeError('The correct format was not obtained for function "getTime"')
    }
    let nowDate = date ? new Date(date) : new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth()
    const data = nowDate.getDate()
    return [year, month, data].join('-')
  }
}
export default {
  install (Vue) {
    Vue.prototype.$openUrl = plugin.openUrl
    Vue.prototype.$getTime = plugin.getTime
  }
}
