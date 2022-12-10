const {Schema, model} = require('mongoose');

const SchemaCategory = new Schema({

    name: String

},{
    timestamps: true,
    strict: false
});

module.exports = model('Category', SchemaCategory);