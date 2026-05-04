const db = require('../../models')

// GET /stars
const index = async (req, res) => {
  try {
    const stars = await db.Star.findAll({
      include: [{ model: db.Galaxy }, { model: db.Planet }]
    })
    res.render('stars/index', { stars })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// GET /stars/:id
const show = async (req, res) => {
  try {
    const star = await db.Star.findByPk(req.params.id, {
      include: [{ model: db.Galaxy }, { model: db.Planet }]
    })
    if (!star) return res.status(404).render('error', { message: 'Star not found' })
    res.render('stars/show', { star })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// GET /stars/new  — also fetches galaxies for the dropdown
const newForm = async (req, res) => {
  try {
    const galaxies = await db.Galaxy.findAll()
    res.render('stars/new', { galaxies })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// POST /stars
const create = async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) data.imageUrl = '/uploads/' + req.file.filename
    // Convert empty string GalaxyId to null so Sequelize doesn't choke
    if (!data.GalaxyId) data.GalaxyId = null
    await db.Star.create(data)
    res.redirect('/stars')
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// GET /stars/:id/edit
const editForm = async (req, res) => {
  try {
    const [star, galaxies] = await Promise.all([
      db.Star.findByPk(req.params.id),
      db.Galaxy.findAll()
    ])
    if (!star) return res.status(404).render('error', { message: 'Star not found' })
    res.render('stars/edit', { star, galaxies })
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// POST /stars/:id
const update = async (req, res) => {
  try {
    const star = await db.Star.findByPk(req.params.id)
    if (!star) return res.status(404).render('error', { message: 'Star not found' })
    const data = { ...req.body }
    if (req.file) data.imageUrl = '/uploads/' + req.file.filename
    if (!data.GalaxyId) data.GalaxyId = null
    await star.update(data)
    res.redirect('/stars/' + star.id)
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

// POST /stars/:id/delete
const remove = async (req, res) => {
  try {
    const star = await db.Star.findByPk(req.params.id)
    if (!star) return res.status(404).render('error', { message: 'Star not found' })
    await star.destroy()
    res.redirect('/stars')
  } catch (err) {
    res.status(500).render('error', { message: err.message })
  }
}

module.exports = { index, show, newForm, create, editForm, update, remove }
