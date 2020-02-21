const mongoose = require('mongoose');
const  uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema  = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'Descripcion necesaria'],
        unique:true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref:'Usuario'
    }
});


//categoriaSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'});

module.exports = mongoose.model('Categoria',categoriaSchema);