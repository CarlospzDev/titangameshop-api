const {Schema, model} = require('mongoose');

const SchemaUser = new Schema({

    identification: {
        type: Number,
        unique: true
    },
    names: String,
    surnames: String,
    tel: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    rol: String,
    gamesId: {
        type: Array,
        default: []
    }

},{
    timestamps: true,
    strict: false
});

module.exports = model('Users', SchemaUser);