export class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.post = options.port || 80
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}

    if(this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if(this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers['Content-Type'].includes('application/x-www-form-urlencoded')) {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }
    this.headers['Content-Length'] = this.bodyText.length
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
    ${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
    \r
    ${this.bodyText}
    `
  }

  // send(connection) {
  //   return new Promise((resolve, reject) => {
  //     const 
  //   })
  // }
}