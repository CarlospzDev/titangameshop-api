const express = require('express')
const Router = express.Router()

const {CartController}= require('./controller')

Router.get('/get-cart/:id', CartController.getCart)
Router.post('/add-game', CartController.add)
Router.post('/delete-game', CartController.delete)
Router.post('/purchase', CartController.purchase)

module.exports = Router