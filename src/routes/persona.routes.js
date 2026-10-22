const router = require('express').Router()
const c = require('../controllers/persona.controller')

//RECUERDA:
//las rutas requieren las funcionalidades en los controladores

router.get('/')
router.get('/:id')
router.post('/')
router.put('/:id')
router.delete('/:id')

module.exports = router