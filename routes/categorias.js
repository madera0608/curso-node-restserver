const { Router } = require('express');
const { check } = require('express-validator');
const { valdiarJWT, validarCampos, esAdminRol } = require('../middlewares');

const { 
        actualizarCategoria,
        crearCategorias,
        deleteCategoria, 
        obtenerCategorias, 
        obtenerCategoriaById} = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validators')

const router = Router();

/*
*{{url}}/categorias
*/

// obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// obtener una categoria por id - publico - valdiar id
router.get('/:id', [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],obtenerCategoriaById);

// crear categoria - cualquier persona con token valido
router.post('/', [
    valdiarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategorias);

//actualizaar categoria por id - con token valido
router.put('/:id',[
    valdiarJWT,
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre no debe estar vacio').not().isEmpty(),
    validarCampos
], 
    actualizarCategoria);

// borrar una categoria -admin
router.delete('/:id',[
    valdiarJWT,
    esAdminRol,
    check('id', 'No es un Id valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], 
    deleteCategoria);

module.exports = router;