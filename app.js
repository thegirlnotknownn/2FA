console.log('Starting Environment - ' + process.env.NODE_ENV)
NODE_TLS_REJECT_UNAUTHORIZED=0 //why?

const config = require('config')

const express = require('express')
const cors = require('cors')
const winston = require('winston')
const expressWinston = require('express-winston')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')//morgan?
const session = require('express-session')
const path = require('path')
const passport = require('passport')
const flash = require('connect-flash')
const expressValidator = require('express-validator')

const app = express()
// how to use import export?

const db = require('./helpers/db')
const __ = require('./helpers/response')

// routes
const index = require('./routes/index')
const register = require('./routes/register')
const profile = require('./routes/profile')

// passport configuration
require('./config/passport')(passport)

// set view engine
app.set('views',path.join(__dirname, 'views'))
app.set('view engine','ejs')

app.use(bodyParser.json()) // With or without {}
app.use(bodyParser.urlencoded({extended:false}))

app.use(mongoSanitize())
app.use(cookieParser())
app.use(
    session({
        secret: 'secret',//config.SECRET,
        resave: true,
        saveUninitialized: true
    })
)

app.use(expressValidator({
    errorFormatter: function(param, msg, value) /*  */{
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));


app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: false, //true for details
            colorize: true,
            timestamp: false // earlier true check
        })
    ]
}))

db.connectMongo()

const corsOptions = {
    origin: config.get('corsAllowedDomains')
}
// mongoSanitize?

app.use(cors(corsOptions))
app.use(helmet())

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('remember-me'))

app.use('/',index)
app.use('/register',register)
app.use('/profile',profile)

app.use((req, res, next) => {
    __.notFound(res, 'Wrong page URL')
})

module.exports = app