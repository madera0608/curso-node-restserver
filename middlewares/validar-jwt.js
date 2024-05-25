const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const valdiarJWT = async(req = request, res = response, next) => {
    
    const token =  req.header('x-token')
    if( !token ){
        return res.status(401).json({
            msg:'no hay token en la peticion'
        })
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );

        if (!usuario){
            return res.status(401).json({
                msg:'token no valido - usuario no existe en db'
            })
        }

        //verificar si es usuario esta eliminado
        if(!usuario.estado){
            return res.status(401).json({
                msg:'token no valido - usuario con estado false'
            })
        }
        //req.uid = usuario;
        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'token no valido'
        })
    }

}

module.exports = {
    valdiarJWT
}