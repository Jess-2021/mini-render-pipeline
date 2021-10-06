const images = require('images')
const runFetch = require('./request/fetch')
const render = require('./render/render')
const parser = require('./render/parser')

void (async function() {
  let response = await runFetch('127.0.0.1:8088', {
    name: 'jarar'
  })
  console.log(response)

  // let dom = parser.parserHTML(response.body) // 解析HTML为DOM树

  // const viewport = images(800, 600) // 创建图片
  // render(viewport, dom) // 填充viewport图片
  // viewport.save('viewport.jpg')
})()