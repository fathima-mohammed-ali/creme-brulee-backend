const express =require('express')
const login =express.Router()
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel')
const loginModel = require('../models/loginModel')

login.post('/user-login',async(req,res)=>{
    try {
    const { username, password } = req.body   
      console.log("body",req.body.username);
      console.log("body",req.body.password);
              if (username && password) {              
                  const oldUser = await loginModel.findOne({ username })  
                  if (!oldUser) return res.status(400).json({ success: false, error: true, message: "the user is not exist" })
                  const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)            
                  if (!isPasswordCorrect) return res.status(400).json({ success: false, error: true, message: "Incorrect Password" }) 
                  if(oldUser.role=="user")
                  {
                     const userData = await userModel.findOne({ loginID: oldUser._id }) 
                     const token= jwt.sign({role:oldUser.role, loginid: oldUser._id, userId:userData._id, userEmail: userData.email},
                        "unknown",{expiresIn:"1h"} )       
                     return res.status(200).json({ success: true, error: false,token:token,role:oldUser.role, loginid: oldUser._id, userId:userData._id, userEmail: userData.email })
                  } 

                }
                
            
            else{
                return res.status(404).json({ success: false, error: true, message: "all fields are required" }) // after checking through yhe table login model if the email entered not found it will a show a error.
    
            }
      
            }
                catch (error) {
                   return res.status(400).json({
                      success: true,
                      error: false,
                      message: "something went wrong"
                  })
               }
})
module.exports= login