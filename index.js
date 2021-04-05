const express = require( 'express')
const morgan = require('morgan')
const http  = require('http')
const bodyParser =  require('body-parser')
const app = express()
const router = require('./router')
const mongoose = require('mongoose')
const cors = require('cors')

//db setup
mongoose.connect("mongodb://localhost:auth/auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app setup
app.use(morgan('combined'))
app.use(cors())
app.use(bodyParser.json({type: "*/*"}))
router(app)


// server setup
const port = process.env.port || 3090

const server = http.createServer(app)
server.listen(port)

console.log('Server is up')


