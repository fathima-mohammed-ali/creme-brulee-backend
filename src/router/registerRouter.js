const express = require('express')
const register = express.Router()
var bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const loginModel = require('../models/loginModel');
const checkAuth = require('../middleware/checkAuth');

register.post('/user',async(req,res)=>{
    try {
        const oldUser = await loginModel.findOne({ username: req.body.username })
        if (oldUser) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Username already exist"
            })
        }
        const oldEmail = await userModel.findOne({ email: req.body.email })
        if (oldEmail) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Email already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        const login_user = {
            username: req.body.username,
            password: hashedPassword,
            role: "user"
        }
        const login = await loginModel(login_user).save()


        if (login) {
            const userdetails = {
                loginID: login._id,
                email: req.body.email,

            }

            const usersave = await userModel(userdetails).save()

            if (usersave) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    message: "registeration Completed"
                })
            }

        }

    } catch (error) {
        return res.status(400).json({
            success: true,
            error: false,
            message: "something went wrong"
        })
    }

})
module.exports= register
