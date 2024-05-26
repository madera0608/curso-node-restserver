const { response, query } = require("express");
const { Producto } = require('../models')




const obtenerProductos = async(req, res = response) =>{

    const {limite = 10, desde = 0 } = req.query;
    const query = { estado: true} 

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find( query )
            .populate('usuario','nombre')
            .populate('categoria','nombre')
            .limit(Number(limite))
            .skip(Number(desde))
    ])

    res.json({
        total, productos
    });

}

// obtener categoria - populate {}
const obtenerProductoById = async(req, res = response) =>{
    const {id} = req.params;

    const producto = await Producto.findById(id)
                    .populate('usuario', 'nombre')
                    .populate('categoria','nombre')

    res.json(producto)

}

const registrarProducto = async(req, res = response) =>{
    
    const { estado, usuario, ...body} = req.body;

  

    const productoDB = await Producto.findOne({ nombre:body.nombre.toUpperCase()  });
    
    if(productoDB){
        return res.status(400).json({
            msg : `El Producto ${productoDB.nombre}, ya existe`
        })        
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto)

}

const actualizarProducto = async(req, res = response) => {
    const {id} = req.params;
    const { estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase()
    }

    data.usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate(id,data, { new: true });

    res.json(producto)
}

const deleteProducto =  async(req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id,{ estado : false },{ new: true });
    const usuAutenticado = req.uid;
    res.json({producto, usuAutenticado})

}

module.exports = {
    actualizarProducto,
    deleteProducto,
    registrarProducto,
    obtenerProductos,
    obtenerProductoById
}