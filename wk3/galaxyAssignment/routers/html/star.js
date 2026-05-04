const express   = require('express')
const router    = new express.Router()
const starCtlr  = require('../../controllers/html/star')
const upload    = require('../../middleware/upload')

router.get('/',            starCtlr.index)
router.get('/new',         starCtlr.newForm)
router.post('/',           upload.single('image'), starCtlr.create)
router.get('/:id',         starCtlr.show)
router.get('/:id/edit',    starCtlr.editForm)
router.post('/:id',        upload.single('image'), starCtlr.update)
router.post('/:id/delete', starCtlr.remove)

module.exports = router
