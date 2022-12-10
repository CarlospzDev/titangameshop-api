const { request, response } = require('express');
const GameModel = require('../Game/model')
const UserModel = require('../User/model')
const CategoryModel = require('../Category/model')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

let GameController = {

    create: async (req = request, res = response) => {
        const file = req.file.filename
        try {
            
            const { name, description, categoryId, price } = req.body

            const categories = await CategoryModel.find()

            if (categories == '') {

                const filePath = path.join(__dirname, '../../uploads/games_img/' + file)
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            msg: 'An error ocurred' + err
                        })
                    }
                })

                return res.status(200).json({
                    ok: true,
                    msg: "Couldn't Create Games Without Category"
                })
            }

            await GameModel.create({
                name,
                description,
                image: file,
                categoryId,
                price
            })

            return res.status(200).json({
                ok: true,
                msg: 'Game Created Successful'
            })


        } catch (error) {

            const filePath = path.join(__dirname, '../../uploads/games_img/' + file)
            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'An error ocurred' + err
                    })
                }
            })
            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred ' + error
            })

        }
    },

    getGameImage: async (req = request, res = response) => {
        try {

            const { id } = req.params

            const GameImage = await GameModel.findById(id)

            const filePath = path.join(__dirname, '../../uploads/games_img/' + GameImage.image)

            return res.status(200).sendFile(filePath)


        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred ' + error
            })
        }
    },

    getGame:async (req=request, res=response)=>{
        try {
            const {id} = req.params
            const game = await GameModel.aggregate([
                {$match:{_id:mongoose.Types.ObjectId(id)}},
                {
                    $lookup:{
                        from:'categories',
                        as:'categoryId',
                        foreignField:'_id',
                        localField:'categoryId'
                    }
                },{$unwind:{path:'$categoryId'}}
            ])
            return res.status(200).json({
                ok: true,
                msg:'Game Found',
                game
            })
        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg:'An error ocurred' + error,
            })
        }
    },

    getAll: async (req = request, res = response) => {
        try {

            const GamesFound = await GameModel.aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        as: 'categoryId',
                        foreignField: '_id',
                        localField: 'categoryId'
                    }
                }, { $unwind: { path: '$categoryId' } }
            ])

            if (GamesFound == "") {
                return res.status(200).json({
                    ok: true,
                    msg: 'Games Not Found'
                })
            }

            return res.status(200).json({
                ok: true,
                msg: 'Games Found',
                GamesFound
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred' + error
            })
        }
    },

    getUserGames: async (req = request, res = response) => {
        try {
            const { id } = req.params
            const GamesFound = await UserModel.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'games',
                        as: 'gamesId',
                        foreignField: '_id',
                        localField: 'gamesId',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'categories',
                                    as: 'categoryId',
                                    foreignField: '_id',
                                    localField: 'categoryId'
                                }
                            }, { $unwind: { path: '$categoryId' } }
                        ]
                    }
                }, { $unwind: { path: "$gamesId" } }
            ])

            return res.status(200).json({
                ok: true,
                msg: 'User Games Found',
                GamesFound
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred' + error
            })
        }
    },

    update: async (req = request, res = response) => {
        const file = req.file.filename
        try {

            const { id } = req.params
            const { name, description, categoryId, price } = req.body
            

            const game = await GameModel.findById(id)

            filePath = path.join(__dirname, '../../uploads/games_img/' + game.image)

            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'An error ocurred' + err
                    })
                }
            })

            await GameModel.updateOne(
                { _id: mongoose.Types.ObjectId(id) },
                {
                    name,
                    description,
                    image: file,
                    categoryId,
                    price
                }
            )

            return res.status(200).json({
                ok: true,
                msg: 'Game Updated Successful'
            })

        } catch (error) {

            const filePath = path.join(__dirname, '../../uploads/games_img/' + file)
            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'An error ocurred' + err
                    })
                }
            })

            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred' + error
            })
        }
    },

    delete: async (req = request, res = response) => {
        try {

            const { id } = req.params
            const game = await GameModel.findById(id)

            const filePath = path.join(__dirname, '../../uploads/games_img/' + game.image)

            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'An error ocurred' + err
                    })
                }
            })

            await GameModel.deleteOne({ _id: id })

            return res.status(200).json({
                ok: true,
                msg: 'Game Deleted Successful'
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred' + error
            })
        }
    },

    likes: async (req = request,res= response ) => {
        try {

            const { gameId, userId } = req.body 

            const game = await GameModel.findById(gameId)

            if(game.likes.usersId.includes(userId)){
                await GameModel.updateOne({_id: mongoose.Types.ObjectId(gameId)},{
                    $inc: {"likes.cuantity":-1},
                    $pull: {"likes.usersId": userId}
                })
                return res.status(200).json({
                    ok: true,
                    msg: 'like deleted'
                })
            }

            await GameModel.updateOne({_id: mongoose.Types.ObjectId(gameId)},{
                $inc: {"likes.cuantity":1},
                $push: {"likes.usersId": userId}
            })

            return res.status(200).json({
                ok: true,
                msg: 'like added'
            })
            

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred' + error
            })
        }
    }

}

module.exports = { GameController } 