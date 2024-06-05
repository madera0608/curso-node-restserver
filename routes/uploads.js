const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validaArchivos } = require('../middlewares/validar-campos');
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const router = Router();

router.post('/', validaArchivos ,cargarArchivo);

router.put('/:coleccion/:id',[
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validaArchivos,
    validarCampos
], actualizarImagenCloudinary);


router.get('/:coleccion/:id',[
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
], mostrarImagen);

module.exports = router;