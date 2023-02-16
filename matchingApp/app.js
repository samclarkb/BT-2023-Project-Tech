const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userName = process.env.USERNAME
const passWord = process.env.PASSWORD
const app = express()
const port = process.env.PORT
const expressLayouts = require('express-ejs-layouts')
// const user = require('./users.js')
app.use(express.static(__dirname + '/public'))
app.use(expressLayouts)

const url = `mongodb+srv://${userName}:${passWord}@Database.ymup0ov.mongodb.net/?retryWrites=true&w=majority`

mongoose
	.connect(url)
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch(e => {
		console.log('error', e)
	})

let albumSchema = new mongoose.Schema({
	Title: String,
	Artist: String,
	Year: String,
	Genre: String,
})

let Albums = mongoose.model('Albums', albumSchema, 'projectTechDatabase')

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render('home')
})

app.get('/preference', (req, res) => {
	res.render('preference')
})

app.get('/results', (req, res) => {
	Albums.find({}, (error, data) => {
		console.log('data', data)
	})
	res.render('results')
})

app.get('/profile', (req, res) => {
	res.render('profile')
})

app.get('/favorites', (req, res) => {
	res.render('favorites')
})

app.get('*', function (req, res) {
	res.status(404).send('404 page')
})

app.listen(port, () => {
	console.log(`server running on ${port}`)
})
