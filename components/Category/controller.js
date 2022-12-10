const { request, response } = require('express')
const CategoryModel = require('./model')
const mongoose = require('mongoose')

const CategoryController = {

    create: async (req = request, res = response) => {

        try {

            let { name } = req.body
            name = name.toUpperCase()

            const category = await CategoryModel.findOne({ name })

            if (category) {
                return res.status(200).json({
                    ok: true,
                    msg: 'This Category Already Exists'
                })
            }

            await CategoryModel.create({ name })

            return res.status(200).json({
                ok: true,
                msg: 'Category Created Successful'
            })

        } catch (error) {

            return res.status(500).json({
                ok: false,
                msg: 'An Error Ocurred: ' + error
            })

        }

    },

    getCategories: async (req = request, res = response) => {

        try {

            const CategoriesFound = await CategoryModel.find()

            if (CategoriesFound == "" ) {

                return res.status(200).json({
                    ok: true,
                    msg: 'Categories Not Found'
                })

            }

            return res.status(200).json({
                ok: true,
                msg: 'Categories Found',
                CategoriesFound
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An Error Ocurred: ' + error
            })
        }

    },

    getCategory: async (req = request, res = response) => {

        try {

            const {id} = req.params
            const CategoryFound = await CategoryModel.findById(id)

            if (CategoryFound == "" ) {

                return res.status(200).json({
                    ok: true,
                    msg: 'Category Not Found'
                })

            }

            return res.status(200).json({
                ok: true,
                msg: 'Category Found',
                CategoryFound
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An Error Ocurred: ' + error
            })
        }

    },

    update: async(req = request, res= response) => {
        
        try {
            
            const { id } = req.params
            let { name } = req.body
            name = name.toUpperCase()
            await CategoryModel.updateOne(
                {
                    _id: mongoose.Types.ObjectId(id)
                },{
                    name
                }
            )

            return res.status(200).json({
                ok: true,
                msg: 'Category Updated Successful'
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An Error Ocurred: ' + error
            })
        }

    }

}

module.exports = { CategoryController }