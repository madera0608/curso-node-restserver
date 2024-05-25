const validarCampos = require('../middlewares/validar-campos');
const valdiarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validarCampos,
    ...valdiarJWT,
    ...validaRoles
}