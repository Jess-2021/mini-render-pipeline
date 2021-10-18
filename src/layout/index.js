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

  // flex handler
  let {
    mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, corssBase
  } = flexHandler(elementsItems)

  // 没有边界时设置默认数值
  let isAutoMainSize = false
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0
    for (let i = 0; i < elementsItems.length; i++) {
      let item = elementsItems[i]
      let itemStyle = formatStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
      }
    }
    isAutoMainSize = true
  }

  let flexLine = [], flexLines = [flexLine]
  let mainSpace = elementStyle[mainSize], crossSpace = 0

  for (let i = 0; i < elementsItems.length; i++) {
    let item = elementsItems[i]
    let itemStyle = formatStyle(item)

    if (itemStyle[mainSize] === null) itemStyle[mainSize] = 0;
    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style['flex-wrap'] === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    } else {
      if (itemStyle[mainSize] > style[mainSize]) itemStyle[mainSize] = style[mainSize];
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace

        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }

      mainSpace -= itemStyle[mainSize]
    }
  }
  flexLine.mainSpace = mainSpace

  if (style['flex-wrap'] === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== void 0) ? style[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  if (mainSpace < 0) {
    let scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMain = mainBase
    for (let i = 0; i < items.length; i++) {
      let item = elementsItems[i]
      let itemStyle = formatStyle(item)

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale
      itemStyle[mainStart] = currentMain
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSize * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    }
  } else {
    flexLines.forEach(items => {
      let mainSpace = item.mainSpace, flexTotal = 0
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let itemStyle = formatStyle(item)

        if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
          flexTotal += itemStyle.flex
          continue
        }
      }

      if (flexTotal > 0) {
        let currentMain = mainBase
        for (let i = 0; i < items.length; i++) {
          let item = item[i]
          let itemStyle = formatStyle(item)

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSize / flexTotal) * itemStyle.flex
          }
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }
      } else {
        // 初始化currentMain
        switch (style['justify-content']) {
          case 'flex-start':
            var currentMain = mainBase
            var step = 0
            break
          case 'flex-end':
            var currentMain = mainSpace * mainSign + mainBase;
            var step = 0;
            break
          case 'center':
            var currentMain = mainSpace / 2 * mainSign + mainBase;
            var step = 0;
            break
          case 'space-between':
            var currentMain = mainBase;
            var step = mainSpace / (item.length - 1) * mainSign;
          case 'space-around':
            var step = mainSpace / items.length * mainSign;
            var currentMain = step / 2 + mainBase;
        }
        
        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          let itemStyle = format(item)
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }

  let crossSpace
  if (!style[crossSize]) {
    crossSpace = 0
    elementStyle[crossSize] = crossSpace = 0
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
    }
  } else {
    crossSpace = style[crossSize]
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace
    }
  }

  if (style['flex-wrap'] === 'wrap-reverse') {
    crossBase = style[crossSize]
  } else {
    crossBase = 0
  }

  let step
  switch(style['align-content']) {
    case 'flex-start':
      crossBase += 0;
      step = 0
      break
    case 'flex-end':
      crossBase += crossSign * crossSpace
      step = 0
      break
    case 'center':
      crossBase += crossSign * crossSpace / 2
      step = 0
      break
    case 'space-between':
      crossBase += 0
      step = crossSpace / (flexLines.length - 1)
      break
    case 'space-around':
      step = crossBase / flexLines.length
      crossBase += crossSign * step / 2
      break
    case 'stretch':
      crossBase += 0
      step = 0
  }

  // TODO 处理每一个flexLine
  
}

function formatStyle(element) {
  if (!element.style) {
    element.style = {}
  }

  for (let prop in element.computedStyle) {
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
    mainBase = 0 // 开始的位置

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style['flex-direction' === 'row-reverse']) {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style['flex-direction'] === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style['flex-direction'] === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if (style['flex-wrap'] === 'wrap-reverse') {
    let tmp = crossStart
    crossStart = crossEnd
    crossEnd = tmp
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  return {
    mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, corssBase
  }
}

module.exports = layout