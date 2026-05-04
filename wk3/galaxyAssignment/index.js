const express = require('express')
const path    = require('path')

// Create Express app
const app = express()

// ── View engine ──────────────────────────────────────────────────
// Express auto-requires twig internally — no top-level require needed.
// Setting cache false means template edits reload without a restart.
app.set('view engine', 'twig')
app.set('views', path.join(__dirname, 'views'))
app.set('twig options', { cache: false })

// ── Middleware ───────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// ── Routers ──────────────────────────────────────────────────────
const apiRouters  = require('./routers/index.js')
const htmlRouters = require('./routers/html/index.js')

// ── Home ─────────────────────────────────────────────────────────
// req.accepts('html') returns 'html' first when a browser sends
// Accept: text/html,...,*/*  because quality values prefer html.
// curl / Postman with no Accept header defaults to */* — check for
// an explicit JSON Accept to identify API clients.
app.get('/', (req, res) => {
  const wantsJson = req.headers['accept'] && req.headers['accept'].includes('application/json')
  if (wantsJson) {
    return res.status(200).json({ message: 'Welcome to Star Tracker Library' })
  }
  res.render('home')
})

// ── JSON API routes  (/v1/*) ─────────────────────────────────────
app.use('/v1/galaxies', apiRouters.galaxy)
app.use('/v1/stars',    apiRouters.star)
app.use('/v1/planets',  apiRouters.planet)

// ── HTML browser routes ──────────────────────────────────────────
app.use('/galaxies', htmlRouters.galaxy)
app.use('/stars',    htmlRouters.star)
app.use('/planets',  htmlRouters.planet)

// ── Start ────────────────────────────────────────────────────────
app.listen(3000, () => {
  console.log('Star Tracker listening on http://localhost:3000')
})
