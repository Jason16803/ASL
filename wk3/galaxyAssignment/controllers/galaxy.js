const db = require('../models')

// GET /v1/galaxies — Return all galaxies with their stars
const index = async (req, res) => {
  try {
    const galaxies = await db.Galaxy.findAll({
      include: [{ model: db.Star }]
    })
    res.status(200).json(galaxies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /v1/galaxies/:id — Return a single galaxy with its stars
const show = async (req, res) => {
  try {
    const galaxy = await db.Galaxy.findByPk(req.params.id, {
      include: [{ model: db.Star }]
    })
    if (!galaxy) return res.status(404).json({ error: 'Galaxy not found' })
    res.status(200).json(galaxy)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /v1/galaxies — Create a new galaxy
const create = async (req, res) => {
  try {
    const galaxy = await db.Galaxy.create(req.body)
    res.status(201).json(galaxy)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /v1/galaxies/:id — Update an existing galaxy
const update = async (req, res) => {
  try {
    const galaxy = await db.Galaxy.findByPk(req.params.id)
    if (!galaxy) return res.status(404).json({ error: 'Galaxy not found' })
    await galaxy.update(req.body)
    res.status(200).json(galaxy)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /v1/galaxies/:id — Remove a galaxy
const remove = async (req, res) => {
  try {
    const galaxy = await db.Galaxy.findByPk(req.params.id)
    if (!galaxy) return res.status(404).json({ error: 'Galaxy not found' })
    await galaxy.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Export all controller actions
module.exports = { index, show, create, update, remove }
