const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role')

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

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria){
        throw new Error(`el id ${ id } de la categoria no existe`)
    }
}

const existeProductoPorId = async(id) => {
    const existeCategoria = await Producto.findById(id);
    if (!existeCategoria){
        throw new Error(`el id ${ id } del producto no existe`)
    }
}

const coleccionesPermitidas = async(coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if( !incluida ){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }
    

    return true;
}
module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}