const multer = require('multer')
const path   = require('path')

// Store uploads in public/uploads/ with a unique timestamped filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  }
})

// Only allow image file types
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/
  const validExt  = allowed.test(path.extname(file.originalname).toLowerCase())
  const validMime = allowed.test(file.mimetype)
  cb(null, validExt && validMime)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
})

module.exports = upload
