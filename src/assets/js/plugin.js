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
    return [year, month.toString()[1] ? month : '0' + month, data.toString()[1] ? data : '0' + data].join('-')
  },
  cloneData: (data) => {
    if (data === null) {
      return 'Null'
    } else if (data === undefined) {
      return 'Undefined'
    }
    return JSON.parse(JSON.stringify(data))
  },
  getDataType: (data) => {
    return Object.prototype.toString.call(data).split(' ')[1].split(']')[0]
  },
  flatten: (data) => {
    let _this = plugin
    let oldData = _this.cloneData(data)
    let type = _this.getDataType(oldData)
    if (type === 'Object') {
      for (let index in oldData) {
        let item = oldData[index]
        let itemType = _this.getDataType(item)
        if (itemType === 'Object') {
          let deleteProp = _this.cloneData(item) // 保存一份需要处理的数据
          delete oldData[index]
          return _this.flatten({ ...oldData, ...deleteProp })
        } else if (itemType === 'Array') {
          let newData = []
          let deleteProp = _this.cloneData(item) // 保存一份需要处理的数据
          delete oldData[index]
          deleteProp.forEach(itemDel => {
            newData.push({ ...oldData, [index]: itemDel })
          })
          return _this.flatten(newData)
        }
      }
      return oldData
    } else if (type === 'Array') {
      for (let index in oldData) {
        let item = oldData[index]
        let itemType = _this.getDataType(item)
        if (itemType === 'Object') {
          oldData[index] = _this.flatten(item)
        } else if (itemType === 'Array') {
          let newArr = []
          oldData.forEach(itemOld => {
            newArr.push(...itemOld)
          })
          return _this.flatten(newArr)
        }
      }
      return oldData
    } else {
      return oldData
    }
  }
}
export default {
  install (Vue) {
    Vue.prototype.$openUrl = plugin.openUrl
    Vue.prototype.$getTime = plugin.getTime
    Vue.prototype.$clone = plugin.cloneData
    Vue.prototype.$flatten = plugin.flatten
  }
}
