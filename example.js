let myKoa = require('./application')
let app = new simpleKoa()

app.use((req, res) =>{
  req.writeHead(200)
  res.end('hello world')
})

app.listen(3000, ()=>{
  console.log('listening on 3000')
})