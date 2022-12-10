const {Schema, model} = require('mongoose');

const SchemaGames = new Schema({

    name: String,
    description: String,
    image: String,
    categoryId: Schema.Types.ObjectId,
    price: Number,
    likes: {
        type:Object,
        default: {
            cuantity: 0,
            usersId: []
        }
    }

},{
    timestamps: true,
    strict: false
});

module.exports = model('Games', SchemaGames);