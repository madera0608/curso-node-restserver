const Role = require('../models/role')
const Usuario = require('../models/usuario')

const esRoleValido =async(rol = '') => {
    const existerRol = await Role.findOne({ rol });
    if (!existerRol){
        throw new Error(`el rol ${ rol } no esta registrado en BD`)
    }
}

const emailExiste = async(correo) => {
    const flagEmail = await Usuario.findOne({correo});
    if (flagEmail){
        throw new Error(`ese correo ya esta registrado ${ correo }`)
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario){
        throw new Error(`el id ${ id } no existe`)
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}