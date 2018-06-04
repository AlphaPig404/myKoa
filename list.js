async function m1(next){
  console.log('m1')
  await next()
}

async function m2(next){
  console.log('m2')
  await next()
}

async function m3(){
  console.log('m3')
}

// ================================
let next1 = async function(){
  await m3()
}

let next2 = async function(){
  await m2(next1)
}

m1(next2)

// ==========================================
function createNext(middelware, oldNext){
  return async function(){
    await middelware(oldNext)
  }
}

let next1 = createNext(m3, null)
let next2 = createNext(m2, next1)
let next3 = createNext(m1, next2)

next3()

// ===============================

let middlewares = [m1, m2, m3]
let len = middlewares.length 

let next = async function(){
  return Promise.resolve()
}

for(let i= len-1; i>=0; i--){
  next = createNext(middlewares[i], next)
}

next()