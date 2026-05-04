const express     = require('express')
const router      = new express.Router()
const planetCtlr  = require('../../controllers/html/planet')
const upload      = require('../../middleware/upload')

router.get('/',            planetCtlr.index)
router.get('/new',         planetCtlr.newForm)
router.post('/',           upload.single('image'), planetCtlr.create)
router.get('/:id',         planetCtlr.show)
router.get('/:id/edit',    planetCtlr.editForm)
router.post('/:id',        upload.single('image'), planetCtlr.update)
router.post('/:id/delete', planetCtlr.remove)

module.exports = router
