const jwt = require('jsonwebtoken')
const db = require('../config/db')

//no se exporta porque colabora con verifyToken
//error 1: no autorizado
//error 2: expirado
const unauthorized = (res, msg = 'no autorizado') => {
  res.status(401).json({ message: msg })
}

//token = firma, permiso, dato encriptado
//funciones definidas como asíncronas llevan promesas
exports.verifyToken = async (req, res, next) => {
  //cookies = archivos que guardan la configuración
  //nota: en tu navegador inspeccionar > red
  const token = req.cookies.token

  //si no existe un token, no puedes acceder a la app
  if (!token) { return unauthorized(res, 'no tiene autorización') }

  //existe el token
  //jwt = 3 partes (header, payload, signature)
  let payload

  //manejador de excepciones
  try{
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
  }catch(e){
    return unauthorized(res, 'sesión ya inválidad o expirada')
  }

  //se consulta a la DB para respetar los usuarios que están desactivados
  const user = await db("usuarios").where({ id : payload.id }).select('id', 'nombre_usuario', 'nivel_acceso', 'estado').first()

  if (!user || !user.estado){
    return unauthorized(res, 'usuario inactivo o inexistente')
  }

  req.user = user;
  //siguiente - flujo
  next()
}

exports.requireLevel = (...niveles) => (req, res, next) => {
  niveles.includes(req.user.nivel_acceso) ? next() : res.status(403).json({ message: 'no tienes permiso para esta acción' })
}