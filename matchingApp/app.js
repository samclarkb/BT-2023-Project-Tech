const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const bodyParser = require('body-parser')
const userName = process.env.USERNAME
const passWord = process.env.PASSWORD
const app = express()
const port = process.env.PORT
const expressLayouts = require('express-ejs-layouts')
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

let albumSchema = new mongoose.Schema({
	Title: String,
	Artist: String,
	Genre: String,
	Year: String,
	Image: String,
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
	console.log(req.params.id)
	res.render('results', { data: fetchAlbums })
})

app.get('/results:id', async (req, res) => {
	const fetchOneAlbum = await Albums.find({ _id: req.params.id })
	console.log('fetchAlbums', fetchOneAlbum)
	res.render('albumDetail', { data: fetchOneAlbum })
})

app.post('/results', async (req, res) => {
	const fetchAlbums = await Albums.find({ Year: req.body.year, Genre: req.body.genre })
	res.render('results', { data: fetchAlbums })
})

app.get('/favorites', async (req, res) => {
	const fetchFavorite = await Albums.find({ Like: true })
	console.log('favorite', fetchFavorite)
	res.render('favorites', { data: fetchFavorite })
})

app.put('/favorites:id', async (req, res) => {
	const updateFavorite = await Albums.updateOne({ Like })
	
	console.log('id', req.params.Title)
	res.send('hai' + req.body)
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
