const images = require('images')
const render = require('./render/render')
const parser = require('./render/parser')

void (async function() {
  const { runFetch } = await import('./request/fetch.mjs')
  let response = await runFetch('http://127.0.0.1:8088', {
    name: 'jarar'
  })
  console.log(response)

  // TODO 解析HTML为DOM树
  // let dom = parser.parserHTML(response.body)

  // TODO 创建图片
  // const viewport = images(800, 600)
  // TODO 创建图片
  // render(viewport, dom)
  // viewport.save('viewport.jpg')
})()

