const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuariosGet = async(req = request, res = response)=>{

    // const {q, nombre = 'no name', apikey} = req.query;
    const {limite = 5, desde = 0 } = req.query;
    query = { estado : true}
    /*    const usuarios = await Usuario.find( query)
            .limit(Number(limite))
            .skip(Number(desde));

    const total = await Usuario.countDocuments(query);*/

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find( query)
            .limit(Number(limite))
            .skip(Number(desde))
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response)=>{

   

    const {nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol } );

    //verificar que el correo existe
    /*const emailExiste = await Usuario.findOne({correo});
    if(emailExiste) {
        return res.status(400).json({
            msg:'ese correo ya esta registrado'
        });
    }*/
    //Encriptar pass
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //guardar base de datos
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response)=>{
    const {id} = req.params;

    const { _id, password,   ...resto } = req.body

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosDelete = async(req, res = response)=>{
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado : false})
    const usuAutenticado = req.uid; 

    res.json( {usuario, usuAutenticado});
}

const usuariosPatch = (req, res = response)=>{
    res.json({
        "msg" : "patch API -controlador "
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}