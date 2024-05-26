const {Router} = require('express');
const { check } = require('express-validator')
const { valdiarJWT, validarCampos, esAdminRol } = require('../middlewares');
const { registrarProducto, 
        obtenerProductos, 
        obtenerProductoById, 
        actualizarProducto,
        deleteProducto } = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');


const router = Router();

/**
 * {{url}}/productos
 * 
 */

// obtener todas los - publico
router.get('/', obtenerProductos);

// obtener una categoria por id - publico - valdiar id
router.get('/:id', [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],obtenerProductoById);

//registrar producto
router.post('/',[
    valdiarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un Id valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
],registrarProducto) 

//Actualizar producto
router.put('/:id',[
    valdiarJWT,
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], 
    actualizarProducto);

//Eliminar producto
router.delete('/:id',[
    valdiarJWT,
    esAdminRol,
    check('id', 'No es un Id valido').isMongoId(),
    validarCampos,
    check('id').custom( existeProductoPorId ),
    validarCampos
], 
    deleteProducto);

module.exports = router