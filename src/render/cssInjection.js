function computeCSS(stack, element) {
  var elements = stack.slice().reverse()
  if(!element.computedStyle) {
    element.computedStyle = {}
  }
}

