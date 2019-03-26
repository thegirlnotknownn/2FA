const express = require('express');
const router = express.Router();
const User = require('../models/userinfo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: 'f5a5d698',
    apiSecret: 'wduqfvzGJkG4cH1B'
});

router.get('/signin', function(req,res){
    res.render('signin',{
        title: 'SIGNIN'
    });
});

router.get('/signup', function(req,res){
    res.render('signup',{
        title: 'SIGNUP'
    });
});

router.get('/verify',function(req,res){
    res.render('verify',{
        title: 'Verify!'
    });
});

router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
})

passport.use(new LocalStrategy(
    function(username,password,done){
        User.getUserByUsername(username,function(err,user){
            if (err) {return done(err);}
            if(!user){
                return done(null,false,{message:'Incorrect username'});
            }
           User.comparePassword(password,user.password,function(err,isMatch){
               if (err) throw err;
               if(isMatch){
                   return done(null,user);
               }else{
                   return done(null,false,{message:'Incorrect Password'});
               }
           })
        });
    }
));

passport.serializeUser(function(user,done){
    var sessionUser = {
        _id:user._id,
        name:user.name,
        email:user.email,
        password:user.password,
        username:user.username
    }
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.getUserById(id,function(err,user){
        done(err,user);
    });
});

router.post('/signup', function(req,res){

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const password2 = req.body.password2;

    User.findOne({username:{
        "$regex":"^" + username + "\\b", "$options": "i"
    }}, function(err,user){
        User.findOne({email:{
        "$regex":"^" + email + "\\b", "$options":"i"
    }},function(err,mail){
        if(user || mail){
            res.render('signup',{
                user:user,
                mail:mail
            });
        }else{
            var newUser = new User({
                name:name,
                email:email,
                password:password,
                username:username
            });
            User.createUser(newUser,function(err,user){
                if (err) throw err;
            });
            res.redirect('/register/signin');
        }
    });

    var newUser = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        username:req.body.username
    });
    });
});

router.post('/signin',passport.authenticate('local',{successRedirect:'/register/verify', failureRedirect:'/register/signin',failureFlash:true}),function(req,res){
    console.log('?');
});

router.post('/verify',function(req,res){
    let phoneNumber = req.body.number;
    console.log(phoneNumber);
    nexmo.verify.request({
        number: phoneNumber,
        brand:'Nexmo',
        code_length:4
    }, function(err,result){
        if (err) {console.log(err);}
        else{
            let requestId = result.request_id;
            console.log('request_id', requestId);
            if(result.status == '0'){
                res.render('verify2',{requestId:requestId});
            }else{
                res.status(401).send(result.error_text)
            }
        }
    })
});

router.post('/verify2', function(req,res){
    let  pin = req.body.pin;
    let requestId = req.body.requestId;
    // pin expiry? add
    nexmo.verify.check({request_id:requestId,code:pin},function(err,result){
        if(err) console.log(err)
        else{
            if(result && result.status == '0'){
                res.redirect('/profile');
            }else{
                console.log(err);
            }
        }
    });
});


module.exports = router;