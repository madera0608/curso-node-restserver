const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        
        /* Rutas */
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        //Conectar a la base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        // Rutas de aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        
        this.app.use( cors() )

        //Lectur y pase de body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );
        

    }

    routes(){

        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/usuarios'))

    }

    listen() {
        this.app.listen(  this.port, () => {
            console.log('Servidor corriendo en puero', this.port)
        })
    }
}

module.exports = Server;