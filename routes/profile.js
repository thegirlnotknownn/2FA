const express = require('express')
const router = express.Router();
// import ensureAuthenticated from '../api/middlewares/auth'
const Auth = require('../api/middlewares/auth')
const ensureAuthenticated = Auth.ensureAuthenticated.bind(Auth)

// profile page
router.get('/',ensureAuthenticated, (req,res) => {
    res.render('profile', {
        title:'Welcome?',
        user: req.user
    })
})

module.exports = router