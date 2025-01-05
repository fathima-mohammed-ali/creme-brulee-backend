const express =require('express')
const login =express.Router()
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel')
const loginModel = require('../models/loginModel')

login.post('/user-login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("body", req.body.username);
        console.log("body", req.body.password);

        if (username && password) {
            const oldUser = await loginModel.findOne({ username }); // Find the user by username
            if (!oldUser) {
                return res.status(400).json({ success: false, error: true, message: "The user does not exist" });
            }

            const isPasswordCorrect = await bcrypt.compare(password, oldUser.password); // Check the password
            if (!isPasswordCorrect) {
                return res.status(400).json({ success: false, error: true, message: "Incorrect Password" });
            }

            if (oldUser.role === "user") {
                // Logic for regular user login
                const userData = await userModel.findOne({ loginID: oldUser._id });
                const token = jwt.sign(
                    {
                        role: oldUser.role,
                        loginid: oldUser._id,
                        userId: userData._id,
                        userEmail: userData.email,
                    },
                    "unknown", // Replace with a secure secret key
                    { expiresIn: "1h" }
                );
                return res.status(200).json({
                    success: true,
                    error: false,
                    token: token,
                    role: oldUser.role,
                    loginid: oldUser._id,
                    userId: userData._id,
                    userEmail: userData.email,
                });
            } else if (oldUser.role === "admin") {
                // Logic for admin login
                const token = jwt.sign(
                    {
                        role: oldUser.role,
                        loginid: oldUser._id,
                        username: oldUser.username,
                    },
                    "unknown", // Replace with a secure secret key
                    { expiresIn: "1h" }
                );
                return res.status(200).json({
                    success: true,
                    error: false,
                    token: token,
                    role: oldUser.role,
                    loginid: oldUser._id,
                    username: oldUser.username,
                });
            } else {
                return res.status(400).json({ success: false, error: true, message: "Role not recognized" });
            }
        } else {
            return res.status(400).json({ success: false, error: true, message: "Username and password are required" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, error: true, message: "An internal error occurred" });
    }
});
module.exports= login