const images = require('images')

const render = function(img, element) {
  if (element.style) {
    let drawBoard = images(element.style.width, element.style.height)
    // 处理元素背景色
    if (element.style['background-color']) {
      let color = element.style['background-color'] || 'rbg(0, 0, 0)'
      color.match(/rgb\((\d+),(\d+),(\d+)\)/)
      drawBoard.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1)
      img.draw(drawBoard, element.style.left || 0, element.style.top || 0)
    }
  }

  // 递归渲染子元素
  if (element.children) {
    for(const child of element.children) {
      render(img, child)
    }
  }
}

module.exports = render