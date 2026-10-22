const router = require('express').Router()

//JWT = limitar el uso de las rutas
const { verifyToken, requireLevel } = require('../middlewares/auth')

//rutas app (expandiendo según módulos)
//versión 1: login (público)
router.use('/auth', require('./auth.routes'))
router.use('/personas', verifyToken, require('./persona.routes'))
router.use('/usuarios', verifyToken, requireLevel('ADMIN'), require('./usuario.routes'))

module.exports = router
