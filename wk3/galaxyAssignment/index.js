// Load in our Express framework
const express = require('express')

// Create a new Express instance called "app"
const app = express()

// Body parsing middleware — required for JSON POST/PUT bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Load in our RESTful routers
const routers = require('./routers/index.js')

// Home page welcome
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Star Tracker Library' })
})

// Register our RESTful routers under /v1
app.use('/v1/galaxies', routers.galaxy)
app.use('/v1/stars',    routers.star)
app.use('/v1/planets',  routers.planet)

// Set our app to listen on port 3000
app.listen(3000, () => {
  console.log('Star Tracker API listening on port 3000')
})
