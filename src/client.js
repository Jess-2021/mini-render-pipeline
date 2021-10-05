const images = require('images')
const Request = require('./request/request')
const render = require('./render/render')
const parser = require('./render/parser')

(async function() {
  let request = new Request({
    method: 'GET',
    host: '127.0.0.1',
    port: '8090',
    path: '/',
    headers: {
      ['Content-Type']: 'application/x-www-form-urlencoded',
      ['X-Jar']: 'custom'
    }
  })

  let response = await request.send()

  let dom = parser.parserHTML(response.body) // 解析HTML为DOM树

  const viewport = images(800, 600) // 创建图片
  render(viewport, dom) // 填充viewport图片
  viewport.save('viewport.jpg')
})()