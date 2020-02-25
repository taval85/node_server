
const jwt = require('jsonwebtoken');
//==============================
//Verificar token
//==============================

let verificaToken = (req, res, next) => {
    let token = req.get('token');


    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
                firma: process.env.SEED
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
    //   req.json({
    //       token: token
    //   });

};



//==============================
//Verificar token imagen
//==============================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
                firma: process.env.SEED
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
}
//==================
//Verifica admin role
//====================
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {


        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}