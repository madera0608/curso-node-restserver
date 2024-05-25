const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
       await mongoose.connect( process.env.MONGODB);

        /*
        , {
            useNewUrlParse:true,
            useUnifiedtopology:true,
            useCreateIndex: true,
            useFindAndModify: false
       }
        */

       console.log('Base de datos online');

    } catch (error) {
        console.log(error)
        throw new Error('Error iniciando base de datos');
    }

}

module.exports = {
    dbConnection
}

