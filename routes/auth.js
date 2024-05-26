const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSing } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo', 'El Correo es obligatorio').isEmail(),
    check('password', 'La contrasena es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google',[
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    validarCampos
], googleSing);


module.exports = router;