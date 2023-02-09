const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT
const student = require('./student.js')

app.get('/', (req, res) => {
	console.log('student', student)
	res.send('Home page')
})

app.get('/about', (req, res) => {
	console.log('hello world!')
	res.send('About page')
})

app.get('/login', (req, res) => {
	console.log('login screen')
	res.send('login screen')
})

app.get('*', function (req, res) {
	res.status(404).send('404 page')
})

app.listen(port, () => {
	console.log(`server running on ${port}`)
})
