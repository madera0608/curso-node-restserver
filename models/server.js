const express = require('express');
const cors = require('cors')

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/usuarios';
        //Middlewares
        this.middlewares();
        // Rutas de aplicacion
        this.routes();
    }

    middlewares(){
        
        this.app.use( cors() )

        //Lectur y pase de body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );
        

    }

    routes(){

        this.app.use(this.usuariosPath, require('../routes/usuarios'))
       
    }

    listen() {
        this.app.listen(  this.port, () => {
            console.log('Servidor corriendo en puero', this.port)
        })
    }
}

module.exports = Server;
