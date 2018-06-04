let http = require('http')
let EventEmitter = require('events')
let context = require('./context')
let requset = require('./request')
let response = require('./response')

class Application extends EventEmitter{
  constructor(){
    super()
    this.middlewares = []
    this.callbackFn = null
    this.context = context 
    this.requset = request 
    this.response = response
  }

  listen(...args){
    let server = http.createServer(this.callback)
    server.listen(...args)
  }

  use(fn){
    this.middlewares.push(fn)
  }

  compose(){
    return async ctx =>{
      function createNext(middleware, oldNext){
        return async () =>{
          await middleware(ctx, oldNext)
        }
      }

      let len = this.middlewares.length
      let next = async () =>{
        return Promise.resolve()
      }

      for(let i = len-1 ; i>=0; i--){
        let currentMiddleware = this.middlewares[i]
        next = createNext(currentMiddleware, next)
      }

      await next()
    }
  }

  callback(){
    return (req, res) => {
      let ctx = this.createContext(req, res)
      let respond = () => this.response(ctx)
      let fn = this.compose()
      let onerror = err => this.onerror(err, ctx)
      return fn(ctx).then(respond).catch(onerror)
    }
  }
  onerror(err, ctx){
    if(err.code === 'ENOENT'){
      ctx.status = 404
    }else{
      ctx.status = 500
    }
    let msg = err.message || 'Internal error'
    ctx.res.end(msg)
    this.emit('error', err)
  }
  /**
   * 构造ctx
   * @param {*Object} req node req 实例
   * @param {*Object} res node res 实例
   * @return {*Object} ctx实例
   */
  createContext(req, res){
    // 针对每个请求，东欧要创建ctx对象
    let ctx = Object.create(this.context)
    ctx.request = Object.create(this.requset)
    ctx.response = Object.create(this.response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }

  responseBody(ctx){
    let content = ctx.body 
    if(typeof content === 'string'){
      ctx.res.end(content)
    }else if(typeof content === 'object'){
      ctx.res.end(JSON.stringify(content))
    }
  }

}

module.exports = Application