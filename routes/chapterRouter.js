const router = require('express').Router()

const Chapter = require('../controllers/chapterController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')
const { checkUUIDParams } = require('../middlewares/checkUUID')

router.post('/', authenticate, checkRole('admin'), Chapter.createChapter)
router.get('/', Chapter.getAllChapter)
router.get('/:id', checkUUIDParams(), Chapter.getChapterById)
router.put(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Chapter.updateChapter,
)
router.delete(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Chapter.deleteChapter,
)

module.exports = router
