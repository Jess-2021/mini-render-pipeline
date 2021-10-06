const images = require('images')

const render = function(img, element) {
  if (element.style) {
    let drawBoard = images(element.style.width, element.style.height)
  }
  // 递归渲染子元素
  if (element.children) {
    for(const child of element.children) {
      render(img, child)
    }
  }
}

module.exports = render