require("dotenv").config() //.env (texto plano con claves)
require("./config/env") //valida variables antes de iniciar la app

const app = require('./app')
const db = require('./config/db')

const port = process.env.PORT || 3000

//app empresa x
//2 bases de datos (mínimo)
// db production
// db dev
db.raw('select 1')
  .then(() => app.listen(port,
    () => console.log(`servidor iniciado en http://localhost:${port}`)
  ))
  .catch(() => console.error(`no se pudo realizar la conexión: ${e.message}`))