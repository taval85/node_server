const express = require('express');


const { verificaToken } = require('../middlewares/autenticacion');


let app = express();
let Producto = require('../models/producto');

//=======================================
//Buscar productos
//======================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    
    let regex = new RegExp(termino,'i')

    Producto.find({nombre: regex})   
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
               return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                productos
            });

        });
});


//=======================================
//Obtener productos
//======================================
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                productos
            });

        });
});
//=======================================
//Obtener producto por ID
//======================================
app.get('/productos/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                req.status(400).json({
                    ok: false,
                    err: {
                        message: "El producto no existe"
                    }
                });
            }

            res.status(201).json({
                ok: true,
                productoDB
            });

        });

});

//=======================================
//Crear productos
//======================================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            productoDB
        });

    });

});

//=======================================
//Actualizar productos
//======================================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            req.status(400).json({
                ok: false,
                err: {
                    message: "El producto no existe"
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.categoria = body.categoria;
        productoDB.precioUni = body.precioUni;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });

});



//=======================================
//Borrar productos
//======================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;



    Producto.findById(id)
        .populate('usuario', 'email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return req.status(400).json({
                    ok: false,
                    err: {
                        message: "El producto no existe"
                    }
                });
            }
            productoDB.disponible = false;
            productoDB.save((err, productoBorrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.status(201).json({
                    ok: true,
                    productoBorrado,
                    message: "producto marcado como NO disponible"
                });

            });


        });

});

module.exports = app;