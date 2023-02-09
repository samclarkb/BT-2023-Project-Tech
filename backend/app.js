const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
	console.log('hello world!')
	res.send('hello world!')
})

app.listen(port, () => {
	console.log(`server running on ${port}`)
})
