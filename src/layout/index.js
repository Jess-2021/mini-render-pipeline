function layout(element) {
  if (!element.computedStyle) {
    return;
  }

  // 格式化元素的style样式
  let style = formatStyle(element)
  if (elementStyle.display !== 'flex') {
    return
  }

  let elementsItems = element.filter(e => e.type === 'element')
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  // TODO 宽高处理

  // flex
  // 
}

function formatStyle(element) {
  if (!element.style) {
    element.style = {}
  }

  for(let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
  }

  return element.style
}

function flexHandler(style) {
  // 1. auto 默认值处理
  if (!style['flex-direction'] || style['flex-direction'] === 'auto') {
    style['flex-direction'] = 'row'
  }
  if (!style['align-items'] || style['align-items'] === 'auto') {
    style['align-items'] = 'stretch'
  }
  if (!style['justify-content'] || style['justify-content'] === 'auto') {
    style['justify-content'] = 'flex-start'
  }
  if (!style['flex-wrap'] || style['flex-wrap'] === 'auto') {
    style['flex-wrap'] = 'nowrap'
  }
  if (!style['align-content'] || style['align-content'] === 'auto') {
    style['align-content'] = 'stretch'
  }

  // 处理flex-direction
  var mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, corssBase;
  if (style['flex-direction' === 'row']) {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1 // 正负
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style['flex-direction' === 'row-reverse']) {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1 // 正负
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }
}

module.exports = layout