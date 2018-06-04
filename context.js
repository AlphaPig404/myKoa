let proto = {}

function delegateSet(property, name){
  proto.__defineSetter__(name, function(val){
    this[property][name] = val
  })
}

function delegateGet(property, name){
  proto.__defineGetter__(name, function(val){
    return this[property][name]
  })
}

let requestSet = []
let requestGet = ['query']

let responseSet = ['body', 'status']
let responseGet = responseSet

requestSet.forEach(ele =>{
  delegateSet('requset', ele)
})

requestGet.forEach(ele =>{
  delegateSet('requet', ele)
})

responseSet.forEach(ele =>{
  delegateSet('response', ele)
})

responseGet.forEach(ele =>{
  delegateSet('response', ele)
})

module.exports = proto

