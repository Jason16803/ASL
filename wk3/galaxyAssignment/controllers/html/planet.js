const db = require('../../models')

// GET /planets
const index = async (req, res) => {
  try {
    const planets = await db.Planet.findAll({ include: [{ model: db.Star }] })
    res.render('planets/index', { planets })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// GET /planets/:id
const show = async (req, res) => {
  try {
    const planet = await db.Planet.findByPk(req.params.id, {
      include: [{ model: db.Star }]
    })
    if (!planet) return res.status(404).render('error', { message: 'Planet not found' })
    res.render('planets/show', { planet })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// GET /planets/new
const newForm = (req, res) => {
  res.render('planets/new')
}

// POST /planets
const create = async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) data.imageUrl = '/uploads/' + req.file.filename
    await db.Planet.create(data)
    res.redirect('/planets')
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// GET /planets/:id/edit
const editForm = async (req, res) => {
  try {
    const planet = await db.Planet.findByPk(req.params.id)
    if (!planet) return res.status(404).render('error', { message: 'Planet not found' })
    res.render('planets/edit', { planet })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// POST /planets/:id
const update = async (req, res) => {
  try {
    const planet = await db.Planet.findByPk(req.params.id)
    if (!planet) return res.status(404).render('error', { message: 'Planet not found' })
    const data = { ...req.body }
    if (req.file) data.imageUrl = '/uploads/' + req.file.filename
    await planet.update(data)
    res.redirect('/planets/' + planet.id)
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// POST /planets/:id/delete
const remove = async (req, res) => {
  try {
    const planet = await db.Planet.findByPk(req.params.id)
    if (!planet) return res.status(404).render('error', { message: 'Planet not found' })
    await planet.destroy()
    res.redirect('/planets')
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

module.exports = { index, show, newForm, create, editForm, update, remove }
