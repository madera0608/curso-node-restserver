const {response} = require('express')


const esAdminRol = (req, res = response, next) => {
    if(!req.usuario){
        return res.status(500).json(
            {
                msg : "se quiere ejecutar el role sin validar el token primero"
            }
        );
    }

    const {rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg : `${ nombre } no es administrador - no posee permiso`
        });
    }

    next();
}

const tieneRole = ( ...roles ) =>{

    return (req, res = response, next) => {
        
        if(!req.usuario){
            return res.status(500).json(
                {
                    msg : "se quiere ejecutar el role sin validar el token primero"
                }
            );
        }

        if(!roles.includes( req.usuario.rol)){
            return res.status(401).json({
                msg : `El servicio requiere uno de estos role ${ roles }`
            });
        }

        next()
    }

}
module.exports = {
    esAdminRol,
    tieneRole
}