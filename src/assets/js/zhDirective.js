import Vue from 'vue'
import '@/assets/less/zhloading.css'
// 自定义指令
Vue.directive('zhloading', {
  inserted (el) {
    el.classList.add('zh_loading__box')
    const addElInnerInfo = document.createElement('div')
    addElInnerInfo.classList.add('zh_loading__mask')
    addElInnerInfo.addEventListener('click', (e) => {
      e.stopPropagation()
    }, true)
    el.appendChild(addElInnerInfo)
  },
  update (el, binding) {
    const elInnerEl = el.querySelector('.zh_loading__mask')
    elInnerEl.innerHTML = ''
    let elInnerElInfo = null
    if (binding.modifiers.imgModle) {
      elInnerElInfo = document.createElement('img')
      elInnerElInfo.className = 'zh_loading__info zh_loading__img'
      elInnerElInfo.src = binding.arg.type === 'error' ? `https://file.zwyknit.com/zh_loading_0.png` : `https://file.zwyknit.com/zh_loading_1.gif`
    } else {
      elInnerElInfo = document.createElement('span')
      elInnerElInfo.className = 'zh_loading__info'
      elInnerElInfo.innerHTML = `<i class='el-icon-loading' style='font-size:28px;margin-right:8px'></i>加载中。。。`
    }
    elInnerEl.appendChild(elInnerElInfo)
    if (binding.arg.loading) {
      el.classList.add('zh_loading__relative')
      elInnerEl.style.display = 'block'
    } else {
      el.classList.remove('zh_loading__relative')
      elInnerEl.style.display = 'none'
    }
  }
})
