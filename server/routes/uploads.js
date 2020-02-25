const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path  = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function (req, res) {
let tipo = req.params.tipo;
let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    //Validar  tipos
    let tiposValidos = ['productos','usuarios'];

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Las tipos permitidos son '+ tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension  = nombreArchivo[nombreArchivo.length -1];

    // Extensiones permitidas
    let  extensionesValidas = ['png','gif','jpg','jpeg'];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Las extensiones permitidas son '+ extensionesValidas.join(', ')
            }
        });
    }

    let nombreArchivon = `${ id }-${ new Date().getMilliseconds()  }.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivon}`, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(tipo ==="usuarios"){
       imagenUsuario(id,res,nombreArchivon);
        }else{
        imagenProducto(id,res,nombreArchivon);
        }
    });
    console.log(req.files.foo); // the uploaded file object
});


function  imagenUsuario(id,res,nombreArchivo){

    Usuario.findById(id, (err,usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo,'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioDB){
            borraArchivo(nombreArchivo,'usuarios');

            return res.status(500).json({
                ok: false,
                err:{
                   message: 'Usuario no existe'    

                }
            });
        }
        
        borraArchivo(usuarioDB.img,'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err,usuarioGuardado)=> {
                // if(err){
                //     return err;
                // }
            
                res.json({
                ok:true,
                respuestona: "cacas",
                usuario:usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}
 function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id, (err,productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo,'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            borraArchivo(nombreArchivo,'productos');

            return res.status(500).json({
                ok: false,
                err:{
                   message: 'Producto no existe'    

                }
            });
        }
        
        borraArchivo(productoDB.img,'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err,productoGuardado)=> {
                // if(err){
                //     return err;
                // }
            
                res.json({
                ok:true,                
                producto:productoGuardado,
                img: nombreArchivo
            });
        });
    });
 }

 function borraArchivo(nombreImagen,tipo){
    let pathImagen  = path.resolve(__dirname,`../../uploads/${tipo}/${ nombreImagen}`);

        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }

 }

module.exports = app;