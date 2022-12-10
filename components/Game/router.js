const express = require('express')
const Router = express.Router()
const path = require('path')
const crypto = require('crypto')
const {GameController}= require('./controller')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/games_img')
    },
    filename: function (req, file, cb){
        const uniqueSuffix = crypto.randomBytes(18).toString('hex')
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({storage})


Router.post('/create', upload.single('file0') ,GameController.create)
Router.post('/add-like', GameController.likes)
Router.get('/get-game-image/:id', GameController.getGameImage)
Router.get('/get-game/:id', GameController.getGame)
Router.get('/getall', GameController.getAll)
Router.get('/get-user-games/:id', GameController.getUserGames)
Router.put('/update/:id', upload.single('file0'), GameController.update)
Router.delete('/delete/:id', GameController.delete)


module.exports = Router