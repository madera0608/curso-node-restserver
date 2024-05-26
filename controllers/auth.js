const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ){
            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - correo'
            })
        }

       
        //si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - estado false'
            })
        }

        //verificar contrasena
        const validarPassword = bcryptjs.compareSync( password, usuario.password );

        if( !validarPassword ){
            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - password'
            })
        }


        //generar jwt
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hable con el administrador'
        })
    }


}

const googleSing = async( req, res = response ) => {
    const { id_token } = req.body;

    /***Leer token */

    try {
        const { nombre, img, correo } = await googleVerify( id_token ) 

        let usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            const data = {
                nombre,
                correo,
                password:':p',
                img,
                google:true,
                rol:'USER_ROLE'
            };

            usuario = new Usuario( data );
            await usuario.save()
        }

        // si el usuario en bd esta eliminado
        if( !usuario.estado ){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }

        //generar jwt
        const token = await generarJWT(usuario.id);

        res.json({
           usuario,
           token
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok:false,
            msg:'El token no se pudo verifficar'
        })
    }

    
}

module.exports = {
    login,
    googleSing
}