function layout(element) {
  if (!element.computedStyle) {
    return;
  }

  // 格式化元素的style样式
  let elementStyle = formatStyle(element)
  if (elementStyle.display !== 'flex') {
    return
  }

  let elementsItems = element.children.filter(e => e.type === 'element')
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  // 宽高处理
  Array.from(['width', 'height']).forEach(size => {
    if (elementStyle[size] === 'auto' || elementStyle[size] === '') {
      elementStyle[size] = null;
    }
  })

  // flex handler
  let {
    mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase
  } = flexHandler(elementsItems)

  // 没有边界时设置默认数值
  let isAutoMainSize = false
  if (!elementStyle[mainSize]) {
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

  let flexLine = []
  let flexLines = [flexLine]
  let mainSpace = elementStyle[mainSize], crossSpace = 0

  for (let i = 0; i < elementsItems.length; i++) {
    let item = elementsItems[i]
    let itemStyle = formatStyle(item)

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }
    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (elementStyle['flex-wrap'] === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    } else {
      if (itemStyle[mainSize] > elementStyle[mainSize]) {
        itemStyle[mainSize] = elementStyle[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace

        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = elementStyle[mainSize]
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

  if (elementStyle['flex-wrap'] === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (elementStyle[crossSize] !== void 0) ? elementStyle[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  if (mainSpace < 0) {
    let scale = elementStyle[mainSize] / (elementStyle[mainSize] - mainSpace)
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
    flexLines.forEach(flexLine => {
      let mainSpace = flexLine.mainSpace, flexTotal = 0
      for (let i = 0; i < flexLine.length; i++) {
        let item = flexLine[i]
        let itemStyle = formatStyle(item)

        if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
          flexTotal += itemStyle.flex
          continue
        }
      }

      if (flexTotal > 0) {
        let currentMain = mainBase
        for (let i = 0; i < flexLine.length; i++) {
          let item = flexLine[i]
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
        switch (elementStyle['justify-content']) {
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
            var step = mainSpace / flexLine.length * mainSign;
            var currentMain = step / 2 + mainBase;
        }

        for (let i = 0; i < flexLine.length; i++) {
          let item = flexLine[i]
          let itemStyle = formatStyle(item)
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }

  if (!elementStyle[crossSize]) {
    crossSpace = 0
    elementStyle[crossSize] = crossSpace = 0
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
    }
  } else {
    crossSpace = elementStyle[crossSize]
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace
    }
  }

  if (elementStyle['flex-wrap'] === 'wrap-reverse') {
    crossBase = elementStyle[crossSize]
  } else {
    crossBase = 0
  }

  let step
  switch(elementStyle['align-content']) {
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

  // 处理每一个flexLine
  flexLines.forEach(flexLine => {
    let lineCrossSize = elementStyle['align-content'] === 'stretch' ? flexLine.crossSpace + crossSpace / flexLines.length : flexLine.crossSpace
    for (let i = 0; i < flexLine.length; i++) {
      let item = flexLine[i]
      let itemStyle = formatStyle(item)
      let align = itemStyle.alignSelf || elementStyle['align-items']

      if (item === null) {
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0
      }

      switch (align) {
        case 'flex-start':
          itemStyle[crossStart] = crossBase
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
          break
        case 'flex-end':
          itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
          itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
          break
        case 'center':
          itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
          break
        case 'stretch':
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] = crossBase + crossSign * (itemStyle[crossStart] !== null && itemStyle[crossSize] !== void 0 ? itemStyle[crossSize] : lineCrossSize);
          itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    }
    crossBase += crossSign * (lineCrossSize + step)
  })
}

function formatStyle(element) {
  // if (element.style && element.style.hasOwnProperty('undefined')) debugger
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
  let mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase;
  if (style['flex-direction'] === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1 // 正负
    mainBase = 0 // 开始的位置

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style['flex-direction'] === 'row-reverse') {
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
    crossSize, crossStart, crossEnd, crossSign, crossBase
  }
}

module.exports = layout