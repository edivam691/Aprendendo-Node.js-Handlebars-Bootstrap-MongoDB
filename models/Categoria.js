const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categoria = new schema({
    nome:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('categorias',categoria);