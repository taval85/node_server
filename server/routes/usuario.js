const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificaToken,verificaAdminRole} = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificaToken, function (req, res) {
    let desde = req.query.desde || 0
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado:true},'nombre email role estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({estado:true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });

        });
});

app.put('/usuario/:id',[verificaToken,verificaAdminRole], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado0']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
})

app.post('/usuario',[verificaToken, verificaAdminRole], function (req, res) {
    let body = req.body;


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

})


// app.get('/', function (req, res) {
//     res.json('Hello World');
// });


app.post('/usuario', function (req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json({
            body
        });
    }
});

app.delete('/usuario/:id',[verificaToken,verificaAdminRole], function (req, res) {
    let id = req.params.id;
   // Usuario.findByIdAndRemove(id,(err,usuarioBorrado) =>{

   let cambiaEstado = {
       estado: false
   }
   Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true},(err,usuarioBorrado) =>{
    if (err) {
        res.status(400).json({
            ok: false,
            err
        });
    }
    if(!usuarioBorrado){
        return  res.status(400).json({
            ok: false,
            err:{
                message: 'usuario no encontrado'
            }
        });
    }

    res.json({
        ok:true,
        usuario:usuarioBorrado
    });

   });

});

module.exports = app;