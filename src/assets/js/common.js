const getHash = (hashStr) => {
  let json = {}
  let params = hashStr.split('&&')
  params.forEach((item) => {
    json[item.split('=')[0]] = item.split('=')[1]
  })
  return json
}
const downloadExcel = (data, titles, excelName) => {
  let aLink = document.createElement('a')
  let excelHeader = '<tr>' + titles.map(item => '<td>' + item.title + '</td>').join('') + '</tr>'
  let excelContent = data.map(itemData => {
    return '<tr>' + titles.map(itemTitle => '<td>' + itemData[itemTitle.key] + '</td>').join('') + '</tr>'
  })
  let html = `<html><head><meta charset="utf-8" /></head><body><table>${excelHeader}${excelContent}</table></body></html>`
  let blob = new Blob([html], { type: 'application/vnd.ms-excel' })
  aLink.href = URL.createObjectURL(blob)
  aLink.download = (excelName ? excelName + '-' : '') + new Date().getTime() + '.xls'
  aLink.click()
}
export {
  getHash,
  downloadExcel
}
