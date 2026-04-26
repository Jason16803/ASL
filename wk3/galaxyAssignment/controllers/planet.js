const db = require('../models')

// GET /v1/planets — Return all planets with their stars
const index = async (req, res) => {
  try {
    const planets = await db.Planet.findAll({
      include: [{ model: db.Star }]
    })
    res.status(200).json(planets)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /v1/planets/:id — Return a single planet with its stars
const show = async (req, res) => {
  try {
    const planet = await db.Planet.findByPk(req.params.id, {
      include: [{ model: db.Star }]
    })
    if (!planet) return res.status(404).json({ error: 'Planet not found' })
    res.status(200).json(planet)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /v1/planets — Create a new planet
const create = async (req, res) => {
  try {
    const planet = await db.Planet.create(req.body)
    res.status(201).json(planet)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PUT /v1/planets/:id — Update an existing planet
const update = async (req, res) => {
  try {
    const planet = await db.Planet.findByPk(req.params.id)
    if (!planet) return res.status(404).json({ error: 'Planet not found' })
    await planet.update(req.body)
    res.status(200).json(planet)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /v1/planets/:id — Remove a planet
const remove = async (req, res) => {
  try {
    const planet = await db.Planet.findByPk(req.params.id)
    if (!planet) return res.status(404).json({ error: 'Planet not found' })
    await planet.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /v1/planets/:planetId/stars/:starId — Associate a Star with a Planet
const addStar = async (req, res) => {
  try {
    const planet = await db.Planet.findByPk(req.params.planetId)
    const star   = await db.Star.findByPk(req.params.starId)

    if (!planet) return res.status(404).json({ error: 'Planet not found' })
    if (!star)   return res.status(404).json({ error: 'Star not found' })

    await planet.addStar(star)

    // Re-fetch with all associations so the response is fully populated
    const updated = await db.Planet.findByPk(planet.id, {
      include: [{ model: db.Star }]
    })

    res.status(200).json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Export all controller actions
module.exports = { index, show, create, update, remove, addStar }
