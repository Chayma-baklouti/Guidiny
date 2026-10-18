const express = require('express');
const path = require('path');
const multer = require('multer');
const { check } = require('express-validator');
const markersController = require('../contollers/markers-contoller');
const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname)),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    cb(null, ['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype)),
});

router.get('/user/:uid', markersController.byuserid);
router.get('/:pid', markersController.byid);
router.delete('/:pid', markersController.delmarker);

router.post(
  '/',
  upload.single('image'),   // AVANT les check(...)
  [
    check('type').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
    check('creator').isMongoId(),
  ],
  markersController.newmarker
);

router.patch(
  '/:pid',
  [
    check('type').not().isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  markersController.modifmarker
);

router.get('/', markersController.getAllMarkers);

module.exports = router;