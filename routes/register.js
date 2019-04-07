const config = require('config')

const express = require('express')
const router = express.Router()
const passport = require('passport')
const Nexmo = require('nexmo')

const NEXMO_API_KEY = config.get('Nexmo.API_KEY')
const NEXMO_API_SECRET = config.get('Nexmo.API_SECRET')
const NEXMO_BRAND_NAME = config.get('Nexmo.BRAND_NAME')
const nexmo = new Nexmo({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET
})

const verifyRequestId = null
const verifyRequestNumber = null

const User = require('../models/user')
const __ = require('../helpers/response')

// get signin page 
router.get('/signin', (req, res) => {
    res.render('signin')
})

// get signup page
router.get('/signup', (req, res) => {
    res.render('signup') 
})

router.post('/signup', (req, res, next) => {
    var name = req.body.name
    var username = req.body.username
    var password = req.body.password
    var password2 = req.body.password2
    var email = req.body.email
    const phone = req.body.phone

	// ADD MORE VALIDATIONS
    // Validation
    req.checkBody('name', 'Name is required').notEmpty()
	req.checkBody('email', 'Email is required').notEmpty()
	req.checkBody('email', 'Email is not valid').isEmail()
	req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password2','Confirm your password').notEmpty()
    req.checkBody('password','Min length required is 6 characters').isLength({min: 5})
    req.checkBody('password2', 'Passwords do not match').equals(password)
    // put regex validation as well and whatever error is show it on the main screen

    var errors = req.validationErrors()

    if (errors) {
        __.send(res, 400, 'Validation Error!','Check your entries there buddy!')
	}
	else {
		User.findOne({ $or:[{username: username} || {email: email} ]}, (err, user) => {
			if (user) {
				__.Found(res, 'You\'re already registered')
			}
			else {
				const newUser = new User({
                    name: name,
                    username: username,
                    password: password,
                    email: email,
                    phone: phone
                })
				User.createUser(newUser, (err, user) => {
                    if (err) {
                        // console.log(err)
                      return  __.error(res, err) 
                    }   
                    res.redirect('/register/signin')
                })
			}
		})
	}
})

router.post('/signin', passport.authenticate('local', {
    failureRedirect:'/register/login', 
    failureFlash: true
}), (req, res, next) => {
    const username = req.body.username
    User.findOne({username: username}, (err, user) => {
        if (err) return res.json(err)
        nexmo.verify.request({
            number: user.phone,
            brand: NEXMO_BRAND_NAME
          }, (err, result) => {
            if (err) {
            //   console.error(err)
            return __.error(res, err)
            } else {
              const verifyRequestId = result.request_id
            //   console.log('request_id', verifyRequestId)
                res.render('verify', {
                   requestId: verifyRequestId
                })
            }
        })
    }) 
})

router.post('/checkcode', (req, res) => {
    const pin = req.body.code
    const verifyRequestId = req.body.requestId
    nexmo.verify.check({
        request_id: verifyRequestId,
        code: pin
    }, (err, result) => {
        if (err) {
            // console.error(err)
            __.error(res, err)
        } else {
            if (result && result.status == 0) {
                req.session.user = {
                    phone: verifyRequestNumber
                }
            res.redirect('/profile')
            } else {
                __.notFound(res, 'OTP error')
            }
        }
    })
})

router.get('/logout', (req, res) => {
    req.logout()
    req.session.destroy()
    res.redirect('/')
})

module.exports = router