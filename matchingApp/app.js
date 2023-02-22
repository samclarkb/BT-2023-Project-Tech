const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const bodyParser = require('body-parser')
const multer = require('multer')
const userName = process.env.USERNAME
const passWord = process.env.PASSWORD
const app = express()
const port = process.env.PORT
const path = require('path')
const fs = require('fs')
const expressLayouts = require('express-ejs-layouts')
const e = require('express')
app.use(express.static(__dirname + '/public'))
app.use(expressLayouts)
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)

const url = `mongodb+srv://${userName}:${passWord}@Database.ymup0ov.mongodb.net/?retryWrites=true&w=majority`

mongoose
	.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch(e => {
		console.log('error', e)
	})

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images')
	},
	filename: (req, file, cb) => {
		console.log('file', file)
		cb(null, Date.now() + '-' + file.originalname)
	},
})

const upload = multer({ storage: storage })

let albumSchema = new mongoose.Schema({
	Title: String,
	Artist: String,
	Genre: String,
	Year: String,
	Image: {
		data: String,
		contentType: String,
	},
	Description: String,
	Like: Boolean,
})

const Albums = mongoose.model('Albums', albumSchema, 'Albums')

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render('home')
})

app.get('/preference', (req, res) => {
	res.render('preference')
})

app.get('/results', async (req, res) => {
	const fetchAlbums = await Albums.find({})
	res.render('results', { data: fetchAlbums })
})

app.get('/results:id', async (req, res) => {
	const fetchOneAlbum = await Albums.find({ _id: req.params.id })
	res.render('albumDetail', { data: fetchOneAlbum })
})

app.post('/results', async (req, res) => {
	const fetchAlbums = await Albums.find({ Year: req.body.year, Genre: req.body.genre })
	res.render('results', { data: fetchAlbums })
})

app.get('/favorites', async (req, res) => {
	const fetchFavorite = await Albums.find({ Like: true })
	res.render('favorites', { data: fetchFavorite })
})

app.post('/favorites:id', async (req, res) => {
	console.log('id', req.body)
	const updateFavorite = await Albums.findOneAndUpdate({ _id: req.params.id }, [
		{ $set: { Like: { $eq: [false, '$Like'] } } },
	])

	// res.send('/favorites', { data: updateFavorite })
})

app.post('/add', upload.single('File'), function (req, res) {
	console.log('req', req.file)

	Albums.insertMany([
		{
			Title: req.body.Title,
			Artist: req.body.Artist,
			Genre: req.body.Genre,
			Year: req.body.Year,
			Like: false,
			Description: req.body.Description,
			Image: { data: req.file.filename, contentType: 'image/png' },
		},
	]).then(() => console.log('user saved'))

	res.render('add')
})

app.get('/add', function (req, res) {
	res.render('add')
})

app.get('*', function (req, res) {
	res.status(404).send('404 page')
})

app.listen(port, () => {
	console.log(`server running on ${port}`)
})
