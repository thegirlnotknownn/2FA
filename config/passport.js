const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.getUserByUsername(username, function (err, user) {
                if (err) return err
                if (!user) {
                    return done(null, false, { message: 'Unknown User' })
                }
    
                User.comparePassword(password, user.password, function (err, isMatch) {
                    if (err) return err
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Invalid password' })
                    }
                })
            })
        }))
    
    passport.serializeUser(function (user, done) {
        var sessionUser = {
            _id: user._id,
            name: user.name,
            username:user.username,
            email:user.email,
            dob:user.dob,
            phone:user.phone,
            gender:user.gender
        }
        done(null, user.id)
    })
    
    passport.deserializeUser(function (id, done) {
        User.getUserById(id, function (err, user) {
            done(err, user);
        })
    })   
}