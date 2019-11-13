const getHash = (hashStr) => {
  let json = {}
  let params = hashStr.split('&&')
  params.forEach((item) => {
    json[item.split('=')[0]] = item.split('=')[1]
  })
  return json
}
export {
  getHash
}
