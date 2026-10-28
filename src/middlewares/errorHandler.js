//gestor manejo de errores
exports.notFound = (req, res) => {
  res.status(404).json({ message: 'ruta no encontrada' })
}

exports.errorHandler = (err, req, res, next) => {

  //si existe un error... detenemos y retornamos un mensaje en formato JSON
  if (err.status) { return res.status(err.status).json({ message: err.message }) }

  //mismo valor, mismo tipo ===
  //error de duplicidad
  if (err.code === 'ER_DUP_ENTRY'){
    //nombre_usuario, email
    return res.status(409).json({ message: 'ya existe un registro con ese valor' })
  }

  //error de dependencia foránea
  if (err.code === 'ER_ROW_IS_REFERENCED_2'){
    return res.status(409).json({ message: 'no se puede eliminar, registro en uso' })
  }

  //error de ID que no existe
  //ejemplo: personas (id = 1,2,3), usuarios(idpersona = 5)
  if (err.code === 'ER_NO_REFERENCED_ROW_2'){
    return res.status(400).json({ message: 'no existe el registro indicado' })
  }

  //test (desarrollo)
  console.error(err)

  //error general de falla en la app | opcional
  //res => result
  res.status(500).json({ message: 'error interno del servidor' })
}