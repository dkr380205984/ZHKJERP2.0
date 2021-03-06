const chinaNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五']
const letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z']
const permissions = [{
  module: '样品管理',
  id: 1
}, {
  module: '报价单管理',
  id: 2,
  detail: [
    {
      id: '02-01',
      name: '添加报价单'
    },
    {
      id: '02-02',
      name: '修改报价单'
    },
    {
      id: '02-03',
      name: '删除报价单'
    },
    {
      id: '02-04',
      name: '审核报价单'
    },
    {
      id: '02-05',
      name: '报价单列表'
    },
    {
      id: '02-06',
      name: '报价单详情'
    }
  ]
}, {
  module: '产品管理',
  id: 3
}, {
  module: '设计单管理',
  id: 4
}, {
  module: '订单管理',
  id: 5,
  detail: [
    {
      id: '05-01',
      name: '订单详情财务模块'
    }
  ]
}, {
  module: '物料计划管理',
  id: 6
}, {
  module: '物料订购管理',
  id: 7
}, {
  module: '物料出入库管理',
  id: 15
}, {
  module: '织造加工管理',
  id: 8
}, {
  module: '产品收发管理',
  id: 9
}, {
  module: '检验管理',
  id: 10
}, {
  module: '装箱出库管理',
  id: 11
}, {
  module: '库存管理',
  id: 12
}, {
  module: '客户管理',
  id: 13
}, {
  module: '系统设置',
  id: 14
}, {
  module: '财务统计',
  id: 16
}, {
  module: '员工管理',
  id: 17
}, {
  module: '报销单管理',
  id: 18
}, {
  module: '进仓运输管理',
  id: 19
}, {
  module: '成品加工',
  id: 20
}, {
  module: '单证管理',
  id: 21
}, {
  module: '客户单据管理',
  id: 22
}, {
  module: '票据管理',
  id: 23
}]
const moneyArr = [{
  name: '元',
  short: '人民币',
  id: 1,
  sign: '￥',
  default: '100',
  tax_prop: '12'
}, {
  name: '美元',
  short: 'USD',
  id: 2,
  sign: 'US$',
  default: '670',
  tax_prop: '0'
}]
const countries = '中国、蒙古、朝鲜、韩国、日本、菲律宾、越南、老挝、柬埔寨、缅甸、泰国、马来西亚、文莱、新加坡、印度尼西亚、东帝汶、尼泊尔、不丹、孟加拉国、印度、巴基斯坦、斯里兰卡、马尔代夫、哈萨克斯坦、吉尔吉斯斯坦、塔吉克斯坦、乌兹别克斯坦、土库曼斯坦、阿富汗、伊拉克、伊朗、叙利亚、约旦、黎巴嫩、以色列、巴勒斯坦、沙特阿拉伯、巴林、卡塔尔、科威特、阿拉伯联合酋长国（阿联酋）、阿曼、也门、格鲁吉亚、亚美尼亚、阿塞拜疆、土耳其、塞浦路斯、芬兰、瑞典、挪威、冰岛、丹麦 法罗群岛（丹）、爱沙尼亚、拉脱维亚、立陶宛、白俄罗斯、俄罗斯、乌克兰、摩尔多瓦、波兰、捷克、斯洛伐克、匈牙利、德国、奥地利、瑞士、列支敦士登、英国、爱尔兰、荷兰、比利时、卢森堡、法国、摩纳哥、罗马尼亚、保加利亚、塞尔维亚、马其顿、阿尔巴尼亚、希腊、斯洛文尼亚、克罗地亚、波斯尼亚和墨塞哥维那、梵蒂冈、圣马力诺、马耳他、西班牙、葡萄牙、安道尔、埃及、利比亚、苏丹、突尼斯、阿尔及利亚、摩洛哥、亚速尔群岛（葡）、马德拉群岛（葡）、埃塞俄比亚、厄立特里亚、索马里、吉布提、肯尼亚、坦桑尼亚、乌干达、卢旺达、布隆迪、塞舌尔、乍得、中非、喀麦隆、赤道几内亚、加蓬、刚果共和国（即：刚果（布））、刚果民主共和国（即：刚果（金））、圣多美及普林西比、毛里塔尼亚、西撒哈拉、塞内加尔、冈比亚、马里、布基纳法索、几内亚、几内亚比绍、佛得角、塞拉利昂、利比里亚、科特迪瓦、加纳、多哥、贝宁、尼日尔、加那利群岛（西）、赞比亚、安哥拉、津巴布韦、马拉维、莫桑比克、博茨瓦纳、纳米比亚、南非、斯威士兰、莱索托、马达加斯加、科摩罗、毛里求斯、留尼旺（法）、圣赫勒拿（英）、澳大利亚、新西兰、巴布亚新几内亚、所罗门群岛、瓦努阿图、密克罗尼西亚、马绍尔群岛、帕劳、瑙鲁、基里巴斯、图瓦卢、萨摩亚、斐济群岛、汤加、库克群岛（新）、关岛（美）、新喀里多尼亚（法）、法属波利尼西亚、皮特凯恩岛（英）、瓦利斯与富图纳（法）、纽埃（新）、托克劳（新）、美属萨摩亚、北马里亚纳（美）、加拿大、美国、墨西哥、格陵兰（丹）、危地马拉、伯利兹、萨尔瓦多、洪都拉斯、尼加拉瓜、哥斯达黎加、巴拿马、巴哈马、古巴、牙买加、海地、多米尼加共和国、安提瓜和巴布达、圣基茨和尼维斯、多米尼克、圣卢西亚、圣文森特和格林纳丁斯、格林纳达、巴巴多斯、特立尼达和多巴哥、波多黎各（美）、英属维尔京群岛、美属维尔京群岛、安圭拉（英）、蒙特塞拉特（英）、瓜德罗普（法）、马提尼克（法）、荷属安的列斯、阿鲁巴（荷）、特克斯和凯科斯群岛（英）、开曼群岛（英）、百慕大（英）、哥伦比亚、委内瑞拉、圭亚那、法属圭亚那、苏里南、厄瓜多尔、秘鲁、玻利维亚、巴西、智利、阿根廷、乌拉圭、巴拉圭'

const companyType = [
  {
    value: 1,
    label: '常用公司',
    type: '订单公司'
  }, {
    value: 2,
    label: '其他公司',
    type: '订单公司'
  }, {
    value: 3,
    label: '常用单位',
    type: '原料纱线单位'
  }, {
    value: 4,
    label: '其他单位',
    type: '原料纱线单位'
  }, {
    value: 5,
    label: '常用单位',
    type: '装饰辅料单位'
  }, {
    value: 6,
    label: '其他单位',
    type: '装饰辅料单位'
  }, {
    value: 7,
    label: '常用单位',
    type: '包装辅料单位'
  }, {
    value: 8,
    label: '其他单位',
    type: '包装辅料单位'
  }, {
    value: 9,
    label: '纱线染色单位',
    type: '物料加工单位'
  }, {
    value: 10,
    label: '纱线倒纱单位',
    type: '物料加工单位'
  }, {
    value: 11,
    label: '并金银丝单位',
    type: '物料加工单位'
  }, {
    value: 12,
    label: '毛料切割单位',
    type: '物料加工单位'
  }, {
    value: 13,
    label: '梭织织造单位',
    type: '生产织造单位'
  }, {
    value: 14,
    label: '针织织造单位',
    type: '生产织造单位'
  }, {
    value: 39,
    label: '精编织造单位',
    type: '生产织造单位'
  }, {
    value: 15,
    label: '拉毛、刺毛、轧光单位',
    type: '半成品加工单位'
  }, {
    value: 16,
    label: '水洗、纱洗、烘干单位',
    type: '半成品加工单位'
  }, {
    value: 17,
    label: '抽顶、剪球、吊球单位',
    type: '半成品加工单位'
  }, {
    value: 18,
    label: '捻须、穿线、打结单位',
    type: '半成品加工单位'
  }, {
    value: 19,
    label: '压皱、整烫单位',
    type: '半成品加工单位'
  }, {
    value: 20,
    label: '车缝、开片单位',
    type: '半成品加工单位'
  }, {
    value: 21,
    label: '绣花、印花单位',
    type: '半成品加工单位'
  }, {
    value: 22,
    label: '钉扣、烫钻单位',
    type: '半成品加工单位'
  }, {
    value: 23,
    label: '接指、麻缝单位',
    type: '半成品加工单位'
  }, {
    value: 24,
    label: '套口、套缝单位',
    type: '半成品加工单位'
  }, {
    value: 25,
    label: '成品染色单位',
    type: '半成品加工单位'
  }, {
    value: 26,
    label: '毛料切割单位',
    type: '半成品加工单位'
  }, {
    value: 27,
    label: '手工单位',
    type: '半成品加工单位'
  }, {
    value: 28,
    label: '其它单位',
    type: '半成品加工单位'
  }, {
    value: 29,
    label: '检验单位',
    type: '成品加工单位'
  }, {
    value: 30,
    label: '开片单位',
    type: '成品加工单位'
  }, {
    value: 31,
    label: '整烫单位',
    type: '成品加工单位'
  }, {
    value: 32,
    label: '车标单位',
    type: '成品加工单位'
  }, {
    value: 33,
    label: '包装单位',
    type: '成品加工单位'
  }, {
    value: 34,
    label: '其它单位',
    type: '成品加工单位'
  }, {
    value: 35,
    label: '常用单位',
    type: '运输单位'
  }, {
    value: 36,
    label: '其他单位',
    type: '运输单位'
  }, {
    value: 37,
    label: '常用单位',
    type: '销售出库单位'
  }, {
    value: 38,
    label: '其他单位',
    type: '销售出库单位'
  }
]
/**
 *  专用于判断权限
 * @param {string|number} id 需要判断权限的id
 * @returns {boolean}
 */
const isHasPermissions = (id) => {
  if (!window.sessionStorage.getItem('module_id')) return
  const moduleId = JSON.parse(window.sessionStorage.getItem('module_id'))
  if (!moduleId.includes(id)) return
  return true
}
const cityArr = [
  { value: '上海市' },
  { value: '杭州市' },
  { value: '宁波市' },
  { value: '义乌市' },
  { value: '天津市' },
  { value: '青岛市' }
]
// 物料的批缸号及色号的默认值
const VATCODE_COLORCODE_DEFAULT = 'NOT_SET'
const ECHARTS_COLOR = ['#16A085', '#2980B9', '#8E44AD', '#2C3E50', '#27AE60', '#F39C12', '#D35400', '#1ABC9C', '#BDC3C7', '#7F8C8D', '#25B41E', '#2ECC71', '#3498DB', '#9B59B6', '#34495E', '#F1C40F', '#E67E22', '#E74C3C']
export {
  cityArr,
  companyType,
  moneyArr,
  permissions,
  isHasPermissions,
  chinaNum,
  letterArr,
  countries,
  VATCODE_COLORCODE_DEFAULT,
  ECHARTS_COLOR
}
