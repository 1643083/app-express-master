const db = require('../config/db')
const { httpError, requireFields, isEmail } = require('../utils')

//lista de campos obligatorios
//omitir campos que pueden ser null
const camposRequeridos = ['apellidos', 'nombres', 'telefono', 'email', 'direccion']

//evaluamos que el contenido de cada campo sea tipo cadena
// 1. arreglo > 2. filter > 3. map > 4. operador ternario
//filter()  : retorna un arreglo que cumpla una condición
//map()     : recorre toda la estructura / objeto
const pick = (body) => {
  Object.fromEntries(
    camposRequeridos.filter((key) => key in body).map(
      (key) => [key,  typeof body[key] === 'string' ? body[key].trim() : body[key]]
    )
  )
}

exports.list = async (req, res) => {
  res.json(
    await db("personas")
    .select("id", ...camposRequeridos)
    .orderBy("apellidos")
  )
}

exports.get = async (req, res) => {
  const row = await db("personas").where({ id: req.params.id }).first()
  if (!row) throw httpError(404, 'persona no encontrada')
  res.json(row)
}

exports.create = async (req, res) => {

  //campos obligatorios
  requireFields(req.body, ["apellidos", "nombres", "email"])

  //nota: solo es posible validar el email si es obligatorio
  if (!isEmail(req.body.email)){
    throw httpError(400, "email incorrecto")
  }

  //insertar (validando que solo envíes cadenas (string))
  const [id] = await db("personas").insert(pick(req.body))

  //server code 201 - save ok
  res.status(201).json({ id, message: 'persona registrada' })
}

//actualizar
exports.update = async (req, res) => {
  requireFields(req.body, ["apellidos", "nombres", "email"])
  if (!isEmail(req.body.email)){
    throw httpError(400, "email incorrecto")
  }
  
  //actualizando
  const num = await db("personas")
  .where({ id: req.params.id })
  .update(pick(req.body))

  if (!num) throw httpError(404, "persona no encontrada")

  res.json({ message: "persona actualizada" })
}

//eliminar
exports.remove = async (req, res) => {
  const num = await db("personas")
  .where({ id: req.params.id })
  .del()

  if (!num) throw httpError(404, "persona no encontrada")

  
  res.json({ message: "persona eliminada" })
}