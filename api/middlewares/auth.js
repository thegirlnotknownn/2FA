class Auth {
    ensureAuthenticated(req, res, next) {
        if ( req.isAuthenticated() ) {
            return next()
        } else {
            res.redirect('/')
        }
    }
}

Auth = new Auth()
module.exports =Auth