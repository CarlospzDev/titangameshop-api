const { request, response } = require('express')
const UserModel = require('../User/model');
const CartModel = require('../Cart/model')
const { genHashPassword, comparePassword } = require('../../services/password')

let UserController = {

    sign_up: async (req = request, res = response) => {
        try {

            const { identification, names, surnames, tel, email, password } = req.body

            const UserFound = await UserModel.findOne({
                identification
            })

            if (UserFound) {
                return res.status(200).json({
                    ok: true,
                    msg: 'User Already Exists'
                })
            }

            const hash = genHashPassword(password)

            const NewUser = await UserModel.create({
                identification,
                names,
                surnames,
                tel,
                email,
                password: hash,
                rol: "client"

            })

            await CartModel.create({
                userId: NewUser._id
            })

            return res.status(200).json({
                ok: true,
                msg: 'User Created Successful'
            })


        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred' + error
            })
        }
    },

    sign_in: async(req = request, res = response ) =>  {

        try {

            const { email, password } = req.body

            const UserFound = await UserModel.findOne({email})

            if (!UserFound) {
                return res.status(200).json({
                    ok: false,
                    msg: 'Email or Password Incorrect'
                })
            }

            const isPassword = comparePassword( password, UserFound.password)
           
            if(!isPassword){
                return res.status(200).json({
                    ok: false,
                    msg: 'Email or Password Incorrect'
                })
            }

            return res.status(200).json({
                ok: true,
                msg: `Welcome User ${UserFound.names} ${UserFound.surnames}`,
                UserFound
            })
            
        } catch (error) {
            return res.status(500).json({
                ok: 'error',
                msg: 'An error ocurred' + error
            })
        }

    },

    getUser: async (req = request, res = response) => {
        try {
            
            const {id} = req.params
            const UserFound = await UserModel.findById(id)

            return res.status(200).json({
                ok: true,
                msg: 'User Found',
                UserFound
            })
            
        } catch (error) {
            return res.status(500).json({
                ok: 'error',
                msg: 'An error ocurred' + error
            })
        }
    } 

}

module.exports = { UserController }