'use strict'

const config = require('config')
const mongoose = require('mongoose')
const mongodbURL = config.get('db')
const Promise = require('bluebird') //check thia tooo

mongoose.Promise = Promise

class DatabaseClass {
    connectMongo() {
        try {
            if (this.connection) {
                return
            }
            this.connection = mongoose.connect(mongodbURL, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false
            }).then(() => {
                console.log('Mongo DB connection successful')
            })
        } catch (error) {
            console.error('Failed to connect MongoDB. Error: ',error)
        }
    }
}

const databaseHelper = new DatabaseClass()
module.exports = databaseHelper