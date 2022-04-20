var express = require('express')
var app = express()
var api = require('./api')
var fs = require('fs')
var xlsx = require('node-xlsx')
// app.use('./api', api)
app.use(express.json())

app.get('/test', function(req, res) {
  console.log("request test!")
})
app.post('/saveFile', function(req, res) {
  // const savedFile = xlsx.parse('./files/justdance.xlsx')
  // console.log("read saved file:", JSON.stringify(savedFile, null, 2))
  console.log("req body:", req.body)
  fs.writeFileSync(req.body.filePath, Buffer.from(xlsx.build(req.body.data)))
  res.end("ok")
})
var server = app.listen(8085, function() {
  var host = server.address().address
  var port = server.address().port
  console.log(host)
  console.log(`server has running at http://${host}:${port}`)
})

function formatDate(_date) {
  let date = _date || new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return `${year}_${month<10?'0'+month: month}_${day<10?'0'+day: day}`
}