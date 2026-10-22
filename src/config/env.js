//VALIDACIÓN # 01 - parámetros de .env
//validación de variables de configuración
const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET']

//verificamos si una de las claves no existe o está vacía
const missing = required.filter((key) => !process.env[key])

//si no encontré una de las claves...
if (missing.length){
  console.error(`faltan variables de entorno: ${missing.join(',')}`)
    process.exit(1)
}

//VALIDACIÓN # 02 - JWT seguro
//para encriptar la comunicación, JWT 
const secret = process.env.JWT_SECRET

if (secret.length < 32){
  console.error('JSON_SECRET requiere una clave de 32 caracteres')
  process.exit(1)
}