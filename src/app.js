require("dotenv").config()

//módulos de la aplicación
const path = require('path') //gestión de rutas
const express = require('express') //framework de backend
const helmet = require('helmet') //seguridad - JWT (json web token)
const cookieParser = require('cookie-parser') //cookie (archivo guarda configuración - navegador)

//gestión de rutas
const routes = require('./routes')

//otras configuraciones
const { apiLimiter } = require('./middlewares/rateLimit')
const { notFound, errorHandler } = require('./middlewares/errorHandler')

const app = express() //inicializar framework
const isProd = process.env.NODE_ENV === 'production' //evalúa el tipo de entorno

//proxy = máscara de navegación (nginix)
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.NODE_ENV))

//configuración de seguridad
//cross site scripting (xss)
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'style-src': ["'self'"],
      'upgrade-insecure-request': isProd ? [] : null
    }
  }
}))

//configurando express...
app.use(express.json({ limit: '10kb' })) //tamaño máximo JSON
app.use(cookieParser()) //leer los cookies 
app.use(express.static(path.join(__dirname, '..', 'public'))) //ruta frontend

//configuración de ruta
app.use('/api', apiLimiter, routes)

//ruta raíz '/' (dev) localhost:3000, (prod) miapp.com
app.get('/', (req, res) => res.redirect('/index.html'))

//manejamos rutas inexistentes
app.use('/api', notFound)
app.use(errorHandler)

//exportamos este módulo
module.exports = app