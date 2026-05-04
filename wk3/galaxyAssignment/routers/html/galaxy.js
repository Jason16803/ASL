const express     = require('express')
const router      = new express.Router()
const galaxyCtlr  = require('../../controllers/html/galaxy')
const upload      = require('../../middleware/upload')

// IMPORTANT: /new must be registered before /:id
// or Express will match the string "new" as an id param
router.get('/',              galaxyCtlr.index)
router.get('/new',           galaxyCtlr.newForm)
router.post('/',             upload.single('image'), galaxyCtlr.create)
router.get('/:id',           galaxyCtlr.show)
router.get('/:id/edit',      galaxyCtlr.editForm)
router.post('/:id',          upload.single('image'), galaxyCtlr.update)
router.post('/:id/delete',   galaxyCtlr.remove)

module.exports = router
