const {Schema, model} = require('mongoose');

const SchemaCart = new Schema({

    userId: Schema.Types.ObjectId,
    gamesId: {
        type: Array,
        default: []
    }
},{
    timestamps: true,
    strict: false
});

module.exports = model('Cart', SchemaCart);