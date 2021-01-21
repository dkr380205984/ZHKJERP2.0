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
                          <td style="text-align:left" colspan="2">创建人：${titleInfo.created_user}</td>
                          <td style="text-align:left" colspan="2">创建时间：${titleInfo.created_time}</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                        </tr>
                      </table>`
  let tables = data.map(({ orderInfo, dataInfo }, indexD) => {
    const dataEle = dataInfo.map(itemData => {
      return `<tr>
                <td style="text-align:left;background:orange">${itemData.delivery_time}</td>
                <td style="text-align:left;">${itemData.batch_title}</td>
                <td style="text-align:left;">${itemData.batch_type || ''}</td>
                <td style="text-align:left;">${itemData.product_code}</td>
                <td style="text-align:left;">${itemData.name}</td>
                <td style="text-align:left;">${itemData.size}</td>
                <td style="text-align:left;">${itemData.color}</td>
                <td style="text-align:left;">${itemData.size_info.size_info}</td>
                <td style="text-align:left;">${itemData.size_info.weight}</td>
                <td style="text-align:left;">${itemData.price}</td>
                <td style="text-align:left;">${itemData.number}</td>
                <td style="text-align:left;">${itemData.total_price}</td>
                <td style="text-align:left;">${itemData.batch_desc || ''}</td>
              </tr>`
    })
    const dataTotalNumber = dataInfo.map(itemM => +itemM.number || 0).reduce((total, current) => total + current, 0)
    const dataTotalPrice = dataInfo.map(itemM => +itemM.price || 0).reduce((total, current) => total + current, 0)
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
                <td style="text-align:left;">批次类型</td>
                <td style="text-align:left;">产品编号</td>
                <td style="text-align:left;">产品名称</td>
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
                <td style="text-align:left;" colspan="8">${orderInfo.desc || ''}</td>
                <td style="text-align:left;">${dataTotalNumber}</td>
                <td style="text-align:left;">${dataTotalPrice}</td>
                <td style="text-align:left;" colspan="2"></td>
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
export {
  getHash,
  downloadExcel,
  downloadOrderProductionExcel
}
