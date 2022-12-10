const { request, response } = require('express')
const CartModel = require('./model')
const UserModel = require('../User/model')
const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const CartController = {

    getCart: async (req = request, res = response) => {

        try {

            const { id } = req.params

            const cart = await CartModel.aggregate([
                {
                    $match: { userId: mongoose.Types.ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "games",
                        as: "gamesId",
                        foreignField: "_id",
                        localField: "gamesId",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "categories",
                                    as: "categoryId",
                                    foreignField: "_id",
                                    localField: "categoryId"
                                }
                            }, { $unwind: { path: "$categoryId" } }
                        ]
                    }
                }
            ])

            let totalPrice = 0

            if (cart[0].gamesId == "") {
                totalPrice = 0
            }
            else {
                cart[0].gamesId.map(item => {
                    totalPrice += item.price
                })
            }

            return res.status(200).json({
                ok: true,
                msg: 'Cart Found',
                cart,
                totalPrice
            })


        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An Error Ocurred: ' + error
            })

        }

    },


    add: async (req = request, res = response) => {
        try {

            const { userId, gameId } = req.body

            const gamesFound = await CartModel.findOne({ userId })

            if (gamesFound.gamesId != '') {
                let gameInUserGames = gamesFound.gamesId.includes(gameId)
                if (gameInUserGames) {
                    return res.status(200).json({
                        ok: true,
                        msg: 'Game Already in Cart'
                    })
                }
            }

            await CartModel.updateOne({
                userId
            },
                {
                    $push: {
                        gamesId: mongoose.Types.ObjectId(gameId)
                    }
                })

            return res.status(200).json({
                ok: true,
                msg: 'Game added to cart'
            })


        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An Error Ocurred: ' + error
            })

        }
    },

    delete: async (req = request, res = response) => {

        try {

            const { gameId, userId } = req.body

            await CartModel.updateOne({ userId }, {
                $pull: {
                    gamesId: mongoose.Types.ObjectId(gameId)
                }
            })

            return res.status(200).json({
                ok: true,
                msg: 'Game deleted Successful',
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An Error Ocurred: ' + error
            })
        }

    },

    purchase: async (req = request, res = response) => {
        try {
            const {
                userId,
                name,
                email,
                exp_month,
                exp_year,
                card_number,
                cvc
            } = req.body


            const cartGames = await CartModel.aggregate([
                {
                    $match: { userId: mongoose.Types.ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: "games",
                        as: "gamesId",
                        foreignField: "_id",
                        localField: "gamesId",
                    }
                }
            ]) 

            let totalPrice = 0
            let gamesId = []
            cartGames[0].gamesId.map(item => {
                totalPrice += item.price
                gamesId.push(item._id)
            })

            totalPrice = totalPrice.toString() + '00'

            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    exp_month,
                    exp_year,
                    number: card_number,
                    cvc
                }
            })

            
            
            const customer = await stripe.customers.create({
                email,
                name,
                payment_method: paymentMethod.id
            })

            

            await stripe.paymentIntents.create({
                amount: totalPrice,
                currency: 'cop',
                customer: customer.id,
                description: 'Compra de productos digitales',
                payment_method: paymentMethod.id,
                confirm: true
            })        

            await UserModel.updateOne({
                _id: mongoose.Types.ObjectId(userId)
            }, {
                $push: {
                    gamesId: { $each: gamesId }
                }
            })

            await CartModel.updateOne({
                userId: mongoose.Types.ObjectId(userId)
            },
                {
                    $set: {
                        gamesId: []
                    }
                })

            return res.status(200).json({
                ok: true,
                msg: 'Successful purchase'                
            })
            

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An Error Ocurred: ' + error
            })
        }
    }

}

module.exports = {
    CartController
}