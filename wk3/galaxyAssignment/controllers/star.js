const db = require('../models')

// GET /v1/stars — Return all stars with their galaxy and planets
const index = async (req, res) => {
  try {
    const stars = await db.Star.findAll({
      include: [{ model: db.Galaxy }, { model: db.Planet }]
    })
    res.status(200).json(stars)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /v1/stars/:id — Return a single star with its galaxy and planets
const show = async (req, res) => {
  try {
    const star = await db.Star.findByPk(req.params.id, {
      include: [{ model: db.Galaxy }, { model: db.Planet }]
    })
    if (!star) return res.status(404).json({ error: 'Star not found' })
    res.status(200).json(star)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /v1/stars — Create a new star
const create = async (req, res) => {
  try {
    const star = await db.Star.create(req.body)
    res.status(201).json(star)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /v1/stars/:id — Update an existing star
const update = async (req, res) => {
  try {
    const star = await db.Star.findByPk(req.params.id)
    if (!star) return res.status(404).json({ error: 'Star not found' })
    await star.update(req.body)
    res.status(200).json(star)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /v1/stars/:id — Remove a star
const remove = async (req, res) => {
  try {
    const star = await db.Star.findByPk(req.params.id)
    if (!star) return res.status(404).json({ error: 'Star not found' })
    await star.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /v1/stars/:starId/planets/:planetId — Associate a Planet with a Star
const addPlanet = async (req, res) => {
  try {
    const star   = await db.Star.findByPk(req.params.starId)
    const planet = await db.Planet.findByPk(req.params.planetId)

    if (!star)   return res.status(404).json({ error: 'Star not found' })
    if (!planet) return res.status(404).json({ error: 'Planet not found' })

    await star.addPlanet(planet)

    // Re-fetch with all associations so the response is fully populated
    const updated = await db.Star.findByPk(star.id, {
      include: [{ model: db.Galaxy }, { model: db.Planet }]
    })

    res.status(200).json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Export all controller actions
module.exports = { index, show, create, update, remove, addPlanet }
