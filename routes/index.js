const express = require('express')
const router = express.Router()

// main/index page
router.get('/', (req,res) => {
    res.render('index', {
        title: 'INDEX'
    })
})

module.exports = router