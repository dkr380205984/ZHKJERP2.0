import Message from 'element-ui'
const plugin = {
  /**
   * @param {string} str 跳转的url地址
   * @returns {void}
   */
  openUrl: (str) => {
    window.open(str)
  },
  /**
   * @param {any} data 需要处理的时间戳数据
   * @param {string} connector 连接符(默认‘-’连接)
   * @returns {string} yyyy-MM-dd
   */
  getTime: (date, connector = '-', flag = false) => {
    if (date && !new Date(date)) {
      throw new TypeError('The correct format was not obtained for function "getTime"')
    }
    // let nowDate = (date ? new Date(date) : new Date()).toLocaleDateString()
    // return nowDate.replace(/\//g, connector)
    // 上面代码不会补全0
    let nowDate = date ? new Date(date) : new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth() + 1
    const data = nowDate.getDate()
    let timeArr = [year, month >= 10 ? month : `0${month}`, data >= 10 ? data : `0${data}`]
    if (!flag) {
      return timeArr.join(connector)
    }
    const hours = nowDate.getHours()
    const minutes = nowDate.getMinutes()
    const seconds = nowDate.getSeconds()
    return `${timeArr.join(connector)} ${[hours >= 10 ? hours : `0${hours}`, minutes >= 10 ? minutes : `0${minutes}`, seconds >= 10 ? seconds : `0${seconds}`].join(':')}`
  },
  /**
   * @param {any} data 需要深度克隆的数据
   * @returns {any} cloneData=>data
   */
  cloneData: (data) => {
    let _this = plugin
    let type = _this.getDataType(data)
    let newData = null
    if (type === 'Array') {
      newData = []
      data.forEach((item, index) => {
        newData[index] = _this.cloneData(item)
      })
    } else if (type === 'Object') {
      newData = {}
      for (let index in data) {
        let item = data[index]
        newData[index] = _this.cloneData(item)
      }
    } else {
      newData = data ? JSON.parse(JSON.stringify(data)) : data
    }
    return newData
  },
  /**
   * @param {any} data 需要判断类型的数据
   * @returns {string} String|Number|Null|Undefined|Object|Array|Function
   */
  getDataType: (data) => {
    if (data === null) {
      return 'Null'
    } else if (data === undefined) {
      return 'Undefined'
    }
    return Object.prototype.toString.call(data).split(' ')[1].split(']')[0]
  },
  /**
   * @param { {} | Array} data 需要扁平化的数据
   * @returns { Array | {} }
   */
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
          for (let hasKey in oldData) {
            if (deleteProp.hasOwnProperty(hasKey)) {
              throw new TypeError('存在相同的key值，无法执行')
            }
          }
          return _this.flatten({ ...oldData, ...deleteProp })
        } else if (itemType === 'Array') {
          let newData = []
          let deleteProp = _this.cloneData(item) // 保存一份需要处理的数据
          delete oldData[index]
          if (deleteProp.length < 1) {
            newData.push({ ...oldData })
          } else {
            deleteProp.forEach(itemDel => {
              newData.push({ ...oldData, [index]: itemDel })
            })
          }
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
  },

  /**
   * @param {Array} data 需要合并的数据
   * @param { {} } rule 合并规则
   * @returns {Array}
   *rule示例
   *{mainRule:'product_id/id',otherRule:[{name:'image/img'},{name:'product_code'},{name:'number',type:'add'}],childrenName:'other_info',childrenRule:{mainRule:['size/size_name','color']}}
   *输出：[
     {
       id:value,
       img:value,
       product_code:value,
       number:value(add),
       other_info:[{
         size_name:value,
         color:value,
         childrenMergeInfo:[{},{}]
       }]
     }
   ]
   *rule参数说明
   *mainRule:主要合并项（根据该项进行合并），当主要合并项为多个是可以为数组；格式：['size','color'] 。“/”在需要改变其key值时添加，“/”前为处理数据中的key,“/”后为处理后输出数据你为其命名的key
   *otherRule:其他处理项，name为处理项的key值,type为特殊处理，当前取值仅可为'add'，是在合并时累加该项，当type不存在时  name项会保留在mainRule同一个数据层级，“/”用法参考mainRule
   *childrenName:命名子合并项key值，默认值childrenMergeInfo，
   *childrenRule:多层级合并时传入，具体规则参考上方
   **/
  mergeData: (datas, rule) => {
    let _this = plugin
    let data = _this.cloneData(datas)
    let newData = []
    if (_this.getDataType(data) === 'Array') {
      data.forEach(item => {
        let ruleType = _this.getDataType(rule.mainRule)
        let flag = newData.find(value => {
          if (ruleType === 'Array') { // 处理根据多个key合并的情况
            let itemStr = []
            let valueStr = []
            rule.mainRule.forEach(itemMain => {
              let mainName = itemMain.split('/')
              itemStr.push(item[mainName[0]])
              valueStr.push(value[mainName[1] || mainName[0]])
            })
            return itemStr.join('/') === valueStr.join('/')
          } else if (ruleType === 'String') {
            let mainName = rule.mainRule.split('/')
            return value[mainName[1] || mainName[0]] === item[mainName[0]]
          }
        })
        let cloneItem = _this.cloneData(item) // clone其他项数据以方便保留
        if (!flag) {
          let obj = {}
          if (ruleType === 'Array') {
            rule.mainRule.forEach(itemRule => {
              let mainName = itemRule.split('/')
              obj[mainName[1] || mainName[0]] = item[mainName[0]]
              delete cloneItem[mainName[0]]
            })
          } else if (ruleType === 'String') {
            let mainName = rule.mainRule.split('/')
            obj[mainName[1] || mainName[0]] = item[mainName[0]]
            delete cloneItem[mainName[0]]
          }
          if (_this.getDataType(rule.otherRule) === 'Array' && rule.otherRule.length > 0) {
            rule.otherRule.forEach(itemRule => {
              let otherName = itemRule.name.split('/')
              obj[otherName[1] || otherName[0]] = item[otherName[0]]
              delete cloneItem[otherName[0]]
            })
          }
          if (rule.childrenName) {
            obj[rule.childrenName] = [cloneItem]
          } else {
            obj.childrenMergeInfo = [cloneItem]
          }
          newData.push(obj)
        } else {
          if (ruleType === 'Array') {
            rule.mainRule.forEach(itemMain => {
              let mainName = itemMain.split('/')
              delete cloneItem[mainName[0]]
            })
          } else if (ruleType === 'String') {
            let mainName = rule.mainRule.split('/')
            delete cloneItem[mainName[0]]
          }
          if (_this.getDataType(rule.otherRule) === 'Array' && rule.otherRule.length > 0) {
            rule.otherRule.forEach(itemRule => {
              let otherName = itemRule.name.split('/')
              delete cloneItem[otherName[0]]
              if (itemRule.type === 'add') {
                flag[otherName[1] || otherName[0]] = (Number(flag[otherName[1] || otherName[0]]) || 0) + (Number(item[otherName[0]]) || 0)
              } else if (itemRule.type === 'concat') {
                flag[otherName[1] || otherName[0]] = flag[otherName[1] || otherName[0]].concat(item[otherName[0]])
              }
            })
          }
          if (rule.childrenName) {
            flag[rule.childrenName].push(cloneItem)
          } else {
            flag.childrenMergeInfo.push(cloneItem)
          }
        }
      })
      if (rule.childrenRule) {
        newData.forEach(item => {
          item[rule.childrenName || 'childrenMergeInfo'] = _this.mergeData(item[rule.childrenName || 'childrenMergeInfo'], rule.childrenRule)
        })
      }
    } else {
      let type = _this.getDataType(data)
      throw new TypeError('An unknown error occurred from the mergeData function, and the parameter "data" expects to get an "array" but gets an "' + type + '"')
    }
    return newData
  },
  /**
   * @param { number | string[number]} number:需要处理的数据
   * @param {number} precision 精度
   * @returns {number}
   */
  toFixedAuto: (number, precision = 2) => {
    if (isNaN(Number(number))) {
      return NaN
    }
    if (precision === 0) {
      return Math.round(number)
    } else if (precision) {
      return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
    } else {
      return number
    }
  },
  /**
   * @param {Array} data 需要处理的数据
   * @param {number} index 切割数值(默认5)
   * @param {Array} arr 存储地址最后会返回这个数组
   * @returns {Array}
   */
  newSplice: (data, index = 5, arr) => {
    if (data.length === 0 || !data) {
      return []
    }
    let _this = plugin
    if (!arr) {
      arr = []
    }
    arr.push(data.splice(0, index))
    if (data.length > 0) {
      _this.newSplice(data, index, arr)
    }
    return arr
  },
  /**
   * @param {string} el 到达其视图的id
   * @returns {void|boolean}
   */
  goElView: (el) => {
    if (!el) {
      throw new TypeError('请传入element的"id"')
    }
    let ele = document.getElementById(el)
    if (ele) {
      ele.scrollIntoView(true)
    } else {
      return false
    }
  },
  winReload () {
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  },
  // 123456转123，456
  formatNum (num) {
    if (num === null || num === undefined) {
      return 'NaN'
    }
    var str = num.toString()
    var reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
    return str.replace(reg, '$1,')
  },
  strToAscII (string, flag, specialStr) {
    let strSpecialCharacters = specialStr || ['%', '/', '&', '?'] // 转化特殊字符'['与']'不可使用
    if (!flag) {
      let strArr = string.split('')
      string = strArr.map(itemStr => {
        if (strSpecialCharacters.indexOf(itemStr) !== -1) {
          itemStr = '<--' + itemStr.charCodeAt() + '-->'
        }
        return itemStr
      }).join('')
    } else {
      let stringArr = string.split('<--').map(item => {
        if (item.indexOf('-->') === -1) {
          return item
        } else {
          let innetItem = item.split('-->')
          innetItem[0] = String.fromCharCode(innetItem[0])
          return innetItem.join('')
        }
      })
      string = stringArr.join('')
    }
    return string
  },
  // 修复el-select readonly样式导致移动端不能弹出软键盘的bug
  fuckSelect () {
    Array.from(document.getElementsByClassName('el-select')).forEach((item) => {
      if (item.children[0].children[0]) {
        item.children[0].children[0].removeAttribute('readOnly')
        item.children[0].children[0].onblur = function () {
          let _this = this
          setTimeout(() => {
            _this.removeAttribute('readOnly')
          }, 200)
        }
      }
    })
  },
  /**
   * @param {Array} arr 需要去重的数组
   * @param {string} key 指定去重的唯一key
   * @returns {Array}
   */
  // 数组去重(仅用数组内子项为数字或字符串的数据结构)
  unique (arr, key) {
    if (key) {
      let newArr = []
      arr.forEach(itemF => {
        if (!newArr.find(itemFI => itemFI[key] === itemF[key])) {
          newArr.push(itemF)
        }
      })
      return newArr
    } else {
      return [...new Set(arr)]
    }
  },
  // 注意！这个方法会改变传进来的findArr数组
  // findArr 需要查找的数组 比如 [{name:'爸爸',money:'1000'},{{name:'爸爸',money:'2000'},{name:'爷爷',money:'1000'}]
  // compare 需要对比的对象 比如 {name:'爸爸',money:'2000'}
  // findWhich 需要比对哪些数据相同 比如 ['name']
  // addWhich 相同的数据需要相加的数据 比如 ['money']
  // 上面的例子是指findArr数组里找是否有跟compare , name相同的数据，如果有，则finded的money相加，如果没有，findArr会push compare这个对象进去，这会改变findArr,很多情况下，findArr可以是一个空数组
  commonFind (findArr, compare, findWhich, addWhich) {
    if (typeof (findWhich) === 'string') {
      return findArr.find((itemFind) => {
        return itemFind[findWhich] === compare[itemFind]
      })
    } else if (findWhich.constructor === Array) {
      let finded = findArr.find((itemFind) => {
        let flag = true
        findWhich.forEach((item) => {
          if (compare[item] !== itemFind[item]) {
            flag = false
          }
        })
        return flag
      })
      if (!finded) {
        findArr.push(compare)
      } else {
        if (addWhich.constructor === Array) {
          addWhich.forEach((item) => {
            finded[item] += Number(compare[item])
          })
        }
      }
    } else {
      console.error('第三个参数必须为字符串或数组格式')
    }
  },
  // 把带有斜杠，问号之类的特殊字符串转成路由不会报错的，type:true正转，false反转
  changeSpecialWord (str, type) {
    let newStr = str
    if (type) {
      newStr = newStr.replace(/\//g, '斜杠')
      newStr = newStr.replace(/\?/g, '问号')
      newStr = newStr.replace(/,/g, '逗号')
    } else {
      newStr = newStr.replace(/斜杠/g, '/')
      newStr = newStr.replace(/问号/g, '?')
      newStr = newStr.replace(/逗号/g, ',')
    }
    return newStr
  }
}
const submitLock = () => {
  let lock = true
  return function (messageStr = '请勿频繁点击') { // 采用闭包保存lock状态
    if (!lock) {
      let str = messageStr
      Message.Message.warning(str)
      return true
    }
    lock = false
    setTimeout(() => {
      lock = true
    }, 1000)
  }
}
/**
 * @param {Array} clientData      处理的client数据
 * @param {Blob} hasFirstType     是否含有最外层type类型
 * @param {Array,Number} type     过滤的type类型(优先级大于typeScope)
 * @param {Array} typeScope       type取值范围(闭区间)(优先级大于returnAll)
 * @param {Blob} returnAll        返回全部
 */
const getClientOptions = (clientData = [], companyType = [], { hasFirstType = false, type, typeScope, returnAll = true }) => {
  if (plugin.getDataType(clientData) !== 'Array') {
    throw new TypeError(`"clientData" is must be 'Array'`)
  } else if (plugin.getDataType(companyType) !== 'Array') {
    throw new TypeError(`"companyType" is must be 'Array'`)
  }
  // 过滤不符合条件的类型
  let companyFilterType = companyType.filter(itemF => {
    if (type) {
      const typeStr = plugin.getDataType(type)
      if (typeStr === 'Number') {
        return +itemF.value === +type
      } else if (typeStr === 'Array') {
        return type.includes(+itemF.value)
      } else {
        throw new TypeError(`'type' is must be 'Number' or 'Array'`)
      }
    } else if (typeScope) {
      const typeScopeStr = plugin.getDataType(typeScope)
      if (typeScopeStr === 'Array') {
        if (typeScope[0] && typeScope[1] && plugin.getDataType(typeScope[0]) === 'Number' && plugin.getDataType(typeScope[1]) === 'Number' && typeScope[1] > typeScope[0]) {
          return +itemF.value >= typeScope[0] && +itemF.value <= typeScope[1]
        } else if (typeScope[0] && plugin.getDataType(typeScope[0]) === 'Number') {
          return +itemF.value >= typeScope[0]
        } else {
          throw new Error(`"typeScope" 参数错误`)
        }
      } else {
        throw new TypeError(`'typeScope' is must be 'Array'`)
      }
    } else if (returnAll) {
      return true
    }
  })
  // 将单位塞入类型中
  companyFilterType = companyFilterType.map(itemM => {
    return {
      value: itemM.value.toString(),
      label: itemM.label,
      type: itemM.type,
      children: clientData.filter(itemF => itemF.type.includes(itemM.value)).map(itemM => {
        return {
          value: itemM.id.toString(),
          label: itemM.name,
          name_pinyin: itemM.name_pinyin.join(''),
          contacts: itemM.contacts
        }
      })
    }
  })
  if (hasFirstType) { // 是否需要最外层
    companyFilterType = plugin.mergeData(companyFilterType, { mainRule: 'type/value', childrenName: 'children' }).map((itemM, indexM) => {
      return {
        value: indexM.toString(),
        label: itemM.value,
        children: itemM.children
      }
    })
  }
  return companyFilterType
}
const getZHTimeFormat = (time = false) => {
  if (time === false) {
    throw new TypeError(`The parameter 'time' is mandatory`)
  } else if (!(new Date(time).getTime())) {
    throw new TypeError(`the arguments for "time" is must be an 'Date'`)
  }
  const day = (new Date(plugin.getTime(time)).getTime() - new Date(plugin.getTime()).getTime()) / 1000 / 60 / 60 / 24
  return `${plugin.getTime(time)}<br />剩余${day >= 0 ? plugin.toFixedAuto(day) : 0}天`
}
const saveHistoryOrder = (orderInfo) => {
  let curTime = new Date()
  orderInfo.outOfDate = new Date(curTime.setHours(curTime.getHours() + 12))
  let local = JSON.parse(window.localStorage.getItem('orderHistory')) || []
  local = local.filter((item) => {
    return (new Date(item.outOfDate)) > (new Date())
  })
  if (!local.find((itemFind) => itemFind.id === orderInfo.id)) {
    local.push(orderInfo)
    window.localStorage.setItem('orderHistory', JSON.stringify(local))
  }
}
/**
 * 织慧科技处理精度的算法
 * 0.90-0.99向上取整 0.01-0.10向下取整
 * @param {Number} number 处理的数字
 * @param {integer} precision 处理精度位数
 * @param {float} up 向上取整基数
 * @param {float} down 向下取整基数
 * @returns {Number}
 */
const disposeFZHNumber = (number, precision = 2, ...[up = 0.9, down = 0.1]) => {
  let newNum = plugin.toFixedAuto(number, precision)
  if (isNaN(newNum)) {
    return newNum
  } else {
    let decimal = newNum % 1
    if (decimal && Number(decimal) >= up) {
      return Math.ceil(newNum)
    } else if (decimal && Number(decimal <= down)) {
      return Math.floor(newNum)
    }
    return newNum
  }
}
export default {
  install (Vue) {
    Vue.prototype.$disposeFZHNumber = disposeFZHNumber
    Vue.prototype.$saveHistoryOrder = saveHistoryOrder
    Vue.prototype.$getDataType = plugin.getDataType
    Vue.prototype.$winReload = plugin.winReload
    Vue.prototype.$openUrl = plugin.openUrl
    Vue.prototype.$getTime = plugin.getTime
    Vue.prototype.$clone = plugin.cloneData
    Vue.prototype.$flatten = (data) => { return plugin.flatten(plugin.flatten(data)) }
    Vue.prototype.$mergeData = plugin.mergeData
    Vue.prototype.$toFixed = plugin.toFixedAuto
    Vue.prototype.$newSplice = plugin.newSplice
    Vue.prototype.$goElView = plugin.goElView
    Vue.prototype.$formatNum = plugin.formatNum
    Vue.prototype.$strToAscII = plugin.strToAscII
    Vue.prototype.$fuckSelect = plugin.fuckSelect
    Vue.prototype.$submitLock = submitLock()
    Vue.prototype.$unique = plugin.unique
    Vue.prototype.$getClientOptions = getClientOptions
    Vue.prototype.$getZHTimeFormat = getZHTimeFormat
    Vue.prototype.$commonFind = plugin.commonFind
    Vue.prototype.$changeSpecialWord = plugin.changeSpecialWord
  }
}
