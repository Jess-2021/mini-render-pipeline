const Koa = require('koa')
const path = require('path')
const fsPromise = require('fs/promises')
const server = new Koa()

let htmlData;
fsPromise.readFile(path.resolve(process.cwd(), 'index.html'), {
  encoding: 'utf8'
}).then(data => {
  htmlData = data
})

server.use(async (ctx, _) => {
  ctx.response.headers = {
    'Content-Type': 'text/html',
    'X-Jar': 'foo',
  }
  ctx.status = 200
  ctx.type = 'text/plain; charset=utf-8'
  ctx.body = htmlData.toString()
})

server.listen(8089)

