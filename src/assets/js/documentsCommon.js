const transportMethods = [
  { value: 'BY SEA', label: 'BY SEA' },
  { value: 'BY AIR', label: 'BY AIR' }
]
const priceTerms = [
  { value: 'FOB', label: 'FOB' },
  { value: 'EXW', label: 'EXW' },
  { value: 'CFR', label: 'CFR' },
  { value: 'CIF', label: 'CIF' },
  { value: 'DDU', label: 'DDU' },
  { value: 'DDP', label: 'DDP' }
]
const craftTypeList = [
  { value: '针织', label: '针织' },
  { value: '梭织', label: '梭织' },
  { value: '精编', label: '精编' }
]
const moneyType = [
  { value: 'CNY', label: '人民币', unit: '￥' },
  { value: 'USD', label: '美元', unit: '$' }
]
// 这里代理下本地缓存需要特殊处理的数据
let proxyObj = {}
proxyObj = new Proxy(proxyObj, {
  get (target, key) {
    if (key === 'supplySource') {
      const local = window.localStorage.getItem('document_supply_source')
      return (local ? JSON.parse(local).map(itemM => {
        return {
          value: itemM,
          label: itemM
        }
      }) : [])
    }
    return target[key]
  },
  set (target, key, data) {
    if (key === 'supplySource') {
      let local = window.localStorage.getItem('document_supply_source')
      if (local) {
        local = JSON.parse(local)
      } else {
        local = []
      }
      local.unshift(data)
      local = [...new Set(local)]
      window.localStorage.setItem('document_supply_source', JSON.stringify(local))
      return local
    } else {
      target[key] = data
      return target[key]
    }
  }
})
export {
  transportMethods,
  priceTerms,
  craftTypeList,
  moneyType as moneyTypes,
  proxyObj as localStorage
}
