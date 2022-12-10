const express = require('express')
const Router = express.Router()

const {UserController}= require('./controller')

Router.post('/sign-up', UserController.sign_up)
Router.post('/sign-in', UserController.sign_in)
Router.get('/get-user/:id', UserController.getUser)

module.exports = Router