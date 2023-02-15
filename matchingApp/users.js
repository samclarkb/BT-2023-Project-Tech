const mongoose = require('mongoose')

const user = new mongoose.Schema({
	Name: String,
	Age: Number,
})

module.exports = mongoose.model('user', user)
