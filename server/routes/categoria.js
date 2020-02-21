const express = require('express')

let { verificaToken,verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//Mostar categorias
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            req.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            req.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//Mostar categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    console.log(id);
    Categoria.findById(id,(err,categoriaDB)=>{
        if (err) {
            req.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            req.status(400).json({
                ok: false,
                err:{
                    message: "El Id no es correcto"
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
   
});


//Mostrar categorias
 app.get('/categoria', verificaToken,(req, res) => {

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err,categorias)=> {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }    
        

        res.json({
            ok: true,
            categorias
        });
    });
 });

// Actualizar  categoria
app.put('/categoria/:id',verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id,descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            req.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })
});

//Eliminar  categoria
app.delete('/categoria/:id',[verificaToken,verificaAdminRole], (req, res) => {

    let id = req.params.id;

Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{


    if (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }

    if (!categoriaDB) {
        req.status(400).json({
            ok: false,
            err:{
                message: "El ID no existe"
            }
        });
    }

    res.json({
        ok: true,
        message: "Categoria Borrada"
    });

});

});

module.exports = app;