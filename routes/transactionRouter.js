const router = require('express').Router()

const Transaction = require('../controllers/transactionController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')
const { checkUUIDParams } = require('../middlewares/checkUUID')

router.get('/', authenticate, checkRole('admin'), Transaction.getAllTransaction)
router.get(
  '/:id',
  checkUUIDParams(),
  authenticate,
  checkRole('admin'),
  Transaction.getTransactionById,
)
router.post('/', authenticate, Transaction.createTransaction)
router.post('/payment-callback', Transaction.paymentCallback)

module.exports = router
