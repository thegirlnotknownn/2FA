const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: String,
    email:String,
    password:String,
    username:String
});

const User = mongoose.model('User',userSchema);

User.createUser = function(newUser,cb){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            newUser.password =hash;
            newUser.save(cb);
        });
    });
}

User.getUserByUsername = function(username,cb){
    const query = {username:username};
    User.findOne(query,cb);
}

User.getUserById = function(id,cb){
    User.findById(id,cb);
}

User.comparePassword = function(candidatePassword,hash,cb){
    bcrypt.compare(candidatePassword,hash,function(err,isMatch){
        if (err) throw err;
        cb(null,isMatch);
    });
}

module.exports =User;