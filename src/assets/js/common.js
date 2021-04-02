const getHash = (hashStr) => {
  let json = {}
  let params = hashStr.split('&&')
  params.forEach((item) => {
    json[item.split('=')[0]] = item.split('=')[1]
  })
  return json
}
const downloadExcel = (data, titles, orderInfo, excelName) => {
  let orderElement = ''
  if (orderInfo) {
    let orderInfoType = Object.prototype.toString.call(orderInfo).split(' ')[1].split(']')[0]
    orderInfo = orderInfoType === 'Object' ? [orderInfo] : orderInfo
    orderElement = orderInfo.map(itemOrder => {
      return `<table>
                <tr>
                  <td style="text-align:left">订单号：</td>
                  <td style="text-align:left">${itemOrder.order_code}</td>
                </tr>
                <tr>
                  <td style="text-align:left">订单公司：</td>
                  <td style="text-align:left">${itemOrder.client_name}</td>
                </tr>
                <tr>
                  <td style="text-align:left">负责小组：</td>
                  <td style="text-align:left">${itemOrder.group_name}</td>
                </tr>
                <tr>
                  <td style="text-align:left">下单日期：</td>
                  <td style="text-align:left">${itemOrder.order_time}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                </tr>
              </table>`
    }).join('')
  }
  let excelHeader = '<tr>' + titles.map(item => '<td style="text-align:left">' + item.title + '</td>').join('') + '</tr>'
  let excelContent = data.map(itemData => {
    return '<tr>' + titles.map(itemTitle => '<td style="text-align:left">' + ((itemData[itemTitle.key] !== 0 && !itemData[itemTitle.key]) ? '' : itemData[itemTitle.key]) + '</td>').join('') + '</tr>'
  })
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
                    xmlns:x="urn:schemas-microsoft-com:office:excel" 
                    xmlns="http://www.w3.org/TR/REC-html40">
              <meta http-equiv="content-type" content="application/vnd.ms-excel; charset="UTF-8">
              <head>
                <!--[if gte mso 9]>
                <xml>
                <x:ExcelWorkbook>
                  <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                      <x:Name>${excelName || 'worksheet1'}</x:Name>
                      <x:WorksheetOptions>
                        <x:DisplayGridlines/>
                      </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                  </x:ExcelWorksheets>
                </x:ExcelWorkbook>
                </xml>
                <![endif]-->
              </head>
              <body>
                ${orderElement}
                <table>${excelHeader}${excelContent.join('')}</table>
              </body>
            </html>`
  let aLink = document.createElement('a')
  let url = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html)
  aLink.href = url
  aLink.download = (excelName ? excelName + '-' : '') + new Date().getTime() + '.xls'
  aLink.click()
}
const downloadOrderProductionExcel = ({ data, titleInfo }, excelName) => {
  let titleElement = `<table>
                        <tr>
                          <td style="text-align:left;font-size:24px" colspan="9" rowspan='3'>${titleInfo.title}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                          <td style="text-align:left" colspan="2">创建人：${titleInfo.created_user}</td>
                          <td style="text-align:left" colspan="2">创建时间：${titleInfo.created_time}</td>
                        </tr>
                      </table>`
  let tables = data.map(({ orderInfo, dataInfo }, indexD) => {
    const dataEle = dataInfo.map(itemData => {
      return `<tr>
                <td style="text-align:left;background:orange">${itemData.delivery_time}</td>
                <td style="text-align:left;">${itemData.batch_title}</td>
                <td style="text-align:left;">${itemData.product_code}</td>
                <td style="text-align:left;">${itemData.name}</td>
                <td style="text-align:left;">${itemData.product_ingredient || ''}</td>
                <td style="text-align:left;">${itemData.size}</td>
                <td style="text-align:left;">${itemData.color}</td>
                <td style="text-align:left;">${itemData.size_info.size_info}</td>
                <td style="text-align:left;">${itemData.size_info.weight}</td>
                <td style="text-align:left;">${itemData.price}${orderInfo.unit || '元'}/${itemData.product_unit || '件'}</td>
                <td style="text-align:left;">${itemData.number}${itemData.product_unit}</td>
                <td style="text-align:left;">${itemData.total_price}${orderInfo.unit || '元'}</td>
                <td style="text-align:left;">${itemData.batch_desc || ''}</td>
              </tr>`
    })
    const dataTotalNumber = dataInfo.map(itemM => +itemM.number || 0).reduce((total, current) => total + current, 0)
    const dataTotalPrice = dataInfo.map(itemM => +itemM.total_price || 0).reduce((total, current) => total + current, 0)
    return `<table>
              <tr>
                <td style="text-align:left;">序号</td>
                <td style="text-align:left;" colspan="2">下单日期</td>
                <td style="text-align:left;" colspan="2">订单号</td>
                <td style="text-align:left;" colspan="2">订单公司</td>
                <td style="text-align:left;" colspan="2">公司联系人</td>
                <td style="text-align:left;" colspan="2">创建人</td>
                <td style="text-align:left;" colspan="2">负责小组</td>
              </tr>
              <tr>
                <td style="text-align:left;">${indexD + 1}</td>
                <td style="text-align:left;" colspan="2">${orderInfo.order_time}</td>
                <td style="text-align:left;" colspan="2">${orderInfo.order_code}</td>
                <td style="text-align:left;" colspan="2">${orderInfo.client_name}</td>
                <td style="text-align:left;" colspan="2">${orderInfo.contacts}</td>
                <td style="text-align:left;" colspan="2">${orderInfo.create_user}</td>
                <td style="text-align:left;" colspan="2">${orderInfo.group_name}</td>
              </tr>
              <tr>
                <td style="text-align:left;">交货日期</td>
                <td style="text-align:left;">批次名称</td>
                <td style="text-align:left;">产品编号</td>
                <td style="text-align:left;">产品名称</td>
                <td style="text-align:left;">产品成分</td>
                <td style="text-align:left;">尺码</td>
                <td style="text-align:left;">颜色</td>
                <td style="text-align:left;">产品尺寸</td>
                <td style="text-align:left;">产品克重</td>
                <td style="text-align:left;">单价</td>
                <td style="text-align:left;">数量</td>
                <td style="text-align:left;">总金额</td>
                <td style="text-align:left;">批次备注</td>
              </tr>
              ${dataEle.join('')}
              <tr>
                <td style="text-align:left;">订单备注</td>
                <td style="text-align:left;" colspan="9">${orderInfo.desc || ''}</td>
                <td style="text-align:left;">${dataTotalNumber}</td>
                <td style="text-align:left;">${dataTotalPrice}</td>
                <td style="text-align:left;"></td>
              </tr>
              <tr>
              </tr>
            </table>`
  })
  // let excelHeader = '<tr>' + titles.map(item => '<td style="text-align:left">' + item.title + '</td>').join('') + '</tr>'
  // let excelContent = data.map(itemData => {
  //   return '<tr>' + titles.map(itemTitle => '<td style="text-align:left">' + ((itemData[itemTitle.key] !== 0 && !itemData[itemTitle.key]) ? '' : itemData[itemTitle.key]) + '</td>').join('') + '</tr>'
  // })
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
                    xmlns:x="urn:schemas-microsoft-com:office:excel" 
                    xmlns="http://www.w3.org/TR/REC-html40">
              <meta http-equiv="content-type" content="application/vnd.ms-excel; charset="UTF-8">
              <head>
                <!--[if gte mso 9]>
                <xml>
                <x:ExcelWorkbook>
                  <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                      <x:Name>${excelName || 'worksheet1'}</x:Name>
                      <x:WorksheetOptions>
                        <x:DisplayGridlines/>
                      </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                  </x:ExcelWorksheets>
                </x:ExcelWorkbook>
                </xml>
                <![endif]-->
              </head>
              <body>
                ${titleElement}
                ${tables.join('')}
              </body>
            </html>`
  let aLink = document.createElement('a')
  let url = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html)
  aLink.href = url
  aLink.download = (excelName ? excelName + '-' : '') + new Date().getTime() + '.xls'
  aLink.click()
}
class VerificationCode {
  // 下一行有一个报错constructor前需要有个空格 但自动调整代码格式会去除 故关闭下一行eslint验证
  // eslint-disable-next-line
  constructor({ W, H }) {
    this.canvas = ''
    this.W = W
    this.H = H
    this.createdCanvas(W, H)
  }
  static code = Math.floor(Math.random() * 1679615).toString(36)
  updatedCode () {
    VerificationCode.code = Math.floor(Math.random() * 1679615).toString(36)
    this.createdCanvas(this.W, this.H)
  }
  createdCanvas (W, H) {
    const codeCanvas = document.createElement('canvas')
    codeCanvas.width = W
    codeCanvas.height = H
    const ctx = codeCanvas.getContext('2d')
    ctx.fillStyle = '#ccc'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#F40'
    ctx.textAlign = 'center'
    ctx.font = '46px Roboto Slab'
    VerificationCode.code.split('').forEach((item, index) => {
      ctx.setTransform(1, -0.12, 0.2, 1, 0, 12)
      ctx.fillText(item, W / 4 * index + W / 8, H / 2 + 20)
    })
    this.canvas = codeCanvas.toDataURL()
  }
  checkCode (code) {
    if (code.toLocaleLowerCase() === VerificationCode.code.toLocaleLowerCase()) {
      return true
    }
    return false
  }
}
/**
 *
 * @param {number} num //转换英文的金额
 * @param {boolean} moneyType // 转换金额的类型 true 为人民币 false 为美元
 * @returns {String}
 */
const numberToEnglish = (num, moneyType) => {
  let arr1 = ['', ' thousand', ' million', ' billion']
  let arr2 = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  let arr3 = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  let arr4 = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const englist = (num) => {
    let strRet = ''
    if ((num.length === 3) && (num.substr(0, 3) !== '000')) {
      if ((num.substr(0, 1) !== '0')) {
        strRet += arr3[num.substr(0, 1)] + ' hundred'
        if (num.substr(1, 2) !== '00') {
          strRet += ' and '
        }
      }
      num = num.substring(1)
    }
    if ((num.length === 2)) {
      if ((num.substr(0, 1) === '0')) {
        num = num.substring(1)
      } else if ((num.substr(0, 1) === '1')) {
        strRet += arr4[num.substr(1, 2)]
      } else {
        strRet += arr2[num.substr(0, 1)]
        if (num.substr(1, 1) !== '0') strRet += '-'
        num = num.substring(1)
      }
    }
    if ((num.length === 1) && (num.substr(0, 1) !== '0')) {
      strRet += arr3[num.substr(0, 1)]
    }
    return strRet
  }
  const translate = (num) => {
    let len = num.length
    let j = 0
    let strRet = ''
    let cols = Math.ceil(len / 3)
    let first = len - cols * 3
    for (let i = first; i < len; i += 3) {
      ++j
      let num3 = ''
      if (i >= 0) {
        num3 = num.substring(i, i + 3)
      } else {
        num3 = num.substring(0, first + 3)
      }
      let strEng = englist(num3)
      if (strEng !== '') {
        if (strRet !== '') {
          strRet += ','
        }
        strRet += englist(num3) + arr1[cols - j]
      }
    }
    return strRet
  }
  const numArr = String(num).split('.')
  if (numArr.length > 2) {
    return 'NAN'
  } else if (numArr.length === 1) {
    return translate(numArr[0])
  } else if (numArr.length === 2 && +numArr[0] > 0) {
    return `${translate(numArr[0])} and ${!moneyType ? 'cents' : ''} ${translate(numArr[1])}`
  } else if (numArr.length === 2 && +numArr[0] === 0) {
    return moneyType ? `zero point ${translate(numArr[1])}` : `${translate(numArr[1])} cents`
  }
}
export {
  getHash,
  downloadExcel,
  downloadOrderProductionExcel,
  VerificationCode,
  numberToEnglish
}
