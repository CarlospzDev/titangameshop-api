const express = require('express')
const Router = express.Router()
const {CategoryController}= require('./controller')


Router.post('/create', CategoryController.create)
Router.get('/getall', CategoryController.getCategories)
Router.get('/get-category/:id', CategoryController.getCategory)
Router.put('/update/:id', CategoryController.update)
/*Router.delete('/delete/:id', GameController.delete)
 */
module.exports = Router