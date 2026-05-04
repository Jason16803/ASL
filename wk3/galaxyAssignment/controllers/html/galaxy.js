const db     = require('../../models')
const upload = require('../../middleware/upload')

// GET /galaxies
const index = async (req, res) => {
  try {
    const galaxies = await db.Galaxy.findAll({ include: [{ model: db.Star }] })
    res.render('galaxies/index', { galaxies })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// GET /galaxies/:id
const show = async (req, res) => {
  try {
    const galaxy = await db.Galaxy.findByPk(req.params.id, {
      include: [{ model: db.Star }]
    })
    if (!galaxy) return res.status(404).render('error', { message: 'Galaxy not found' })
    res.render('galaxies/show', { galaxy })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// GET /galaxies/new
const newForm = (req, res) => {
  res.render('galaxies/new')
}

// POST /galaxies
const create = async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) data.imageUrl = '/uploads/' + req.file.filename
    await db.Galaxy.create(data)
    res.redirect('/galaxies')
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// GET /galaxies/:id/edit
const editForm = async (req, res) => {
  try {
    const galaxy = await db.Galaxy.findByPk(req.params.id)
    if (!galaxy) return res.status(404).render('error', { message: 'Galaxy not found' })
    res.render('galaxies/edit', { galaxy })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// POST /galaxies/:id  (HTML forms cannot send PUT)
const update = async (req, res) => {
  try {
    const galaxy = await db.Galaxy.findByPk(req.params.id)
    if (!galaxy) return res.status(404).render('error', { message: 'Galaxy not found' })
    const data = { ...req.body }
    if (req.file) data.imageUrl = '/uploads/' + req.file.filename
    await galaxy.update(data)
    res.redirect('/galaxies/' + galaxy.id)
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// POST /galaxies/:id/delete  (HTML forms cannot send DELETE)
const remove = async (req, res) => {
  try {
    const galaxy = await db.Galaxy.findByPk(req.params.id)
    if (!galaxy) return res.status(404).render('error', { message: 'Galaxy not found' })
    await galaxy.destroy()
    res.redirect('/galaxies')
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

module.exports = { index, show, newForm, create, editForm, update, remove }
