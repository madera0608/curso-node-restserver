
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos,
        valdiarJWT, 
        esAdminRol, 
        tieneRole } = require('../middlewares');

const { esRoleValido, emailExiste,existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, usuariosPut, usuariosPatch, usuariosDelete, usuariosPost } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    validarCampos
]
,usuariosPut);

router.post('/',
[
    check('nombre', 'El nombre no debe estar vacio').not().isEmpty(),
    check('password', 'El password debe ser mayor de 6 letras').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    //check('rol', 'no es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('correo').custom( emailExiste ),
    check('rol').custom( esRoleValido ),
    validarCampos
],
    usuariosPost);

router.delete('/:id', [
    valdiarJWT,
    //esAdminRol,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;