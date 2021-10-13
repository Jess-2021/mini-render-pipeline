
const css = require('css');

let rules = [];

function addCSSRules(text) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);

  return rules
}

function computeCSS(stack, element) {
  var elements = stack.slice().reverse() // 命中对应的css节点
  if (!element.computedStyle) {
    element.computedStyle = {}
  }

  for (let rule of rules) {
    var selectorItem = rule.selectors[0].split(' ').reverse()
    if (!selectorMatch(element, selectorItem[0])) continue;
    let matched = false

    let j = 1
    for (let i = 0; i < elements.length; i++) {
      if (selectorMatch(elements[i], selectorItem[j])) {
        j++
      }
    }
    if (j >= selectorItem.length) {
      matched = true
    }

    if (matched) {
      const sp = specificity(rule.selectors[0])
      const computedStyle = element.computedStyle
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property]
        }

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if (selectorCompare(computedStyle[declaration.property].specificity, sp)) {
          // TODO 比较选择器优先级
        }
      }
    }
  }
}

function selectorMatch(element, selector) {
  if (!selector || !element.attributes) {
    return false
  }

  if (selector.charAt(0) === '#') {
    const attr = element.attributes.filter(attr => attr.name === 'id')[0]
    if (attr && attr.value === selector.replace('#')) {
      return true
    }
  } else if (selector.charAt(0) === '.') {
    const attr = element.attributes.filter(attr => attr.name === 'class')[0]
    if (attr && attr.value === selector.replace('.', '')) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

// css 优先级
function specificity(selector) {
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(' ');
  for (var part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1] += 1;
    } else if (part.charAt(0) === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

// 比较选择器优先级
function selectorCompare(sp1, sp2) {

}


module.exports = {
  addCSSRules,
  computeCSS
}

