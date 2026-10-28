const rateLimit = require('express-rate-limit')

//estas funciones controlarán la cantidad de intentos y el tráfico en nuestra aplicación
//"en localhost siempre funciona"
//"con 1 usuario nunca hubo problemas"

//flujo de login(intentos)
//windowMs    : tiempo en milisegundos
//limit       : intentos por IP
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'demasiados intentos, verifique en unos minutos' }
})

//flujo de solicitudes (usuarios que se conectan a la app)
exports.apiLimiter = rateLimit({
  windowMs: 6 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'demasiadas solicitudes. intente en un momento' }
})