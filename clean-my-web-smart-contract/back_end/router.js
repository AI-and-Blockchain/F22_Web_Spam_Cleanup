const express = require('express')
const router = express.Router()

router.get('/get', (req, res) => {
    console.log(req.method)
    res.send({
        status: 1,
        message: "123",
        data: req.query
    })
})

router.post('/post', (req, res) => {
    console.log(req.method)
    res.send({
        status: 1,
        message: "123",
        data: req.body
    })
})

module.exports = router

