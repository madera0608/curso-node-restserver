

const { response } = require("express");
const fs =  require('fs')
const { subirArchivo } = require("../helpers/subir-archivo");
const {Usuario, Producto} = require("../models");
const path = require('path')
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const cargarArchivo = async(req, res = response) => {

  
    try {
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo(req.files, undefined, 'imgs' );
        res.json({nombre})
    } catch (msg) {
        res.status(400).json({msg})
    }
}


const actualizarImagen = async(req, res = response) => {

  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id)
        if(!modelo){
          return res.status(400).json({
            msg:`no existe el id de usuario ${id}`
          })
        }
      break;
    case 'productos':
        modelo = await Producto.findById(id)
        if(!modelo){
          return res.status(400).json({
            msg:`no existe el id de producto ${id}`
          })
      }
      break;
    default:
      return res.status(500).json({msg : 'se me olvido validar esto'})
  }

  // Limpiar imagenes previas
  if ( modelo.img ){
      // hay q borrar img del servidor
      const pathImagen = path.join(__dirname, '/../uploads', coleccion,modelo.img)
      if( fs.existsSync( pathImagen ) ){
          fs.unlinkSync( pathImagen );
      }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion );

  modelo.img = nombre;
  await modelo.save();

  res.json( modelo )
}

const actualizarImagenCloudinary = async(req, res = response) => {

  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id)
        if(!modelo){
          return res.status(400).json({
            msg:`no existe el id de usuario ${id}`
          })
        }
      break;
    case 'productos':
        modelo = await Producto.findById(id)
        if(!modelo){
          return res.status(400).json({
            msg:`no existe el id de producto ${id}`
          })
      }
      break;
    default:
      return res.status(500).json({msg : 'se me olvido validar esto'})
  }

  // Limpiar imagenes previas
  if ( modelo.img ){
      const nombreArr = modelo.img.split('/');
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split('.');

       cloudinary.uploader.destroy(public_id)
  }

  const { tempFilePath } = req.files.archivo;

  try {
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
      modelo.img = secure_url;
    await modelo.save();

    res.json( modelo )
  } catch (error) {
    res.json( error )
  }
  
}


const mostrarImagen = async(req, res = response) =>{
  const {id, coleccion} = req.params;

  let modelo;

    switch (coleccion) {
      case 'usuarios':
          modelo = await Usuario.findById(id)
          if(!modelo){
            return res.status(400).json({
              msg:`no existe el id de usuario ${id}`
            })
          }
        break;
      case 'productos':
          modelo = await Producto.findById(id)
          if(!modelo){
            return res.status(400).json({
              msg:`no existe el id de producto ${id}`
            })
        }
        break;
      default:
        return res.status(500).json({msg : 'se me olvido validar esto'})
    }

    // Limpiar imagenes previas
    if ( modelo.img ){
        // hay q borrar img del servidor
        const pathImagen = path.join(__dirname, '/../uploads', coleccion,modelo.img)
        if( fs.existsSync( pathImagen ) ){
           return res.sendFile( pathImagen )
        }
    }
   //res.json( {msg: 'falta el place jolder'} )
   const pathPH = path.join(__dirname, '/../assets', 'no-image.jpg')
   return res.sendFile( pathPH )

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}