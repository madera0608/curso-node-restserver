const { validationResult } = require('express-validator');


const validarCampos = ( req, res, next ) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    next();
}

const validaArchivos = (req, res, next ) => { 

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg:"no hay archivos en la peticion - validacion"});
        return;
      }
      next();
}

module.exports = {
    validarCampos,
    validaArchivos
}