const express = require('express')
const register = express.Router()
var bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const loginModel = require('../models/loginModel');
const checkAuth = require('../middleware/checkAuth');

register.post('/user', async (req, res) => {
    try {
        // Check if the username already exists
        console.log(req.body);
        const oldUser = await loginModel.findOne({ username: req.body.username });
        console.log(oldUser);
        
        
        if (oldUser) {
            return res.status(409).json({
                success: false,
                error: true,
                message: "Username already exists"
            });
        }
           
        // Check if the email already exists
        const oldEmail = await userModel.findOne({ email: req.body.email });
        console.log(oldEmail);
        
        if (oldEmail) {
            return res.status(409).json({
                success: false,
                error: true,
                message: "Email already exists"
            });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        // Check if the role should be 'admin' or 'user' from the request body (optional)
        // If no role is specified, default to 'user'
        let role = req.body.role || 'user';

        // If you want to enforce only admins being able to create admin users:
        if (role === 'admin' && req.userData.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: true,
                message: "Only admins can create other admins"
            });
        }

        // Create login details for the user
        const login_user = {
            username: req.body.username,
            password: hashedPassword,
            role: role // Save the dynamically assigned role
        };

        // Save the login details in the login collection
        const login = await loginModel(login_user).save();

        if (login) {
            // Create user details, linked with the login information
            const userdetails = {
                loginID: login._id,
                email: req.body.email,
            };

            const usersave = await userModel(userdetails).save();

            if (usersave) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    message: "Registration completed successfully"
                });
            }
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        });
    }
});
module.exports= register
