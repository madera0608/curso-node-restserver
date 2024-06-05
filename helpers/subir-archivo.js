const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {
    
    return new Promise( (resolve, reject ) =>{
        
        const {archivo} = files;
        const nombreCortado = archivo.name.split('.')
        const extencion = nombreCortado[ nombreCortado.length -1 ];
        //Validar la extencion
        if( !extencionesValidas.includes( extencion )){
          return reject(`la extencion ${extencion} no esta permitida, - ${ extencionesValidas}`);
        }
      
        const nombreTemp = uuidv4() +'.'+extencion;
        const uploadPath = path.join( __dirname + '/../uploads/', carpeta, nombreTemp);
      
        archivo.mv(uploadPath, (err) => {
          if (err) {
            reject( err );
          }
      
          resolve( nombreTemp );
        });
    
    });
}


module.exports = {
    subirArchivo
}