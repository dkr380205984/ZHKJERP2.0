/**
 *
 * @param {Element} node
 * @param {boolean} flag 是否算上自己
 * @returns {{top:number,left:number}}
 */
const getNodeOutset = (node, flag = false) => {
  if (!node.parentNode) {
    return {
      left: (flag && node.offsetLeft) || 0,
      top: (flag && node.offsetTop) || 0
    }
  }
  return {
    left: ((flag && node.offsetLeft) || 0) + (node.parentNode.offsetLeft || 0) + getNodeOutset(node.parentNode).left,
    top: ((flag && node.offsetTop) || 0) + (node.parentNode.offsetTop || 0) + getNodeOutset(node.parentNode).top
  }
}
export {
  getNodeOutset
}
