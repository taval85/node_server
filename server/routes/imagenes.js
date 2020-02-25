const  express = require('express');
const fs = require('fs');
const path = require('path');

const {verificaTokenImg} = require('../middlewares/autenticacion');

let app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req,res)=>{
    let tipo = req.params.tipo;
    let img = req.params.img;


let noImgPath = path.resolve(__dirname,'../assets/image-not-found.png');

let pathImagen  = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
console.log("valor imagen: "+img);

if(fs.existsSync(pathImagen)){
    res.sendFile(pathImagen);
}else{
    res.sendFile(noImgPath);
}

});

module.exports = app;