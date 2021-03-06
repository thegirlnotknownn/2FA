const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')
const __ = require('../helpers/response')

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        (username, password, done) => {
            User.getUserByUsername(username, (err, user) => {
                if (err) return __.error(res, err)
                if (!user) {
                    return done(null, false, { message: 'Unknown User' })
                }
                User.comparePassword(password, user.password, (err, isMatch) => {
                    if (err) return __.error(res, err)
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Invalid password' })
                    }
                })
            })
        }
    ))

    passport.serializeUser( (user, done) => {
        const sessionUser = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone
        }
        done(null, user.id)
    })
    
    passport.deserializeUser( (id, done) => {
        User.getUserById(id, (err, user) => {
            done(err, user)
        })
    })   
}