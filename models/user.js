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
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        isEmail: true
    },
    password:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        unique: true,
        required: true,
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

User.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash
            newUser.save(callback)
        })
    })
} 

User.getUserByUsername = (username, callback) => {
    var query = {username: username}
    User.findOne(query, callback)
}

User.getUserById = (id, callback) => {
    User.findById(id, callback)
}

User.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) return err
        callback(null, isMatch)
    })
}

module.exports = User