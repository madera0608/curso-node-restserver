const { response, query } = require("express");
const { Categoria } = require('../models')

// obtener categorias - paginado - total - populate
const obtenerCategorias = async(req, res = response) =>{

    const {limite = 10, desde = 0 } = req.query;
    const query = { estado: true} 

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find( query )
            .populate('usuario','nombre')
            .limit(Number(limite))
            .skip(Number(desde))
    ])

    res.json({
        total, categorias
    });

}

// obtener categoria - populate {}
const obtenerCategoriaById = async(req, res = response) =>{
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json(categoria)

}

const crearCategorias = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne( { nombre });
    
    if( categoriaDB ){
        return res.status(400).json({
            msg : `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria nombre

const actualizarCategoria = async(req, res = response) => {
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const data = {
        nombre,
        usuario: req.usuario._id
    } 

    const categoria = await Categoria.findByIdAndUpdate(id,data, { new: true });

    res.json(categoria)
}

// borrarCategoria - estado:false

const deleteCategoria =  async(req, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id,{ estado : false },{ new: true });
    const usuAutenticado = req.uid;
    res.json({categoria, usuAutenticado})

}

module.exports = {
    actualizarCategoria,
    crearCategorias,
    deleteCategoria,
    obtenerCategorias,
    obtenerCategoriaById
}