const images = require('images')
const render = require('../src/render')
const parserHTML = require('../src/parser')

void (async function () {
  const { runFetch } = await import('../src/request/fetch.mjs')
  let response = await runFetch('http://127.0.0.1:8089', {
    name: 'jarar'
  })
  const body = await response.text()

  // 解析HTML为DOM树
  let dom = parserHTML(body)
  // console.log(JSON.stringify(dom, null, '  '));

  const viewport = images(1500, 1000)
  // 填充图片
  render(viewport, dom)
  viewport.save('viewport.jpg')
})()

