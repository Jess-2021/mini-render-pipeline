import fetch from 'node-fetch'
import { Request, Headers } from 'node-fetch'

// 通过URL进行匹配资源
function requestGenerator(url, params) {
  const headers = new Headers()
  headers.set('Content-Type', 'application/x-www-form-urlencoded')
  // if (!(params instanceof FormData)) {
  //   headers.set('Content-Type', 'application/json')
  // }
  url = new URL(url)
  url.search = new URLSearchParams(params).toString()

  return new Request(url.toString(), {
    method: 'GET',
    headers
  })
}

export async function runFetch(url, params) {
  const request = requestGenerator(url, params)

  try {
    return await fetch(request)
  } catch(err) {
    console.error('jar-err', err)
  }
}
