

//===========================
//Puerto
//============================
process.env.PORT = process.env.PORT || 3000;


//===========================
//Entorno
//============================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===========================
//Base de datos
//============================

let urlDB;

// if(process.env.NODE_ENV === 'dev'){
// urlDB = 'mongodb://localhost:27017/cafe';

// }else{
  urlDB = 'mongodb+srv://taval:Mt8KnGRuhH4fxN3d@cluster0-n542o.mongodb.net/test';
//}


process.env.urlDB = urlDB;