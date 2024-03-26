const router = require('express').Router()
const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require('../docs/swagger.json')

const Auth = require('./authRouter')
const { checkUUIDBody, checkUUIDQuery } = require('../middlewares/checkUUID')

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
router.use('/', checkUUIDBody(), checkUUIDQuery())
router.use('/api/v1/auth', Auth)

module.exports = router
