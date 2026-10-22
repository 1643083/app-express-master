const router = require('express').Router()
const c = require('../controllers/auth.controller') //controlador gestiona PERMISO
const { verifyToken } = require('../middlewares/auth')
const { loginLimiter } = require('../middlewares/rateLimit')

//en un login, qué verbo debemos utilizar?
//post (enviamos un paquete, protección)
router.post('./login', loginLimiter, c)