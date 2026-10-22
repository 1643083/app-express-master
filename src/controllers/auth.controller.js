const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const { httpError, requireFields } = require('../utils')

//configuración de cookies
const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'
}

//hash temporal para evaluar la contraseña
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10)

//exports.método = async (petición, respuesta) => {}
exports.login = async (req, res) => {
  //validación
  requireFields(req.body, ['nombre_usuario', 'clave_acceso'])
  //deserialización
  const { nombre_usuario, clave_acceso } = req.body

  //validar el tipo de dato (seguridad XSS)
  if (typeof nombre_usuario !== 'string' || typeof clave_acceso !== 'string'){
    throw httpError(400, 'datos no son correctos')
  }

  //buscamos al usuario con el nombre...
  const user = await db('usuarios').where({ nombre_usuario }).first()
  const valid = await bcrypt.compare(clave_acceso, user ? user.clave_acceso : DUMMY_HASH)

  //si no existe el usuario O si existe pero su estado es falso O si la clave es incorrecta
  if (!user || !user.estado || !valid){
    //401 no autorizado
    throw httpError(401, 'usuario o contraseña incorrectos')
  }

  //si llegaste hasta aquí - WELCOME
  //habilitamos un permiso jwt
  const token = jwt.sign({
    id: user.id,
    nombre_usuario: user.nombre_usuario,
    nivel_acceso: user.nivel_acceso
  }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  })

res.cookie('token', token, cookieOpts.json({ message: 'bienvenido' }))

}