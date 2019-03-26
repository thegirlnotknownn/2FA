const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Nexmo = require('nexmo');

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/2FA", { useNewUrlParser:true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo Connection Error!'));

const register = require('./routes/register');
const profile = require('./routes/profile');

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.get('/', function(req,res){
    res.render('index',{
        title: 'INDEX'
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());



app.use('/register',register);
app.use('/profile',profile);

const port = (process.env.PORT || 3000);
app.set('port',port);
const server = http.createServer(app);
server.listen(port, function(){
    console.log(`Server up and running on port ${port}`);
});