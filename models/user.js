const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        required: true, // 'Email is required',
        trim: true,
        lowercase: true,
        unique: true,
        isEmail: true
    },
    password:{
        type: String,
        required: true, // 'Password is required'
    },
    username:{
        type: String,
        unique: true,
        required: true, //'Username is required'
        index: true
    },
    phone : {
        type:String
    },
    verified:{
        type:Boolean,
        default:false
    },
    lastlogin:{
        type: Date
    }
}, {
    timestamps: true
})

const User = mongoose.model('User',userSchema)

User.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash
            newUser.save(callback)
        })
    })
} 

User.getUserByUsername = function(username, callback){
    var query = {username: username}
    User.findOne(query, callback)
}

User.getUserById = function(id, callback){
    User.findById(id, callback)
}

User.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) return err
        callback(null, isMatch)
    })
}
module.exports = User