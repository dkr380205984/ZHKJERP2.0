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
    const month = nowDate.getMonth() + 1
    const data = nowDate.getDate()
    return [year, month[1] ? month : '0' + month, data[1] ? data : '0' + data].join('-')
  }
}
export default {
  install (Vue) {
    Vue.prototype.$openUrl = plugin.openUrl
    Vue.prototype.$getTime = plugin.getTime
  }
}
