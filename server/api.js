var express = require('express')
var fs = require('fs')
var router = express.Router()

router.get('/saveFile', function(req, res) {
  console.log("req:", req)
  console.log("res:", res)
})

module.exports = router