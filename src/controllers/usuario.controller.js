//usuario = accede al app
const bcrypt = require("bcryptjs")
const db = require("../config/db")
const { httpError, requireFields, checkCredentials } = require("../utils")

//perfiles o roles de usuario
const NIVELES = ["ADMIN", "USUARIO"]

//consulta base
const baseQuery = () => {
  db("usuarios as u")
  .join("personas as p", "p.id", "u.idpersona")
  .select(
    "u.id",
    "u.idpersona",
    "u.nombre_usuario",
    "u.nivel_acceso",
    "u.estado",
    "p.apellidos",
    "p.nombres"
  )
}

//verificar nivel (asegurar que solo sea un perfil de la lista)
const checkNivel = (nivel) => {
  //si la variable no está definida y si no encontré el nivel en el arreglo
  if (nivel !== undefined && !NIVELES.includes(nivel)){
    throw httpError(400, `nivel de acceso incorrecto`)
  }
}

//listar
exports.list = async (req, res) => {
  res.json(await baseQuery().orderBy("u.id"))
}

//buscar
exports.get = async (req, res) => {
  const row = await baseQuery().where("ud.id", req.params.id).first()
  if (!row) throw httpError(404, "usuario no existe")
  res.json(row)
}

//registrar
exports.create = async (req, res) => {
  //validación campos obligatorios
  requireFields(req.body, ["idpersona", "nombre_usuario", "clave_acceso"])

  //deserealizar los datos que vienen en body
  const { idpersona, nombre_usuario, clave_acceso, nivel_acceso, estado } = req.body

  //verificar que el nivel sea correcto
  checkNivel(nivel_acceso)

  //verificar credencial (permiso)
  checkCredentials(req.body, { claveObligatoria: true })

  //creamos al usuario
  const [id] = await db("usuarios").insert({
    idpersona,
    nombre_usuario,
    nivel_acceso,
    estado,
    clave_acceso: await bcrypt.hash(clave_acceso, 10)
  })

  res.status(201).json({ id, message: 'usuario creado' })
}

//actualizar
exports.update = async (req, res) => {}

//nota: verifique las políticas de seguridad y reglas de negocio
//eliminar
exports.remover = async (req, res) => {
  //¿es posible eliminar tu propio usuario?
  // SI - NO [X]
  if (Number(req.params.id) === req.user.id){
    throw httpError(400, "no puedes eliminar tu propio usuario")
  }

  const num = await db("usuarios")
  .where({ id: req.params.id })
  .del()

  if (!num) throw httpError(404, "usuario no existe")
  res.json({ message: 'usuario eliminado'})
}

